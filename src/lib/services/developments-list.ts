import type { StageStatus } from "@/generated/prisma/enums";
import { db } from "@/lib/db";
import {
  computeDevelopmentProgressPercent,
  roundProgressPercent,
  stageStatusToNumeric,
  type StageStatus as ProgressStageStatus,
} from "@/lib/domain/progress";
import type { DevelopmentListItem } from "@/types/development-list";

/** Alinhado ao dashboard: 4 fases macro → cores do tema. */
const MACRO_PHASE_CHART: Record<
  number,
  { label: string; color: string }
> = {
  1: { label: "Aq. Terreno", color: "var(--color-chart-1)" },
  2: { label: "Incorporação", color: "var(--color-chart-2)" },
  3: { label: "Lançamento", color: "var(--color-chart-3)" },
  4: { label: "CEF", color: "var(--color-chart-4)" },
};

export function toProgressStatus(status: StageStatus): ProgressStageStatus {
  return status;
}

export function formatDatePtBR(d: Date): string {
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Manaus",
  });
}

function pickCurrentStageName(
  rows: { status: StageStatus; stage: { name: string; sortOrder: number } }[],
): string {
  const sorted = [...rows].sort((a, b) => a.stage.sortOrder - b.stage.sortOrder);
  const inProgress = sorted.find((r) => r.status === "IN_PROGRESS");
  if (inProgress) {
    return inProgress.stage.name;
  }
  const notStarted = sorted.find((r) => r.status === "NOT_STARTED");
  if (notStarted) {
    return notStarted.stage.name;
  }
  const last = sorted[sorted.length - 1];
  return last?.stage.name ?? "—";
}

export function buildMacroSegments(
  devStages: {
    status: StageStatus;
    stage: { globalWeight: number; macroPhase: { sortOrder: number } };
  }[],
): { value: number; label: string; color: string }[] {
  const sums = new Map<number, number>();
  for (const ds of devStages) {
    const sort = ds.stage.macroPhase.sortOrder;
    const n = stageStatusToNumeric(toProgressStatus(ds.status));
    const prev = sums.get(sort) ?? 0;
    sums.set(sort, prev + n * ds.stage.globalWeight);
  }
  return ([1, 2, 3, 4] as const).map((ord) => {
    const meta = MACRO_PHASE_CHART[ord];
    const raw = sums.get(ord) ?? 0;
    return {
      value: roundProgressPercent(raw, 2),
      label: meta.label,
      color: meta.color,
    };
  });
}

/**
 * Empreendimentos ativos (não excluídos) com progresso e contagens de tarefas.
 */
export async function getDevelopmentsList(): Promise<DevelopmentListItem[]> {
  const developments = await db.development.findMany({
    where: { deletedAt: null, isActive: true },
    orderBy: { name: "asc" },
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
        include: { kanbanColumn: { select: { isTerminal: true } } },
      },
    },
  });

  const now = new Date();

  return developments.map((d) => {
    const stagesPayload = d.stages.map((ds) => ({
      globalWeight: ds.stage.globalWeight,
      status: toProgressStatus(ds.status),
    }));
    const progress = roundProgressPercent(
      computeDevelopmentProgressPercent(stagesPayload),
      2,
    );

    const segments = buildMacroSegments(
      d.stages.map((ds) => ({
        status: ds.status,
        stage: {
          globalWeight: ds.stage.globalWeight,
          macroPhase: { sortOrder: ds.stage.macroPhase.sortOrder },
        },
      })),
    );

    const pendingCount = d.tasks.filter((t) => !t.kanbanColumn.isTerminal).length;
    const overdueCount = d.tasks.filter(
      (t) =>
        !t.kanbanColumn.isTerminal &&
        t.deadline !== null &&
        t.deadline < now,
    ).length;

    const stageTimes = d.stages.map((s) => s.updatedAt.getTime());
    const taskTimes = d.tasks.map((t) => t.updatedAt.getTime());
    const lastTs = Math.max(
      d.updatedAt.getTime(),
      stageTimes.length ? Math.max(...stageTimes) : 0,
      taskTimes.length ? Math.max(...taskTimes) : 0,
    );
    const lastUpdate = formatDatePtBR(new Date(lastTs));

    return {
      id: d.id,
      slug: d.slug,
      name: d.name,
      progress,
      status: "active" as const,
      pendingCount,
      overdueCount,
      segments,
      currentStage: pickCurrentStageName(
        d.stages.map((ds) => ({
          status: ds.status,
          stage: { name: ds.stage.name, sortOrder: ds.stage.sortOrder },
        })),
      ),
      lastUpdate,
      updatedAtMs: lastTs,
      units: null,
      city: null,
      typology: null,
    };
  });
}
