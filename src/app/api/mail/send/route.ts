import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/api/route-auth";
import {
  loadMailSmtpDecrypted,
  MAIL_SMTP_SETTINGS_KEY,
} from "@/lib/settings/system-settings.service";
import { formatSmtpError } from "@/lib/mail/format-smtp-error";
import { sendMailWithConfig } from "@/lib/mail/send-mail";
import { mailSendBodySchema } from "@/lib/validations/mail-settings";
import { appendAuditLog } from "@/lib/audit/audit-log.service";
import { AuditEntity } from "@/lib/audit/constants";

export async function POST(request: Request) {
  const userOrRes = await requireAdminForApi();
  if (userOrRes instanceof NextResponse) {
    return userOrRes;
  }
  const user = userOrRes;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = mailSendBodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Dados inválidos" },
      { status: 422 },
    );
  }

  const config = await loadMailSmtpDecrypted();
  if (!config) {
    return NextResponse.json(
      { error: "Configure o SMTP em Configurações antes de enviar." },
      { status: 422 },
    );
  }

  try {
    await sendMailWithConfig(config, {
      to: parsed.data.to,
      subject: parsed.data.subject,
      text: parsed.data.text,
    });
  } catch (e) {
    return NextResponse.json({ error: formatSmtpError(e) }, { status: 502 });
  }

  await appendAuditLog({
    userId: user.id,
    entity: AuditEntity.SystemSetting,
    entityId: MAIL_SMTP_SETTINGS_KEY,
    action: "mail.send",
    metadata: { to: parsed.data.to, subject: parsed.data.subject },
  });

  return NextResponse.json({ ok: true });
}
