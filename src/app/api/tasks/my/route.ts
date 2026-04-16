import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-session";
import { findTasksForUser } from "@/lib/services/tasks-queries";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const tasks = await findTasksForUser(user.id);
  return NextResponse.json({ tasks });
}
