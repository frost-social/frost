import type { Router } from "express";
import { z } from "zod";
import { checkScope, tokenAuth } from "../core/authorization.js";
import type { DB } from "../core/database.js";
import {
  createRequestContext,
  defineApiRoute,
  validateApiData,
} from "../core/restApi.js";

export const apiBasePath = "/api/v1";

export function chatRoomController(router: Router, db: DB) {

}
