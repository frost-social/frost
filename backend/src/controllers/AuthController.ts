import type { Router } from "express";
import { z } from "zod";
import { checkScope, tokenAuth } from "../core/authorization.js";
import type { DB } from "../core/database.js";
import {
  createRequestContext,
  throwsValidationError,
} from "../core/restApi.js";
import { signin, signup } from "../services/AuthenticationService.js";
import type { UserObject } from "../services/UserService.js";

// Signup
const zSignupInput = z.object({
  userName: z.string().min(3),
  displayName: z.string().min(1).optional(),
  password: z.string().min(5).optional(),
});
export type SignupInput = z.infer<typeof zSignupInput>;

// Signin
const zSigninInput = z.object({
  userName: z.string().min(3),
  password: z.string().min(5).optional(),
});
export type SigninInput = z.infer<typeof zSigninInput>;

export function authController(router: Router, db: DB) {
  // Signup
  router.post(
    "/auth/signup",
    tokenAuth(),
    checkScope("user.auth"),
    async (req, res) => {
      const ctx = await createRequestContext(req.user as UserObject, db);
      const validation = zSignupInput.safeParse(req.body);
      if (!validation.success) {
        throwsValidationError(validation);
      }
      const signupOutput = await signup(ctx, validation.data);
      res.json(signupOutput);
    },
  );

  // Signin
  router.post(
    "/auth/signin",
    tokenAuth(),
    checkScope("user.auth"),
    async (req, res) => {
      const ctx = await createRequestContext(req.user as UserObject, db);
      const validation = zSigninInput.safeParse(req.body);
      if (!validation.success) {
        throwsValidationError(validation);
      }
      const signinOutput = await signin(ctx, validation.data);
      res.json(signinOutput);
    },
  );
}
