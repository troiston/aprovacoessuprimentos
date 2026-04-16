import { z } from "zod";

export const mailSmtpBodySchema = z.object({
  host: z.string().min(1).max(255),
  port: z.coerce.number().int().min(1).max(65535),
  secure: z.coerce.boolean(),
  /** Omitir vazio para manter o utilizador já guardado */
  user: z.string().max(320).optional(),
  /** Omitir para manter a senha já guardada */
  password: z.string().max(500).optional(),
  from: z.string().min(1).max(320),
});

export const mailTestBodySchema = z.object({
  to: z.string().email(),
});

export const mailSendBodySchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  text: z.string().min(1).max(50_000),
});

export type MailSmtpBody = z.infer<typeof mailSmtpBodySchema>;
