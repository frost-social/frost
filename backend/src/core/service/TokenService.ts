import crypto from "node:crypto";
import type { components } from '../../../openapi/generated/schema';
import type { DB } from "../database";
import * as TokenRepository from "../repository/TokenRepository";
import * as UserRepository from "../repository/UserRepository";
import { BadRequest, ResourceNotFound, RestError, Unauthenticated } from "../restApi";
import type { AccessInfo } from "../service";

const asciiTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export type tokenInfoObject = {
  tokenKind: TokenRepository.TokenKind,
  userId: string,
  scopes: string[]
};

export type TokenObject = components['schemas']['Api.v1.Token'];

/**
 * トークン情報を追加します。
*/
export async function createToken(
  params: { userId: string, tokenKind: TokenRepository.TokenKind, scopes: string[] },
  info: AccessInfo,
  db: DB,
): Promise<TokenObject> {
  // ユーザーが存在しないトークンは作成できない
  const userEntity = await UserRepository.getUser({
    userId: params.userId,
  }, info, db);
  if (userEntity == null) {
    throw new RestError(new ResourceNotFound('user'));
  }

  const tokenValue = generateTokenValue(32);

  // TODO: 一応トークンの重複を確認

  const tokenEntity = await TokenRepository.createToken({
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
): Promise<{ tokenKind: TokenRepository.TokenKind, userId: string, scopes: string[] }> {
  if (params.token.length < 1) {
    throw new RestError(new BadRequest([
      { message: 'token invalid.' },
    ]));
  }
  const t = await TokenRepository.getToken({
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
