/**
 * Gera slug estável para URLs (minúsculas, hífens), removendo diacríticos.
 */
export function slugifyName(name: string): string {
  const base = name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
  return base.length > 0 ? base : "empreendimento";
}
