import type { Router } from "express";
import { z } from "zod";
import { checkScope, tokenAuth } from "../core/authorization.js";
import type { DB } from "../core/database.js";
import { requestContext, throwsValidationError } from "../core/restApi.js";
import { type UserObject, getUser } from "../services/UserService.js";

export function userController(router: Router, db: DB) {
  const zUuid = z.string().length(36);
  const zString = z.string().min(1);

  router.get(
    "/api/v1/users/@:userName",
    tokenAuth(),
    checkScope("user.read"),
    async (req, res) => {
      const ctx = requestContext(req.user as UserObject, db);
      const validator = z.object({
        userId: zUuid.optional(),
        userName: zString.optional(),
      });
      const validation = validator.safeParse(req.params);
      if (!validation.success) {
        throwsValidationError(validation);
      }
      const user = await getUser(ctx, validation.data);
      res.json(user);
    },
  );
}
