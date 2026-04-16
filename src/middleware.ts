import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

function createNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const b of bytes) {
    binary += String.fromCharCode(b);
  }
  return btoa(binary);
}

/** Rotas que não exigem sessão. */
function isPublicPath(pathname: string): boolean {
  if (pathname === "/login") {
    return true;
  }
  if (pathname === "/api/auth/login" || pathname === "/api/auth/logout") {
    return true;
  }
  if (pathname.startsWith("/api/webhooks/")) {
    return true;
  }
  if (pathname.startsWith("/_next")) {
    return true;
  }
  if (pathname === "/favicon.ico") {
    return true;
  }
  if (/\.(ico|png|jpg|jpeg|gif|webp|svg)$/i.test(pathname)) {
    return true;
  }
  return false;
}

function isProtectedAppPath(pathname: string): boolean {
  const prefixes = [
    "/dashboard",
    "/developments",
    "/tasks",
    "/settings",
    "/audit",
    "/styleguide",
  ];
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isDev = process.env.NODE_ENV === "development";

  /** Registo público desativado — convites/admin apenas */
  if (pathname === "/register") {
    const login = new URL("/login", request.url);
    login.searchParams.set("notice", "register-disabled");
    return NextResponse.redirect(login);
  }

  if (isPublicPath(pathname)) {
    if (pathname === "/login" && token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return applyCsp(request, isDev);
  }

  if (pathname.startsWith("/api/")) {
    if (
      !token &&
      pathname !== "/api/auth/logout"
    ) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    return applyCsp(request, isDev);
  }

  if (pathname === "/" || isProtectedAppPath(pathname)) {
    if (!token) {
      const login = new URL("/login", request.url);
      login.searchParams.set("from", pathname);
      return NextResponse.redirect(login);
    }
  }

  return applyCsp(request, isDev);
}

function applyCsp(request: NextRequest, isDev: boolean): NextResponse {
  const requestHeaders = new Headers(request.headers);

  if (isDev) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const nonce = createNonce();
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.stripe.com https://*.stripe.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
