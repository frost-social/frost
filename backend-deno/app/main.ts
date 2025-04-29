import { Hono } from "hono";
import * as database from "./database.ts";

function loadPort() {
  let port: number | undefined;
  const portStr = Deno.env.get("LISTEN_PORT");
  if (portStr != null) {
    port = Number.parseInt(portStr);
  }
  if (port == null || Number.isNaN(port)) {
    port = 8000;
  }
  return port;
}

const app = new Hono();

const db = database.configure();

app.get("/", (c) => {
  return c.text("frost*");
});

app.get("/api/users", async (c) => {
  const results = await db
    .selectFrom("user")
    .select(["name"])
    .limit(100)
    .execute();

  const mappedData = results.map((result) => {
    return {
      username: result.name,
    };
  });

  return c.json(mappedData);
});

app.get("/api/users/:name", async (c) => {
  const name = c.req.param("name");
  const result = await db
    .selectFrom("user")
    .where("name", "=", name)
    .select(["display_name"])
    .executeTakeFirst();

  if (result == null) {
    c.status(400);
    return c.json({
      error: "not found",
    });
  }

  return c.json({
    username: name,
    name: result.display_name,
  });
});

Deno.serve({ port: loadPort() }, app.fetch);
