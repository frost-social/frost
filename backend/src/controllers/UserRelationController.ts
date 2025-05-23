import type { Router } from "express";
import { z } from "zod";
import { checkScope, tokenAuth } from "../core/authorization.js";
import type { DB } from "../core/database.js";
import {
  createRequestContext,
  defineApiRoute,
  validateApiData,
} from "../core/restApi.js";

export const apiBasePath = "/api/v1";

export function userRelationController(router: Router, db: DB) {
  // FollowUser
  router.post(
    "/user/followUser",
    tokenAuth(),
    checkScope("user.write"),
    async (req, res) => {
      throw new Error("not implemented");
      // const ctx = await createRequestContext(req.user as UserObject, db);
      // const params = validateApiData(followUserRoute.inputSchema, req.body);
      // const result = await followUser(ctx, params);
      // validateApiData(followUserRoute.outputSchema, result);
      // res.json(result);
    },
  );

  // UnfollowUser
  router.post(
    "/user/unfollowUser",
    tokenAuth(),
    checkScope("user.write"),
    async (req, res) => {
      throw new Error("not implemented");
      // const ctx = await createRequestContext(req.user as UserObject, db);
      // const params = validateApiData(followUserRoute.inputSchema, req.body);
      // const result = await unfollowUser(ctx, params);
      // validateApiData(followUserRoute.outputSchema, result);
      // res.json(result);
    },
  );

  // ListFollowing
  router.get(
    "/user/listFollowing",
    tokenAuth(),
    checkScope("user.read"),
    async (req, res) => {
      throw new Error("not implemented");
      // const ctx = await createRequestContext(req.user as UserObject, db);
      // const params = validateApiData(listFollowingRoute.inputSchema, req.query);
      // const result = await getUserFollowings(ctx, params);
      // validateApiData(listFollowingRoute.outputSchema, result);
      // res.json(result);
    },
  );

  // ListFollowedBy
  router.get(
    "/user/listFollowedBy",
    tokenAuth(),
    checkScope("user.read"),
    async (req, res) => {
      throw new Error("not implemented");
      // const ctx = await createRequestContext(req.user as UserObject, db);
      // const params = validateApiData(listFollowedByRoute.inputSchema, req.query);
      // const result = await getUserFollowedBy(ctx, params);
      // validateApiData(listFollowedByRoute.outputSchema, result);
      // res.json(result);
    },
  );
}
