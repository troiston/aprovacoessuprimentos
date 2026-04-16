import type { Metadata } from "next";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { TaskCreationLauncher } from "@/components/tasks/task-creation-launcher";
import { TaskViewNav } from "@/components/tasks/task-view-nav";
import { TasksCalendarView } from "@/components/tasks/tasks-calendar-view";
import { TasksGanttView } from "@/components/tasks/tasks-gantt-view";
import { TasksKanbanBoard } from "@/components/tasks/tasks-kanban-board";
import { TasksListTable, TasksListTableFooterAll } from "@/components/tasks/tasks-list-table";
import { getCurrentUser } from "@/lib/auth/get-session";
import { canEditStagesOrTasks, canManageUsers } from "@/lib/domain/permissions";
import { db } from "@/lib/db";
import { taskRowToBoardItem } from "@/lib/tasks/task-board-mapper";
import { findAllTasks } from "@/lib/services/tasks-queries";
import { listKanbanColumnsOrdered } from "@/lib/services/kanban-columns";
import { formatDatePtBR } from "@/lib/services/developments-list";
import { listAssignableUsers, formatUserLabel } from "@/lib/services/users-queries";
import { parseTaskView } from "@/types/task-board";

export const metadata: Metadata = {
  title: "Todas as Tarefas",
};

function parseColumnId(
  raw: string | undefined,
  validIds: Set<string>,
): string | undefined {
  if (!raw || raw === "all") {
    return undefined;
  }
  return validIds.has(raw) ? raw : undefined;
}

type PageProps = {
  searchParams: Promise<{ dev?: string; column?: string; view?: string }>;
};

export default async function AllTasksPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const devFilter = sp.dev && sp.dev !== "all" ? sp.dev : undefined;
  const view = parseTaskView(sp.view);

  const user = await getCurrentUser();
  const canEdit = canEditStagesOrTasks(user);
  const showStagesCatalogLink = canManageUsers(user);

  const kanbanColumns = await listKanbanColumnsOrdered();
  const columnIdSet = new Set(kanbanColumns.map((c) => c.id));
  const columnFilter = parseColumnId(sp.column, columnIdSet);

  const [developments, tasks, assignableRows] = await Promise.all([
    db.development.findMany({
      where: { deletedAt: null, isActive: true },
      select: { slug: true, name: true },
      orderBy: { name: "asc" },
    }),
    findAllTasks({ developmentSlug: devFilter, kanbanColumnId: columnFilter }),
    listAssignableUsers(),
  ]);
  const usersForTask = assignableRows.map((u) => ({
    id: u.id,
    label: formatUserLabel(u),
  }));

  const now = new Date();
  const rows = tasks.map((t) => {
    const deadlineLabel = t.deadline ? formatDatePtBR(t.deadline) : "—";
    const isOverdue =
      t.deadline !== null && t.deadline < now && !t.kanbanColumn.isTerminal;
    const assignee =
      t.assignee?.displayName ?? t.assignee?.name ?? t.assignee?.email ?? "—";
    return {
      id: t.id,
      development: t.development.name,
      developmentSlug: t.development.slug,
      stage: t.stage.name,
      description: t.description,
      assignee,
      deadline: deadlineLabel,
      isOverdue,
      notes: t.notes,
    };
  });

  const overdue = rows.filter((r) => r.isOverdue);
  const boardItems = tasks.map((t) => taskRowToBoardItem(t, now));

  const navQuery: Record<string, string | undefined> = {
    dev: sp.dev,
    column: sp.column,
  };

  return (
    <div>
      <Topbar title="Todas as Tarefas" description={`${rows.length} tarefas · ${overdue.length} vencidas`} />

      <main className="p-6 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between">
          <TaskViewNav pathname="/tasks/all" current={view} query={navQuery} />
          {canEdit ? (
            <TaskCreationLauncher
              developments={developments}
              users={usersForTask}
              defaultSlug={devFilter}
              canEdit={canEdit}
            />
          ) : null}
        </div>

        <form className="flex flex-wrap gap-2 items-center" method="get" action="/tasks/all">
          {view !== "list" ? <input type="hidden" name="view" value={view} /> : null}
          <label className="sr-only" htmlFor="filter-dev">
            Empreendimento
          </label>
          <select
            id="filter-dev"
            name="dev"
            defaultValue={devFilter ?? "all"}
            className="select-app h-9 min-w-[11rem] max-w-[20rem] rounded-[--radius] px-2 text-xs"
          >
            <option value="all">Todos os empreendimentos</option>
            {developments.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="filter-column">
            Coluna Kanban
          </label>
          <select
            id="filter-column"
            name="column"
            defaultValue={sp.column && columnIdSet.has(sp.column) ? sp.column : "all"}
            className="select-app h-9 min-w-[11rem] max-w-[20rem] rounded-[--radius] px-2 text-xs"
          >
            <option value="all">Todas as colunas</option>
            {kanbanColumns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <Button type="submit" variant="secondary" size="sm" className="h-8 text-xs">
            Aplicar
          </Button>
        </form>

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
          <TasksListTable
            items={boardItems}
            users={usersForTask}
            canEdit={canEdit}
            showDevelopment
            showStagesCatalogLink={showStagesCatalogLink}
            listFooter={<TasksListTableFooterAll total={rows.length} overdue={overdue.length} />}
          />
        ) : null}
      </main>
    </div>
  );
}
