import type { StageStatus } from "@/generated/prisma/enums";

export type DevelopmentDetailStageRow = {
  id: string;
  /** ID da etapa no catálogo (`Stage.id`) — usado em PATCH de status e criação de tarefas */
  stageId: string;
  phase: string;
  name: string;
  status: StageStatus;
  rawWeight: number;
  globalWeight: number;
  contribution: number;
};

export type DevelopmentDetailTaskRow = {
  id: string;
  stageName: string;
  description: string;
  assigneeLabel: string;
  deadlineLabel: string;
  isOverdue: boolean;
  notes: string | null;
};

export type DevelopmentDetail = {
  id: string;
  slug: string;
  name: string;
  progress: number;
  pendingCount: number;
  overdueCount: number;
  segments: { value: number; label: string; color: string }[];
  stages: DevelopmentDetailStageRow[];
  tasks: DevelopmentDetailTaskRow[];
};
