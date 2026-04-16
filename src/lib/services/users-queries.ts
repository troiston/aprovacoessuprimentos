import { db } from "@/lib/db";

export type AssignableUserRow = {
  id: string;
  displayName: string | null;
  name: string | null;
  email: string;
};

export async function listAssignableUsers(): Promise<AssignableUserRow[]> {
  return db.user.findMany({
    where: { isActive: true },
    select: { id: true, displayName: true, name: true, email: true },
    orderBy: { email: "asc" },
  });
}

export function formatUserLabel(u: AssignableUserRow): string {
  return u.displayName ?? u.name ?? u.email;
}
