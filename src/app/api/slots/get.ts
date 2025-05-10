import { db } from "@/db";
import { slots } from "@/db/schema/slots";
import { and, eq, gte, lte, SQL } from "drizzle-orm";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;

  const start_date = searchParams.get("start_date");
  const end_date = searchParams.get("end_date");
  const coach_id = searchParams.get("coach_id");

  const filters: SQL[] = [];

  if (coach_id) {
    filters.push(eq(slots.coach_id, String(coach_id)));
  }

  if (start_date) {
    filters.push(gte(slots.start_date, Number(start_date)));
  }

  if (end_date) {
    filters.push(lte(slots.end_date, Number(end_date)));
  }

  const results = await db
    .select()
    .from(slots)
    .where(and(...filters));

  return Response.json(results);
};
