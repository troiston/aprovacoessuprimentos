import type { DevelopmentListItem } from "@/types/development-list";

export type DevelopmentListSortKey = "name" | "progress" | "pending" | "updated";

export type DevelopmentListFilterKey = "all" | "overdue";

export function parseDevelopmentSort(raw: string | undefined): DevelopmentListSortKey {
  if (raw === "progress" || raw === "pending" || raw === "updated") {
    return raw;
  }
  return "name";
}

export function parseDevelopmentFilter(raw: string | undefined): DevelopmentListFilterKey {
  if (raw === "overdue") {
    return "overdue";
  }
  return "all";
}

function matchesQuery(item: DevelopmentListItem, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) {
    return true;
  }
  return (
    item.name.toLowerCase().includes(needle) ||
    item.slug.toLowerCase().includes(needle) ||
    (item.city?.toLowerCase().includes(needle) ?? false)
  );
}

function compareBySort(
  a: DevelopmentListItem,
  b: DevelopmentListItem,
  sort: DevelopmentListSortKey,
): number {
  switch (sort) {
    case "progress":
      return b.progress - a.progress;
    case "pending":
      return b.pendingCount - a.pendingCount;
    case "updated":
      return b.updatedAtMs - a.updatedAtMs;
    case "name":
    default:
      return a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" });
  }
}

/**
 * Aplica busca textual, filtro e ordenação à lista já carregada do servidor.
 */
export function applyDevelopmentListQuery(
  items: DevelopmentListItem[],
  options: { q: string; sort: DevelopmentListSortKey; filter: DevelopmentListFilterKey },
): DevelopmentListItem[] {
  let list = [...items];
  if (options.filter === "overdue") {
    list = list.filter((d) => d.overdueCount > 0);
  }
  list = list.filter((d) => matchesQuery(d, options.q));
  list.sort((a, b) => compareBySort(a, b, options.sort));
  return list;
}
