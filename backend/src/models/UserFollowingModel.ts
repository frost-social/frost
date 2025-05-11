import type { RequestContext } from "../core/restApi.js";
import { type UserEntity, userMapper } from "./UserModel.js";

/**
 * ユーザーをフォローする
 */
export async function getUserFollowingRel(
  ctx: RequestContext,
  params: { followedByUserId: string; followingUserId: string },
): Promise<boolean> {
  const row = await ctx.db.user_following.findUnique({
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
  ctx: RequestContext,
  params: { followedByUserId: string; followingUserId: string },
): Promise<void> {
  await ctx.db.user_following.create({
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
  ctx: RequestContext,
  params: { followedByUserId: string; followingUserId: string },
): Promise<void> {
  await ctx.db.user_following.delete({
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
  ctx: RequestContext,
  params: { userId: string },
): Promise<number> {
  const result = await ctx.db.user_following.deleteMany({
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
  ctx: RequestContext,
  params: { userId: string; offset: number; limit: number },
): Promise<UserEntity[]> {
  const rows = await ctx.db.user_following.findMany({
    where: {
      user_id_followed_by: params.userId,
    },
    include: { user_following: true },
    skip: params.offset,
    take: params.limit,
  });

  return rows.map((row) => userMapper(row.user_following));
}

/**
 * 指定ユーザーをフォローしているユーザーの一覧を取得する
 */
export async function listUserEntityOfFollowedBy(
  ctx: RequestContext,
  params: { userId: string; offset: number; limit: number },
): Promise<UserEntity[]> {
  const rows = await ctx.db.user_following.findMany({
    where: {
      user_id_following: params.userId,
    },
    include: { user_followed_by: true },
    skip: params.offset,
    take: params.limit,
  });

  return rows.map((row) => userMapper(row.user_followed_by));
}
