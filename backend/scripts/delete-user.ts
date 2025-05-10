import { PrismaClient } from "@prisma/client";
import { requestContext } from "../src/core/restApi.js";
import { clearLeafEntitiesOfUser } from "../src/repositories/LeafRepository.js";
import { deletePasswordEntity } from "../src/repositories/PasswordRepository.js";
import {
  deleteTokenEntity,
  getTokenEntitiesOfUser,
} from "../src/repositories/TokenRepository.js";
import { clearUserFollowingRel } from "../src/repositories/UserFollowingRepository.js";
import {
  deleteUserEntity,
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
    let success: boolean;
    let count: number;

    const internalUser = await getInternalUser(db);
    const ctx = requestContext(internalUser, db);

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
