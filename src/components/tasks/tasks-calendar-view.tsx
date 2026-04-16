"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskKanbanEditDialog } from "@/components/tasks/task-kanban-edit-dialog";
import { cn } from "@/lib/utils";
import type { TaskBoardItem } from "@/types/task-board";
import type { TaskStatus } from "@/generated/prisma/enums";

type UserOption = { id: string; label: string };

type Props = {
  items: TaskBoardItem[];
  users?: UserOption[];
  canEdit?: boolean;
};

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric", timeZone: "America/Manaus" });
}

/** Chave yyyy-mm-dd no fuso de exibição (Manaus). */
function deadlineKey(iso: string): string {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Manaus",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value ?? "1970";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const day = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${day}`;
}

function buildMonthGrid(anchor: Date): { date: Date; inMonth: boolean; key: string }[] {
  const first = startOfMonth(anchor);
  const startWeekday = first.getDay();
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - startWeekday);
  const cells: { date: Date; inMonth: boolean; key: string }[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    const inMonth = d.getMonth() === anchor.getMonth();
    const key = deadlineKey(d.toISOString());
    cells.push({ date: d, inMonth, key });
  }
  return cells;
}

const statusRowClass: Record<TaskStatus, string> = {
  OPEN: "bg-warning/15 text-foreground border-warning/25",
  IN_PROGRESS: "bg-primary/12 text-foreground border-primary/25",
  BLOCKED: "bg-destructive/12 text-destructive border-destructive/25",
  DONE: "bg-success/12 text-foreground border-success/25 line-through opacity-80",
};

export function TasksCalendarView({ items, users = [], canEdit = false }: Props) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [dayDialog, setDayDialog] = useState<{ key: string; label: string; tasks: TaskBoardItem[] } | null>(
    null,
  );
  const [editItem, setEditItem] = useState<TaskBoardItem | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<string, TaskBoardItem[]>();
    for (const t of items) {
      if (!t.deadlineIso) {
        continue;
      }
      const k = deadlineKey(t.deadlineIso);
      const list = map.get(k) ?? [];
      list.push(t);
      map.set(k, list);
    }
    return map;
  }, [items]);

  const noDeadline = useMemo(() => items.filter((t) => !t.deadlineIso), [items]);

  const grid = useMemo(() => buildMonthGrid(cursor), [cursor]);
  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  function openDayDialog(key: string, date: Date, inMonth: boolean) {
    const tasks = byDay.get(key) ?? [];
    const label = date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "America/Manaus",
    });
    if (tasks.length === 0 && !inMonth) {
      return;
    }
    if (tasks.length > 0) {
      setDayDialog({ key, label, tasks });
    }
  }

  return (
    <div className="space-y-4">
      <TaskKanbanEditDialog item={editItem} users={users} onClose={() => setEditItem(null)} />

      <Dialog open={dayDialog !== null} onOpenChange={(open) => !open && setDayDialog(null)}>
        <DialogContent className="max-w-md">
          {dayDialog ? (
            <>
              <DialogHeader>
                <DialogTitle className="capitalize">{dayDialog.label}</DialogTitle>
                <DialogDescription>
                  {canEdit
                    ? "Selecione uma tarefa para editar."
                    : "Abra o empreendimento para ver o contexto completo."}
                </DialogDescription>
              </DialogHeader>
              <ul className="max-h-[min(60vh,24rem)] space-y-2 overflow-y-auto pr-1">
                {dayDialog.tasks.map((t) => (
                  <li key={t.id}>
                    {canEdit ? (
                      <button
                        type="button"
                        className={cn(
                          "w-full rounded-[--radius] border px-3 py-2.5 text-left text-xs transition-colors",
                          "min-h-11 cursor-pointer hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          statusRowClass[t.status],
                        )}
                        onClick={() => {
                          setEditItem(t);
                          setDayDialog(null);
                        }}
                      >
                        <span className="font-medium line-clamp-2">{t.description}</span>
                        <span className="mt-1 block text-[10px] text-muted-foreground">
                          {t.development} · {t.deadlineLabel}
                        </span>
                      </button>
                    ) : (
                      <Link
                        href={`/developments/${t.developmentSlug}`}
                        className={cn(
                          "flex min-h-11 w-full flex-col rounded-[--radius] border px-3 py-2.5 text-left text-xs transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          statusRowClass[t.status],
                        )}
                      >
                        <span className="font-medium line-clamp-2">{t.description}</span>
                        <span className="mt-1 block text-[10px] text-muted-foreground">
                          {t.development} · {t.deadlineLabel}
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 min-h-11 min-w-11"
            aria-label="Mês anterior"
            onClick={() => setCursor((c) => addMonths(c, -1))}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 min-h-11 px-3 text-xs"
            onClick={() => setCursor(startOfMonth(new Date()))}
          >
            Hoje
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 min-h-11 min-w-11"
            aria-label="Mês seguinte"
            onClick={() => setCursor((c) => addMonths(c, 1))}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
        <h2 className="text-sm font-semibold capitalize text-foreground">{monthLabel(cursor)}</h2>
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground" aria-label="Legenda de estados">
        <li className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-warning/50" aria-hidden="true" />
          Aberta
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-primary/50" aria-hidden="true" />
          Em progresso
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-destructive/50" aria-hidden="true" />
          Bloqueada
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-success/50" aria-hidden="true" />
          Concluída
        </li>
      </ul>

      <div className="grid grid-cols-7 gap-px rounded-[--radius-md] border border-border bg-border overflow-hidden">
        {weekdays.map((w) => (
          <div key={w} className="bg-muted/50 px-1 py-2 text-center text-[10px] font-medium text-muted-foreground">
            {w}
          </div>
        ))}
        {grid.map(({ date, inMonth, key }) => {
          const dayTasks = byDay.get(key) ?? [];
          const today = new Date();
          const isToday =
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
          const hasTasks = dayTasks.length > 0;
          return (
            <div
              key={key}
              className={cn(
                "min-h-[7rem] bg-card p-1.5 flex flex-col gap-1",
                !inMonth && "opacity-40",
                isToday && "ring-1 ring-inset ring-primary/40",
                hasTasks && "cursor-pointer hover:bg-muted/30",
              )}
              onClick={() => {
                if (hasTasks) {
                  openDayDialog(key, date, inMonth);
                }
              }}
            >
              <span
                className={cn(
                  "text-xs font-medium tabular-nums shrink-0",
                  inMonth ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {date.getDate()}
              </span>
              <ul className="flex flex-col gap-0.5 overflow-hidden flex-1 min-h-0">
                {dayTasks.slice(0, 3).map((t) => (
                  <li key={t.id} className="min-h-7">
                    <Link
                      href={`/developments/${t.developmentSlug}`}
                      className={cn(
                        "flex min-h-7 items-center truncate rounded px-1 py-1 text-[11px] leading-tight border",
                        statusRowClass[t.status],
                        t.isOverdue && t.status !== "DONE" && "ring-1 ring-destructive/40",
                      )}
                      title={t.description}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t.description}
                    </Link>
                  </li>
                ))}
                {dayTasks.length > 3 ? (
                  <li>
                    <button
                      type="button"
                      className="w-full min-h-9 rounded px-1 py-1 text-left text-[11px] font-medium text-primary hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDayDialog(key, date, inMonth);
                      }}
                    >
                      +{dayTasks.length - 3} mais
                    </button>
                  </li>
                ) : null}
              </ul>
            </div>
          );
        })}
      </div>

      {noDeadline.length > 0 ? (
        <section className="rounded-[--radius-md] border border-border bg-muted/20 p-4">
          <h3 className="text-xs font-semibold text-foreground mb-2">Sem data de prazo ({noDeadline.length})</h3>
          <ul className="space-y-1.5">
            {noDeadline.map((t) => (
              <li key={t.id} className="text-xs text-muted-foreground">
                <Link href={`/developments/${t.developmentSlug}`} className="font-medium text-foreground hover:underline">
                  {t.development}
                </Link>
                {" · "}
                <span className="line-clamp-2">{t.description}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
