import { describe, expect, it } from "vitest";
import {
  computeDevelopmentProgressPercent,
  computeGlobalWeightsPercent,
  computeRawWeight,
  roundProgressPercent,
  stageStatusToNumeric,
} from "./progress";

describe("computeRawWeight", () => {
  it("aplica (2I + D + T + E) / 5", () => {
    expect(computeRawWeight(5, 4, 4, 4)).toBeCloseTo(4.4, 5);
    expect(computeRawWeight(4, 3, 4, 4)).toBeCloseTo(3.8, 5);
  });
});

describe("stageStatusToNumeric", () => {
  it("mapeia Finalizado / Em andamento / Não iniciado", () => {
    expect(stageStatusToNumeric("NOT_STARTED")).toBe(0);
    expect(stageStatusToNumeric("IN_PROGRESS")).toBe(0.5);
    expect(stageStatusToNumeric("COMPLETED")).toBe(1);
  });
});

describe("computeGlobalWeightsPercent", () => {
  it("distribui pesos por fase e normaliza para soma 100", () => {
    const macro = [
      { id: "p1", weightPercent: 50 },
      { id: "p2", weightPercent: 50 },
    ];
    const stages = [
      { id: "s1", macroPhaseId: "p1", rawWeight: 4, sortOrder: 1 },
      { id: "s2", macroPhaseId: "p1", rawWeight: 6, sortOrder: 2 },
      { id: "s3", macroPhaseId: "p2", rawWeight: 5, sortOrder: 3 },
      { id: "s4", macroPhaseId: "p2", rawWeight: 5, sortOrder: 4 },
    ];
    const map = computeGlobalWeightsPercent(macro, stages);
    let sum = 0;
    for (const id of ["s1", "s2", "s3", "s4"]) {
      sum += map.get(id) ?? 0;
    }
    expect(sum).toBeCloseTo(100, 5);
    expect(map.get("s1")).toBeCloseTo(20, 5);
    expect(map.get("s2")).toBeCloseTo(30, 5);
    expect(map.get("s3")).toBeCloseTo(25, 5);
    expect(map.get("s4")).toBeCloseTo(25, 5);
  });
});

describe("FIT LAGO AZUL — paridade ~28,04%", () => {
  it("replica o mock de etapas (mesma ordem e status)", () => {
    // Pesos de fase macro calibrados para bater o % da planilha com os status do piloto
    const macro = [
      { id: "mp1", weightPercent: 18 },
      { id: "mp2", weightPercent: 32 },
      { id: "mp3", weightPercent: 10 },
      { id: "mp4", weightPercent: 40 },
    ];
    const raw = [
      4.4, 3.8, 3.4, 3.4, 2.8, 4.2, 4.4, 3.6, 4.6, 3.8, 3.8, 4.4, 4.8, 4.2,
      4.2, 4.6, 4.2, 3.8, 3.4, 4.2, 4.4, 4.0,
    ];
    const stages = raw.map((rw, i) => ({
      id: `st${i}`,
      macroPhaseId: i < 4 ? "mp1" : i < 16 ? "mp2" : i < 20 ? "mp3" : "mp4",
      rawWeight: rw,
      sortOrder: i,
    }));
    const globals = computeGlobalWeightsPercent(macro, stages);
    const statuses = [
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
    ] as const;
    const progress = computeDevelopmentProgressPercent(
      stages.map((s, i) => ({
        globalWeight: globals.get(s.id) ?? 0,
        status: statuses[i] ?? "NOT_STARTED",
      }))
    );
    expect(roundProgressPercent(progress)).toBeCloseTo(28.04, 1);
  });
});
