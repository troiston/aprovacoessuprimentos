/**
 * DTO compartilhado: listagem de empreendimentos com métricas para dashboard e tabela.
 */
export type DevelopmentListItem = {
  id: string;
  slug: string;
  name: string;
  progress: number;
  status: "active" | "archived";
  pendingCount: number;
  overdueCount: number;
  segments: { value: number; label: string; color: string }[];
  currentStage: string;
  lastUpdate: string;
  /** Epoch ms (tarefas/etapas/empreendimento) para ordenar por "Atualizado". */
  updatedAtMs: number;
  /** Campos opcionais para colunas futuras / planilha */
  units: number | null;
  city: string | null;
  typology: string | null;
};
