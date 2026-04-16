---
id: index-agents
title: Indice de Agents
version: 2.0
last_updated: 2026-04-07
---

# Agents Index — Web Excellence Framework v2.0

## Orquestrador (coordenação de alto nível)

O fluxo pode ser coordenado manualmente (fase a fase) ou pelo meta-skill `/orchestrate`.

```
                    ORCHESTRATOR (coordena)
                          │
FASE 1 → 01-architect → 02-designer → 03-builder → ...
```

O orquestrador não substitui os agents de fase; ele decide ordem, dependências, contextos e gates.

## Pipeline de Construcao

Os agents sao organizados por FASE do pipeline, nao por funcao generica. Cada agent conhece suas rules, skills e o agent anterior/posterior.

```
FASE 1 → 01-architect    → Planeja estrutura, define stack, cria ADR
FASE 2 → 02-designer     → Define tokens, paleta, tipografia, mood
FASE 3 → 03-builder      → Constroi componentes e paginas
FASE 4 → 04-seo-specialist → Aplica SEO tecnico e de conteudo
FASE 5 → 05-asset-creator → Gera prompts de imagem e video IA
FASE 6 → 06-qa-auditor   → Audita qualidade, a11y, perf, security
FASE 7 → 07-deploy-manager → Prepara build e deploy
```

## Agents VibeCoding (transversal)

| Agent | Ficheiro | Quando usar |
|---|---|---|
| Debugger | `debugger.md` | Bugs, investigacao sistematica |
| Review | `review.md` | Revisao de codigo geral |
| Security auditor | `security-auditor.md` | OWASP, pre-deploy sensivel |
| UI reviewer | `ui-reviewer.md` | Consistencia UI/UX |

## Mapa de Agents (pipeline Web Excellence)

| # | Agent | Fase | Rules Principais | Skills Principais | Docs |
|---|---|---|---|---|---|
| 01 | architect | Planejamento | core/* | - | references/*, decisions/* |
| 02 | designer | Design System | design/* | foundations/* | foundations/*, ux-ui/* |
| 03 | builder | Construcao | TODAS | layout/*, components/*, motion/*, saas/* | components/*, saas/* |
| 04 | seo-specialist | SEO | quality/seo, stack/nextjs | seo/* | seo/* |
| 05 | asset-creator | Assets IA | design/tokens | ai-assets/* | ai-assets/* |
| 06 | qa-auditor | Qualidade | quality/* | performance/*, accessibility/*, quality/* | performance/*, security/* |
| 07 | deploy-manager | Deploy | core/*, quality/performance | quality/pre-deploy-check | performance/*, security/* |

## Detalhamento por Agent

### 01-architect — Planejamento e Estrutura

**Responsabilidades:**
- Analisar briefing do cliente e extrair requisitos tecnicos
- Definir estrutura de pastas e rotas do Next.js App Router
- Selecionar stack complementar (CMS, analytics, formularios)
- Criar Architecture Decision Records (ADR) para decisoes nao obvias
- Definir schema inicial do banco de dados com Prisma
- Configurar `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`

**Entradas:** Briefing do projeto, requisitos do cliente, restricoes tecnicas
**Saidas:** Estrutura de pastas, ADRs, configuracoes base, schema Prisma inicial

**Rules carregadas:** `core/00-constitution.mdc`, `core/01-typescript.mdc`, `core/02-code-style.mdc`
**Skills utilizadas:** Nenhuma skill especifica — opera com rules core
**Docs consultados:** `references/MARKET_REFERENCES.md`, `references/DESIGN_REFERENCES.md`, `decisions/*.md`

---

### 02-designer — Design System e Tokens

**Responsabilidades:**
- Definir paleta de cores em OKLCH com variantes semanticas
- Criar escala tipografica fluida com `clamp()` e Major Third ratio
- Estabelecer sistema de espacamento com escala geometrica
- Configurar design tokens como CSS custom properties via `@theme`
- Definir breakpoints mobile-first e container query breakpoints
- Criar mood board e direcao visual do projeto

**Entradas:** ADRs do architect, briefing visual, referencias do cliente
**Saidas:** Arquivo `globals.css` com `@theme`, tokens documentados, guia visual

**Rules carregadas:** `design/tokens.mdc`, `design/typography.mdc`, `design/motion.mdc`, `design/responsive.mdc`
**Skills utilizadas:** `foundations/build-color-system`, `foundations/build-typography-scale`, `foundations/build-spacing-grid`, `foundations/build-design-tokens`
**Docs consultados:** `foundations/03_COLOR_SYSTEM.md`, `foundations/02_TYPOGRAPHY.md`, `foundations/04_SPACING_GRID.md`, `ux-ui/01_UX_PRINCIPLES.md`

---

### 03-builder — Construcao de Componentes e Paginas

**Responsabilidades:**
- Construir componentes reutilizaveis com Server Components por padrao
- Implementar layouts responsivos com CSS Grid e Flexbox
- Adicionar animacoes com Framer Motion (spring physics, whileInView)
- Criar paginas completas com sections compostas
- Implementar formularios com Zod validation e Server Actions
- Integrar CMS e APIs externas quando necessario
- Construir features SaaS (pricing, auth, dashboard) quando aplicavel

**Entradas:** Tokens do designer, wireframes, conteudo, estrutura do architect
**Saidas:** Componentes `.tsx`, paginas completas, layouts, Server Actions

**Rules carregadas:** TODAS as rules (core/*, stack/*, quality/*, design/*)
**Skills utilizadas:** `layout/build-grid-layout`, `layout/build-grid-layout`, `layout/build-grid-layout`, `layout/build-hero`, `layout/build-navbar`, `layout/build-footer`, `components/build-feature-grid`, `components/build-form`, `components/build-cta`, `components/build-testimonials`, `components/build-faq`, `components/build-pricing-table`, `motion/build-scroll-animation`, `motion/build-page-transition`, `motion/build-micro-interaction`, `motion/build-loading-state`, `saas/build-auth-flow`, `saas/build-dashboard-layout`, `components/build-pricing-table`, `saas/build-onboarding`
**Docs consultados:** `components/*.md`, `saas/*.md`, `ux-ui/02_UI_PATTERNS.md`

---

### 04-seo-specialist — SEO Tecnico e de Conteudo

**Responsabilidades:**
- Implementar `generateMetadata()` em todas as paginas
- Adicionar JSON-LD estruturado (Organization, WebSite, BreadcrumbList, Product, FAQ)
- Configurar `sitemap.ts` e `robots.ts` dinamicos
- Otimizar Open Graph e Twitter Cards para cada pagina
- Implementar canonical URLs e hreflang para i18n
- Analisar e melhorar Core Web Vitals impactados por SEO
- Estruturar headings h1-h6 semanticamente corretos

**Entradas:** Paginas construidas pelo builder, conteudo textual, keywords target
**Saidas:** Metadata completo, JSON-LD, sitemap, robots, OG images otimizadas

**Rules carregadas:** `quality/seo.mdc`, `stack/nextjs.mdc`
**Skills utilizadas:** `seo/write-meta-tags`, `seo/generate-schema`, `seo/write-sitemap`, `seo/generate-og-image`, `seo/generate-schema`
**Docs consultados:** `seo/01_SEO_TECHNICAL.md`, `seo/01_SEO_TECHNICAL.md`, `seo/02_SEO_CONTENT.md`, `seo/03_SEO_PERFORMANCE.md`

---

### 05-asset-creator — Geracao de Assets com IA

**Responsabilidades:**
- Gerar prompts otimizados para ferramentas de imagem IA (Midjourney, DALL-E, Flux)
- Criar prompts para video IA (Runway, Pika, Sora)
- Definir estilo visual consistente com os tokens do designer
- Gerar hero images, backgrounds, icones ilustrados, avatares
- Criar OG images e social media assets
- Manter banco de prompts reutilizaveis por categoria

**Entradas:** Tokens do designer, contexto visual das paginas, briefing de assets
**Saidas:** Prompts documentados, assets gerados, guia de estilo de prompts

**Rules carregadas:** `design/tokens.mdc`
**Skills utilizadas:** `ai-assets/gen-image-prompt`, `ai-assets/gen-video-prompt`, `ai-assets/gen-copy-headline`, `ai-assets/gen-copy-description`
**Docs consultados:** `ai-assets/AI_TOOLS_GUIDE.md`, `ai-assets/AI_TOOLS_GUIDE.md`, `ai-assets/AI_TOOLS_GUIDE.md`

---

### 06-qa-auditor — Auditoria de Qualidade

**Responsabilidades:**
- Auditar acessibilidade WCAG 2.2 AA (contraste, keyboard, ARIA, screen reader)
- Auditar performance (Core Web Vitals: LCP<2.5s, CLS<0.1, INP<200ms)
- Auditar seguranca (headers, CSRF, XSS, input validation, rate limiting)
- Verificar responsividade em todos os breakpoints (320px a 1920px)
- Validar SEO tecnico pos-build (metadata, structured data, sitemap)
- Gerar relatorio consolidado com scores e recomendacoes

**Entradas:** Projeto completo construido (paginas, componentes, API routes)
**Saidas:** Relatorio de auditoria com scores, lista de issues, correcoes sugeridas

**Rules carregadas:** `quality/accessibility.mdc`, `quality/performance.mdc`, `quality/security.mdc`, `quality/seo.mdc`
**Skills utilizadas:** `performance/optimize-lcp`, `performance/optimize-bundle`, `performance/optimize-images`, `performance/build-loading-strategy`, `accessibility/audit-a11y`, `accessibility/build-skip-navigation`, `accessibility/fix-aria-labels`, `accessibility/fix-contrast`, `quality/pre-deploy-check`, `quality/write-e2e-tests`, `quality/write-e2e-tests`
**Docs consultados:** `performance/01_CORE_WEB_VITALS.md`, `performance/04_LOADING_STRATEGY.md`, `security/01_SECURITY_CHECKLIST.md`, `security/01_SECURITY_CHECKLIST.md`

---

### 07-deploy-manager — Build e Deploy

**Responsabilidades:**
- Executar build de producao e verificar erros
- Otimizar bundle size (target: First Load JS < 200KB)
- Configurar headers de seguranca (CSP, HSTS, X-Frame-Options)
- Verificar variaveis de ambiente de producao
- Preparar deploy para Vercel/Netlify/Docker
- Executar checklist pre-deploy final
- Configurar redirects, rewrites e middleware de producao

**Entradas:** Relatorio de auditoria aprovado pelo qa-auditor, build assets
**Saidas:** Build otimizado, configuracoes de deploy, checklist aprovado

**Rules carregadas:** `core/00-constitution.mdc`, `core/01-typescript.mdc`, `quality/performance.mdc`
**Skills utilizadas:** `quality/pre-deploy-check`
**Docs consultados:** `performance/01_CORE_WEB_VITALS.md`, `performance/04_LOADING_STRATEGY.md`, `security/01_SECURITY_CHECKLIST.md`, `security/02_THREAT_MODEL.md`

---

## Fluxo de Dependencia

Cada agent so entra em acao apos o anterior completar sua fase:

```
01-architect ──→ 02-designer ──→ 03-builder ──→ 04-seo-specialist
                                      │                  │
                                      ▼                  ▼
                                05-asset-creator   06-qa-auditor ──→ 07-deploy-manager
```

- **01-architect** → Define a base para todas as decisoes subsequentes
- **02-designer** → Precisa da stack definida pelo architect
- **03-builder** → Precisa dos tokens definidos pelo designer
- **04-seo-specialist** → Precisa das paginas construidas pelo builder
- **05-asset-creator** → Precisa do contexto visual do designer e paginas do builder
- **06-qa-auditor** → Precisa de tudo construido para auditar
- **07-deploy-manager** → Precisa de todas as auditorias aprovadas

## Comunicacao entre Agents

Os agents se comunicam atraves de **artefatos intermediarios**:

| De → Para | Artefato de Comunicacao |
|---|---|
| architect → designer | ADRs, `folder-structure.md`, stack decisions |
| designer → builder | `globals.css` com `@theme`, tokens documentados |
| builder → seo-specialist | Paginas `.tsx` renderizadas com conteudo |
| designer → asset-creator | Paleta OKLCH, mood board, direcao visual |
| builder → asset-creator | Contexto de paginas, slots de imagem/video |
| todos → qa-auditor | Projeto completo no estado pos-build |
| qa-auditor → deploy-manager | Relatorio de auditoria com status PASS/FAIL |

## Regras de Execucao

1. **Sequencial por padrão:** cada fase depende da anterior quando há dependência de artefato
2. **Paralelização segura:** agents com file ownership disjunto podem executar em paralelo quando coordenados pelo orquestrador
3. **Conflito de ownership:** se dois agents tocam o mesmo arquivo, execução volta para modo sequencial
4. **Rollback permitido:** Se o qa-auditor reprovar, o fluxo retorna ao agent responsavel pela correcao
5. **Skip condicional:** O 05-asset-creator pode ser pulado se o projeto nao precisar de assets IA
6. **Re-execucao parcial:** Um agent pode ser re-executado sem afetar os anteriores (ex: re-rodar o builder sem refazer o designer)

## File Ownership Map (paralelizacao)

| Agent | Ownership principal (write) | Observacoes |
|---|---|---|
| 03-builder | `src/components/**`, `src/app/**/page.tsx`, `src/app/**/layout.tsx` | Evitar overlap com SEO em metadata |
| 04-seo-specialist | `src/app/**/metadata*`, `src/app/sitemap*`, `src/app/robots*` | Pode rodar em paralelo com builder quando ownership disjunto |
| implement-backend | `src/server/**`, `prisma/**`, `src/lib/db*`, `src/types/**` | Paralelo seguro com frontend se contratos estaveis |
| implement-frontend | `src/components/**`, `src/hooks/**`, `src/app/(marketing)/**`, `src/app/(app)/**` | Evitar tocar schema/migration |
| test-writer | `**/*.test.*`, `**/*.spec.*`, `tests/**` | Paralelo com implementacao quando isolado |

## Pares paralelizaveis comuns

```mermaid
flowchart LR
  subgraph parallelA [Paralelo_A]
    Builder[03_builder_componentes]
    SEO[04_seo_metadata]
  end
  subgraph parallelB [Paralelo_B]
    Backend[implement_backend_src_server]
    Frontend[implement_frontend_src_components]
  end
  subgraph sequentialFlow [Sequencial_Obrigatorio]
    Architect[01_architect] --> Designer[02_designer] --> BuilderSeq[03_builder]
    QA[06_qa_auditor] --> Deploy[07_deploy_manager]
  end
```
