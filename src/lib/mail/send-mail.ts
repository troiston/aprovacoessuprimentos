import nodemailer from "nodemailer";
import type { MailSmtpConfig } from "@/lib/settings/system-settings.service";
import { buildNodemailerTransportOptions } from "@/lib/mail/smtp-transport-config";

export function createTransportFromConfig(config: MailSmtpConfig) {
  return nodemailer.createTransport(buildNodemailerTransportOptions(config));
}

export async function sendMailWithConfig(
  config: MailSmtpConfig,
  options: { to: string; subject: string; text: string },
): Promise<void> {
  const transport = createTransportFromConfig(config);
  await transport.sendMail({
    from: config.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
  });
}
