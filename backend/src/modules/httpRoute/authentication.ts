import express from "express";
import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import * as TokenService from "../../services/TokenService";
import * as UserService from "../../services/UserService";
import { AccessDenied, appError, Unauthenticated } from "../appErrors";
import { DB } from "../db";

export function configureServer(db: DB) {
  passport.use(new BearerStrategy(async (token, done) => {
    try {
      const info = { userId: 'internal' };
      const tokenInfo = await TokenService.getTokenInfo({
        token
      }, info, db);
      if (tokenInfo.tokenKind != "access_token") {
        return done(appError(new Unauthenticated()));
      }
      const user = await UserService.getUser({
        userId: tokenInfo.userId
      }, info, db);
      return done(null, user, { scope: tokenInfo.scopes });
    } catch (err) {
      return done(err);
    }
  }));
}

export function authenticate(scope: string | string[]) {
  const authBearer = passport.authenticate("bearer", { session: false });

  const checkScopes = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let requiredScopes: string[];
    if (Array.isArray(scope)) {
      requiredScopes = scope;
    } else {
      requiredScopes = [scope];
    }
    // check all required scopes
    for (const requiredScope of requiredScopes) {
      if (!(req.authInfo as { scope: string[] }).scope.includes(requiredScope)) {
        next(appError(new AccessDenied()));
        return;
      }
    }
    next();
  };

  return [
    authBearer,
    checkScopes,
  ];
}
