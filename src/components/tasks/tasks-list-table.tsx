"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowUpDown, User2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TaskKanbanEditDialog } from "@/components/tasks/task-kanban-edit-dialog";
import { cn } from "@/lib/utils";
import type { TaskBoardItem } from "@/types/task-board";
import type { TaskStatus } from "@/generated/prisma/enums";

type UserOption = { id: string; label: string };

type Props = {
  items: TaskBoardItem[];
  users: UserOption[];
  canEdit: boolean;
  /** Quando false (Minhas tarefas), omite coluna Empreendimento e mostra Estado. */
  showDevelopment?: boolean;
  emptyMessage?: string;
  /** Rodapé opcional (ex.: contagens em Todas as tarefas). */
  listFooter?: ReactNode;
};

function statusLabel(status: TaskStatus): string {
  switch (status) {
    case "OPEN":
      return "Aberta";
    case "IN_PROGRESS":
      return "Em progresso";
    case "BLOCKED":
      return "Bloqueada";
    case "DONE":
      return "Concluída";
    default:
      return status;
  }
}

function sortTaskBoardItems(items: TaskBoardItem[]): TaskBoardItem[] {
  return [...items].sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) {
      return -1;
    }
    if (!a.isOverdue && b.isOverdue) {
      return 1;
    }
    return a.deadlineLabel.localeCompare(b.deadlineLabel);
  });
}

export function TasksListTable({
  items,
  users,
  canEdit,
  showDevelopment = true,
  emptyMessage = "Nenhuma tarefa com os filtros selecionados.",
  listFooter,
}: Props) {
  const router = useRouter();
  const [editItem, setEditItem] = useState<TaskBoardItem | null>(null);

  const sorted = useMemo(() => sortTaskBoardItems(items), [items]);

  function handleRowActivate(item: TaskBoardItem) {
    if (canEdit) {
      setEditItem(item);
      return;
    }
    router.push(`/developments/${item.developmentSlug}`);
  }

  function handleRowKeyDown(e: React.KeyboardEvent<HTMLTableRowElement>, item: TaskBoardItem) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRowActivate(item);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[--radius-md] border border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="rounded-[--radius-md] border border-border bg-card overflow-hidden">
      <TaskKanbanEditDialog item={editItem} users={users} onClose={() => setEditItem(null)} />
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {showDevelopment ? (
              <th className="py-2.5 pl-4 pr-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Empreendimento
              </th>
            ) : null}
            <th className="py-2.5 px-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground w-24">
              Etapa
            </th>
            {!showDevelopment ? (
              <th className="py-2.5 px-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground w-28">
                Estado
              </th>
            ) : null}
            <th className="py-2.5 px-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Ação
            </th>
            <th className="py-2.5 px-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground w-28">
              Responsável
            </th>
            <th className="py-2.5 pl-3 pr-4 text-[11px] font-medium uppercase tracking-wide text-muted-foreground w-28">
              Prazo
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((task) => (
            <tr
              key={task.id}
              role="button"
              tabIndex={0}
              aria-label={
                canEdit
                  ? `Editar tarefa: ${task.description.slice(0, 80)}`
                  : `Abrir empreendimento: ${task.development}`
              }
              className={cn(
                "border-b border-border last:border-0 hover:bg-muted/40 transition-colors duration-[--duration-fast]",
                "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                task.isOverdue && "bg-destructive/2",
              )}
              onClick={() => handleRowActivate(task)}
              onKeyDown={(e) => handleRowKeyDown(e, task)}
            >
              {showDevelopment ? (
                <td className="py-2.5 pl-4 pr-3" onClick={(e) => e.stopPropagation()}>
                  <Link
                    href={`/developments/${task.developmentSlug}`}
                    className="text-xs font-medium text-foreground hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {task.development}
                  </Link>
                </td>
              ) : null}
              <td className="py-2.5 px-3">
                <Badge variant="secondary" className="text-[10px] whitespace-nowrap">
                  {task.stage}
                </Badge>
              </td>
              {!showDevelopment ? (
                <td className="py-2.5 px-3">
                  <Badge variant="outline" className="text-[10px]">
                    {statusLabel(task.status)}
                  </Badge>
                </td>
              ) : null}
              <td className="py-2.5 px-3">
                <div>
                  <p className="text-sm text-foreground">{task.description}</p>
                  {task.notes ? (
                    <p className="text-[11px] text-muted-foreground italic mt-0.5">{task.notes}</p>
                  ) : null}
                </div>
              </td>
              <td className="py-2.5 px-3">
                <div className="flex items-center gap-1.5">
                  <User2 aria-hidden="true" className="size-3 text-muted-foreground" />
                  <span className="text-xs text-foreground">{task.assignee}</span>
                </div>
              </td>
              <td className="py-2.5 pl-3 pr-4">
                <div className="flex items-center gap-1.5">
                  {task.isOverdue ? (
                    <AlertCircle
                      aria-label="Prazo vencido"
                      className="size-3 text-destructive shrink-0"
                    />
                  ) : null}
                  <span
                    className={cn(
                      "tabular text-xs",
                      task.isOverdue ? "deadline-overdue" : "text-foreground",
                    )}
                  >
                    {task.deadlineLabel}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {listFooter ? (
        <div className="border-t border-border px-4 py-2.5 bg-muted/30 flex items-center justify-between gap-2">
          {listFooter}
        </div>
      ) : null}
    </div>
  );
}

export function TasksListTableFooterAll({
  total,
  overdue,
}: {
  total: number;
  overdue: number;
}) {
  return (
    <>
      <p className="text-[11px] text-muted-foreground">
        {total} tarefas · {overdue} vencidas · {total - overdue} no prazo ou sem data
      </p>
      <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
        <ArrowUpDown aria-hidden="true" className="size-3" />
        Vencidas primeiro
      </span>
    </>
  );
}
