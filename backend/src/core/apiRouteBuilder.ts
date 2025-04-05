import express from "express";
import z from 'zod';
import * as authentication from "./authentication";
import { DB } from "./database";
import { BadRequest, RestError } from "./errors";
import { UserObject } from "./service/UserService";

export function registerRoute<R>(
  router: express.Router,
  db: DB,
  params: {
    method: 'GET' | 'POST' | 'DELETE'
    path: string,
    scope?: string | string[],
    requestHandler: (ctx: ApiRouteContext) => Promise<R>,
  },
) {
  const middlewares = createMiddlewareStack<R>(params.method, params.scope, db, params.requestHandler);
  switch (params.method) {
    case 'POST': {
      router.post(params.path, ...middlewares);
      break;
    }
    case 'DELETE': {
      router.delete(params.path, ...middlewares);
      break;
    }
    case 'GET': {
      router.get(params.path, ...middlewares);
      break;
    }
  }
}

function createMiddlewareStack<R>(
  method: 'POST' | 'DELETE' | 'GET',
  requiredScope: string | string[] | undefined,
  db: DB,
  handler: (ctx: ApiRouteContext) => Promise<R> | R
): express.RequestHandler[] {
  const middlewares: express.RequestHandler[] = [];

  // authenticate
  if (requiredScope != null) {
    if (typeof requiredScope == 'string' || requiredScope.length > 0) {
      middlewares.push(...authentication.getMiddlewares(requiredScope));
    }
  }

  // request handling
  middlewares.push((req, res, next) => {
    // statusCode = 0でレスポンスが設定されていないことを示す
    res.statusCode = 0;

    // ハンドラ用のパラメータオブジェクト
    let params: any;
    if (method == 'GET' || method == 'DELETE') {
      params = req.query;
    } else if (method == 'POST') {
      params = req.body;
    } else {
      return next(new Error('unsupported http method'));
    }

    // ハンドラ用の認証情報
    let user: UserObject | undefined;
    let scopes: string[] | undefined;
    if (req.authInfo != null) {
      user = req.user as UserObject;
      scopes = (req.authInfo as { scope: string[] }).scope;
    }

    async function asyncHandler() {
      const returnValue = await handler(new ApiRouteContext(params, db, req, res, user, scopes));
      // ハンドラ内でレスポンスが設定されなければレスポンスを生成する。
      if (res.statusCode == 0) {
        if (returnValue != null) {
          res.status(200).json(returnValue);
        } else {
          res.status(204).send();
        }
      }
    }
    asyncHandler().catch(err => {
      next(err);
    });
  });

  return middlewares;
}

export class ApiRouteContext {
  private _user: UserObject | undefined;
  private _scopes: string[] | undefined;
  constructor(
    public params: unknown,
    public db: DB,
    public req: express.Request,
    public res: express.Response,
    user: UserObject | undefined,
    scopes: string[] | undefined,
  ) {
    this._user = user;
    this._scopes = scopes;
  }
  
  public getUser(): UserObject {
    if (this._user == null) throw new Error('not authenticated');
    return this._user;
  }

  public getScopes(): string[] {
    if (this._scopes == null) throw new Error('not authenticated');
    return this._scopes;
  }

  public validateParams<T>(schema: z.ZodType<T>): T {
    const result = schema.safeParse(this.params);
    if (!result.success) {
      throw new RestError(new BadRequest(
        result.error.issues.map(x => {
          return { code: x.code, path: x.path, message: x.message };
        })
      ));
    }
    return result.data;
  }
}
