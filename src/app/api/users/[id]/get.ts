import { getSession } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { and, eq, SQL } from "drizzle-orm";
import { NextRequest } from "next/server";

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const { userId, role } = await getSession();

  const filters: SQL[] = [];

  if (role === "coach" && id) {
    filters.push(eq(users.id, id));
  } else {
    filters.push(eq(users.id, userId));
  }

  const results = await db
    .select()
    .from(users)
    .where(and(...filters));

  return Response.json(results[0]);
};
