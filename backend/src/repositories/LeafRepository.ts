import { post } from "@prisma/client";
import * as sql from "@prisma/client/sql";
import { Container } from "inversify";
import { TYPES } from "../container/types";
import { AccessContext } from "../modules/AccessContext";
import { DB } from "../modules/db";
import { LeafEntity } from "../modules/entities";

/**
 * 投稿を作成する
*/
export async function createTimelineLeaf(
  params: { userId: string, content: string },
  ctx: AccessContext,
  container: Container,
): Promise<LeafEntity> {
  const db = container.get<DB>(TYPES.db);
  const row = await db.post.create({
    data: {
      post_kind: 'timeline',
      user_id: params.userId,
      content: params.content,
    },
  });

  return mapEntity(row);
}

/**
 * チャット投稿を作成する
*/
export async function createChatLeaf(
  params: { chatRoomId: string, userId: string, content: string },
  ctx: AccessContext,
  container: Container,
): Promise<LeafEntity> {
  const db = container.get<DB>(TYPES.db);
  const row = await db.post.create({
    data: {
      post_kind: 'chatroom',
      chat_room_id: params.chatRoomId,
      user_id: params.userId,
      content: params.content,
    },
  });

  return mapEntity(row);
}

/**
 * 投稿を取得する
*/
export async function get(
  params: { leafId: string },
  ctx: AccessContext,
  container: Container,
): Promise<LeafEntity | undefined> {
  const db = container.get<DB>(TYPES.db);
  const row = await db.post.findFirst({
    where: {
      post_id: params.leafId,
    },
  });

  if (row == null) {
    return undefined;
  }

  return mapEntity(row);
}

/**
 * タイムラインを取得する\
 * prevCursorとnextCursorはleafIdを指定します。
*/
export async function fetchHomeTimeline(
  params: { kind: string, prevCursor?: string, nextCursor?: string, limit?: number },
  ctx: AccessContext,
  container: Container,
): Promise<LeafEntity[]> {
  const db = container.get<DB>(TYPES.db);
  const limit = params.limit ?? 50;
  if (params.nextCursor != null) {
    const rows = await db.$queryRawTyped(sql.fetchHomeTimelineNextCursor(ctx.userId, params.nextCursor, limit));
    rows.reverse();
    return rows.map(x => mapEntity(x));
  } else if (params.prevCursor != null) {
    const rows = await db.$queryRawTyped(sql.fetchHomeTimelinePrevCursor(ctx.userId, params.prevCursor, limit));
    return rows.map(x => mapEntity(x));
  } else {
    const rows = await db.$queryRawTyped(sql.fetchHomeTimelineLatest(ctx.userId, limit));
    return rows.map(x => mapEntity(x));
  }
}

/**
 * 投稿を削除する
 * @returns 削除に成功したかどうか
*/
export async function remove(
  params: { leafId: string },
  ctx: AccessContext,
  container: Container,
): Promise<boolean> {
  const db = container.get<DB>(TYPES.db);
  const result = await db.post.deleteMany({
    where: {
      post_id: params.leafId,
    },
  });
  return (result.count > 0);
}

function mapEntity(row: post): LeafEntity {
  const leaf: LeafEntity = {
    leafId: row.post_id,
    userId: row.user_id,
    createdAt: row.created_at.toJSON(),
    content: row.content,
  };

  if (row.chat_room_id != null) {
    leaf.chatRoomId = row.chat_room_id;
  }

  return leaf;
}
