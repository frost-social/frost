import type { Router } from "express";
import { z } from "zod";
import { checkScope, tokenAuth } from "../core/authorization.js";
import type { DB } from "../core/database.js";
import {
  createRequestContext,
  throwsValidationError,
} from "../core/restApi.js";
import { type UserObject, getUser } from "../services/UserService.js";

const zGetUserInput = z.object({
  userId: z.string().uuid().optional(),
  userName: z.string().min(1).optional(),
});
export type GetUserInput = z.infer<typeof zGetUserInput>;

export function userController(router: Router, db: DB) {
  // GetUser
  router.get(
    "/users/@:userName",
    tokenAuth(),
    checkScope("user.read"),
    async (req, res) => {
      const ctx = await createRequestContext(req.user as UserObject, db);
      const validation = zGetUserInput.safeParse(req.params);
      if (!validation.success) {
        throwsValidationError(validation);
      }
      const user = await getUser(ctx, validation.data);
      res.json(user);
    },
  );
}
