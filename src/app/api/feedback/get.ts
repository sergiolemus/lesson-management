import { getSession } from "@/auth";
import { db } from "@/db";
import { feedback } from "@/db/schema/feedback";
import { and, eq, SQL } from "drizzle-orm";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const { userId, role } = await getSession();
  const { searchParams } = request.nextUrl;

  const lesson_id = searchParams.get("lesson_id");

  const filters: SQL[] = [];

  if (role === "student") {
    return Response.json([], { status: 401 });
  }

  if (role === "coach") {
    filters.push(eq(feedback.coach_id, userId));
  }

  if (lesson_id) {
    filters.push(eq(feedback.lesson_id, lesson_id));
  }

  const res = await db
    .select()
    .from(feedback)
    .where(and(...filters));

  return Response.json(res);
};
