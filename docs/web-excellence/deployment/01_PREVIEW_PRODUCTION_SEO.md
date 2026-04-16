---
id: doc-preview-production-seo
title: SEO em previews vs producao
version: 2.1
last_updated: 2026-04-08
category: deployment
priority: important
related:
  - /.cursor/skills-web-excellence/seo/build-preview-seo.md
---

# Preview e producao

## Previews (Vercel / ambientes temporarios)

- `robots`: `noindex, nofollow` ou equivalente em metadata.
- Nao incluir URLs de preview no `sitemap.ts` de producao.

## Canonical

- Canonical absoluto apontando para producao quando partilha OG for requerida.

## Skill

- `skill-build-preview-seo`
