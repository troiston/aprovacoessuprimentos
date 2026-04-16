import type { Metadata } from "next";
import { AlertCircle, Clock, Building2 } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { TaskCreationLauncher } from "@/components/tasks/task-creation-launcher";
import { TaskViewNav } from "@/components/tasks/task-view-nav";
import { TasksCalendarView } from "@/components/tasks/tasks-calendar-view";
import { TasksGanttView } from "@/components/tasks/tasks-gantt-view";
import { TasksKanbanBoard } from "@/components/tasks/tasks-kanban-board";
import { TasksListTable } from "@/components/tasks/tasks-list-table";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth/get-session";
import { canEditStagesOrTasks, canManageUsers } from "@/lib/domain/permissions";
import { db } from "@/lib/db";
import { taskRowToBoardItem } from "@/lib/tasks/task-board-mapper";
import { findTasksForUser } from "@/lib/services/tasks-queries";
import { listKanbanColumnsOrdered } from "@/lib/services/kanban-columns";
import { formatDatePtBR } from "@/lib/services/developments-list";
import { listAssignableUsers, formatUserLabel } from "@/lib/services/users-queries";
import { parseTaskView } from "@/types/task-board";

export const metadata: Metadata = {
  title: "Minhas Tarefas",
};

type PageProps = {
  searchParams: Promise<{ view?: string }>;
};

export default async function MyTasksPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const view = parseTaskView(sp.view);

  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const canEdit = canEditStagesOrTasks(user);
  const showStagesCatalogLink = canManageUsers(user);
  const [rows, developments, assignableRows, kanbanColumns] = await Promise.all([
    findTasksForUser(user.id),
    db.development.findMany({
      where: { deletedAt: null, isActive: true },
      select: { slug: true, name: true },
      orderBy: { name: "asc" },
    }),
    listAssignableUsers(),
    listKanbanColumnsOrdered(),
  ]);
  const usersForTask = assignableRows.map((u) => ({
    id: u.id,
    label: formatUserLabel(u),
  }));

  const slugCounts = new Map<string, number>();
  for (const t of rows) {
    slugCounts.set(t.development.slug, (slugCounts.get(t.development.slug) ?? 0) + 1);
  }
  const suggestedSlug =
    rows.length === 0
      ? undefined
      : [...slugCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const now = new Date();

  const myTasks = rows.map((t) => {
    const deadlineLabel = t.deadline ? formatDatePtBR(t.deadline) : "—";
    const isOverdue =
      t.deadline !== null && t.deadline < now && !t.kanbanColumn.isTerminal;
    let daysOverdue: number | undefined;
    if (isOverdue && t.deadline) {
      daysOverdue = Math.ceil((now.getTime() - t.deadline.getTime()) / (1000 * 60 * 60 * 24));
    }
    return {
      id: t.id,
      development: t.development.name,
      developmentSlug: t.development.slug,
      stage: t.stage.name,
      description: t.description,
      deadline: deadlineLabel,
      isOverdue,
      daysOverdue,
    };
  });

  const overdue = myTasks.filter((t) => t.isOverdue);

  const displayName = user.displayName ?? user.name ?? user.email;
  const boardItems = rows.map((t) => taskRowToBoardItem(t, now));

  return (
    <div>
      <Topbar
        title="Minhas Tarefas"
        description={`${displayName} · ${user.role === "VIEWER" ? "Leitor" : user.role === "EDITOR" ? "Editor" : "Administrador"}`}
      />

      <main className="p-6 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <TaskViewNav pathname="/tasks" current={view} query={{}} />
          {canEdit ? (
            <TaskCreationLauncher
              developments={developments}
              users={usersForTask}
              defaultSlug={suggestedSlug}
              canEdit={canEdit}
            />
          ) : null}
        </div>

        {view === "kanban" ? (
          <TasksKanbanBoard
            items={boardItems}
            canEdit={canEdit}
            users={usersForTask}
            showStagesCatalogLink={showStagesCatalogLink}
            columns={kanbanColumns}
          />
        ) : null}
        {view === "calendar" ? (
          <TasksCalendarView
            items={boardItems}
            users={usersForTask}
            canEdit={canEdit}
            showStagesCatalogLink={showStagesCatalogLink}
          />
        ) : null}
        {view === "gantt" ? (
          <TasksGanttView
            items={boardItems}
            users={usersForTask}
            canEdit={canEdit}
            showStagesCatalogLink={showStagesCatalogLink}
          />
        ) : null}

        {view === "list" ? (
          <>
            <div className="flex flex-wrap gap-3">
              {[
                {
                  icon: AlertCircle,
                  label: "Vencidas",
                  value: overdue.length,
                  color: "text-destructive",
                  bg: "bg-destructive/8",
                  border: "border-destructive/20",
                },
                {
                  icon: Clock,
                  label: "Abertas",
                  value: myTasks.length,
                  color: "text-warning",
                  bg: "bg-warning/8",
                  border: "border-warning/20",
                },
                {
                  icon: Building2,
                  label: "Empreendimentos",
                  value: new Set(myTasks.map((t) => t.development)).size,
                  color: "text-primary",
                  bg: "bg-primary/8",
                  border: "border-primary/20",
                },
              ].map(({ icon: Icon, label, value, color, bg, border }) => (
                <div
                  key={label}
                  className={cn(
                    "flex items-center gap-3 rounded-[--radius-md] border px-4 py-3",
                    bg,
                    border,
                  )}
                >
                  <Icon aria-hidden="true" className={cn("size-5", color)} strokeWidth={1.5} />
                  <div>
                    <p className={cn("tabular text-xl font-bold leading-none", color)}>{value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            <TasksListTable
              items={boardItems}
              users={usersForTask}
              canEdit={canEdit}
              showDevelopment={false}
              showStagesCatalogLink={showStagesCatalogLink}
              emptyMessage="Nenhuma tarefa atribuída a si. Quando lhe forem atribuídas tarefas em aberto, elas aparecem aqui."
            />
          </>
        ) : null}
      </main>
    </div>
  );
}
