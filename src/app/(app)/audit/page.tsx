import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth/get-session";
import { canEditStagesOrTasks } from "@/lib/domain/permissions";
import { listRecentAuditLogs } from "@/lib/services/audit-list";

export const metadata: Metadata = {
  title: "Log de Auditoria",
};

function formatDateTimePtBR(d: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "America/Manaus",
  }).format(d);
}

function actionBadgeVariant(actionKey: string): "default" | "success" | "warning" | "destructive" | "secondary" | "accent" | "outline" | "muted" {
  if (actionKey.includes("delete") || actionKey.includes("soft")) {
    return "destructive";
  }
  if (actionKey.includes("create")) {
    return "success";
  }
  if (actionKey.includes("stage") || actionKey.includes("status")) {
    return "warning";
  }
  if (actionKey.includes("mail")) {
    return "accent";
  }
  return "default";
}

export default async function AuditPage() {
  const user = await getCurrentUser();
  if (!user || !canEditStagesOrTasks(user)) {
    return (
      <div>
        <Topbar title="Log de Auditoria" description="Acesso restrito" />
        <main className="p-6">
          <p className="text-sm text-muted-foreground">
            Apenas utilizadores com perfil de edição ou administração podem consultar o log de auditoria.
          </p>
        </main>
      </div>
    );
  }

  const auditLog = await listRecentAuditLogs(200);

  return (
    <div>
      <Topbar
        title="Log de Auditoria"
        description={`${auditLog.length} registos recentes`}
        actions={
          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <FileText aria-hidden="true" className="size-3.5" />
            Somente leitura
          </span>
        }
      />

      <main className="p-6 space-y-4">
        <div className="rounded-[--radius-md] border border-border bg-card overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="py-2.5 pl-4 pr-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground w-44">
                  Data/hora
                </th>
                <th className="py-2.5 px-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground w-36">
                  Utilizador
                </th>
                <th className="py-2.5 px-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground min-w-[9rem] max-w-[11rem]">
                  Ação
                </th>
                <th className="py-2.5 px-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Detalhe
                </th>
                <th className="py-2.5 pl-3 pr-4 text-[11px] font-medium uppercase tracking-wide text-muted-foreground w-36">
                  Contexto
                </th>
              </tr>
            </thead>
            <tbody>
              {auditLog.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 px-4 text-center text-sm text-muted-foreground">
                    Nenhum registo de auditoria ainda.
                  </td>
                </tr>
              ) : (
                auditLog.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors duration-[--duration-fast]"
                  >
                    <td className="py-2.5 pl-4 pr-3">
                      <span className="tabular text-xs text-muted-foreground font-mono">
                        {formatDateTimePtBR(entry.createdAt)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[9px] font-semibold text-secondary-foreground">
                          {entry.userInitials}
                        </div>
                        <span className="text-xs text-foreground truncate max-w-[9rem]" title={entry.userLabel}>
                          {entry.userLabel}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 align-top">
                      <Badge
                        variant={actionBadgeVariant(entry.actionKey)}
                        className="text-[10px] leading-snug max-w-[11rem] text-left whitespace-normal line-clamp-3"
                        title={entry.actionKey}
                      >
                        {entry.actionLabel}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 align-top">
                      <div className="space-y-1 max-w-xl">
                        <p className="text-xs text-foreground leading-snug">{entry.summary}</p>
                        {entry.change ? (
                          <p className="text-[11px] text-muted-foreground leading-snug">{entry.change}</p>
                        ) : null}
                        <p
                          className="text-[10px] text-muted-foreground/80 font-mono truncate"
                          title={entry.technicalRef}
                        >
                          {entry.technicalRef}
                        </p>
                      </div>
                    </td>
                    <td className="py-2.5 pl-3 pr-4 align-top">
                      <span className="text-xs text-muted-foreground leading-snug block max-w-[12rem]">
                        {entry.context}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="border-t border-border px-4 py-2.5 bg-muted/30">
            <p className="text-[11px] text-muted-foreground">
              {auditLog.length} registos · Horário em America/Manaus (BRT)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
