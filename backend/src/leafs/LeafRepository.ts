import type { leaf } from "@prisma/client";
import type { AccessInfo, DB } from "../core/index.js";

export type LeafEntity = {
  leafId: string;
  leafKind: string;
  userId: string;
  chatRoomId?: string;
  createdAt: string;
  content: string;
};

/**
 * 投稿を作成する
 */
export async function createTimelineLeafEntity(
  params: { userId: string; content: string },
  info: AccessInfo,
  db: DB,
): Promise<LeafEntity> {
  const row = await db.leaf.create({
    data: {
      leaf_kind: "timeline",
      user_id: params.userId,
      content: params.content,
    },
  });

  return mapLeafEntity(row);
}

/**
 * チャット投稿を作成する
 */
export async function createChatLeafEntity(
  params: { chatRoomId: string; userId: string; content: string },
  info: AccessInfo,
  db: DB,
): Promise<LeafEntity> {
  const row = await db.leaf.create({
    data: {
      leaf_kind: "chatroom",
      chat_room_id: params.chatRoomId,
      user_id: params.userId,
      content: params.content,
    },
  });

  return mapLeafEntity(row);
}

/**
 * 投稿を取得する
 */
export async function getLeafEntity(
  params: { leafId: string },
  info: AccessInfo,
  db: DB,
): Promise<LeafEntity | undefined> {
  const row = await db.leaf.findFirst({
    where: {
      leaf_id: params.leafId,
    },
  });

  if (row == null) {
    return undefined;
  }

  return mapLeafEntity(row);
}

/**
 * 投稿を削除する
 */
export async function deleteLeafEntity(
  params: { leafId: string },
  info: AccessInfo,
  db: DB,
): Promise<void> {
  const result = await db.leaf.deleteMany({
    where: {
      leaf_id: params.leafId,
    },
  });
  if (result.count == 0) {
    throw new Error("failed to remove a resource.");
  }
}

/**
 * 投稿を削除する
 */
export async function clearLeafEntitiesOfUser(
  params: { userId: string },
  info: AccessInfo,
  db: DB,
): Promise<number> {
  const result = await db.leaf.deleteMany({
    where: {
      user_id: params.userId,
    },
  });
  return result.count;
}

export function mapLeafEntity(row: leaf): LeafEntity {
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
