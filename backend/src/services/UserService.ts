import { Container } from "inversify";
import { AccessContext } from "../modules/AccessContext";
import { appError, BadRequest, ResourceNotFound } from "../modules/appErrors";
import { LeafEntity, UserEntity } from "../modules/entities";
import * as UserRepository from "../repositories/UserRepository";
import * as LeafRepository from "../repositories/LeafRepository";

/**
 * ユーザー情報を取得します。
*/
export async function getUser(
  params: { userId?: string, userName?: string },
  ctx: AccessContext,
  container: Container,
): Promise<UserEntity> {
  // either userId or userName must be specified
  if ([params.userId, params.userName].every(x => x == null)) {
    throw appError(new BadRequest([
      { message: "Please specify the userId or userName." },
    ]));
  }

  const userEntity = await UserRepository.get({
    userId: params.userId,
    userName: params.userName,
  }, ctx, container);

  if (userEntity == null) {
    throw appError(new ResourceNotFound("User"));
  }

  return userEntity;
}

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
): Promise<UserEntity[]> {
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
): Promise<UserEntity[]> {
  const users = await UserRepository.getFollowedBy({
    userId: params.userId,
    offset: params.offset ?? 0,
    limit: params.limit ?? 10,
  }, ctx, container);
  return users;
}

/**
 * ユーザー情報を削除します。
*/
export async function deleteUser(
  params: { userId: string },
  ctx: AccessContext,
  container: Container,
): Promise<void> {
  const success = await UserRepository.remove({
    userId: params.userId,
  }, ctx, container);

  if (!success) {
    throw appError(new ResourceNotFound("User"));
  }
}

/**
 * タイムライン取得
*/
export async function fetchHomeTimeline(
  params: { kind: string, prevCursor?: string, nextCursor?: string, limit?: number },
  ctx: AccessContext,
  container: Container,
): Promise<{ leafs: LeafEntity[], nextCursor?: string, prevCursor?: string }> {
  const leafs = await LeafRepository.fetchHomeTimeline(params, ctx, container);
  return {
    leafs: leafs,
    nextCursor: leafs[0]?.leafId,
    prevCursor: leafs[leafs.length - 1]?.leafId,
  };
}
