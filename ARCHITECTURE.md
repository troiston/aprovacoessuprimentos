# ARCHITECTURE.md — Project Structure & Conventions

> Read this file **before** touching any code. It defines how layers interact, naming conventions, and architectural decisions.

**Companion docs:** [`AGENT.md`](AGENT.md) (operational rules), [`docs/DOCS_INDEX.md`](docs/DOCS_INDEX.md) (phase status and gates).

## Ciclo de vida

- **Fase 2 (`/spec`):** gerado ou **atualizado de forma obrigatória** quando a estrutura técnica é definida em `docs/06_SPECIFICATION.md` (pastas, camadas, integrações, convenções alinhadas ao código real).
- **Fase 3 (implementação):** **refinado** à medida que a implementação avança (novos módulos, `src/lib/services`, rotas API, mudanças de stack ou de limites de camada).
- Mantém paridade com o repositório; decisões pontuais de alto impacto devem ter ADR em `docs/decisions/` quando aplicável.

---

## Project Type

SaaS application built with **Next.js 16** (App Router), **React 19**, **TypeScript strict**, **Tailwind CSS v4**, **shadcn/ui**, **Prisma 7** + PostgreSQL, **Stripe** (webhooks opcionais), e **autenticação interna** por sessão (cookie + tabela `Session`) com bcrypt — não depende de Clerk/Better Auth em runtime para o app Incorporação.

---

## Layer Structure

> **Nota:** este projeto usa a convenção `src/` do Next.js. Sempre leia caminhos como `src/app`, `src/components`, etc.

```
src/app/                      # Next.js App Router
├── (marketing)/              # Public-facing pages (landing, pricing, terms)
│   ├── layout.tsx            # Transparent navbar + footer
│   └── page.tsx              # Landing page (homepage)
├── (app)/                    # Authenticated application
│   ├── layout.tsx            # Sidebar + topbar dashboard layout
│   └── dashboard/page.tsx
├── (auth)/                   # Authentication flows
│   ├── layout.tsx            # Minimal centered layout
│   ├── login/page.tsx
│   └── register/page.tsx     # UI pode existir; rota desativada no middleware → /login
├── api/                      # Route handlers
│   ├── auth/*                # login, logout, me
│   ├── developments/*        # CRUD leitura/mutação por slug
│   ├── tasks/*               # tarefas + my
│   ├── audit/                # leitura log (EDITOR+)
│   ├── settings/mail/        # SMTP cifrado (ADMIN)
│   ├── mail/*                # test/send (ADMIN)
│   └── webhooks/stripe/route.ts
├── layout.tsx                # Root layout
├── globals.css               # Tailwind v4 @theme + design tokens
└── styleguide/page.tsx       # Design system preview (Phase 1d)

src/
├── components/
│   ├── ui/                   # shadcn/ui primitives (Button, Dialog, etc.)
│   ├── marketing/            # Landing page components (Hero, Pricing, etc.)
│   └── app/                  # Dashboard/app-specific components
├── lib/
│   ├── db.ts                 # Prisma client singleton
│   ├── stripe.service.ts     # Stripe billing operations
│   └── env.ts                # Zod-validated environment variables
├── hooks/                    # Custom React hooks
└── types/                    # Shared TypeScript types

prisma/
├── schema.prisma             # Database schema
└── migrations/               # Migration history

docs/                         # VibeCoding framework documentation
scripts/                      # Automation scripts
.cursor/                      # Cursor IDE configuration (rules, commands, hooks)
```

---

## Layer Interaction Rules

1. **Components never access Prisma directly** — delegate to services in `src/lib/`.
2. **Route handlers delegate logic** to services — handlers parse input, call the service, return the response.
3. **Shared types live in `src/types/`** — avoid duplicating type definitions across files.
4. **UI primitives (shadcn) in `src/components/ui/`** — domain components in `marketing/` or `app/`.
5. **Server Components by default** — use `"use client"` only when needed (interactivity, hooks, browser APIs).
6. **Zod validation at every boundary** — API inputs, form submissions, environment variables (`src/lib/env.ts`).
7. **Error boundaries and Suspense** — use in route group layouts where async data or client islands need clear loading/error UX.

---

## Key Conventions

### TypeScript

- Strict mode, no `any` — prefer `unknown` + narrowing or Zod inference (`z.infer<typeof Schema>`).
- Prefer `interface` for public object shapes, `type` for unions, intersections, and mapped types.
- Export types alongside implementations when they are part of the public API of a module.

### Styling

- Tailwind CSS v4 with CSS-first configuration (`@theme` in `app/globals.css`).
- OKLCH color space for design tokens where possible.
- Dark mode via `class` strategy from the start.
- Respect `prefers-reduced-motion` for non-essential animations.

### Data Flow

- **Server Actions** for mutations initiated from Server Components when appropriate.
- **`app/api/` route handlers** for webhooks, third-party callbacks, and integrations that cannot use Server Actions.
- **Prisma** for all database access through the singleton in `src/lib/db.ts`.

### Security

- Never hardcode secrets — validate and read via `src/lib/env.ts` (Zod).
- **Webhook signature verification** is mandatory (e.g. Stripe HMAC-SHA256).
- Rate limiting on public or abuse-prone API endpoints.
- **LGPD / privacy:** minimize collection, document purpose, retention, and access.

### Quality Gates (before merge / phase close)

- `npm run typecheck` after structural changes.
- `npm run lint` for touched scope.
- Tests relevant to the changed flows; `bash scripts/verify-docs.sh` when closing a documentation phase.

---

## File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Hero.tsx`, `PricingCard.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth.ts`, `useSubscription.ts` |
| Services | kebab-case.service.ts | `stripe.service.ts`, `user.service.ts` |
| Types | kebab-case.types.ts | `user.types.ts`, `billing.types.ts` |
| Route folders | kebab-case | `app/api/webhooks/stripe/route.ts` |
| Utilities | kebab-case | `format-date.ts`, `cn.ts` |

---

## File Size Limits

- **300–500 lines** maximum per file — split when growing beyond that.
- **`index.ts`** in folders to control public exports.
- **`README.md`** in complex folders to state purpose and boundaries.

---

## Documentation Reference

Phase docs use sequential numbering (`00`–`13`, etc.) aligned with execution order in [`docs/DOCS_INDEX.md`](docs/DOCS_INDEX.md). Support docs may use an `S` prefix (e.g. skills index), operations `OPS`, internal `INT` — see the index for the canonical list.

**Release:** pre-merge / pre-deploy checklist lives in **`docs/13_RELEASE_READINESS.md`** (not to be confused with optional command-specific filenames in Cursor prompts).

---

## Orchestrator Layer

O projeto suporta uma camada de orquestração acima do pipeline por fase com o comando `/orchestrate`.

- **Responsabilidade:** decompor `docs/01_PRD.md` em slices verticais e coordenar delegações.
- **Execução:** acionar skills/agentes por fase sem quebrar os gates globais definidos em `WORKFLOW.md`.
- **Controle de contexto:** enviar contexto mínimo por worker (context pruning) para reduzir custo de tokens.
- **Observabilidade:** consolidar métricas em `docs/ORCHESTRATOR_METRICS.md` e aprendizados em `docs/ORCHESTRATOR_LEARNINGS.md`.
- **Segurança operacional:** decisões críticas continuam com human-in-the-loop.
