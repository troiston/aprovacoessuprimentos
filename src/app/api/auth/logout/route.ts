import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { deleteSessionByToken } from "@/lib/auth/session";
import { getSessionTokenFromCookies } from "@/lib/auth/get-session";

export async function POST() {
  const token = await getSessionTokenFromCookies();
  if (token) {
    await deleteSessionByToken(token);
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
