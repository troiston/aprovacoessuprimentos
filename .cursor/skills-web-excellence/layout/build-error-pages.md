---
id: skill-build-error-pages
title: "Error Pages (404 / 500)"
agent: 03-builder
version: 1.0
category: layout
priority: important
requires:
  - skill: skill-build-design-tokens
  - rule: design/tokens
provides:
  - not-found.tsx e error.tsx alinhados à marca
used_by:
  - agent: 03-builder
  - command: new-page
---

# Error Pages (404 / 500)

## Objetivo

Páginas `not-found.tsx` e `error.tsx` (App Router) com hierarquia clara, CTA de retorno, sem LCP pesado.

## Checklist

- `not-found`: status 404, H1 único, link para home e busca opcional.
- `error`: boundary client se necessário; mensagem humana; retry.
- Imagens: `next/image` sem `priority` excessivo; ilustração leve ou SVG.
- Metadata: title/description adequados em `not-found` via layout ou página dedicada.
- `robots`: não indexar páginas de erro duplicadas como conteúdo fino (evitar URLs inventadas).

## Referência

- Rules: `quality/seo.mdc`, `quality/accessibility.mdc`
