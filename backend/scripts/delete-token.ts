import { PrismaClient } from "@prisma/client";
import { requestContext } from "../src/core/restApi.js";
import { deleteTokenEntity } from "../src/repositories/TokenRepository.js";
import { getInternalUser } from "../src/repositories/UserRepository.js";

async function run() {
  const token = process.argv[2];
  if (token == null) {
    console.log("引数からトークンを指定してください");
    return;
  }

  const db = new PrismaClient();

  const internalUser = await getInternalUser(db);
  const ctx = requestContext(internalUser, db);

  const success = await deleteTokenEntity(ctx, {
    token,
  });
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
