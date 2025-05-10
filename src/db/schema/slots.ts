import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const slots = sqliteTable("slot", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  user_id: text("user_id")
    .references(() => users.id)
    .notNull(),
  start_date: int("start_date").notNull(),
  end_date: int("end_date").notNull(),
});

export type InsertSlots = typeof slots.$inferInsert;
export type SelectSlots = typeof slots.$inferSelect;
