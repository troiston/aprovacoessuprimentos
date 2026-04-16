import { NextResponse } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import { requireEditorForApi } from "@/lib/api/route-auth";
import { appendAuditLog } from "@/lib/audit/audit-log.service";
import { AuditEntity } from "@/lib/audit/constants";
import { db } from "@/lib/db";
import { patchTaskBodySchema } from "@/lib/validations/task";

type RouteContext = { params: Promise<{ taskId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const userOrRes = await requireEditorForApi();
  if (userOrRes instanceof NextResponse) {
    return userOrRes;
  }
  const user = userOrRes;

  const { taskId } = await context.params;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = patchTaskBodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Dados inválidos" },
      { status: 422 },
    );
  }

  const existing = await db.task.findFirst({
    where: { id: taskId, deletedAt: null },
  });
  if (!existing) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  const data: Prisma.TaskUpdateInput = {};

  if (parsed.data.description !== undefined) {
    data.description = parsed.data.description.trim();
  }
  if (parsed.data.stageId !== undefined) {
    const st = await db.stage.findFirst({ where: { id: parsed.data.stageId } });
    if (!st) {
      return NextResponse.json({ error: "Etapa inválida" }, { status: 422 });
    }
    data.stage = { connect: { id: parsed.data.stageId } };
  }
  if (parsed.data.assigneeId !== undefined) {
    data.assignee =
      parsed.data.assigneeId === null
        ? { disconnect: true }
        : { connect: { id: parsed.data.assigneeId } };
  }
  if (parsed.data.deadline !== undefined) {
    data.deadline =
      parsed.data.deadline === null ? null : new Date(parsed.data.deadline);
  }
  if (parsed.data.notes !== undefined) {
    data.notes = parsed.data.notes;
  }
  if (parsed.data.kanbanColumnId !== undefined) {
    const col = await db.kanbanColumn.findFirst({
      where: { id: parsed.data.kanbanColumnId },
    });
    if (!col) {
      return NextResponse.json({ error: "Coluna Kanban inválida" }, { status: 422 });
    }
    data.kanbanColumn = { connect: { id: parsed.data.kanbanColumnId } };
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 422 });
  }

  const updated = await db.task.update({
    where: { id: taskId },
    data,
  });

  await appendAuditLog({
    userId: user.id,
    entity: AuditEntity.Task,
    entityId: updated.id,
    action: "task.update",
    metadata: { fields: Object.keys(parsed.data) },
  });

  return NextResponse.json({ task: updated });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const userOrRes = await requireEditorForApi();
  if (userOrRes instanceof NextResponse) {
    return userOrRes;
  }
  const user = userOrRes;

  const { taskId } = await context.params;
  const existing = await db.task.findFirst({
    where: { id: taskId, deletedAt: null },
  });
  if (!existing) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  await db.task.update({
    where: { id: taskId },
    data: { deletedAt: new Date() },
  });

  await appendAuditLog({
    userId: user.id,
    entity: AuditEntity.Task,
    entityId: taskId,
    action: "task.soft_delete",
  });

  return NextResponse.json({ ok: true });
}
