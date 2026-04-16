import { z } from "zod";

export const taskStatusSchema = z.enum(["OPEN", "IN_PROGRESS", "BLOCKED", "DONE"]);

export const createTaskBodySchema = z.object({
  developmentSlug: z.string().min(1),
  stageId: z.string().min(1),
  description: z.string().min(1).max(20000),
  assigneeId: z.string().optional().nullable(),
  deadline: z.union([z.string().datetime(), z.null()]).optional(),
  notes: z.string().max(20000).optional().nullable(),
  status: taskStatusSchema.optional(),
});

export const patchTaskBodySchema = z.object({
  description: z.string().min(1).max(20000).optional(),
  stageId: z.string().min(1).optional(),
  assigneeId: z.string().nullable().optional(),
  deadline: z.union([z.string().datetime(), z.null()]).optional(),
  notes: z.string().max(20000).nullable().optional(),
  status: taskStatusSchema.optional(),
});

export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;
export type PatchTaskBody = z.infer<typeof patchTaskBodySchema>;
