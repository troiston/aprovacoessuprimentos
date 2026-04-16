---
id: skill-build-preview-seo
title: "SEO em preview deploys"
agent: 07-deploy-manager
version: 1.0
category: seo
priority: important
requires:
  - skill: skill-write-meta-tags
  - rule: quality/seo
provides:
  - noindex em previews, canonical para produção
used_by:
  - agent: 07-deploy-manager
  - command: audit-seo
---

# Preview SEO

## Variáveis

- `VERCEL_ENV` / `NEXT_PUBLIC_SITE_URL`: em preview, `robots: { index: false }` e meta robots noindex.
- Open Graph pode apontar URL de produção para partilhas corretas (documentar trade-off).

## Sitemaps

- Excluir URLs de preview dos sitemaps de produção.
