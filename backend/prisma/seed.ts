import { PrismaClient } from '@prisma/client';
import { Container } from 'inversify';
import { TYPES } from '../src/container/types';
import { AccessContext } from '../src/modules/AccessContext';
import * as UserRepository from '../src/repositories/UserRepository';
import * as TokenService from '../src/services/TokenService';

const prisma = new PrismaClient();

async function main() {
  // setup container
  const container = new Container();
  container.bind<Container>(TYPES.Container).toConstantValue(container);
  container.bind<PrismaClient>(TYPES.db).toConstantValue(prisma);

  const ctx: AccessContext = { userId: '' };

  // create root user
  let rootUser = await UserRepository.get({ userName: 'root' }, ctx, container);
  if (rootUser == null) {
    rootUser = await UserRepository.create({
      userName: 'root',
      displayName: 'root',
      passwordAuthEnabled: false,
    }, ctx, container);
    console.log('User "root" has been created.');
  }
  ctx.userId = rootUser.userId;

  // create public user
  let publicUser = await UserRepository.get({ userName: 'public' }, ctx, container);
  if (publicUser == null) {
    publicUser = await UserRepository.create({
      userName: 'public',
      displayName: 'public',
      passwordAuthEnabled: false,
    }, ctx, container);

    // create token for public
    const scopes = ["user.auth"];
    await TokenService.create({
      userId: publicUser.userId,
      tokenKind: "access_token",
      scopes: scopes,
    }, ctx, container);

    console.log('User "public" has been created.');
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
