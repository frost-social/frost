import type { DB } from "../core/database.js";
import type { AccessInfo } from "../core/service.js";

export type PasswordEntity = {
  userId: string;
  algorithm: string;
  salt: string;
  iteration: number;
  hash: string;
};

export type PasswordRow = {
  user_id: string;
  algorithm: string;
  salt: string;
  iteration: number;
  hash: string;
};

export function mapPasswordEntity(row: PasswordRow): PasswordEntity {
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
export async function createPasswordEntity(
  params: {
    userId: string;
    algorithm: string;
    salt: string;
    iteration: number;
    hash: string;
  },
  info: AccessInfo,
  db: DB,
): Promise<PasswordEntity> {
  const row = await db.password_verification.create({
    data: {
      user_id: params.userId,
      algorithm: params.algorithm,
      salt: params.salt,
      iteration: params.iteration,
      hash: params.hash,
    },
  });
  return mapPasswordEntity(row);
}

/*
 * パスワード検証情報を取得する
 */
export async function getPasswordEntity(
  params: { userId: string },
  info: AccessInfo,
  db: DB,
): Promise<PasswordEntity | undefined> {
  const row = await db.password_verification.findFirst({
    where: {
      user_id: params.userId,
    },
  });

  if (row == null) {
    return undefined;
  }

  return mapPasswordEntity(row);
}

/**
 * パスワード検証情報を削除する
 * @returns 削除に成功したかどうか
 */
export async function deletePasswordEntity(
  params: { userId: string },
  info: AccessInfo,
  db: DB,
): Promise<boolean> {
  const result = await db.password_verification.deleteMany({
    where: {
      user_id: params.userId,
    },
  });

  return result.count > 0;
}
