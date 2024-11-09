import { Container } from 'inversify';
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

  const ctx: AccessContext = { userId: '' };

  // debugユーザーを取得。無ければ作る。
  console.log('get debug user');
  let user = await UserRepository.get({ userName: 'debug' }, ctx, container);
  if (user == null) {
    console.log('create debug user');
    user = await UserRepository.create({
      userName: 'debug',
      displayName: 'Debug',
      passwordAuthEnabled: false,
    }, ctx, container);
  }
  ctx.userId = user.userId;

  container.snapshot();
  try {
    const db = container.get<PrismaClient>(TYPES.db);
    await db.$transaction(async (tx) => {
      container.rebind(TYPES.db).toConstantValue(tx);
      // create 10 posts
      for (let i = 0; i < 10; i++) {
        const createResult = await LeafRepository.createTimelineLeaf({
          userId: ctx.userId,
          content: `This is a post content ${i}.`,
        }, ctx, container);
        console.log(inspect(createResult, { depth: 10 }));
      }

      // fetch posts
      console.log('タイムライン取得');
      const posts = await LeafRepository.fetchHomeTimeline({
        kind: 'home',
        limit: 8,
      }, ctx, container);
      console.log(inspect(posts, { depth: 10 }));

      console.log('finish');

      throw new Error('rollback');
    });
  } finally {
    container.restore();
    const db = container.get<PrismaClient>(TYPES.db);
    await db.$disconnect();
  }
}
run()
  .catch(err => {
    console.error(err);
  });
