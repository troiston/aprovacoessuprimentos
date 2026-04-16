import { z } from "zod";

export const createDevelopmentBodySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(200),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: apenas minúsculas, números e hífens")
    .optional(),
  code: z.string().max(50).optional().nullable(),
});

export const patchDevelopmentBodySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  code: z.string().max(50).optional().nullable(),
  isActive: z.boolean().optional(),
});

export type CreateDevelopmentBody = z.infer<typeof createDevelopmentBodySchema>;
export type PatchDevelopmentBody = z.infer<typeof patchDevelopmentBodySchema>;
