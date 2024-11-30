import { Container } from "inversify";
import { AccessContext } from "../modules/AccessContext";
import * as LeafRepository from "../repositories/LeafRepository";
import { LeafEntity } from "../repositories/LeafRepository";
import * as sql from "@prisma/client/sql";
import { TYPES } from "../container/types";
import { DB } from "../modules/db";
import { LeafObject } from "../modules/valueObject";

/**
 * タイムラインを取得する\
 * prevCursorとnextCursorはleafIdを指定します。
*/
export async function fetchHomeTimeline(
  params: { kind: string, prevCursor?: string, nextCursor?: string, limit?: number },
  ctx: AccessContext,
  container: Container,
): Promise<{ leafs: LeafObject[], nextCursor?: string, prevCursor?: string }> {
  const db = container.get<DB>(TYPES.db);
  const limit = params.limit ?? 50;
  let rows;
  if (params.nextCursor != null) {
    rows = await db.$queryRawTyped(sql.fetchHomeTimelineNextCursor(ctx.userId, params.nextCursor, limit));
    rows.reverse();
  } else if (params.prevCursor != null) {
    rows = await db.$queryRawTyped(sql.fetchHomeTimelinePrevCursor(ctx.userId, params.prevCursor, limit));
  } else {
    rows = await db.$queryRawTyped(sql.fetchHomeTimelineLatest(ctx.userId, limit));
  }
  const leafs = rows.map(x => LeafRepository.toEntity(x));
  return {
    leafs: leafs,
    nextCursor: leafs[0]?.leafId,
    prevCursor: leafs[leafs.length - 1]?.leafId,
  };
}
