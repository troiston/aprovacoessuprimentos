import { NextResponse } from "next/server";
import { requireEditorForApi } from "@/lib/api/route-auth";
import { db } from "@/lib/db";
import { reorderKanbanColumnsBodySchema } from "@/lib/validations/kanban-column";
import { assertValidKanbanColumnOrder } from "@/lib/services/kanban-columns";

export async function POST(request: Request) {
  const userOrRes = await requireEditorForApi();
  if (userOrRes instanceof NextResponse) {
    return userOrRes;
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = reorderKanbanColumnsBodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Dados inválidos" },
      { status: 422 },
    );
  }

  try {
    await assertValidKanbanColumnOrder(parsed.data.orderedIds);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ordem inválida";
    return NextResponse.json({ error: msg }, { status: 422 });
  }

  await db.$transaction(
    parsed.data.orderedIds.map((id, index) =>
      db.kanbanColumn.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );

  const columns = await db.kanbanColumn.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, sortOrder: true, isTerminal: true },
  });

  return NextResponse.json({ ok: true, columns });
}
