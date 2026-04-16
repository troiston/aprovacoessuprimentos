# Estrutura de pastas (referência rápida)

Documento de apoio referenciado em [`.cursor/agents/AGENTS_INDEX.md`](../.cursor/agents/AGENTS_INDEX.md) na transição **architect → designer**.

## Raiz da aplicação Next.js

| Caminho | Conteúdo |
|---------|----------|
| `src/app/` | App Router — layouts, páginas, route handlers |
| `src/app/(marketing)/` | Landing e páginas públicas de marketing |
| `src/app/(auth)/` | Login, registo |
| `src/app/(app)/` | Área autenticada (ex.: dashboard) |
| `src/app/api/` | Route handlers (REST, webhooks) |
| `src/components/` | Componentes React reutilizáveis |
| `src/lib/` | Serviços, env, cliente Prisma (`db.ts`) |
| `prisma/` | `schema.prisma` e migrações |
| `e2e/` | Testes Playwright |
| `scripts/` | Gates (`verify-docs`, `verify-framework`, etc.) |
| `docs/` | Documentação VibeCoding (fases 00–13) |
| `docs/web-excellence/` | Guias Web Excellence (SEO, UX, segurança de páginas) |

## Cursor (framework)

| Caminho | Conteúdo |
|---------|----------|
| `.cursor/rules/` | Rules `.mdc` (core, stack, quality, design, domain, security) |
| `.cursor/skills/` | Skills VibeCoding (`SKILL.md` por pasta) |
| `.cursor/skills-web-excellence/` | Skills Web Excellence (grafo `id: skill-*`) |
| `.cursor/commands/` | Comandos slash (PRO na raiz + Web em subpastas) |
| `.cursor/agents/` | Agentes especializados + `AGENTS_INDEX.md` |

Ao alterar fronteiras de módulos ou criar novos route groups, atualizar este ficheiro e, se aplicável, um ADR em `docs/decisions/`.
