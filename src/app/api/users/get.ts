import { db } from "@/db";
import { users } from "@/db/schema/users";
import { and, eq, SQL } from "drizzle-orm";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const role = searchParams.get("role");

  const filters: SQL[] = [];

  if (role) {
    filters.push(eq(users.role, role));
  }

  const res = await db
    .select({
      name: users.name,
      id: users.id,
      role: users.role,
    })
    .from(users)
    .where(and(...filters));

  return Response.json(res);
};
