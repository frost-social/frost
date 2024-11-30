import { Container } from 'inversify';
import { BACKEND_URSR_ID } from '../constants/specialUserId';
import { setupContainer } from '../container/inversify.config';
import { TYPES } from '../container/types';
import * as TokenRepository from '../repositories/TokenRepository';
import { AccessContext } from '../modules/AccessContext';
import { PrismaClient } from '@prisma/client';

async function run() {
  const token = process.argv[2];
  if (token == null) {
    console.log("引数からトークンを指定してください");
    return;
  }

  // setup container
  const container = new Container();
  setupContainer(container);

  // get instance
  const db = container.get<PrismaClient>(TYPES.db);

  const ctx: AccessContext = { userId: BACKEND_URSR_ID };

  const success = await TokenRepository.deleteToken({
    token,
  }, ctx, container);
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
