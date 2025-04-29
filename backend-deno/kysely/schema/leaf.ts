import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import type { Table } from "./database.ts";

export type LeafKind = "timeline" | "chat";

export interface LeafTable extends Table {
  leaf_id: Generated<string>;
  leaf_kind: LeafKind;
  chat_room_id: string | null;
  user_id: string;
  content: string;
}

export type SelectableLeafRow = Selectable<LeafTable>;
export type InsertableLeafRow = Insertable<LeafTable>;
export type UpdateableLeafRow = Updateable<LeafTable>;
