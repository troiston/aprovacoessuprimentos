import type { Metadata } from "next";
import { Topbar } from "@/components/layout/topbar";
import { StagesCatalogEditor } from "@/components/settings/stages-catalog-editor";
import { getCurrentUser } from "@/lib/auth/get-session";
import { canManageUsers } from "@/lib/domain/permissions";
import { getStagesCatalogPayload } from "@/lib/services/stage-catalog";

export const metadata: Metadata = {
  title: "Etapas e pesos",
};

export default async function StagesSettingsPage() {
  const user = await getCurrentUser();
  if (!user || !canManageUsers(user)) {
    return (
      <div>
        <Topbar title="Etapas e pesos" description="Acesso restrito" />
        <main className="p-6">
          <p className="text-sm text-muted-foreground">
            Apenas administradores podem editar o catálogo global de etapas e pesos.
          </p>
        </main>
      </div>
    );
  }

  const catalog = await getStagesCatalogPayload();
  return <StagesCatalogEditor initial={catalog} />;
}
