import { type RequestContext, RestError } from "../core/restApi.js";
import {
  createUserFollowingRel,
  deleteUserFollowingRel,
  getUserFollowingRel,
  listUserEntityOfFollowedBy,
  listUserEntityOfFollowing,
} from "../models/UserFollowingModel.js";
import type { UserObject } from "./UserService.js";

export async function followUser(
  ctx: RequestContext,
  params: { userId: string },
): Promise<void> {
  const relationExisting = await getUserFollowingRel(ctx, {
    followedByUserId: ctx.user.userId,
    followingUserId: params.userId,
  });

  // 既にフォローしているユーザーをフォローできない
  if (relationExisting) {
    throw new RestError({
      code: "userAlreadyFollowing",
      message: "specified user already following.",
      status: 400,
    });
  }

  await createUserFollowingRel(ctx, {
    followedByUserId: ctx.user.userId,
    followingUserId: params.userId,
  });
}

export async function unfollowUser(
  ctx: RequestContext,
  params: { userId: string },
): Promise<void> {
  const relationExisting = await getUserFollowingRel(ctx, {
    followedByUserId: ctx.user.userId,
    followingUserId: params.userId,
  });

  // フォローしていないユーザーをフォロー解除できない
  if (!relationExisting) {
    throw new RestError({
      code: "userNotFollowing",
      message: "specified user not following.",
      status: 400,
    });
  }

  await deleteUserFollowingRel(ctx, {
    followedByUserId: ctx.user.userId,
    followingUserId: params.userId,
  });
}

export async function getFollowings(
  ctx: RequestContext,
  params: { userId: string; offset?: number; limit?: number },
): Promise<UserObject[]> {
  const users = await listUserEntityOfFollowing(ctx, {
    userId: params.userId,
    offset: params.offset ?? 0,
    limit: params.limit ?? 10,
  });
  return users;
}

export async function getFollowedBy(
  ctx: RequestContext,
  params: { userId: string; offset?: number; limit?: number },
): Promise<UserObject[]> {
  const users = await listUserEntityOfFollowedBy(ctx, {
    userId: params.userId,
    offset: params.offset ?? 0,
    limit: params.limit ?? 10,
  });
  return users;
}
