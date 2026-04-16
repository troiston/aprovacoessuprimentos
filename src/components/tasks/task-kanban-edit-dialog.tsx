"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { TaskBoardItem } from "@/types/task-board";
import type { KanbanColumnDto } from "@/types/kanban-column";

type UserOption = { id: string; label: string };

type StageOption = { stageId: string; name: string };

const selectClass = cn(
  "select-app flex h-9 w-full rounded-[--radius] px-2 text-sm",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

function isoToDatetimeLocalValue(iso: string | null): string {
  if (!iso) {
    return "";
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return "";
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function datetimeLocalToIsoUtc(val: string): string | null {
  const t = val.trim();
  if (!t) {
    return null;
  }
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) {
    return null;
  }
  return d.toISOString();
}

type Props = {
  item: TaskBoardItem | null;
  users: UserOption[];
  onClose: () => void;
  canEdit?: boolean;
  showStagesCatalogLink?: boolean;
};

export function TaskKanbanEditDialog({
  item,
  users,
  onClose,
  canEdit = false,
  showStagesCatalogLink = false,
}: Props) {
  const router = useRouter();
  const open = item !== null;

  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [stageId, setStageId] = useState("");
  const [kanbanColumnId, setKanbanColumnId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [deadlineLocal, setDeadlineLocal] = useState("");
  const [stages, setStages] = useState<StageOption[]>([]);
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumnDto[]>([]);
  const [stagesError, setStagesError] = useState<string | null>(null);
  const [columnsError, setColumnsError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  useEffect(() => {
    if (!item) {
      return;
    }
    setDescription(item.description);
    setNotes(item.notes ?? "");
    setStageId(item.stageId);
    setKanbanColumnId(item.kanbanColumnId);
    setAssigneeId(item.assigneeId ?? "");
    setDeadlineLocal(isoToDatetimeLocalValue(item.deadlineIso));
    setStages([]);
    setKanbanColumns([]);
    setStagesError(null);
    setColumnsError(null);
    setSubmitError(null);
  }, [item]);

  useEffect(() => {
    if (!open) {
      return;
    }
    let cancelled = false;
    setColumnsError(null);
    void (async () => {
      try {
        const res = await fetch("/api/kanban-columns", { credentials: "same-origin" });
        const data: unknown = await res.json().catch(() => null);
        if (cancelled) {
          return;
        }
        if (!res.ok) {
          setColumnsError("Não foi possível carregar as colunas do quadro.");
          return;
        }
        if (!data || typeof data !== "object" || !("columns" in data)) {
          setColumnsError("Resposta inválida.");
          return;
        }
        const raw = (data as { columns: unknown }).columns;
        if (!Array.isArray(raw)) {
          setColumnsError("Lista de colunas inválida.");
          return;
        }
        const cols: KanbanColumnDto[] = [];
        for (const c of raw) {
          if (c && typeof c === "object" && "id" in c && "name" in c && "sortOrder" in c && "isTerminal" in c) {
            const o = c as Record<string, unknown>;
            if (
              typeof o.id === "string" &&
              typeof o.name === "string" &&
              typeof o.sortOrder === "number" &&
              typeof o.isTerminal === "boolean"
            ) {
              cols.push({
                id: o.id,
                name: o.name,
                sortOrder: o.sortOrder,
                isTerminal: o.isTerminal,
              });
            }
          }
        }
        cols.sort((a, b) => a.sortOrder - b.sortOrder);
        setKanbanColumns(cols);
      } catch {
        if (!cancelled) {
          setColumnsError("Erro de rede ao carregar colunas.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !item) {
      return;
    }
    let cancelled = false;
    setStagesError(null);
    void (async () => {
      try {
        const res = await fetch(
          `/api/developments/${encodeURIComponent(item.developmentSlug)}`,
          { credentials: "same-origin" },
        );
        const data: unknown = await res.json().catch(() => null);
        if (cancelled) {
          return;
        }
        if (!res.ok) {
          setStagesError("Não foi possível carregar as etapas deste empreendimento.");
          return;
        }
        if (!data || typeof data !== "object" || !("development" in data)) {
          setStagesError("Resposta inválida do servidor.");
          return;
        }
        const dev = (data as { development: unknown }).development;
        if (!dev || typeof dev !== "object" || !("stages" in dev)) {
          setStagesError("Dados do empreendimento incompletos.");
          return;
        }
        const rawStages = (dev as { stages: unknown }).stages;
        if (!Array.isArray(rawStages)) {
          setStagesError("Lista de etapas inválida.");
          return;
        }
        const opts: StageOption[] = [];
        for (const s of rawStages) {
          if (s && typeof s === "object" && "stageId" in s && "name" in s) {
            const o = s as { stageId: unknown; name: unknown };
            if (typeof o.stageId === "string" && typeof o.name === "string") {
              opts.push({ stageId: o.stageId, name: o.name });
            }
          }
        }
        setStages(opts);
      } catch {
        if (!cancelled) {
          setStagesError("Erro de rede ao carregar etapas.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, item]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!item) {
      return;
    }
    setSubmitError(null);
    setPending(true);
    try {
      const deadlinePayload =
        deadlineLocal.trim() === "" ? null : datetimeLocalToIsoUtc(deadlineLocal);
      const body: Record<string, unknown> = {
        description: description.trim(),
        notes: notes.trim() === "" ? null : notes.trim(),
        stageId,
        kanbanColumnId,
        assigneeId: assigneeId === "" ? null : assigneeId,
        deadline: deadlinePayload,
      };
      const res = await fetch(`/api/tasks/${encodeURIComponent(item.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Não foi possível guardar.";
        setSubmitError(msg);
        return;
      }
      onClose();
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!item || !canEdit) {
      return;
    }
    const ok = window.confirm(
      "Eliminar esta tarefa? Será removida das listas (arquivo). Esta ação não pode ser anulada aqui.",
    );
    if (!ok) {
      return;
    }
    setSubmitError(null);
    setDeletePending(true);
    try {
      const res = await fetch(`/api/tasks/${encodeURIComponent(item.id)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Não foi possível eliminar.";
        setSubmitError(msg);
        return;
      }
      onClose();
      router.refresh();
    } finally {
      setDeletePending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        {item ? (
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-0">
            <DialogHeader>
              <DialogTitle>Editar tarefa</DialogTitle>
              <DialogDescription>
                {item.development} — alterações aplicam-se após guardar. A coluna do quadro corresponde ao Kanban; a
                etapa do empreendimento é o pipeline do projeto.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-2 max-h-[70vh] overflow-y-auto pr-1">
              {submitError ? (
                <p className="text-sm text-destructive" role="alert">
                  {submitError}
                </p>
              ) : null}
              {columnsError ? (
                <p className="text-xs text-destructive" role="alert">
                  {columnsError}
                </p>
              ) : null}
              {stagesError ? (
                <p className="text-xs text-destructive" role="alert">
                  {stagesError}
                </p>
              ) : null}
              <div className="space-y-1.5">
                <Label htmlFor="kanban-edit-column">Coluna do quadro (Kanban)</Label>
                <select
                  id="kanban-edit-column"
                  className={selectClass}
                  value={kanbanColumnId}
                  onChange={(e) => setKanbanColumnId(e.target.value)}
                  required
                  disabled={pending || deletePending}
                >
                  {kanbanColumns.length === 0 ? (
                    <option value={item.kanbanColumnId}>{item.kanbanColumnName}</option>
                  ) : (
                    kanbanColumns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                        {c.isTerminal ? " (concluídas)" : ""}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kanban-edit-stage">Etapa do empreendimento (pipeline)</Label>
                <select
                  id="kanban-edit-stage"
                  className={selectClass}
                  value={stageId}
                  onChange={(e) => setStageId(e.target.value)}
                  required
                  disabled={pending || deletePending}
                >
                  {stages.length === 0 ? (
                    <option value={item.stageId}>{item.stage}</option>
                  ) : (
                    stages.map((s) => (
                      <option key={s.stageId} value={s.stageId}>
                        {s.name}
                      </option>
                    ))
                  )}
                </select>
                {showStagesCatalogLink ? (
                  <p className="text-[11px] text-muted-foreground">
                    <Link href="/settings/stages" className="text-primary underline-offset-2 hover:underline">
                      Gerir nomes do catálogo de etapas
                    </Link>{" "}
                    (administradores).
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kanban-edit-desc">Descrição</Label>
                <Textarea
                  id="kanban-edit-desc"
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={pending || deletePending}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kanban-edit-notes">Notas (opcional)</Label>
                <Textarea
                  id="kanban-edit-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={pending || deletePending}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kanban-edit-assignee">Responsável</Label>
                <select
                  id="kanban-edit-assignee"
                  className={selectClass}
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  disabled={pending || deletePending}
                >
                  <option value="">— Sem responsável</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kanban-edit-deadline">Prazo (opcional)</Label>
                <input
                  id="kanban-edit-deadline"
                  type="datetime-local"
                  className={selectClass}
                  value={deadlineLocal}
                  onChange={(e) => setDeadlineLocal(e.target.value)}
                  disabled={pending || deletePending}
                />
                <p className="text-[11px] text-muted-foreground">
                  Limpe o campo e guarde para remover o prazo.
                </p>
              </div>
              {canEdit ? (
                <div className="border-t border-border pt-3 mt-1">
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full sm:w-auto"
                    disabled={pending || deletePending}
                    onClick={() => void handleDelete()}
                  >
                    {deletePending ? "A eliminar…" : "Eliminar tarefa"}
                  </Button>
                </div>
              ) : null}
            </div>
            <DialogFooter className="gap-2 sm:gap-0 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={pending || deletePending}>
                Cancelar
              </Button>
              <Button type="submit" disabled={pending || deletePending}>
                {pending ? "A guardar…" : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
