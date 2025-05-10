import type { Router } from "express";
import type { DB } from "../core/database.js";
import { getUser } from "../services/UserService.js";

export function defineUserRoutes(router: Router, db: DB) {
  router.get("/api/v1/users/@:userName", async (req, res) => {
    const info = { userId: "test" };
    const user = await getUser({
      userName: req.params.userName,
    }, info, db);
    res.json(user);
  });
}
