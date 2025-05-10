import type { components } from "../../openapi/generated/schema.js";
import type { DB } from "../core/database.js";
import { BadRequest, ResourceNotFound, RestError } from "../core/restApi.js";
import type { AccessInfo } from "../core/service.js";
import { createUserEntity, deleteUserEntity, getUserEntity } from "../repositories/UserRepository.js";

export type UserObject = components['schemas']['Api.v1.User'];
export type AuthResultObject = components['schemas']['Api.v1.AuthInfo'];

/**
 * ユーザー情報を取得します。
*/
export async function createUser(
  params: { userName: string, displayName?: string, password?: string },
  info: AccessInfo,
  db: DB,
): Promise<UserObject> {
  const user = await createUserEntity({
    userName: params.userName,
    displayName: params.displayName,
    passwordAuthEnabled: true,
  }, info, db);

  return user;
}

/**
 * ユーザー情報を取得します。
*/
export async function getUser(
  params: { userId?: string, userName?: string },
  info: AccessInfo,
  db: DB,
): Promise<UserObject> {
  // either userId or userName must be specified
  if ([params.userId, params.userName].every(x => x == null)) {
    throw new RestError(new BadRequest([
      { message: "Please specify the userId or userName." },
    ]));
  }

  const userEntity = await getUserEntity({
    userId: params.userId,
    userName: params.userName,
  }, info, db);

  if (userEntity == null) {
    throw new RestError(new ResourceNotFound("User"));
  }

  return userEntity;
}

/**
 * ユーザー情報を削除します。
*/
export async function deleteUser(
  params: { userId: string },
  info: AccessInfo,
  db: DB,
): Promise<void> {
  const success = await deleteUserEntity({
    userId: params.userId,
  }, info, db);

  if (!success) {
    throw new RestError(new ResourceNotFound("User"));
  }
}
