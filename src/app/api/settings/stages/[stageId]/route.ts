import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/api/route-auth";
import { appendAuditLog } from "@/lib/audit/audit-log.service";
import { AuditEntity } from "@/lib/audit/constants";
import { db } from "@/lib/db";
import { recalculateAllStageGlobalWeights } from "@/lib/services/stage-catalog";

type RouteContext = { params: Promise<{ stageId: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const userOrRes = await requireAdminForApi();
  if (userOrRes instanceof NextResponse) {
    return userOrRes;
  }
  const user = userOrRes;

  const { stageId } = await context.params;

  const existing = await db.stage.findFirst({ where: { id: stageId } });
  if (!existing) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  const taskCount = await db.task.count({ where: { stageId } });
  if (taskCount > 0) {
    return NextResponse.json(
      {
        error: `Não é possível remover: existem ${String(taskCount)} registo(s) de tarefa(s) nesta etapa (inclui arquivadas).`,
      },
      { status: 422 },
    );
  }

  await db.$transaction(async (tx) => {
    await tx.developmentStage.deleteMany({ where: { stageId } });
    await tx.stageSchedule.deleteMany({ where: { stageId } });
    await tx.stage.delete({ where: { id: stageId } });
    await recalculateAllStageGlobalWeights(tx);
  });

  await appendAuditLog({
    userId: user.id,
    entity: AuditEntity.Stage,
    entityId: stageId,
    action: "stage.catalog.delete",
    metadata: { name: existing.name },
  });

  return NextResponse.json({ ok: true });
}
