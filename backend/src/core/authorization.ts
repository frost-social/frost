import type express from "express";
import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import * as TokenService from "../services/TokenService.js";
import * as UserService from "../services/UserService.js";
import type { DB } from "./database.js";
import { AccessDenied, RestError, Unauthenticated } from "./restApi.js";

export function configureAuth(db: DB) {
  passport.use(
    new BearerStrategy(async (token, done) => {
      try {
        const info = { userId: "internal" };
        const tokenInfo = await TokenService.getTokenInfo({
          token
        }, info, db);
        if (tokenInfo.tokenKind != "access_token") {
          return done(new RestError(new Unauthenticated()));
        }
        const user = await UserService.getUser({
          userId: tokenInfo.userId
        }, info, db);
        return done(null, user, { scope: tokenInfo.scopes });
      } catch (err) {
        return done(err);
      }
    }),
  );
}

export function getAuthMiddlewares(scope: string | string[]) {
  const authBearer = passport.authenticate("bearer", { session: false });

  const checkScopes = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    let requiredScopes: string[];
    if (Array.isArray(scope)) {
      requiredScopes = scope;
    } else {
      requiredScopes = [scope];
    }
    // check all required scopes
    for (const requiredScope of requiredScopes) {
      if (
        !(req.authInfo as { scope: string[] }).scope.includes(requiredScope)
      ) {
        next(new RestError(new AccessDenied()));
        return;
      }
    }
    next();
  };

  return [authBearer, checkScopes];
}
