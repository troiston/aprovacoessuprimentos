import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  MinusCircle,
  AlertCircle,
  User2,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";
import { getDevelopmentDetailBySlug } from "@/lib/services/development-detail";
import type { DevelopmentDetailTaskRow } from "@/types/development-detail";
import { getCurrentUser } from "@/lib/auth/get-session";
import { canEditStagesOrTasks } from "@/lib/domain/permissions";
import { listAssignableUsers, formatUserLabel } from "@/lib/services/users-queries";
import { DevelopmentStagesTable } from "@/components/developments/development-stages-table";
import { DevelopmentNewTaskDialog } from "@/components/developments/development-new-task-dialog";
import { DevelopmentArchiveDialog } from "@/components/developments/development-archive-dialog";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: slug } = await params;
  const row = await db.development.findFirst({
    where: { slug, deletedAt: null },
    select: { name: true },
  });
  if (!row) {
    return { title: "Empreendimento" };
  }
  return {
    title: `${row.name} — Painel`,
    description: `Painel de acompanhamento · ${row.name}`,
  };
}

function TaskRow({ task }: { task: DevelopmentDetailTaskRow }) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors duration-[--duration-fast]">
      <td className="py-2.5 pl-4 pr-3">
        <Badge variant="secondary" className="text-[10px] whitespace-nowrap">
          {task.stageName}
        </Badge>
      </td>
      <td className="py-2.5 px-3">
        <div>
          <p className="text-sm text-foreground leading-tight">{task.description}</p>
          {task.notes && (
            <p className="text-[11px] text-muted-foreground mt-0.5 italic">{task.notes}</p>
          )}
        </div>
      </td>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-1.5">
          <User2 aria-hidden="true" className="size-3 text-muted-foreground shrink-0" />
          <span className="text-xs text-foreground">{task.assigneeLabel}</span>
        </div>
      </td>
      <td className="py-2.5 pl-3 pr-4">
        <div className="flex items-center gap-1.5">
          {task.isOverdue && (
            <AlertCircle aria-label="Prazo vencido" className="size-3 text-destructive shrink-0" />
          )}
          <span
            className={cn(
              "tabular text-xs",
              task.isOverdue ? "deadline-overdue" : "text-foreground",
            )}
          >
            {task.deadlineLabel}
          </span>
        </div>
      </td>
    </tr>
  );
}

export default async function DevelopmentDetailPage({ params }: PageProps) {
  const { id: slug } = await params;
  const dev = await getDevelopmentDetailBySlug(slug);
  if (!dev) {
    notFound();
  }

  const user = await getCurrentUser();
  const canEdit = canEditStagesOrTasks(user);
  const assignable = await listAssignableUsers();
  const usersForTask = assignable.map((u) => ({
    id: u.id,
    label: formatUserLabel(u),
  }));
  const stageOptions = dev.stages.map((s) => ({ stageId: s.stageId, name: s.name }));

  const completed = dev.stages.filter((s) => s.status === "COMPLETED").length;
  const inProgress = dev.stages.filter((s) => s.status === "IN_PROGRESS").length;
  const notStarted = dev.stages.filter((s) => s.status === "NOT_STARTED").length;

  return (
    <div>
      <Topbar
        title={dev.name}
        description="Painel de acompanhamento · 22 etapas · 4 fases macro"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft aria-hidden="true" className="size-4" />
                Voltar
              </Link>
            </Button>
            {canEdit && (
              <DevelopmentNewTaskDialog
                developmentSlug={dev.slug}
                stages={stageOptions}
                users={usersForTask}
                triggerLabel="Nova tarefa"
              />
            )}
            {canEdit && (
              <DevelopmentArchiveDialog slug={dev.slug} name={dev.name} triggerVariant="outline" />
            )}
          </div>
        }
      />

      <main className="p-6 space-y-6">
        <div className="rounded-[--radius-md] border border-border bg-card p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
                Avanço geral
              </p>
              <p className="tabular text-3xl font-bold text-foreground leading-none">
                {dev.progress.toFixed(2)}%
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { icon: CheckCircle2, label: "Finalizadas", value: completed, color: "text-success" },
                { icon: MinusCircle, label: "Em andamento", value: inProgress, color: "text-warning" },
                { icon: Circle, label: "Não iniciadas", value: notStarted, color: "text-muted-foreground" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="space-y-0.5">
                  <Icon aria-hidden="true" className={cn("size-5 mx-auto", color)} strokeWidth={1.5} />
                  <p className={cn("tabular text-lg font-bold", color)}>{value}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Progress segments={dev.segments} className="h-3" />
            <div className="flex gap-4 flex-wrap">
              {dev.segments.map((seg) => (
                <div key={seg.label} className="flex items-center gap-1.5">
                  <div
                    className="size-2 rounded-[1px] shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-[10px] text-muted-foreground">{seg.label}</span>
                  <span className="tabular text-[10px] font-medium text-foreground">
                    {seg.value.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {dev.overdueCount > 0 && (
            <div className="flex items-center gap-2 rounded-[--radius] border border-destructive/20 bg-destructive/5 px-3 py-2">
              <AlertCircle aria-hidden="true" className="size-4 text-destructive shrink-0" />
              <p className="text-xs text-destructive font-medium">
                {dev.overdueCount} ações com prazo vencido — revisão urgente
              </p>
            </div>
          )}
        </div>

        <Tabs defaultValue="stages">
          <TabsList>
            <TabsTrigger value="stages">Etapas ({dev.stages.length})</TabsTrigger>
            <TabsTrigger value="tasks">
              Tarefas ({dev.tasks.length})
              {dev.overdueCount > 0 && (
                <Badge variant="destructive" className="ml-1.5 text-[9px] px-1 py-0 h-4">
                  {dev.overdueCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stages">
            <DevelopmentStagesTable
              slug={dev.slug}
              stages={dev.stages}
              initialProgress={dev.progress}
              readOnly={!canEdit}
            />
          </TabsContent>

          <TabsContent value="tasks">
            <div className="rounded-[--radius-md] border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <p className="text-xs font-medium text-foreground">
                  {dev.tasks.length === 0
                    ? "Nenhuma tarefa aberta"
                    : `${dev.tasks.length} ${dev.tasks.length === 1 ? "tarefa aberta" : "tarefas abertas"}`}
                </p>
                {canEdit && (
                  <DevelopmentNewTaskDialog
                    developmentSlug={dev.slug}
                    stages={stageOptions}
                    users={usersForTask}
                    triggerLabel="Adicionar"
                    variant="outline"
                    triggerClassName="h-7 text-xs"
                  />
                )}
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="py-2.5 pl-4 pr-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground w-28">
                      Etapa
                    </th>
                    <th className="py-2.5 px-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Ação
                    </th>
                    <th className="py-2.5 px-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground w-28">
                      Responsável
                    </th>
                    <th className="py-2.5 pl-3 pr-4 text-[11px] font-medium uppercase tracking-wide text-muted-foreground w-28">
                      Prazo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dev.tasks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-10 px-4 text-center text-sm text-muted-foreground"
                      >
                        Nenhuma tarefa aberta. Crie tarefas para acompanhar ações neste empreendimento.
                      </td>
                    </tr>
                  ) : (
                    dev.tasks.map((task) => <TaskRow key={task.id} task={task} />)
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
