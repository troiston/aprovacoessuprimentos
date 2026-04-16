import { type Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import {
  computeGlobalWeightsPercent,
  computeRawWeight,
  type MacroPhaseInput,
  type StageWeightInput,
} from "@/lib/domain/progress";

/**
 * Recalcula `globalWeight` de todas as etapas do catálogo a partir dos `rawWeight` atuais
 * e dos pesos das fases macro (soma = 100).
 */
export async function recalculateAllStageGlobalWeights(
  tx: Prisma.TransactionClient,
): Promise<void> {
  const macroPhases = await tx.macroPhase.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, weightPercent: true },
  });
  const stages = await tx.stage.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      macroPhaseId: true,
      rawWeight: true,
      sortOrder: true,
    },
  });

  const macroInputs: MacroPhaseInput[] = macroPhases.map((m) => ({
    id: m.id,
    weightPercent: m.weightPercent,
  }));
  const weightInputs: StageWeightInput[] = stages.map((s) => ({
    id: s.id,
    macroPhaseId: s.macroPhaseId,
    rawWeight: s.rawWeight,
    sortOrder: s.sortOrder,
  }));

  const globals = computeGlobalWeightsPercent(macroInputs, weightInputs);

  await Promise.all(
    stages.map((s) =>
      tx.stage.update({
        where: { id: s.id },
        data: { globalWeight: globals.get(s.id) ?? 0 },
      }),
    ),
  );
}

export function scoresToRawWeight(
  impactScore: number,
  dependencyScore: number,
  timeScore: number,
  effortScore: number,
): number {
  return computeRawWeight(impactScore, dependencyScore, timeScore, effortScore);
}

export type StagesCatalogPayload = {
  macroPhases: {
    id: string;
    name: string;
    sortOrder: number;
    weightPercent: number;
  }[];
  stages: {
    id: string;
    macroPhaseId: string;
    name: string;
    sortOrder: number;
    impactScore: number;
    dependencyScore: number;
    timeScore: number;
    effortScore: number;
    rawWeight: number;
    globalWeight: number;
  }[];
};

export async function getStagesCatalogPayload(): Promise<StagesCatalogPayload> {
  const macroPhases = await db.macroPhase.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, sortOrder: true, weightPercent: true },
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
  return { macroPhases, stages };
}
