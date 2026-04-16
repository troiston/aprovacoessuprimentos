#!/usr/bin/env node
/**
 * Placeholder para validação de metadata/JSON-LD por rota quando existir app Next.
 * Integrar com glob em src/app/**/page.tsx e assert de exports.
 * Exit 0 = skip (sem app); Exit 1 = falhas reais.
 */
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const appDir = join(root, "src", "app");

if (!existsSync(appDir)) {
  console.log("check-metadata-contract: sem src/app — skip.");
  process.exit(0);
}

console.log("check-metadata-contract: src/app encontrado — implemente asserts por projeto.");
process.exit(0);
