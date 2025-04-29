import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import type { Table } from "./database.ts";

export interface UsersTable extends Table {
  user_id: Generated<string>;
  name: string;
  display_name: string;
  password_auth_enabled: boolean;
}

export type SelectableUserRow = Selectable<UsersTable>;
export type InsertableUserRow = Insertable<UsersTable>;
export type UpdateableUserRow = Updateable<UsersTable>;
