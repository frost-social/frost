import express from "express";
import { authController } from "./controllers/AuthController.js";
import { chatRoomController } from "./controllers/ChatRoomController.js";
import { leafController } from "./controllers/LeafController.js";
import { otherController } from "./controllers/OtherController.js";
import { userController } from "./controllers/UserController.js";
import { userRelationController } from "./controllers/UserRelationController.js";
import type { DB } from "./core/database.js";
import { EndpointNotFound, RestError, buildRestApiError, corsApi } from "./core/restApi.js";

export function baseRouter(db: DB) {
  const router = express.Router();

  return router;
}

export function apiVersion1Router(db: DB) {
  const router = express.Router();
  router.use(express.json());
  router.use(corsApi());

  // controllers
  authController(router, db);
  chatRoomController(router, db);
  leafController(router, db);
  otherController(router, db);
  userController(router, db);
  userRelationController(router, db);

  router.use((req, res, next) => {
    next(new RestError(new EndpointNotFound()));
  });

  // @ts-ignore
  router.use((err, req, res, next) => {
    const errorResponse = buildRestApiError(err);
    res.status(errorResponse.error.status).json(errorResponse);
    return;
  });

  return router;
}
