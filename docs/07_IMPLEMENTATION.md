# 07_IMPLEMENTATION.md — Implementação (Incorporação)

> **Fase:** 3 — Implementação  
> **Depende de:** `docs/06_SPECIFICATION.md`  
> **Status:** Em andamento  
> **Última atualização:** 15/04/2026

---

## Visão geral

Aplicação interna Next.js (App Router) + Prisma 7 + PostgreSQL. Autenticação por sessão (cookie `incorporacao_session`, tabela `Session`) e bcrypt em `User.passwordHash`. RBAC: `VIEWER` / `EDITOR` / `ADMIN` via `src/lib/domain/permissions.ts`.

---

## Backend — decisões recentes

| Decisão | Detalhe |
|---------|---------|
| Auditoria | `appendAuditLog` em `src/lib/audit/audit-log.service.ts`, append-only, mesma transação Prisma que mutações críticas |
| API auth | `requireEditorForApi()` em `src/lib/api/route-auth.ts` para mutações (401/403) |
| Rotas dinâmicas | Empreendimentos identificados por **`slug`** na URL (`/api/developments/[slug]/...`) |

---

## Comandos

```bash
npm run dev
npm run typecheck
npm run lint
npm run test
npm run db:migrate
npm run db:seed
bash scripts/verify-docs.sh
```

---

## Contratos HTTP (parcial)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/auth/login` | POST | Login e-mail/senha |
| `/api/auth/logout` | POST | Invalidar sessão |
| `/api/auth/me` | GET | Utilizador atual |
| `/api/developments` | GET | Lista com métricas |
| `/api/developments/[slug]` | GET | Detalhe painel |
| `/api/developments/[slug]/stages` | PATCH | Atualizar status de etapa (EDITOR+), auditoria |
| `/api/developments` | POST | Criar empreendimento (EDITOR+) |
| `/api/developments/[slug]` | PATCH, DELETE | Atualizar / soft-delete (EDITOR+) |
| `/api/tasks` | GET, POST | Lista filtrável; criar tarefa (EDITOR+) |
| `/api/tasks/my` | GET | Tarefas do utilizador (não concluídas) |
| `/api/tasks/[taskId]` | PATCH, DELETE | Atualizar / soft-delete (EDITOR+) |
| `/api/audit` | GET | Log recente (EDITOR+) |
| `/api/settings/mail` | GET, PATCH | SMTP mascarado / guardar (ADMIN) |
| `/api/mail/test` | POST | E-mail de teste (ADMIN) |
| `/api/mail/send` | POST | Envio genérico (ADMIN) |

---

## Segredos e e-mail

- `SETTINGS_ENCRYPTION_KEY`: 32 bytes (hex 64 chars ou base64) — cifra `SystemSetting.valueEncrypted` (SMTP e outros).
- SMTP: Nodemailer; credenciais nunca em texto claro na API de leitura (apenas `loadMailSmtpMasked`).

---

## Checklist

- [x] Validação Zod em novas entradas (ex.: `patchDevelopmentStageBodySchema`)
- [x] RBAC em mutação de etapa (403 VIEWER)
- [x] Auditoria em atualização de status de etapa
- [x] CRUD tarefas + APIs + UI Minhas / Todas
- [x] Settings mail + rotas de envio + UI admin
- [x] Página auditoria com dados reais; GET `/api/audit`
- [x] Painel empreendimento: edição de etapa + nova tarefa (client)
- [x] Registo público desativado (`/register` → login)
- [x] `docker/stack.yml` modelo Swarm + `.env.example` com encryption key
- [x] E2E smoke (`e2e/smoke.spec.ts`) — home, login, proteção do dashboard; fluxo login→dashboard quando API responde 200

---

## Testes E2E (Playwright)

- `playwright.config.ts` carrega **`dotenv/config`** — variáveis em `.env` aplicam-se aos testes.
- Senha do utilizador seed (`acesso@digaola.com`): use **`E2E_PASSWORD`** ou **`SEED_ADMIN_PASSWORD`** (a mesma usada em `prisma/seed.ts`).
- Sem DB seedado ou com senha incorreta, o teste de login é **ignorado** (`test.skip`) com mensagem orientativa — não conta como falha.
- Comando: `npm run test:e2e` (sobe `npm run dev` se a porta estiver livre; com servidor antigo em cache, reiniciar o `dev` após mudar `next.config`).

---

## Agentes Cursor (referência operacional)

Para trabalhos grandes, seguir o pipeline em `.cursor/agents/AGENTS_INDEX.md` (ex.: **01-architect** para desenho de API/módulos, **03-builder** para slices verticais, **06-qa-auditor** antes de release). O presente documento regista o estado real; não substitui a spec.
