/**
 * Carga inicial idempotente (dev): catálogo de fases/etapas, 9 empreendimentos,
 * status por etapa (FIT LAGO AZUL calibrado; demais por meta de %).
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import type { StageStatus } from "../src/generated/prisma/enums";
import {
  computeDevelopmentProgressPercent,
  computeGlobalWeightsPercent,
  computeRawWeight,
  roundProgressPercent,
  type MacroPhaseInput,
  type StageWeightInput,
} from "../src/lib/domain/progress";
import { hashPassword } from "../src/lib/auth/password";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? "",
});
const prisma = new PrismaClient({ adapter });

/** Encontra inteiros 1–5 que minimizam o erro vs peso bruto alvo (planilha). */
function bestScoresForRawTarget(target: number): [number, number, number, number] {
  let best: [number, number, number, number] = [3, 3, 3, 3];
  let bestDiff = Infinity;
  for (let impact = 1; impact <= 5; impact++) {
    for (let dependency = 1; dependency <= 5; dependency++) {
      for (let time = 1; time <= 5; time++) {
        for (let effort = 1; effort <= 5; effort++) {
          const rw = computeRawWeight(impact, dependency, time, effort);
          const diff = Math.abs(rw - target);
          if (diff < bestDiff) {
            bestDiff = diff;
            best = [impact, dependency, time, effort];
          }
        }
      }
    }
  }
  return best;
}

/** Pesos de fase macro calibrados para paridade do piloto FIT LAGO AZUL (ver `progress.test.ts`). */
const MACRO_PHASES_SEED = [
  { sortOrder: 1, name: "Aquisição Terreno", weightPercent: 18 },
  { sortOrder: 2, name: "Incorporação", weightPercent: 32 },
  { sortOrder: 3, name: "Atividades p/ Lançamento", weightPercent: 10 },
  { sortOrder: 4, name: "CEF", weightPercent: 40 },
] as const;

/** Ordem e pesos brutos alinhados ao mock do painel FIT LAGO AZUL. */
const STAGE_RAW_TARGETS: { name: string; phaseSort: 1 | 2 | 3 | 4; targetRaw: number }[] = [
  { name: "Avaliação / Sondagem", phaseSort: 1, targetRaw: 4.4 },
  { name: "Negociação", phaseSort: 1, targetRaw: 3.8 },
  { name: "Título/Escritura", phaseSort: 1, targetRaw: 3.4 },
  { name: "Registro no RI", phaseSort: 1, targetRaw: 3.4 },
  { name: "Memorial Descritivo", phaseSort: 2, targetRaw: 2.8 },
  { name: "Projeto Legal", phaseSort: 2, targetRaw: 4.2 },
  { name: "Projeto de Fundação", phaseSort: 2, targetRaw: 4.4 },
  { name: "Projeto Complementar", phaseSort: 2, targetRaw: 3.6 },
  { name: "LMC", phaseSort: 2, targetRaw: 4.6 },
  { name: "Viabilidade Técnica", phaseSort: 2, targetRaw: 3.8 },
  { name: "EIV", phaseSort: 2, targetRaw: 3.8 },
  { name: "LAE", phaseSort: 2, targetRaw: 4.4 },
  { name: "Aprovação IMPLURB", phaseSort: 2, targetRaw: 4.8 },
  { name: "IMMU", phaseSort: 2, targetRaw: 4.2 },
  { name: "Matrícula", phaseSort: 2, targetRaw: 4.2 },
  { name: "Licença Ambiental", phaseSort: 2, targetRaw: 4.6 },
  { name: "Alvará de Construção", phaseSort: 3, targetRaw: 4.2 },
  { name: "Pizza Contrato/CV", phaseSort: 3, targetRaw: 3.8 },
  { name: "Projeto de Vendas", phaseSort: 3, targetRaw: 3.4 },
  { name: "Lançamento comercial", phaseSort: 3, targetRaw: 4.2 },
  { name: "Análise GIDUR/CEF", phaseSort: 4, targetRaw: 4.4 },
  { name: "Contratação CEF", phaseSort: 4, targetRaw: 4.0 },
];

const FIT_LAGO_STATUSES: StageStatus[] = [
  "COMPLETED",
  "COMPLETED",
  "COMPLETED",
  "COMPLETED",
  "COMPLETED",
  "COMPLETED",
  "COMPLETED",
  "IN_PROGRESS",
  "IN_PROGRESS",
  "NOT_STARTED",
  "NOT_STARTED",
  "NOT_STARTED",
  "NOT_STARTED",
  "NOT_STARTED",
  "NOT_STARTED",
  "NOT_STARTED",
  "NOT_STARTED",
  "NOT_STARTED",
  "NOT_STARTED",
  "NOT_STARTED",
  "NOT_STARTED",
  "NOT_STARTED",
];

const DEVELOPMENT_TARGETS: { slug: string; name: string; targetPercent: number | null }[] = [
  { slug: "realize-laranjeiras", name: "REALIZE LARANJEIRAS", targetPercent: 93.93 },
  { slug: "realize-ponta-negra", name: "REALIZE PONTA NEGRA", targetPercent: 81.25 },
  { slug: "ola-mosaico", name: "OLÁ MOSAICO", targetPercent: 75.4 },
  { slug: "fit-lago-azul", name: "FIT LAGO AZUL", targetPercent: null },
  { slug: "fit-ponta-negra", name: "FIT PONTA NEGRA", targetPercent: 52.18 },
  { slug: "realize-adrianopolis", name: "REALIZE ADRIANÓPOLIS", targetPercent: 63.71 },
  { slug: "residencial-aguas-brancas", name: "RES. ÁGUAS BRANCAS", targetPercent: 41.55 },
  { slug: "ola-parque", name: "OLÁ PARQUE", targetPercent: 17.67 },
  { slug: "fit-compensa", name: "FIT COMPENSA", targetPercent: 35.82 },
];

function greedyStatusesForTarget(
  targetPercent: number,
  orderedGlobals: { sortOrder: number; globalWeight: number }[]
): StageStatus[] {
  const sorted = [...orderedGlobals].sort((a, b) => a.sortOrder - b.sortOrder);
  let remaining = targetPercent;
  const out: StageStatus[] = [];
  for (const row of sorted) {
    const g = row.globalWeight;
    if (remaining >= g - 1e-9) {
      out.push("COMPLETED");
      remaining -= g;
    } else if (remaining >= g / 2 - 1e-9) {
      out.push("IN_PROGRESS");
      remaining -= g / 2;
    } else {
      out.push("NOT_STARTED");
    }
  }
  return out;
}

async function main(): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.auditLog.deleteMany();
    await tx.task.deleteMany();
    await tx.developmentStage.deleteMany();
    await tx.stageSchedule.deleteMany();
    await tx.development.deleteMany();
    await tx.stage.deleteMany();
    await tx.macroPhase.deleteMany();
  });

  const macroRows = await prisma.$transaction(
    MACRO_PHASES_SEED.map((m) =>
      prisma.macroPhase.create({
        data: {
          name: m.name,
          sortOrder: m.sortOrder,
          weightPercent: m.weightPercent,
        },
      })
    )
  );

  const phaseIdBySort = new Map<number, string>();
  for (const row of macroRows) {
    phaseIdBySort.set(row.sortOrder, row.id);
  }

  const macroInputs: MacroPhaseInput[] = macroRows.map((m) => ({
    id: m.id,
    weightPercent: m.weightPercent,
  }));

  const createdStages = await prisma.$transaction(
    STAGE_RAW_TARGETS.map((def, index) => {
      const pid = phaseIdBySort.get(def.phaseSort);
      if (!pid) {
        throw new Error(`Fase macro sort ${def.phaseSort} não encontrada`);
      }
      const [impactScore, dependencyScore, timeScore, effortScore] = bestScoresForRawTarget(
        def.targetRaw
      );
      const rawWeight = computeRawWeight(impactScore, dependencyScore, timeScore, effortScore);
      return prisma.stage.create({
        data: {
          macroPhaseId: pid,
          name: def.name,
          sortOrder: index,
          impactScore,
          dependencyScore,
          timeScore,
          effortScore,
          rawWeight,
          globalWeight: 0,
        },
      });
    })
  );

  const weightInputs: StageWeightInput[] = createdStages.map((s) => ({
    id: s.id,
    macroPhaseId: s.macroPhaseId,
    rawWeight: s.rawWeight,
    sortOrder: s.sortOrder,
  }));

  const globals = computeGlobalWeightsPercent(macroInputs, weightInputs);

  await prisma.$transaction(
    createdStages.map((s) =>
      prisma.stage.update({
        where: { id: s.id },
        data: { globalWeight: globals.get(s.id) ?? 0 },
      })
    )
  );

  const stagesWithGlobals = await prisma.stage.findMany({
    orderBy: { sortOrder: "asc" },
  });

  await prisma.$transaction(
    DEVELOPMENT_TARGETS.map((d) =>
      prisma.development.create({
        data: { slug: d.slug, name: d.name, isActive: true },
      })
    )
  );

  const fitDev = await prisma.development.findUniqueOrThrow({
    where: { slug: "fit-lago-azul" },
  });

  await prisma.developmentStage.createMany({
    data: stagesWithGlobals.map((s, i) => ({
      developmentId: fitDev.id,
      stageId: s.id,
      status: FIT_LAGO_STATUSES[i] ?? "NOT_STARTED",
    })),
  });

  const fitProgress = roundProgressPercent(
    computeDevelopmentProgressPercent(
      stagesWithGlobals.map((s, i) => ({
        globalWeight: s.globalWeight,
        status: FIT_LAGO_STATUSES[i] ?? "NOT_STARTED",
      }))
    )
  );

  if (Math.abs(fitProgress - 28.04) > 0.15) {
    throw new Error(
      `Paridade FIT LAGO AZUL fora da tolerância: obtido ${fitProgress}%, esperado ~28,04%`
    );
  }

  for (const target of DEVELOPMENT_TARGETS) {
    if (target.slug === "fit-lago-azul" || target.targetPercent === null) {
      continue;
    }
    const dev = await prisma.development.findUniqueOrThrow({
      where: { slug: target.slug },
    });
    const greedy = greedyStatusesForTarget(target.targetPercent, stagesWithGlobals);
    await prisma.developmentStage.createMany({
      data: stagesWithGlobals.map((s, i) => ({
        developmentId: dev.id,
        stageId: s.id,
        status: greedy[i] ?? "NOT_STARTED",
      })),
    });
  }

  const adminPassword =
    process.env.SEED_ADMIN_PASSWORD ?? "troque-esta-senha-dev";
  const passwordHash = await hashPassword(adminPassword);

  await prisma.user.upsert({
    where: { email: "acesso@digaola.com" },
    create: {
      email: "acesso@digaola.com",
      name: "Administrador",
      displayName: "Administrador",
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
    update: {
      role: "ADMIN",
      displayName: "Administrador",
      passwordHash,
      isActive: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
