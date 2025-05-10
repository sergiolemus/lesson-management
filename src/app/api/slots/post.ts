import { db } from "@/db";
import { slots } from "@/db/schema/slots";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const { start_date, end_date } = await request.json();

  const entry = await db
    .insert(slots)
    .values({
      coach_id: "38c55822-6076-47d6-baf0-de7941287e6c",
      start_date,
      end_date,
    })
    .returning();

  return Response.json(entry[0]);
};
