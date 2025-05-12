import { getSession } from "@/auth";
import { db } from "@/db";
import { slots } from "@/db/schema/slots";
import { and, eq, gte, isNull, lte, or, SQL } from "drizzle-orm";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const { userId, role } = await getSession();
  const { searchParams } = request.nextUrl;

  const start_date = searchParams.get("start_date");
  const end_date = searchParams.get("end_date");
  const coach_id = searchParams.get("coach_id");
  const status = searchParams.get("status");

  const filters: SQL[] = [];

  if (role === "student") {
    filters.push(
      //@ts-expect-error fix SQL type error due to or() usage
      or(eq(slots.student_id, String(userId)), isNull(slots.student_id))
    );
  }

  if (coach_id) {
    filters.push(eq(slots.coach_id, String(coach_id)));
  }

  if (start_date) {
    filters.push(gte(slots.start_date, Number(start_date)));
  }

  if (end_date) {
    filters.push(lte(slots.end_date, Number(end_date)));
  }

  if (status) {
    filters.push(eq(slots.status, String(status)));
  }

  const results = await db
    .select()
    .from(slots)
    .where(and(...filters));

  return Response.json(results);
};
