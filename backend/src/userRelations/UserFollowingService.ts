import type { AccessInfo, DB } from "../core/index.js";
import * as UserRepository from "../core/repository/UserRepository.js";
import { RestError } from "../core/restApi.js";
import type { UserObject } from "../core/service/UserService.js";

export async function followUser(
  params: { userId: string },
  info: AccessInfo,
  db: DB,
): Promise<void> {
  const relationExisting = await UserRepository.getUserFollowing({
    followedByUserId: info.userId,
    followingUserId: params.userId,
  }, info, db);

  // 既にフォローしているユーザーをフォローできない
  if (relationExisting) {
    throw new RestError({
      code: "userAlreadyFollowing",
      message: "specified user already following.",
      status: 400,
    });
  }

  await UserRepository.followUser({
    followedByUserId: info.userId,
    followingUserId: params.userId,
  }, info, db);
}

export async function unfollowUser(
  params: { userId: string },
  info: AccessInfo,
  db: DB,
): Promise<void> {
  const relationExisting = await UserRepository.getUserFollowing({
    followedByUserId: info.userId,
    followingUserId: params.userId,
  }, info, db);

  // フォローしていないユーザーをフォロー解除できない
  if (!relationExisting) {
    throw new RestError({
      code: "userNotFollowing",
      message: "specified user not following.",
      status: 400,
    });
  }

  await UserRepository.unfollowUser({
    followedByUserId: info.userId,
    followingUserId: params.userId,
  }, info, db);
}

export async function getFollowings(
  params: { userId: string; offset?: number; limit?: number },
  info: AccessInfo,
  db: DB,
): Promise<UserObject[]> {
  const users = await UserRepository.getFollowings({
    userId: params.userId,
    offset: params.offset ?? 0,
    limit: params.limit ?? 10,
  }, info, db);
  return users;
}

export async function getFollowedBy(
  params: { userId: string; offset?: number; limit?: number },
  info: AccessInfo,
  db: DB,
): Promise<UserObject[]> {
  const users = await UserRepository.getFollowedBy({
    userId: params.userId,
    offset: params.offset ?? 0,
    limit: params.limit ?? 10,
  }, info, db);
  return users;
}
