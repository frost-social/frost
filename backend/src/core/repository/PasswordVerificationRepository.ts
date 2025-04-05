import { password_verification } from "@prisma/client";
import { DB } from "../database";
import { AccessInfo } from "../service";

export type PasswordVerificationEntity = {
  userId: string,
  algorithm: string,
  salt: string,
  iteration: number,
  hash: string,
};

/*
 * パスワード検証情報を追加する
*/
export async function createVerification(
  params: { userId: string, algorithm: string, salt: string, iteration: number, hash: string },
  info: AccessInfo,
  db: DB,
): Promise<PasswordVerificationEntity> {
  const row = await db.password_verification.create({
    data: {
      user_id: params.userId,
      algorithm: params.algorithm,
      salt: params.salt,
      iteration: params.iteration,
      hash: params.hash,
    },
  });

  return mapEntity(row);
}

/*
 * パスワード検証情報を取得する
*/
export async function getVerification(
  params: { userId: string },
  info: AccessInfo,
  db: DB,
): Promise<PasswordVerificationEntity | undefined> {
  const row = await db.password_verification.findFirst({
    where: {
      user_id: params.userId,
    },
  });

  if (row == null) {
    return undefined;
  }

  return mapEntity(row);
}

/**
 * パスワード検証情報を削除する
 * @returns 削除に成功したかどうか
*/
export async function deleteVerification(
  params: { userId: string },
  info: AccessInfo,
  db: DB,
): Promise<boolean> {
  const result = await db.password_verification.deleteMany({
    where: {
      user_id: params.userId,
    },
  });

  return (result.count > 0);
}

export function mapEntity(row: password_verification): PasswordVerificationEntity {
  return {
    userId: row.user_id,
    algorithm: row.algorithm,
    salt: row.salt,
    iteration: row.iteration,
    hash: row.hash,
  };
}
