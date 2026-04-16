import type { TaskBoardItem } from "@/types/task-board";

const NON_TERMINAL_STYLES = [
  "bg-warning/15 text-foreground border-warning/25",
  "bg-primary/12 text-foreground border-primary/25",
  "bg-destructive/12 text-destructive border-destructive/25",
] as const;

const TERMINAL_STYLE =
  "bg-success/12 text-foreground border-success/25 line-through opacity-80";

function hashPick(id: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h + id.charCodeAt(i) * (i + 1)) % 997;
  }
  return Math.abs(h) % mod;
}

/** Estilo de cartão no calendário a partir da coluna Kanban (sem enum fixo). */
export function taskCalendarRowClass(item: TaskBoardItem): string {
  if (item.isTerminalColumn) {
    return TERMINAL_STYLE;
  }
  return NON_TERMINAL_STYLES[hashPick(item.kanbanColumnId, NON_TERMINAL_STYLES.length)] ?? NON_TERMINAL_STYLES[0];
}

export function taskCalendarOverdueRing(item: TaskBoardItem): boolean {
  return item.isOverdue && !item.isTerminalColumn;
}
