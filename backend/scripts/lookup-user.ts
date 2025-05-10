import { PrismaClient } from "@prisma/client";
import type { AccessInfo } from "../src/core/service.js";
import { getUserEntity } from "../src/repositories/UserRepository.js";

async function run() {
  const userName = process.argv[2];
  if (userName == null) {
    console.log("引数からユーザー名を指定してください");
    return;
  }

  const db = new PrismaClient();

  const info: AccessInfo = { userId: "internal" };

  const user = await getUserEntity({
    userName: userName,
  }, info, db);
  if (user != null) {
    console.log(user);
  } else {
    console.log(`ユーザー名'${userName}'のユーザー情報の取得に失敗しました。`);
  }

  await db.$disconnect();
}
run().catch((err) => {
  console.error(err);
});
