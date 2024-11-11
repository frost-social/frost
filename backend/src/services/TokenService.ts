import { Container } from "inversify";
import crypto from "node:crypto";
import { AccessContext } from "../modules/AccessContext";
import { appError, BadRequest, ResourceNotFound, Unauthenticated } from "../modules/appErrors";
import { TokenEntity } from "../modules/entities";
import * as TokenRepository from "../repositories/TokenRepository";
import * as UserRepository from "../repositories/UserRepository";

const asciiTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * トークン情報を追加します。
*/
export async function create(
  params: { userId: string, tokenKind: TokenRepository.TokenKind, scopes: string[] },
  ctx: AccessContext,
  container: Container,
): Promise<TokenEntity> {
  // ユーザーが存在しないトークンは作成できない
  const userEntity = await UserRepository.get({
    userId: params.userId,
  }, ctx, container);
  if (userEntity == null) {
    throw appError(new ResourceNotFound('user'));
  }

  const tokenValue = await generateTokenValue(32);

  // TODO: 一応トークンの重複を確認

  const tokenEntity = await TokenRepository.create({
    userId: params.userId,
    tokenKind: params.tokenKind,
    scopes: params.scopes,
    token: tokenValue,
  }, ctx, container);

  return tokenEntity;
}

/**
 * トークン情報を取得します。
*/
export async function getTokenInfo(
  params: { token: string },
  ctx: AccessContext,
  container: Container,
): Promise<{ tokenKind: TokenRepository.TokenKind, userId: string, scopes: string[] }> {
  if (params.token.length < 1) {
    throw appError(new BadRequest([
      { message: 'token invalid.' },
    ]));
  }
  const info = await TokenRepository.get({
    token: params.token,
  }, ctx, container);
  if (info == null) {
    throw appError(new Unauthenticated());
  }
  return info;
}

/**
 * トークンの値を生成します。
 * @internal
*/
export async function generateTokenValue(length: number) {
  let token = "";
  for (const byte of crypto.randomBytes(length).values()) {
    token += asciiTable[byte % asciiTable.length];
  }
  return token;
}
