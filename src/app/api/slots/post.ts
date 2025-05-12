import { getSession } from "@/auth";
import { db } from "@/db";
import { slots } from "@/db/schema/slots";
import { and, eq, gt, gte, lt, or } from "drizzle-orm";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const { userId, role } = await getSession();

  if (role === "student") {
    return Response.json({}, { status: 401 });
  }

  const { start_date, end_date, coach_id: _coach_id } = await request.json();

  const check = await db
    .select()
    .from(slots)
    .where(
      and(
        eq(slots.coach_id, userId),
        or(
          and(gt(slots.end_date, start_date), lt(slots.end_date, end_date)),
          and(eq(slots.start_date, start_date), eq(slots.end_date, end_date)),
          and(gt(slots.start_date, start_date), lt(slots.start_date, end_date))
        )
      )
    );

  if (check.length > 0) {
    return Response.json(
      {
        error: {
          code: "CONFLICT",
          message: "The resource conflicts with an existing one.",
        },
      },
      { status: 409 }
    );
  }

  const [entry] = await db
    .insert(slots)
    .values({
      coach_id: userId,
      start_date,
      end_date,
      status: "free",
    })
    .returning();

  return Response.json(entry);
};
