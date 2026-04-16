---
id: index-docs
title: Indice de Documentos
version: 2.1
last_updated: 2026-04-08
---

# Docs Index — Web Excellence Framework v2.1

> Referencia completa de toda a documentacao do framework.
> Organizada por categoria com cross-references para skills e rules.

## Categorias de Documentacao

| Categoria | Pasta | Qtd | Proposito |
|---|---|---|---|
| **Foundations** | `foundations/` | 5 | Sistemas de design base (design system, tipografia, cores, espacamento, iconografia) |
| **UX/UI** | `ux-ui/` | 6 | UX, UI, motion, a11y, responsividade, confianca/legal |
| **SEO** | `seo/` | 6 | SEO tecnico, conteudo, performance, local, checklist, internacional |
| **Components** | `components/` | 6 | Padroes de componentes (hero, CTA, social proof, pricing, FAQ, conversao) |
| **SaaS** | `saas/` | 5 | Features SaaS (auth, onboarding, dashboard, billing, empty states) |
| **Performance** | `performance/` | 5 | CWV, imagens, fontes, loading, midia/embeds |
| **Security** | `security/` | 3 | Checklist de seguranca, threat model, auth security |
| **References** | `references/` | 3 | Analise de concorrentes, referencias de design e mercado |
| **Decisions** | `decisions/` | 1 | Template para Architecture Decision Records (ADRs) |
| **Templates** | `templates/` | 3 | Templates reutilizaveis (componente, pagina, post-mortem) |
| **AI Assets** | `ai-assets/` | 11 | Guia de ferramentas AI + prompts de imagem e video (JSON) |
| **Conversion** | `conversion/` | 1 | CRO etico e heuristica |
| **Deployment** | `deployment/` | 1 | Preview vs producao, SEO em ambientes temporarios |
| **Operations** | `operations/` | 1 | RUM, Web Vitals em campo, privacidade |
| **Brand** | `brand/` | 1 | Voz, tom, microcopy |
| **Examples** | `examples/` | 1 | Especificacao landing gold |
| **Solutions** | `solutions/` | 1 | Indice de aprendizagens (compound) |

**Total: 55+ documentos Markdown + 10 JSON + [framework-manifest.json](framework-manifest.json)**

---

## Tabela Completa de Documentacao

### Foundations (5 docs)

| # | Documento | Prioridade | Descricao | Skills Relacionadas | Rules Relacionadas |
|---|---|---|---|---|---|
| 01 | `foundations/01_DESIGN_SYSTEM.md` | CRITICAL | Sistema de design completo — tokens, escalas, principios visuais, estrutura base para todo o framework | `foundations/*` | `design/tokens.mdc` |
| 02 | `foundations/02_TYPOGRAPHY.md` | CRITICAL | Sistema tipografico fluido — escala com `clamp()`, font stacks, line-height otimizado, carregamento com `next/font` | `foundations/*` | `design/typography.mdc` |
| 03 | `foundations/03_COLOR_SYSTEM.md` | CRITICAL | Sistema de cores OKLCH — paleta completa, variantes semanticas, dark mode, wide gamut, fallbacks sRGB | `foundations/*`, `accessibility/*` | `design/tokens.mdc` |
| 04 | `foundations/04_SPACING_GRID.md` | CRITICAL | Escala de espacamento e grid — base 4px, grid 12 colunas, container queries, vertical rhythm | `foundations/*`, `layout/*` | `design/tokens.mdc`, `design/responsive.mdc` |
| 05 | `foundations/05_ICONOGRAPHY.md` | STANDARD | Sistema de iconografia — tamanhos, consistencia visual, acessibilidade de icones, sprite sheets | `foundations/*` | `design/tokens.mdc` |

### UX/UI (5 docs)

| # | Documento | Prioridade | Descricao | Skills Relacionadas | Rules Relacionadas |
|---|---|---|---|---|---|
| 06 | `ux-ui/01_UX_PRINCIPLES.md` | IMPORTANT | Principios de UX — hierarquia visual, padroes F e Z, whitespace, usabilidade, heuristicas de Nielsen | `foundations/*`, `accessibility/*` | `design/typography.mdc` |
| 07 | `ux-ui/02_UI_PATTERNS.md` | IMPORTANT | Padroes de UI — hover/active/focus states, feedback visual, skeleton loading, empty states, error states | `components/*`, `motion/*` | `stack/framer-motion.mdc` |
| 08 | `ux-ui/03_MOTION_GUIDELINES.md` | IMPORTANT | Diretrizes de motion — quando e como animar, spring physics, duracao, easing, `prefers-reduced-motion` | `motion/*` | `design/motion.mdc`, `stack/framer-motion.mdc` |
| 09 | `ux-ui/04_ACCESSIBILITY_GUIDE.md` | CRITICAL | Guia de acessibilidade — WCAG 2.2 AA, contraste 4.5:1, keyboard nav, ARIA, screen readers, touch targets | `accessibility/*` | `quality/accessibility.mdc` |
| 10 | `ux-ui/05_RESPONSIVE_STRATEGY.md` | IMPORTANT | Estrategia responsiva — mobile-first, breakpoints, container queries, thumb zones, safe areas | `layout/*`, `foundations/*` | `design/responsive.mdc` |

### SEO (5 docs)

| # | Documento | Prioridade | Descricao | Skills Relacionadas | Rules Relacionadas |
|---|---|---|---|---|---|
| 11 | `seo/01_SEO_TECHNICAL.md` | CRITICAL | SEO tecnico — `generateMetadata()`, canonical, sitemap, robots.txt, hreflang, crawlability, indexacao | `seo/*` | `quality/seo.mdc` |
| 12 | `seo/02_SEO_CONTENT.md` | IMPORTANT | SEO de conteudo — headings semanticos, keyword strategy, meta descriptions, Open Graph, Twitter Cards | `seo/*` | `quality/seo.mdc` |
| 13 | `seo/03_SEO_PERFORMANCE.md` | IMPORTANT | SEO e performance — intersecao CWV e ranking, LCP, CLS, INP, relacao bounce rate e velocidade | `seo/*`, `performance/*` | `quality/seo.mdc`, `quality/performance.mdc` |
| 14 | `seo/04_SEO_LOCAL.md` | STANDARD | SEO local — JSON-LD LocalBusiness, Google My Business, NAP consistency, schema markup local | `seo/*` | `quality/seo.mdc` |
| 15 | `seo/05_SEO_CHECKLIST.md` | IMPORTANT | Checklist de SEO — verificacoes pre-deploy, auditoria completa, ferramentas de validacao | `seo/*`, `quality/*` | `quality/seo.mdc` |

### Components (6 docs)

| # | Documento | Prioridade | Descricao | Skills Relacionadas | Rules Relacionadas |
|---|---|---|---|---|---|
| 16 | `components/01_HERO_PATTERNS.md` | IMPORTANT | Padroes de hero — variantes (centered, split, video, animated), CTA placement, above-the-fold | `components/*`, `motion/*` | `stack/tailwind.mdc`, `stack/framer-motion.mdc` |
| 17 | `components/02_CTA_PATTERNS.md` | IMPORTANT | Padroes de CTA — hierarquia de botoes, placement strategy, copy persuasivo, urgencia, A/B testing | `components/*` | `stack/tailwind.mdc` |
| 18 | `components/03_SOCIAL_PROOF_PATTERNS.md` | STANDARD | Padroes de social proof — testimonials, logos, ratings, case studies, numeros, badges de confianca | `components/*` | `stack/tailwind.mdc` |
| 19 | `components/04_PRICING_PATTERNS.md` | IMPORTANT | Padroes de pricing — tabelas comparativas, toggle mensal/anual, highlight do plano recomendado, FAQs de pricing | `components/*`, `saas/*` | `stack/tailwind.mdc` |
| 20 | `components/05_FAQ_PATTERNS.md` | STANDARD | Padroes de FAQ — accordion, JSON-LD FAQPage, categorias, search, SEO benefits | `components/*`, `seo/*` | `stack/tailwind.mdc`, `quality/seo.mdc` |
| 21 | `components/06_CONVERSION_ELEMENTS.md` | IMPORTANT | Elementos de conversao — exit intent, sticky bars, countdown, progress indicators, micro-commitments | `components/*`, `motion/*` | `stack/tailwind.mdc`, `stack/framer-motion.mdc` |

### SaaS (5 docs)

| # | Documento | Prioridade | Descricao | Skills Relacionadas | Rules Relacionadas |
|---|---|---|---|---|---|
| 22 | `saas/01_AUTH_PATTERNS.md` | IMPORTANT | Padroes de autenticacao — Better Auth, providers (email, OAuth), sessoes, middleware, roles, rate limiting | `saas/*` | `quality/security.mdc`, `stack/nextjs.mdc` |
| 23 | `saas/02_ONBOARDING_PATTERNS.md` | STANDARD | Padroes de onboarding — multi-step com progress bar, coleta progressiva, skip, gamificacao, reengagement | `saas/*`, `motion/*` | `stack/framer-motion.mdc` |
| 24 | `saas/03_DASHBOARD_PATTERNS.md` | IMPORTANT | Padroes de dashboard — sidebar colapsavel, data tables, charts, KPI cards, empty states, loading skeletons | `saas/*`, `layout/*` | `stack/tailwind.mdc` |
| 25 | `saas/04_BILLING_PATTERNS.md` | STANDARD | Padroes de billing — Stripe checkout, customer portal, webhooks, planos, trials, upgrades, cancelamento | `saas/*` | `quality/security.mdc` |
| 26 | `saas/05_EMPTY_STATES.md` | STANDARD | Empty states — ilustracoes, copy motivacional, CTAs de acao, onboarding contextual, zero-data patterns | `saas/*`, `components/*` | `stack/tailwind.mdc` |

### Performance (4 docs)

| # | Documento | Prioridade | Descricao | Skills Relacionadas | Rules Relacionadas |
|---|---|---|---|---|---|
| 27 | `performance/01_CORE_WEB_VITALS.md` | CRITICAL | Core Web Vitals — LCP < 2.5s, CLS < 0.1, INP < 200ms, diagnostico, otimizacoes, monitoramento | `performance/*` | `quality/performance.mdc` |
| 28 | `performance/02_IMAGE_OPTIMIZATION.md` | IMPORTANT | Otimizacao de imagens — `next/image`, formatos (WebP, AVIF), sizes, priority, lazy loading, CDN | `performance/*` | `quality/performance.mdc` |
| 29 | `performance/03_FONT_OPTIMIZATION.md` | IMPORTANT | Otimizacao de fontes — `next/font`, subset, font-display, preload, fallback metrics, FOUT/FOIT | `performance/*` | `quality/performance.mdc` |
| 30 | `performance/04_LOADING_STRATEGY.md` | IMPORTANT | Estrategia de loading — code splitting, dynamic imports, streaming com Suspense, prefetch, cache headers | `performance/*` | `quality/performance.mdc` |

### Security (3 docs)

| # | Documento | Prioridade | Descricao | Skills Relacionadas | Rules Relacionadas |
|---|---|---|---|---|---|
| 31 | `security/01_SECURITY_CHECKLIST.md` | CRITICAL | Checklist de seguranca — CSP, HSTS, headers, input validation, CSRF, rate limiting, pre-deploy checks | `quality/*` | `quality/security.mdc` |
| 32 | `security/02_THREAT_MODEL.md` | IMPORTANT | Modelo de ameacas — STRIDE, vetores de ataque, superficie de ataque, mitigacoes por camada | `quality/*` | `quality/security.mdc` |
| 33 | `security/03_AUTH_SECURITY.md` | IMPORTANT | Seguranca de autenticacao — brute force protection, token rotation, session security, OAuth best practices | `saas/*`, `quality/*` | `quality/security.mdc`, `stack/nextjs.mdc` |

### References (3 docs)

| # | Documento | Prioridade | Descricao | Skills Relacionadas | Rules Relacionadas |
|---|---|---|---|---|---|
| 34 | `references/COMPETITOR_ANALYSIS.md` | STANDARD | Analise de concorrentes — benchmarking, features comparison, diferenciais, gaps de mercado | — | `core/00-constitution.mdc` |
| 35 | `references/DESIGN_REFERENCES.md` | STANDARD | Referencias de design — sites inspiradores, tendencias visuais, padroes de UI/UX de referencia | — | `design/tokens.mdc` |
| 36 | `references/MARKET_REFERENCES.md` | STANDARD | Referencias de mercado — dados de mercado, tendencias de industria, validacao de nicho | — | `core/00-constitution.mdc` |

### Decisions (1 doc)

| # | Documento | Prioridade | Descricao | Skills Relacionadas | Rules Relacionadas |
|---|---|---|---|---|---|
| 37 | `decisions/_TEMPLATE_ADR.md` | STANDARD | Template de ADR — formato padrao: titulo, data, status, contexto, decisao, consequencias, alternativas, riscos | — | `core/00-constitution.mdc` |

### Templates (3 docs)

| # | Documento | Prioridade | Descricao | Skills Relacionadas | Rules Relacionadas |
|---|---|---|---|---|---|
| 38 | `templates/COMPONENT_TEMPLATE.md` | IMPORTANT | Template de componente — estrutura `.tsx` com interface tipada, variantes, Server Component, responsividade, acessibilidade | `components/*` | `core/01-typescript.mdc`, `core/02-code-style.mdc` |
| 39 | `templates/PAGE_TEMPLATE.md` | IMPORTANT | Template de pagina — `page.tsx` com `generateMetadata()`, JSON-LD, composicao de sections, loading, error, not-found | `layout/*`, `seo/*` | `stack/nextjs.mdc`, `quality/seo.mdc` |
| 40 | `templates/POST_MORTEM_TEMPLATE.md` | STANDARD | Template de post-mortem — timeline, root cause, impacto, acoes corretivas, licoes aprendidas | — | `core/00-constitution.mdc` |

### AI Assets (1 guia + 10 JSON prompts)

| # | Documento | Tipo | Descricao | Skills Relacionadas | Rules Relacionadas |
|---|---|---|---|---|---|
| 41 | `ai-assets/AI_TOOLS_GUIDE.md` | Guia MD | Guia de ferramentas AI — workflows de geracao de imagem e video, integracao com pipeline | `ai-assets/*` | `core/00-constitution.mdc` |
| 42 | `ai-assets/image-prompts/_PROMPT_TEMPLATE.json` | Template JSON | Template base para prompts de imagem — estrutura padrao com campos obrigatorios | `ai-assets/*` | — |
| 43 | `ai-assets/image-prompts/nicho-cafe.json` | Prompt JSON | Prompts de imagem para nicho cafe — ambientes, produtos, lifestyle | `ai-assets/*` | — |
| 44 | `ai-assets/image-prompts/nicho-ecommerce.json` | Prompt JSON | Prompts de imagem para nicho e-commerce — produtos, hero shots, banners | `ai-assets/*` | — |
| 45 | `ai-assets/image-prompts/nicho-portfolio.json` | Prompt JSON | Prompts de imagem para nicho portfolio — projetos, mockups, backgrounds | `ai-assets/*` | — |
| 46 | `ai-assets/image-prompts/nicho-restaurante.json` | Prompt JSON | Prompts de imagem para nicho restaurante — pratos, ambientes, equipe | `ai-assets/*` | — |
| 47 | `ai-assets/image-prompts/nicho-saas.json` | Prompt JSON | Prompts de imagem para nicho SaaS — dashboards, features, illustrations | `ai-assets/*` | — |
| 48 | `ai-assets/video-prompts/_VIDEO_TEMPLATE.json` | Template JSON | Template base para prompts de video — estrutura com campos de duracao, estilo, cena | `ai-assets/*` | — |
| 49 | `ai-assets/video-prompts/hero-loop.json` | Prompt JSON | Prompts de video hero loop — background videos, loops seamless, atmosfera | `ai-assets/*` | — |
| 50 | `ai-assets/video-prompts/lifestyle-scene.json` | Prompt JSON | Prompts de video lifestyle — cenas de uso, storytelling visual, emocao | `ai-assets/*` | — |
| 51 | `ai-assets/video-prompts/product-reveal.json` | Prompt JSON | Prompts de video product reveal — lancamento, unboxing, features highlight | `ai-assets/*` | — |

---

## Guia de Navegacao

### Como Encontrar a Documentacao Certa

**Por fase do pipeline:**
- Iniciando projeto → `references/COMPETITOR_ANALYSIS.md`, `references/MARKET_REFERENCES.md`, `decisions/_TEMPLATE_ADR.md`
- Definindo design → `foundations/*.md`, `ux-ui/01_UX_PRINCIPLES.md`, `references/DESIGN_REFERENCES.md`
- Construindo → `components/*.md`, `ux-ui/02_UI_PATTERNS.md`, `saas/*.md`, `templates/*.md`
- Gerando assets → `ai-assets/AI_TOOLS_GUIDE.md`, `ai-assets/image-prompts/*.json`, `ai-assets/video-prompts/*.json`
- Otimizando SEO → `seo/*.md`
- Auditando → `performance/*.md`, `security/*.md`

**Por duvida tecnica:**
- "Que cor usar?" → `foundations/03_COLOR_SYSTEM.md`
- "Que fonte usar?" → `foundations/02_TYPOGRAPHY.md`
- "Como animar?" → `ux-ui/03_MOTION_GUIDELINES.md`
- "Como garantir acessibilidade?" → `ux-ui/04_ACCESSIBILITY_GUIDE.md`
- "Como fazer SEO?" → `seo/01_SEO_TECHNICAL.md`, `seo/05_SEO_CHECKLIST.md`
- "Como montar hero?" → `components/01_HERO_PATTERNS.md`
- "Como precificar?" → `components/04_PRICING_PATTERNS.md`
- "Como integrar pagamento?" → `saas/04_BILLING_PATTERNS.md`
- "Como proteger a app?" → `security/01_SECURITY_CHECKLIST.md`, `security/02_THREAT_MODEL.md`
- "Como otimizar performance?" → `performance/01_CORE_WEB_VITALS.md`, `performance/04_LOADING_STRATEGY.md`
- "Como gerar imagens com AI?" → `ai-assets/AI_TOOLS_GUIDE.md`

**Por agent que consulta:**
- 01-architect → `references/*`, `decisions/*`, `foundations/01_DESIGN_SYSTEM.md`
- 02-designer → `foundations/*`, `ux-ui/*`, `references/DESIGN_REFERENCES.md`
- 03-builder → `components/*`, `saas/*`, `templates/*`
- 04-seo-specialist → `seo/*`
- 05-asset-creator → `ai-assets/*`, `foundations/03_COLOR_SYSTEM.md`, `foundations/02_TYPOGRAPHY.md`
- 06-qa-auditor → `performance/*`, `security/*`, `ux-ui/04_ACCESSIBILITY_GUIDE.md`
- 07-deploy-manager → `performance/*`, `security/*`, `seo/05_SEO_CHECKLIST.md`

---

## Cross-References

### Docs → Skills

| Documento | Skills que o utilizam |
|---|---|
| `foundations/01_DESIGN_SYSTEM.md` | `foundations/*` |
| `foundations/02_TYPOGRAPHY.md` | `foundations/*` |
| `foundations/03_COLOR_SYSTEM.md` | `foundations/*`, `accessibility/*` |
| `foundations/04_SPACING_GRID.md` | `foundations/*`, `layout/*` |
| `foundations/05_ICONOGRAPHY.md` | `foundations/*` |
| `ux-ui/03_MOTION_GUIDELINES.md` | `motion/*` |
| `ux-ui/04_ACCESSIBILITY_GUIDE.md` | `accessibility/*` |
| `ux-ui/05_RESPONSIVE_STRATEGY.md` | `layout/*` |
| `seo/01_SEO_TECHNICAL.md` | `seo/*` |
| `seo/05_SEO_CHECKLIST.md` | `seo/*`, `quality/*` |
| `components/01_HERO_PATTERNS.md` | `components/*`, `motion/*` |
| `components/06_CONVERSION_ELEMENTS.md` | `components/*`, `motion/*` |
| `saas/01_AUTH_PATTERNS.md` | `saas/*` |
| `saas/03_DASHBOARD_PATTERNS.md` | `saas/*`, `layout/*` |
| `performance/01_CORE_WEB_VITALS.md` | `performance/*` |
| `security/01_SECURITY_CHECKLIST.md` | `quality/*` |
| `ai-assets/AI_TOOLS_GUIDE.md` | `ai-assets/*` |

### Docs → Rules

| Documento | Rules que referenciam |
|---|---|
| `foundations/01_DESIGN_SYSTEM.md` | `design/tokens.mdc` |
| `foundations/02_TYPOGRAPHY.md` | `design/typography.mdc` |
| `foundations/03_COLOR_SYSTEM.md` | `design/tokens.mdc` |
| `foundations/04_SPACING_GRID.md` | `design/tokens.mdc`, `design/responsive.mdc` |
| `ux-ui/03_MOTION_GUIDELINES.md` | `design/motion.mdc`, `stack/framer-motion.mdc` |
| `ux-ui/04_ACCESSIBILITY_GUIDE.md` | `quality/accessibility.mdc` |
| `ux-ui/05_RESPONSIVE_STRATEGY.md` | `design/responsive.mdc` |
| `seo/01_SEO_TECHNICAL.md` | `quality/seo.mdc` |
| `seo/03_SEO_PERFORMANCE.md` | `quality/seo.mdc`, `quality/performance.mdc` |
| `components/01_HERO_PATTERNS.md` | `stack/tailwind.mdc`, `stack/framer-motion.mdc` |
| `components/05_FAQ_PATTERNS.md` | `stack/tailwind.mdc`, `quality/seo.mdc` |
| `saas/01_AUTH_PATTERNS.md` | `quality/security.mdc`, `stack/nextjs.mdc` |
| `saas/04_BILLING_PATTERNS.md` | `quality/security.mdc` |
| `performance/01_CORE_WEB_VITALS.md` | `quality/performance.mdc` |
| `security/01_SECURITY_CHECKLIST.md` | `quality/security.mdc` |
| `security/03_AUTH_SECURITY.md` | `quality/security.mdc`, `stack/nextjs.mdc` |
| `templates/COMPONENT_TEMPLATE.md` | `core/01-typescript.mdc`, `core/02-code-style.mdc` |
| `templates/PAGE_TEMPLATE.md` | `stack/nextjs.mdc`, `quality/seo.mdc` |

### Novos na v2.1

| # | Documento | Prioridade | Descricao |
|---|---|---|---|
| — | `ux-ui/06_TRUST_LEGAL_UX.md` | IMPORTANT | Confianca, paginas legais, consent |
| — | `seo/06_INTERNATIONAL_SEO.md` | IMPORTANT | i18n, hreflang, RTL |
| — | `performance/05_MEDIA_EMBEDS.md` | IMPORTANT | Video, iframes, LCP |
| — | `conversion/01_CRO_HEURISTICS.md` | IMPORTANT | CRO etico |
| — | `deployment/01_PREVIEW_PRODUCTION_SEO.md` | IMPORTANT | noindex em previews |
| — | `operations/01_RUM_AND_WEB_VITALS.md` | STANDARD | RUM e privacidade |
| — | `brand/01_VOICE_AND_TONE.md` | IMPORTANT | Voz de marca |
| — | `examples/gold-landing-spec.md` | CRITICAL | Spec canonica de landing |
| — | `solutions/README.md` | STANDARD | Como registar solucoes |

---

## Como Adicionar Nova Documentacao

1. Escolha a categoria correta ou crie uma nova pasta em `docs/`
2. Nomeie o arquivo seguindo o padrao da categoria:
   - Numerado: `NN_NOME_DO_DOC.md` (ex: `06_NEW_TOPIC.md`)
   - Nao-numerado: `NOME_DO_DOC.md` (para references, decisions, templates)
   - JSON prompts: `nome-descritivo.json` (para ai-assets)
3. Adicione frontmatter YAML: `id`, `title`, `category`, `priority`, `description`
4. Adicione o doc nesta tabela na posicao correta da categoria
5. Atualize a contagem na tabela de categorias
6. Adicione cross-references para skills e rules relevantes
7. Atualize o guia de navegacao se necessario
