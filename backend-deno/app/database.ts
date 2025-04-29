import { Kysely, PostgresDialect } from "npm:kysely";
import { Pool } from "npm:pg";
import type { Database } from "../kysely/schema/database.ts";

export function configure(): Kysely<Database> {
  const url = Deno.env.get("DATABASE_URL");
  if (url == null) {
    throw new Error("database config required");
  }
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: url,
        max: 10,
      }),
    }),
  });
}
