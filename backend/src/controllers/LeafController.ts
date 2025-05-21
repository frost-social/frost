import type { Router } from "express";
import { z } from "zod";
import { checkScope, tokenAuth } from "../core/authorization.js";
import type { DB } from "../core/database.js";
import {
  createRequestContext,
  defineApiRoute,
  validateApiData,
} from "../core/restApi.js";
import { createLeaf, deleteLeaf, getLeaf } from "../services/LeafService.js";
import type { UserObject } from "../services/UserService.js";

export const apiBasePath = "/api/v1";

export const leafSchema = z.object({
  leafId: z.string(),
});
export type LeafSchema = z.infer<typeof leafSchema>;

// CreateLeaf
export const createLeafRoute = defineApiRoute({
  method: "post",
  path: `${apiBasePath}/leaf/createLeaf`,
  inputSchema: z.object({
    content: z.string(),
  }),
  outputSchema: leafSchema,
});
export type CreateLeafInputSchema = z.infer<typeof createLeafRoute.inputSchema>;
export type CreateLeafOutputSchema = z.infer<typeof createLeafRoute.outputSchema>;

// DeleteLeaf
export const deleteLeafRoute = defineApiRoute({
  method: "post",
  path: `${apiBasePath}/leaf/deleteLeaf`,
  inputSchema: z.object({
    leafId: z.string(),
  }),
  outputSchema: z.object({
  }),
});
export type DeleteLeafInputSchema = z.infer<typeof deleteLeafRoute.inputSchema>;
export type DeleteLeafOutputSchema = z.infer<typeof deleteLeafRoute.outputSchema>;

// GetLeaf
export const getLeafRoute = defineApiRoute({
  method: "get",
  path: `${apiBasePath}/leaf/getLeaf`,
  inputSchema: z.object({
    leafId: z.string(),
  }),
  outputSchema: leafSchema,
});
export type GetLeafInputSchema = z.infer<typeof getLeafRoute.inputSchema>;
export type GetLeafOutputSchema = z.infer<typeof getLeafRoute.outputSchema>;

// SearchLeafs
export const searchLeafsRoute = defineApiRoute({
  method: "get",
  path: `${apiBasePath}/leaf/searchLeafs`,
  inputSchema: z.object({
    userId: z.string().optional(),
  }),
  outputSchema: z.object({
    items: leafSchema.array(),
  }),
});
export type SearchLeafsInputSchema = z.infer<typeof searchLeafsRoute.inputSchema>;
export type SearchLeafsOutputSchema = z.infer<typeof searchLeafsRoute.outputSchema>;

export function leafController(router: Router, db: DB) {
  router.post(
    "/leaf/createLeaf",
    tokenAuth(),
    checkScope("leaf.write"),
    async (req, res) => {
      const ctx = await createRequestContext(req.user as UserObject, db);
      const params = validateApiData(createLeafRoute.inputSchema, req.body);
      const result = await createLeaf(ctx, params);
      validateApiData(createLeafRoute.outputSchema, result);
      res.json(result);
    },
  );

  router.post(
    "/leaf/deleteLeaf",
    tokenAuth(),
    checkScope("leaf.delete"),
    async (req, res) => {
      const ctx = await createRequestContext(req.user as UserObject, db);
      const params = validateApiData(deleteLeafRoute.inputSchema, req.body);
      const result = await deleteLeaf(ctx, params);
      validateApiData(deleteLeafRoute.outputSchema, result);
      res.json(result);
    },
  );

  router.get(
    "/leaf/getLeaf",
    tokenAuth(),
    checkScope("leaf.read"),
    async (req, res) => {
      const ctx = await createRequestContext(req.user as UserObject, db);
      const params = validateApiData(getLeafRoute.inputSchema, req.query);
      const result = await getLeaf(ctx, params);
      validateApiData(getLeafRoute.outputSchema, result);
      res.json(result);
    },
  );

  router.get(
    "/leaf/searchLeafs",
    tokenAuth(),
    checkScope("leaf.read"),
    async (req, res) => {
      throw new Error("not implemented");
      //const ctx = await createRequestContext(req.user as UserObject, db);
      //const params = validateApiData(searchLeafRoute.inputSchema, req.query);
      //const result = await searchLeaf(ctx, params);
      //validateApiData(searchLeafRoute.outputSchema, result);
    },
  );
}
