import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { slots } from "./slots";

export const lessons = sqliteTable("lesson", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  coach_id: text("coach_id")
    .references(() => users.id)
    .notNull(),
  slot_id: text("slot_id")
    .references(() => slots.id)
    .notNull(),
  student_id: text("student_id")
    .references(() => users.id)
    .notNull(),
  complete: int("complete").default(0),
});

export type InsertLessons = typeof lessons.$inferInsert;
export type SelectLessons = typeof lessons.$inferSelect;
