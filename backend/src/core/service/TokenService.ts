import crypto from "node:crypto";
import type { components } from "../../../openapi/generated/schema.js";
import type { DB } from "../database.js";
import {
  type TokenKind,
  createTokenEntity,
  getTokenEntity,
} from "../repository/TokenRepository.js";
import { getUserEntity } from "../repository/UserRepository.js";
import {
  BadRequest,
  ResourceNotFound,
  RestError,
  Unauthenticated,
} from "../restApi.js";
import type { AccessInfo } from "../service.js";

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
  params: {
    userId: string;
    tokenKind: TokenKind;
    scopes: string[];
  },
  info: AccessInfo,
  db: DB,
): Promise<TokenObject> {
  // ユーザーが存在しないトークンは作成できない
  const userEntity = await getUserEntity({
    userId: params.userId,
  }, info, db);
  if (userEntity == null) {
    throw new RestError(new ResourceNotFound("user"));
  }

  const tokenValue = generateTokenValue(32);

  // TODO: 一応トークンの重複を確認

  const tokenEntity = await createTokenEntity({
    userId: params.userId,
    tokenKind: params.tokenKind,
    scopes: params.scopes,
    token: tokenValue,
  }, info, db);

  return tokenEntity;
}

/**
 * トークン情報を取得します。
 */
export async function getTokenInfo(
  params: { token: string },
  info: AccessInfo,
  db: DB,
): Promise<{
  tokenKind: TokenKind;
  userId: string;
  scopes: string[];
}> {
  if (params.token.length < 1) {
    throw new RestError(new BadRequest([{ message: "token invalid." }]));
  }
  const t = await getTokenEntity({
    token: params.token,
  }, info, db);
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
