import { NextResponse } from "next/server";
import { requireEditorForApi } from "@/lib/api/route-auth";
import { db } from "@/lib/db";
import { patchKanbanColumnBodySchema } from "@/lib/validations/kanban-column";

type RouteContext = { params: Promise<{ columnId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const userOrRes = await requireEditorForApi();
  if (userOrRes instanceof NextResponse) {
    return userOrRes;
  }

  const { columnId } = await context.params;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = patchKanbanColumnBodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Dados inválidos" },
      { status: 422 },
    );
  }

  const existing = await db.kanbanColumn.findFirst({ where: { id: columnId } });
  if (!existing) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  const updated = await db.kanbanColumn.update({
    where: { id: columnId },
    data: { name: parsed.data.name },
    select: { id: true, name: true, sortOrder: true, isTerminal: true },
  });

  return NextResponse.json({ column: updated });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const userOrRes = await requireEditorForApi();
  if (userOrRes instanceof NextResponse) {
    return userOrRes;
  }

  const { columnId } = await context.params;

  const existing = await db.kanbanColumn.findFirst({ where: { id: columnId } });
  if (!existing) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  const totalCols = await db.kanbanColumn.count();
  if (totalCols <= 1) {
    return NextResponse.json(
      { error: "Tem de existir pelo menos uma coluna no quadro." },
      { status: 422 },
    );
  }

  const taskCount = await db.task.count({ where: { kanbanColumnId: columnId } });
  if (taskCount > 0) {
    return NextResponse.json(
      {
        error: `Não é possível remover: existem ${String(taskCount)} tarefa(s) nesta coluna.`,
      },
      { status: 422 },
    );
  }

  await db.kanbanColumn.delete({ where: { id: columnId } });

  const terminalLeft = await db.kanbanColumn.count({ where: { isTerminal: true } });
  if (terminalLeft === 0) {
    const pick = await db.kanbanColumn.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { id: true },
    });
    if (pick) {
      await db.kanbanColumn.update({
        where: { id: pick.id },
        data: { isTerminal: true },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
