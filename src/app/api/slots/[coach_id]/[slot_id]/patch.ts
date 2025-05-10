import { db } from "@/db";
import { slots } from "@/db/schema/slots";
import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ coach_id: string; slot_id: string }> }
) => {
  const { coach_id, slot_id } = await params;
  const { start_date, end_date, booked } = await request.json();

  const entry = await db
    .update(slots)
    .set({
      ...(start_date && { start_date }),
      ...(end_date && { end_date }),
      ...(booked && { booked }),
    })
    .where(and(eq(slots.coach_id, coach_id), eq(slots.id, slot_id)))
    .returning();

  return Response.json(entry[0]);
};
