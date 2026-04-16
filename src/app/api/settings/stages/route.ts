import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/api/route-auth";
import { appendAuditLog } from "@/lib/audit/audit-log.service";
import { AuditEntity } from "@/lib/audit/constants";
import { db } from "@/lib/db";
import {
  patchStagesCatalogBodySchema,
  postStageCatalogBodySchema,
} from "@/lib/validations/stage-catalog";
import {
  getStagesCatalogPayload,
  recalculateAllStageGlobalWeights,
  scoresToRawWeight,
} from "@/lib/services/stage-catalog";

export async function GET() {
  const userOrRes = await requireAdminForApi();
  if (userOrRes instanceof NextResponse) {
    return userOrRes;
  }

  const payload = await getStagesCatalogPayload();
  return NextResponse.json(payload);
}

export async function PATCH(request: Request) {
  const userOrRes = await requireAdminForApi();
  if (userOrRes instanceof NextResponse) {
    return userOrRes;
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = patchStagesCatalogBodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Dados inválidos" },
      { status: 422 },
    );
  }

  const ids = new Set(parsed.data.stages.map((s) => s.id));
  const existingCount = await db.stage.count({ where: { id: { in: [...ids] } } });
  if (existingCount !== ids.size) {
    return NextResponse.json(
      { error: "Uma ou mais etapas não existem no catálogo." },
      { status: 422 },
    );
  }

  await db.$transaction(async (tx) => {
    for (const row of parsed.data.stages) {
      const rawWeight = scoresToRawWeight(
        row.impactScore,
        row.dependencyScore,
        row.timeScore,
        row.effortScore,
      );
      await tx.stage.update({
        where: { id: row.id },
        data: {
          ...(row.name !== undefined ? { name: row.name } : {}),
          impactScore: row.impactScore,
          dependencyScore: row.dependencyScore,
          timeScore: row.timeScore,
          effortScore: row.effortScore,
          rawWeight,
        },
      });
    }
    await recalculateAllStageGlobalWeights(tx);
  });

  const stages = await db.stage.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      macroPhaseId: true,
      name: true,
      sortOrder: true,
      impactScore: true,
      dependencyScore: true,
      timeScore: true,
      effortScore: true,
      rawWeight: true,
      globalWeight: true,
    },
  });

  return NextResponse.json({ ok: true, stages });
}

export async function POST(request: Request) {
  const userOrRes = await requireAdminForApi();
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

  const parsed = postStageCatalogBodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Dados inválidos" },
      { status: 422 },
    );
  }

  const macro = await db.macroPhase.findFirst({
    where: { id: parsed.data.macroPhaseId },
  });
  if (!macro) {
    return NextResponse.json({ error: "Fase macro inválida" }, { status: 422 });
  }

  const maxSort = await db.stage.aggregate({
    where: { macroPhaseId: parsed.data.macroPhaseId },
    _max: { sortOrder: true },
  });
  const sortOrder = (maxSort._max.sortOrder ?? 0) + 1;

  const impactScore = 3;
  const dependencyScore = 3;
  const timeScore = 3;
  const effortScore = 3;
  const rawWeight = scoresToRawWeight(
    impactScore,
    dependencyScore,
    timeScore,
    effortScore,
  );

  const created = await db.$transaction(async (tx) => {
    const stage = await tx.stage.create({
      data: {
        macroPhaseId: parsed.data.macroPhaseId,
        name: parsed.data.name,
        sortOrder,
        impactScore,
        dependencyScore,
        timeScore,
        effortScore,
        rawWeight,
        globalWeight: 0,
      },
    });

    const developments = await tx.development.findMany({
      where: { deletedAt: null },
      select: { id: true },
    });

    if (developments.length > 0) {
      await tx.developmentStage.createMany({
        data: developments.map((d) => ({
          developmentId: d.id,
          stageId: stage.id,
          status: "NOT_STARTED" as const,
        })),
      });
      await tx.stageSchedule.createMany({
        data: developments.map((d) => ({
          developmentId: d.id,
          stageId: stage.id,
        })),
      });
    }

    await recalculateAllStageGlobalWeights(tx);
    return stage;
  });

  await appendAuditLog({
    userId: user.id,
    entity: AuditEntity.Stage,
    entityId: created.id,
    action: "stage.catalog.create",
    metadata: { name: parsed.data.name, macroPhaseId: parsed.data.macroPhaseId },
  });

  const stage = await db.stage.findUnique({
    where: { id: created.id },
    select: {
      id: true,
      macroPhaseId: true,
      name: true,
      sortOrder: true,
      impactScore: true,
      dependencyScore: true,
      timeScore: true,
      effortScore: true,
      rawWeight: true,
      globalWeight: true,
    },
  });

  return NextResponse.json({ ok: true, stage });
}
