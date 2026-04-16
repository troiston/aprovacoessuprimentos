import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-session";
import { requireEditorForApi } from "@/lib/api/route-auth";
import { db } from "@/lib/db";
import { createKanbanColumnBodySchema } from "@/lib/validations/kanban-column";
import { listKanbanColumnsOrdered } from "@/lib/services/kanban-columns";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const columns = await listKanbanColumnsOrdered();
  return NextResponse.json({ columns });
}

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

  const parsed = createKanbanColumnBodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Dados inválidos" },
      { status: 422 },
    );
  }

  const maxRow = await db.kanbanColumn.aggregate({ _max: { sortOrder: true } });
  const sortOrder = (maxRow._max.sortOrder ?? -1) + 1;

  const created = await db.kanbanColumn.create({
    data: {
      name: parsed.data.name,
      sortOrder,
      isTerminal: false,
    },
    select: { id: true, name: true, sortOrder: true, isTerminal: true },
  });

  return NextResponse.json({ column: created }, { status: 201 });
}
