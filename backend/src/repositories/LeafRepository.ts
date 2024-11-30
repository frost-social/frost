import { leaf } from "@prisma/client";
import { Container } from "inversify";
import { TYPES } from "../container/types";
import { AccessContext } from "../modules/AccessContext";
import { DB } from "../modules/db";

export type LeafEntity = {
  leafId: string,
  leafKind: string,
  userId: string,
  chatRoomId?: string,
  createdAt: string,
  content: string,
};

/**
 * 投稿を作成する
*/
export async function createTimelineLeaf(
  params: { userId: string, content: string },
  ctx: AccessContext,
  container: Container,
): Promise<LeafEntity> {
  const db = container.get<DB>(TYPES.db);
  const row = await db.leaf.create({
    data: {
      leaf_kind: 'timeline',
      user_id: params.userId,
      content: params.content,
    },
  });

  return toEntity(row);
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
  const row = await db.leaf.create({
    data: {
      leaf_kind: 'chatroom',
      chat_room_id: params.chatRoomId,
      user_id: params.userId,
      content: params.content,
    },
  });

  return toEntity(row);
}

/**
 * 投稿を取得する
*/
export async function getLeaf(
  params: { leafId: string },
  ctx: AccessContext,
  container: Container,
): Promise<LeafEntity | undefined> {
  const db = container.get<DB>(TYPES.db);
  const row = await db.leaf.findFirst({
    where: {
      leaf_id: params.leafId,
    },
  });

  if (row == null) {
    return undefined;
  }

  return toEntity(row);
}

/**
 * 投稿を削除する
*/
export async function deleteLeaf(
  params: { leafId: string },
  ctx: AccessContext,
  container: Container,
): Promise<void> {
  const db = container.get<DB>(TYPES.db);
  const result = await db.leaf.deleteMany({
    where: {
      leaf_id: params.leafId,
    },
  });
  if (result.count == 0) {
    throw new Error('failed to remove a resource.');
  }
}

export function toEntity(row: leaf): LeafEntity {
  const leaf: LeafEntity = {
    leafId: row.leaf_id,
    leafKind: row.leaf_kind,
    userId: row.user_id,
    createdAt: row.created_at.toJSON(),
    content: row.content,
  };

  if (row.chat_room_id != null) {
    leaf.chatRoomId = row.chat_room_id;
  }

  return leaf;
}
