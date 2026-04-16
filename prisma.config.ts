// In container runtime we rely on environment variables injected by Swarm/Portainer.
// Local workflows can still use `.env` because Prisma CLI loads it automatically.
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
