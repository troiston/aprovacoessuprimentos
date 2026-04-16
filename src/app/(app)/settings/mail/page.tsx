import type { Metadata } from "next";
import { Topbar } from "@/components/layout/topbar";
import { getCurrentUser } from "@/lib/auth/get-session";
import { canManageUsers } from "@/lib/domain/permissions";
import { loadMailSmtpMasked } from "@/lib/settings/system-settings.service";
import { MailSettingsForm } from "@/components/settings/mail-settings-form";

export const metadata: Metadata = {
  title: "E-mail (SMTP)",
};

export default async function MailSettingsPage() {
  const user = await getCurrentUser();
  if (!user || !canManageUsers(user)) {
    return (
      <div>
        <Topbar title="E-mail (SMTP)" description="Acesso restrito" />
        <main className="p-6">
          <p className="text-sm text-muted-foreground">
            Apenas administradores podem configurar o envio de e-mail.
          </p>
        </main>
      </div>
    );
  }

  const initial = await loadMailSmtpMasked();
  const encryptionReady = Boolean(process.env.SETTINGS_ENCRYPTION_KEY);

  return (
    <div>
      <Topbar
        title="E-mail (SMTP)"
        description="Credenciais cifradas em repouso · envio via Nodemailer"
      />
      <main className="p-6">
        <MailSettingsForm initial={initial} encryptionReady={encryptionReady} />
      </main>
    </div>
  );
}
