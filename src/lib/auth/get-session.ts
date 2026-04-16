import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "./constants";
import { getUserFromSessionToken } from "./session";
import type { User } from "@/generated/prisma/client";

export async function getSessionTokenFromCookies(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function getCurrentUser(): Promise<User | null> {
  const token = await getSessionTokenFromCookies();
  if (!token) {
    return null;
  }
  return getUserFromSessionToken(token);
}
