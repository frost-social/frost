import crypto from "node:crypto";
import type { components } from "../../openapi/generated/schema.js";
import type { DB } from "../core/database.js";
import {
  BadRequest,
  type RequestContext,
  ResourceNotFound,
  RestError,
  Unauthenticated,
} from "../core/restApi.js";
import {
  type TokenKind,
  createTokenEntity,
  getTokenEntity,
} from "../models/TokenModel.js";
import { getUserEntity } from "../models/UserModel.js";

const asciiTable =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export type tokenInfoObject = {
  tokenKind: TokenKind;
  userId: string;
  scopes: string[];
};

export type TokenObject = components["schemas"]["Api.v1.Token"];

/**
 * トークン情報を追加します。
 */
export async function createToken(
  ctx: RequestContext,
  params: {
    userId: string;
    tokenKind: TokenKind;
    scopes: string[];
  },
): Promise<TokenObject> {
  // ユーザーが存在しないトークンは作成できない
  const userEntity = await getUserEntity(ctx, {
    userId: params.userId,
  });
  if (userEntity == null) {
    throw new RestError(new ResourceNotFound("user"));
  }

  const tokenValue = generateTokenValue(32);

  // TODO: 一応トークンの重複を確認

  const tokenEntity = await createTokenEntity(ctx, {
    userId: params.userId,
    tokenKind: params.tokenKind,
    scopes: params.scopes,
    token: tokenValue,
  });

  return tokenEntity;
}

/**
 * トークン情報を取得します。
 */
export async function getTokenInfo(
  ctx: RequestContext,
  params: { token: string },
): Promise<{
  tokenKind: TokenKind;
  userId: string;
  scopes: string[];
}> {
  if (params.token.length < 1) {
    throw new RestError(new BadRequest([{ message: "token invalid." }]));
  }
  const t = await getTokenEntity(ctx, {
    token: params.token,
  });
  if (t == null) {
    throw new RestError(new Unauthenticated());
  }
  return t;
}

/**
 * トークンの値を生成します。
 * @internal
 */
export function generateTokenValue(length: number): string {
  let token = "";
  for (const byte of crypto.randomBytes(length).values()) {
    token += asciiTable[byte % asciiTable.length];
  }
  return token;
}
