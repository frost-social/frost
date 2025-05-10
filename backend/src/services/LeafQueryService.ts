import * as sql from "@prisma/client/sql";
import type { AccessInfo, DB } from "../core/index.js";
import { mapLeafEntity } from "../repositories/LeafRepository.js";
import type { LeafObject } from "./LeafService.js";

/**
 * タイムラインを取得する\
 * prevCursorとnextCursorはleafIdを指定します。
 */
export async function fetchHomeTimeline(
  params: {
    kind: string;
    prevCursor?: string;
    nextCursor?: string;
    limit?: number;
  },
  info: AccessInfo,
  db: DB,
): Promise<{ leafs: LeafObject[]; nextCursor?: string; prevCursor?: string }> {
  const limit = params.limit ?? 50;
  let rows;
  if (params.nextCursor != null) {
    rows = await db.$queryRawTyped(
      sql.fetchHomeTimelineNextCursor(info.userId, params.nextCursor, limit),
    );
    rows.reverse();
  } else if (params.prevCursor != null) {
    rows = await db.$queryRawTyped(
      sql.fetchHomeTimelinePrevCursor(info.userId, params.prevCursor, limit),
    );
  } else {
    rows = await db.$queryRawTyped(
      sql.fetchHomeTimelineLatest(info.userId, limit),
    );
  }
  const leafs = rows.map((x) => mapLeafEntity(x));
  return {
    leafs: leafs,
    nextCursor: leafs[0]?.leafId,
    prevCursor: leafs[leafs.length - 1]?.leafId,
  };
}
