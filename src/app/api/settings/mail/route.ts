import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/api/route-auth";
import {
  loadMailSmtpDecrypted,
  loadMailSmtpMasked,
  saveMailSmtpConfig,
} from "@/lib/settings/system-settings.service";
import { effectiveSmtpSecureForPort } from "@/lib/mail/smtp-transport-config";
import { mailSmtpBodySchema } from "@/lib/validations/mail-settings";

export async function GET() {
  const userOrRes = await requireAdminForApi();
  if (userOrRes instanceof NextResponse) {
    return userOrRes;
  }

  if (!process.env.SETTINGS_ENCRYPTION_KEY) {
    const masked = await loadMailSmtpMasked();
    return NextResponse.json({
      ...masked,
      encryptionReady: false,
    });
  }

  const masked = await loadMailSmtpMasked();
  return NextResponse.json({
    ...masked,
    encryptionReady: true,
  });
}

export async function PATCH(request: Request) {
  const userOrRes = await requireAdminForApi();
  if (userOrRes instanceof NextResponse) {
    return userOrRes;
  }
  const user = userOrRes;

  if (!process.env.SETTINGS_ENCRYPTION_KEY) {
    return NextResponse.json(
      { error: "Defina SETTINGS_ENCRYPTION_KEY no ambiente para guardar SMTP com segurança." },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = mailSmtpBodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Dados inválidos" },
      { status: 422 },
    );
  }

  const prev = await loadMailSmtpDecrypted();
  const userEffective =
    (parsed.data.user && parsed.data.user.trim().length > 0
      ? parsed.data.user.trim()
      : null) ?? prev?.user ?? "";

  if (!userEffective) {
    return NextResponse.json(
      { error: "Informe o utilizador SMTP." },
      { status: 422 },
    );
  }

  const password =
    parsed.data.password && parsed.data.password.length > 0
      ? parsed.data.password
      : (prev?.password ?? "");

  if (!password) {
    return NextResponse.json(
      { error: "Informe a senha SMTP ou guarde uma configuração existente primeiro." },
      { status: 422 },
    );
  }

  const port = parsed.data.port;
  const secure = effectiveSmtpSecureForPort(port, parsed.data.secure);

  await saveMailSmtpConfig(
    {
      host: parsed.data.host.trim(),
      port,
      secure,
      user: userEffective,
      password,
      from: parsed.data.from.trim(),
    },
    user.id,
  );

  const masked = await loadMailSmtpMasked();
  return NextResponse.json({ ok: true, settings: masked });
}
