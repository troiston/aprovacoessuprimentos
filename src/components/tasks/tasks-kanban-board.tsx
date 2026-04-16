"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TaskKanbanEditDialog } from "@/components/tasks/task-kanban-edit-dialog";
import { cn } from "@/lib/utils";
import type { TaskBoardItem } from "@/types/task-board";
import type { KanbanColumnDto } from "@/types/kanban-column";

type UserOption = { id: string; label: string };

function KanbanColumnDrop({
  columnId,
  label,
  itemCount,
  editMode,
  nameDraft,
  onNameChange,
  onNameCommit,
  onMoveLeft,
  onMoveRight,
  onDelete,
  canMoveLeft,
  canMoveRight,
  children,
}: {
  columnId: string;
  label: string;
  itemCount: number;
  editMode: boolean;
  nameDraft: string;
  onNameChange: (v: string) => void;
  onNameCommit: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onDelete: () => void;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[min(50vh,28rem)] flex-1 min-w-[200px] flex-col rounded-[--radius-md] border border-border bg-muted/20 p-2 transition-colors duration-[--duration-fast]",
        isOver && "border-primary/50 bg-primary/5",
      )}
    >
      <div className="mb-2 flex flex-col gap-1.5 px-1">
        {editMode ? (
          <div className="space-y-1">
            <Label className="sr-only" htmlFor={`col-name-${columnId}`}>
              Nome da coluna
            </Label>
            <Input
              id={`col-name-${columnId}`}
              value={nameDraft}
              onChange={(e) => onNameChange(e.target.value)}
              onBlur={() => onNameCommit()}
              className="h-8 text-xs font-semibold"
            />
            <div className="flex flex-wrap gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="size-8"
                aria-label="Mover coluna para a esquerda"
                disabled={!canMoveLeft}
                onClick={onMoveLeft}
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="size-8"
                aria-label="Mover coluna para a direita"
                disabled={!canMoveRight}
                onClick={onMoveRight}
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="size-8 text-destructive hover:text-destructive"
                aria-label="Remover coluna"
                onClick={onDelete}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground">{label}</h2>
            <span className="tabular text-[10px] text-muted-foreground">{itemCount}</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">{children}</div>
    </div>
  );
}

function KanbanCard({
  item,
  dragDisabled,
  canEdit,
  onEdit,
}: {
  item: TaskBoardItem;
  dragDisabled: boolean;
  canEdit: boolean;
  onEdit: (task: TaskBoardItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    disabled: dragDisabled,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-[--radius] border border-border bg-card p-2.5 shadow-sm",
        !dragDisabled && "cursor-grab active:cursor-grabbing touch-manipulation",
      )}
      {...(dragDisabled ? {} : { ...listeners, ...attributes })}
    >
      <div className="flex items-start justify-between gap-1.5">
        <p className="text-xs font-medium leading-snug text-foreground line-clamp-3 min-w-0 flex-1">
          {item.description}
        </p>
        {canEdit ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 size-7 -mt-0.5 -mr-1 text-muted-foreground hover:text-foreground"
            aria-label={`Editar tarefa: ${item.description.slice(0, 48)}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
          >
            <Pencil aria-hidden="true" className="size-3.5" />
          </Button>
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        <Badge variant="secondary" className="text-[9px] font-normal">
          <Link href={`/developments/${item.developmentSlug}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>
            {item.development}
          </Link>
        </Badge>
        <Badge variant="outline" className="text-[9px]">
          {item.stage}
        </Badge>
      </div>
      <p className="mt-1.5 text-[10px] text-muted-foreground">
        {item.assignee} · {item.deadlineLabel}
        {item.isOverdue ? <span className="text-destructive"> · vencida</span> : null}
      </p>
    </div>
  );
}

type Props = {
  items: TaskBoardItem[];
  canEdit: boolean;
  users?: UserOption[];
  showStagesCatalogLink?: boolean;
  columns: KanbanColumnDto[];
};

export function TasksKanbanBoard({
  items: initialItems,
  canEdit,
  users = [],
  showStagesCatalogLink = false,
  columns: columnsProp,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState(initialItems);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<TaskBoardItem | null>(null);
  const [editColumns, setEditColumns] = useState(false);
  const [localColumns, setLocalColumns] = useState<KanbanColumnDto[]>(() =>
    [...columnsProp].sort((a, b) => a.sortOrder - b.sortOrder),
  );
  const [nameDrafts, setNameDrafts] = useState<Record<string, string>>({});
  const [newColName, setNewColName] = useState("");
  const [colBusy, setColBusy] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    const sorted = [...columnsProp].sort((a, b) => a.sortOrder - b.sortOrder);
    setLocalColumns(sorted);
    setNameDrafts(Object.fromEntries(sorted.map((c) => [c.id, c.name])));
  }, [columnsProp]);

  const sortedCols = useMemo(
    () => [...localColumns].sort((a, b) => a.sortOrder - b.sortOrder),
    [localColumns],
  );

  const byColumn = useMemo(() => {
    const map = new Map<string, TaskBoardItem[]>();
    for (const c of sortedCols) {
      map.set(c.id, []);
    }
    for (const t of items) {
      const list = map.get(t.kanbanColumnId);
      if (list) {
        list.push(t);
      }
    }
    return map;
  }, [items, sortedCols]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const persistColumn = useCallback(
    async (taskId: string, kanbanColumnId: string) => {
      const res = await fetch(`/api/tasks/${encodeURIComponent(taskId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kanbanColumnId }),
      });
      if (!res.ok) {
        const data: unknown = await res.json().catch(() => null);
        const msg =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Não foi possível atualizar a coluna.";
        throw new Error(msg);
      }
    },
    [],
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over || !canEdit || editColumns) {
      return;
    }
    const taskId = String(active.id);
    const newColId = String(over.id);
    if (!sortedCols.some((c) => c.id === newColId)) {
      return;
    }
    const task = items.find((i) => i.id === taskId);
    if (!task || task.kanbanColumnId === newColId) {
      return;
    }
    const col = sortedCols.find((c) => c.id === newColId);
    const prev = items;
    setItems((list) =>
      list.map((i) =>
        i.id === taskId
          ? {
              ...i,
              kanbanColumnId: newColId,
              kanbanColumnName: col?.name ?? i.kanbanColumnName,
              isTerminalColumn: col?.isTerminal ?? i.isTerminalColumn,
            }
          : i,
      ),
    );
    startTransition(() => {
      void (async () => {
        try {
          await persistColumn(taskId, newColId);
          router.refresh();
        } catch {
          setItems(prev);
        }
      })();
    });
  }

  async function postReorder(orderedIds: string[]) {
    setColBusy(true);
    try {
      const res = await fetch("/api/kanban-columns/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Falha ao reordenar";
        window.alert(msg);
        return;
      }
      if (
        data &&
        typeof data === "object" &&
        "columns" in data &&
        Array.isArray((data as { columns: unknown }).columns)
      ) {
        const next = (data as { columns: KanbanColumnDto[] }).columns;
        setLocalColumns([...next].sort((a, b) => a.sortOrder - b.sortOrder));
        setNameDrafts(Object.fromEntries(next.map((c) => [c.id, c.name])));
      }
      router.refresh();
    } finally {
      setColBusy(false);
    }
  }

  function moveColumn(columnId: string, delta: -1 | 1) {
    const order = sortedCols.map((c) => c.id);
    const i = order.indexOf(columnId);
    const j = i + delta;
    if (i < 0 || j < 0 || j >= order.length) {
      return;
    }
    const next = [...order];
    const t = next[i];
    const u = next[j];
    if (t === undefined || u === undefined) {
      return;
    }
    next[i] = u;
    next[j] = t;
    void postReorder(next);
  }

  async function commitName(columnId: string) {
    const name = (nameDrafts[columnId] ?? "").trim();
    const orig = sortedCols.find((c) => c.id === columnId)?.name ?? "";
    if (!name || name === orig) {
      return;
    }
    setColBusy(true);
    try {
      const res = await fetch(`/api/kanban-columns/${encodeURIComponent(columnId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data: unknown = await res.json().catch(() => null);
        const msg =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Falha ao guardar nome";
        window.alert(msg);
        return;
      }
      setLocalColumns((prev) => prev.map((c) => (c.id === columnId ? { ...c, name } : c)));
      router.refresh();
    } finally {
      setColBusy(false);
    }
  }

  async function deleteColumn(column: KanbanColumnDto) {
    const ok = window.confirm(
      `Remover a coluna «${column.name}»? Só é permitido se não houver tarefas nesta coluna.`,
    );
    if (!ok) {
      return;
    }
    setColBusy(true);
    try {
      const res = await fetch(`/api/kanban-columns/${encodeURIComponent(column.id)}`, {
        method: "DELETE",
      });
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Não foi possível remover";
        window.alert(msg);
        return;
      }
      router.refresh();
    } finally {
      setColBusy(false);
    }
  }

  async function addColumn() {
    const name = newColName.trim() || "Nova coluna";
    setColBusy(true);
    try {
      const res = await fetch("/api/kanban-columns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data: unknown = await res.json().catch(() => null);
        const msg =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Falha ao criar coluna";
        window.alert(msg);
        return;
      }
      setNewColName("");
      router.refresh();
    } finally {
      setColBusy(false);
    }
  }

  const activeTask = activeId ? items.find((i) => i.id === activeId) : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <TaskKanbanEditDialog
        item={editItem}
        users={users}
        onClose={() => setEditItem(null)}
        canEdit={canEdit}
        showStagesCatalogLink={showStagesCatalogLink}
      />
      <div className="flex flex-col gap-2">
        {canEdit ? (
          <div className="flex flex-wrap items-end gap-2">
            <Button
              type="button"
              variant={editColumns ? "secondary" : "outline"}
              size="sm"
              className="h-8 text-xs"
              disabled={colBusy}
              onClick={() => setEditColumns((v) => !v)}
            >
              {editColumns ? "Fechar edição de colunas" : "Editar colunas do quadro"}
            </Button>
            {editColumns ? (
              <div className="flex flex-wrap items-end gap-2">
                <div className="space-y-1">
                  <Label htmlFor="new-kanban-col" className="text-[10px] text-muted-foreground">
                    Nova coluna
                  </Label>
                  <Input
                    id="new-kanban-col"
                    value={newColName}
                    onChange={(e) => setNewColName(e.target.value)}
                    placeholder="Nome"
                    className="h-8 w-40 text-xs"
                    disabled={colBusy}
                  />
                </div>
                <Button type="button" size="sm" className="h-8" disabled={colBusy} onClick={() => void addColumn()}>
                  <Plus className="size-4" aria-hidden="true" />
                  Adicionar
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
        {!canEdit && (
          <p className="text-xs text-muted-foreground">
            Vista só leitura: apenas editores ou administradores podem arrastar cartões.
          </p>
        )}
        {editColumns && canEdit ? (
          <p className="text-[11px] text-muted-foreground">
            Altere nomes, reordene com as setas ou remova colunas vazias. Uma coluna «concluída» (terminal) transfere-se
            automaticamente se remover a atual.
          </p>
        ) : null}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start" aria-busy={pending || colBusy}>
          {sortedCols.map((col, idx) => {
            const colItems = byColumn.get(col.id) ?? [];
            return (
              <KanbanColumnDrop
                key={col.id}
                columnId={col.id}
                label={col.name}
                itemCount={colItems.length}
                editMode={editColumns && canEdit}
                nameDraft={nameDrafts[col.id] ?? col.name}
                onNameChange={(v) => setNameDrafts((d) => ({ ...d, [col.id]: v }))}
                onNameCommit={() => void commitName(col.id)}
                onMoveLeft={() => moveColumn(col.id, -1)}
                onMoveRight={() => moveColumn(col.id, 1)}
                onDelete={() => void deleteColumn(col)}
                canMoveLeft={idx > 0}
                canMoveRight={idx < sortedCols.length - 1}
              >
                {colItems.map((item) => (
                  <KanbanCard
                    key={item.id}
                    item={item}
                    dragDisabled={!canEdit || editColumns}
                    canEdit={canEdit}
                    onEdit={setEditItem}
                  />
                ))}
              </KanbanColumnDrop>
            );
          })}
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="rounded-[--radius] border border-primary/30 bg-card p-2.5 shadow-lg">
            <p className="text-xs font-medium text-foreground">{activeTask.description}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">{activeTask.kanbanColumnName}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
