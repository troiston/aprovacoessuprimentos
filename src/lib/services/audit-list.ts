import { db } from "@/lib/db";
import {
  formatAuditValueChange,
  getAuditActionLabel,
  getAuditEntityTypeLabel,
  getAuditFieldLabel,
  summarizeTaskUpdateFields,
} from "@/lib/audit/audit-display";

export type AuditListRow = {
  id: string;
  createdAt: Date;
  userLabel: string;
  userInitials: string;
  /** Chave técnica (ex.: `development.create`) — útil para variantes e `title` */
  actionKey: string;
  /** Texto amigável em português */
  actionLabel: string;
  /** Frase principal: o que aconteceu, com nomes quando existirem */
  summary: string;
  /** Segunda linha: mudança de valor ou campos alterados */
  change: string | null;
  /** Onde no negócio (empreendimento, URL, etc.) */
  context: string;
  /** Referência técnica para suporte (entidade + id) */
  technicalRef: string;
};

function parseMeta(m: unknown): Record<string, unknown> {
  return m && typeof m === "object" && !Array.isArray(m) ? (m as Record<string, unknown>) : {};
}

function initials(label: string): string {
  const parts = label.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

function resolveSlug(meta: Record<string, unknown>): string | undefined {
  if (typeof meta.slug === "string") {
    return meta.slug;
  }
  if (typeof meta.developmentSlug === "string") {
    return meta.developmentSlug;
  }
  return undefined;
}

function buildDisplayRow(
  r: {
    id: string;
    createdAt: Date;
    action: string;
    entity: string;
    entityId: string;
    field: string | null;
    oldValue: unknown;
    newValue: unknown;
    metadata: unknown;
    user: { displayName: string | null; name: string | null; email: string } | null;
  },
  stageNameById: Map<string, string>,
  devNameBySlug: Map<string, string>,
  taskDevelopmentByTaskId: Map<string, { slug: string; name: string }>,
): AuditListRow {
  const userLabel = r.user?.displayName ?? r.user?.name ?? r.user?.email ?? "Sistema";
  const meta = parseMeta(r.metadata);
  const slug = resolveSlug(meta);
  const devName = slug ? devNameBySlug.get(slug) : undefined;
  const stageId = typeof meta.stageId === "string" ? meta.stageId : undefined;
  const stageName = stageId ? stageNameById.get(stageId) : undefined;
  const taskDev = r.entity === "Task" ? taskDevelopmentByTaskId.get(r.entityId) : undefined;

  const actionKey = r.action;
  const actionLabel = getAuditActionLabel(r.action);
  const entityTypePt = getAuditEntityTypeLabel(r.entity);
  const valueChange = formatAuditValueChange(r.field, r.oldValue, r.newValue);

  let summary = "";
  let change: string | null = valueChange;
  let context = "";

  switch (r.action) {
    case "development.create": {
      const name = typeof meta.name === "string" ? meta.name : null;
      summary = name
        ? `Foi criado o empreendimento «${name}».`
        : "Foi criado um novo empreendimento.";
      context = slug
        ? devName
          ? `Empreendimento: ${devName} · painel /developments/${slug}`
          : `Painel: /developments/${slug}`
        : "—";
      change = null;
      break;
    }
    case "development.update": {
      const patch =
        meta.patch && typeof meta.patch === "object" && meta.patch !== null && !Array.isArray(meta.patch)
          ? (meta.patch as Record<string, unknown>)
          : {};
      const keys = Object.keys(patch);
      const keyLabels = keys.map((k) => getAuditFieldLabel(k) ?? k.replace(/_/g, " "));
      summary = `O empreendimento «${devName ?? slug ?? "—"}» foi atualizado.`;
      change =
        keyLabels.length > 0
          ? `Campos alterados: ${keyLabels.join(", ")}`
          : valueChange;
      context = slug ? `Referência: /developments/${slug}` : "—";
      break;
    }
    case "development.soft_delete": {
      summary = `O empreendimento «${devName ?? slug ?? "—"}» foi arquivado (marcado como inativo).`;
      context = slug ? `Slug: ${slug}` : "—";
      change = null;
      break;
    }
    case "stage.status.update": {
      const stageLabel = stageName ?? "Etapa (catálogo)";
      const projectLabel = devName ?? slug ?? "empreendimento";
      summary = `A etapa «${stageLabel}» do projeto «${projectLabel}» mudou de estado.`;
      context = slug ? `Empreendimento: ${devName ?? slug}` : "—";
      break;
    }
    case "task.create": {
      summary = `Foi criada uma nova tarefa no empreendimento «${devName ?? slug ?? "—"}».`;
      context = slug ? `Painel: /developments/${slug}` : "—";
      change = null;
      break;
    }
    case "task.update": {
      summary = taskDev
        ? `Uma tarefa do empreendimento «${taskDev.name}» foi atualizada.`
        : "Uma tarefa foi atualizada.";
      const fieldsLine = summarizeTaskUpdateFields(meta.fields);
      change = fieldsLine ?? valueChange;
      context = taskDev ? `Painel: /developments/${taskDev.slug}` : "—";
      break;
    }
    case "task.soft_delete": {
      summary = taskDev
        ? `Uma tarefa do empreendimento «${taskDev.name}» foi removida (arquivada).`
        : "Uma tarefa foi removida (arquivada).";
      change = null;
      context = taskDev ? `Referência: /developments/${taskDev.slug}` : "—";
      break;
    }
    case "mail.test": {
      summary = "Foi executado um teste de envio de e-mail (SMTP).";
      change = null;
      context = "Integração · e-mail";
      break;
    }
    case "mail.send": {
      summary = "Foi enviada uma mensagem de e-mail pelo sistema.";
      change = null;
      context = "Integração · e-mail";
      break;
    }
    case "settings.mail.create":
    case "settings.mail.update": {
      summary =
        r.action === "settings.mail.create"
          ? "As definições de e-mail (SMTP) foram criadas."
          : "As definições de e-mail (SMTP) foram alteradas.";
      change = null;
      context = "Definições · correio";
      break;
    }
    default: {
      summary = `${entityTypePt}: registo «${actionLabel}».`;
      change = valueChange;
      context = slug ? `Empreendimento: ${devName ?? slug}` : "—";
    }
  }

  return {
    id: r.id,
    createdAt: r.createdAt,
    userLabel,
    userInitials: initials(userLabel),
    actionKey,
    actionLabel,
    summary,
    change,
    context,
    technicalRef: `${r.entity} · ${r.entityId}`,
  };
}

export async function listRecentAuditLogs(take: number): Promise<AuditListRow[]> {
  const rows = await db.auditLog.findMany({
    take,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { displayName: true, name: true, email: true },
      },
    },
  });

  const stageIds = new Set<string>();
  const slugs = new Set<string>();
  const taskIdsForDev = new Set<string>();
  for (const r of rows) {
    const m = parseMeta(r.metadata);
    if (typeof m.stageId === "string") {
      stageIds.add(m.stageId);
    }
    const s = resolveSlug(m);
    if (s) {
      slugs.add(s);
    }
    if (r.entity === "Task" && (r.action === "task.update" || r.action === "task.soft_delete")) {
      taskIdsForDev.add(r.entityId);
    }
  }

  const [stages, devs, tasksForContext] = await Promise.all([
    stageIds.size > 0
      ? db.stage.findMany({
          where: { id: { in: [...stageIds] } },
          select: { id: true, name: true },
        })
      : [],
    slugs.size > 0
      ? db.development.findMany({
          where: { slug: { in: [...slugs] } },
          select: { slug: true, name: true },
        })
      : [],
    taskIdsForDev.size > 0
      ? db.task.findMany({
          where: { id: { in: [...taskIdsForDev] } },
          select: {
            id: true,
            development: { select: { slug: true, name: true } },
          },
        })
      : [],
  ]);

  const stageNameById = new Map(stages.map((s) => [s.id, s.name]));
  const devNameBySlug = new Map(devs.map((d) => [d.slug, d.name]));
  const taskDevelopmentByTaskId = new Map(
    tasksForContext.map((t) => [t.id, { slug: t.development.slug, name: t.development.name }]),
  );

  return rows.map((r) =>
    buildDisplayRow(r, stageNameById, devNameBySlug, taskDevelopmentByTaskId),
  );
}
