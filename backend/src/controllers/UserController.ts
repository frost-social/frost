import type { Router } from "express";
import { z } from "zod";
import { checkScope, tokenAuth } from "../core/authorization.js";
import type { DB } from "../core/database.js";
import {
  createRequestContext,
  defineApiRoute,
  validateApiData,
} from "../core/restApi.js";
import { getHomeTimeline } from "../services/LeafQueryService.js";
import { type UserObject, getUser } from "../services/UserService.js";
import { leafSchema } from "./LeafController.js";

export const apiBasePath = "/api/v1";

export const userSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  displayName: z.string(),
});
export type UserSchema = z.infer<typeof userSchema>;

// GetUser
export const getUserRoute = defineApiRoute({
  method: "get",
  path: `${apiBasePath}/user/getUser`,
  inputSchema: z.object({
    userId: z.string().uuid().optional(),
    userName: z.string().min(1).optional(),
  }),
  outputSchema: userSchema,
});
export type GetUserInputSchema = z.infer<typeof getUserRoute.inputSchema>;
export type GetUserOutputSchema = z.infer<typeof getUserRoute.outputSchema>;

// GetHomeTimeline
export const getHomeTimelineRoute = defineApiRoute({
  method: "get",
  path: `${apiBasePath}/user/getUser`,
  inputSchema: z.object({
    prevCursor: z.string().uuid().optional(),
    nextCursor: z.string().uuid().optional(),
    limit: z.coerce.number().optional(), // convert to number
  }),
  outputSchema: z.object({
    items: leafSchema.array(),
  }),
});
export type GetHomeTimelineInputSchema = z.infer<typeof getHomeTimelineRoute.inputSchema>;
export type GetHomeTimelineOutputSchema = z.infer<typeof getHomeTimelineRoute.outputSchema>;

// SearchUsers
export const searchUsersRoute = defineApiRoute({
  method: "get",
  path: `${apiBasePath}/user/searchUsers`,
  inputSchema: z.object({
    userName: z.string().min(1).optional(),
    displayName: z.string().optional(),
  }),
  outputSchema: z.object({
    items: userSchema.array(),
  }),
});
export type SearchUsersInputSchema = z.infer<typeof searchUsersRoute.inputSchema>;
export type SearchUsersOutputSchema = z.infer<typeof searchUsersRoute.outputSchema>;

export function userController(router: Router, db: DB) {
  // GetUser
  router.get(
    "/user/getUser",
    tokenAuth(),
    checkScope("user.read"),
    async (req, res) => {
      const ctx = await createRequestContext(req.user as UserObject, db);
      const params = validateApiData(getUserRoute.inputSchema, req.query);
      const result = await getUser(ctx, params);
      validateApiData(getUserRoute.outputSchema, result);
      res.json(result);
    },
  );

  // GetHomeTimeline
  router.get(
    "/user/getHomeTimeline",
    tokenAuth(),
    checkScope("user.read", "leaf.read"),
    async (req, res) => {
      const ctx = await createRequestContext(req.user as UserObject, db);
      const params = validateApiData(getHomeTimelineRoute.inputSchema, req.query);
      const result = await getHomeTimeline(ctx, params);
      validateApiData(getHomeTimelineRoute.outputSchema, result);
      res.json(result);
    },
  );

  // SearchUsers
  router.get(
    "/user/searchUsers",
    tokenAuth(),
    checkScope("user.read"),
    async (req, res) => {
      throw new Error("not implemented");
      // const ctx = await createRequestContext(req.user as UserObject, db);
      // const params = validateApiData(searchUsersRoute.inputSchema, req.query);
      // const result = await searchUsers(ctx, params);
      // validateApiData(searchUsersRoute.outputSchema, result);
      // res.json(result);
    },
  );

  // DeleteUser
  router.post(
    "/user/deleteUser",
    tokenAuth(),
    checkScope("user.delete"),
    async (req, res) => {
      throw new Error("not implemented");
      // const ctx = await createRequestContext(req.user as UserObject, db);
      // const params = validateApiData(deleteUserRoute.inputSchema, req.body);
      // const result = await deleteUser(ctx, params);
      // validateApiData(deleteUserRoute.outputSchema, result);
      // res.json(result);
    },
  );
}
