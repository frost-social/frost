import { PrismaClient } from "@prisma/client";
import type { AccessInfo } from "../src/core/service.js";
import { deleteTokenEntity } from "../src/repositories/TokenRepository.js";

async function run() {
  const token = process.argv[2];
  if (token == null) {
    console.log("引数からトークンを指定してください");
    return;
  }

  const db = new PrismaClient();

  const info: AccessInfo = { userId: "internal" };

  const success = await deleteTokenEntity({
    token,
  }, info, db);
  if (success) {
    console.log(`トークン'${token}'を削除しました`);
  } else {
    console.log(`トークン'${token}'の削除に失敗しました`);
  }

  await db.$disconnect();
}
run().catch((err) => {
  console.error(err);
});
