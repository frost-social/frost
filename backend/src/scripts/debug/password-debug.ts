import { Container } from 'inversify';
import { BACKEND_URSR_ID } from '../../constants/specialUserId';
import { setupContainer } from '../../container/inversify.config';
import { TYPES } from '../../container/types';
import { AccessContext } from '../../modules/AccessContext';
import { PrismaClient } from '@prisma/client';
import { inspect } from 'util';
import * as PasswordVerificationRepository from '../../repositories/PasswordVerificationRepository';
import * as UserRepository from '../../repositories/UserRepository';
import * as UserService from '../../services/UserService';
import { generatePasswordVerification } from '../../services/UserService';

async function run() {
  let ok;

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
  const verification = generatePasswordVerification({ userId: ctx.userId, password: 'abcdefg' });
  const createResult = await PasswordVerificationRepository.createVerification(verification, ctx, container);
  console.log(inspect(createResult, { depth: 10 }));

  console.log('get');
  const getResult = await PasswordVerificationRepository.getVerification({
    userId: ctx.userId,
  }, ctx, container);
  console.log(inspect(getResult, { depth: 10 }));

  console.log('delete');
  const removeResult = await PasswordVerificationRepository.deleteVerification({
    userId: ctx.userId,
  }, ctx, container);
  console.log(inspect(removeResult, { depth: 10 }));

  console.log('service: register');
  await UserService.registerPassword({ userId: ctx.userId, password: 'abcdefgh' }, ctx, container);

  console.log('service: vefify');
  ok = await UserService.verifyPassword({ userId: ctx.userId, password: 'abcdefgh' }, ctx, container);
  console.log(ok);

  console.log('finish');

  const db = container.get<PrismaClient>(TYPES.db);
  await db.$disconnect();
}
run()
  .catch(err => {
    console.error(err);
  });
