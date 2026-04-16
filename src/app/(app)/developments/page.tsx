import type { Metadata } from "next";
import Link from "next/link";
import {
  Plus,
  Building2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getDevelopmentsList } from "@/lib/services/developments-list";
import {
  applyDevelopmentListQuery,
  parseDevelopmentFilter,
  parseDevelopmentSort,
} from "@/lib/developments/list-query";
import { getCurrentUser } from "@/lib/auth/get-session";
import { canEditStagesOrTasks } from "@/lib/domain/permissions";
import { NewDevelopmentDialog } from "@/components/developments/new-development-dialog";
import { DevelopmentArchiveDialog } from "@/components/developments/development-archive-dialog";

export const metadata: Metadata = {
  title: "Empreendimentos",
  description: "Lista de todos os empreendimentos",
};

function SegmentedProgress({
  segments,
  total = 100,
}: {
  segments: { value: number; label: string; color: string }[];
  total?: number;
}) {
  return (
    <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
      {segments.map((seg) =>
        seg.value > 0 ? (
          <div
            key={seg.label}
            title={`${seg.label}: ${seg.value.toFixed(1)}%`}
            style={{
              width: `${(seg.value / total) * 100}%`,
              backgroundColor: seg.color,
            }}
          />
        ) : null,
      )}
    </div>
  );
}

function StatusIcon({ overdueCount }: { overdueCount: number }) {
  if (overdueCount > 0) {
    return <AlertCircle className="h-4 w-4 text-destructive" />;
  }
  return <CheckCircle2 className="h-4 w-4 text-[oklch(0.65_0.18_145)]" />;
}

type PageProps = {
  searchParams: Promise<{ q?: string; sort?: string; filter?: string }>;
};

export default async function DevelopmentsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const sort = parseDevelopmentSort(sp.sort);
  const filter = parseDevelopmentFilter(sp.filter);

  const [allDevelopments, user] = await Promise.all([
    getDevelopmentsList(),
    getCurrentUser(),
  ]);

  const developments = applyDevelopmentListQuery(allDevelopments, { q, sort, filter });

  const canCreateDevelopment = canEditStagesOrTasks(user);
  const totalUnits = developments.reduce((s, d) => s + (d.units ?? 0), 0);
  const totalOverdue = developments.reduce((s, d) => s + d.overdueCount, 0);
  const avgProgress =
    developments.length > 0
      ? developments.reduce((s, d) => s + d.progress, 0) / developments.length
      : 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar title="Empreendimentos" />

      <main className="flex-1 space-y-6 p-6">
        {/* Resumo — reflecte a lista filtrada */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Empreendimentos (vista)",
              value: developments.length,
              icon: Building2,
              color: "text-primary",
            },
            {
              label: "Progresso médio",
              value: `${avgProgress.toFixed(1)}%`,
              icon: CheckCircle2,
              color: "text-[oklch(0.65_0.18_145)]",
            },
            {
              label: "Total de unidades",
              value:
                developments.some((d) => d.units != null)
                  ? totalUnits.toLocaleString("pt-BR")
                  : "—",
              icon: Clock,
              color: "text-muted-foreground",
            },
            {
              label: "Pendências vencidas",
              value: totalOverdue,
              icon: AlertCircle,
              color: totalOverdue > 0 ? "text-destructive" : "text-muted-foreground",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded border bg-card p-4 space-y-1">
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", color)} />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <p className="text-2xl font-bold tabular-nums">{value}</p>
            </div>
          ))}
        </div>

        <form
          className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end"
          method="get"
          action="/developments"
        >
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <label htmlFor="dev-search-q" className="sr-only">
              Buscar empreendimento
            </label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              id="dev-search-q"
              name="q"
              type="search"
              placeholder="Buscar por nome ou slug…"
              defaultValue={q}
              className="select-app flex h-9 w-full rounded-[--radius] pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-end">
            <div className="space-y-1">
              <label htmlFor="dev-filter" className="text-[11px] text-muted-foreground block">
                Filtro
              </label>
              <select
                id="dev-filter"
                name="filter"
                defaultValue={filter}
                className="select-app h-9 min-w-[10rem] rounded-[--radius] px-2 text-sm"
              >
                <option value="all">Todos</option>
                <option value="overdue">Com tarefas vencidas</option>
              </select>
            </div>
            <div className="space-y-1">
              <label htmlFor="dev-sort" className="text-[11px] text-muted-foreground block">
                Ordenar por
              </label>
              <select
                id="dev-sort"
                name="sort"
                defaultValue={sort}
                className="select-app h-9 min-w-[11rem] rounded-[--radius] px-2 text-sm"
              >
                <option value="name">Nome (A–Z)</option>
                <option value="progress">Progresso (maior)</option>
                <option value="pending">Pendências (mais)</option>
                <option value="updated">Atualizado (recente)</option>
              </select>
            </div>
            <Button type="submit" variant="secondary" size="sm" className="h-9">
              Aplicar
            </Button>
          </div>

          <div className="flex gap-2 lg:ml-auto lg:items-end">
            {canCreateDevelopment ? (
              <NewDevelopmentDialog />
            ) : (
              <Button
                size="sm"
                variant="secondary"
                disabled
                title="Apenas editores ou administradores podem criar empreendimentos"
              >
                <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
                Novo
              </Button>
            )}
          </div>
        </form>

        {(q || filter !== "all" || sort !== "name") && allDevelopments.length > 0 && (
          <p className="text-xs text-muted-foreground">
            A mostrar {developments.length} de {allDevelopments.length} empreendimentos ativos.
            {developments.length === 0 ? (
              <>
                {" "}
                <Link href="/developments" className="text-primary underline-offset-2 hover:underline">
                  Limpar filtros
                </Link>
              </>
            ) : null}
          </p>
        )}

        {/* Tabela */}
        <div className="rounded border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Empreendimento
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">
                  Etapa atual
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">
                  Unidades
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Progresso</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">
                  Pendências
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden xl:table-cell">
                  Atualizado
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {allDevelopments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    Nenhum empreendimento ativo. Execute o seed ou crie um empreendimento.
                  </td>
                </tr>
              ) : developments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    Nenhum resultado com os filtros atuais.{" "}
                    <Link href="/developments" className="text-primary underline-offset-2 hover:underline">
                      Limpar filtros
                    </Link>
                  </td>
                </tr>
              ) : (
                developments.map((dev) => (
                  <tr key={dev.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusIcon overdueCount={dev.overdueCount} />
                        <span className="font-medium">{dev.name}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge variant="outline" className="text-xs font-mono">
                        {dev.currentStage}
                      </Badge>
                    </td>

                    <td className="px-4 py-3 hidden lg:table-cell tabular-nums text-muted-foreground">
                      {dev.units ?? "—"}
                    </td>

                    <td className="px-4 py-3 min-w-[160px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-mono text-foreground">{dev.progress.toFixed(2)}%</span>
                        </div>
                        <SegmentedProgress segments={dev.segments} />
                      </div>
                    </td>

                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span className="tabular-nums text-muted-foreground">{dev.pendingCount} pend.</span>
                        {dev.overdueCount > 0 && (
                          <span className="inline-flex items-center rounded-full bg-destructive/10 px-1.5 py-0.5 text-xs font-medium text-destructive">
                            {dev.overdueCount} venc.
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 hidden xl:table-cell text-xs text-muted-foreground tabular-nums">
                      {dev.lastUpdate}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/developments/${dev.slug}`}>Ver</Link>
                        </Button>
                        {canCreateDevelopment ? (
                          <DevelopmentArchiveDialog
                            slug={dev.slug}
                            name={dev.name}
                            triggerVariant="ghost"
                            triggerSize="sm"
                            triggerLabel="Arquivar"
                            triggerClassName="text-destructive hover:text-destructive"
                          />
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Legenda das fases */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="font-medium">Fases:</span>
          {[
            { label: "Aq. Terreno", color: "var(--color-chart-1)" },
            { label: "Incorporação", color: "var(--color-chart-2)" },
            { label: "Lançamento", color: "var(--color-chart-3)" },
            { label: "CEF", color: "var(--color-chart-4)" },
          ].map((f) => (
            <span key={f.label} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: f.color }}
              />
              {f.label}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}
