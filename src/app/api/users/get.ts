import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const role = searchParams.get("role");

  if (!role) {
    const results = await db
      .select({ name: users.name, id: users.id, role: users.role })
      .from(users);

    return Response.json(results);
  }

  const results = await db
    .select({ name: users.name, id: users.id, role: users.role })
    .from(users)
    .where(eq(users.role, role));

  return Response.json(results);
};
