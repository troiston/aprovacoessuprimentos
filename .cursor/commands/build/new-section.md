---
id: cmd-new-section
title: Criar secção de página
version: 2.0
last_updated: 2026-04-08
category: build
agent: 03-builder
skills:
  - layout/build-hero
  - components/build-feature-grid
---

# `/new-section [tipo] [briefing]`

Gera uma única secção (componente em `src/components/sections/`) para importar numa `page.tsx`.

## Tipos sugeridos

`hero` · `features` · `pricing` · `faq` · `cta` · `testimonials` · `social-proof` · `comparison` · `story` · `legal`

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `tipo` | Sim | Tipo da secção |
| `briefing` | Sim | Copy, dados, layout desejado |

## Exemplo

```
/new-section faq "FAQ produto: 8 perguntas sobre faturação e segurança; JSON-LD FAQPage"
```
