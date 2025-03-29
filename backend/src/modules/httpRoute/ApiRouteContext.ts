import express from "express";
import z from 'zod';
import { UserObject } from "../valueObject";
import { appError, BadRequest } from "../appErrors";
import { DB } from "../db";

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
      throw appError(new BadRequest(
        result.error.issues.map(x => {
          return { code: x.code, path: x.path, message: x.message };
        })
      ));
    }
    return result.data;
  }
}
