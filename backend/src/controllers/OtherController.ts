import type { Router } from "express";
import express from "express";
import { z } from "zod";
import { checkScope, tokenAuth } from "../core/authorization.js";
import type { DB } from "../core/database.js";
import { createRequestContext, throwsValidationError } from "../core/restApi.js";
import type { UserObject } from "../services/UserService.js";

export function otherController(router: Router, db: DB) {

  // Echo (GET)
  router.get(
    "/echo",
    async (req, res) => {
      const ctx = await createRequestContext(req.user as UserObject, db);
      const validator = z.object({
        message: z.string(),
      });
      const validation = validator.safeParse(req.query);
      if (!validation.success) {
        throwsValidationError(validation);
      }
      res.json({
        message: validation.data
      });
    },
  );

  // Echo (POST)
  router.post(
    "/echo",
    async (req, res) => {
      const ctx = await createRequestContext(req.user as UserObject, db);
      const validator = z.object({
        message: z.string(),
      });
      const validation = validator.safeParse(req.body);
      if (!validation.success) {
        throwsValidationError(validation);
      }
      res.json({
        message: validation.data
      });
    },
  );

}
