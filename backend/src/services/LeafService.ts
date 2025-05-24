import type { components } from "../../openapi/generated/schema.js";
import {
  AccessDenied,
  BadRequest,
  type RequestContext,
  ResourceNotFound,
  RestError,
} from "../core/restApi.js";
import {
  createTimelineLeafRecord,
  deleteLeafRecord,
  getLeafRecord,
} from "../models/LeafModel.js";

export type LeafObject = components["schemas"]["Api.v1.Leaf"];

/**
 * 投稿を作成します。
 */
export async function createLeaf(
  ctx: RequestContext,
  params: { content: string },
): Promise<LeafObject> {
  if (params.content.length < 1) {
    throw new RestError(new BadRequest([{ message: "content invalid." }]));
  }
  const leaf = await createTimelineLeafRecord(ctx, {
    userId: ctx.user.userId,
    content: params.content,
  });
  return leaf;
}

/**
 * 投稿を取得します。
 */
export async function getLeaf(
  ctx: RequestContext,
  params: { leafId: string },
): Promise<LeafObject> {
  if (params.leafId.length < 1) {
    throw new RestError(new BadRequest([{ message: "leafId invalid." }]));
  }
  const leaf = await getLeafRecord(ctx, {
    leafId: params.leafId,
  });
  if (leaf == null) {
    throw new RestError(new ResourceNotFound("Leaf"));
  }
  return leaf;
}

/**
 * 投稿を削除します。
 */
export async function deleteLeaf(
  ctx: RequestContext,
  params: { leafId: string },
): Promise<void> {
  if (params.leafId.length < 1) {
    throw new RestError(new BadRequest([{ message: "leafId invalid." }]));
  }

  const leaf = await getLeafRecord(ctx, {
    leafId: params.leafId,
  });
  if (leaf == null) {
    throw new RestError(new ResourceNotFound("Leaf"));
  }

  // 作成者以外は削除できない
  if (leaf.userId !== ctx.user.userId) {
    throw new RestError(new AccessDenied());
  }

  await deleteLeafRecord(ctx, {
    leafId: params.leafId,
  });
}
