import type { TaskStatus } from "@/generated/prisma/enums";

/** Dados serializáveis para vistas de tarefas (lista, Kanban, calendário, Gantt). */
export type TaskBoardItem = {
  id: string;
  status: TaskStatus;
  development: string;
  developmentSlug: string;
  /** ID da etapa no catálogo (`Stage.id`) */
  stageId: string;
  stage: string;
  description: string;
  assignee: string;
  /** `null` se sem responsável */
  assigneeId: string | null;
  /** ISO 8601 ou null */
  deadlineIso: string | null;
  deadlineLabel: string;
  isOverdue: boolean;
  notes: string | null;
};

export type TaskViewId = "list" | "kanban" | "calendar" | "gantt";

export function parseTaskView(raw: string | undefined): TaskViewId {
  if (raw === "kanban" || raw === "calendar" || raw === "gantt") {
    return raw;
  }
  return "list";
}
