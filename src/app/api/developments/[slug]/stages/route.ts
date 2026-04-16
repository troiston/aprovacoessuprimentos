import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { appendAuditLog } from "@/lib/audit/audit-log.service";
import { AuditEntity } from "@/lib/audit/constants";
import { requireEditorForApi } from "@/lib/api/route-auth";
import { developmentProgressPercentFromPrismaRows } from "@/lib/domain/progress";
import { patchDevelopmentStageBodySchema } from "@/lib/validations/development-stage";

type RouteContext = { params: Promise<{ slug: string }> };

/**
 * Atualiza o status de uma etapa do empreendimento (EDITOR+).
 * Audita a alteração e devolve o progresso recalculado.
 */
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

  const parsed = patchDevelopmentStageBodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Dados inválidos" },
      { status: 422 },
    );
  }

  const { slug } = await context.params;
  const { stageId, status: nextStatus } = parsed.data;

  const development = await db.development.findFirst({
    where: { slug, deletedAt: null, isActive: true },
    select: { id: true, slug: true },
  });

  if (!development) {
    return NextResponse.json({ error: "Empreendimento não encontrado" }, { status: 404 });
  }

  const ds = await db.developmentStage.findFirst({
    where: {
      developmentId: development.id,
      stageId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!ds) {
    return NextResponse.json(
      { error: "Etapa não encontrada neste empreendimento" },
      { status: 404 },
    );
  }

  const oldStatus = ds.status;

  await db.$transaction(async (tx) => {
    await tx.developmentStage.update({
      where: { id: ds.id },
      data: {
        status: nextStatus,
        updatedById: user.id,
      },
    });

    await appendAuditLog(
      {
        userId: user.id,
        entity: AuditEntity.DevelopmentStage,
        entityId: ds.id,
        action: "stage.status.update",
        field: "status",
        oldValue: oldStatus,
        newValue: nextStatus,
        metadata: {
          developmentId: development.id,
          slug: development.slug,
          stageId,
        },
      },
      tx,
    );
  });

  const allStages = await db.developmentStage.findMany({
    where: { developmentId: development.id },
    include: {
      stage: { select: { globalWeight: true } },
    },
  });

  const progress = developmentProgressPercentFromPrismaRows(
    allStages.map((row) => ({
      status: row.status,
      globalWeight: row.stage.globalWeight,
    })),
  );

  const updatedRow = await db.developmentStage.findUniqueOrThrow({
    where: { id: ds.id },
    select: { id: true, status: true, updatedAt: true, stageId: true },
  });

  return NextResponse.json({
    developmentStage: updatedRow,
    progress,
  });
}
