import type { RequestContext } from "../core/restApi.js";

export type TokenObject = {
  userId: string;
  tokenKind: TokenKind;
  token: string;
  scopes: string[];
};

export type TokenKind = "access_token" | "refresh_token";

export type TokenRow = {
  user_id: string;
  token_kind: string;
  token: string;
  scopes: TokenScopeRow[];
};

export type TokenScopeRow = {
  scope_name: string;
};

export function mapTokenObject(row: TokenRow): TokenObject {
  return {
    userId: row.user_id,
    tokenKind: row.token_kind as TokenKind,
    token: row.token,
    scopes: row.scopes.map((x) => x.scope_name),
  };
}

/**
 * トークン情報を追加する
 */
export async function createTokenRecord(
  ctx: RequestContext,
  params: {
    userId: string;
    tokenKind: TokenKind;
    scopes: string[];
    token: string;
  },
): Promise<TokenObject> {
  const tokenScopes: TokenScopeRow[] = params.scopes.map((scope) => {
    return {
      scope_name: scope,
    };
  });

  // トークンを登録
  const token = await ctx.db.token.create({
    data: {
      token_kind: params.tokenKind,
      user_id: params.userId,
      token: params.token,
      scopes: {
        createMany: {
          data: tokenScopes,
        },
      },
    },
    include: {
      scopes: true,
    },
  });

  return mapTokenObject(token);
}

/**
 * トークン情報を取得する
 */
export async function getTokenRecord(
  ctx: RequestContext,
  params: { token: string },
): Promise<TokenObject | undefined> {
  // トークン情報を取得
  const row = await ctx.db.token.findFirst({
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

  return mapTokenObject(row);
}

/**
 * トークン情報を取得する
 */
export async function getTokenRecordsOfUser(
  ctx: RequestContext,
  params: { userId: string },
): Promise<TokenObject[]> {
  // トークン情報を取得
  const rows = await ctx.db.token.findMany({
    where: {
      user: {
        user_id: params.userId,
      },
    },
    include: {
      scopes: true,
    },
  });
  return rows.map((row) => mapTokenObject(row));
}

/**
 * トークン情報を削除する
 * @returns 削除に成功したかどうか
 */
export async function deleteTokenRecord(
  ctx: RequestContext,
  params: { token: string },
): Promise<boolean> {
  const tokenRecord = await ctx.db.token.findFirst({
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
  await ctx.db.token_scope.deleteMany({
    where: {
      token_id: tokenRecord.token_id,
    },
  });

  // トークンを削除
  const result = await ctx.db.token.deleteMany({
    where: {
      token_id: tokenRecord.token_id,
    },
  });
  if (result.count === 0) {
    return false;
  }

  return true;
}
