import * as sql from "@prisma/client/sql";
import type { RequestContext } from "../core/restApi.js";
import { mapLeafObject } from "../models/LeafModel.js";
import type { LeafObject } from "./LeafService.js";

/**
 * タイムラインを取得する\
 * prevCursorとnextCursorはleafIdを指定します。
 */
export async function fetchHomeTimeline(
  ctx: RequestContext,
  params: {
    kind: string;
    prevCursor?: string;
    nextCursor?: string;
    limit?: number;
  },
): Promise<{ leafs: LeafObject[]; nextCursor?: string; prevCursor?: string }> {
  const limit = params.limit ?? 50;

  if (params.nextCursor != null) {
    const rows = await ctx.db.$queryRawTyped(
      sql.fetchHomeTimelineNextCursor(ctx.user.userId, params.nextCursor, limit),
    );
    rows.reverse();
    const leafs = rows.map((x) => mapLeafObject(x));
    return {
      leafs: leafs,
      nextCursor: leafs[0]?.leafId,
      prevCursor: leafs[leafs.length - 1]?.leafId,
    };
  }

  if (params.prevCursor != null) {
    const rows = await ctx.db.$queryRawTyped(
      sql.fetchHomeTimelinePrevCursor(ctx.user.userId, params.prevCursor, limit),
    );
    const leafs = rows.map((x) => mapLeafObject(x));
    return {
      leafs: leafs,
      nextCursor: leafs[0]?.leafId,
      prevCursor: leafs[leafs.length - 1]?.leafId,
    };
  }

  const rows = await ctx.db.$queryRawTyped(
    sql.fetchHomeTimelineLatest(ctx.user.userId, limit),
  );
  const leafs = rows.map((x) => mapLeafObject(x));
  return {
    leafs: leafs,
    nextCursor: leafs[0]?.leafId,
    prevCursor: leafs[leafs.length - 1]?.leafId,
  };
}
