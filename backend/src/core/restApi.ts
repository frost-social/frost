import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import type { SafeParseError } from "zod";
import { createApiRouter } from "../routers.js";
import type { UserObject } from "../services/UserService.js";
import type { DB } from "./database.js";

export type RequestContext = {
  user: UserObject;
  db: DB;
};

export function requestContext(user: UserObject, db: DB): RequestContext {
  return {
    user,
    db,
  };
}

export function throwsValidationError<T>(validation: SafeParseError<T>): never {
  throw new RestError(
    new BadRequest(
      validation.error.issues.map((x) => {
        return { code: x.code, path: x.path, message: x.message };
      }),
    ),
  );
}

/**
 * 任意のエラー情報を元にREST APIのエラーを組み立てます。
 */
function buildRestApiError(err: unknown): { error: ErrorObject } {
  // app error
  if (err instanceof RestError) {
    return {
      error: err.error,
    };
  }

  // other errors
  console.error(err);
  return {
    error: new ServerError(),
  };
}

export function configureRestApi(app: Application, db: DB) {
  app.use(express.json());

  app.use(createApiRouter(db));

  // @ts-ignore
  app.use((err, req, res, next) => {
    const errorResponse = buildRestApiError(err);
    res.status(errorResponse.error.status).json(errorResponse);
    return;
  });
}

export function corsApi() {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    // preflight request
    if (req.method == "OPTIONS") {
      res.setHeader("Access-Control-Allow-Methods", "POST,GET,DELETE,OPTIONS");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Accept,Content-Type,Origin,Authorization",
      );
      res.setHeader("Access-Control-Max-Age", "60");
      res.status(204).send();
      return;
    }

    next();
  };
}

export interface ErrorObject {
  [x: string]: any;
  code: string;
  message: string;
  status: number;
}

export class RestError extends Error {
  constructor(public error: ErrorObject) {
    super(error.message);
  }
}

export class BadRequest implements ErrorObject {
  code = "bad_request";
  message = "The request is invalid.";
  status = 400;
  details?: { code?: string; path?: (string | number)[]; message: string }[];

  constructor(details?: BadRequest["details"]) {
    this.details = details;
  }
}

export class Unauthenticated implements ErrorObject {
  code = "unauthenticated";
  message = "Credentials are required for access.";
  status = 401;
}

export class AccessDenied implements ErrorObject {
  code = "access_denied";
  message = "You do not have access permissions.";
  status = 403;
}

export class ResourceNotFound implements ErrorObject {
  code = "resource_not_found";
  message = "The specified resource was not found.";
  status = 404;

  constructor(public resorceName: string) {}
}

export class EndpointNotFound implements ErrorObject {
  code = "endpoint_not_found";
  message = "The specified API endpoint was not found.";
  status = 404;
}

export class MethodNotAllowed implements ErrorObject {
  code = "method_not_allowed";
  message = "This API endpoint does not support the specified operation.";
  status = 405;
}

export class ServerError implements ErrorObject {
  code = "server_error";
  message = "An internal error occurred on the server.";
  status = 500;
}
