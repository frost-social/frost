import type { Router } from "express";
import { z } from "zod";
import { checkScope, tokenAuth } from "../core/authorization.js";
import type { DB } from "../core/database.js";
import {
  createRequestContext,
  throwsValidationError,
} from "../core/restApi.js";
import type { UserObject } from "../services/UserService.js";

export function chatRoomController(router: Router, db: DB) {

}
