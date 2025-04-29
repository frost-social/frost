import { Kysely, PostgresDialect } from "npm:kysely";
import { Pool } from "npm:pg";
import type { Database } from "../kysely/schema/database.ts";

export function configure(): Kysely<Database> {
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        database: "frost",
        host: "db",
        user: "postgres",
        port: 5432,
        max: 10,
      }),
    }),
  });
}
