import { AccessInfo } from "../modules/AccessInfo";
import { appError } from "../modules/appErrors";
import * as UserRepository from "../repositories/UserRepository";
import { UserObject } from "../modules/valueObject";
import { DB } from "../modules/db";

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
    throw appError({
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
    throw appError({
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
  params: { userId: string, offset?: number, limit?: number },
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
  params: { userId: string, offset?: number, limit?: number },
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
