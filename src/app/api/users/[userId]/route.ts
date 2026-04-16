import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/api/route-auth";
import { db } from "@/lib/db";
import { patchUserBodySchema } from "@/lib/validations/users";

type RouteContext = { params: Promise<{ userId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const adminOrRes = await requireAdminForApi();
  if (adminOrRes instanceof NextResponse) {
    return adminOrRes;
  }
  const admin = adminOrRes;

  const { userId } = await context.params;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = patchUserBodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Dados inválidos" },
      { status: 422 },
    );
  }

  const body = parsed.data;

  const target = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, isActive: true },
  });
  if (!target) {
    return NextResponse.json({ error: "Utilizador não encontrado" }, { status: 404 });
  }

  const nextRole = body.role ?? target.role;
  const nextActive = body.isActive ?? target.isActive;

  if (target.role === "ADMIN" && (nextRole !== "ADMIN" || !nextActive)) {
    const otherAdmins = await db.user.count({
      where: {
        role: "ADMIN",
        isActive: true,
        id: { not: userId },
      },
    });
    if (otherAdmins === 0) {
      return NextResponse.json(
        { error: "Tem de existir pelo menos um administrador ativo." },
        { status: 422 },
      );
    }
  }

  if (userId === admin.id && body.isActive === false) {
    return NextResponse.json(
      { error: "Não pode desativar a sua própria conta." },
      { status: 422 },
    );
  }

  const updated = await db.user.update({
    where: { id: userId },
    data: {
      ...(body.role !== undefined ? { role: body.role } : {}),
      ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
      ...(body.displayName !== undefined ? { displayName: body.displayName } : {}),
    },
    select: {
      id: true,
      email: true,
      name: true,
      displayName: true,
      role: true,
      isActive: true,
    },
  });

  return NextResponse.json({ user: updated });
}
