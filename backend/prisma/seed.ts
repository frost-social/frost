import { PrismaClient } from "@prisma/client";
import type { AccessInfo } from "../src/core/service.js";
import { createUserEntity, getUserEntity } from "../src/repositories/UserRepository.js";
import { createToken } from "../src/services/TokenService.js";

const prisma = new PrismaClient();

async function main() {
  const ctx: AccessInfo = { userId: "" };

  // create root user
  let rootUser = await getUserEntity({ userName: "root" }, ctx, prisma);
  if (rootUser == null) {
    rootUser = await createUserEntity({
      userName: "root",
      displayName: "root",
      passwordAuthEnabled: false,
    }, ctx, prisma);
    console.log("User 'root' has been created.");
  }
  ctx.userId = rootUser.userId;

  // create public user
  let publicUser = await getUserEntity({ userName: "public" }, ctx, prisma);
  if (publicUser == null) {
    publicUser = await createUserEntity({
      userName: "public",
      displayName: "public",
      passwordAuthEnabled: false,
    }, ctx, prisma);

    // create token for public
    const scopes = ["user.auth"];
    await createToken({
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
