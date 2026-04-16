import { z } from "zod";

export const stageScorePatchSchema = z.object({
  id: z.string().min(1),
  impactScore: z.number().int().min(1).max(5),
  dependencyScore: z.number().int().min(1).max(5),
  timeScore: z.number().int().min(1).max(5),
  effortScore: z.number().int().min(1).max(5),
});

export const patchStagesCatalogBodySchema = z.object({
  stages: z.array(stageScorePatchSchema).min(1),
});

export type PatchStagesCatalogBody = z.infer<typeof patchStagesCatalogBodySchema>;
