-- CreateTable
CREATE TABLE "KanbanColumn" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "isTerminal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "KanbanColumn_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "KanbanColumn_sortOrder_idx" ON "KanbanColumn"("sortOrder");

INSERT INTO "KanbanColumn" ("id", "name", "sortOrder", "isTerminal") VALUES
  ('kanban_open', 'Abertas', 0, false),
  ('kanban_in_progress', 'Em progresso', 1, false),
  ('kanban_blocked', 'Bloqueadas', 2, false),
  ('kanban_done', 'Concluídas', 3, true);

ALTER TABLE "Task" ADD COLUMN "kanbanColumnId" TEXT;

UPDATE "Task" SET "kanbanColumnId" = CASE "status"::text
  WHEN 'OPEN' THEN 'kanban_open'
  WHEN 'IN_PROGRESS' THEN 'kanban_in_progress'
  WHEN 'BLOCKED' THEN 'kanban_blocked'
  WHEN 'DONE' THEN 'kanban_done'
  ELSE 'kanban_open'
END;

ALTER TABLE "Task" ALTER COLUMN "kanbanColumnId" SET NOT NULL;

ALTER TABLE "Task" ADD CONSTRAINT "Task_kanbanColumnId_fkey" FOREIGN KEY ("kanbanColumnId") REFERENCES "KanbanColumn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

DROP INDEX "Task_developmentId_status_idx";

CREATE INDEX "Task_developmentId_kanbanColumnId_idx" ON "Task"("developmentId", "kanbanColumnId");

ALTER TABLE "Task" DROP COLUMN "status";

DROP TYPE "TaskStatus";
