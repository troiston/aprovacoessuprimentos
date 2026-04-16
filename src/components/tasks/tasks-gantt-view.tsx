"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { TaskKanbanEditDialog } from "@/components/tasks/task-kanban-edit-dialog";
import { cn } from "@/lib/utils";
import type { TaskBoardItem } from "@/types/task-board";

const DAY_MS = 24 * 60 * 60 * 1000;
const TZ = "America/Manaus";

type UserOption = { id: string; label: string };

type Props = {
  items: TaskBoardItem[];
  users?: UserOption[];
  canEdit?: boolean;
  showStagesCatalogLink?: boolean;
};

function monthTicks(startMs: number, endMs: number): { leftPct: number; label: string }[] {
  const ticks: { leftPct: number; label: string }[] = [];
  const range = endMs - startMs;
  if (range <= 0) {
    return ticks;
  }
  const d = new Date(startMs);
  d.setDate(1);
  d.setHours(12, 0, 0, 0);
  while (d.getTime() < startMs) {
    d.setMonth(d.getMonth() + 1);
  }
  const endDate = new Date(endMs);
  while (d.getTime() <= endDate.getTime()) {
    const t = d.getTime();
    ticks.push({
      leftPct: ((t - startMs) / range) * 100,
      label: d.toLocaleDateString("pt-BR", { month: "short", timeZone: TZ }),
    });
    d.setMonth(d.getMonth() + 1);
  }
  return ticks;
}

export function TasksGanttView({
  items,
  users = [],
  canEdit = false,
  showStagesCatalogLink = false,
}: Props) {
  const [editItem, setEditItem] = useState<TaskBoardItem | null>(null);
  /** Instantâneo da montagem — suficiente para posicionar "hoje" na linha do tempo. */
  const [mountedAtMs] = useState(() => Date.now());

  const { start, end, range, rows, monthMarkers } = useMemo(() => {
    const withDeadline = items.filter((t) => t.deadlineIso !== null);
    const now = new Date();
    let minT = now.getTime();
    let maxT = now.getTime() + 30 * DAY_MS;
    for (const t of withDeadline) {
      const ts = new Date(t.deadlineIso!).getTime();
      if (ts < minT) {
        minT = ts;
      }
      if (ts > maxT) {
        maxT = ts;
      }
    }
    minT -= 7 * DAY_MS;
    maxT += 7 * DAY_MS;
    const span = Math.max(DAY_MS, maxT - minT);
    const sorted = [...withDeadline].sort((a, b) => {
      const ta = new Date(a.deadlineIso!).getTime();
      const tb = new Date(b.deadlineIso!).getTime();
      return ta - tb;
    });
    const markers = monthTicks(minT, maxT);
    return { start: minT, end: maxT, range: span, rows: sorted, monthMarkers: markers };
  }, [items]);

  const noDeadline = useMemo(() => items.filter((t) => !t.deadlineIso), [items]);

  const todayPct = useMemo(() => {
    if (mountedAtMs <= start || mountedAtMs >= end) {
      return null;
    }
    return ((mountedAtMs - start) / range) * 100;
  }, [mountedAtMs, start, end, range]);

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Linha do tempo por prazo (marca na data de vencimento). Deslize horizontalmente em ecrãs pequenos.
      </p>
      <div className="relative z-0 overflow-x-auto rounded-[--radius-md] border border-border bg-card">
        <div className="min-w-[640px] p-3 space-y-2">
          <div className="relative h-8 border-b border-border text-[10px] text-muted-foreground">
            <span className="absolute left-0 top-0">
              {new Date(start).toLocaleDateString("pt-BR", { timeZone: TZ })}
            </span>
            <span className="absolute right-0 top-0">
              {new Date(end).toLocaleDateString("pt-BR", { timeZone: TZ })}
            </span>
            {monthMarkers.map((m, i) => (
              <span
                key={i}
                className="absolute top-4 -translate-x-1/2 whitespace-nowrap text-[9px] text-muted-foreground/90"
                style={{ left: `${m.leftPct}%` }}
              >
                {m.label}
              </span>
            ))}
            {monthMarkers.map((m, i) => (
              <span
                key={`line-${i}`}
                className="absolute top-0 bottom-0 w-px border-l border-dashed border-border/70"
                style={{ left: `${m.leftPct}%` }}
                aria-hidden="true"
              />
            ))}
          </div>
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Nenhuma tarefa com prazo definido.</p>
          ) : (
            rows.map((t) => {
              const deadline = new Date(t.deadlineIso!).getTime();
              const leftPct = ((deadline - start) / range) * 100;
              const barWidthPct = Math.max(0.8, (DAY_MS / range) * 100);
              const tooltip = `${t.development} · ${t.assignee}\nPrazo: ${t.deadlineLabel}${t.isOverdue ? " (vencida)" : ""}`;
              return (
                <div
                  key={t.id}
                  role={canEdit ? "button" : undefined}
                  tabIndex={canEdit ? 0 : undefined}
                  className={cn(
                    "relative grid grid-cols-[minmax(0,1fr)_minmax(200px,3fr)] gap-2 items-center py-1.5 border-b border-border/60 last:border-0",
                    canEdit &&
                      "cursor-pointer rounded-[--radius-sm] hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                  onClick={() => {
                    if (canEdit) {
                      setEditItem(t);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (canEdit && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      setEditItem(t);
                    }
                  }}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground line-clamp-2">{t.description}</p>
                    <div className="mt-0.5 flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-[8px]">
                        <Link href={`/developments/${t.developmentSlug}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>
                          {t.development}
                        </Link>
                      </Badge>
                      <Badge variant="outline" className="text-[8px]">
                        {t.stage}
                      </Badge>
                    </div>
                  </div>
                  <div className="relative isolate h-9 overflow-hidden rounded bg-muted/40">
                    {monthMarkers.map((m, i) => (
                      <div
                        key={`gantt-grid-${i}`}
                        className="pointer-events-none absolute inset-y-0 w-px bg-border/40"
                        style={{ left: `${m.leftPct}%` }}
                        aria-hidden="true"
                      />
                    ))}
                    <div
                      className={cn(
                        "pointer-events-none absolute top-1/2 h-3 min-w-[6px] -translate-y-1/2 rounded-sm bg-primary/80",
                        t.isOverdue && "bg-destructive/90",
                      )}
                      style={{
                        left: `${Math.min(100 - barWidthPct, Math.max(0, leftPct - barWidthPct / 2))}%`,
                        width: `${barWidthPct}%`,
                      }}
                      title={tooltip}
                    />
                    {todayPct !== null ? (
                      <div
                        className="pointer-events-none absolute inset-y-0 w-px bg-destructive/70"
                        style={{ left: `${todayPct}%` }}
                        title="Hoje"
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {noDeadline.length > 0 ? (
        <section className="rounded-[--radius-md] border border-dashed border-border p-4">
          <h3 className="text-xs font-semibold text-foreground mb-2">Sem prazo no calendário ({noDeadline.length})</h3>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {noDeadline.map((t) => (
              <li key={t.id}>
                <Link href={`/developments/${t.developmentSlug}`} className="text-foreground hover:underline">
                  {t.development}
                </Link>
                {" — "}
                {t.description}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <TaskKanbanEditDialog
        item={editItem}
        users={users}
        onClose={() => setEditItem(null)}
        canEdit={canEdit}
        showStagesCatalogLink={showStagesCatalogLink}
      />
    </div>
  );
}
