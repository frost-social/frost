import type { DB } from "../core/database.js";
import type { RequestContext } from "../core/restApi.js";


export type UserRow = {
  user_id: string;
  name: string;
  display_name: string;
  password_auth_enabled: boolean;
};

export type UserObject = {
  userId: string;
  userName: string;
  displayName: string;
  passwordAuthEnabled: boolean;
};

export function mapUserObject(row: UserRow): UserObject {
  return {
    userId: row.user_id,
    userName: row.name,
    displayName: row.display_name,
    passwordAuthEnabled: row.password_auth_enabled,
  };
}

export async function getInternalUserRecord(db: DB) {
  const row = await db.user.findFirst({
    where: {
      name: "internal",
    },
  });

  if (row == null) {
    throw new Error("failed to get the internal user.");
  }

  return mapUserObject(row);
}

/**
 * ユーザーを追加する
 */
export async function createUserRecord(
  ctx: RequestContext,
  params: {
    userName: string;
    displayName?: string;
    passwordAuthEnabled: boolean;
  },
) {
  const row = await ctx.db.user.create({
    data: {
      name: params.userName,
      display_name: params.displayName,
      password_auth_enabled: params.passwordAuthEnabled,
    },
  });

  return mapUserObject(row);
}

/**
 * ユーザーを取得する
 */
export async function getUserRecord(
  ctx: RequestContext,
  params: { userId?: string; userName?: string },
): Promise<UserObject | undefined> {
  if ([params.userId, params.userName].every((x) => x == null)) {
    throw new Error("invalid condition");
  }

  const row = await ctx.db.user.findFirst({
    where: {
      OR: [{ user_id: params.userId }, { name: params.userName }],
    },
  });

  if (row == null) {
    return undefined;
  }

  return mapUserObject(row);
}

/**
 * ユーザーを削除する
 * @returns 削除に成功したかどうか
 */
export async function deleteUserRecord(
  ctx: RequestContext,
  params: { userId: string },
): Promise<boolean> {
  const result = await ctx.db.user.deleteMany({
    where: {
      user_id: params.userId,
    },
  });

  return result.count > 0;
}
