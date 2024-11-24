import { user } from "@prisma/client";
import { AccessContext } from "../modules/AccessContext";
import { DB } from "../modules/db";
import { UserEntity } from "../modules/entities";
import { Container } from "inversify";
import { TYPES } from "../container/types";

/**
 * ユーザーを追加する
*/
export async function create(
  params: { userName: string, displayName: string, passwordAuthEnabled: boolean },
  ctx: AccessContext,
  container: Container,
) {
  const db = container.get<DB>(TYPES.db);

  const row = await db.user.create({
    data: {
      name: params.userName,
      display_name: params.displayName,
      password_auth_enabled: params.passwordAuthEnabled,
    },
  });

  return mapEntity(row);
}

/**
 * ユーザーを取得する
*/
export async function get(
  params: { userId?: string, userName?: string },
  ctx: AccessContext,
  container: Container,
): Promise<UserEntity | undefined> {
  const db = container.get<DB>(TYPES.db);

  if ([params.userId, params.userName].every(x => x == null)) {
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

  return mapEntity(row);
}

/**
 * ユーザーを削除する
 * @returns 削除に成功したかどうか
*/
export async function remove(
  params: { userId: string },
  ctx: AccessContext,
  container: Container,
): Promise<boolean> {
  const db = container.get<DB>(TYPES.db);

  const result = await db.user.deleteMany({
    where: {
      user_id: params.userId,
    },
  });

  return (result.count > 0);
}

/**
 * ユーザーをフォローする
*/
export async function followUser(
  params: { followedByUserId: string, followingUserId: string },
  ctx: AccessContext,
  container: Container,
) {
  const db = container.get<DB>(TYPES.db);

  await db.user_following.create({
    data: {
      user_id_followed_by: params.followedByUserId,
      user_id_following: params.followingUserId,
    },
  });
}

/**
 * ユーザーをフォロー解除する
*/
export async function unfollowUser(
  params: { followedByUserId: string, followingUserId: string },
  ctx: AccessContext,
  container: Container,
): Promise<void> {
  const db = container.get<DB>(TYPES.db);

  await db.user_following.delete({
    where: {
      user_id_followed_by_user_id_following: {
        user_id_followed_by: params.followedByUserId,
        user_id_following: params.followingUserId,
      }
    },
  });
}

/**
 * 指定ユーザーがフォローしているユーザーの一覧を取得する
*/
export async function getFollowings(
  params: { userId: string, offset: number, limit: number },
  ctx: AccessContext,
  container: Container,
): Promise<UserEntity[]> {
  const db = container.get<DB>(TYPES.db);

  const rows = await db.user_following.findMany({
    where: {
      user_id_followed_by: params.userId,
    },
    include: { user_following: true },
    skip: params.offset,
    take: params.limit,
  });

  return rows.map(row => mapEntity(row.user_following));
}

/**
 * 指定ユーザーをフォローしているユーザーの一覧を取得する
*/
export async function getFollowedBy(
  params: { userId: string, offset: number, limit: number },
  ctx: AccessContext,
  container: Container,
): Promise<UserEntity[]> {
  const db = container.get<DB>(TYPES.db);

  const rows = await db.user_following.findMany({
    where: {
      user_id_following: params.userId,
    },
    include: { user_followed_by: true },
    skip: params.offset,
    take: params.limit,
  });

  return rows.map(row => mapEntity(row.user_followed_by));
}

function mapEntity(row: user): UserEntity {
  return {
    userId: row.user_id,
    userName: row.name,
    displayName: row.display_name,
    passwordAuthEnabled: row.password_auth_enabled,
  };
}
