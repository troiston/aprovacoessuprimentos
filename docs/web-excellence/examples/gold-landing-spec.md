---
id: doc-gold-landing-spec
title: Especificacao canonica — landing gold
version: 2.1
last_updated: 2026-04-08
category: examples
priority: critical
related:
  - docs/web-excellence/DOCS_INDEX.md
---

# Landing gold (especificacao)

## Secoes (ordem sugerida)

1. Navbar + skip link
2. Hero (H1, sub, CTA, prova social leve, visual otimizado LCP)
3. Logos / social proof
4. Features (grid)
5. Story ou caso de uso
6. Pricing (se aplicavel)
7. FAQ + JSON-LD FAQPage
8. CTA final
9. Footer

## Metadata

- title unico; description; OG; Twitter; canonical; JSON-LD Organization + WebSite.

## Budgets

- First Load JS < 200KB (alvo framework); LCP < 2.5s lab; CLS < 0.1.

## Verificacao

- `npm run verify` + Lighthouse + `/audit-full`.
