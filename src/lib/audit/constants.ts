/** Nomes estáveis de entidade para `AuditLog.entity` (evitar typos). */
export const AuditEntity = {
  Development: "Development",
  DevelopmentStage: "DevelopmentStage",
  Task: "Task",
  SystemSetting: "SystemSetting",
} as const;

export type AuditEntityName = (typeof AuditEntity)[keyof typeof AuditEntity];
