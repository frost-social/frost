import type { components } from "../../openapi/generated/schema.js";
import type { GetUserInputSchema, GetUserOutputSchema } from "../controllers/UserController.js";
import {
  BadRequest,
  type RequestContext,
  ResourceNotFound,
  RestError,
} from "../core/restApi.js";
import {
  createUserRecord,
  deleteUserRecord,
  getUserRecord,
} from "../models/UserModel.js";

export type UserObject = components["schemas"]["Api.v1.User"];
export type AuthResultObject = components["schemas"]["Api.v1.AuthInfo"];

/**
 * ユーザー情報を取得します。
 */
export async function createUser(
  params: { userName: string; displayName?: string },
  ctx: RequestContext,
): Promise<UserObject> {
  const user = await createUserRecord(ctx, {
    userName: params.userName,
    displayName: params.displayName,
    passwordAuthEnabled: true,
  });

  return user;
}

/**
 * ユーザー情報を取得します。
 */
export async function getUser(
  ctx: RequestContext,
  params: GetUserInputSchema,
): Promise<GetUserOutputSchema> {
  // either userId or userName must be specified
  if ([params.userId, params.userName].every((x) => x == null)) {
    throw new RestError(
      new BadRequest([{ message: "Please specify the userId or userName." }]),
    );
  }

  const userEntity = await getUserRecord(ctx, {
    userId: params.userId,
    userName: params.userName,
  });

  if (userEntity == null) {
    throw new RestError(new ResourceNotFound("User"));
  }

  return userEntity;
}

/**
 * ユーザー情報を削除します。
 */
export async function deleteUser(
  ctx: RequestContext,
  params: { userId: string },
): Promise<void> {
  const success = await deleteUserRecord(ctx, {
    userId: params.userId,
  });

  if (!success) {
    throw new RestError(new ResourceNotFound("User"));
  }
}
