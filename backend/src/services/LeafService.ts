import { AccessInfo } from "../modules/AccessInfo";
import { AccessDenied, appError, BadRequest, ResourceNotFound } from "../modules/appErrors";
import { LeafObject } from "../modules/valueObject";
import * as LeafRepository from "../repositories/LeafRepository";
import { DB } from "../modules/db";

/**
 * 投稿を作成します。
*/
export async function createLeaf(
  params: { content: string },
  info: AccessInfo,
  db: DB,
): Promise<LeafObject> {
  if (params.content.length < 1) {
    throw appError(new BadRequest([
      { message: 'content invalid.' },
    ]));
  }
  const leaf = await LeafRepository.createTimelineLeaf({
    userId: info.userId,
    content: params.content,
  }, info, db);
  return leaf;
}

/**
 * 投稿を取得します。
*/
export async function getLeaf(
  params: { leafId: string },
  info: AccessInfo,
  db: DB,
): Promise<LeafObject> {
  if (params.leafId.length < 1) {
    throw appError(new BadRequest([
      { message: 'leafId invalid.' },
    ]));
  }
  const leaf = await LeafRepository.getLeaf({
    leafId: params.leafId
  }, info, db);
  if (leaf == null) {
    throw appError(new ResourceNotFound("Leaf"));
  }
  return leaf;
}

/**
 * 投稿を削除します。
*/
export async function deleteLeaf(
  params: { leafId: string },
  info: AccessInfo,
  db: DB,
): Promise<void> {
  if (params.leafId.length < 1) {
    throw appError(new BadRequest([
      { message: 'leafId invalid.' },
    ]));
  }

  // 作成者以外は削除できない
  const leaf = await LeafRepository.getLeaf({
    leafId: params.leafId
  }, info, db);
  if (leaf == null) {
    throw appError(new ResourceNotFound("Leaf"));
  }
  if (leaf.userId != info.userId) {
    throw appError(new AccessDenied());
  }

  await LeafRepository.deleteLeaf({
    leafId: params.leafId,
  }, info, db);
}
