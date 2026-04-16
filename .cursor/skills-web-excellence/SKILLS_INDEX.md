---
id: index-skills
title: Indice de Skills
version: 2.1
last_updated: 2026-04-08
---

# Skills Index — Web Excellence Framework v2.0

> Referencia de todas as **71** skills (v2.1). Lista machine-readable: [docs/web-excellence/framework-manifest.json](../../docs/web-excellence/framework-manifest.json).
> Cada skill e uma unidade de conhecimento especializado que agents e commands invocam.

## Categorias de Skills

| Categoria | Pasta | Qtd | Proposito |
|---|---|---|---|
| **Foundations** | `foundations/` | 4 | Design tokens, cores OKLCH, tipografia fluida, espacamento e grid |
| **Design** | `design/` | 1 | Direcao visual, anti-generico, brief de marca |
| **Layout** | `layout/` | 7 | Hero, navbar, footer, sidebar, grid, error pages, artigo/blog |
| **Components** | `components/` | 12 | CTA, forms, pricing, FAQ, legal, waitlist, story, announcement, etc. |
| **Motion** | `motion/` | 4 | Scroll animations, loading states, micro-interacoes, page transitions |
| **SEO** | `seo/` | 9 | Meta, JSON-LD, OG, sitemap, breadcrumbs, i18n, RSS, preview, RTL |
| **AI Assets** | `ai-assets/` | 8 | Prompts IA, copy, voz de marca |
| **SaaS** | `saas/` | 8 | Auth, dashboard, onboarding, billing, empty states, notifications, RBAC, settings |
| **Performance** | `performance/` | 6 | Imagens, video embeds, LCP, bundle, fonts, loading strategy |
| **Accessibility** | `accessibility/` | 4 | WCAG audit, ARIA labels, contraste, skip navigation |
| **Quality** | `quality/` | 8 | Pre-deploy, seguranca, testes, consent, anti-spam, CRO, QA visual |

**Total: 71 skills** — validar com `npm run verify:framework`

---

## Tabela Completa de Skills

### Foundations (4 skills)

| # | Skill | Arquivo | Prioridade | Requires | Provides | Usado por |
|---|---|---|---|---|---|---|
| 01 | build-design-tokens | `foundations/build-design-tokens.md` | CRITICAL | — | globals.css com @theme | 02-designer, `/init-tokens` |
| 02 | build-color-system | `foundations/build-color-system.md` | CRITICAL | skill-build-design-tokens | paleta de cores OKLCH completa | 02-designer |
| 03 | build-typography-scale | `foundations/build-typography-scale.md` | CRITICAL | skill-build-design-tokens | escala tipografica fluida | 02-designer |
| 04 | build-spacing-grid | `foundations/build-spacing-grid.md` | IMPORTANT | skill-build-design-tokens | sistema de grid e escala de espacamento | 02-designer |

### Layout (5 skills)

| # | Skill | Arquivo | Prioridade | Requires | Provides | Usado por |
|---|---|---|---|---|---|---|
| 05 | build-hero | `layout/build-hero.md` | CRITICAL | skill-build-design-tokens, skill-build-typography-scale | Hero component com 4 variantes | 03-builder, `/new-page`, `/new-section` |
| 06 | build-navbar | `layout/build-navbar.md` | CRITICAL | skill-build-design-tokens | componente navbar responsivo | 03-builder |
| 07 | build-grid-layout | `layout/build-grid-layout.md` | IMPORTANT | skill-build-design-tokens, skill-build-spacing-grid | componente bento grid layout | 03-builder, `/new-section` |
| 08 | build-footer | `layout/build-footer.md` | IMPORTANT | skill-build-design-tokens | componente footer | 03-builder |
| 09 | build-sidebar | `layout/build-sidebar.md` | IMPORTANT | skill-build-design-tokens | sidebar de navegacao para dashboards SaaS | 03-builder, `/new-page` |

### Components (8 skills)

| # | Skill | Arquivo | Prioridade | Requires | Provides | Usado por |
|---|---|---|---|---|---|---|
| 10 | build-cta | `components/build-cta.md` | CRITICAL | skill-build-design-tokens | componente CTA reutilizavel com variantes e micro-interacoes | 03-builder, `/new-page` |
| 11 | build-social-proof | `components/build-social-proof.md` | CRITICAL | skill-build-cta | componentes de prova social (logo bar, badges, counters) | 03-builder, `/new-page` |
| 12 | build-form | `components/build-form.md` | CRITICAL | skill-build-cta | formularios acessiveis com validacao Zod e floating labels | 03-builder, `/new-page` |
| 13 | build-pricing-table | `components/build-pricing-table.md` | CRITICAL | skill-build-cta | tabela de precos com toggle anual/mensal e psicologia de conversao | 03-builder, `/new-page` |
| 14 | build-feature-grid | `components/build-feature-grid.md` | IMPORTANT | skill-build-cta | grid de features com hover, bento layout e animacoes staggered | 03-builder, `/new-page` |
| 15 | build-faq | `components/build-faq.md` | IMPORTANT | skill-build-cta | accordion FAQ acessivel com JSON-LD FAQPage auto-gerado | 03-builder, 04-seo-specialist, `/new-page` |
| 16 | build-testimonials | `components/build-testimonials.md` | IMPORTANT | skill-build-social-proof | 3 padroes de testimonials (featured, strip, wall of love) | 03-builder, `/new-page` |
| 17 | build-comparison-table | `components/build-comparison-table.md` | STANDARD | skill-build-cta | tabela comparativa "vs concorrentes" responsiva com sticky header | 03-builder, `/new-page` |

### Motion (4 skills)

| # | Skill | Arquivo | Prioridade | Requires | Provides | Usado por |
|---|---|---|---|---|---|---|
| 18 | build-scroll-animation | `motion/build-scroll-animation.md` | IMPORTANT | skill-build-design-tokens | animacoes scroll-triggered reutilizaveis (fade-up, stagger, parallax) | 03-builder, `/new-page` |
| 19 | build-loading-state | `motion/build-loading-state.md` | IMPORTANT | skill-build-design-tokens | skeleton screens, spinners, progress bars e shimmer effects | 03-builder, `/new-page` |
| 20 | build-micro-interaction | `motion/build-micro-interaction.md` | IMPORTANT | skill-build-design-tokens | micro-interacoes reutilizaveis (hover, click, focus, toggle, tooltip) | 03-builder, `/new-page` |
| 21 | build-page-transition | `motion/build-page-transition.md` | STANDARD | skill-build-scroll-animation | transicoes de pagina com AnimatePresence no Next.js App Router | 03-builder, `/new-page` |

### SEO (5 skills)

| # | Skill | Arquivo | Prioridade | Requires | Provides | Usado por |
|---|---|---|---|---|---|---|
| 22 | write-meta-tags | `seo/write-meta-tags.md` | CRITICAL | — | metadata completa Next.js | 04-seo-specialist, `/new-page` |
| 23 | generate-schema | `seo/generate-schema.md` | CRITICAL | — | json-ld structured data | 04-seo-specialist, `/new-page` |
| 24 | generate-og-image | `seo/generate-og-image.md` | IMPORTANT | skill-write-meta-tags | dynamic OG images | 04-seo-specialist, 05-asset-creator, `/new-page` |
| 25 | write-sitemap | `seo/write-sitemap.md` | IMPORTANT | — | sitemap XML | 04-seo-specialist, `/audit-seo` |
| 26 | build-breadcrumbs | `seo/build-breadcrumbs.md` | STANDARD | skill-generate-schema | breadcrumb navigation | 04-seo-specialist, `/new-page` |

### AI Assets (7 skills)

| # | Skill | Arquivo | Prioridade | Requires | Provides | Usado por |
|---|---|---|---|---|---|---|
| 27 | gen-copy-headline | `ai-assets/gen-copy-headline.md` | IMPORTANT | — | conversion headlines | 05-asset-creator, `/new-page` |
| 28 | gen-image-prompt | `ai-assets/gen-image-prompt.md` | IMPORTANT | — | structured image prompts | 05-asset-creator, `/gen-image` |
| 29 | gen-video-prompt | `ai-assets/gen-video-prompt.md` | IMPORTANT | skill-gen-image-prompt | structured video prompts | 05-asset-creator, `/gen-image` |
| 30 | gen-copy-description | `ai-assets/gen-copy-description.md` | STANDARD | skill-gen-copy-headline | meta descriptions | 05-asset-creator, `/new-page` |
| 31 | gen-og-image-prompt | `ai-assets/gen-og-image-prompt.md` | STANDARD | skill-generate-og-image | OG image JSX templates | 05-asset-creator, `/gen-image` |
| 32 | gen-professional-portrait | `ai-assets/gen-professional-portrait.md` | IMPORTANT | skill-gen-image-prompt | studio-quality portrait prompts | 05-asset-creator, `/gen-image` |
| 33 | upscale-image-web-pipeline | `ai-assets/upscale-image-web-pipeline.md` | IMPORTANT | skill-optimize-images | image upscale + web format pipeline | 05-asset-creator, 06-qa-auditor, `/gen-image` |

### SaaS (8 skills)

| # | Skill | Arquivo | Prioridade | Requires | Provides | Usado por |
|---|---|---|---|---|---|---|
| 34 | build-auth-flow | `saas/build-auth-flow.md` | CRITICAL | — | auth screens | 03-builder, `/new-page` |
| 35 | build-dashboard-layout | `saas/build-dashboard-layout.md` | CRITICAL | skill-build-auth-flow | dashboard layout | 03-builder, `/new-page` |
| 36 | build-onboarding | `saas/build-onboarding.md` | IMPORTANT | skill-build-auth-flow | onboarding wizard | 03-builder, `/new-page` |
| 37 | build-billing-page | `saas/build-billing-page.md` | IMPORTANT | skill-build-dashboard-layout | pricing tiers | 03-builder, `/new-page` |
| 38 | build-empty-states | `saas/build-empty-states.md` | IMPORTANT | — | empty state components | 03-builder, `/new-page` |
| 39 | build-notification-system | `saas/build-notification-system.md` | STANDARD | — | toast notifications | 03-builder, `/new-page` |
| 40 | build-role-based-access | `saas/build-role-based-access.md` | STANDARD | skill-build-auth-flow | RBAC middleware | 03-builder, `/new-page` |
| 41 | build-settings-page | `saas/build-settings-page.md` | STANDARD | skill-build-dashboard-layout | settings tabs | 03-builder, `/new-page` |

### Performance (5 skills)

| # | Skill | Arquivo | Prioridade | Requires | Provides | Usado por |
|---|---|---|---|---|---|---|
| 42 | optimize-images | `performance/optimize-images.md` | CRITICAL | — | imagens otimizadas com AVIF/WebP | 06-qa-auditor, `/audit-full` |
| 43 | optimize-lcp | `performance/optimize-lcp.md` | CRITICAL | skill-optimize-images, skill-optimize-fonts | LCP abaixo de 2.5s | 06-qa-auditor, `/audit-full` |
| 44 | optimize-bundle | `performance/optimize-bundle.md` | IMPORTANT | — | bundle size dentro do budget (<200KB first load JS) | 06-qa-auditor, `/audit-full` |
| 45 | optimize-fonts | `performance/optimize-fonts.md` | IMPORTANT | — | fontes otimizadas com zero CLS | 06-qa-auditor, `/audit-full` |
| 46 | build-loading-strategy | `performance/build-loading-strategy.md` | IMPORTANT | — | loading states em todas as rotas | 03-builder, `/new-page` |

### Accessibility (4 skills)

| # | Skill | Arquivo | Prioridade | Requires | Provides | Usado por |
|---|---|---|---|---|---|---|
| 47 | audit-a11y | `accessibility/audit-a11y.md` | CRITICAL | — | checklist WCAG 2.2 AA completo | 06-qa-auditor, `/audit-full` |
| 48 | fix-aria-labels | `accessibility/fix-aria-labels.md` | IMPORTANT | skill-audit-a11y | elementos interativos com labels corretos | 06-qa-auditor, `/audit-full` |
| 49 | fix-contrast | `accessibility/fix-contrast.md` | IMPORTANT | skill-audit-a11y | todos os pares texto/fundo com contraste WCAG AA | 06-qa-auditor, `/audit-full` |
| 50 | build-skip-navigation | `accessibility/build-skip-navigation.md` | STANDARD | — | skip navigation como primeiro elemento focavel | 03-builder, `/new-page` |

### Quality (4 skills)

| # | Skill | Arquivo | Prioridade | Requires | Provides | Usado por |
|---|---|---|---|---|---|---|
| 51 | pre-deploy-check | `quality/pre-deploy-check.md` | CRITICAL | skill-audit-a11y, skill-audit-security, skill-optimize-lcp, skill-optimize-bundle | checklist completo pre-deploy | 06-qa-auditor, `/audit-full` |
| 52 | audit-security | `quality/audit-security.md` | IMPORTANT | — | headers de seguranca verificados | 06-qa-auditor, `/audit-full` |
| 53 | write-unit-tests | `quality/write-unit-tests.md` | IMPORTANT | — | testes unitarios com Vitest + Testing Library | 06-qa-auditor, `/audit-full` |
| 54 | write-e2e-tests | `quality/write-e2e-tests.md` | IMPORTANT | skill-write-unit-tests | testes E2E com Playwright para fluxos criticos | 06-qa-auditor, `/audit-full` |

---

## Skills adicionadas na v2.1

| ID | Arquivo |
|---|---|
| skill-build-error-pages | `layout/build-error-pages.md` |
| skill-build-legal-pages | `components/build-legal-pages.md` |
| skill-build-consent-analytics | `quality/build-consent-analytics.md` |
| skill-optimize-video-embeds | `performance/optimize-video-embeds.md` |
| skill-build-i18n-routing | `seo/build-i18n-routing.md` |
| skill-build-article-layout | `layout/build-article-layout.md` |
| skill-build-waitlist-flow | `components/build-waitlist-flow.md` |
| skill-build-announcement-bar | `components/build-announcement-bar.md` |
| skill-build-rss-feed | `seo/build-rss-feed.md` |
| skill-build-preview-seo | `seo/build-preview-seo.md` |
| skill-form-rate-limit-spam | `quality/form-rate-limit-spam.md` |
| skill-build-rtl-layout | `seo/build-rtl-layout.md` |
| skill-build-visual-direction | `design/build-visual-direction.md` |
| skill-build-story-section | `components/build-story-section.md` |
| skill-visual-regression-checklist | `quality/visual-regression-checklist.md` |
| skill-build-brand-voice-microcopy | `ai-assets/build-brand-voice-microcopy.md` |
| skill-audit-conversion-checklist | `quality/audit-conversion-checklist.md` |
| skill-gen-professional-portrait | `ai-assets/gen-professional-portrait.md` |
| skill-upscale-image-web-pipeline | `ai-assets/upscale-image-web-pipeline.md` |

Dependencias finas entre estas skills estao no [manifest JSON](../../docs/web-excellence/framework-manifest.json). Regenerar: `npm run manifest`.

---

## Grafo de Dependencias

As skills possuem dependencias que determinam a ordem de execucao. Uma skill so pode ser invocada se suas dependencias ja foram resolvidas.

```
NIVEL 0 — Sem dependencias (podem rodar a qualquer momento)
├── skill-build-design-tokens
├── skill-write-meta-tags
├── skill-generate-schema
├── skill-write-sitemap
├── skill-gen-copy-headline
├── skill-gen-image-prompt
├── skill-build-auth-flow
├── skill-build-empty-states
├── skill-build-notification-system
├── skill-optimize-images
├── skill-optimize-bundle
├── skill-optimize-fonts
├── skill-build-loading-strategy
├── skill-audit-a11y
├── skill-build-skip-navigation
├── skill-audit-security
└── skill-write-unit-tests

NIVEL 1 — Dependem de skills nivel 0
├── skill-build-color-system ← skill-build-design-tokens
├── skill-build-typography-scale ← skill-build-design-tokens
├── skill-build-spacing-grid ← skill-build-design-tokens
├── skill-build-navbar ← skill-build-design-tokens
├── skill-build-footer ← skill-build-design-tokens
├── skill-build-sidebar ← skill-build-design-tokens
├── skill-build-cta ← skill-build-design-tokens
├── skill-build-scroll-animation ← skill-build-design-tokens
├── skill-build-loading-state ← skill-build-design-tokens
├── skill-build-micro-interaction ← skill-build-design-tokens
├── skill-generate-og-image ← skill-write-meta-tags
├── skill-build-breadcrumbs ← skill-generate-schema
├── skill-gen-video-prompt ← skill-gen-image-prompt
├── skill-gen-copy-description ← skill-gen-copy-headline
├── skill-build-dashboard-layout ← skill-build-auth-flow
├── skill-build-onboarding ← skill-build-auth-flow
├── skill-build-role-based-access ← skill-build-auth-flow
├── skill-fix-aria-labels ← skill-audit-a11y
├── skill-fix-contrast ← skill-audit-a11y
├── skill-write-e2e-tests ← skill-write-unit-tests
└── skill-optimize-lcp ← skill-optimize-images, skill-optimize-fonts

NIVEL 2 — Dependem de skills nivel 1
├── skill-build-hero ← skill-build-design-tokens, skill-build-typography-scale
├── skill-build-grid-layout ← skill-build-design-tokens, skill-build-spacing-grid
├── skill-build-social-proof ← skill-build-cta
├── skill-build-form ← skill-build-cta
├── skill-build-pricing-table ← skill-build-cta
├── skill-build-feature-grid ← skill-build-cta
├── skill-build-faq ← skill-build-cta
├── skill-build-comparison-table ← skill-build-cta
├── skill-build-page-transition ← skill-build-scroll-animation
├── skill-gen-og-image-prompt ← skill-generate-og-image
├── skill-build-billing-page ← skill-build-dashboard-layout
├── skill-build-settings-page ← skill-build-dashboard-layout
└── skill-pre-deploy-check ← skill-audit-a11y, skill-audit-security, skill-optimize-lcp, skill-optimize-bundle

NIVEL 3 — Dependem de skills nivel 2
└── skill-build-testimonials ← skill-build-social-proof
```

---

## Legendas de Prioridade

| Prioridade | Significado | Comportamento |
|---|---|---|
| **CRITICAL** | Essencial para o funcionamento correto do framework | Sempre carregada quando o agent correspondente esta ativo |
| **IMPORTANT** | Necessaria para qualidade profissional | Carregada automaticamente em builds de producao |
| **STANDARD** | Recomendada para excelencia | Carregada conforme necessidade e contexto |

## Como Adicionar Novas Skills

1. Escolha a categoria correta (ou crie nova pasta se necessario)
2. Crie o arquivo `.md` com frontmatter YAML valido contendo: `id`, `title`, `category`, `priority`, `requires`, `provides`
3. Adicione a skill nesta tabela na posicao correta
4. Atualize o grafo de dependencias se houver novas relacoes
5. Registre quais agents e commands utilizam a nova skill
