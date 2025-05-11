import { PrismaClient } from "@prisma/client";
import { createRequestContext } from "../src/core/restApi.js";
import { getTokenRecordsOfUser } from "../src/models/TokenModel.js";
import {
  getUserRecord,
} from "../src/models/UserModel.js";

async function run() {
  const userName = process.argv[2];
  if (userName == null) {
    console.log("引数からユーザー名を指定してください");
    return;
  }

  const db = new PrismaClient();
  try {
    const ctx = await createRequestContext(undefined, db);

    const user = await getUserRecord(ctx, {
      userName: userName,
    });
    if (user == null) {
      console.log(
        `ユーザー名'${userName}'のユーザー情報を取得できませんでした。`,
      );
      return;
    }

    const tokens = await getTokenRecordsOfUser(ctx, {
      userId: user.userId,
    });
    if (tokens.length > 0) {
      console.log(tokens);
    } else {
      console.log(`ユーザー名'${userName}'のトークンの取得に失敗しました。`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await db.$disconnect();
  }
}
run();
