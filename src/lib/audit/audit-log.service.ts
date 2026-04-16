import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import type { AuditEntityName } from "@/lib/audit/constants";

export type AppendAuditLogInput = {
  userId: string | null;
  entity: AuditEntityName;
  entityId: string;
  action: string;
  field?: string | null;
  oldValue?: Prisma.InputJsonValue | null;
  newValue?: Prisma.InputJsonValue | null;
  metadata?: Prisma.InputJsonValue | null;
};

/**
 * Registo append-only na trilha de auditoria.
 * Use `tx` para participar na mesma transação que a mutação de domínio.
 */
export async function appendAuditLog(
  input: AppendAuditLogInput,
  tx?: Prisma.TransactionClient,
): Promise<void> {
  const client = tx ?? db;
  await client.auditLog.create({
    data: {
      userId: input.userId,
      entity: input.entity,
      entityId: input.entityId,
      action: input.action,
      field: input.field ?? null,
      oldValue: input.oldValue ?? undefined,
      newValue: input.newValue ?? undefined,
      metadata: input.metadata ?? undefined,
    },
  });
}
