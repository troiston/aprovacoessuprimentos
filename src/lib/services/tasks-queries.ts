import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

export type TaskListRow = {
  id: string;
  description: string;
  deadline: Date | null;
  notes: string | null;
  updatedAt: Date;
  development: { slug: string; name: string };
  stage: { id: string; name: string };
  kanbanColumn: { id: string; name: string; isTerminal: boolean };
  assignee: { id: string; displayName: string | null; name: string | null; email: string } | null;
};

function toRow(t: {
  id: string;
  description: string;
  deadline: Date | null;
  notes: string | null;
  updatedAt: Date;
  development: { slug: string; name: string };
  stage: { id: string; name: string };
  kanbanColumn: { id: string; name: string; isTerminal: boolean };
  assignee: {
    id: string;
    displayName: string | null;
    name: string | null;
    email: string;
  } | null;
}): TaskListRow {
  return {
    id: t.id,
    description: t.description,
    deadline: t.deadline,
    notes: t.notes,
    updatedAt: t.updatedAt,
    development: t.development,
    stage: t.stage,
    kanbanColumn: t.kanbanColumn,
    assignee: t.assignee,
  };
}

const taskInclude = {
  development: { select: { slug: true, name: true } },
  stage: { select: { id: true, name: true } },
  kanbanColumn: { select: { id: true, name: true, isTerminal: true } },
  assignee: {
    select: { id: true, displayName: true, name: true, email: true },
  },
} satisfies Prisma.TaskInclude;

export async function findTasksForUser(assigneeId: string): Promise<TaskListRow[]> {
  const rows = await db.task.findMany({
    where: {
      deletedAt: null,
      assigneeId,
      kanbanColumn: { isTerminal: false },
    },
    orderBy: [{ deadline: "asc" }, { updatedAt: "desc" }],
    include: taskInclude,
  });
  return rows.map(toRow);
}

export async function findAllTasks(filters: {
  developmentSlug?: string;
  kanbanColumnId?: string;
}): Promise<TaskListRow[]> {
  const where: Prisma.TaskWhereInput = { deletedAt: null };
  if (filters.developmentSlug) {
    where.development = { slug: filters.developmentSlug, deletedAt: null };
  }
  if (filters.kanbanColumnId) {
    where.kanbanColumnId = filters.kanbanColumnId;
  }
  const rows = await db.task.findMany({
    where,
    orderBy: [{ deadline: "asc" }, { updatedAt: "desc" }],
    include: taskInclude,
  });
  return rows.map(toRow);
}
