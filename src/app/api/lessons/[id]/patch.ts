import { getSession } from "@/auth";
import { db } from "@/db";
import { lessons } from "@/db/schema/lessons";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { role } = await getSession();

  if (role === "student") {
    return Response.json({}, { status: 401 });
  }

  const { id } = await params;
  const { complete } = await request.json();

  const [entry] = await db
    .update(lessons)
    .set({
      ...(complete && { complete }),
    })
    .where(eq(lessons.id, id))
    .returning();

  if (complete) {
    const { origin } = request.nextUrl;
    const { headers } = request;

    const body = JSON.stringify({ status: "complete" });

    const slot = await fetch(`${origin}/api/slots/${entry.slot_id}`, {
      method: "PATCH",
      body,
      headers: {
        ...headers,
        "content-type": "application/json",
        "content-length": String(body.length),
        cookie: (await cookies()).toString(),
      },
    });

    return Response.json({ lesson: entry, slot: await slot.json() });
  }

  return Response.json(entry);
};
