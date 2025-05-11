import type express from "express";
import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import { getTokenInfo } from "../services/TokenService.js";
import { getUser } from "../services/UserService.js";
import type { DB } from "./database.js";
import { AccessDenied, RestError, Unauthenticated, createRequestContext } from "./restApi.js";

export function configureAuth(db: DB) {
  passport.use(
    new BearerStrategy(async (token, done) => {
      try {
        const ctx = await createRequestContext(undefined, db);
        const tokenInfo = await getTokenInfo(ctx, {
          token
        });
        if (tokenInfo.tokenKind != "access_token") {
          return done(new RestError(new Unauthenticated()));
        }
        const authUser = await getUser(ctx, {
          userId: tokenInfo.userId
        });
        return done(null, authUser, { scope: tokenInfo.scopes });
      } catch (err) {
        return done(err);
      }
    }),
  );
}

export function tokenAuth(): express.RequestHandler {
  return passport.authenticate("bearer", { session: false });
}

export function checkScope(...scopes: string[]): express.RequestHandler {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let requestedScopes = scopes;
    if (!Array.isArray(scopes)) {
      requestedScopes = [scopes];
    }
    // check all required scopes
    for (const requestedScope of requestedScopes) {
      if (
        !(req.authInfo as { scope: string[] }).scope.includes(requestedScope)
      ) {
        next(new RestError(new AccessDenied()));
        return;
      }
    }
    next();
  };
}
