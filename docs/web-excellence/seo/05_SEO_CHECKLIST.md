---
id: doc-seo-checklist
title: Checklist SEO Completo
version: 2.0
last_updated: 2026-04-07
category: seo
priority: critical
related:
  - docs/web-excellence/seo/01_SEO_TECHNICAL.md
  - docs/web-excellence/seo/02_SEO_CONTENT.md
  - docs/web-excellence/seo/03_SEO_PERFORMANCE.md
  - docs/web-excellence/seo/04_SEO_LOCAL.md
  - .cursor/rules/quality/seo.mdc
---

# Checklist SEO Completo — 50+ Itens

Checklist abrangente para auditoria SEO. Cada item inclui campo de status para tracking.

**Legenda de Status:**
- ✅ Implementado e verificado
- ⚠️ Parcialmente implementado / precisa revisão
- ❌ Não implementado
- N/A Não aplicável

---

## 1. SEO Técnico (17 itens)

### 1.1 Metadata

| # | Item | Critério | Status |
|---|---|---|---|
| T01 | **Title tag em toda página** | Único por página, 50-60 caracteres, keyword no início | [ ] |
| T02 | **Meta description em toda página** | Única por página, 150-160 caracteres, contém CTA | [ ] |
| T03 | **title.template no layout root** | `%s | Brand` — páginas filhas herdam padrão | [ ] |
| T04 | **metadataBase definido** | URL absoluta para resolver OG images e canonical | [ ] |
| T05 | **generateMetadata para páginas dinâmicas** | Blog posts, produtos — metadata gerada por conteúdo | [ ] |
| T06 | **Viewport meta** | `<meta name="viewport" content="width=device-width, initial-scale=1">` | [ ] |
| T07 | **html lang definido** | `<html lang="pt-BR">` para conteúdo em português | [ ] |
| T08 | **Favicon completo** | favicon.ico + apple-touch-icon + manifest icons | [ ] |

### 1.2 Structured Data (JSON-LD)

| # | Item | Critério | Status |
|---|---|---|---|
| T09 | **Organization schema** | Nome, URL, logo, sameAs, contactPoint | [ ] |
| T10 | **WebSite schema** | Com SearchAction se houver busca interna | [ ] |
| T11 | **BreadcrumbList schema** | Em todas as páginas com navegação hierárquica | [ ] |
| T12 | **Article schema** | Em blog posts (headline, author, dates, publisher) | [ ] |
| T13 | **FAQPage schema** | Em páginas com FAQ (se houver) | [ ] |
| T14 | **Product schema** | Em páginas de produto/pricing (offers, rating) | [ ] |
| T15 | **LocalBusiness schema** | Se negócio local (NAP, geo, horários) | [ ] |

### 1.3 Indexação e Crawling

| # | Item | Critério | Status |
|---|---|---|---|
| T16 | **sitemap.xml programático** | Todas URLs canônicas, lastmod atualizado, priority definido | [ ] |
| T17 | **robots.txt configurado** | Permite crawl de conteúdo, bloqueia /api/, /admin/, /_next/ | [ ] |
| T18 | **Canonical URL em toda página** | `alternates.canonical` via Metadata API | [ ] |
| T19 | **Hreflang para i18n** | Se multi-idioma: `alternates.languages` + x-default | [ ] |
| T20 | **Sem soft 404s** | Páginas inexistentes retornam HTTP 404 real, não 200 vazio | [ ] |
| T21 | **Redirects 308** | Sem chains (A→B→C), direto ao destino, server-side | [ ] |
| T22 | **URL structure limpa** | Kebab-case, sem params desnecessários, sem trailing slash | [ ] |

---

## 2. SEO de Conteúdo (13 itens)

### 2.1 Headings e Hierarquia

| # | Item | Critério | Status |
|---|---|---|---|
| C01 | **1 h1 por página** | Único, contém keyword principal, descreve conteúdo | [ ] |
| C02 | **Hierarquia h1→h2→h3** | Sem pular níveis, estrutura lógica | [ ] |
| C03 | **Headings descritivos** | Cada heading resume o conteúdo da seção | [ ] |

### 2.2 Keywords e Conteúdo

| # | Item | Critério | Status |
|---|---|---|---|
| C04 | **Keyword no primeiro parágrafo** | Nas primeiras 100 palavras, natural | [ ] |
| C05 | **Keyword em h1 e title** | Presente sem forçar | [ ] |
| C06 | **Sem keyword stuffing** | Distribuição natural, sem repetição excessiva | [ ] |
| C07 | **Conteúdo match search intent** | Formato alinhado com top 10 resultados do Google | [ ] |
| C08 | **Readability adequada** | Frases curtas (≤25 palavras), parágrafos de 2-3 linhas | [ ] |

### 2.3 Links e Referências

| # | Item | Critério | Status |
|---|---|---|---|
| C09 | **3-5 internal links por página** | Anchor text descritivo, contextual | [ ] |
| C10 | **Sem orphan pages** | Toda página recebe pelo menos 1 link interno | [ ] |
| C11 | **Links externos com rel** | `rel="noopener"` para links externos, `rel="nofollow"` se necessário | [ ] |
| C12 | **Alt text em imagens significativas** | Descritivo, 80-125 caracteres, keyword quando natural | [ ] |
| C13 | **Data de publicação e atualização** | Visível na página + datePublished/dateModified em JSON-LD | [ ] |

---

## 3. Performance / Core Web Vitals (12 itens)

### 3.1 LCP (Largest Contentful Paint)

| # | Item | Critério | Status |
|---|---|---|---|
| P01 | **LCP ≤ 2.5s (field data)** | Medido via CrUX/PageSpeed Insights | [ ] |
| P02 | **Hero image com priority/preload** | `next/image priority` ou `<link rel="preload">` | [ ] |
| P03 | **Imagens em WebP/AVIF** | 30-50% menor que JPEG, com fallback | [ ] |
| P04 | **TTFB < 800ms** | CDN, SSG/ISR, otimização de server | [ ] |

### 3.2 CLS (Cumulative Layout Shift)

| # | Item | Critério | Status |
|---|---|---|---|
| P05 | **CLS ≤ 0.1** | Medido via CrUX/PageSpeed Insights | [ ] |
| P06 | **width + height em todas as imagens** | Ou CSS aspect-ratio | [ ] |
| P07 | **Font loading sem CLS** | next/font ou metric override manual | [ ] |
| P08 | **Espaço reservado para conteúdo dinâmico** | Skeleton, min-height, aspect-ratio | [ ] |

### 3.3 INP (Interaction to Next Paint)

| # | Item | Critério | Status |
|---|---|---|---|
| P09 | **INP ≤ 200ms** | Medido via CrUX/PageSpeed Insights | [ ] |
| P10 | **First Load JS < 200KB (gzipped)** | Code splitting, tree shaking, dynamic imports | [ ] |
| P11 | **Third-party scripts async/defer** | Analytics, chat widgets, ads — nunca render-blocking | [ ] |
| P12 | **useTransition para operações pesadas** | Filtragem, busca, atualizações de lista | [ ] |

### 3.4 Otimização Geral

| # | Item | Critério | Status |
|---|---|---|---|
| P13 | **srcset + sizes em imagens** | Servir tamanho adequado por viewport | [ ] |
| P14 | **Fontes otimizadas** | Subset, woff2, preload above-the-fold, font-display: swap | [ ] |
| P15 | **CDN com edge caching** | Assets estáticos com Cache-Control immutable | [ ] |
| P16 | **Performance budget no CI** | Lighthouse CI ou similar bloqueando regressões | [ ] |

---

## 4. Mobile (8 itens)

| # | Item | Critério | Status |
|---|---|---|---|
| M01 | **Design mobile-first** | CSS base para mobile, breakpoints via min-width | [ ] |
| M02 | **Funcional em 320px** | Sem scroll horizontal, conteúdo legível | [ ] |
| M03 | **Touch targets ≥ 44×44px** | Botões, links, inputs com área mínima de toque | [ ] |
| M04 | **Espaçamento entre targets ≥ 8px** | Evitar taps acidentais | [ ] |
| M05 | **Navegação mobile adequada** | Hamburger menu funcional com focus trap | [ ] |
| M06 | **Viewport meta correto** | `width=device-width, initial-scale=1` sem `user-scalable=no` | [ ] |
| M07 | **Texto legível sem zoom** | Body ≥ 16px, contrast AA em telas small | [ ] |
| M08 | **Testado em dispositivos reais** | iPhone, Android mainstream, tablet — ou BrowserStack | [ ] |

---

## 5. Social / OG Tags (7 itens)

### 5.1 Open Graph

| # | Item | Critério | Status |
|---|---|---|---|
| S01 | **og:title em toda página** | Título otimizado para compartilhamento (pode diferir do title tag) | [ ] |
| S02 | **og:description em toda página** | 200 caracteres, atrativo para click social | [ ] |
| S03 | **og:image em toda página** | 1200×630px, texto legível, brand visible | [ ] |
| S04 | **og:type definido** | `website` para pages, `article` para posts | [ ] |
| S05 | **og:url canonical** | URL canônica da página | [ ] |

### 5.2 Twitter Cards

| # | Item | Critério | Status |
|---|---|---|---|
| S06 | **twitter:card** | `summary_large_image` (preferido) ou `summary` | [ ] |
| S07 | **twitter:creator** | @ do autor ou da empresa | [ ] |

### 5.3 OG Image

| # | Item | Critério | Status |
|---|---|---|---|
| S08 | **OG image default** | 1200×630px, logo + tagline, cores da marca | [ ] |
| S09 | **OG image por página** | Blog posts e páginas importantes com OG image customizada | [ ] |
| S10 | **OG image dinâmica** | Gerada via `opengraph-image.tsx` para conteúdo dinâmico | [ ] |

---

## 6. Acessibilidade (Impacto SEO) (5 itens)

| # | Item | Critério | Status |
|---|---|---|---|
| A01 | **Heading hierarchy semântica** | h1→h2→h3 (Google usa para entender estrutura) | [ ] |
| A02 | **Alt text em imagens** | Descritivo (ajuda Google Images + screen readers) | [ ] |
| A03 | **HTML semântico** | `<nav>`, `<main>`, `<article>`, `<header>`, `<footer>` — ajuda crawlers | [ ] |
| A04 | **Links com texto descritivo** | Anchor text significativo (Google usa para context) | [ ] |
| A05 | **axe-core zero violations** | Erros de acessibilidade frequentemente correlacionam com erros de SEO | [ ] |

---

## 7. Segurança e Infraestrutura (4 itens)

| # | Item | Critério | Status |
|---|---|---|---|
| I01 | **HTTPS em todo o site** | Sem mixed content, redirect HTTP→HTTPS | [ ] |
| I02 | **HTTP/2 ou HTTP/3** | Multiplexing, header compression | [ ] |
| I03 | **Security headers** | X-Content-Type-Options, X-Frame-Options, CSP | [ ] |
| I04 | **Sem intrusive interstitials** | Sem popups full-screen no mobile (penalizado pelo Google) | [ ] |

---

## 8. Monitoramento e Analytics (5 itens)

| # | Item | Critério | Status |
|---|---|---|---|
| X01 | **Google Search Console configurado** | Sitemap submetido, propriedade verificada | [ ] |
| X02 | **Google Analytics / Vercel Analytics** | Tracking de pageviews, events, conversões | [ ] |
| X03 | **web-vitals RUM** | CWV medidos em produção com real users | [ ] |
| X04 | **Alertas de regressão** | Notificação se CWV degradar ou indexação cair | [ ] |
| X05 | **Relatório mensal** | CWV trends, ranking changes, crawl stats | [ ] |

---

## Resumo por Categoria

| Categoria | Total | Críticos (P0) | Importantes (P1) |
|---|---|---|---|
| Técnico | 22 | T01-T08 (Metadata), T16-T18 (Indexação) | T09-T15 (Structured Data) |
| Conteúdo | 13 | C01-C05 (Headings/Keywords) | C09-C13 (Links/Refs) |
| Performance | 16 | P01, P05, P09 (CWV thresholds) | P02-P04, P06-P08, P10-P16 |
| Mobile | 8 | M01-M03 (Base mobile) | M04-M08 (QA) |
| Social | 10 | S01-S03 (OG core) | S04-S10 (Completo) |
| Acessibilidade | 5 | A01-A04 | A05 |
| Infraestrutura | 4 | I01 (HTTPS) | I02-I04 |
| Monitoramento | 5 | X01-X02 | X03-X05 |
| **Total** | **83** | — | — |

---

## Como Usar Este Checklist

### Auditoria Inicial

1. Percorra todos os 83 itens marcando status (✅/⚠️/❌/N/A)
2. Priorize P0 (críticos) — implemente primeiro
3. Depois P1 (importantes)
4. Items restantes como melhorias contínuas

### Auditoria Recorrente

| Frequência | Escopo |
|---|---|
| Por deploy | Performance (P01-P16), Mobile (M01-M02) |
| Semanal | Conteúdo de novos posts (C01-C13) |
| Mensal | Técnico completo (T01-T22), Social (S01-S10) |
| Trimestral | Checklist completo (83 itens) |

### Automação

Items automatizáveis em CI/CD:
- **Lighthouse CI:** P01-P16 (Performance)
- **axe-core:** A01-A05 (Acessibilidade)
- **Schema validator:** T09-T15 (Structured Data)
- **HTML validator:** T07, A03 (Semântica)
- **Link checker:** C09-C11, T20-T21 (Links e redirects)

Items que requerem verificação manual:
- C04-C08 (Qualidade do conteúdo)
- M08 (Teste em dispositivos reais)
- S08-S10 (Qualidade visual das OG images)
- X05 (Análise de relatório)

---

## Ferramentas Recomendadas

| Ferramenta | Propósito | Custo |
|---|---|---|
| Google Search Console | Indexação, performance, erros | Grátis |
| Google PageSpeed Insights | CWV lab + field data | Grátis |
| Lighthouse (Chrome DevTools) | Auditoria completa | Grátis |
| web-vitals (npm) | RUM em produção | Grátis |
| Screaming Frog | Crawl e auditoria técnica | Grátis até 500 URLs |
| Ahrefs / Semrush | Keywords, backlinks, competitors | Pago |
| Schema.org Validator | Validação de structured data | Grátis |
| Rich Results Test | Teste de rich snippets | Grátis |
| axe DevTools | Acessibilidade | Grátis |
| BrowserStack | Teste cross-device | Pago |
| Vercel Analytics | RUM + Speed Insights | Incluído no Vercel |
