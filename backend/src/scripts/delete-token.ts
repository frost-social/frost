import * as TokenRepository from '../repositories/TokenRepository';
import { AccessInfo } from '../modules/AccessInfo';
import { PrismaClient } from '@prisma/client';

async function run() {
  const token = process.argv[2];
  if (token == null) {
    console.log("引数からトークンを指定してください");
    return;
  }

  const db = new PrismaClient();

  const info: AccessInfo = { userId: 'internal' };

  const success = await TokenRepository.deleteToken({
    token,
  }, info, db);
  if (success) {
    console.log(`トークン'${token}'を削除しました`);
  } else {
    console.log(`トークン'${token}'の削除に失敗しました`);
  }

  await db.$disconnect();
}
run()
  .catch(err => {
    console.error(err);
  });
