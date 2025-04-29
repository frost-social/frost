import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import type { Table } from "./database.ts";

export interface UserTable extends Table {
  user_id: Generated<string>;
  name: string;
  display_name: string;
  password_auth_enabled: boolean;
}

export type SelectableUserRow = Selectable<UserTable>;
export type InsertableUserRow = Insertable<UserTable>;
export type UpdateableUserRow = Updateable<UserTable>;
