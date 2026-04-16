import { z } from "zod";

export const stageStatusSchema = z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]);

export const patchDevelopmentStageBodySchema = z.object({
  stageId: z.string().min(1, "stageId é obrigatório"),
  status: stageStatusSchema,
});

export type PatchDevelopmentStageBody = z.infer<typeof patchDevelopmentStageBodySchema>;
