import { getSession } from "@/auth";
import { db } from "@/db";
import { lessons } from "@/db/schema/lessons";
import { and, eq, SQL } from "drizzle-orm";

export const GET = async () => {
  const { userId, role } = await getSession();

  const filters: SQL[] = [];

  if (role === "coach") {
    filters.push(eq(lessons.coach_id, userId));
  }

  if (role === "student") {
    filters.push(eq(lessons.student_id, userId));
  }

  const res = await db
    .select()
    .from(lessons)
    .where(and(...filters));

  return Response.json(res);
};
