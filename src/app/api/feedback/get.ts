import { getSession } from "@/auth";
import { db } from "@/db";
import { feedback } from "@/db/schema/feedback";
import { and, eq, SQL } from "drizzle-orm";

export const GET = async () => {
  const { userId, role } = await getSession();

  const filters: SQL[] = [];

  if (role === "student") {
    return Response.json([], { status: 401 });
  }

  if (role === "coach") {
    filters.push(eq(feedback.coach_id, userId));
  }

  const res = await db
    .select()
    .from(feedback)
    .where(and(...filters));

  return Response.json(res);
};
