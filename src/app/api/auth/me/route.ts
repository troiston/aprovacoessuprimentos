import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  return NextResponse.json({
    id: user.id,
    email: user.email,
    displayName: user.displayName ?? user.name,
    role: user.role,
  });
}
