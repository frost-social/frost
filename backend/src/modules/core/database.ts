import { PrismaClient } from "@prisma/client";
import type * as prismaRuntime from "@prisma/client/runtime/library";
import { defineModule } from "./module";

export type PrismaTransaction = Omit<PrismaClient, prismaRuntime.ITXClientDenyList>;
export type DB = PrismaClient | PrismaTransaction;

defineModule("database", {
  async onRegister(ctx) {
    const db: DB = new PrismaClient();
    ctx.set(db);
  },
});
