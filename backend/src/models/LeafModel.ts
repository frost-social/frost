import type { RequestContext } from "../core/restApi.js";

export type LeafRow = {
  leaf_id: string;
  leaf_kind: string;
  user_id: string;
  chat_room_id: string | null;
  created_at: Date;
  content: string;
};

export type LeafObject = {
  leafId: string;
  leafKind: string;
  userId: string;
  chatRoomId?: string;
  createdAt: string;
  content: string;
};

export function mapLeafObject(row: LeafRow): LeafObject {
  const leaf: LeafObject = {
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

/**
 * 投稿を作成する
 */
export async function createTimelineLeafRecord(
  ctx: RequestContext,
  params: { userId: string; content: string },
): Promise<LeafObject> {
  const row = await ctx.db.leaf.create({
    data: {
      leaf_kind: "timeline",
      user_id: params.userId,
      content: params.content,
    },
  });

  return mapLeafObject(row);
}

/**
 * チャット投稿を作成する
 */
export async function createChatLeafRecord(
  ctx: RequestContext,
  params: { chatRoomId: string; userId: string; content: string },
): Promise<LeafObject> {
  const row = await ctx.db.leaf.create({
    data: {
      leaf_kind: "chatroom",
      chat_room_id: params.chatRoomId,
      user_id: params.userId,
      content: params.content,
    },
  });

  return mapLeafObject(row);
}

/**
 * 投稿を取得する
 */
export async function getLeafRecord(
  ctx: RequestContext,
  params: { leafId: string },
): Promise<LeafObject | undefined> {
  const row = await ctx.db.leaf.findFirst({
    where: {
      leaf_id: params.leafId,
    },
  });

  if (row == null) {
    return undefined;
  }

  return mapLeafObject(row);
}

/**
 * 投稿を削除する
 */
export async function deleteLeafRecord(
  ctx: RequestContext,
  params: { leafId: string },
): Promise<void> {
  const result = await ctx.db.leaf.deleteMany({
    where: {
      leaf_id: params.leafId,
    },
  });
  if (result.count == 0) {
    throw new Error("failed to remove a resource.");
  }
}

/**
 * 全ての投稿を削除する
 */
export async function clearLeafRecordsOfUser(
  ctx: RequestContext,
  params: { userId: string },
): Promise<number> {
  const result = await ctx.db.leaf.deleteMany({
    where: {
      user_id: params.userId,
    },
  });
  return result.count;
}
