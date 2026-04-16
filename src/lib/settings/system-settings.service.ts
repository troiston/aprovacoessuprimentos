import { db } from "@/lib/db";
import {
  decryptSecret,
  encryptSecret,
  parseSettingsEncryptionKey,
} from "@/lib/crypto/settings-encryption";
import { AuditEntity } from "@/lib/audit/constants";
import { appendAuditLog } from "@/lib/audit/audit-log.service";
export const MAIL_SMTP_SETTINGS_KEY = "mail.smtp.v1";

export type MailSmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
};

export type MailSmtpMasked = {
  configured: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  from: string;
  passwordSet: boolean;
};

function emptyMasked(): MailSmtpMasked {
  return {
    configured: false,
    host: "",
    port: 587,
    secure: false,
    user: "",
    from: "",
    passwordSet: false,
  };
}

function getKeyFromEnv(): Buffer {
  const raw = process.env.SETTINGS_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error("SETTINGS_ENCRYPTION_KEY não configurada");
  }
  return parseSettingsEncryptionKey(raw);
}

function maskUser(user: string): string {
  const at = user.indexOf("@");
  if (at <= 1) {
    return "•••";
  }
  return `${user.slice(0, 2)}•••@${user.slice(at + 1)}`;
}

export async function loadMailSmtpMasked(): Promise<MailSmtpMasked> {
  const row = await db.systemSetting.findUnique({
    where: { key: MAIL_SMTP_SETTINGS_KEY },
  });
  if (!row) {
    return emptyMasked();
  }
  if (!process.env.SETTINGS_ENCRYPTION_KEY) {
    const masked = row.valueMasked as MailSmtpMasked | null;
    if (masked && typeof masked === "object" && "host" in masked) {
      return { ...masked, configured: true };
    }
    return {
      configured: true,
      host: "",
      port: 587,
      secure: false,
      user: "",
      from: "",
      passwordSet: true,
    };
  }
  try {
    const key = getKeyFromEnv();
    const parsed = JSON.parse(decryptSecret(row.valueEncrypted, key)) as MailSmtpConfig;
    return {
      configured: true,
      host: parsed.host,
      port: parsed.port,
      secure: parsed.secure,
      user: maskUser(parsed.user),
      from: parsed.from,
      passwordSet: parsed.password.length > 0,
    };
  } catch {
    return {
      configured: true,
      host: "",
      port: 587,
      secure: false,
      user: "",
      from: "",
      passwordSet: true,
    };
  }
}

export async function loadMailSmtpDecrypted(): Promise<MailSmtpConfig | null> {
  if (!process.env.SETTINGS_ENCRYPTION_KEY) {
    return null;
  }
  const row = await db.systemSetting.findUnique({
    where: { key: MAIL_SMTP_SETTINGS_KEY },
  });
  if (!row) {
    return null;
  }
  const key = getKeyFromEnv();
  return JSON.parse(decryptSecret(row.valueEncrypted, key)) as MailSmtpConfig;
}

export async function saveMailSmtpConfig(next: MailSmtpConfig, userId: string): Promise<void> {
  const key = getKeyFromEnv();
  const encrypted = encryptSecret(JSON.stringify(next), key);
  const masked: MailSmtpMasked = {
    configured: true,
    host: next.host,
    port: next.port,
    secure: next.secure,
    user: maskUser(next.user),
    from: next.from,
    passwordSet: next.password.length > 0,
  };

  await db.$transaction(async (tx) => {
    const existing = await tx.systemSetting.findUnique({
      where: { key: MAIL_SMTP_SETTINGS_KEY },
    });

    await tx.systemSetting.upsert({
      where: { key: MAIL_SMTP_SETTINGS_KEY },
      create: {
        key: MAIL_SMTP_SETTINGS_KEY,
        valueEncrypted: encrypted,
        valueMasked: masked,
        updatedById: userId,
      },
      update: {
        valueEncrypted: encrypted,
        valueMasked: masked,
        updatedById: userId,
      },
    });

    await appendAuditLog(
      {
        userId,
        entity: AuditEntity.SystemSetting,
        entityId: MAIL_SMTP_SETTINGS_KEY,
        action: existing ? "settings.mail.update" : "settings.mail.create",
        metadata: { keys: ["host", "port", "secure", "user", "from", "password"] },
      },
      tx,
    );
  });
}
