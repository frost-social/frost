import { Container } from 'inversify';
import { BACKEND_URSR_ID } from '../../constants/specialUserId';
import { setupContainer } from '../../container/inversify.config';
import { TYPES } from '../../container/types';
import { AccessContext } from '../../modules/AccessContext';
import { PrismaClient } from '@prisma/client';
import { inspect } from 'util';
import * as UserRepository from '../../repositories/UserRepository';
import * as LeafRepository from '../../repositories/LeafRepository';

async function run() {
  const container = new Container();
  setupContainer(container);

  const ctx: AccessContext = { userId: BACKEND_URSR_ID };

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
  const createResult = await LeafRepository.createTimelineLeaf({
    userId: ctx.userId,
    content: 'This is a leaf content.',
  }, ctx, container);
  console.log(inspect(createResult, { depth: 10 }));

  console.log('get');
  const getResult = await LeafRepository.getLeaf({
    leafId: createResult.leafId,
  }, ctx, container);
  console.log(inspect(getResult, { depth: 10 }));

  console.log('remove');
  const removeResult = await LeafRepository.deleteLeaf({
    leafId: createResult.leafId,
  }, ctx, container);
  console.log(inspect(removeResult, { depth: 10 }));

  console.log('finish');

  const db = container.get<PrismaClient>(TYPES.db);
  await db.$disconnect();
}
run()
  .catch(err => {
    console.error(err);
  });
