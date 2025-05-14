import type { Router } from "express";
import { z } from "zod";
import { checkScope, tokenAuth } from "../core/authorization.js";
import type { DB } from "../core/database.js";
import {
  createRequestContext,
  defineApiRoute,
  validateApiData,
} from "../core/restApi.js";
import { type UserObject, getUser } from "../services/UserService.js";

export const apiBasePath = "/api/v1";

export const userSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  displayName: z.string(),
  passwordAuthEnabled: z.boolean(),
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
}

// registerRoute(router, db, {
//   method: "POST",
//   path: "/user/deleteUser",
//   scope: "user.delete",
//   async requestHandler(
//     ctx,
//   ): Promise<Endpoints["/api/v1/leaf/deleteLeaf"]["result"]> {
//     throw new Error("not implemented");
//   },
// });

// registerRoute(router, db, {
//   method: "POST",
//   path: "/user/followUser",
//   scope: "user.write",
//   async requestHandler(
//     ctx,
//   ): Promise<Endpoints["/api/v1/user/followUser"]["result"]> {
//     const params: Endpoints["/api/v1/user/followUser"]["body"] =
//       ctx.validateParams(
//         z.object({
//           userId: zUuid,
//         }),
//       );
//     await UserFollowingService.followUser(
//       params,
//       { userId: ctx.getUser().userId },
//       ctx.db,
//     );
//   },
// });

// registerRoute(router, db, {
//   method: "GET",
//   path: "/user/listFollowing",
//   scope: "user.read",
//   async requestHandler(
//     ctx,
//   ): Promise<Endpoints["/api/v1/user/listFollowing"]["result"]> {
//     const params: Endpoints["/api/v1/user/listFollowing"]["query"] =
//       ctx.validateParams(
//         z.object({
//           offset: zNumericString.optional(),
//           limit: zNumericString.optional(),
//           userId: zUuid,
//         }),
//       );
//     const params2 = {
//       ...params,
//       offset: params.offset != null ? Number(params.offset) : undefined,
//       limit: params.limit != null ? Number(params.limit) : undefined,
//     };
//     const result = await UserFollowingService.getFollowings(
//       params2,
//       { userId: ctx.getUser().userId },
//       ctx.db,
//     );
//     return result;
//   },
// });

// registerRoute(router, db, {
//   method: "GET",
//   path: "/user/listFollowedBy",
//   scope: "user.read",
//   async requestHandler(
//     ctx,
//   ): Promise<Endpoints["/api/v1/user/listFollowedBy"]["result"]> {
//     const params: Endpoints["/api/v1/user/listFollowedBy"]["query"] =
//       ctx.validateParams(
//         z.object({
//           offset: zNumericString.optional(),
//           limit: zNumericString.optional(),
//           userId: zUuid,
//         }),
//       );
//     const params2 = {
//       ...params,
//       offset: params.offset != null ? Number(params.offset) : undefined,
//       limit: params.limit != null ? Number(params.limit) : undefined,
//     };
//     const result = await UserFollowingService.getFollowedBy(
//       params2,
//       { userId: ctx.getUser().userId },
//       ctx.db,
//     );
//     return result;
//   },
// });

// registerRoute(router, db, {
//   method: "GET",
//   path: "/user/getHomeTimeline",
//   scope: ["user.read", "leaf.read"],
//   async requestHandler(
//     ctx,
//   ): Promise<Endpoints["/api/v1/user/getHomeTimeline"]["result"]> {
//     const params: Endpoints["/api/v1/user/getHomeTimeline"]["query"] =
//       ctx.validateParams(
//         z.object({
//           nextCursor: z.string().length(36).optional(),
//           prevCursor: z.string().length(36).optional(),
//           limit: zNumericString.optional(),
//         }),
//       );
//     const params2 = {
//       kind: "home",
//       ...params,
//       limit: Number(params.limit),
//     };
//     const result = await LeafsQueryService.fetchHomeTimeline(
//       params2,
//       { userId: ctx.getUser().userId },
//       ctx.db,
//     );
//     return result;
//   },
// });

// registerRoute(router, db, {
//   method: "GET",
//   path: "/user/getUser",
//   scope: "user.read",
//   async requestHandler(
//     ctx,
//   ): Promise<Endpoints["/api/v1/user/getUser"]["result"]> {
//     const params: Endpoints["/api/v1/user/getUser"]["query"] =
//       ctx.validateParams(
//         z.object({
//           userId: zUuid.optional(),
//           userName: z.string().min(1).optional(),
//         }),
//       );
//     const result = await UserService.getUser(
//       params,
//       { userId: ctx.getUser().userId },
//       ctx.db,
//     );
//     return result;
//   },
// });

// registerRoute(router, db, {
//   method: "GET",
//   path: "/user/searchUsers",
//   scope: "user.read",
//   async requestHandler(
//     ctx,
//   ): Promise<Endpoints["/api/v1/user/searchUsers"]["result"]> {
//     throw new Error("not implemented");
//   },
// });

// registerRoute(router, db, {
//   method: "POST",
//   path: "/user/unfollowUser",
//   scope: "user.write",
//   async requestHandler(
//     ctx,
//   ): Promise<Endpoints["/api/v1/user/unfollowUser"]["result"]> {
//     const params: Endpoints["/api/v1/user/unfollowUser"]["body"] =
//       ctx.validateParams(
//         z.object({
//           userId: zUuid,
//         }),
//       );
//     await UserFollowingService.unfollowUser(
//       params,
//       { userId: ctx.getUser().userId },
//       ctx.db,
//     );
//   },
// });
