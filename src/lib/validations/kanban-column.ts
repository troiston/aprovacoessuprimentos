import { z } from "zod";

export const createKanbanColumnBodySchema = z.object({
  name: z.string().trim().min(1).max(80),
});

export const patchKanbanColumnBodySchema = z.object({
  name: z.string().trim().min(1).max(80),
});

export const reorderKanbanColumnsBodySchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1),
});

export type CreateKanbanColumnBody = z.infer<typeof createKanbanColumnBodySchema>;
export type PatchKanbanColumnBody = z.infer<typeof patchKanbanColumnBodySchema>;
export type ReorderKanbanColumnsBody = z.infer<typeof reorderKanbanColumnsBodySchema>;
