import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-session";
import { requireEditorForApi } from "@/lib/api/route-auth";
import { appendAuditLog } from "@/lib/audit/audit-log.service";
import { AuditEntity } from "@/lib/audit/constants";
import { db } from "@/lib/db";
import { getDevelopmentDetailBySlug } from "@/lib/services/development-detail";
import { patchDevelopmentBodySchema } from "@/lib/validations/development";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { slug } = await context.params;
  const development = await getDevelopmentDetailBySlug(slug);
  if (!development) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ development });
}

export async function PATCH(request: Request, context: RouteContext) {
  const userOrRes = await requireEditorForApi();
  if (userOrRes instanceof NextResponse) {
    return userOrRes;
  }
  const user = userOrRes;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = patchDevelopmentBodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Dados inválidos" },
      { status: 422 },
    );
  }

  const { slug } = await context.params;
  const existing = await db.development.findFirst({
    where: { slug, deletedAt: null },
  });
  if (!existing) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  const data: {
    name?: string;
    code?: string | null;
    isActive?: boolean;
  } = {};
  if (parsed.data.name !== undefined) {
    data.name = parsed.data.name.trim();
  }
  if (parsed.data.code !== undefined) {
    data.code = parsed.data.code?.trim() ?? null;
  }
  if (parsed.data.isActive !== undefined) {
    data.isActive = parsed.data.isActive;
  }

  const updated = await db.development.update({
    where: { id: existing.id },
    data,
  });

  await appendAuditLog({
    userId: user.id,
    entity: AuditEntity.Development,
    entityId: updated.id,
    action: "development.update",
    metadata: { slug: updated.slug, patch: parsed.data },
  });

  return NextResponse.json({ development: updated });
}

/** Soft delete: `deletedAt` + inativo. */
export async function DELETE(_request: Request, context: RouteContext) {
  const userOrRes = await requireEditorForApi();
  if (userOrRes instanceof NextResponse) {
    return userOrRes;
  }
  const user = userOrRes;

  const { slug } = await context.params;
  const existing = await db.development.findFirst({
    where: { slug, deletedAt: null },
  });
  if (!existing) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  const updated = await db.development.update({
    where: { id: existing.id },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
  });

  await appendAuditLog({
    userId: user.id,
    entity: AuditEntity.Development,
    entityId: updated.id,
    action: "development.soft_delete",
    metadata: { slug: updated.slug },
  });

  return NextResponse.json({ ok: true });
}
