import { getSession } from "@/auth";
import { db } from "@/db";
import { slots } from "@/db/schema/slots";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { role } = await getSession();

  if (role === "coach") {
    return Response.json({}, { status: 401 });
  }

  const { id } = await params;
  const { start_date, end_date, status, student_id } = await request.json();

  const entry = await db
    .update(slots)
    .set({
      ...(start_date && { start_date }),
      ...(end_date && { end_date }),
      ...(status && { status }),
      ...(student_id && { student_id }),
    })
    .where(eq(slots.id, id))
    .returning();

  return Response.json(entry[0]);
};
