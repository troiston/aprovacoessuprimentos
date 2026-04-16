"use client";

import { useMemo, useState } from "react";
import { Info, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { computeGlobalWeightsPercent, computeRawWeight } from "@/lib/domain/progress";
import type { StagesCatalogPayload } from "@/lib/services/stage-catalog";

type StageRow = StagesCatalogPayload["stages"][number];

type Props = {
  initial: StagesCatalogPayload;
};

function clampScore(n: number): number {
  if (Number.isNaN(n)) {
    return 3;
  }
  return Math.min(5, Math.max(1, Math.round(n)));
}

export function StagesCatalogEditor({ initial }: Props) {
  const router = useRouter();
  const [stages, setStages] = useState<StageRow[]>(initial.stages);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [addingForPhaseId, setAddingForPhaseId] = useState<string | null>(null);
  const [newStageName, setNewStageName] = useState("");
  const [creating, setCreating] = useState(false);

  const phases = initial.macroPhases;

  const stagesWithPreviewGlobals = useMemo(() => {
    const macroInputs = phases.map((p) => ({ id: p.id, weightPercent: p.weightPercent }));
    const weightInputs = stages.map((s) => ({
      id: s.id,
      macroPhaseId: s.macroPhaseId,
      rawWeight: s.rawWeight,
      sortOrder: s.sortOrder,
    }));
    try {
      const globals = computeGlobalWeightsPercent(macroInputs, weightInputs);
      return stages.map((s) => ({ ...s, globalWeight: globals.get(s.id) ?? s.globalWeight }));
    } catch {
      return stages;
    }
  }, [phases, stages]);

  const phaseColors: Record<string, string> = {
    "Aquisição Terreno": "var(--color-chart-1)",
    Incorporação: "var(--color-chart-2)",
    "Atividades p/ Lançamento": "var(--color-chart-3)",
    CEF: "var(--color-chart-4)",
  };

  const stagesByPhase = useMemo(() => {
    const map = new Map<string, StageRow[]>();
    for (const p of phases) {
      map.set(
        p.id,
        stagesWithPreviewGlobals
          .filter((s) => s.macroPhaseId === p.id)
          .sort((a, b) => a.sortOrder - b.sortOrder),
      );
    }
    return map;
  }, [phases, stagesWithPreviewGlobals]);

  function updateStage(
    id: string,
    patch: Partial<
      Pick<StageRow, "impactScore" | "dependencyScore" | "timeScore" | "effortScore" | "name">
    >,
  ) {
    setStages((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              ...patch,
              rawWeight: computeRawWeight(
                patch.impactScore ?? s.impactScore,
                patch.dependencyScore ?? s.dependencyScore,
                patch.timeScore ?? s.timeScore,
                patch.effortScore ?? s.effortScore,
              ),
            }
          : s,
      ),
    );
  }

  const totalGlobal = useMemo(
    () => stagesWithPreviewGlobals.reduce((a, s) => a + s.globalWeight, 0),
    [stagesWithPreviewGlobals],
  );

  async function handleSave() {
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      const res = await fetch("/api/settings/stages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stages: stages.map((s) => ({
            id: s.id,
            name: s.name.trim(),
            impactScore: s.impactScore,
            dependencyScore: s.dependencyScore,
            timeScore: s.timeScore,
            effortScore: s.effortScore,
          })),
        }),
      });
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Falha ao guardar";
        setError(msg);
        return;
      }
      if (
        data &&
        typeof data === "object" &&
        "stages" in data &&
        Array.isArray((data as { stages: unknown }).stages)
      ) {
        setStages((data as { stages: StageRow[] }).stages);
      }
      setMessage("Alterações guardadas. Pesos globais recalculados.");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateStage(macroPhaseId: string) {
    const name = newStageName.trim();
    if (!name) {
      setError("Indique o nome da nova etapa.");
      return;
    }
    setError(null);
    setMessage(null);
    setCreating(true);
    try {
      const res = await fetch("/api/settings/stages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ macroPhaseId, name }),
      });
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Falha ao criar etapa";
        setError(msg);
        return;
      }
      if (
        data &&
        typeof data === "object" &&
        "stage" in data &&
        data.stage &&
        typeof data.stage === "object" &&
        "id" in data.stage
      ) {
        const row = data.stage as StageRow;
        setStages((prev) => [...prev, row].sort((a, b) => a.sortOrder - b.sortOrder));
      }
      setMessage("Etapa criada e ligada a todos os empreendimentos ativos.");
      setNewStageName("");
      setAddingForPhaseId(null);
      router.refresh();
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteStage(stage: StageRow) {
    const ok = window.confirm(
      `Remover a etapa «${stage.name}» do catálogo? Será removida de todos os empreendimentos. Não é permitido se existirem tarefas (mesmo arquivadas) associadas.`,
    );
    if (!ok) {
      return;
    }
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/settings/stages/${encodeURIComponent(stage.id)}`, {
        method: "DELETE",
      });
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Falha ao remover";
        setError(msg);
        return;
      }
      setStages((prev) => prev.filter((s) => s.id !== stage.id));
      setMessage("Etapa removida. Pesos globais recalculados.");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Topbar
        title="Etapas e pesos"
        description={`${stages.length} etapas · ${phases.length} fases macro · catálogo global (nomes e colunas Kanban das tarefas são conceitos diferentes — ver caixa abaixo)`}
        actions={
          <Button size="sm" type="button" onClick={() => void handleSave()} disabled={saving || creating}>
            <Save aria-hidden="true" className="size-4" />
            {saving ? "A guardar…" : "Guardar alterações"}
          </Button>
        }
      />

      <main className="p-6 space-y-4">
        {error && (
          <p className="text-sm text-destructive border border-destructive/30 rounded-[--radius] px-3 py-2 bg-destructive/5">
            {error}
          </p>
        )}
        {message && (
          <p className="text-sm text-emerald-700 dark:text-emerald-400" role="status">
            {message}
          </p>
        )}

        <div className="flex items-start gap-3 rounded-[--radius-md] border border-info/30 bg-info/5 p-3">
          <Info aria-hidden="true" className="size-4 text-info shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-info">Catálogo vs Kanban de tarefas</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Aqui define as <strong className="text-foreground">etapas do pipeline</strong> (nome,
              ordem na fase macro e pesos). As <strong className="text-foreground">colunas do Kanban</strong>{" "}
              das tarefas (Aberta, Em progresso, Bloqueada, Concluída) são estados fixos na aplicação —
              alteram-se ao editar cada tarefa ou ao arrastar no quadro.
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              PesoBruto = (2 × Impacto + Dependência + Tempo + Esforço) / 5
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              O peso global é recalculado para todas as etapas após guardar, criar ou remover uma etapa.
            </p>
          </div>
        </div>

        {phases.map((phase) => {
          const phaseStages = stagesByPhase.get(phase.id) ?? [];
          const phaseTotal = phaseStages.reduce((s, st) => s + st.globalWeight, 0);
          return (
            <div key={phase.id} className="rounded-[--radius-md] border border-border bg-card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-border bg-muted/40">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="size-2.5 rounded-[2px] shrink-0"
                    style={{
                      backgroundColor: phaseColors[phase.name] ?? "var(--color-muted-foreground)",
                    }}
                  />
                  <h3 className="text-xs font-semibold text-foreground truncate">{phase.name}</h3>
                  <Badge variant="secondary" className="text-[10px] shrink-0">
                    {phaseStages.length} etapas
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="tabular text-xs font-medium text-foreground">
                    Peso fase: {phase.weightPercent}% · Soma global: {phaseTotal.toFixed(2)}%
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={() => {
                      setAddingForPhaseId((cur) => (cur === phase.id ? null : phase.id));
                      setNewStageName("");
                      setError(null);
                    }}
                  >
                    <Plus aria-hidden="true" className="size-3.5" />
                    Nova etapa
                  </Button>
                </div>
              </div>

              {addingForPhaseId === phase.id ? (
                <div className="px-4 py-3 border-b border-border bg-muted/20 flex flex-wrap items-end gap-2">
                  <div className="flex-1 min-w-[12rem] space-y-1">
                    <Label htmlFor={`new-stage-${phase.id}`} className="text-xs">
                      Nome da nova etapa
                    </Label>
                    <Input
                      id={`new-stage-${phase.id}`}
                      value={newStageName}
                      onChange={(e) => setNewStageName(e.target.value)}
                      placeholder="Ex.: Licenciamento urbanístico"
                      disabled={creating}
                      className="h-9 text-sm"
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    disabled={creating}
                    onClick={() => void handleCreateStage(phase.id)}
                  >
                    {creating ? "A criar…" : "Criar"}
                  </Button>
                </div>
              ) : null}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 pl-4 pr-3 text-[10px] font-medium uppercase tracking-wide text-muted-foreground min-w-[10rem]">
                        Nome da etapa
                      </th>
                      <th className="py-2 px-2 text-[10px] font-medium uppercase text-muted-foreground text-center w-20">
                        Impacto
                      </th>
                      <th className="py-2 px-2 text-[10px] font-medium uppercase text-muted-foreground text-center w-20">
                        Dep.
                      </th>
                      <th className="py-2 px-2 text-[10px] font-medium uppercase text-muted-foreground text-center w-20">
                        Tempo
                      </th>
                      <th className="py-2 px-2 text-[10px] font-medium uppercase text-muted-foreground text-center w-20">
                        Esforço
                      </th>
                      <th className="py-2 px-3 text-[10px] font-medium uppercase text-muted-foreground text-right">
                        Peso bruto
                      </th>
                      <th className="py-2 pl-3 pr-2 text-[10px] font-medium uppercase text-muted-foreground text-right">
                        Peso global
                      </th>
                      <th className="py-2 pr-4 text-[10px] font-medium uppercase text-muted-foreground text-right w-14">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {phaseStages.map((stage) => (
                      <tr
                        key={stage.id}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors duration-[--duration-fast]"
                      >
                        <td className="py-2 pl-4 pr-3 align-middle">
                          <Label htmlFor={`name-${stage.id}`} className="sr-only">
                            Nome da etapa
                          </Label>
                          <Input
                            id={`name-${stage.id}`}
                            value={stage.name}
                            onChange={(e) => updateStage(stage.id, { name: e.target.value })}
                            className="h-9 text-sm font-medium"
                            disabled={saving}
                          />
                        </td>
                        {(["impactScore", "dependencyScore", "timeScore", "effortScore"] as const).map((field) => (
                          <td key={field} className="py-2 px-2">
                            <Label htmlFor={`${stage.id}-${field}`} className="sr-only">
                              {field}
                            </Label>
                            <Input
                              id={`${stage.id}-${field}`}
                              type="number"
                              min={1}
                              max={5}
                              className="h-9 text-center text-xs tabular-nums shadow-sm bg-card px-1"
                              value={stage[field]}
                              onChange={(e) => {
                                const v = clampScore(Number(e.target.value));
                                updateStage(stage.id, { [field]: v });
                              }}
                            />
                          </td>
                        ))}
                        <td className="py-2.5 px-3 text-right tabular text-xs text-muted-foreground">
                          {stage.rawWeight.toFixed(2)}
                        </td>
                        <td className="py-2.5 pl-3 pr-2 text-right tabular text-xs font-medium text-foreground">
                          {stage.globalWeight.toFixed(2)}%
                        </td>
                        <td className="py-2 pr-4 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-destructive"
                            aria-label={`Remover etapa ${stage.name}`}
                            disabled={saving || creating}
                            onClick={() => void handleDeleteStage(stage)}
                          >
                            <Trash2 aria-hidden="true" className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        <div className="flex items-center justify-between rounded-[--radius-md] border border-border bg-muted/30 px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">Total de pesos globais (deve ≈ 100%)</p>
          <p className="tabular text-sm font-bold text-foreground">{totalGlobal.toFixed(2)}%</p>
        </div>
      </main>
    </div>
  );
}
