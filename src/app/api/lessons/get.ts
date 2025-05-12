import { getSession } from "@/auth";
import { db } from "@/db";
import { lessons } from "@/db/schema/lessons";
import { and, eq, SQL } from "drizzle-orm";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const { userId, role } = await getSession();
  const { searchParams } = request.nextUrl;

  const slot_id = searchParams.get("slot_id");

  const filters: SQL[] = [];

  if (role === "coach") {
    filters.push(eq(lessons.coach_id, userId));
  }

  if (role === "student") {
    filters.push(eq(lessons.student_id, userId));
  }

  if (slot_id) {
    filters.push(eq(lessons.slot_id, slot_id));
  }

  const res = await db
    .select()
    .from(lessons)
    .where(and(...filters));

  return Response.json(res);
};
