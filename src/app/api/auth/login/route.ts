import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionCookieOptions } from "@/lib/auth/cookie-options";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { createSession } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { loginBodySchema } from "@/lib/validations/auth";
import {
  buildLoginRateLimitKey,
  clearLoginFailures,
  getClientIp,
  getLoginThrottleState,
  registerLoginFailure,
} from "@/lib/security/login-rate-limit";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = loginBodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const ip = getClientIp(request.headers);
  const rateLimitKey = buildLoginRateLimitKey(ip, email);
  const throttle = getLoginThrottleState(rateLimitKey);
  if (!throttle.allowed) {
    return NextResponse.json(
      {
        error: "Muitas tentativas de login. Tente novamente em instantes.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(throttle.retryAfterSeconds) },
      },
    );
  }

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user?.passwordHash || !user.isActive) {
    registerLoginFailure(rateLimitKey);
    return NextResponse.json(
      { error: "E-mail ou senha incorretos" },
      { status: 401 }
    );
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    registerLoginFailure(rateLimitKey);
    return NextResponse.json(
      { error: "E-mail ou senha incorretos" },
      { status: 401 }
    );
  }
  clearLoginFailures(rateLimitKey);

  const token = await createSession(user.id);
  const res = NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName ?? user.name,
      role: user.role,
    },
  });
  res.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());
  return res;
}
