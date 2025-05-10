import { db } from "@/db";
import { slots } from "@/db/schema/slots";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ coach_id: string }> }
) => {
  const { coach_id } = await params;

  const results = await db
    .select()
    .from(slots)
    .where(eq(slots.coach_id, coach_id));

  return Response.json(results);
};
