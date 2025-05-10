import { PrismaClient } from "@prisma/client";
import type { AccessInfo } from "../src/core/service.js";
import { clearLeafEntitiesOfUser } from "../src/repositories/LeafRepository.js";
import { deletePasswordEntity } from "../src/repositories/PasswordRepository.js";
import { deleteTokenEntity, getTokenEntitiesOfUser } from "../src/repositories/TokenRepository.js";
import { clearUserFollowingRel } from "../src/repositories/UserFollowingRepository.js";
import { deleteUserEntity, getUserEntity } from "../src/repositories/UserRepository.js";

async function run() {
  const userName = process.argv[2];
  if (userName == null) {
    console.log("引数からユーザー名を指定してください");
    return;
  }

  const db = new PrismaClient();

  try {
      const info: AccessInfo = { userId: "internal" };

      let success: boolean;
      let count: number;

      const user = await getUserEntity({
        userName: userName,
      }, info, db);
      if (user != null) {
        console.log(`ユーザー名が'${userName}'のユーザーが見つかりました(ユーザーID'${user.userId}')。`);
      } else {
        console.log(`ユーザー名が'${userName}'のユーザーが見つかりませんでした。`);
        return;
      }

      count = await clearLeafEntitiesOfUser({
        userId: user.userId,
      }, info, db);
      if (count > 0) {
        console.log(`ユーザーID'${userName}'の${count}件のリーフを削除しました。`);
      }

      const tokens = await getTokenEntitiesOfUser({
        userId: user.userId,
      }, info, db);

      for (const tokenRow of tokens) {
        await deleteTokenEntity({
          token: tokenRow.token,
        }, info, db);
        console.log(`ユーザーID'${user.userId}'のアプリケーション認可情報を1件削除しました。`);
      }

      count = await clearUserFollowingRel({
        userId: user.userId,
      }, info, db);
      if (count > 0) {
        console.log(`ユーザーID'${user.userId}'に関する${count}件のフォロー関係を解除しました。`);
      }

      success = await deletePasswordEntity({
        userId: user.userId,
      }, info, db);
      if (success) {
        console.log(`ユーザーID'${user.userId}'の認証情報を削除しました。`);
      } else {
        console.log(`ユーザーID'${user.userId}'の認証情報の削除に失敗しました。`);
        return;
      }

      success = await deleteUserEntity({
        userId: user.userId,
      }, info, db);
      if (success) {
        console.log(`ユーザーID'${user.userId}'のユーザー情報を削除しました。`);
      } else {
        console.log(`ユーザーID'${user.userId}'のユーザー情報の削除に失敗しました。`);
        return;
      }
  } finally {
    await db.$disconnect();
  }
}
run().catch((err) => {
  console.error(err);
});
