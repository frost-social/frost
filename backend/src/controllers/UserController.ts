import type { Router } from "express";
import { z } from "zod";
import { checkScope, tokenAuth } from "../core/authorization.js";
import type { DB } from "../core/database.js";
import {
  createRequestContext,
  throwsValidationError,
} from "../core/restApi.js";
import { type UserObject, getUser } from "../services/UserService.js";

const getUserInput = z.object({
  userId: z.string().uuid().optional(),
  userName: z.string().min(1).optional(),
});
export type GetUserInput = z.infer<typeof getUserInput>;

export function userController(router: Router, db: DB) {
  // GetUser
  router.get(
    "/user/getUser",
    tokenAuth(),
    checkScope("user.read"),
    async (req, res) => {
      const ctx = await createRequestContext(req.user as UserObject, db);
      const validation = getUserInput.safeParse(req.query);
      if (!validation.success) {
        throwsValidationError(validation);
      }
      const user = await getUser(ctx, validation.data);
      res.json(user);
    },
  );
}
