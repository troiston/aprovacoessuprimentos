import { z } from "zod";

export const patchUserBodySchema = z
  .object({
    role: z.enum(["ADMIN", "EDITOR", "VIEWER"]).optional(),
    isActive: z.boolean().optional(),
    displayName: z.string().max(120).nullable().optional(),
  })
  .refine(
    (o) => o.role !== undefined || o.isActive !== undefined || o.displayName !== undefined,
    { message: "Indique pelo menos um campo a atualizar" },
  );

export type PatchUserBody = z.infer<typeof patchUserBodySchema>;

export const inviteUserBodySchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  name: z
    .string()
    .trim()
    .max(120, "Nome demasiado longo")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"]).default("VIEWER"),
});

export type InviteUserBody = z.infer<typeof inviteUserBodySchema>;
