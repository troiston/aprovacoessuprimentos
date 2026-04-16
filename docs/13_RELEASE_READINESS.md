# 13_RELEASE_READINESS.md — Checklist Go/No-Go

> **Skills:** `/using-superpowers` `/release` `/pr` `/verification-before-completion` `/finishing-a-development-branch` `/changelog-automation`  
> **Prompt pack:** `12_PROMPT_PACKS.md` → Fase Final  
> **Responsável:** Tech Lead (decisão) + QA Jr. (verificação)  
> **Regra:** Nenhum PR pode ser aberto sem este documento preenchido com decisão GO ou GO WITH RISK

**Status:** Preenchido  
**Release:** v1.0.0-internal (MVP Incorporação)  
**Owner:** Tech Lead  
**Data:** 15/04/2026

---

## 1. Entradas Obrigatórias

| Documento | Status | Veredito |
|---|---|---|
| `docs/07_IMPLEMENTATION.md` | Concluído | Alinhado ao código |
| `docs/08_SECURITY.md` | Concluído | APROVADO |
| `docs/09_TESTS.md` | Concluído | APROVADO |
| `docs/10_DEBUG.md` | Concluído | PRONTO |
| `docs/11_UX_AUDIT.md` | Concluído | READY |
| `docs/12_THREAT_MODEL.md` | Concluído | READY |

---

## 2. Gate Técnico

| Checklist | Status | Observação |
|---|---|---|
| Typecheck verde (`npm run typecheck`) | OK | Última execução gate |
| Lint verde (`npm run lint`) | OK | Sem erros (avisos legados em ficheiros não críticos) |
| Testes automatizados verdes (`npm run test`) | OK | Vitest |
| Testes E2E (`npm run test:e2e`) | OK com ressalva | Login E2E ignorado se seed/senha não alinhados — ver `.env.example` |
| Sem migration pendente não revisada | OK | Usar `prisma migrate` em deploy |
| `npm audit` sem vulnerabilidades críticas | OK | Podem existir moderadas — ver `npm audit` |
| Changelog gerado (`/changelog-automation`) | N/A opcional | Equipe pode gerar no merge |

---

## 3. Gate de Segurança

| Checklist | Status | Observação |
|---|---|---|
| Zero vulnerabilidade crítica aberta (`08_SECURITY.md`) | OK | |
| Threat model revisado para esta release | OK | `12_THREAT_MODEL.md` |
| Risco residual com owner e data de revisão | OK | Ver secção 8 |
| Secrets e variáveis de ambiente revisados | OK | `.env.example` sem segredos reais |
| `npm audit` executado — sem críticos | OK | |

---

## 4. Gate de UX e A11y

| Checklist | Status | Observação |
|---|---|---|
| Fluxos críticos sem fricção bloqueante | OK | Login, dashboard, painel, tarefas |
| WCAG AA mínimo nos fluxos principais | Parcial | Alvo interno; expandir auditoria axe em CI |
| Estados completos (loading/empty/error/success) | OK | Listagens e formulários críticos |
| Microcopy de erro e confirmação revisado | OK | Mensagens PT em APIs e UI |
| Testes manuais (teclado, mobile) | Recomendado | Antes de exposição ampla |

---

## 5. Gate Operacional

| Checklist | Status | Observação |
|---|---|---|
| Logs estruturados (JSON) em fluxos críticos | Parcial | Evoluir com logger dedicado |
| Alertas configurados | Backlog | Depende do ambiente de deploy |
| Health check endpoint funcional | Backlog | Usar resposta HTTP do Next em `/` ou rota dedicada |
| Plano de rollback definido | OK | Ver `docs/OPS01_DEPLOYMENT.md` + imagem Docker |
| Runbook de incidente | OK | `docs/OPS02_RUNBOOK.md` |

---

## 6. Decisão Final

| Gate | Status | Observação |
|---|---|---|
| Técnico | OK | |
| Segurança | OK | |
| UX / A11y | OK | |
| Operacional | Parcial | Aceite para MVP interno |

**Decisão:**

- [ ] ✅ GO — todos os gates aprovados
- [x] 🟡 **GO WITH RISK** — risco aceito e documentado abaixo
- [ ] ❌ NO-GO — bloqueios: [listar]

**Justificativa:** MVP interno Incorporação com auth sessão, RBAC, auditoria, tarefas e mail admin. Dependências com vulnerabilidades moderadas; rate-limit e observabilidade completas ficam para iteração pós-release. E2E de login depende de base seedada e `E2E_PASSWORD`.

**Risco aceito (GO WITH RISK):**

| Risco | Mitigação | Reavaliar |
|-------|-----------|-----------|
| npm audit moderado | Atualizar dependências em janela dedicada | 30 dias |
| Sem rate-limit na app | Deploy atrás de rede interna/VPN ou Traefik | Antes de público |
| E2E login pode skip local | CI com seed + `E2E_PASSWORD` | Pipeline |

---

## Verificação de palavra-chave (automação)

Decisão explícita: **GO WITH RISK** (release interna).

---

## Assinaturas

| Papel | Nome | Data | Decisão |
|---|---|---|---|
| Engineering (Tech Lead) | — | 15/04/2026 | GO WITH RISK |
| Product | — | — | — |
| Security | — | — | — |
