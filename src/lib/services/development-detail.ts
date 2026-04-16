import { db } from "@/lib/db";
import {
  computeDevelopmentProgressPercent,
  roundProgressPercent,
  stageStatusToNumeric,
} from "@/lib/domain/progress";
import type { DevelopmentDetail } from "@/types/development-detail";
import {
  buildMacroSegments,
  formatDatePtBR,
  toProgressStatus,
} from "@/lib/services/developments-list";

/**
 * Painel de um empreendimento (rotas usam `slug` no segmento `[id]`).
 */
export async function getDevelopmentDetailBySlug(
  slug: string,
): Promise<DevelopmentDetail | null> {
  const development = await db.development.findFirst({
    where: { slug, deletedAt: null, isActive: true },
    include: {
      stages: {
        include: {
          stage: {
            include: { macroPhase: true },
          },
        },
      },
      tasks: {
        where: { deletedAt: null },
        include: {
          stage: true,
          assignee: true,
          kanbanColumn: { select: { isTerminal: true } },
        },
      },
    },
  });

  if (!development) {
    return null;
  }

  const now = new Date();

  const segments = buildMacroSegments(
    development.stages.map((ds) => ({
      status: ds.status,
      stage: {
        globalWeight: ds.stage.globalWeight,
        macroPhase: { sortOrder: ds.stage.macroPhase.sortOrder },
      },
    })),
  );

  const stagesPayload = development.stages.map((ds) => ({
    globalWeight: ds.stage.globalWeight,
    status: toProgressStatus(ds.status),
  }));
  const progress = roundProgressPercent(
    computeDevelopmentProgressPercent(stagesPayload),
    2,
  );

  const sortedDevStages = [...development.stages].sort(
    (a, b) => a.stage.sortOrder - b.stage.sortOrder,
  );

  const stages = sortedDevStages.map((ds) => {
    const st = toProgressStatus(ds.status);
    const contribution = roundProgressPercent(
      stageStatusToNumeric(st) * ds.stage.globalWeight,
      2,
    );
    return {
      id: ds.id,
      stageId: ds.stageId,
      phase: ds.stage.macroPhase.name,
      name: ds.stage.name,
      status: ds.status,
      rawWeight: ds.stage.rawWeight,
      globalWeight: ds.stage.globalWeight,
      contribution,
    };
  });

  const openTasks = development.tasks.filter((t) => !t.kanbanColumn.isTerminal);
  const pendingCount = openTasks.length;
  const overdueCount = openTasks.filter(
    (t) => t.deadline !== null && t.deadline < now,
  ).length;

  const tasks = openTasks
    .map((t) => ({
      id: t.id,
      stageName: t.stage.name,
      description: t.description,
      assigneeLabel:
        t.assignee?.displayName ??
        t.assignee?.name ??
        t.assignee?.email ??
        "—",
      deadlineLabel: t.deadline ? formatDatePtBR(t.deadline) : "—",
      isOverdue: t.deadline !== null && t.deadline < now,
      notes: t.notes,
    }))
    .sort((a, b) => Number(b.isOverdue) - Number(a.isOverdue));

  return {
    id: development.id,
    slug: development.slug,
    name: development.name,
    progress,
    pendingCount,
    overdueCount,
    segments,
    stages,
    tasks,
  };
}
