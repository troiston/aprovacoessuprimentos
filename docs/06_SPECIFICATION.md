# 06_SPECIFICATION.md — Especificação Técnica

> **Skills:** `/using-superpowers` `/spec` `/openapi-spec-generation` `/postgresql-table-design` `/typescript-advanced-types`  
> **Fase:** 2 — Especificação Técnica  
> **Depende de:** `docs/01_PRD.md`, `docs/05_DESIGN.md`, `docs/04_MARKET_AND_REFERENCES.md`  
> **Status:** APROVADO PARA IMPLEMENTAÇÃO (Slice 1 — schema + motor + seed — concluído em 15/04/2026)  
> **Data:** 15/04/2026

---

## 1. Resumo Técnico

Esta SPEC define a implementação end-to-end do sistema interno de incorporação com paridade da planilha, RBAC, auditoria e operação em Docker Swarm.  
O backend será Next.js Route Handlers + Prisma/PostgreSQL, com validação Zod e UI server-first.  
A infraestrutura alvo é Traefik + Portainer + PostgreSQL, com Dragonfly opcional para cache/rate-limit.  
Inclui configuração corporativa de e-mail Microsoft 365 com caixa compartilhada, controle por permissão e trilha de auditoria.

---

## 2. Escopo e Premissas

- **Cobre:** RF-01 a RF-12 (PRD), mais configuração de e-mail corporativo Microsoft 365 na área de Settings.
- **Fora de escopo:** integração ERP (Sienge), automações externas, matriz de dependências de etapas, monetização.
- **Premissas:**
  - Produto single-tenant (uma empresa).
  - Acesso autenticado obrigatório em toda rota `/(app)`.
  - Ambiente produtivo em Docker Swarm com Traefik.
  - SMTP Microsoft com caixa compartilhada exige conta técnica com permissão `Send As`.
- **Bloqueios pendentes:**
  - Definir owner de negócio nominal para aprovação de paridade final.
  - Decidir se e-mail ficará em SMTP OAuth2 primeiro ou já em Graph API (SMTP OAuth2 como baseline).

---

## 3. Rastreabilidade com o PRD

| Requisito PRD | Decisão técnica | Arquivos | Prova de conclusão |
|---|---|---|---|
| RF-01 Empreendimentos | CRUD com soft delete e constraints de nome | `prisma/schema.prisma`, `src/app/api/developments/*` | Teste integração CRUD + filtro de ativos |
| RF-02/03 Etapas e pesos | Cálculo determinístico no backend, com recálculo de pesos globais por fase | `src/lib/domain/progress.ts`, `src/app/api/stages/*` | Teste unitário da fórmula e redistribuição |
| RF-04/05 Status e avanço | `DevelopmentStage.status` enum + agregação `Σ(statusNumérico × pesoGlobal)` | `src/lib/domain/progress.ts`, `src/app/api/developments/[id]/stages/*` | Teste com fixture FIT LAGO AZUL e REALIZE LARANJEIRAS |
| RF-06 Tarefas | CRUD com vínculo obrigatório a empreendimento e etapa | `src/app/api/tasks/*`, `src/lib/validations/task.ts` | Teste integração de criação/edição/listagem |
| RF-07 Painel por empreendimento | Query composta server-side com KPIs e pendências críticas | `src/app/(app)/developments/[id]/page.tsx`, `src/lib/queries/development-dashboard.ts` | Teste de render + snapshot de dados |
| RF-08 Minhas tarefas | Filtro obrigatório por usuário autenticado | `src/app/(app)/tasks/page.tsx`, `src/app/api/tasks/my/route.ts` | Teste authz garantindo isolamento por usuário |
| RF-09 Dashboard geral | Lista consolidada de empreendimentos com progresso e pendências | `src/app/(app)/dashboard/page.tsx`, `src/app/api/developments/route.ts` | Teste de performance e consistência de totais |
| RF-10 Auth e RBAC | Roles `admin/editor/viewer` em middleware + API guards | `src/lib/auth/*`, `src/middleware.ts` | Teste 403 para viewer em mutações |
| RF-11 Auditoria | Audit append-only em mudanças de status/tarefa/parâmetro/email settings | `prisma/schema.prisma`, `src/lib/audit/*` | Teste de escrita de log por operação crítica |
| RF-12 Carga inicial | Seed idempotente com os 9 empreendimentos e 22 etapas | `prisma/seed.ts` | Script valida `%` com tolerância ±0,01 |

---

## 4. Arquitetura

- **Fluxo de dados:** UI (Server Components) -> Route Handlers -> serviços de domínio -> Prisma -> PostgreSQL.
- **Responsabilidades por camada:**
  - `app/*`: composição de páginas e interação.
  - `app/api/*`: contrato HTTP, autenticação/autorização, validação de entrada.
  - `lib/domain/*`: regras de cálculo, políticas de negócio, casos de uso.
  - `lib/queries/*`: leitura otimizada para dashboard/painéis.
  - `lib/audit/*`: serialização e persistência de trilhas.
- **Estratégia de estado:** server-first; client local só para filtros, modais e edição inline.
- **Estratégia de erros/loading/empty:**
  - Loading: skeleton por seção.
  - Empty: CTA contextual por página.
  - Erro: painel com ação de retry e mensagem tratável.
- **Estratégia de segurança:**
  - validação Zod em toda borda externa;
  - RBAC em middleware e duplicado no handler;
  - trilha de auditoria append-only;
  - segredo nunca retornado completo na API;
  - rate-limit para mutações (Dragonfly opcional).

---

## 5. Decisões Arquiteturais (ADRs)

### ADR-001 — Cálculo de progresso centralizado no backend
- **Decisão:** toda regra de peso/status/progresso em `lib/domain/progress.ts`.
- **Alternativa rejeitada:** cálculo na camada de UI.
- **Por quê:** evita divergência entre telas e garante paridade auditável.

### ADR-002 — RBAC em dupla checagem (middleware + handler)
- **Decisão:** proteger rota e endpoint de escrita.
- **Alternativa rejeitada:** apenas proteção no frontend.
- **Por quê:** segurança defensiva para evitar bypass por chamada direta.

### ADR-003 — PostgreSQL como fonte de verdade com soft delete
- **Decisão:** preservar histórico com `deletedAt` nas entidades sensíveis.
- **Alternativa rejeitada:** hard delete puro.
- **Por quê:** suporte a auditoria e recuperação operacional.

### ADR-004 — Infra padrão Swarm + Traefik + Portainer
- **Decisão:** deploy em Docker Swarm com roteamento TLS no Traefik e operação via Portainer.
- **Alternativa rejeitada:** PM2/VM simples ou Kubernetes nesta fase.
- **Por quê:** equilíbrio entre simplicidade operacional e governança de produção.

### ADR-005 — E-mail corporativo via Microsoft 365 com caixa compartilhada
- **Decisão:** módulo de settings para SMTP OAuth2 com conta técnica + `Send As` da shared mailbox; suporte futuro a Graph API.
- **Alternativa rejeitada:** SMTP basic/app password legado.
- **Por quê:** alinhamento com modern auth e redução de risco de depreciação.

---

## 6. Modelagem de Dados

### Entidades novas/alteradas

- **User (alterar):**
  - `displayName String?`
  - `role UserRole @default(VIEWER)`
  - `isActive Boolean @default(true)`

- **MacroPhase:**
  - `id, name, sortOrder, weightPercent`

- **Stage:**
  - `id, macroPhaseId, name, sortOrder`
  - `impactScore, dependencyScore, timeScore, effortScore` (1..5)
  - `rawWeight, globalWeight`

- **Development:**
  - `id, name, code?, isActive, deletedAt?`

- **DevelopmentStage (junction):**
  - `developmentId, stageId, status StageStatus`
  - `updatedBy, updatedAt`
  - índice único `(developmentId, stageId)`

- **Task:**
  - `id, developmentId, stageId, assigneeId?`
  - `description, deadline?, status, notes?, deletedAt?`
  - índices por `(assigneeId, deadline)` e `(developmentId, status)`

- **StageSchedule:**
  - `developmentId, stageId, protocolDate?, estimatedDeadline?`

- **AuditLog:**
  - `id, userId, entity, entityId, action, field?`
  - `oldValue Json?, newValue Json?, metadata Json?, createdAt`

- **SystemSetting (novo):**
  - `key String @unique`
  - `valueEncrypted String` (segredo cifrado)
  - `valueMasked Json` (dados seguros para exibir parcialmente)
  - `updatedBy, updatedAt`

### E-mail corporativo (settings)

- Chaves previstas em `SystemSetting`:
  - `mail.provider` = `MICROSOFT_SMTP` | `MICROSOFT_GRAPH`
  - `mail.sharedMailboxAddress`
  - `mail.smtp.host` (default `smtp.office365.com`)
  - `mail.smtp.port` (default `587`)
  - `mail.auth.tenantId`
  - `mail.auth.clientId`
  - `mail.auth.clientSecret` (encrypted)
  - `mail.auth.technicalUser` (conta que autentica)
  - `mail.permissions.allowedRoles` (`admin`, `editor` etc.)

---

## 7. Contratos TypeScript

```typescript
export type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER';

export type StageStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE';

export type MailProvider = 'MICROSOFT_SMTP' | 'MICROSOFT_GRAPH';

export interface UpdateDevelopmentStageStatusInput {
  developmentId: string;
  stageId: string;
  status: StageStatus;
  reason?: string;
}

export interface MailSettingsInput {
  provider: MailProvider;
  sharedMailboxAddress: string;
  technicalUser: string;
  tenantId: string;
  clientId: string;
  clientSecret?: string;
  smtpHost?: string;
  smtpPort?: number;
  allowedRolesToSend: UserRole[];
}

export interface SendNotificationInput {
  to: string[];
  subject: string;
  html: string;
  fromMailbox?: string;
}
```

### Validações Zod mínimas
- score de etapa: `z.number().int().min(1).max(5)`
- e-mail corporativo: domínio permitido e formato válido
- role: enum fechado
- status: enum fechado
- payload de settings: bloqueio de campos vazios críticos

---

## 8. Estrutura de Arquivos

| Arquivo | Ação | Responsabilidade | Split necessário? |
|---|---|---|---|
| `prisma/schema.prisma` | modificar | modelos de domínio, RBAC, audit, settings | não |
| `prisma/seed.ts` | criar/modificar | carga inicial com paridade da planilha | não |
| `src/lib/domain/progress.ts` | criar | cálculo de pesos e avanço | não |
| `src/lib/domain/permissions.ts` | criar | regras RBAC reutilizáveis | não |
| `src/lib/audit/audit-log.service.ts` | criar | persistência de trilha de auditoria | não |
| `src/lib/settings/system-settings.service.ts` | criar | leitura/escrita cifrada de settings | não |
| `src/lib/mail/mail.service.ts` | criar | envio por Microsoft SMTP/Graph | pode dividir por provider |
| `src/lib/mail/providers/microsoft-smtp.ts` | criar | adapter SMTP OAuth2 | não |
| `src/app/api/developments/route.ts` | criar | listagem e criação de empreendimentos | não |
| `src/app/api/developments/[id]/stages/route.ts` | criar | leitura/edição de status por etapa | não |
| `src/app/api/tasks/route.ts` | criar | CRUD de tarefas | não |
| `src/app/api/tasks/my/route.ts` | criar | tarefas do usuário atual | não |
| `src/app/api/settings/mail/route.ts` | criar | CRUD de configuração de e-mail (admin) | não |
| `src/app/api/mail/test/route.ts` | criar | teste de conexão/envio controlado | não |
| `src/app/api/mail/send/route.ts` | criar | envio operacional com RBAC | não |
| `src/app/(app)/settings/mail/page.tsx` | criar | UI de configuração Microsoft 365 | não |
| `src/middleware.ts` | modificar | proteção de rotas autenticadas + role hints | não |
| `docker/stack.yml` | criar | stack Swarm (app, traefik, postgres, dragonfly opcional) | não |
| `docs/OPS01_DEPLOYMENT.md` | refinar | passos exatos de deploy da stack | não |

---

## 9. Fluxos Críticos

### Fluxo 1 — Atualizar status de etapa
- **Entrada:** `developmentId`, `stageId`, `status`.
- **Processamento:** validação Zod -> RBAC (`editor+`) -> update -> recálculo -> auditoria.
- **Saída:** status atualizado e novo progresso do empreendimento.
- **Falhas esperadas:** 403 role inválida; 404 entidade; 422 payload inválido.
- **Abuse cases + mitigação:**
  - forçar update por API sem UI -> bloqueio por RBAC no handler;
  - alteração em massa indevida -> rate-limit de mutações.

### Fluxo 2 — Minhas tarefas
- **Entrada:** usuário autenticado.
- **Processamento:** query filtrada por `assigneeId`.
- **Saída:** tarefas ordenadas por prazo/vencimento.
- **Falhas esperadas:** sessão expirada -> 401.
- **Abuse cases + mitigação:** tentativa de ler tarefas de outro usuário -> filtro server-side obrigatório.

### Fluxo 3 — Configurar e-mail Microsoft 365
- **Entrada:** settings de provider/shared mailbox/credenciais.
- **Processamento:** validação -> RBAC (`admin`) -> criptografia de segredo -> persistência -> auditoria.
- **Saída:** config salva com campos mascarados.
- **Falhas esperadas:** credencial inválida; permissão `Send As` ausente.
- **Abuse cases + mitigação:**
  - exfiltração de segredo via API -> retorno mascarado e segredo only-write;
  - editor tentando alterar configuração -> 403.

### Fluxo 4 — Enviar e-mail operacional
- **Entrada:** destinatário(s), assunto, corpo, contexto.
- **Processamento:** checagem de role permitida na configuração -> envio provider -> auditoria de envio.
- **Saída:** status de entrega (accepted/rejected) + correlation id.
- **Falhas esperadas:** timeout SMTP; auth OAuth2 inválida.
- **Abuse cases + mitigação:** spam interno acidental -> throttling + limite por usuário/hora.

---

## 10. Dependências

### Pacotes novos (previstos)
- Nenhum obrigatório para Fase 2 documental.
- Fase 3 pode adicionar:
  - `nodemailer` para SMTP OAuth2.
  - `@azure/identity` (se necessário para token flow Microsoft).

### Variáveis de ambiente

| Variável | Tipo | Obrigatória | Uso |
|---|---|---|---|
| `DATABASE_URL` | string(url) | sim | conexão Postgres |
| `NEXT_PUBLIC_APP_URL` | string(url) | sim | links absolutos |
| `AUTH_SECRET` ou `BETTER_AUTH_SECRET` | string | sim | sessão/autenticação |
| `SETTINGS_ENCRYPTION_KEY` | string | sim | cifrar secrets de settings |
| `MAIL_DEFAULT_PROVIDER` | enum | não | fallback (`MICROSOFT_SMTP`) |
| `DRAGONFLY_URL` | string(url) | não | cache/rate-limit |
| `SMTP_TIMEOUT_MS` | number | não | timeout de envio |

### Serviços externos
- Microsoft 365 (SMTP/Graph).
- Docker Swarm + Traefik + Portainer.
- PostgreSQL.
- Dragonfly (opcional).

---

## 11. Milestones (Vertical Slices)

### Slice 1 — Núcleo de domínio e paridade de dados
- **Objetivo:** banco e seed prontos com 9 empreendimentos, 22 etapas e cálculo fiel.
- **Arquivos tocados:** `prisma/schema.prisma`, `prisma/seed.ts`, `src/lib/domain/progress.ts`.
- **Pré-requisito:** aprovação desta SPEC.
- **Paralelizável com:** desenho de telas de settings.
- **Acceptance Criteria:** seed executa sem erro e % bate com planilha (±0,01).
- **Definition of Done:** testes unitários da fórmula verdes.

### Slice 2 — Auth, RBAC e auditoria
- **Objetivo:** controle de acesso e log append-only nas mutações críticas.
- **Arquivos tocados:** `src/lib/domain/permissions.ts`, `src/lib/audit/*`, `src/middleware.ts`.
- **Pré-requisito:** Slice 1.
- **Paralelizável com:** criação de rotas de leitura.
- **Acceptance Criteria:** viewer recebe 403 em mutações.
- **Definition of Done:** cobertura de testes de autorização.

### Slice 3 — Dashboard e painel de empreendimento
- **Objetivo:** telas alimentadas por dados reais da API.
- **Arquivos tocados:** `src/app/(app)/dashboard/page.tsx`, `src/app/(app)/developments/[id]/page.tsx`, `src/app/api/developments/*`.
- **Pré-requisito:** Slices 1 e 2.
- **Paralelizável com:** tarefas.
- **Acceptance Criteria:** cards e progresso consistentes com base.
- **Definition of Done:** loading/empty/error implementados.

### Slice 4 — Tarefas (minhas e todas)
- **Objetivo:** CRUD completo de tarefas com filtros e ordenação.
- **Arquivos tocados:** `src/app/api/tasks/*`, `src/app/(app)/tasks/*`.
- **Pré-requisito:** Slices 1 e 2.
- **Paralelizável com:** settings.
- **Acceptance Criteria:** usuário só vê tarefas permitidas.
- **Definition of Done:** testes integração de filtros e prazos.

### Slice 5 — Settings de e-mail Microsoft 365
- **Objetivo:** admin configura mailbox compartilhada e usuários autorizados podem enviar.
- **Arquivos tocados:** `src/app/(app)/settings/mail/page.tsx`, `src/app/api/settings/mail/route.ts`, `src/lib/mail/*`.
- **Pré-requisito:** Slice 2.
- **Paralelizável com:** auditoria UI.
- **Acceptance Criteria:** teste de conexão válido e segredo mascarado.
- **Definition of Done:** auditoria de alteração/envio registrada.

### Slice 6 — Operação e deploy (Swarm)
- **Objetivo:** stack produtiva com Traefik, app, Postgres e Dragonfly opcional.
- **Arquivos tocados:** `docker/stack.yml`, `docs/OPS01_DEPLOYMENT.md`.
- **Pré-requisito:** Slices 1-5.
- **Paralelizável com:** hardening observabilidade.
- **Acceptance Criteria:** deploy sobe com health checks e rollback documentado.
- **Definition of Done:** runbook validado em ambiente de homologação.

---

## 12. Qualidade e Validação

- **Unitários:**
  - cálculo de peso bruto/global;
  - cálculo de progresso por status;
  - matriz de permissões por role.
- **Integração:**
  - CRUD de empreendimentos/etapas/tarefas;
  - auditoria em cada mutação;
  - settings de e-mail com máscara e criptografia.
- **E2E:**
  - login -> dashboard -> alterar etapa -> refletir progresso;
  - minhas tarefas filtradas por usuário;
  - admin configura e-mail e executa teste.
- **A11y:**
  - foco visível, labels explícitos, navegação por teclado.
- **Segurança:**
  - testes de autorização (403);
  - validação de input;
  - segredo nunca logado em texto plano.

### Comandos de validação local

```bash
npm run typecheck
npm run lint
npm run test
npm run test:e2e
bash scripts/verify-docs.sh
```

---

## 13. Rollback e Operação

- **Critérios de rollback:**
  - erro 5xx acima do limiar definido após release;
  - falha em envio de e-mail com impacto operacional crítico;
  - inconsistência de cálculo de progresso detectada em produção.
- **Procedimento:**
  - rollback do serviço no Swarm;
  - rollback de migration quando aplicável;
  - desabilitar temporariamente envio de e-mail via feature flag de configuração.
- **Sinais de falha pós-release:**
  - divergência de `%` versus planilha de referência;
  - aumento de erros 403/500 inesperados;
  - falhas recorrentes de autenticação SMTP Microsoft.

---

## 14. Questões em Aberto

1. Confirmar se o primeiro provider será `MICROSOFT_SMTP` apenas ou já com fallback `MICROSOFT_GRAPH`.
2. Definir política de retenção de logs de envio de e-mail (90, 180 ou 365 dias).
3. Definir limite operacional de envios por usuário/hora para evitar abuso.
4. Confirmar se `editor` poderá enviar e-mail ou apenas `admin`.
5. Definir domínio(s) permitidos para destinatário externo, se houver restrição.

---

## Impacto em Segurança e UX

- **Segurança:** RBAC em profundidade, auditoria imutável, segredo cifrado e integração de e-mail com modern auth.
- **UX:** mantém fluxo denso e rápido da operação, adicionando settings claros de e-mail com teste de conexão e mensagens acionáveis.
