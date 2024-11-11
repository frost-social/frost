import express from "express";
import { Container } from "inversify";
import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import { BACKEND_URSR_ID } from "../../constants/specialUserId";
import * as TokenService from "../../services/TokenService";
import * as UserService from "../../services/UserService";
import { AccessDenied, appError, Unauthenticated } from "../appErrors";

export function configureServer(container: Container) {
  passport.use(new BearerStrategy(async (token, done) => {
    try {
      const ctx = { userId: BACKEND_URSR_ID };
      const tokenInfo = await TokenService.getTokenInfo({
        token
      }, ctx, container);
      if (tokenInfo.tokenKind != "access_token") {
        return done(appError(new Unauthenticated()));
      }
      const user = await UserService.getUser({
        userId: tokenInfo.userId
      }, ctx, container);
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
