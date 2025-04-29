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
  return c.text("Hello Hono!");
});

Deno.serve({ port: loadPort() }, app.fetch);
