import { Container } from 'inversify';
import { setupContainer } from '../../container/inversify.config';
import { TYPES } from '../../container/types';
import { AccessContext } from '../../modules/AccessContext';
import { PrismaClient } from '@prisma/client';
import { inspect } from 'util';
import * as UserRepository from '../../repositories/UserRepository';

async function run() {
  const container = new Container();
  setupContainer(container);
  const db = container.get<PrismaClient>(TYPES.db);

  const ctx: AccessContext = { userId: '' };

  // debugユーザーを取得。無ければ作る。
  console.log('get debug user');
  let user = await UserRepository.getUser({ userName: 'debug' }, ctx, container);
  if (user == null) {
    console.log('create debug user');
    user = await UserRepository.createUser({
      userName: 'debug',
      displayName: 'Debug',
      passwordAuthEnabled: false,
    }, ctx, container);
  }
  ctx.userId = user.userId;

  console.log('create');
  const userResult = await UserRepository.createUser({
    userName: 'debuguser',
    displayName: 'debug user',
    passwordAuthEnabled: true,
  }, ctx, container);
  console.log(inspect(userResult, { depth: 10 }));

  if (userResult == null) {
    await db.$disconnect();
    return;
  }

  console.log('get (userId)');
  const getResult1 = await UserRepository.getUser({
    userId: userResult.userId,
  }, ctx, container);
  console.log(inspect(getResult1, { depth: 10 }));

  console.log('get (userName)');
  const getResult2 = await UserRepository.getUser({
    userName: userResult.userName,
  }, ctx, container);
  console.log(inspect(getResult2, { depth: 10 }));

  console.log('remove');
  const removeResult = await UserRepository.deleteUser({
    userId: userResult.userId,
  }, ctx, container);
  console.log(inspect(removeResult, { depth: 10 }));

  console.log('finish');

  await db.$disconnect();
}
run()
  .catch(err => {
    console.error(err);
  });
