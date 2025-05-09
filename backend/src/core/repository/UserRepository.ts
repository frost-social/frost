import type { user } from "@prisma/client";
import type { DB } from "../database.js";
import type { AccessInfo } from "../service.js";

export type UserEntity = {
  userId: string;
  userName: string;
  displayName: string;
  passwordAuthEnabled: boolean;
};

/**
 * ユーザーを追加する
*/
export async function createUser(
  params: {
    userName: string;
    displayName: string;
    passwordAuthEnabled: boolean;
  },
  info: AccessInfo,
  db: DB,
) {
  const row = await db.user.create({
    data: {
      name: params.userName,
      display_name: params.displayName,
      password_auth_enabled: params.passwordAuthEnabled,
    },
  });

  return mapUser(row);
}

/**
 * ユーザーを取得する
*/
export async function getUser(
  params: { userId?: string; userName?: string },
  info: AccessInfo,
  db: DB,
): Promise<UserEntity | undefined> {
  if ([params.userId, params.userName].every((x) => x == null)) {
    throw new Error("invalid condition");
  }

  const row = await db.user.findFirst({
    where: {
      user_id: params.userId,
      name: params.userName,
    }
  });

  if (row == null) {
    return undefined;
  }

  return mapUser(row);
}

/**
 * ユーザーを削除する
 * @returns 削除に成功したかどうか
*/
export async function deleteUser(
  params: { userId: string },
  info: AccessInfo,
  db: DB,
): Promise<boolean> {
  const result = await db.user.deleteMany({
    where: {
      user_id: params.userId,
    },
  });

  return result.count > 0;
}

export function mapUser(row: user): UserEntity {
  return {
    userId: row.user_id,
    userName: row.name,
    displayName: row.display_name,
    passwordAuthEnabled: row.password_auth_enabled,
  };
}
