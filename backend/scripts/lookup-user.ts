import { PrismaClient } from "@prisma/client";
import { requestContext } from "../src/core/restApi.js";
import {
  getInternalUser,
  getUserEntity,
} from "../src/repositories/UserRepository.js";

async function run() {
  const userName = process.argv[2];
  if (userName == null) {
    console.log("引数からユーザー名を指定してください");
    return;
  }

  const db = new PrismaClient();
  try {
    const internalUser = await getInternalUser(db);
    const ctx = requestContext(internalUser, db);

    const user = await getUserEntity(ctx, {
      userName: userName,
    });
    if (user != null) {
      console.log(user);
    } else {
      console.log(
        `ユーザー名'${userName}'のユーザー情報の取得に失敗しました。`,
      );
    }
  } catch (err) {
    console.error(err);
  } finally {
    await db.$disconnect();
  }
}
run();
