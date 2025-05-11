import type { RequestContext } from "../core/restApi.js";

export type PasswordRow = {
  user_id: string;
  algorithm: string;
  salt: string;
  iteration: number;
  hash: string;
};

export type PasswordObject = {
  userId: string;
  algorithm: string;
  salt: string;
  iteration: number;
  hash: string;
};

export function mapPasswordObject(row: PasswordRow): PasswordObject {
  return {
    userId: row.user_id,
    algorithm: row.algorithm,
    salt: row.salt,
    iteration: row.iteration,
    hash: row.hash,
  };
}

/*
 * パスワード検証情報を追加する
 */
export async function createPasswordRecord(
  ctx: RequestContext,
  params: {
    userId: string;
    algorithm: string;
    salt: string;
    iteration: number;
    hash: string;
  },
): Promise<PasswordObject> {
  const row = await ctx.db.password_verification.create({
    data: {
      user_id: params.userId,
      algorithm: params.algorithm,
      salt: params.salt,
      iteration: params.iteration,
      hash: params.hash,
    },
  });
  return mapPasswordObject(row);
}

/*
 * パスワード検証情報を取得する
 */
export async function getPasswordRecord(
  ctx: RequestContext,
  params: { userId: string },
): Promise<PasswordObject | undefined> {
  const row = await ctx.db.password_verification.findFirst({
    where: {
      user_id: params.userId,
    },
  });

  if (row == null) {
    return undefined;
  }

  return mapPasswordObject(row);
}

/**
 * パスワード検証情報を削除する
 * @returns 削除に成功したかどうか
 */
export async function deletePasswordRecord(
  ctx: RequestContext,
  params: { userId: string },
): Promise<boolean> {
  const result = await ctx.db.password_verification.deleteMany({
    where: {
      user_id: params.userId,
    },
  });

  return result.count > 0;
}
