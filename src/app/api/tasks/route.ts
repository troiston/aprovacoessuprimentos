import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-session";
import { requireEditorForApi } from "@/lib/api/route-auth";
import { appendAuditLog } from "@/lib/audit/audit-log.service";
import { AuditEntity } from "@/lib/audit/constants";
import { db } from "@/lib/db";
import { createTaskBodySchema } from "@/lib/validations/task";
import { findAllTasks } from "@/lib/services/tasks-queries";
import { getDefaultKanbanColumnIdForNewTask } from "@/lib/services/kanban-columns";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const developmentSlug = searchParams.get("developmentSlug") ?? undefined;
  const columnRaw = searchParams.get("column");
  let kanbanColumnId: string | undefined;
  if (columnRaw && columnRaw !== "all") {
    const exists = await db.kanbanColumn.findFirst({
      where: { id: columnRaw },
      select: { id: true },
    });
    if (!exists) {
      return NextResponse.json({ error: "column inválido" }, { status: 400 });
    }
    kanbanColumnId = columnRaw;
  }

  const tasks = await findAllTasks({ developmentSlug, kanbanColumnId });
  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  const userOrRes = await requireEditorForApi();
  if (userOrRes instanceof NextResponse) {
    return userOrRes;
  }
  const user = userOrRes;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = createTaskBodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Dados inválidos" },
      { status: 422 },
    );
  }

  const dev = await db.development.findFirst({
    where: { slug: parsed.data.developmentSlug, deletedAt: null, isActive: true },
  });
  if (!dev) {
    return NextResponse.json({ error: "Empreendimento não encontrado" }, { status: 404 });
  }

  const stageOk = await db.stage.findFirst({
    where: { id: parsed.data.stageId },
  });
  if (!stageOk) {
    return NextResponse.json({ error: "Etapa inválida" }, { status: 422 });
  }

  if (parsed.data.assigneeId) {
    const assignee = await db.user.findFirst({
      where: { id: parsed.data.assigneeId, isActive: true },
    });
    if (!assignee) {
      return NextResponse.json({ error: "Responsável inválido" }, { status: 422 });
    }
  }

  let kanbanColumnId = parsed.data.kanbanColumnId ?? null;
  if (kanbanColumnId) {
    const col = await db.kanbanColumn.findFirst({ where: { id: kanbanColumnId } });
    if (!col) {
      return NextResponse.json({ error: "Coluna Kanban inválida" }, { status: 422 });
    }
  } else {
    kanbanColumnId = await getDefaultKanbanColumnIdForNewTask();
    if (!kanbanColumnId) {
      return NextResponse.json(
        { error: "Não há colunas Kanban configuradas." },
        { status: 500 },
      );
    }
  }

  let deadline: Date | null = null;
  if (parsed.data.deadline !== undefined && parsed.data.deadline !== null) {
    deadline = new Date(parsed.data.deadline);
  }

  const task = await db.task.create({
    data: {
      developmentId: dev.id,
      stageId: parsed.data.stageId,
      kanbanColumnId,
      description: parsed.data.description.trim(),
      assigneeId: parsed.data.assigneeId ?? null,
      deadline,
      notes: parsed.data.notes?.trim() ?? null,
    },
  });

  await appendAuditLog({
    userId: user.id,
    entity: AuditEntity.Task,
    entityId: task.id,
    action: "task.create",
    metadata: {
      developmentSlug: dev.slug,
      stageId: task.stageId,
      kanbanColumnId: task.kanbanColumnId,
    },
  });

  return NextResponse.json({ task }, { status: 201 });
}
