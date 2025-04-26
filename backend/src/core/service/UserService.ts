import crypto from "node:crypto";
import type { components } from '../../../openapi/generated/schema';
import type { DB } from "../database";
import * as PasswordVerificationRepository from "../repository/PasswordVerificationRepository";
import type { PasswordVerificationEntity } from "../repository/PasswordVerificationRepository";
import * as UserRepository from "../repository/UserRepository";
import { BadRequest, ResourceNotFound, RestError } from "../restApi";
import type { AccessInfo } from "../service";
import * as TokenService from "./TokenService";

export type UserObject = components['schemas']['Api.v1.User'];
export type AuthResultObject = components['schemas']['Api.v1.AuthInfo'];

/**
 * ユーザーを登録します。
 * 登録に成功すると、そのユーザーのトークンと登録情報が返されます。
*/
export async function signup(
  params: { userName: string, displayName: string, password?: string },
  info: AccessInfo,
  db: DB,
): Promise<AuthResultObject> {
  if (params.userName.length < 5) {
    throw new RestError(new BadRequest([
      { message: 'userName invalid.' },
    ]));
  }

  if (params.password == null) {
    throw new RestError({
      code: "authMethodRequired",
      message: "Authentication method required.",
      status: 400,
    });
  }

  const user = await UserRepository.createUser({
    userName: params.userName,
    displayName: params.displayName,
    passwordAuthEnabled: true,
  }, info, db);

  await registerPassword({
    userId: user.userId,
    password: params.password,
  }, info, db);

  const scopes = ["user.read", "user.write", "leaf.read", "leaf.write", "leaf.delete"];

  const accessToken = await TokenService.createToken({
    userId: user.userId,
    tokenKind: "access_token",
    scopes: scopes,
  }, info, db);

  const refreshToken = await TokenService.createToken({
    userId: user.userId,
    tokenKind: "refresh_token",
    scopes: scopes,
  }, info, db);

  return { accessToken, refreshToken, user };
}

/**
 * 指定された認証情報でユーザーを認証します。
 * 認証に成功すると、そのユーザーのトークンと登録情報が返されます。
*/
export async function signin(
  params: { userName: string, password?: string },
  info: AccessInfo,
  db: DB,
): Promise<AuthResultObject> {
  if (params.userName.length < 1) {
    throw new RestError(new BadRequest([
      { message: 'userName invalid.' },
    ]));
  }

  const user = await UserRepository.getUser({
    userName: params.userName,
  }, info, db);

  if (user == null) {
    throw new RestError(new ResourceNotFound("User"));
  }

  if (user.passwordAuthEnabled) {
    if (params.password == null || params.password.length < 1) {
      throw new RestError(new BadRequest([
        { message: 'password invalid.' },
      ]));
    }
    const verification = await verifyPassword({
      userId: user.userId,
      password: params.password,
    }, info, db);
    if (!verification) {
      throw new RestError({
        code: "incorrectCredential",
        message: "The userName and/or password is incorrect.",
        status: 401,
      });
    }
    const scopes = ["user.read", "user.write", "leaf.read", "leaf.write", "leaf.delete"];
    const accessToken = await TokenService.createToken({
      userId: user.userId,
      tokenKind: "access_token",
      scopes: scopes,
    }, info, db);
    const refreshToken = await TokenService.createToken({
      userId: user.userId,
      tokenKind: "refresh_token",
      scopes: scopes,
    }, info, db);
    return { accessToken, refreshToken, user };
  }

  throw new Error(`authentication method not exists: ${user.userId}`);
}

/**
 * パスワードの検証情報を作成します。
*/
export async function registerPassword(
  params: { userId: string, password: string },
  info: AccessInfo,
  db: DB,
): Promise<void> {
  if (params.password.length < 8) {
    throw new RestError(new BadRequest([
      { message: 'password invalid.' },
    ]));
  }
  const entity = generatePasswordVerification({
    userId: params.userId,
    password: params.password,
  });
  await PasswordVerificationRepository.createVerification(entity, info, db);
}

/**
 * パスワード検証情報を用いてパスワードが正しいかどうかを確認します。
*/
export async function verifyPassword(
  params: { userId: string, password: string },
  info: AccessInfo,
  db: DB,
): Promise<boolean> {
  if (params.password.length < 1) {
    throw new RestError(new BadRequest([
      { message: 'password invalid.' },
    ]));
  }
  const v = await PasswordVerificationRepository.getVerification({
    userId: params.userId,
  }, info, db);
  if (v == null) {
    throw new Error("PasswordVerification record not found");
  }
  const hash = generatePasswordHash({
    token: params.password,
    algorithm: v.algorithm,
    salt: v.salt,
    iteration: v.iteration,
  });
  return (hash === v.hash);
}

/**
 * パスワード認証情報を生成します。
 * @internal
*/
export function generatePasswordVerification(params: { userId: string, password: string }): PasswordVerificationEntity {
  const algorithm = "sha256";
  const salt = generatePasswordSalt();
  const iteration = 100000;
  const hash = generatePasswordHash({
    token: params.password,
    algorithm,
    salt,
    iteration,
  });
  return {
    userId: params.userId,
    algorithm,
    salt,
    iteration,
    hash,
  };
}

/**
 * ハッシュを生成します。
 * @internal
*/
function generatePasswordHash(params: { token: string, algorithm: string, salt: string, iteration: number }): string {
  if (params.iteration < 1) {
    throw new Error("The iteration value must be 1 or greater");
  }
  let token = params.token;
  for (let i = 0; i < params.iteration; i++) {
    token = crypto.hash(params.algorithm, token + params.salt, "hex");
  }
  return token;
}

/**
 * 塩を生成します。
 * @internal
*/
function generatePasswordSalt(): string {
  // 128bit random (length = 32)
  return crypto.randomBytes(16).toString("hex");
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

  const userEntity = await UserRepository.getUser({
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
  const success = await UserRepository.deleteUser({
    userId: params.userId,
  }, info, db);

  if (!success) {
    throw new RestError(new ResourceNotFound("User"));
  }
}
