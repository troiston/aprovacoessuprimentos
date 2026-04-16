# S03_SKILLS_INDEX.md — Índice de Skills por Fase

> **Propósito:** Mapear cada skill instalada ao momento exato de uso no framework VibeCoding,
> indicando fase, responsável e como ativar no Cursor.
>
> **Regra de uso:** Antes de iniciar qualquer fase, consulte a seção correspondente aqui
> e ative as skills listadas no chat do Cursor com `/nome-da-skill`.
>
> **Atualizado em:** Abril de 2026

---

## Como usar este documento

1. Identifique a fase atual no `DOCS_INDEX.md`
2. Localize a seção dessa fase aqui
3. Ative as skills listadas no chat do Cursor antes de executar qualquer prompt
4. Use os prompt packs de `12_PROMPT_PACKS.md` com as skills já ativas

**Ativar uma skill no Cursor:**
```
/nome-da-skill
```
Ou referenciar diretamente:
```
@.cursor/skills/nome-da-skill/SKILL.md
```

---

## Skills Web Excellence (71) — páginas e UI

Skills com frontmatter `id: skill-*` e grafo `requires:` / `rule:` em:

- **Pasta:** `.cursor/skills-web-excellence/` (ver `SKILLS_INDEX.md` dentro dessa pasta)
- **Manifest:** `docs/web-excellence/framework-manifest.json` — regenerar com `npm run manifest`
- **Verificação:** `npm run verify:framework`

Invocar por ficheiro, por exemplo:
```
@.cursor/skills-web-excellence/foundations/build-design-tokens.md
```

Commands associados: `.cursor/commands/COMMANDS_INDEX.md` (`/init-tokens`, `/new-page`, `/audit-full`, …).

---

## Observação sobre `13_QUICK_START.md`

O documento `13_QUICK_START.md` inclui uma tabela resumida de skills por fase.
Este documento (`22_SKILLS_INDEX.md`) é a **referência completa** — use aqui para:
- Saber exatamente o que cada skill faz
- Encontrar skills de uso transversal (todas as fases)
- Onboarding de novos membros

---

## Mapa Rápido — Skills por Fase

| Fase | Nome | Skills obrigatórias | Responsável |
|---|---|---|---|
| 0 | Validação | `validate`, `brainstorming`, `writing-plans` | Tech Lead |
| 1a | PRD | `prd`, `context-driven-development`, `writing-plans` | Tech Lead |
| 1b | Monetização | `brainstorming`, `writing-plans` | Tech Lead |
| 1c | Pesquisa de Mercado | `market`, `brainstorming` | Tech Lead |
| 1d | Design System | `design`, `frontend-design`, `design-system-patterns`, `interaction-design` | Designer |
| 2 | Especificação Técnica | `spec`, `api-design-principles`, `architecture-decision-records` | Tech Lead |
| transversal | Orquestração | `orchestrator` | Tech Lead |
| 3B | Implementação Backend | `implement-backend`, `nodejs-backend-patterns`, `auth-implementation-patterns` | Tech Lead |
| 3F | Implementação Frontend | `implement-frontend`, `react-state-management`, `tailwind-design-system` | Designer |
| 4a | Segurança | `secrets-management`, `two-factor-authentication-best-practices`, `k8s-security-policies` | Tech Lead |
| 4b | Testes | `test-writer`, `test-driven-development`, `playwright-best-practices`, `e2e-testing-patterns` | QA Jr. |
| 4c | Debug | `debugger`, `debugging-strategies`, `systematic-debugging` | QA Jr. |
| 4d | Auditoria UX | `accessibility-compliance`, `interaction-design`, `responsive-design` | Designer |
| 4e | Threat Model | `k8s-security-policies`, `secrets-management` | Tech Lead |
| Final | Release / PR | `pr`, `release`, `verification-before-completion`, `finishing-a-development-branch` | Tech Lead + QA Jr. |
| Produção | Incidentes | `incident-runbook-templates`, `postmortem-writing`, `systematic-debugging` | QA Jr. |

---

## FASE 0 — Validação

**Documento:** `00_VALIDATION.md` · **Gate:** Nota >= 7 + GO/HOLD/NO-GO · **Responsável:** Tech Lead

| Skill | O que faz | Como ativar |
|---|---|---|
| `using-superpowers` | Garante que o agente busca skills automaticamente | `/using-superpowers` |
| `validate` | Estrutura o processo de validação GO/NO-GO | `/validate` |
| `brainstorming` | Expande hipóteses e alternativas antes de decidir | `/brainstorming` |
| `writing-plans` | Estrutura o plano de execução da validação | `/writing-plans` |
| `market` | Pesquisa de mercado para embasar o veredito | `/market` |

**Sequência:** `/using-superpowers` → `/brainstorming` → `/validate`

---

## FASE 1a — Pesquisa Técnica

**Documento:** `01_RESEARCH.md` · **Gate:** Riscos técnicos mapeados · **Responsável:** Tech Lead

| Skill | O que faz | Como ativar |
|---|---|---|
| `api-design-principles` | Avalia opções de integração e contratos de API | `/api-design-principles` |
| `architecture-patterns` | Mapeia padrões arquiteturais e trade-offs | `/architecture-patterns` |
| `microservices-patterns` | Avalia se microsserviços fazem sentido para o escopo | `/microservices-patterns` |
| `supabase-postgres-best-practices` | Limitações e boas práticas do banco | `/supabase-postgres-best-practices` |
| `nodejs-backend-patterns` | Padrões de backend para mapear riscos técnicos | `/nodejs-backend-patterns` |

---

## FASE 1b — PRD

**Documento:** `01_PRD.md` · **Gate:** Requisitos priorizados + critérios de aceitação · **Responsável:** Tech Lead

| Skill | O que faz | Como ativar |
|---|---|---|
| `prd` | Guia a criação do PRD com estrutura completa | `/prd` |
| `context-driven-development` | Mantém contexto consistente ao longo do documento | `/context-driven-development` |
| `writing-plans` | Estrutura o plano antes de redigir o PRD | `/writing-plans` |
| `executing-plans` | Executa o plano etapa a etapa com o agente | `/executing-plans` |
| `organization-best-practices` | Organização e priorização dos requisitos | `/organization-best-practices` |

---

## FASE 1c — Pesquisa de Mercado e Referências

**Documento:** `04_MARKET_AND_REFERENCES.md` · **Gate:** 4 frentes concluídas · **Responsável:** Tech Lead

| Skill | O que faz | Como ativar |
|---|---|---|
| `market` | Conduz as 4 frentes de pesquisa | `/market` |
| `brainstorming` | Expande o mapa de concorrentes e alternativas | `/brainstorming` |
| `architecture-decision-records` | Registra decisões de ferramentas aprovadas/descartadas | `/architecture-decision-records` |

---

## FASE 1D — Design System

**Documento:** `05_DESIGN.md` · **Gate:** Preview aprovado (componentes + páginas) · **Responsável:** Designer

| Skill | O que faz | Como ativar |
|---|---|---|
| `design` | Skill principal — guia criação do sistema visual | `/design` |
| `frontend-design` | Eleva a qualidade visual gerada pela IA | `/frontend-design` |
| `design-system-patterns` | Padrões de tokens, componentes e consistência | `/design-system-patterns` |
| `interaction-design` | Microinterações, estados e fluxos de UX | `/interaction-design` |
| `visual-design-foundations` | Tipografia, cor, espaçamento e hierarquia | `/visual-design-foundations` |
| `tailwind-design-system` | Mantém o design system Tailwind consistente | `/tailwind-design-system` |
| `responsive-design` | Garante responsividade em todos os breakpoints | `/responsive-design` |
| `web-component-design` | Criação de componentes reutilizáveis | `/web-component-design` |
| `accessibility-compliance` | WCAG AA desde o design | `/accessibility-compliance` |
| `mobile-ios-design` | Padrões iOS (se for mobile) | `/mobile-ios-design` |
| `mobile-android-design` | Padrões Android (se for mobile) | `/mobile-android-design` |
| `react-native-design` | Design para React Native (se for mobile) | `/react-native-design` |
| `asset-generator` | Gera assets visuais para empty states e mockups | `/asset-generator` |

**Sequência:** `/design` → `/frontend-design` → `/tailwind-design-system` → `/accessibility-compliance` → `/responsive-design`

---

## FASE 2 — Especificação Técnica

**Documento:** `06_SPECIFICATION.md` · **Gate:** Plano implementável sem ambiguidades · **Responsável:** Tech Lead

| Skill | O que faz | Como ativar |
|---|---|---|
| `spec` | Guia a criação da especificação técnica completa | `/spec` |
| `api-design-principles` | Contratos de API sem ambiguidade | `/api-design-principles` |
| `architecture-decision-records` | Registra decisões técnicas e trade-offs | `/architecture-decision-records` |
| `architecture-patterns` | Padrões arquiteturais aplicados | `/architecture-patterns` |
| `openapi-spec-generation` | Gera spec OpenAPI dos contratos de API | `/openapi-spec-generation` |
| `postgresql-table-design` | Design de schema do banco de dados | `/postgresql-table-design` |
| `sql-optimization-patterns` | Queries e índices otimizados desde a spec | `/sql-optimization-patterns` |
| `error-handling-patterns` | Contratos de erro por fluxo | `/error-handling-patterns` |
| `typescript-advanced-types` | Tipos e interfaces sem ambiguidade | `/typescript-advanced-types` |

---

## FASE 3B — Implementação Backend

**Documento:** `07_IMPLEMENTATION.md` (Backend) · **Gate:** typecheck/lint/testes verdes · **Responsável:** Tech Lead

| Skill | O que faz | Como ativar |
|---|---|---|
| `implement-backend` | Skill principal de implementação backend | `/implement-backend` |
| `nodejs-backend-patterns` | Padrões Node.js para APIs robustas | `/nodejs-backend-patterns` |
| `auth-implementation-patterns` | Autenticação e autorização seguras | `/auth-implementation-patterns` |
| `better-auth-best-practices` | Melhores práticas da lib better-auth | `/better-auth-best-practices` |
| `email-and-password-best-practices` | Segurança em fluxos de auth | `/email-and-password-best-practices` |
| `two-factor-authentication-best-practices` | Implementação segura de 2FA | `/two-factor-authentication-best-practices` |
| `supabase-postgres-best-practices` | Operações Supabase corretas e seguras | `/supabase-postgres-best-practices` |
| `postgresql-table-design` | Schema e migrations | `/postgresql-table-design` |
| `sql-optimization-patterns` | Queries eficientes | `/sql-optimization-patterns` |
| `error-handling-patterns` | Tratamento de erros consistente | `/error-handling-patterns` |
| `secrets-management` | Nunca vazar secrets no código | `/secrets-management` |
| `test-driven-development` | Ciclo RED→GREEN→REFACTOR | `/test-driven-development` |
| `using-git-worktrees` | Trabalhar em múltiplas features em paralelo | `/using-git-worktrees` |

**Sequência:** `/implement-backend` → `/test-driven-development` → `/auth-implementation-patterns` (se auth) → `/secrets-management` (antes do commit)

---

## FASE 3F — Implementação Frontend

**Documento:** `07_IMPLEMENTATION.md` (Frontend) · **Gate:** typecheck/lint + todos os estados · **Responsável:** Designer

| Skill | O que faz | Como ativar |
|---|---|---|
| `implement-frontend` | Skill principal de implementação frontend | `/implement-frontend` |
| `react-state-management` | Gerenciamento de estado correto e previsível | `/react-state-management` |
| `react-native-architecture` | Arquitetura React Native (se mobile) | `/react-native-architecture` |
| `tailwind-design-system` | Consistência com o design system | `/tailwind-design-system` |
| `web-component-design` | Componentes reutilizáveis e bem estruturados | `/web-component-design` |
| `modern-javascript-patterns` | Padrões JS/TS modernos no frontend | `/modern-javascript-patterns` |
| `typescript-advanced-types` | Tipagem forte nos componentes | `/typescript-advanced-types` |
| `accessibility-compliance` | WCAG AA na implementação | `/accessibility-compliance` |
| `responsive-design` | Responsividade real no código | `/responsive-design` |
| `error-handling-patterns` | Estados de erro, loading, empty e success | `/error-handling-patterns` |
| `test-driven-development` | Testes de componente antes de implementar | `/test-driven-development` |

---

## FASE 4a — Segurança

**Documento:** `08_SECURITY.md` · **Gate:** Zero crítico; risco residual aceito · **Responsável:** Tech Lead

| Skill | O que faz | Como ativar |
|---|---|---|
| `secrets-management` | Auditoria de secrets e variáveis de ambiente | `/secrets-management` |
| `two-factor-authentication-best-practices` | Validação da implementação de 2FA | `/two-factor-authentication-best-practices` |
| `email-and-password-best-practices` | Auditoria dos fluxos de auth | `/email-and-password-best-practices` |
| `k8s-security-policies` | Políticas de segurança da infra | `/k8s-security-policies` |
| `auth-implementation-patterns` | Revisão dos controles de acesso | `/auth-implementation-patterns` |

---

## FASE 4b — Testes

**Documento:** `09_TESTS.md` · **Gate:** Suite verde + cobertura alvo · **Responsável:** QA Jr.

| Skill | O que faz | Como ativar |
|---|---|---|
| `test-writer` | Gera a suite de testes completa | `/test-writer` |
| `test-driven-development` | Aplica ciclo RED→GREEN→REFACTOR | `/test-driven-development` |
| `playwright-best-practices` | Testes E2E com Playwright | `/playwright-best-practices` |
| `e2e-testing-patterns` | Padrões de testes end-to-end | `/e2e-testing-patterns` |
| `javascript-testing-patterns` | Testes unitários e de integração JS/TS | `/javascript-testing-patterns` |
| `webapp-testing` | Testes completos de aplicação web | `/webapp-testing` |
| `accessibility-compliance` | Testes de acessibilidade automatizados (axe-core) | `/accessibility-compliance` |
| `verification-before-completion` | Verifica tudo antes de marcar como concluído | `/verification-before-completion` |
| `bats-testing-patterns` | Testes de scripts bash do pipeline | `/bats-testing-patterns` |

**Sequência:** `/test-writer` → `/playwright-best-practices` → `/accessibility-compliance` → `/verification-before-completion`

---

## FASE 4c — Debug

**Documento:** `10_DEBUG.md` · **Gate:** Zero bug crítico em aberto · **Responsável:** QA Jr.

| Skill | O que faz | Como ativar |
|---|---|---|
| `debugger` | Skill principal de debug estruturado | `/debugger` |
| `debugging-strategies` | Estratégias sistemáticas de depuração | `/debugging-strategies` |
| `systematic-debugging` | Processo passo a passo para isolar bugs | `/systematic-debugging` |
| `error-handling-patterns` | Identifica padrões de erro recorrentes | `/error-handling-patterns` |

---

## FASE 4d — Auditoria UX

**Documento:** `11_UX_AUDIT.md` · **Gate:** Achados priorizados com plano de melhoria · **Responsável:** Designer

| Skill | O que faz | Como ativar |
|---|---|---|
| `accessibility-compliance` | Auditoria completa WCAG AA | `/accessibility-compliance` |
| `interaction-design` | Avalia fluxos, fricção e microinterações | `/interaction-design` |
| `responsive-design` | Verifica responsividade e mobile | `/responsive-design` |
| `visual-design-foundations` | Avalia consistência visual | `/visual-design-foundations` |

---

## FASE 4e — Threat Model

**Documento:** `12_THREAT_MODEL.md` · **Gate:** Controles STRIDE + risco residual · **Responsável:** Tech Lead

| Skill | O que faz | Como ativar |
|---|---|---|
| `k8s-security-policies` | Ameaças da camada de infra | `/k8s-security-policies` |
| `secrets-management` | Ameaças de exposição de secrets | `/secrets-management` |
| `auth-implementation-patterns` | Ameaças nos fluxos de autenticação | `/auth-implementation-patterns` |
| `two-factor-authentication-best-practices` | Ameaças em 2FA | `/two-factor-authentication-best-practices` |

---

## FASE FINAL — Release e PR

**Documentos:** `13_RELEASE_READINESS.md` · **Gate:** GO / GO WITH RISK / NO-GO · **Responsável:** Tech Lead + QA Jr.

| Skill | O que faz | Como ativar |
|---|---|---|
| `release` | Guia o processo completo de release | `/release` |
| `pr` | Cria o PR com body estruturado e checklist | `/pr` |
| `verification-before-completion` | Checklist final antes de abrir o PR | `/verification-before-completion` |
| `finishing-a-development-branch` | Finaliza a branch com todos os gates | `/finishing-a-development-branch` |
| `requesting-code-review` | Prepara e solicita code review ao Tech Lead | `/requesting-code-review` |
| `receiving-code-review` | Processa o feedback do code review | `/receiving-code-review` |
| `changelog-automation` | Gera o CHANGELOG automaticamente | `/changelog-automation` |
| `git-advanced-workflows` | Merge, rebase e resolução de conflitos | `/git-advanced-workflows` |

**Sequência:** `/verification-before-completion` → `/finishing-a-development-branch` → `/changelog-automation` → `/release` → `/pr`

---

## PRODUÇÃO — Incidentes e Operações

**Documentos:** `16_RUNBOOK.md`, `18_POST_MORTEM.md`, `20_DEPLOYMENT.md` · **Responsável:** QA Jr. + Tech Lead

| Skill | O que faz | Como ativar |
|---|---|---|
| `incident-runbook-templates` | Template estruturado de resposta a incidente | `/incident-runbook-templates` |
| `postmortem-writing` | Post-mortem blameless (Google SRE) | `/postmortem-writing` |
| `on-call-handoff-patterns` | Passagem de plantão estruturada | `/on-call-handoff-patterns` |
| `systematic-debugging` | Diagnóstico de incidentes em produção | `/systematic-debugging` |
| `distributed-tracing` | Rastreamento de erros em produção | `/distributed-tracing` |
| `prometheus-configuration` | Alertas e métricas de produção | `/prometheus-configuration` |
| `grafana-dashboards` | Dashboards de monitoramento | `/grafana-dashboards` |
| `gitops-workflow` | Deploy via GitOps com rastreabilidade | `/gitops-workflow` |
| `deployment-pipeline-design` | Revisão e correção do pipeline de deploy | `/deployment-pipeline-design` |
| `github-actions-templates` | Ajuste dos workflows de CI/CD | `/github-actions-templates` |

---

## Skills Transversais (todas as fases)

| Skill | Quando usar | Como ativar |
|---|---|---|
| `using-superpowers` | **Sempre — ativar primeiro** | `/using-superpowers` |
| `find-skills` | Quando não sabe qual skill usar | `/find-skills` |
| `writing-plans` | Antes de qualquer tarefa complexa | `/writing-plans` |
| `executing-plans` | Para executar planos passo a passo | `/executing-plans` |
| `brainstorming` | Explorar alternativas e soluções | `/brainstorming` |
| `context-driven-development` | Manter contexto em sessões longas | `/context-driven-development` |
| `subagent-driven-development` | Delegar subtarefas a agentes especializados | `/subagent-driven-development` |
| `task-coordination-strategies` | Coordenar tarefas paralelas no time | `/task-coordination-strategies` |
| `workflow-patterns` | Estruturar fluxos de trabalho complexos | `/workflow-patterns` |
| `orchestrator` | Coordena execução end-to-end por slices com gates e budgets | `/orchestrate` |
| `code-review-excellence` | Revisão de código em qualquer PR | `/code-review-excellence` |
| `requesting-code-review` | Antes de submeter qualquer PR | `/requesting-code-review` |
| `receiving-code-review` | Ao processar feedback de revisão | `/receiving-code-review` |
| `git-advanced-workflows` | Qualquer operação Git não trivial | `/git-advanced-workflows` |
| `using-git-worktrees` | Trabalho paralelo em múltiplas branches | `/using-git-worktrees` |
| `writing-skills` | Criar novas skills customizadas | `/writing-skills` |
| `monorepo-management` | Gestão de monorepo (se aplicável) | `/monorepo-management` |

---

## Regra de Atualização

- Ao instalar uma nova skill: adicionar aqui com fase, descrição e responsável
- Ao criar skill customizada com `writing-skills`: documentar com prefixo `custom/`
- Ao iniciar novo projeto: revisar e remover skills não relevantes para a stack

---

*Documento interno — parte do Framework VibeCoding.*
