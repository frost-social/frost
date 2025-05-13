import { serve } from '@hono/node-server';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

// See:
// - https://hono.dev/docs/getting-started/nodejs
// - https://hono.dev/examples/zod-openapi

const echoGetInput = z.object({
  message: z.string()
    .openapi({
      param: {
        name: "message",
        in: "query",
      },
    }),
});

const echoGetOutput = z.object({
  message: z.string()
    .openapi({
      example: ""
    }),
}).openapi('Echo');

const echoGet = createRoute({
  method: "get",
  path: "/api/v1/echo",
  request: {
    query: echoGetInput,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: echoGetOutput,
        }
      },
      description: "OK",
    },
  }
});

const app = new OpenAPIHono();

app.openapi(echoGet, (c) => {
  const message = c.req.query("message");
  c.status(200);
  return c.json({
    message: message,
  });
});

const server = serve(app, (x) => {
  console.log(`listing started on http://localhost:${x.port}/`);
});

// graceful shutdown
process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  })
});
