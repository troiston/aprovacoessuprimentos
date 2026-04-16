"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const selectFieldClass = cn(
  "select-app flex h-9 w-full rounded-[--radius] px-3 text-sm",
  "transition-colors duration-[--duration-fast]",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

type StageOption = { stageId: string; name: string };

type UserOption = { id: string; label: string };

type Props = {
  developmentSlug: string;
  stages: StageOption[];
  users: UserOption[];
  triggerLabel?: string;
  triggerClassName?: string;
  size?: "default" | "sm";
  variant?: "default" | "outline";
};

export function DevelopmentNewTaskDialog({
  developmentSlug,
  stages,
  users,
  triggerLabel = "Nova tarefa",
  triggerClassName,
  size = "sm",
  variant = "default",
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [stageId, setStageId] = useState(stages[0]?.stageId ?? "");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [deadlineLocal, setDeadlineLocal] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!stageId || !description.trim()) {
      setError("Preencha etapa e descrição.");
      return;
    }
    setPending(true);
    try {
      const body: Record<string, unknown> = {
        developmentSlug,
        stageId,
        description: description.trim(),
        assigneeId: assigneeId || null,
        notes: notes.trim() || null,
      };
      if (deadlineLocal) {
        body.deadline = new Date(deadlineLocal).toISOString();
      }
      const res = await fetch("/api/tasks", {
        method: "POST",
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
            : "Não foi possível criar a tarefa";
        setError(msg);
        return;
      }
      setOpen(false);
      setDescription("");
      setAssigneeId("");
      setDeadlineLocal("");
      setNotes("");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  if (stages.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={size} variant={variant} className={triggerClassName}>
          <Plus aria-hidden="true" className="size-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-0">
          <DialogHeader>
            <DialogTitle>Nova tarefa</DialogTitle>
            <DialogDescription>
              A tarefa fica associada a uma etapa deste empreendimento. Opcionalmente defines responsável,
              prazo e notas.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="task-stage">Etapa</Label>
              <select
                id="task-stage"
                className={selectFieldClass}
                value={stageId}
                onChange={(e) => setStageId(e.target.value)}
                required
                disabled={pending}
              >
                {stages.map((s) => (
                  <option key={s.stageId} value={s.stageId}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-desc">Descrição</Label>
              <Textarea
                id="task-desc"
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o que deve ser feito"
                disabled={pending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-assignee">Responsável (opcional)</Label>
              <select
                id="task-assignee"
                className={selectFieldClass}
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                disabled={pending}
              >
                <option value="">—</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-deadline">Prazo (opcional)</Label>
              <Input
                id="task-deadline"
                type="datetime-local"
                value={deadlineLocal}
                onChange={(e) => setDeadlineLocal(e.target.value)}
                disabled={pending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-notes">Notas (opcional)</Label>
              <Textarea
                id="task-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contexto adicional para a equipa"
                disabled={pending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "A guardar…" : "Criar tarefa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
