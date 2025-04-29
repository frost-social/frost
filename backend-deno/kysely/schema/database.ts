import type { LeafsTable } from "./leafs.ts";
import type { UsersTable } from "./users.ts";

export interface Database {
  users: UsersTable;
  leafs: LeafsTable;
}

export interface Table {
  row_version: number;
  created_at: Date;
  updated_at: Date;
}
