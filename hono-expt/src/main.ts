import { serve } from '@hono/node-server';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

// See:
// - https://hono.dev/docs/getting-started/nodejs
// - https://hono.dev/examples/zod-openapi

const app = new OpenAPIHono();

const server = serve(app, (x) => {
  console.log(`listing started on http://localhost:${x.port}/`);
});

// graceful shutdown
process.on("SIGINT", () => {
  server.close();
  process.exit(0);
})
process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  })
});
