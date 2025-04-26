import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import * as UserRepository from "../src/core/repository/UserRepository";
import type { AccessInfo } from "../src/core/service";
import * as TokenService from "../src/core/service/TokenService";

const prisma = new PrismaClient();

async function main() {
  const ctx: AccessInfo = { userId: "" };

  // create root user
  let rootUser = await UserRepository.getUser({ userName: "root" }, ctx, prisma);
  if (rootUser == null) {
    rootUser = await UserRepository.createUser({
      userName: "root",
      displayName: "root",
      passwordAuthEnabled: false,
    }, ctx, prisma);
    console.log("User 'root' has been created.");
  }
  ctx.userId = rootUser.userId;

  // create public user
  let publicUser = await UserRepository.getUser({ userName: "public" }, ctx, prisma);
  if (publicUser == null) {
    publicUser = await UserRepository.createUser({
      userName: "public",
      displayName: "public",
      passwordAuthEnabled: false,
    }, ctx, prisma);

    // create token for public
    const scopes = ["user.auth"];
    await TokenService.createToken({
      userId: publicUser.userId,
      tokenKind: "access_token",
      scopes: scopes,
    }, ctx, prisma);

    console.log("User 'public' has been created.");
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
