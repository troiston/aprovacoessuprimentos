import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type GlobalPrisma = {
  prisma?: InstanceType<typeof PrismaClient>;
  /**
   * Deve coincidir com `PRISMA_CLIENT_GENERATION` em baixo. Quando o schema Prisma muda
   * (`prisma generate`), incremente este valor para o `next dev` deixar de reutilizar um
   * `PrismaClient` antigo em `globalThis` (evita "Unknown field kanbanColumn" após migrações).
   */
  prismaClientGeneration?: string;
};

const globalForPrisma = globalThis as unknown as GlobalPrisma;

/** Incrementar após alterações ao schema Prisma que mudem o cliente gerado. */
const PRISMA_CLIENT_GENERATION = "20260416-kanban-columns-v1";

function createPrismaClient(): InstanceType<typeof PrismaClient> {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

function getOrCreateDb(): InstanceType<typeof PrismaClient> {
  const cached = globalForPrisma.prisma;
  const gen = globalForPrisma.prismaClientGeneration;
  if (cached && gen === PRISMA_CLIENT_GENERATION) {
    return cached;
  }
  if (cached) {
    void cached.$disconnect().catch(() => {});
  }
  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  globalForPrisma.prismaClientGeneration = PRISMA_CLIENT_GENERATION;
  return client;
}

export const db = getOrCreateDb();
