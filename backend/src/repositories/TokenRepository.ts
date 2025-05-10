import type { DB } from "../core/database.js";
import type { AccessInfo } from "../core/service.js";

export type TokenEntity = {
  userId: string;
  tokenKind: TokenKind;
  token: string;
  scopes: string[];
};

export type TokenKind = "access_token" | "refresh_token";

export type TokenScopeEntity = string;

export type TokenRow = {
  user_id: string;
  token_kind: string;
  token: string;
  scopes: TokenScopeRow[];
};

export type TokenScopeRow = {
  scope_name: string;
};

export function mapTokenEntity(row: TokenRow): TokenEntity {
  return {
    userId: row.user_id,
    tokenKind: row.token_kind as TokenKind,
    token: row.token,
    scopes: row.scopes.map(x => mapTokenScopeEntity(x)),
  };
}

export function mapTokenScopeEntity(row: TokenScopeRow): TokenScopeEntity {
  return row.scope_name;
}

/**
 * トークン情報を追加する
*/
export async function createTokenEntity(
  params: { userId: string, tokenKind: TokenKind, scopes: string[], token: string, },
  info: AccessInfo,
  db: DB,
): Promise<TokenEntity> {
  const tokenScopes: TokenScopeRow[] = params.scopes.map(scope => {
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

  return mapTokenEntity(token);
}

/**
 * トークン情報を取得する
*/
export async function getTokenEntity(
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

  return mapTokenEntity(row);
}

/**
 * トークン情報を取得する
*/
export async function getTokenEntitiesOfUser(
  params: { userId: string },
  info: AccessInfo,
  db: DB,
): Promise<TokenEntity[]> {
  // トークン情報を取得
  const rows = await db.token.findMany({
    where: {
      user: {
        user_id: params.userId,
      }
    },
    include: {
      scopes: true,
    },
  });
  return rows.map(row => mapTokenEntity(row));
}

/**
 * トークン情報を削除する
 * @returns 削除に成功したかどうか
*/
export async function deleteTokenEntity(
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
