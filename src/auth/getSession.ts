import { cookies } from "next/headers";

export const getSession = async () => {
  const token = (await cookies()).get("token");

  if (!token) return;

  return JSON.parse(token.value);
};
