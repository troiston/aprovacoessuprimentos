---
id: skill-build-article-layout
title: "Layout de artigo / blog"
agent: 03-builder
version: 1.0
category: layout
priority: important
requires:
  - skill: skill-build-design-tokens
  - skill: skill-write-meta-tags
  - rule: quality/seo
provides:
  - Article layout com TOC, tempo de leitura, schema Article
used_by:
  - agent: 03-builder
  - command: new-page
---

# Article layout

## Blocos

- Cabeçalho (H1, meta, autor, data), TOC opcional, corpo tipográfico, CTA final.
- JSON-LD `Article` ou `BlogPosting` alinhado a `skill-generate-schema`.

## MDX

- Componentes de código com contraste; heading ids para âncoras.
