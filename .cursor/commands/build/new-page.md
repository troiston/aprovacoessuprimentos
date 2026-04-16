---
id: cmd-new-page
title: Criar página completa
version: 2.0
last_updated: 2026-04-08
category: build
agent: 03-builder
skills:
  - layout/build-hero
  - layout/build-navbar
  - layout/build-footer
  - seo/write-meta-tags
  - motion/build-scroll-animation
---

# `/new-page [rota] [briefing]`

Cria uma rota em `src/app/` com Server Components, `generateMetadata`, secções compostas e animações `whileInView` onde fizer sentido.

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `rota` | Sim | Caminho sem `src/app` (ex: `sobre`, `produtos/[slug]`) |
| `briefing` | Sim | Objetivo da página, público, tom, secções desejadas |
| `--sections` | Não | Lista: `hero,features,pricing,faq,cta` |
| `--layout` | Não | `default` · `sidebar` · `full-width` · `dashboard` |

## Skills (consultar `.cursor/skills-web-excellence/SKILLS_INDEX.md`)

- `skill-build-hero`, `skill-build-navbar`, `skill-build-footer`, `skill-write-meta-tags`, `skill-generate-schema`, `skill-build-cta`, `skill-build-scroll-animation`

## Fluxo

1. Criar `page.tsx` + `loading.tsx` se necessário.
2. Exportar `generateMetadata` com title, description, openGraph, twitter, canonical.
3. Compor secções; `"use client"` só em ilhas mínimas.
4. Garantir landmarks (`main`, `header`, `footer`) e H1 único.

## Exemplo

```
/new-page precos "Página de preços SaaS B2B, 3 planos, toggle anual"
  --sections hero,pricing,faq,cta
```
