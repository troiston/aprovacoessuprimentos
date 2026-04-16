---
id: cmd-audit-seo
title: Auditoria de SEO
version: 2.0
last_updated: 2026-04-07
category: audit
agent: 06-qa-auditor
skills:
  - write-meta-tags
  - generate-schema
  - write-sitemap
  - generate-og-image
  - build-breadcrumbs
---

# `/audit-seo`

Executa auditoria completa de SEO técnico e de conteúdo em todas as páginas do projeto. Verifica meta tags, JSON-LD, hierarquia de headings, canonical URLs, sitemap, robots.txt, Open Graph, alt text, e links internos. Gera relatório com pass/fail por verificação e instruções de correção.

---

## Parâmetros

Nenhum parâmetro necessário — audita todo o projeto automaticamente.

---

## Passo a Passo de Execução

### Passo 1 — Inventariar todas as páginas

Escanear `src/app/` e listar todas as rotas que possuem `page.tsx`:
```
src/app/page.tsx → /
src/app/about/page.tsx → /about
src/app/pricing/page.tsx → /pricing
src/app/blog/page.tsx → /blog
src/app/blog/[slug]/page.tsx → /blog/[slug]
src/app/contact/page.tsx → /contact
```

### Passo 2 — Verificar Meta Tags (por página)

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| `title` presente | Cada `page.tsx` exporta `metadata.title` ou `generateMetadata()` | 🔴 Crítico |
| `title` único | Nenhuma página repete o mesmo title | 🟡 Major |
| `title` comprimento | 50–60 caracteres (ideal para SERP) | 🟡 Major |
| `title` com keyword | Keyword principal presente naturalmente | 🟡 Major |
| `description` presente | Cada página tem `metadata.description` | 🔴 Crítico |
| `description` única | Nenhuma página repete a mesma description | 🟡 Major |
| `description` comprimento | 120–160 caracteres | 🟡 Major |
| `description` persuasiva | Inclui benefício + CTA implícito | 🟢 Minor |

### Passo 3 — Verificar Open Graph (por página)

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| `og:title` | Presente e diferente do title normal (pode ser mais longo) | 🟡 Major |
| `og:description` | Presente e otimizada para compartilhamento | 🟡 Major |
| `og:image` | Imagem 1200×630px definida | 🔴 Crítico |
| `og:type` | `website` para home, `article` para blog | 🟡 Major |
| `og:url` | URL canônica da página | 🟡 Major |
| `og:locale` | `pt_BR` definido | 🟢 Minor |
| `og:site_name` | Nome do site presente | 🟢 Minor |
| Twitter Card | `summary_large_image` configurado | 🟡 Major |

### Passo 4 — Verificar JSON-LD

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| Organization | Presente no `layout.tsx` raiz | 🔴 Crítico |
| WebSite | Presente no `layout.tsx` raiz | 🟡 Major |
| BreadcrumbList | Presente em sub-páginas | 🟢 Minor |
| FAQPage | Presente em páginas com FAQ | 🟡 Major |
| Product | Presente em páginas de produto | 🔴 Crítico (se e-commerce) |
| Article | Presente em posts de blog | 🔴 Crítico (se blog) |
| JSON válido | `JSON.parse()` sem erros | 🔴 Crítico |
| Propriedades obrigatórias | Todas preenchidas conforme schema.org | 🔴 Crítico |

### Passo 5 — Verificar Heading Hierarchy

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| h1 único | Exatamente 1 `<h1>` por página | 🔴 Crítico |
| h1 com keyword | Keyword principal no h1 | 🟡 Major |
| Sem pulos | h1→h2→h3 sem pular níveis (sem h1→h3) | 🟡 Major |
| h2 por section | Cada `<section>` tem h2 descritivo | 🟡 Major |
| Headings descritivos | Headings transmitem informação, não são genéricos | 🟢 Minor |

### Passo 6 — Verificar Canonical URLs

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| Canonical presente | Cada página define `alternates.canonical` | 🔴 Crítico |
| Canonical correto | Aponta para a URL preferida (sem duplicatas) | 🔴 Crítico |
| Sem trailing slash inconsistente | Todas URLs seguem o mesmo padrão | 🟡 Major |
| Self-referencing | Canonical aponta para a própria página | 🟡 Major |

### Passo 7 — Verificar Sitemap e Robots

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| `sitemap.ts` existe | Arquivo presente em `src/app/` | 🔴 Crítico |
| Todas as rotas incluídas | Cada `page.tsx` tem entrada no sitemap | 🔴 Crítico |
| `lastModified` presente | Cada URL tem data de modificação | 🟡 Major |
| `changeFrequency` definida | Frequência de mudança realista | 🟢 Minor |
| `priority` definida | Prioridade relativa correta | 🟢 Minor |
| `robots.ts` existe | Arquivo presente em `src/app/` | 🔴 Crítico |
| Allow/Disallow corretos | Páginas públicas permitidas, admin/api bloqueados | 🔴 Crítico |
| Sitemap referenciado | `robots.ts` referencia a URL do sitemap | 🟡 Major |

### Passo 8 — Verificar Alt Text

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| Todas imagens com alt | Nenhum `<Image>` sem `alt` | 🔴 Crítico |
| Alt descritivo | Alt text descreve o conteúdo da imagem | 🟡 Major |
| Alt vazio para decorativas | Imagens decorativas com `alt=""` | 🟡 Major |
| Sem "imagem de" no alt | Alt não começa com "imagem de", "foto de" | 🟢 Minor |

### Passo 9 — Verificar Links Internos

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| Links com `next/link` | Nenhum `<a>` manual para rotas internas | 🟡 Major |
| Texto âncora descritivo | Sem "clique aqui", "saiba mais" isolados | 🟡 Major |
| Sem links quebrados | Todos os hrefs apontam para rotas existentes | 🔴 Crítico |
| Sem links nofollow internos | Links internos sem `rel="nofollow"` | 🟢 Minor |

---

## Formato do Relatório

```markdown
# Relatório de Auditoria SEO
**Data:** 2026-04-07
**Projeto:** [nome do projeto]
**Total de páginas:** [N]

## Resumo
| Categoria | ✅ Pass | ❌ Fail | ⚠️ Warning |
|-----------|--------|--------|------------|
| Meta Tags | X | X | X |
| Open Graph | X | X | X |
| JSON-LD | X | X | X |
| Headings | X | X | X |
| Canonical | X | X | X |
| Sitemap/Robots | X | X | X |
| Alt Text | X | X | X |
| Links Internos | X | X | X |
| **TOTAL** | **X** | **X** | **X** |

## Score: [N]/100

## Issues Críticos (🔴)
1. **[página]** — [descrição do problema]
   - **Correção:** [instrução específica de correção com código]

## Issues Major (🟡)
1. **[página]** — [descrição]
   - **Correção:** [instrução]

## Issues Minor (🟢)
1. **[página]** — [descrição]
   - **Correção:** [instrução]
```

---

## Critérios de Score

| Score | Classificação | Descrição |
|-------|--------------|-----------|
| 90–100 | 🟢 Excelente | SEO completo, pronto para produção |
| 70–89 | 🟡 Bom | Funcional, melhorias recomendadas |
| 50–69 | 🟠 Regular | Issues significativos a corrigir |
| 0–49 | 🔴 Crítico | SEO insuficiente, correção urgente |

Cálculo: `100 - (críticos × 10) - (major × 5) - (minor × 1)`

---

## Saída Esperada

```
✅ Auditoria SEO concluída
├── [N] páginas auditadas
├── [N] verificações executadas
├── Score: [N]/100
├── 🔴 [N] issues críticos
├── 🟡 [N] issues major
├── 🟢 [N] issues minor
├── Relatório com correções específicas
└── Correções aplicáveis automaticamente marcadas
```

---

## Exemplo de Uso

```
/audit-seo
```
