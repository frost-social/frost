import 'reflect-metadata';
import { createHttpServer } from './modules/httpServer';
import { readFileSync } from 'fs';
import { RootRouter } from './routes';
import { PrismaClient } from '@prisma/client';
import { DB } from './modules/db';

export type AppConfig = {
  port: number,
  env: 'development' | 'production' | 'test',
  db: {
    connectionString: string,
    maxPool?: number,
  },
};

export async function run(config: AppConfig) {
  console.log('+----------------------------------+');
  console.log('|          Frost *                 |');
  console.log('|          backend server          |');
  console.log('+----------------------------------+');
  const projectInfo = JSON.parse(readFileSync('../package.json', { encoding: 'utf8' }));
  console.log('Version ' + projectInfo.version);
  console.log();

  // TODO: validate app config

  const db: DB = new PrismaClient();
  const rootRouter = new RootRouter();

  const server = await createHttpServer(rootRouter, db);

  await new Promise<void>(resolve => {
    server.listen(config.port, () => resolve());
  });

  console.log('listen on port ' + config.port);

  return server;
}
