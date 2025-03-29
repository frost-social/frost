import { AccessInfo } from "../modules/AccessInfo";
import { DB } from "../modules/db";
import { token, Prisma, token_scope } from "@prisma/client/";

export type TokenKind = "access_token" | "refresh_token";

export type TokenEntity = {
  userId: string;
  tokenKind: TokenKind;
  token: string;
  scopes: string[];
};

/**
 * トークン情報を追加する
*/
export async function createToken(
  params: { userId: string, tokenKind: TokenKind, scopes: string[], token: string, },
  info: AccessInfo,
  db: DB,
): Promise<TokenEntity> {
  const tokenScopes: Prisma.token_scopeCreateManyTokenInput[] = params.scopes.map(scope => {
    return {
      scope_name: scope,
    };
  });

  // トークンを登録
  const token = await db.token.create({
    data: {
      token_kind: params.tokenKind,
      user_id: params.userId,
      token: params.token,
      scopes: {
        createMany: {
          data: tokenScopes,
        }
      },
    },
    include: {
      scopes: true,
    },
  });

  return mapEntity(token);
}

/**
 * トークン情報を取得する
*/
export async function getToken(
  params: { token: string },
  info: AccessInfo,
  db: DB,
): Promise<TokenEntity | undefined> {
  // トークン情報を取得
  const row = await db.token.findFirst({
    where: {
      token: params.token,
    },
    include: {
      scopes: true,
    },
  });
  if (row == null) {
    return undefined;
  }

  return mapEntity(row);
}

/**
 * トークン情報を削除する
 * @returns 削除に成功したかどうか
*/
export async function deleteToken(
  params: { token: string },
  info: AccessInfo,
  db: DB,
): Promise<boolean> {
  const tokenRecord = await db.token.findFirst({
    where: {
      token: params.token,
    },
    select: {
      token_id: true,
    },
  });
  if (tokenRecord == null) {
    return false;
  }

  // トークンの権限を削除 (0件以上)
  await db.token_scope.deleteMany({
    where: {
      token_id: tokenRecord.token_id,
    },
  });

  // トークンを削除
  const result = await db.token.deleteMany({
    where: {
      token_id: tokenRecord.token_id,
    },
  });
  if (result.count == 0) {
    return false;
  }

  return true;
}

export function mapEntity(row: token & { scopes: token_scope[] }): TokenEntity {
  return {
    userId: row.user_id,
    tokenKind: row.token_kind as TokenKind,
    token: row.token,
    scopes: row.scopes.map(x => x.scope_name),
  };
}
