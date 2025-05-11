import type { Router } from "express";
import { z } from "zod";
import type { DB } from "../core/database.js";
import {
  throwsValidationError,
} from "../core/restApi.js";

const zEchoInput = z.object({
  message: z.string(),
});
export type EchoInput = z.infer<typeof zEchoInput>;

export function otherController(router: Router, db: DB) {
  // Echo (GET)
  router.get("/echo", async (req, res) => {
    const validation = zEchoInput.safeParse(req.query);
    if (!validation.success) {
      throwsValidationError(validation);
    }
    res.json({
      message: validation.data,
    });
  });

  // Echo (POST)
  router.post("/echo", async (req, res) => {
    const validation = zEchoInput.safeParse(req.body);
    if (!validation.success) {
      throwsValidationError(validation);
    }
    res.json({
      message: validation.data,
    });
  });
}
