import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-session";
import { requireEditorForApi } from "@/lib/api/route-auth";
import { appendAuditLog } from "@/lib/audit/audit-log.service";
import { AuditEntity } from "@/lib/audit/constants";
import { db } from "@/lib/db";
import { getDevelopmentsList } from "@/lib/services/developments-list";
import { slugifyName } from "@/lib/utils/slug";
import { createDevelopmentBodySchema } from "@/lib/validations/development";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const developments = await getDevelopmentsList();
  return NextResponse.json({ developments });
}

export async function POST(request: Request) {
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

  const parsed = createDevelopmentBodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Dados inválidos" },
      { status: 422 },
    );
  }

  let slug = parsed.data.slug?.length
    ? parsed.data.slug
    : slugifyName(parsed.data.name);

  const clash = await db.development.findFirst({
    where: { slug, deletedAt: null },
    select: { id: true },
  });
  if (clash) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const dev = await db.development.create({
    data: {
      name: parsed.data.name.trim(),
      slug,
      code: parsed.data.code?.trim() ?? null,
      isActive: true,
    },
  });

  const catalogStages = await db.stage.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true },
  });

  await db.developmentStage.createMany({
    data: catalogStages.map((s) => ({
      developmentId: dev.id,
      stageId: s.id,
      status: "NOT_STARTED" as const,
    })),
  });

  await appendAuditLog({
    userId: user.id,
    entity: AuditEntity.Development,
    entityId: dev.id,
    action: "development.create",
    metadata: { slug: dev.slug, name: dev.name },
  });

  return NextResponse.json({ development: dev }, { status: 201 });
}
