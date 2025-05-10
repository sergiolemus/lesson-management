import { db } from "@/db";
import { slots } from "@/db/schema/slots";
import { and, eq, gte, SQL } from "drizzle-orm";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ coach_id: string }> }
) => {
  const { coach_id } = await params;
  const { searchParams } = request.nextUrl;

  const start_date = searchParams.get("start_date");

  const filters: SQL[] = [eq(slots.coach_id, coach_id)];

  if (start_date) {
    filters.push(gte(slots.start_date, Number(start_date)));
  }

  const results = await db
    .select()
    .from(slots)
    .where(and(...filters));

  return Response.json(results);
};
