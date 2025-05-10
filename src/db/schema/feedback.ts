import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { lessons } from "./lessons";

export const feedback = sqliteTable("feedback", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  coach_id: text("coach_id")
    .references(() => users.id)
    .notNull(),
  lesson_id: text("lesson_id")
    .references(() => lessons.id)
    .notNull(),
  satisfaction_rating: int("satisfaction_rating").notNull(),
  notes: text("notes"),
});

export type InsertFeedback = typeof feedback.$inferInsert;
export type SelectFeedback = typeof feedback.$inferSelect;
