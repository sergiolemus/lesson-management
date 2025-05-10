import { getSession } from "@/auth";
import { db } from "@/db";
import { lessons } from "@/db/schema/lessons";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export const POST = async (request: NextRequest) => {
  const { userId, role } = await getSession();

  if (role === "coach") {
    return Response.json({}, { status: 401 });
  }

  const {
    coach_id,
    slot_id,
    student_id: _student_id,
    complete,
  } = await request.json();

  const { origin } = request.nextUrl;
  const { headers } = request;

  const body = JSON.stringify({ booked: 1 });

  const slot = await fetch(`${origin}/api/slots/${slot_id}`, {
    method: "PATCH",
    body,
    headers: {
      ...headers,
      "content-type": "application/json",
      "content-length": String(body.length),
      cookie: (await cookies()).toString(),
    },
  });

  const entry = await db
    .insert(lessons)
    .values({
      slot_id,
      coach_id,
      student_id: userId,
      complete: 0,
      ...(complete && { complete }),
    })
    .returning();

  return Response.json({ lesson: entry[0], slot: await slot.json() });
};
