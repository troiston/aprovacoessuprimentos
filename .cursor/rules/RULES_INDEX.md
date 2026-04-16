---
id: index-rules
title: Indice de Rules
version: 2.1
last_updated: 2026-04-08
---

# Indice de Rules — Web Excellence Framework v2.1

> Referencia completa de todas as rules do projeto.
> Carregadas automaticamente pelo Cursor conforme o tipo e globs de cada arquivo.

## Legenda de Prioridade

| Prioridade | Significado |
|---|---|
| **CRITICAL** | Principios inviolaveis — NUNCA podem ser quebrados por nenhuma outra regra, skill ou comando |
| **IMPORTANT** | Regras de stack e qualidade — essenciais para manter o padrao do projeto |
| **STANDARD** | Decisoes de design — aplicadas conforme contexto e criterio do agente |

## Tipos de Ativacao

| Tipo | Comportamento |
|---|---|
| `alwaysApply` | Carregada em TODA interacao, independente do arquivo |
| `globs` | Carregada automaticamente quando o arquivo editado bate com o pattern |
| `agent-decided` | O agente decide quando a regra e relevante baseado na descricao |

---

## Tabela Completa de Rules

| Arquivo | Prioridade | Tipo | Globs | Descricao |
|---|---|---|---|---|
| `core/00-constitution.mdc` | CRITICAL | alwaysApply | `**/*` | Principios fundamentais inviolaveis do Web Excellence Framework |
| `core/01-typescript.mdc` | CRITICAL | alwaysApply | `**/*.ts`, `**/*.tsx` | Padroes TypeScript strict — tipos, validacao, imports e convencoes |
| `core/02-code-style.mdc` | CRITICAL | alwaysApply | `**/*.ts`, `**/*.tsx`, `**/*.css` | Formatacao, nomenclatura e organizacao de codigo |
| `stack/nextjs.mdc` | IMPORTANT | globs | `src/app/**` | Padroes Next.js 16+ App Router — RSC, metadata, routing |
| `stack/tailwind.mdc` | IMPORTANT | globs | `**/*.css`, `**/*.tsx` | Padroes Tailwind CSS v4 — @theme, design tokens, utilities |
| `stack/framer-motion.mdc` | IMPORTANT | agent-decided | `**/*.tsx` | Padroes de animacao — spring physics, AnimatePresence, whileInView |
| `stack/database.mdc` | IMPORTANT | globs | `prisma/**`, `src/server/**` | Padroes Prisma/DB — queries, migrations, singleton |
| `quality/seo.mdc` | IMPORTANT | globs | `src/app/**/page.tsx` | Regras SEO obrigatorias — metadata, JSON-LD, Open Graph |
| `quality/performance.mdc` | IMPORTANT | globs | `src/**/*.tsx` | Regras de performance — Core Web Vitals, bundle size, caching |
| `quality/accessibility.mdc` | IMPORTANT | globs | `src/**/*.tsx` | Regras WCAG 2.2 AA — contraste, keyboard nav, ARIA, touch targets |
| `quality/security.mdc` | IMPORTANT | globs | `src/app/api/**`, `middleware.*` | Regras de seguranca — input validation, CSRF, headers, auth |
| `design/tokens.mdc` | STANDARD | agent-decided | — | Design tokens Tailwind v4 — cores OKLCH, spacing, breakpoints |
| `design/typography.mdc` | STANDARD | agent-decided | — | Tipografia fluida — clamp(), escala Major Third, line-height |
| `design/motion.mdc` | STANDARD | agent-decided | — | Principios de animacao — spring physics, timing, reduced-motion |
| `design/responsive.mdc` | STANDARD | agent-decided | — | Responsividade mobile-first — breakpoints, container queries, fluid |

---

## Hierarquia de Resolucao de Conflitos

Quando duas rules entram em conflito, a de **maior prioridade** vence:

1. **CRITICAL** (core/) — sempre vence
2. **IMPORTANT** (stack/, quality/) — vence sobre STANDARD
3. **STANDARD** (design/) — menor prioridade

Dentro da mesma prioridade, o arquivo com **menor numero** tem precedencia (ex: `00-constitution` > `01-typescript`).

## Rules VibeCoding (produto / dominio)

Alem das rules Web Excellence acima, este repositorio inclui:

| Arquivo | Pasta | Proposito |
|---|---|---|
| `core/project.mdc` | core | Convencoes do projeto VibeCoding |
| `core/vibecoding-phases.mdc` | core | Fases 00-13 e gates de documentacao |
| `domain/api.mdc` | domain | APIs e contratos |
| `domain/marketing.mdc` | domain | Marketing e copy |
| `domain/monetization.mdc` | domain | Monetizacao e Stripe |
| `framework/nextjs.mdc` | framework | Ponteiro para `stack/nextjs.mdc` |
| `framework/typescript.mdc` | framework | TypeScript do stack VibeCoding |
| `security/security.mdc` | security | Seguranca aplicacao |
| `security/secrets.mdc` | security | Segredos e env |

**Precedencia sugerida:** documentos de fase em `docs/` (PRD, spec) para *o que* construir; em seguida `core/vibecoding-phases` + `domain/*`; stack/quality/design Web Excellence para *como* entregar UI e paginas.

## Como Adicionar Novas Rules

1. Escolha a pasta correta: `core/`, `stack/`, `quality/`, `design/`, `domain/` ou `security/`
2. Crie o arquivo `.mdc` com frontmatter YAML valido
3. Atualize esta tabela com a nova entrada
4. Teste se o glob pattern esta correto
