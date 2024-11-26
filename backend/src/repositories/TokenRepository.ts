import { Container } from "inversify";
import { TYPES } from "../container/types";
import { AccessContext } from "../modules/AccessContext";
import { DB } from "../modules/db";
import { TokenEntity } from "../modules/entities";

export type TokenKind = "access_token" | "refresh_token";

/**
 * トークン情報を追加する
*/
export async function create(
  params: { userId: string, tokenKind: TokenKind, scopes: string[], token: string, },
  ctx: AccessContext,
  container: Container,
): Promise<TokenEntity> {
  const db = container.get<DB>(TYPES.db);

  // トークンを登録
  const token = await db.token.create({
    data: {
      token_kind: params.tokenKind,
      user_id: params.userId,
      token: params.token,
    },
    select: {
      token_id: true,
    },
  });

  // トークンの権限を登録
  if (params.scopes.length > 0) {
    const tokenScopes: { token_id: string, scope_name: string }[] = params.scopes.map(scope => {
      return {
        token_id: token.token_id,
        scope_name: scope,
      };
    });
    await db.token_scope.createMany({
      data: tokenScopes,
    });
  }

  return {
    token: params.token,
    scopes: [...params.scopes],
  };
}

/**
 * トークン情報を取得する
*/
export async function get(
  params: { token: string },
  ctx: AccessContext,
  container: Container,
): Promise<{ tokenKind: TokenKind, userId: string, scopes: string[] } | undefined> {
  const db = container.get<DB>(TYPES.db);

  // トークン情報を取得
  const t = await db.token.findFirst({
    where: {
      token: params.token,
    },
    include: {
      scopes: true,
    },
  });
  if (t == null) {
    return undefined;
  }

  return {
    userId: t.user_id,
    tokenKind: t.token_kind as TokenKind,
    scopes: t.scopes.map(x => x.scope_name),
  };
}

/**
 * トークン情報を削除する
 * @returns 削除に成功したかどうか
*/
export async function remove(
  params: { token: string },
  ctx: AccessContext,
  container: Container,
): Promise<boolean> {
  const db = container.get<DB>(TYPES.db);

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
