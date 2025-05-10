import { getSession } from "@/auth";
import { db } from "@/db";
import { slots } from "@/db/schema/slots";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const { userId, role } = await getSession();

  if (role === "student") {
    return Response.json({}, { status: 401 });
  }

  const { start_date, end_date, coach_id: _coach_id } = await request.json();

  const entry = await db
    .insert(slots)
    .values({
      coach_id: userId,
      start_date,
      end_date,
      booked: 0,
    })
    .returning();

  return Response.json(entry[0]);
};
