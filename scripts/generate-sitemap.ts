/**
 * generate-sitemap.ts — Geração de sitemap.xml e robots.txt para Next.js
 *
 * Lê a estrutura do diretório app/ para encontrar todas as page.tsx,
 * gera sitemap.xml com loc, lastmod, changefreq e priority,
 * e também cria o robots.txt correspondente.
 *
 * Uso: npx tsx scripts/generate-sitemap.ts
 *
 * Também pode ser usado como referência para criar o arquivo
 * app/sitemap.ts nativo do Next.js.
 */

import { readdirSync, statSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, relative, dirname } from "path";

// ---------------------------------------------------------------------------
// Configuração
// ---------------------------------------------------------------------------

/** URL base do site em produção */
const SITE_URL = process.env.SITE_URL || "https://example.com";

/** Diretório raiz do App Router (relativo à raiz do projeto) */
const APP_DIR = join(process.cwd(), "src", "app");

/** Caminho de saída do sitemap.xml */
const SITEMAP_OUTPUT = join(process.cwd(), "public", "sitemap.xml");

/** Caminho de saída do robots.txt */
const ROBOTS_OUTPUT = join(process.cwd(), "public", "robots.txt");

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: ChangeFrequency;
  priority: number;
}

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

// ---------------------------------------------------------------------------
// Padrões de exclusão
// ---------------------------------------------------------------------------

/** Segmentos de caminho que devem ser excluídos do sitemap */
const EXCLUDED_SEGMENTS: RegExp[] = [
  /^api$/,           // Rotas de API
  /^\(.+\)$/,        // Route groups do Next.js — ex: (marketing)
  /^_/,              // Diretórios privados/componentes — ex: _components
  /^@/,              // Parallel routes — ex: @modal
];

/** Arquivos de página que não devem gerar entradas no sitemap */
const EXCLUDED_PAGE_NAMES = new Set([
  "error.tsx",
  "error.ts",
  "loading.tsx",
  "loading.ts",
  "not-found.tsx",
  "not-found.ts",
  "layout.tsx",
  "layout.ts",
  "template.tsx",
  "template.ts",
  "default.tsx",
  "default.ts",
  "global-error.tsx",
  "global-error.ts",
  "middleware.ts",
  "opengraph-image.tsx",
  "icon.tsx",
  "apple-icon.tsx",
  "sitemap.ts",
  "sitemap.xml",
  "robots.ts",
  "robots.txt",
]);

// ---------------------------------------------------------------------------
// Determinação de prioridade e frequência
// ---------------------------------------------------------------------------

/**
 * Determina a prioridade com base no caminho da rota.
 * Home = 1.0, páginas principais = 0.8, blog = 0.6, demais = 0.4
 */
function getPriority(routePath: string): number {
  // Página inicial
  if (routePath === "/") return 1.0;

  const depth = routePath.split("/").filter(Boolean).length;
  const segments = routePath.toLowerCase();

  // Páginas principais de primeiro nível
  if (depth === 1) return 0.8;

  // Posts de blog ou artigos
  if (segments.includes("/blog/") || segments.includes("/articles/")) {
    return 0.6;
  }

  // Páginas de documentação
  if (segments.includes("/docs/")) return 0.6;

  // Demais páginas (utilitárias, profundas)
  return 0.4;
}

/**
 * Determina a frequência de mudança com base no tipo de página.
 */
function getChangeFrequency(routePath: string): ChangeFrequency {
  if (routePath === "/") return "daily";

  const segments = routePath.toLowerCase();

  if (segments.includes("/blog/") || segments.includes("/articles/")) {
    return "weekly";
  }
  if (segments.includes("/docs/")) return "weekly";

  const depth = routePath.split("/").filter(Boolean).length;
  if (depth === 1) return "weekly";

  return "monthly";
}

// ---------------------------------------------------------------------------
// Leitura recursiva do diretório app/
// ---------------------------------------------------------------------------

/**
 * Verifica se um segmento de diretório deve ser excluído.
 */
function isExcludedSegment(segment: string): boolean {
  return EXCLUDED_SEGMENTS.some((pattern) => pattern.test(segment));
}

/**
 * Verifica se é um arquivo de rota dinâmica — ex: [slug]
 * Retorna true para segmentos como [id], [...slug], [[...slug]]
 */
function isDynamicSegment(segment: string): boolean {
  return /^\[/.test(segment);
}

/**
 * Percorre recursivamente o diretório app/ coletando rotas de página.
 * Segmentos entre parênteses (route groups) são removidos da URL final.
 */
function collectPages(dir: string, routeSegments: string[] = []): SitemapEntry[] {
  const entries: SitemapEntry[] = [];

  if (!existsSync(dir)) {
    console.warn(`⚠ Diretório não encontrado: ${dir}`);
    return entries;
  }

  const items = readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      const name = item.name;

      // Pula diretórios excluídos (API, privados)
      if (isExcludedSegment(name)) continue;

      // Route groups — não adicionam segmento à URL
      const isRouteGroup = /^\(.+\)$/.test(name);

      const nextSegments = isRouteGroup
        ? [...routeSegments]
        : [...routeSegments, name];

      const subEntries = collectPages(join(dir, name), nextSegments);
      entries.push(...subEntries);
      continue;
    }

    // Só processa page.tsx / page.ts / page.jsx / page.js
    if (!/^page\.(tsx?|jsx?)$/.test(item.name)) continue;

    // Pula se estiver na lista de exclusão
    if (EXCLUDED_PAGE_NAMES.has(item.name)) continue;

    const filePath = join(dir, item.name);

    // Verifica se algum segmento é dinâmico
    const hasDynamic = routeSegments.some(isDynamicSegment);

    if (hasDynamic) {
      // Rotas dinâmicas precisam de dados do CMS/banco
      // Gera um comentário indicativo no console
      const routePath = "/" + routeSegments.join("/");
      console.log(
        `ℹ Rota dinâmica ignorada (requer dados do CMS): ${routePath}`
      );
      console.log(
        `  → Adicione aqui a busca de slugs para gerar URLs dinâmicas`
      );
      continue;
    }

    // Constrói a URL da rota
    const routePath =
      routeSegments.length === 0 ? "/" : "/" + routeSegments.join("/");

    // Usa a data de última modificação do arquivo
    const fileStat = statSync(filePath);
    const lastmod = fileStat.mtime.toISOString().split("T")[0];

    entries.push({
      loc: `${SITE_URL}${routePath}`,
      lastmod,
      changefreq: getChangeFrequency(routePath),
      priority: getPriority(routePath),
    });
  }

  return entries;
}

// ---------------------------------------------------------------------------
// Ponto de extensão para rotas dinâmicas
// ---------------------------------------------------------------------------

/**
 * Busca slugs de rotas dinâmicas a partir de uma fonte externa (CMS, banco etc.).
 *
 * IMPORTANTE: Personalize esta função para o seu projeto.
 * Exemplo com Prisma:
 *   const posts = await prisma.post.findMany({ select: { slug: true, updatedAt: true } });
 *   return posts.map(p => ({ slug: p.slug, lastmod: p.updatedAt.toISOString().split('T')[0] }));
 */
async function fetchDynamicRoutes(): Promise<SitemapEntry[]> {
  // --- EXEMPLO: Descomentar e adaptar para seu CMS ---
  //
  // const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  // return posts.map((post: { slug: string; updatedAt: string }) => ({
  //   loc: `${SITE_URL}/blog/${post.slug}`,
  //   lastmod: post.updatedAt.split('T')[0],
  //   changefreq: 'weekly' as ChangeFrequency,
  //   priority: 0.6,
  // }));

  return [];
}

// ---------------------------------------------------------------------------
// Geração do XML
// ---------------------------------------------------------------------------

/**
 * Gera o conteúdo XML do sitemap a partir das entradas coletadas.
 */
function generateSitemapXml(entries: SitemapEntry[]): string {
  const urlEntries = entries
    .sort((a, b) => b.priority - a.priority || a.loc.localeCompare(b.loc))
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>
`;
}

/**
 * Escapa caracteres especiais para XML válido.
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ---------------------------------------------------------------------------
// Geração do robots.txt
// ---------------------------------------------------------------------------

/**
 * Gera o conteúdo do robots.txt com referência ao sitemap.
 * Permite customizar User-agents e regras de Disallow.
 */
function generateRobotsTxt(options?: {
  /** Caminhos adicionais para bloquear (ex: /admin, /api) */
  disallow?: string[];
  /** Caminhos específicos para permitir dentro de bloqueios */
  allow?: string[];
  /** User-agents adicionais com regras customizadas */
  additionalAgents?: Array<{
    agent: string;
    disallow?: string[];
    allow?: string[];
  }>;
}): string {
  const { disallow = [], allow = [], additionalAgents = [] } = options || {};

  // Caminhos padrão que devem ser bloqueados
  const defaultDisallow = ["/api/", "/_next/", "/admin/", ...disallow];

  let content = `# robots.txt gerado automaticamente
# Última atualização: ${new Date().toISOString().split("T")[0]}

User-agent: *
`;

  for (const path of defaultDisallow) {
    content += `Disallow: ${path}\n`;
  }

  for (const path of allow) {
    content += `Allow: ${path}\n`;
  }

  // Regras para agents adicionais
  for (const agent of additionalAgents) {
    content += `\nUser-agent: ${agent.agent}\n`;
    for (const path of agent.disallow || []) {
      content += `Disallow: ${path}\n`;
    }
    for (const path of agent.allow || []) {
      content += `Allow: ${path}\n`;
    }
  }

  content += `\nSitemap: ${SITE_URL}/sitemap.xml\n`;

  return content;
}

// ---------------------------------------------------------------------------
// Execução principal
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log("══════════════════════════════════════════════════");
  console.log("  Geração de Sitemap e Robots.txt");
  console.log("══════════════════════════════════════════════════\n");

  console.log(`Site URL:     ${SITE_URL}`);
  console.log(`Diretório:    ${relative(process.cwd(), APP_DIR) || "src/app"}`);
  console.log(`Sitemap:      ${relative(process.cwd(), SITEMAP_OUTPUT)}`);
  console.log(`Robots.txt:   ${relative(process.cwd(), ROBOTS_OUTPUT)}\n`);

  // Fase 1: Coletar páginas estáticas do diretório app/
  console.log("─── Coletando páginas estáticas ───\n");
  const staticEntries = collectPages(APP_DIR);
  console.log(`\n✓ ${staticEntries.length} página(s) estática(s) encontrada(s)\n`);

  // Fase 2: Buscar rotas dinâmicas (CMS, banco de dados etc.)
  console.log("─── Buscando rotas dinâmicas ───\n");
  const dynamicEntries = await fetchDynamicRoutes();
  console.log(`✓ ${dynamicEntries.length} rota(s) dinâmica(s) encontrada(s)\n`);

  // Combina todas as entradas
  const allEntries = [...staticEntries, ...dynamicEntries];

  if (allEntries.length === 0) {
    console.warn("⚠ Nenhuma página encontrada. O sitemap ficará vazio.");
    console.warn(
      "  Verifique se o diretório src/app/ existe e contém arquivos page.tsx\n"
    );
  }

  // Fase 3: Gerar sitemap.xml
  console.log("─── Gerando sitemap.xml ───\n");
  const sitemapXml = generateSitemapXml(allEntries);
  mkdirSync(dirname(SITEMAP_OUTPUT), { recursive: true });
  writeFileSync(SITEMAP_OUTPUT, sitemapXml, "utf-8");
  console.log(`✓ Sitemap gerado: ${relative(process.cwd(), SITEMAP_OUTPUT)}`);
  console.log(`  URLs incluídas: ${allEntries.length}`);

  // Listar todas as URLs no console
  for (const entry of allEntries.sort((a, b) => b.priority - a.priority)) {
    const icon = entry.priority >= 0.8 ? "★" : entry.priority >= 0.6 ? "●" : "○";
    console.log(
      `  ${icon} ${entry.loc} [${entry.priority.toFixed(1)}] ${entry.changefreq}`
    );
  }

  // Fase 4: Gerar robots.txt
  console.log("\n─── Gerando robots.txt ───\n");
  const robotsTxt = generateRobotsTxt({
    disallow: ["/private/", "/draft/"],
    additionalAgents: [
      {
        agent: "GPTBot",
        disallow: ["/"],
      },
      {
        agent: "Google-Extended",
        disallow: ["/"],
      },
    ],
  });
  writeFileSync(ROBOTS_OUTPUT, robotsTxt, "utf-8");
  console.log(`✓ Robots.txt gerado: ${relative(process.cwd(), ROBOTS_OUTPUT)}\n`);

  // Resumo final
  console.log("══════════════════════════════════════════════════");
  console.log(`  ✓ Sitemap: ${allEntries.length} URL(s)`);
  console.log(`  ✓ Robots.txt gerado com sucesso`);
  console.log("══════════════════════════════════════════════════\n");
}

main().catch((error: unknown) => {
  console.error("Erro fatal ao gerar sitemap:", error);
  process.exit(1);
});

// ---------------------------------------------------------------------------
// Exportações para uso como módulo (ex: em app/sitemap.ts)
// ---------------------------------------------------------------------------

export {
  collectPages,
  fetchDynamicRoutes,
  generateSitemapXml,
  generateRobotsTxt,
  getPriority,
  getChangeFrequency,
  SITE_URL,
  APP_DIR,
};

export type { SitemapEntry, ChangeFrequency };
