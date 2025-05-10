import { getSession } from "@/auth";
import { db } from "@/db";
import { slots } from "@/db/schema/slots";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const { userId } = await getSession();
  const { start_date, end_date } = await request.json();

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
