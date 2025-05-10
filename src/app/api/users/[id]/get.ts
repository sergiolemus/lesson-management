import { getSession } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id: _id } = await params;
  const { userId } = await getSession();

  const results = await db.select().from(users).where(eq(users.id, userId));

  return Response.json(results);
};
