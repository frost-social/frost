import type { Router } from "express";
import { z } from "zod";
import type { DB } from "../core/database.js";
import {
  throwsValidationError,
} from "../core/restApi.js";

const echoInput = z.object({
  message: z.string(),
});
export type EchoInput = z.infer<typeof echoInput>;

export function otherController(router: Router, db: DB) {
  // Echo (GET)
  router.get("/echo", async (req, res) => {
    const validation = echoInput.safeParse(req.query);
    if (!validation.success) {
      throwsValidationError(validation);
    }
    res.json(validation.data);
  });

  // Echo (POST)
  router.post("/echo", async (req, res) => {
    const validation = echoInput.safeParse(req.body);
    if (!validation.success) {
      throwsValidationError(validation);
    }
    res.json(validation.data);
  });
}
