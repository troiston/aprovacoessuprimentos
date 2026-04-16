import Link from "next/link";
import { cn } from "@/lib/utils";
import type { TaskViewId } from "@/types/task-board";

const VIEWS: { id: TaskViewId; label: string }[] = [
  { id: "list", label: "Lista" },
  { id: "kanban", label: "Kanban" },
  { id: "calendar", label: "Calendário" },
  { id: "gantt", label: "Linha do tempo" },
];

function buildHref(pathname: string, view: TaskViewId, query: Record<string, string | undefined>): string {
  const q = new URLSearchParams();
  if (query.dev && query.dev !== "all") {
    q.set("dev", query.dev);
  }
  if (query.column && query.column !== "all") {
    q.set("column", query.column);
  }
  if (view !== "list") {
    q.set("view", view);
  }
  const s = q.toString();
  return s ? `${pathname}?${s}` : pathname;
}

type Props = {
  pathname: "/tasks" | "/tasks/all";
  current: TaskViewId;
  query: Record<string, string | undefined>;
};

export function TaskViewNav({ pathname, current, query }: Props) {
  return (
    <nav
      className="flex flex-wrap gap-1 rounded-[--radius] border border-border bg-muted/30 p-1"
      aria-label="Tipo de vista"
    >
      {VIEWS.map((v) => {
        const active = current === v.id;
        return (
          <Link
            key={v.id}
            href={buildHref(pathname, v.id, query)}
            className={cn(
              "rounded-[--radius-sm] px-3 py-1.5 text-xs font-medium transition-colors duration-[--duration-fast]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              active ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            {v.label}
          </Link>
        );
      })}
    </nav>
  );
}
