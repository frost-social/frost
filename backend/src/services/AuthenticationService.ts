import crypto from "node:crypto";
import type { components } from "../../openapi/generated/schema.js";
import type {
  SigninInputSchema,
  SigninOutputSchema,
  SignupInputSchema,
  SignupOutputSchema,
} from "../controllers/AuthController.js";
import {
  BadRequest,
  type RequestContext,
  ResourceNotFound,
  RestError,
} from "../core/restApi.js";
import {
  type PasswordObject,
  createPasswordRecord,
  getPasswordRecord,
} from "../models/PasswordModel.js";
import { createUserRecord, getUserRecord } from "../models/UserModel.js";
import * as TokenService from "./TokenService.js";

export type AuthResultObject = components["schemas"]["Api.v1.AuthInfo"];

/**
 * ユーザーを登録します。
 * 登録に成功すると、そのユーザーのトークンと登録情報が返されます。
 */
export async function signup(
  ctx: RequestContext,
  params: SignupInputSchema,
): Promise<SignupOutputSchema> {
  if (params.password == null) {
    throw new RestError({
      code: "authMethodRequired",
      message: "Authentication method required.",
      status: 400,
    });
  }

  const passwordAuthEnabled = params.password != null;

  const user = await createUserRecord(ctx, {
    userName: params.userName,
    displayName: params.displayName,
    passwordAuthEnabled: passwordAuthEnabled,
  });

  if (passwordAuthEnabled) {
    await registerPassword(ctx, {
      userId: user.userId,
      password: params.password,
    });
  }

  const scopes = [
    "user.read",
    "user.write",
    "leaf.read",
    "leaf.write",
    "leaf.delete",
  ];

  const accessToken = await TokenService.createToken(ctx, {
    userId: user.userId,
    tokenKind: "access_token",
    scopes: scopes,
  });

  const refreshToken = await TokenService.createToken(ctx, {
    userId: user.userId,
    tokenKind: "refresh_token",
    scopes: scopes,
  });

  return { accessToken, refreshToken, user };
}

/**
 * 指定された認証情報でユーザーを認証します。
 * 認証に成功すると、そのユーザーのトークンと登録情報が返されます。
 */
export async function signin(
  ctx: RequestContext,
  params: SigninInputSchema,
): Promise<SigninOutputSchema> {
  const user = await getUserRecord(ctx, {
    userName: params.userName,
  });

  if (user == null) {
    throw new RestError(new ResourceNotFound("User"));
  }

  if (params.password != null) {
    if (!user.passwordAuthEnabled) {
      throw new RestError({
        code: "incorrectCredential",
        message: "The userName and/or password is incorrect.",
        status: 401,
      });
    }
    const verification = await verifyPassword(ctx, {
      userId: user.userId,
      password: params.password,
    });
    if (!verification) {
      throw new RestError({
        code: "incorrectCredential",
        message: "The userName and/or password is incorrect.",
        status: 401,
      });
    }
    const scopes = [
      "user.read",
      "user.write",
      "leaf.read",
      "leaf.write",
      "leaf.delete",
    ];
    const accessToken = await TokenService.createToken(ctx, {
      userId: user.userId,
      tokenKind: "access_token",
      scopes: scopes,
    });
    const refreshToken = await TokenService.createToken(ctx, {
      userId: user.userId,
      tokenKind: "refresh_token",
      scopes: scopes,
    });
    return { accessToken, refreshToken, user };
  }

  throw new RestError({
    code: "authMethodRequired",
    message: "Authentication method required.",
    status: 400,
  });
}

/**
 * パスワードの検証情報を作成します。
 */
export async function registerPassword(
  ctx: RequestContext,
  params: { userId: string; password: string },
): Promise<void> {
  if (params.password.length < 8) {
    throw new RestError(new BadRequest([{ message: "password invalid." }]));
  }
  const entity = generatePasswordVerification({
    userId: params.userId,
    password: params.password,
  });
  await createPasswordRecord(ctx, entity);
}

/**
 * パスワード検証情報を用いてパスワードが正しいかどうかを確認します。
 */
export async function verifyPassword(
  ctx: RequestContext,
  params: { userId: string; password: string },
): Promise<boolean> {
  const v = await getPasswordRecord(ctx, {
    userId: params.userId,
  });
  if (v == null) {
    throw new Error("PasswordVerification record not found");
  }
  const hash = generatePasswordHash({
    token: params.password,
    algorithm: v.algorithm,
    salt: v.salt,
    iteration: v.iteration,
  });
  return hash === v.hash;
}

/**
 * パスワード認証情報を生成します。
 * @internal
 */
export function generatePasswordVerification(params: {
  userId: string;
  password: string;
}): PasswordObject {
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
function generatePasswordHash(params: {
  token: string;
  algorithm: string;
  salt: string;
  iteration: number;
}): string {
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
