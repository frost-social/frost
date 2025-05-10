import type { DB } from "../core/database.js";
import type { UserEntity } from "../core/repository/UserRepository.js";
import type { AccessInfo } from "../core/service.js";

/**
 * ユーザーをフォローする
 */
export async function getUserFollowingRel(
  params: { followedByUserId: string; followingUserId: string },
  info: AccessInfo,
  db: DB,
): Promise<boolean> {
  const row = await db.user_following.findUnique({
    where: {
      user_id_followed_by_user_id_following: {
        user_id_followed_by: params.followedByUserId,
        user_id_following: params.followingUserId,
      },
    },
  });

  return row != null;
}

/**
 * ユーザーをフォローする
 */
export async function createUserFollowingRel(
  params: { followedByUserId: string; followingUserId: string },
  info: AccessInfo,
  db: DB,
): Promise<void> {
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
export async function deleteUserFollowingRel(
  params: { followedByUserId: string; followingUserId: string },
  info: AccessInfo,
  db: DB,
): Promise<void> {
  await db.user_following.delete({
    where: {
      user_id_followed_by_user_id_following: {
        user_id_followed_by: params.followedByUserId,
        user_id_following: params.followingUserId,
      },
    },
  });
}

/**
 * 対象ユーザーに関するフォロー関係を全て解除する
 */
export async function clearUserFollowingRel(
  params: { userId: string },
  info: AccessInfo,
  db: DB,
): Promise<number> {
  const result = await db.user_following.deleteMany({
    where: {
      OR: [
        { user_id_followed_by: params.userId },
        { user_id_following: params.userId },
      ],
    },
  });
  return result.count;
}

/**
 * 指定ユーザーがフォローしているユーザーの一覧を取得する
 */
export async function listUserEntityOfFollowing(
  params: { userId: string; offset: number; limit: number },
  info: AccessInfo,
  db: DB,
): Promise<UserEntity[]> {
  const rows = await db.user_following.findMany({
    where: {
      user_id_followed_by: params.userId,
    },
    include: { user_following: true },
    skip: params.offset,
    take: params.limit,
  });

  return rows.map((row) => {
    const user = row.user_following;
    return {
      userId: user.user_id,
      userName: user.name,
      displayName: user.display_name,
      passwordAuthEnabled: user.password_auth_enabled,
    };
  });
}

/**
 * 指定ユーザーをフォローしているユーザーの一覧を取得する
 */
export async function listUserEntityOfFollowedBy(
  params: { userId: string; offset: number; limit: number },
  info: AccessInfo,
  db: DB,
): Promise<UserEntity[]> {
  const rows = await db.user_following.findMany({
    where: {
      user_id_following: params.userId,
    },
    include: { user_followed_by: true },
    skip: params.offset,
    take: params.limit,
  });

  return rows.map((row) => {
    const user = row.user_followed_by;
    return {
      userId: user.user_id,
      userName: user.name,
      displayName: user.display_name,
      passwordAuthEnabled: user.password_auth_enabled,
    };
  });
}
