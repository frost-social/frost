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

export function leafController(router: Router, db: DB) {

}

// registerRoute(router, db, {
//   method: "POST",
//   path: "/leaf/createLeaf",
//   scope: "leaf.write",
//   async requestHandler(
//     ctx,
//   ): Promise<Endpoints["/api/v1/leaf/createLeaf"]["result"]> {
//     const params: Endpoints["/api/v1/leaf/createLeaf"]["body"] =
//       ctx.validateParams(
//         z.object({
//           content: z.string().min(1),
//         }),
//       );
//     const result = await LeafService.createLeaf(
//       params,
//       { userId: ctx.getUser().userId },
//       ctx.db,
//     );
//     return result;
//   },
// });

// registerRoute(router, db, {
//   method: "POST",
//   path: "/leaf/deleteLeaf",
//   scope: "leaf.delete",
//   async requestHandler(
//     ctx,
//   ): Promise<Endpoints["/api/v1/leaf/deleteLeaf"]["result"]> {
//     const params: Endpoints["/api/v1/leaf/deleteLeaf"]["body"] =
//       ctx.validateParams(
//         z.object({
//           leafId: zUuid,
//         }),
//       );
//     await LeafService.deleteLeaf(
//       params,
//       { userId: ctx.getUser().userId },
//       ctx.db,
//     );
//   },
// });

// registerRoute(router, db, {
//   method: "GET",
//   path: "/leaf/getLeaf",
//   scope: "leaf.read",
//   async requestHandler(
//     ctx,
//   ): Promise<Endpoints["/api/v1/leaf/getLeaf"]["result"]> {
//     const params: Endpoints["/api/v1/leaf/getLeaf"]["query"] =
//       ctx.validateParams(
//         z.object({
//           leafId: zUuid,
//         }),
//       );
//     const result = await LeafService.getLeaf(
//       params,
//       { userId: ctx.getUser().userId },
//       ctx.db,
//     );
//     return result;
//   },
// });

// registerRoute(router, db, {
//   method: "GET",
//   path: "/leaf/searchLeafs",
//   scope: "leaf.read",
//   async requestHandler(
//     ctx,
//   ): Promise<Endpoints["/api/v1/leaf/searchLeafs"]["result"]> {
//     throw new Error("not implemented");
//   },
// });
