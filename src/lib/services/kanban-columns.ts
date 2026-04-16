import { db } from "@/lib/db";
import type { KanbanColumnDto } from "@/types/kanban-column";

export async function listKanbanColumnsOrdered(): Promise<KanbanColumnDto[]> {
  const rows = await db.kanbanColumn.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, sortOrder: true, isTerminal: true },
  });
  return rows;
}

/** Primeira coluna não-terminal (tarefas «em curso» por defeito). */
export async function getDefaultKanbanColumnIdForNewTask(): Promise<string | null> {
  const col = await db.kanbanColumn.findFirst({
    where: { isTerminal: false },
    orderBy: { sortOrder: "asc" },
    select: { id: true },
  });
  return col?.id ?? null;
}

export async function assertValidKanbanColumnOrder(orderedIds: string[]): Promise<void> {
  const all = await db.kanbanColumn.findMany({ select: { id: true } });
  const set = new Set(all.map((c) => c.id));
  if (orderedIds.length !== set.size) {
    throw new Error("A lista de colunas deve incluir todos os IDs exatamente uma vez.");
  }
  for (const id of orderedIds) {
    if (!set.has(id)) {
      throw new Error("ID de coluna inválido na reordenação.");
    }
  }
}
