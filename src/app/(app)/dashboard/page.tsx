import type { Metadata } from "next";
import Link from "next/link";
import {
  Plus,
  TrendingUp,
  AlertCircle,
  Clock,
  Filter,
  Building2,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getDevelopmentsList } from "@/lib/services/developments-list";
import type { DevelopmentListItem } from "@/types/development-list";
import { getCurrentUser } from "@/lib/auth/get-session";
import { canEditStagesOrTasks } from "@/lib/domain/permissions";
import { NewDevelopmentDialog } from "@/components/developments/new-development-dialog";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Visão geral dos empreendimentos",
};

const MACRO_PHASES = [
  { label: "Aq. Terreno", color: "var(--color-chart-1)" },
  { label: "Incorporação", color: "var(--color-chart-2)" },
  { label: "Lançamento", color: "var(--color-chart-3)" },
  { label: "CEF", color: "var(--color-chart-4)" },
];

function DevelopmentCard({ dev }: { dev: DevelopmentListItem }) {
  const hasOverdue = dev.overdueCount > 0;

  return (
    <Link
      href={`/developments/${dev.slug}`}
      className={cn(
        "group block rounded-[--radius-md] border border-border bg-card p-4 space-y-3",
        "hover:border-primary/40 hover:shadow-sm",
        "transition-all duration-[--duration-base]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold text-foreground leading-tight truncate group-hover:text-primary transition-colors duration-[--duration-fast]">
            {dev.name}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Etapa atual: <span className="text-foreground/70">{dev.currentStage}</span>
          </p>
        </div>
        {hasOverdue && (
          <Badge variant="destructive" className="shrink-0 text-[10px] h-5">
            <AlertCircle aria-hidden="true" className="size-2.5" />
            {dev.overdueCount} vencida{dev.overdueCount > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Avanço</span>
          <span className="tabular text-[13px] font-semibold text-foreground">
            {dev.progress.toFixed(2)}%
          </span>
        </div>
        <Progress segments={dev.segments} className="h-2" />
        <div className="flex gap-2 flex-wrap">
          {dev.segments.filter((s) => s.value > 0).map((seg) => (
            <div key={seg.label} className="flex items-center gap-1">
              <div
                className="size-1.5 rounded-[1px] shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-[10px] text-muted-foreground">{seg.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock aria-hidden="true" className="size-3" />
            {dev.pendingCount} pendente{dev.pendingCount !== 1 ? "s" : ""}
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground/70">{dev.lastUpdate}</span>
      </div>
    </Link>
  );
}

export default async function DashboardPage() {
  const [developments, user] = await Promise.all([
    getDevelopmentsList(),
    getCurrentUser(),
  ]);
  const canCreateDevelopment = canEditStagesOrTasks(user);
  const portfolioUpdated = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Manaus",
  });

  const totalPending = developments.reduce((s, d) => s + d.pendingCount, 0);
  const totalOverdue = developments.reduce((s, d) => s + d.overdueCount, 0);
  const avgProgress =
    developments.length > 0
      ? developments.reduce((s, d) => s + d.progress, 0) / developments.length
      : 0;

  const sorted = [...developments].sort(
    (a, b) => b.overdueCount - a.overdueCount || b.progress - a.progress,
  );

  return (
    <div>
      <Topbar
        actions={
          canCreateDevelopment ? (
            <NewDevelopmentDialog triggerLabel="Novo empreendimento" triggerSize="sm" />
          ) : (
            <Button size="sm" variant="secondary" disabled title="Apenas editores ou administradores podem criar empreendimentos">
              <Plus aria-hidden="true" className="size-4 shrink-0" />
              Novo empreendimento
            </Button>
          )
        }
      />

      <main className="p-6 space-y-6">
        <div>
          <h1 className="text-lg font-bold text-foreground">Portfólio</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {developments.length} empreendimento{developments.length !== 1 ? "s" : ""} ·
            atualizado em {portfolioUpdated}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              icon: Building2,
              label: "Empreendimentos",
              value: String(developments.length),
              sub: "em acompanhamento",
              color: "text-primary",
              bg: "bg-primary/8",
            },
            {
              icon: TrendingUp,
              label: "Avanço médio",
              value: `${avgProgress.toFixed(1)}%`,
              sub: "do portfólio",
              color: "text-success",
              bg: "bg-success/8",
            },
            {
              icon: Clock,
              label: "Pendências",
              value: String(totalPending),
              sub: "tarefas abertas",
              color: "text-warning",
              bg: "bg-warning/8",
            },
            {
              icon: AlertCircle,
              label: "Vencidas",
              value: String(totalOverdue),
              sub: "ações em atraso",
              color: totalOverdue > 0 ? "text-destructive" : "text-muted-foreground",
              bg: totalOverdue > 0 ? "bg-destructive/8" : "bg-muted",
            },
          ].map(({ icon: Icon, label, value, sub, color, bg }) => (
            <div
              key={label}
              className="rounded-[--radius-md] border border-border bg-card p-4 space-y-2"
            >
              <div
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-[--radius]",
                  bg,
                )}
              >
                <Icon aria-hidden="true" className={cn("size-4", color)} strokeWidth={1.5} />
              </div>
              <div>
                <p className="tabular text-xl font-bold text-foreground leading-none">{value}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{label}</p>
                <p className="text-[10px] text-muted-foreground/70">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Empreendimentos</h2>
            <Button variant="ghost" size="sm" className="text-xs h-7">
              <Filter aria-hidden="true" className="size-3.5" />
              Filtrar
            </Button>
          </div>

          {sorted.length === 0 ? (
            <p className="text-sm text-muted-foreground rounded-[--radius-md] border border-dashed border-border p-8 text-center">
              Nenhum empreendimento ativo. Execute o seed ou crie um empreendimento.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {sorted.map((dev) => (
                <DevelopmentCard key={dev.id} dev={dev} />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border">
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Fases macro
          </span>
          {MACRO_PHASES.map((phase) => (
            <div key={phase.label} className="flex items-center gap-1.5">
              <div
                className="size-2 rounded-[1px]"
                style={{ backgroundColor: phase.color }}
              />
              <span className="text-[11px] text-muted-foreground">{phase.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
