---
id: cmd-new-component
title: Criar componente reutilizável
version: 2.0
last_updated: 2026-04-08
category: build
agent: 03-builder
skills:
  - foundations/build-design-tokens
---

# `/new-component [NomePascal] [briefing]`

Cria componente em `src/components/` com TypeScript strict, variantes opcionais (cva ou props), e Server Component por padrão.

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `NomePascal` | Sim | Ex: `PricingCard`, `LogoStrip` |
| `briefing` | Sim | Comportamento, props, estados visuais |
| `--variants` | Não | Ex: `default,compact,featured` |
| `--client` | Não | Forçar `"use client"` quando necessário |

## Regras

- Props tipadas; sem `any`.
- Acessibilidade: roles/labels em interativos.
- Estilos com tokens do `@theme` (Tailwind v4).

## Exemplo

```
/new-component TestimonialCard "Card com quote, avatar, nome, role; variante featured com borda accent"
  --variants default,featured
```
