import { getSession } from "@/auth";
import { db } from "@/db";
import { feedback } from "@/db/schema/feedback";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const { userId, role } = await getSession();

  if (role === "student") {
    return Response.json({}, { status: 401 });
  }

  const {
    lesson_id,
    satisfaction_rating,
    notes,
    coach_id: _coach_id,
  } = await request.json();

  const { origin } = request.nextUrl;
  const { headers } = request;

  const body = JSON.stringify({ complete: 1 });

  const lesson = await fetch(`${origin}/api/lessons/${lesson_id}`, {
    method: "PATCH",
    body,
    headers: {
      ...headers,
      "content-type": "application/json",
      "content-length": String(body.length),
    },
  });

  const entry = await db
    .insert(feedback)
    .values({
      coach_id: userId,
      lesson_id,
      satisfaction_rating,
      ...(notes && { notes }),
    })
    .returning();

  return Response.json({ feedback: entry[0], lesson: await lesson.json() });
};
