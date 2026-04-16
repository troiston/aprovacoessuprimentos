import type { UserRole } from "@/generated/prisma/enums";
import type { User } from "@/generated/prisma/client";

const RANK: Record<UserRole, number> = {
  VIEWER: 0,
  EDITOR: 1,
  ADMIN: 2,
};

export function hasRole(user: User | null, minimum: UserRole): boolean {
  if (!user?.isActive) {
    return false;
  }
  return RANK[user.role] >= RANK[minimum];
}

export function canEditStagesOrTasks(user: User | null): boolean {
  return hasRole(user, "EDITOR");
}

export function canManageUsers(user: User | null): boolean {
  return hasRole(user, "ADMIN");
}
