import { Container } from "inversify";
import { AccessContext } from "../modules/AccessContext";
import { appError } from "../modules/appErrors";
import { UserEntity } from "../repositories/UserRepository";
import * as UserRepository from "../repositories/UserRepository";
import { UserObject } from "../modules/valueObject";

export async function followUser(
  params: { userId: string },
  ctx: AccessContext,
  container: Container,
): Promise<void> {
  const relationExisting = await UserRepository.getUserFollowing({
    followedByUserId: ctx.userId,
    followingUserId: params.userId,
  }, ctx, container);

  // 既にフォローしているユーザーをフォローできない
  if (relationExisting) {
    throw appError({
      code: "userAlreadyFollowing",
      message: "specified user already following.",
      status: 400,
    });
  }

  await UserRepository.followUser({
    followedByUserId: ctx.userId,
    followingUserId: params.userId,
  }, ctx, container);
}

export async function unfollowUser(
  params: { userId: string },
  ctx: AccessContext,
  container: Container,
): Promise<void> {
  const relationExisting = await UserRepository.getUserFollowing({
    followedByUserId: ctx.userId,
    followingUserId: params.userId,
  }, ctx, container);

  // フォローしていないユーザーをフォロー解除できない
  if (!relationExisting) {
    throw appError({
      code: "userNotFollowing",
      message: "specified user not following.",
      status: 400,
    });
  }

  await UserRepository.unfollowUser({
    followedByUserId: ctx.userId,
    followingUserId: params.userId,
  }, ctx, container);
}

export async function getFollowings(
  params: { userId: string, offset?: number, limit?: number },
  ctx: AccessContext,
  container: Container,
): Promise<UserObject[]> {
  const users = await UserRepository.getFollowings({
    userId: params.userId,
    offset: params.offset ?? 0,
    limit: params.limit ?? 10,
  }, ctx, container);
  return users;
}

export async function getFollowedBy(
  params: { userId: string, offset?: number, limit?: number },
  ctx: AccessContext,
  container: Container,
): Promise<UserObject[]> {
  const users = await UserRepository.getFollowedBy({
    userId: params.userId,
    offset: params.offset ?? 0,
    limit: params.limit ?? 10,
  }, ctx, container);
  return users;
}
