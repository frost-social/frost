import { PrismaClient } from "@prisma/client";
import { createRequestContext } from "../src/core/restApi.js";
import { clearLeafEntitiesOfUser } from "../src/models/LeafModel.js";
import { deletePasswordEntity } from "../src/models/PasswordModel.js";
import {
  deleteTokenEntity,
  getTokenEntitiesOfUser,
} from "../src/models/TokenModel.js";
import { clearUserFollowingRel } from "../src/models/UserFollowingModel.js";
import {
  deleteUserEntity,
  getUserEntity,
} from "../src/models/UserModel.js";

async function run() {
  const userName = process.argv[2];
  if (userName == null) {
    console.log("引数からユーザー名を指定してください");
    return;
  }

  const db = new PrismaClient();
  try {
    let success: boolean;
    let count: number;

    const ctx = await createRequestContext(undefined, db);

    const user = await getUserEntity(ctx, {
      userName: userName,
    });
    if (user != null) {
      console.log(
        `ユーザー名が'${userName}'のユーザーが見つかりました(ユーザーID'${user.userId}')。`,
      );
    } else {
      console.log(
        `ユーザー名が'${userName}'のユーザーが見つかりませんでした。`,
      );
      return;
    }

    count = await clearLeafEntitiesOfUser(ctx, {
      userId: user.userId,
    });
    if (count > 0) {
      console.log(
        `ユーザーID'${userName}'の${count}件のリーフを削除しました。`,
      );
    }

    const tokens = await getTokenEntitiesOfUser(ctx, {
      userId: user.userId,
    });

    for (const tokenRow of tokens) {
      await deleteTokenEntity(ctx, {
        token: tokenRow.token,
      });
      console.log(
        `ユーザーID'${user.userId}'のアプリケーション認可情報を1件削除しました。`,
      );
    }

    count = await clearUserFollowingRel(ctx, {
      userId: user.userId,
    });
    if (count > 0) {
      console.log(
        `ユーザーID'${user.userId}'に関する${count}件のフォロー関係を解除しました。`,
      );
    }

    success = await deletePasswordEntity(ctx, {
      userId: user.userId,
    });
    if (success) {
      console.log(`ユーザーID'${user.userId}'の認証情報を削除しました。`);
    } else {
      console.log(`ユーザーID'${user.userId}'の認証情報の削除に失敗しました。`);
      return;
    }

    success = await deleteUserEntity(ctx, {
      userId: user.userId,
    });
    if (success) {
      console.log(`ユーザーID'${user.userId}'のユーザー情報を削除しました。`);
    } else {
      console.log(
        `ユーザーID'${user.userId}'のユーザー情報の削除に失敗しました。`,
      );
      return;
    }
  } catch (err) {
    console.error(err);
  } finally {
    await db.$disconnect();
  }
}
run();
