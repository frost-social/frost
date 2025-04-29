import type { LeafTable } from "./leaf.ts";
import type { UserTable } from "./user.ts";

export interface Database {
  user: UserTable;
  leaf: LeafTable;
}

export interface Table {
  row_version: number;
  created_at: Date;
  updated_at: Date;
}
