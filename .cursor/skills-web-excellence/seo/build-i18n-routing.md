---
id: skill-build-i18n-routing
title: "i18n routing e metadata"
agent: 04-seo-specialist
version: 1.0
category: seo
priority: important
requires:
  - skill: skill-write-meta-tags
  - rule: stack/nextjs
provides:
  - Estrutura de locale, alternates e hreflang
used_by:
  - agent: 04-seo-specialist
  - command: init-project
---

# i18n routing

## Next.js

- Segmento `[locale]` ou domínio separado; `generateStaticParams` quando aplicável.
- `alternates.languages` em `generateMetadata`; canonical por locale.
- Evitar conteúdo duplicado: uma URL canónica por idioma.

## Conteúdo

- Slugs traduzidos ou estáveis; documentar decisão no ADR.
