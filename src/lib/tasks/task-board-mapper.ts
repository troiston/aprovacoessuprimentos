import type { TaskListRow } from "@/lib/services/tasks-queries";
import { formatDatePtBR } from "@/lib/services/developments-list";
import type { TaskBoardItem } from "@/types/task-board";

export function taskRowToBoardItem(t: TaskListRow, now: Date): TaskBoardItem {
  const deadlineLabel = t.deadline ? formatDatePtBR(t.deadline) : "—";
  const isOverdue = t.deadline !== null && t.deadline < now && t.status !== "DONE";
  const assignee =
    t.assignee?.displayName ?? t.assignee?.name ?? t.assignee?.email ?? "—";
  return {
    id: t.id,
    status: t.status,
    development: t.development.name,
    developmentSlug: t.development.slug,
    stageId: t.stage.id,
    stage: t.stage.name,
    description: t.description,
    assignee,
    assigneeId: t.assignee?.id ?? null,
    deadlineIso: t.deadline ? t.deadline.toISOString() : null,
    deadlineLabel,
    isOverdue,
    notes: t.notes,
  };
}
