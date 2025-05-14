import type { Router } from "express";
import { z } from "zod";
import { checkScope, tokenAuth } from "../core/authorization.js";
import type { DB } from "../core/database.js";
import {
  createRequestContext,
  defineApiRoute,
  validateApiData,
} from "../core/restApi.js";
import { signin, signup } from "../services/AuthenticationService.js";
import type { UserObject } from "../services/UserService.js";
import { userSchema } from "./UserController.js";

export const apiBasePath = "/api/v1";

export const tokenSchema = z.object({
  token: z.string(),
  scopes: z.string().array(),
});

// Signup
const signupRoute = defineApiRoute({
  method: "post",
  path: `${apiBasePath}/auth/signup`,
  inputSchema: z.object({
    userName: z.string().min(3),
    displayName: z.string().min(1).optional(),
    password: z.string().min(5).optional(),
  }),
  outputSchema: z.object({
    accessToken: tokenSchema,
    refreshToken: tokenSchema,
    user: userSchema,
  }),
});
export type SignupInputSchema = z.infer<typeof signupRoute.inputSchema>;
export type SignupOutputSchema = z.infer<typeof signupRoute.outputSchema>;

// Signin
const signinRoute = defineApiRoute({
  method: "post",
  path: `${apiBasePath}/auth/signin`,
  inputSchema: z.object({
    userName: z.string().min(3),
    password: z.string().min(5).optional(),
  }),
  outputSchema: z.object({
    accessToken: tokenSchema,
    refreshToken: tokenSchema,
    user: userSchema,
  }),
});
export type SigninInputSchema = z.infer<typeof signinRoute.inputSchema>;
export type SigninOutputSchema = z.infer<typeof signinRoute.outputSchema>;

export function authController(router: Router, db: DB) {
  // Signup
  router.post(
    "/auth/signup",
    tokenAuth(),
    checkScope("user.auth"),
    async (req, res) => {
      const ctx = await createRequestContext(req.user as UserObject, db);
      const params = validateApiData(signupRoute.inputSchema, req.body);
      const result = await signup(ctx, params);
      validateApiData(signupRoute.outputSchema, result);
      res.json(result);
    },
  );

  // Signin
  router.post(
    "/auth/signin",
    tokenAuth(),
    checkScope("user.auth"),
    async (req, res) => {
      const ctx = await createRequestContext(req.user as UserObject, db);
      const params = validateApiData(signinRoute.inputSchema, req.body);
      const result = await signin(ctx, params);
      validateApiData(signinRoute.outputSchema, result);
      res.json(result);
    },
  );
}
