import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/api/route-auth";
import { hashPassword } from "@/lib/auth/password";
import { db } from "@/lib/db";
import { sendMailWithConfig } from "@/lib/mail/send-mail";
import { loadMailSmtpDecrypted } from "@/lib/settings/system-settings.service";
import { inviteUserBodySchema } from "@/lib/validations/users";

function appOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL ?? process.env.BETTER_AUTH_URL ?? "";
  return raw.replace(/\/$/, "");
}

function generateTemporaryPassword(): string {
  return randomBytes(18).toString("base64url");
}

export async function GET() {
  const userOrRes = await requireAdminForApi();
  if (userOrRes instanceof NextResponse) {
    return userOrRes;
  }

  const users = await db.user.findMany({
    orderBy: { email: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      displayName: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const adminOrRes = await requireAdminForApi();
  if (adminOrRes instanceof NextResponse) {
    return adminOrRes;
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = inviteUserBodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Dados inválidos" },
      { status: 422 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const existing = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Já existe um utilizador com este e-mail." },
      { status: 409 },
    );
  }

  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(temporaryPassword);

  const created = await db.user.create({
    data: {
      email,
      name: parsed.data.name ?? null,
      role: parsed.data.role,
      passwordHash,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      name: true,
      displayName: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const origin = appOrigin();
  const loginUrl = origin ? `${origin}/login` : "/login";
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Aplicação";

  let mailSent = false;
  const smtp = await loadMailSmtpDecrypted();
  if (smtp) {
    try {
      await sendMailWithConfig(smtp, {
        to: email,
        subject: `Convite — ${appName}`,
        text: [
          `Foi criada uma conta para si em ${appName}.`,
          "",
          `Inicie sessão em: ${loginUrl}`,
          `E-mail: ${email}`,
          `Palavra-passe temporária: ${temporaryPassword}`,
          "",
          "Guarde esta mensagem num local seguro e altere a palavra-passe quando o produto o permitir.",
        ].join("\n"),
      });
      mailSent = true;
    } catch {
      mailSent = false;
    }
  }

  return NextResponse.json(
    {
      user: created,
      mailSent,
      ...(mailSent
        ? {}
        : {
            temporaryPassword,
            manualShareHint:
              "SMTP não enviou ou não está configurado. Partilhe a palavra-passe temporária por um canal seguro.",
          }),
    },
    { status: 201 },
  );
}
