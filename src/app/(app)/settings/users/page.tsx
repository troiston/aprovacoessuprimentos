import type { Metadata } from "next";
import { Topbar } from "@/components/layout/topbar";
import { UsersTable } from "@/components/settings/users-table";
import { getCurrentUser } from "@/lib/auth/get-session";
import { canManageUsers } from "@/lib/domain/permissions";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Utilizadores",
};

export default async function UsersPage() {
  const user = await getCurrentUser();
  if (!user || !canManageUsers(user)) {
    return (
      <div>
        <Topbar title="Utilizadores" description="Acesso restrito" />
        <main className="p-6">
          <p className="text-sm text-muted-foreground">
            Apenas administradores podem gerir utilizadores e perfis.
          </p>
        </main>
      </div>
    );
  }

  const rows = await db.user.findMany({
    orderBy: { email: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      displayName: true,
      role: true,
      isActive: true,
    },
  });

  return <UsersTable initialUsers={rows} />;
}
