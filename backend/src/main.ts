import { AppConfig, run } from './app';

async function bootstrap(): Promise<void> {
  const config: AppConfig = {
    port: 3000,
    env: 'development',
    db: {
      connectionString: 'postgresql://postgres:postgres@db:5432/frost',
      maxPool: 20,
    },
  };
  await run(config);
}

bootstrap()
.catch(err => {
  console.log('Error:', err);
});
