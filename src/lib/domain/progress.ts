import type { StageStatus as PrismaStageStatus } from "@/generated/prisma/enums";

/**
 * Motor de progresso — paridade com a planilha:
 * Peso bruto = (2×Impacto + Dependência + Tempo + Esforço) / 5
 * Peso global por etapa = (peso da fase macro / 100) × (peso bruto da etapa / Σ pesos brutos na fase)
 * % avanço = Σ (statusNumérico × peso global da etapa), com pesos globais somando 100 (%).
 */

export type StageStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface MacroPhaseInput {
  id: string;
  weightPercent: number;
}

export interface StageWeightInput {
  id: string;
  macroPhaseId: string;
  rawWeight: number;
  sortOrder: number;
}

/**
 * Peso bruto a partir dos quatro parâmetros (1–5).
 */
export function computeRawWeight(
  impact: number,
  dependency: number,
  time: number,
  effort: number
): number {
  return (2 * impact + dependency + time + effort) / 5;
}

export function stageStatusToNumeric(status: StageStatus): number {
  switch (status) {
    case "NOT_STARTED":
      return 0;
    case "IN_PROGRESS":
      return 0.5;
    case "COMPLETED":
      return 1;
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

/**
 * Distribui pesos globais (0–100) para cada etapa. Soma dos pesos globais = 100.
 */
export function computeGlobalWeightsPercent(
  macroPhases: MacroPhaseInput[],
  stages: StageWeightInput[]
): Map<string, number> {
  const byPhase = new Map<string, StageWeightInput[]>();

  for (const s of stages) {
    const list = byPhase.get(s.macroPhaseId) ?? [];
    list.push(s);
    byPhase.set(s.macroPhaseId, list);
  }

  const out = new Map<string, number>();
  const sumPhaseWeights = macroPhases.reduce((a, p) => a + p.weightPercent, 0);
  if (Math.abs(sumPhaseWeights - 100) > 0.01) {
    throw new Error(
      `Soma dos pesos de fase macro deve ser 100 (recebido ${sumPhaseWeights})`
    );
  }

  for (const phase of macroPhases) {
    const list = byPhase.get(phase.id) ?? [];
    const sumRaw = list.reduce((a, s) => a + s.rawWeight, 0);
    if (sumRaw <= 0) {
      throw new Error(`Fase ${phase.id} sem peso bruto somável (sumRaw=${sumRaw})`);
    }
    const phaseFraction = phase.weightPercent / 100;
    for (const s of list) {
      const g = phaseFraction * (s.rawWeight / sumRaw) * 100;
      out.set(s.id, g);
    }
  }

  return out;
}

/**
 * % de avanço do empreendimento (0–100).
 */
export function computeDevelopmentProgressPercent(
  stages: { globalWeight: number; status: StageStatus }[]
): number {
  let sum = 0;
  for (const s of stages) {
    sum += stageStatusToNumeric(s.status) * s.globalWeight;
  }
  return sum;
}

export function roundProgressPercent(value: number, decimals = 2): number {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}

/**
 * Avanço % a partir de linhas com peso global e status (Prisma) por etapa do empreendimento.
 */
export function developmentProgressPercentFromPrismaRows(
  rows: { status: PrismaStageStatus; globalWeight: number }[],
): number {
  const mapped: { globalWeight: number; status: StageStatus }[] = rows.map((r) => ({
    globalWeight: r.globalWeight,
    status: r.status,
  }));
  return roundProgressPercent(computeDevelopmentProgressPercent(mapped), 2);
}
