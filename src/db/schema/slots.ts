import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const slots = sqliteTable("slot", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  user_id: text("user_id").references(() => users.id),
  start_date: int("start_date"),
  end_date: int("end_date"),
});

export type InsertSlots = typeof slots.$inferInsert;
export type SelectSlots = typeof slots.$inferSelect;
