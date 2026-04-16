"use client";

import { useEffect, useState } from "react";
import { DevelopmentNewTaskDialog } from "@/components/developments/development-new-task-dialog";
import { Label } from "@/components/ui/label";

type DevOption = { slug: string; name: string };
type UserOption = { id: string; label: string };

type Props = {
  developments: DevOption[];
  users: UserOption[];
  defaultSlug?: string;
  canEdit: boolean;
};

type ApiDevelopment = {
  stages: { stageId: string; name: string }[];
};

export function TaskCreationLauncher({ developments, users, defaultSlug, canEdit }: Props) {
  const [selectedSlug, setSelectedSlug] = useState(
    defaultSlug && developments.some((d) => d.slug === defaultSlug)
      ? defaultSlug
      : developments[0]?.slug ?? "",
  );
  const [stageOptions, setStageOptions] = useState<{ stageId: string; name: string }[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!canEdit || !selectedSlug) {
      setStageOptions([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    void (async () => {
      try {
        const res = await fetch(`/api/developments/${encodeURIComponent(selectedSlug)}`);
        const data: unknown = await res.json().catch(() => null);
        if (!res.ok) {
          const msg =
            data &&
            typeof data === "object" &&
            "error" in data &&
            typeof (data as { error: unknown }).error === "string"
              ? (data as { error: string }).error
              : "Falha ao carregar etapas";
          if (!cancelled) {
            setLoadError(msg);
            setStageOptions([]);
          }
          return;
        }
        if (
          !data ||
          typeof data !== "object" ||
          !("development" in data) ||
          typeof (data as { development: unknown }).development !== "object"
        ) {
          if (!cancelled) {
            setLoadError("Resposta inválida");
            setStageOptions([]);
          }
          return;
        }
        const dev = (data as { development: ApiDevelopment }).development;
        const opts = dev.stages.map((s) => ({ stageId: s.stageId, name: s.name }));
        if (!cancelled) {
          setStageOptions(opts);
          setLoadError(null);
        }
      } catch {
        if (!cancelled) {
          setLoadError("Erro de rede");
          setStageOptions([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [canEdit, selectedSlug]);

  if (!canEdit || developments.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1.5 min-w-[12rem]">
        <Label htmlFor="task-dev-slug">Empreendimento para nova tarefa</Label>
        <select
          id="task-dev-slug"
          className="select-app flex h-10 w-full max-w-xs rounded-[--radius] px-3 text-sm"
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
        >
          {developments.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
      {loadError && <p className="text-xs text-destructive pb-1">{loadError}</p>}
      {!loadError && loading && <p className="text-xs text-muted-foreground pb-1">A carregar etapas…</p>}
      {selectedSlug && stageOptions.length > 0 && (
        <DevelopmentNewTaskDialog
          developmentSlug={selectedSlug}
          stages={stageOptions}
          users={users}
          triggerLabel="Nova tarefa"
        />
      )}
    </div>
  );
}
