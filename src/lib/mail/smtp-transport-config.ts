import type { MailSmtpConfig } from "@/lib/settings/system-settings.service";

/** Tempo máximo para estabelecer ligação e cumprimentar o servidor SMTP. */
export const SMTP_CONNECTION_TIMEOUT_MS = 20_000;

/** Tempo máximo de inatividade no socket durante o envio. */
export const SMTP_SOCKET_TIMEOUT_MS = 35_000;

/**
 * Nodemailer: `secure: true` = TLS desde o primeiro byte (porta **465** / SMTPS).
 * Portas **587**, **2525** e **25** usam STARTTLS com `secure: false`.
 * Valores incorretos (ex.: 465 com `secure: false`) causam ligações que não progredem.
 */
export function effectiveSmtpSecureForPort(port: number, secureFromSettings: boolean): boolean {
  if (port === 465) {
    return true;
  }
  if (port === 587 || port === 2525 || port === 25) {
    return false;
  }
  return secureFromSettings;
}

/** Opções passadas a `nodemailer.createTransport` com timeouts e porta/secure corrigidos. */
export function buildNodemailerTransportOptions(config: MailSmtpConfig) {
  const port = config.port;
  const secure = effectiveSmtpSecureForPort(port, config.secure);
  return {
    host: config.host.trim(),
    port,
    secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
    connectionTimeout: SMTP_CONNECTION_TIMEOUT_MS,
    greetingTimeout: SMTP_CONNECTION_TIMEOUT_MS,
    socketTimeout: SMTP_SOCKET_TIMEOUT_MS,
  };
}
