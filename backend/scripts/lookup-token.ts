import { PrismaClient } from "@prisma/client";
import type { AccessInfo } from "../src/core/service.js";
import { getTokenEntitiesOfUser } from "../src/repositories/TokenRepository.js";
import { getUserEntity } from "../src/repositories/UserRepository.js";

async function run() {
  const userName = process.argv[2];
  if (userName == null) {
    console.log("引数からユーザー名を指定してください");
    return;
  }

  const db = new PrismaClient();
  try {
    const info: AccessInfo = { userId: "internal" };

    const user = await getUserEntity({
      userName: userName,
    }, info, db);
    if (user == null) {
      console.log(`ユーザー名'${userName}'のユーザー情報を取得できませんでした。`);
      return;
    }

    const tokens = await getTokenEntitiesOfUser({
      userId: user.userId,
    }, info, db);
    if (tokens.length > 0) {
      console.log(tokens);
    } else {
      console.log(`ユーザー名'${userName}'のトークンの取得に失敗しました。`);
    }

  } finally {
    await db.$disconnect();
  }
}
run().catch((err) => {
  console.error(err);
});
