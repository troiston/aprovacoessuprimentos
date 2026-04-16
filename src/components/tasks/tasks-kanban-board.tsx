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
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskKanbanEditDialog } from "@/components/tasks/task-kanban-edit-dialog";
import { cn } from "@/lib/utils";
import type { TaskBoardItem } from "@/types/task-board";
import type { TaskStatus } from "@/generated/prisma/enums";

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "OPEN", label: "Abertas" },
  { status: "IN_PROGRESS", label: "Em progresso" },
  { status: "BLOCKED", label: "Bloqueadas" },
  { status: "DONE", label: "Concluídas" },
];

function statusLabel(status: TaskStatus): string {
  return COLUMNS.find((c) => c.status === status)?.label ?? status;
}

function KanbanColumn({
  status,
  label,
  itemCount,
  children,
}: {
  status: TaskStatus;
  label: string;
  itemCount: number;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[min(50vh,28rem)] flex-1 min-w-[200px] flex-col rounded-[--radius-md] border border-border bg-muted/20 p-2 transition-colors duration-[--duration-fast]",
        isOver && "border-primary/50 bg-primary/5",
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2 px-1">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground">{label}</h2>
        <span className="tabular text-[10px] text-muted-foreground">{itemCount}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">{children}</div>
    </div>
  );
}

type UserOption = { id: string; label: string };

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
};

export function TasksKanbanBoard({ items: initialItems, canEdit, users = [] }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState(initialItems);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<TaskBoardItem | null>(null);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const byStatus = useMemo(() => {
    const map = new Map<TaskStatus, TaskBoardItem[]>();
    for (const c of COLUMNS) {
      map.set(c.status, []);
    }
    for (const t of items) {
      const list = map.get(t.status);
      if (list) {
        list.push(t);
      }
    }
    return map;
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const persistStatus = useCallback(
    async (taskId: string, status: TaskStatus) => {
      const res = await fetch(`/api/tasks/${encodeURIComponent(taskId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data: unknown = await res.json().catch(() => null);
        const msg =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Não foi possível atualizar o estado.";
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
    if (!over || !canEdit) {
      return;
    }
    const taskId = String(active.id);
    const newStatus = over.id as TaskStatus;
    if (!COLUMNS.some((c) => c.status === newStatus)) {
      return;
    }
    const task = items.find((i) => i.id === taskId);
    if (!task || task.status === newStatus) {
      return;
    }
    const prev = items;
    setItems((list) => list.map((i) => (i.id === taskId ? { ...i, status: newStatus } : i)));
    startTransition(() => {
      void (async () => {
        try {
          await persistStatus(taskId, newStatus);
          router.refresh();
        } catch {
          setItems(prev);
        }
      })();
    });
  }

  const activeTask = activeId ? items.find((i) => i.id === activeId) : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <TaskKanbanEditDialog item={editItem} users={users} onClose={() => setEditItem(null)} />
      <div className="flex flex-col gap-2">
        {!canEdit && (
          <p className="text-xs text-muted-foreground">
            Vista só leitura: apenas editores ou administradores podem arrastar cartões.
          </p>
        )}
        <div
          className="flex flex-col gap-3 lg:flex-row lg:items-start"
          aria-busy={pending}
        >
          {COLUMNS.map((col) => {
            const colItems = byStatus.get(col.status) ?? [];
            return (
              <KanbanColumn
                key={col.status}
                status={col.status}
                label={col.label}
                itemCount={colItems.length}
              >
                {colItems.map((item) => (
                  <KanbanCard
                    key={item.id}
                    item={item}
                    dragDisabled={!canEdit}
                    canEdit={canEdit}
                    onEdit={setEditItem}
                  />
                ))}
              </KanbanColumn>
            );
          })}
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="rounded-[--radius] border border-primary/30 bg-card p-2.5 shadow-lg">
            <p className="text-xs font-medium text-foreground">{activeTask.description}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">{statusLabel(activeTask.status)}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
