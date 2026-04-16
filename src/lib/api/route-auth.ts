import { NextResponse } from "next/server";
import type { User } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth/get-session";
import { canEditStagesOrTasks, canManageUsers } from "@/lib/domain/permissions";

/**
 * Utilizador autenticado ou 401 JSON (para route handlers).
 */
export async function requireApiUser(): Promise<User | NextResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  return user;
}

/**
 * EDITOR ou ADMIN (mutações em etapas/tarefas) ou 403.
 */
export async function requireEditorForApi(): Promise<User | NextResponse> {
  const userOrRes = await requireApiUser();
  if (userOrRes instanceof NextResponse) {
    return userOrRes;
  }
  if (!canEditStagesOrTasks(userOrRes)) {
    return NextResponse.json({ error: "Sem permissão para esta operação" }, { status: 403 });
  }
  return userOrRes;
}

/**
 * ADMIN apenas (definições sensíveis, e-mail).
 */
export async function requireAdminForApi(): Promise<User | NextResponse> {
  const userOrRes = await requireApiUser();
  if (userOrRes instanceof NextResponse) {
    return userOrRes;
  }
  if (!canManageUsers(userOrRes)) {
    return NextResponse.json({ error: "Sem permissão para esta operação" }, { status: 403 });
  }
  return userOrRes;
}
