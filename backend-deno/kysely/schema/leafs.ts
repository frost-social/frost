import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import type { Table } from "./database.ts";

export type LeafKind = "timeline" | "chat";

export interface LeafsTable extends Table {
  leaf_id: Generated<string>;
  leaf_kind: LeafKind;
  chat_room_id: string | null;
  user_id: string;
  content: string;
}

export type SelectableLeafRow = Selectable<LeafsTable>;
export type InsertableLeafRow = Insertable<LeafsTable>;
export type UpdateableLeafRow = Updateable<LeafsTable>;
