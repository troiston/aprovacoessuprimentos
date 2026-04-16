/**
 * Rótulos e formatação para exibição do log de auditoria em português (UI).
 * As chaves técnicas (`action`, `entity`, `field`) mantêm-se na BD; aqui só traduzimos.
 */

const ACTION_LABELS: Record<string, string> = {
  "stage.status.update": "Alteração do estado da etapa",
  "development.create": "Criação de empreendimento",
  "development.update": "Atualização de empreendimento",
  "development.soft_delete": "Arquivamento de empreendimento",
  "task.create": "Criação de tarefa",
  "task.update": "Atualização de tarefa",
  "task.soft_delete": "Remoção de tarefa",
  "stage.catalog.create": "Nova etapa no catálogo",
  "stage.catalog.delete": "Remoção de etapa do catálogo",
  "stage.catalog.patch": "Alteração ao catálogo de etapas",
  "mail.test": "Teste de envio de e-mail",
  "mail.send": "Envio de e-mail",
  "settings.mail.create": "Configuração de e-mail (SMTP) criada",
  "settings.mail.update": "Configuração de e-mail (SMTP) alterada",
};

const ENTITY_TYPE_LABELS: Record<string, string> = {
  Development: "Empreendimento",
  DevelopmentStage: "Etapa do empreendimento",
  Stage: "Etapa (catálogo global)",
  Task: "Tarefa",
  SystemSetting: "Definição do sistema",
};

const FIELD_LABELS: Record<string, string> = {
  status: "Estado",
  description: "Descrição",
  notes: "Notas",
  deadline: "Prazo",
  assigneeId: "Responsável",
  name: "Nome",
  code: "Código interno",
  isActive: "Ativo no sistema",
};

const STAGE_STATUS_PT: Record<string, string> = {
  NOT_STARTED: "Não iniciada",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída",
};

const TASK_STATUS_PT: Record<string, string> = {
  OPEN: "Aberta",
  IN_PROGRESS: "Em progresso",
  BLOCKED: "Bloqueada",
  DONE: "Concluída",
};

function humanizeUnknownAction(action: string): string {
  return action
    .split(".")
    .map((part) =>
      part
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    )
    .join(" · ");
}

export function getAuditActionLabel(action: string): string {
  return ACTION_LABELS[action] ?? humanizeUnknownAction(action);
}

export function getAuditEntityTypeLabel(entity: string): string {
  return ENTITY_TYPE_LABELS[entity] ?? entity;
}

export function getAuditFieldLabel(field: string | null): string | null {
  if (!field) {
    return null;
  }
  return FIELD_LABELS[field] ?? field.replace(/_/g, " ");
}

function normalizeScalar(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function formatAuditValueForField(field: string | null, value: unknown): string | null {
  const raw = normalizeScalar(value);
  if (raw === null) {
    return null;
  }
  if (field === "status") {
    if (raw in STAGE_STATUS_PT) {
      return STAGE_STATUS_PT[raw];
    }
    if (raw in TASK_STATUS_PT) {
      return TASK_STATUS_PT[raw];
    }
  }
  if (field === "assigneeId" && raw === "") {
    return "—";
  }
  if (field === "isActive") {
    return raw === "true" ? "Sim" : raw === "false" ? "Não" : raw;
  }
  return raw;
}

export function formatAuditValueChange(
  field: string | null,
  oldValue: unknown,
  newValue: unknown,
): string | null {
  const fieldPt = getAuditFieldLabel(field);
  if (!fieldPt) {
    return null;
  }
  const oldT = formatAuditValueForField(field, oldValue);
  const newT = formatAuditValueForField(field, newValue);
  if (oldT !== null && newT !== null) {
    return `${fieldPt}: ${oldT} → ${newT}`;
  }
  if (newT !== null) {
    return `${fieldPt}: ${newT}`;
  }
  if (oldT !== null) {
    return `${fieldPt}: ${oldT} (removido)`;
  }
  return fieldPt;
}

const TASK_FIELD_LABELS: Record<string, string> = {
  description: "descrição",
  notes: "notas",
  deadline: "prazo",
  assigneeId: "responsável",
  status: "estado",
};

export function summarizeTaskUpdateFields(fields: unknown): string | null {
  if (!Array.isArray(fields) || fields.length === 0) {
    return null;
  }
  const parts = fields
    .filter((f): f is string => typeof f === "string")
    .map((f) => TASK_FIELD_LABELS[f] ?? f.replace(/_/g, " "));
  if (parts.length === 0) {
    return null;
  }
  return `Campos alterados: ${parts.join(", ")}`;
}
