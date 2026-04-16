"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  MinusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DevelopmentDetailStageRow } from "@/types/development-detail";
import type { StageStatus } from "@/generated/prisma/enums";

type Props = {
  slug: string;
  stages: DevelopmentDetailStageRow[];
  initialProgress: number;
  readOnly: boolean;
  /** Mostrar linha de progresso “ao vivo” (edição) */
  showProgressHint?: boolean;
};

const statusConfig: Record<
  StageStatus,
  {
    icon: typeof CheckCircle2;
    label: string;
    className: string;
  }
> = {
  COMPLETED: {
    icon: CheckCircle2,
    label: "Finalizado",
    className: "status-finalizado",
  },
  IN_PROGRESS: {
    icon: MinusCircle,
    label: "Em andamento",
    className: "status-em-andamento",
  },
  NOT_STARTED: {
    icon: Circle,
    label: "Não iniciado",
    className: "status-nao-iniciado",
  },
};

const STATUS_OPTIONS: { value: StageStatus; label: string }[] = [
  { value: "NOT_STARTED", label: "Não iniciado" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "COMPLETED", label: "Finalizado" },
];

export function DevelopmentStagesTable({
  slug,
  stages,
  initialProgress,
  readOnly,
  showProgressHint = true,
}: Props) {
  const router = useRouter();
  const [progress, setProgress] = useState(initialProgress);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProgress(initialProgress);
  }, [initialProgress]);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  async function handleStatusChange(
    stage: DevelopmentDetailStageRow,
    next: StageStatus,
  ) {
    if (next === stage.status) {
      return;
    }
    setError(null);
    setBusyKey(stage.id);
    try {
      const res = await fetch(`/api/developments/${encodeURIComponent(slug)}/stages`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stageId: stage.stageId, status: next }),
      });
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Não foi possível atualizar a etapa";
        setError(msg);
        return;
      }
      if (
        data &&
        typeof data === "object" &&
        "progress" in data &&
        typeof (data as { progress: unknown }).progress === "number"
      ) {
        setProgress((data as { progress: number }).progress);
      }
      router.refresh();
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {!readOnly && showProgressHint && (
        <p className="text-xs text-muted-foreground tabular">
          Avanço geral (ao vivo):{" "}
          <span className="font-semibold text-foreground">{progress.toFixed(2)}%</span>
        </p>
      )}
      <div className="rounded-[--radius-md] border border-border bg-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="py-2.5 pl-4 pr-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground w-32">
                Fase
              </th>
              <th className="py-2.5 px-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Etapa
              </th>
              <th className="py-2.5 px-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground w-40">
                Status
              </th>
              <th className="py-2.5 px-3 text-right text-[11px] font-medium uppercase tracking-wide text-muted-foreground w-24">
                Peso bruto
              </th>
              <th className="py-2.5 px-3 text-right text-[11px] font-medium uppercase tracking-wide text-muted-foreground w-24">
                Peso global
              </th>
              <th className="py-2.5 pl-3 pr-4 text-right text-[11px] font-medium uppercase tracking-wide text-muted-foreground w-24">
                Contrib.
              </th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage) => {
              const cfg = statusConfig[stage.status];
              const Icon = cfg.icon;
              const isBusy = busyKey === stage.id;
              return (
                <tr
                  key={stage.id}
                  className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors duration-[--duration-fast]"
                >
                  <td className="py-2.5 pl-4 pr-3">
                    <span className="text-xs text-muted-foreground">{stage.phase}</span>
                  </td>
                  <td className="py-2.5 px-3 text-sm font-medium text-foreground">{stage.name}</td>
                  <td className="py-2.5 px-3">
                    {readOnly ? (
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
                          cfg.className,
                        )}
                      >
                        <Icon aria-hidden="true" className="size-3" />
                        {cfg.label}
                      </div>
                    ) : (
                      <label className="sr-only" htmlFor={`stage-${stage.id}`}>
                        Status — {stage.name}
                      </label>
                    )}
                    {!readOnly && (
                      <select
                        id={`stage-${stage.id}`}
                        className={cn(
                          "select-app h-9 max-w-[11rem] rounded-[--radius] px-2 text-xs",
                          isBusy && "opacity-60 pointer-events-none",
                        )}
                        value={stage.status}
                        disabled={isBusy}
                        onChange={(e) => {
                          void handleStatusChange(stage, e.target.value as StageStatus);
                        }}
                      >
                        {STATUS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="tabular text-xs text-muted-foreground">
                      {stage.rawWeight.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="tabular text-xs text-foreground">
                      {stage.globalWeight.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-2.5 pl-3 pr-4 text-right">
                    <span
                      className={cn(
                        "tabular text-xs font-medium",
                        stage.contribution > 0 ? "text-success" : "text-muted-foreground",
                      )}
                    >
                      +{stage.contribution.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="border-t-2 border-border">
            <tr className="bg-muted/30">
              <td colSpan={4} className="py-2.5 pl-4 pr-3 text-xs font-semibold text-foreground">
                Total
              </td>
              <td className="py-2.5 px-3 text-right tabular text-xs font-semibold text-foreground">
                {stages.reduce((acc, s) => acc + s.globalWeight, 0).toFixed(2)}%
              </td>
              <td className="py-2.5 pl-3 pr-4 text-right tabular text-xs font-bold text-primary">
                {progress.toFixed(2)}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
