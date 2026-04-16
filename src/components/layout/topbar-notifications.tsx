"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ApiTask = {
  deadline: string | null;
  kanbanColumn?: { isTerminal: boolean };
};

function isApiTask(value: unknown): value is ApiTask {
  if (!value || typeof value !== "object") {
    return false;
  }
  const o = value as Record<string, unknown>;
  if (!(o.deadline === null || typeof o.deadline === "string")) {
    return false;
  }
  const kc = o.kanbanColumn;
  if (kc !== undefined) {
    if (!kc || typeof kc !== "object") {
      return false;
    }
    const t = (kc as { isTerminal?: unknown }).isTerminal;
    if (typeof t !== "boolean") {
      return false;
    }
  }
  return true;
}

function countOverdue(tasks: ApiTask[], now: Date): number {
  return tasks.filter((t) => {
    if (t.kanbanColumn?.isTerminal === true) {
      return false;
    }
    if (!t.deadline) {
      return false;
    }
    return new Date(t.deadline) < now;
  }).length;
}

export function TopbarNotifications() {
  const [overdue, setOverdue] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks/my", { credentials: "same-origin" });
      if (!res.ok) {
        setOverdue(null);
        return;
      }
      const data: unknown = await res.json().catch(() => null);
      if (!data || typeof data !== "object" || !("tasks" in data)) {
        setOverdue(null);
        return;
      }
      const raw = (data as { tasks: unknown }).tasks;
      if (!Array.isArray(raw)) {
        setOverdue(null);
        return;
      }
      const tasks = raw.filter(isApiTask);
      setOverdue(countOverdue(tasks, new Date()));
    } catch {
      setOverdue(null);
    }
  }, []);

  useEffect(() => {
    const tick = () => {
      void load();
    };
    const t0 = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 120_000);
    return () => {
      window.clearTimeout(t0);
      window.clearInterval(id);
    };
  }, [load]);

  const showBadge = overdue !== null && overdue > 0;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={
            showBadge
              ? `Notificações: ${overdue} tarefa(s) com prazo vencido`
              : "Notificações e atalhos de tarefas"
          }
          className="relative"
        >
          <Bell aria-hidden="true" className="size-4" />
          {showBadge ? (
            <span
              className={cn(
                "absolute -top-0.5 -right-0.5 min-w-[1rem] h-4 px-1 rounded-full",
                "bg-destructive text-destructive-foreground text-[10px] font-semibold tabular-nums",
                "flex items-center justify-center leading-none",
              )}
            >
              {overdue > 99 ? "99+" : overdue}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal text-foreground">
          {showBadge ? (
            <span role="status" aria-live="polite">
              Tem <strong className="tabular-nums">{overdue}</strong>{" "}
              {overdue === 1 ? "tarefa vencida" : "tarefas vencidas"} atribuídas a si.
            </span>
          ) : (
            <span role="status" aria-live="polite">
              Não tem tarefas vencidas nas atribuições a si.
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild onSelect={() => setOpen(false)}>
          <Link href="/tasks">Minhas tarefas</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild onSelect={() => setOpen(false)}>
          <Link href="/tasks/all">Todas as tarefas</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
