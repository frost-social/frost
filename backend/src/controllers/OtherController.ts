import type { Router } from "express";
import { z } from "zod";
import type { DB } from "../core/database.js";
import {
  defineApiRoute,
  validateApiData,
} from "../core/restApi.js";

export const apiBasePath = "/api/v1";

// Echo (GET)
export const echoGetRoute = defineApiRoute({
  method: "get",
  path: `${apiBasePath}/echo`,
  inputSchema: z.object({
    message: z.string().min(1),
  }),
  outputSchema: z.object({
    message: z.string().min(1),
  }),
});
export type EchoGetInputSchema = z.infer<typeof echoGetRoute.inputSchema>;
export type EchoGetOutputSchema = z.infer<typeof echoGetRoute.outputSchema>;

// Echo (POST)
export const echoPostRoute = defineApiRoute({
  method: "post",
  path: `${apiBasePath}/echo`,
  inputSchema: z.object({
    message: z.string().min(1),
  }),
  outputSchema: z.object({
    message: z.string().min(1),
  }),
});
export type EchoPostInputSchema = z.infer<typeof echoPostRoute.inputSchema>;
export type EchoPostOutputSchema = z.infer<typeof echoPostRoute.outputSchema>;

export function otherController(router: Router, db: DB) {
  // Echo (GET)
  router.get("/echo", async (req, res) => {
    const params = validateApiData(echoGetRoute.inputSchema, req.query);
    const result = params;
    validateApiData(echoGetRoute.outputSchema, result);
    res.json(result);
  });

  // Echo (POST)
  router.post("/echo", async (req, res) => {
    const params = validateApiData(echoPostRoute.inputSchema, req.body);
    const result = params;
    validateApiData(echoPostRoute.outputSchema, result);
    res.json(result);
  });
}
