import express from "express";
import z from "zod";
import { registerRoute } from "./core/apiRouteBuilder.js";
import type { DB } from "./core/database.js";
import { EndpointNotFound, RestError, corsApi } from "./core/restApi.js";
import type { Endpoints } from "./endpoints.js";
import { signin, signup } from "./services/AuthenticationService.js";
import * as LeafsQueryService from "./services/LeafQueryService.js";
import * as LeafService from "./services/LeafService.js";
import * as UserFollowingService from "./services/UserFollowingService.js";
import * as UserService from "./services/UserService.js";

const zUuid = z.string().length(36);
const zNumericString = z
  .string()
  .regex(/^[+-]?\d*\.?\d+$/, { message: "invalid numeric string" });

export function createApiRouter(db: DB) {
  const router = express.Router();
  router.use("/api/v1", createApiVer1Router(db));

  return router;
}

function createApiVer1Router(db: DB) {
  const router = express.Router();
  router.use(corsApi());

  registerRoute(router, db, {
    method: "POST",
    path: "/auth/signin",
    scope: "user.auth",
    async requestHandler(
      ctx,
    ): Promise<Endpoints["/api/v1/auth/signin"]["result"]> {
      const params: Endpoints["/api/v1/auth/signin"]["body"] =
        ctx.validateParams(
          z.object({
            userName: z.string().min(1),
            password: z.string().min(1).optional(),
          }),
        );
      const result = await signin(
        params,
        { userId: ctx.getUser().userId },
        ctx.db,
      );
      return result;
    },
  });

  registerRoute(router, db, {
    method: "POST",
    path: "/auth/signup",
    scope: "user.auth",
    async requestHandler(
      ctx,
    ): Promise<Endpoints["/api/v1/auth/signup"]["result"]> {
      const params: Endpoints["/api/v1/auth/signup"]["body"] =
        ctx.validateParams(
          z.object({
            userName: z.string().min(1),
            password: z.string().min(1).optional(),
            displayName: z.string().min(1),
          }),
        );
      const result = await signup(
        params,
        { userId: ctx.getUser().userId },
        ctx.db,
      );
      return result;
    },
  });

  registerRoute(router, db, {
    method: "GET",
    path: "/echo",
    async requestHandler(
      ctx,
    ): Promise<Endpoints["/api/v1/echo"]["get"]["result"]> {
      const params: Endpoints["/api/v1/echo"]["get"]["query"] =
        ctx.validateParams(
          z.object({
            message: z.string().min(1),
          }),
        );
      return { message: params.message };
    },
  });

  registerRoute(router, db, {
    method: "POST",
    path: "/echo",
    async requestHandler(
      ctx,
    ): Promise<Endpoints["/api/v1/echo"]["post"]["result"]> {
      const params: Endpoints["/api/v1/echo"]["post"]["body"] =
        ctx.validateParams(
          z.object({
            message: z.string().min(1),
          }),
        );
      return { message: params.message };
    },
  });

  registerRoute(router, db, {
    method: "POST",
    path: "/leaf/createLeaf",
    scope: "leaf.write",
    async requestHandler(
      ctx,
    ): Promise<Endpoints["/api/v1/leaf/createLeaf"]["result"]> {
      const params: Endpoints["/api/v1/leaf/createLeaf"]["body"] =
        ctx.validateParams(
          z.object({
            content: z.string().min(1),
          }),
        );
      const result = await LeafService.createLeaf(
        params,
        { userId: ctx.getUser().userId },
        ctx.db,
      );
      return result;
    },
  });

  registerRoute(router, db, {
    method: "POST",
    path: "/leaf/deleteLeaf",
    scope: "leaf.delete",
    async requestHandler(
      ctx,
    ): Promise<Endpoints["/api/v1/leaf/deleteLeaf"]["result"]> {
      const params: Endpoints["/api/v1/leaf/deleteLeaf"]["body"] =
        ctx.validateParams(
          z.object({
            leafId: zUuid,
          }),
        );
      await LeafService.deleteLeaf(
        params,
        { userId: ctx.getUser().userId },
        ctx.db,
      );
    },
  });

  registerRoute(router, db, {
    method: "GET",
    path: "/leaf/getLeaf",
    scope: "leaf.read",
    async requestHandler(
      ctx,
    ): Promise<Endpoints["/api/v1/leaf/getLeaf"]["result"]> {
      const params: Endpoints["/api/v1/leaf/getLeaf"]["query"] =
        ctx.validateParams(
          z.object({
            leafId: zUuid,
          }),
        );
      const result = await LeafService.getLeaf(
        params,
        { userId: ctx.getUser().userId },
        ctx.db,
      );
      return result;
    },
  });

  registerRoute(router, db, {
    method: "GET",
    path: "/leaf/searchLeafs",
    scope: "leaf.read",
    async requestHandler(
      ctx,
    ): Promise<Endpoints["/api/v1/leaf/searchLeafs"]["result"]> {
      throw new Error("not implemented");
    },
  });

  registerRoute(router, db, {
    method: "POST",
    path: "/user/deleteUser",
    scope: "user.delete",
    async requestHandler(
      ctx,
    ): Promise<Endpoints["/api/v1/leaf/deleteLeaf"]["result"]> {
      throw new Error("not implemented");
    },
  });

  registerRoute(router, db, {
    method: "POST",
    path: "/user/followUser",
    scope: "user.write",
    async requestHandler(
      ctx,
    ): Promise<Endpoints["/api/v1/user/followUser"]["result"]> {
      const params: Endpoints["/api/v1/user/followUser"]["body"] =
        ctx.validateParams(
          z.object({
            userId: zUuid,
          }),
        );
      await UserFollowingService.followUser(
        params,
        { userId: ctx.getUser().userId },
        ctx.db,
      );
    },
  });

  registerRoute(router, db, {
    method: "GET",
    path: "/user/listFollowing",
    scope: "user.read",
    async requestHandler(
      ctx,
    ): Promise<Endpoints["/api/v1/user/listFollowing"]["result"]> {
      const params: Endpoints["/api/v1/user/listFollowing"]["query"] =
        ctx.validateParams(
          z.object({
            offset: zNumericString.optional(),
            limit: zNumericString.optional(),
            userId: zUuid,
          }),
        );
      const params2 = {
        ...params,
        offset: params.offset != null ? Number(params.offset) : undefined,
        limit: params.limit != null ? Number(params.limit) : undefined,
      };
      const result = await UserFollowingService.getFollowings(
        params2,
        { userId: ctx.getUser().userId },
        ctx.db,
      );
      return result;
    },
  });

  registerRoute(router, db, {
    method: "GET",
    path: "/user/listFollowedBy",
    scope: "user.read",
    async requestHandler(
      ctx,
    ): Promise<Endpoints["/api/v1/user/listFollowedBy"]["result"]> {
      const params: Endpoints["/api/v1/user/listFollowedBy"]["query"] =
        ctx.validateParams(
          z.object({
            offset: zNumericString.optional(),
            limit: zNumericString.optional(),
            userId: zUuid,
          }),
        );
      const params2 = {
        ...params,
        offset: params.offset != null ? Number(params.offset) : undefined,
        limit: params.limit != null ? Number(params.limit) : undefined,
      };
      const result = await UserFollowingService.getFollowedBy(
        params2,
        { userId: ctx.getUser().userId },
        ctx.db,
      );
      return result;
    },
  });

  registerRoute(router, db, {
    method: "GET",
    path: "/user/getHomeTimeline",
    scope: ["user.read", "leaf.read"],
    async requestHandler(
      ctx,
    ): Promise<Endpoints["/api/v1/user/getHomeTimeline"]["result"]> {
      const params: Endpoints["/api/v1/user/getHomeTimeline"]["query"] =
        ctx.validateParams(
          z.object({
            nextCursor: z.string().length(36).optional(),
            prevCursor: z.string().length(36).optional(),
            limit: zNumericString.optional(),
          }),
        );
      const params2 = {
        kind: "home",
        ...params,
        limit: Number(params.limit),
      };
      const result = await LeafsQueryService.fetchHomeTimeline(
        params2,
        { userId: ctx.getUser().userId },
        ctx.db,
      );
      return result;
    },
  });

  registerRoute(router, db, {
    method: "GET",
    path: "/user/getUser",
    scope: "user.read",
    async requestHandler(
      ctx,
    ): Promise<Endpoints["/api/v1/user/getUser"]["result"]> {
      const params: Endpoints["/api/v1/user/getUser"]["query"] =
        ctx.validateParams(
          z.object({
            userId: zUuid.optional(),
            userName: z.string().min(1).optional(),
          }),
        );
      const result = await UserService.getUser(
        params,
        { userId: ctx.getUser().userId },
        ctx.db,
      );
      return result;
    },
  });

  registerRoute(router, db, {
    method: "GET",
    path: "/user/searchUsers",
    scope: "user.read",
    async requestHandler(
      ctx,
    ): Promise<Endpoints["/api/v1/user/searchUsers"]["result"]> {
      throw new Error("not implemented");
    },
  });

  registerRoute(router, db, {
    method: "POST",
    path: "/user/unfollowUser",
    scope: "user.write",
    async requestHandler(
      ctx,
    ): Promise<Endpoints["/api/v1/user/unfollowUser"]["result"]> {
      const params: Endpoints["/api/v1/user/unfollowUser"]["body"] =
        ctx.validateParams(
          z.object({
            userId: zUuid,
          }),
        );
      await UserFollowingService.unfollowUser(
        params,
        { userId: ctx.getUser().userId },
        ctx.db,
      );
    },
  });

  router.use((req, res, next) => {
    next(new RestError(new EndpointNotFound()));
  });

  return router;
}
