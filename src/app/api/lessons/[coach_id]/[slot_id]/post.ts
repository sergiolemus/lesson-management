import { getSession } from "@/auth";
import { db } from "@/db";
import { lessons } from "@/db/schema/lessons";
import { NextRequest } from "next/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ coach_id: string; slot_id: string }> }
) => {
  const { coach_id, slot_id } = await params;
  const { userId } = await getSession();
  const { origin } = request.nextUrl;
  const { headers } = request;

  const body = JSON.stringify({ booked: 1 });

  const slot = await fetch(`${origin}/api/slots/${coach_id}/${slot_id}`, {
    method: "PATCH",
    body,
    headers: {
      ...headers,
      "content-type": "application/json",
      "content-length": String(body.length),
    },
  });

  const entry = await db
    .insert(lessons)
    .values({
      slot_id,
      coach_id,
      student_id: userId,
      complete: 0,
    })
    .returning();

  return Response.json({ lesson: entry[0], slot: await slot.json() });
};
