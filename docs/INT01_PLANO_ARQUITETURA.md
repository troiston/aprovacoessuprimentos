# 17_PLANO_ARQUITETURA_REVISADO.md

Status: Atualizado em 2026-04-05  
Base: analise_arquitetura_vibecoding + aprimoramento_plano_arquitetura + sessão de revisão Abril 2026

---

## 1. Status dos Itens do Plano

### 1.1 Implementados (rodadas anteriores)

| Item | Arquivo / Ação | Status |
|---|---|---|
| Skill Fase 1c | `.cursor/skills/market/SKILL.md` | ✅ OK |
| 1c no QUICK_START e vibecoding-phases | `13_QUICK_START`, `vibecoding-phases.mdc` | ✅ OK |
| CHANGELOG | `CHANGELOG.md` (Keep a Changelog) | ✅ OK |
| ADR MADR | `docs/decisions/template-madr.md`, `README.md` | ✅ OK |
| Runbook | `docs/16_RUNBOOK.md` (5 fases) | ✅ OK |
| Ferramentas segurança | `docs/06_SECURITY.md` seção 6 | ✅ OK |
| GitHub Actions | `.github/workflows/ci.yml` (next typegen) | ✅ OK |
| Cursor estabilidade | `13_QUICK_START` (2.0.40+, extensões) | ✅ OK |
| Limites Cursor-friendly | `project.mdc` (300-500 linhas, index files) | ✅ OK |
| Prompt packs /market | `12_PROMPT_PACKS.md` | ✅ OK |
| DOCS_INDEX 16_RUNBOOK | `DOCS_INDEX.md` | ✅ OK |
| 11_RELEASE runbook ref | `11_RELEASE_READINESS.md` | ✅ OK |
| security-auditor ferramentas | `.cursor/agents/security-auditor.md` | ✅ OK |
| Post-mortem template | `docs/18_POST_MORTEM.md` | ✅ OK |
| docs/templates/ | `docs/templates/*.md` | ✅ OK |
| Fluxo hotfix | `.cursor/commands/hotfix.md` | ✅ OK |
| trail-docs | `docs/19_AI_DOCS_INDEXING.md` | ✅ OK |
| CONTRIBUTING | `CONTRIBUTING.md` | ✅ OK |
| Deployment runbook | `docs/20_DEPLOYMENT.md` | ✅ OK |
| README raiz | `README.md` | ✅ OK |
| Observabilidade | `11_RELEASE_READINESS` | ✅ OK |
| Política dependências | `06_SECURITY` | ✅ OK |

### 1.2 Implementados — Sessão Abril 2026

| Item | Arquivo | Status |
|---|---|---|
| Índice de skills integrado ao framework | `docs/22_SKILLS_INDEX.md` | ✅ OK |
| DOCS_INDEX v2 com coluna de skills e responsáveis | `docs/DOCS_INDEX.md` | ✅ OK |
| Templates revisados com skills, gates e impacto seg/UX | `docs/templates/00–05` | ✅ OK |
| ADR template MADR expandido (STRIDE, LGPD, critério de revisão) | `docs/decisions/template-madr.md` | ✅ OK |
| 01_MARKET com CVEs, ADR ref, LGPD e impacto seg/UX | `docs/01_MARKET_AND_REFERENCES.md` | ✅ OK |
| 06_SECURITY com OWASP Top 10 e checklist Docker Swarm/Traefik | `docs/06_SECURITY.md` | ✅ OK |
| 07_TESTS com comandos, CI/CD e matriz de rastreabilidade expandida | `docs/07_TESTS.md` | ✅ OK |
| 08_DEBUG com processo sistemático e checklist pós-deploy | `docs/08_DEBUG.md` | ✅ OK |
| 09_UX_AUDIT com seções de mobile UX e performance percebida | `docs/09_UX_AUDIT.md` | ✅ OK |
| 10_THREAT_MODEL com STRIDE e LGPD | `docs/10_THREAT_MODEL.md` | ✅ OK |
| 11_RELEASE com plano de comunicação e rollback | `docs/11_RELEASE_READINESS.md` | ✅ OK |
| 12_PROMPT_PACKS com /using-superpowers, hotfix, ADR e API-first | `docs/12_PROMPT_PACKS.md` | ✅ OK |
| 13_QUICK_START com quick start por papel e tabela de fases | `docs/13_QUICK_START.md` | ✅ OK |
| 14_IMAGE_GENERATION com checklist, convenção de nomes e prompts | `docs/14_IMAGE_GENERATION.md` | ✅ OK |
| 16_RUNBOOK com SEV-1/2/3 e comandos Docker Swarm | `docs/16_RUNBOOK.md` | ✅ OK |
| 18_POST_MORTEM com 5 Whys, SLOs e action items | `docs/18_POST_MORTEM.md` | ✅ OK |

---

## 2. Checklist de Alinhamento (atualizado)

- [x] 01_MARKET segue MRD com 4 frentes + LGPD
- [x] CHANGELOG segue Keep a Changelog
- [x] ADR usa MADR com histórico de status
- [x] Runbook 5 fases com comandos Docker Swarm
- [x] project.mdc: 300-500 linhas, index files
- [x] project.mdc: DESIGN_REFERENCES com path completo
- [x] spec skill: limites de arquivo
- [x] .cursorignore: docs indexáveis (não excluir docs/)
- [x] 06_SECURITY: OWASP Top 10 + VibeChecker/SonarQube + infra checklist
- [x] GitHub Actions: next typegen
- [x] 13_QUICK_START: Cursor 2.0.40+, quick start por papel
- [x] 07_TESTS: matriz rastreabilidade + comandos
- [x] AGENT.md: subagents
- [x] 22_SKILLS_INDEX: mapa completo 80 skills por fase
- [x] DOCS_INDEX v2: coluna skills + responsáveis + 4 status
- [x] /using-superpowers: primeiro comando em todos os prompts

---

## 3. Pendências Identificadas

| Item | Arquivo alvo | Prioridade | Status |
|---|---|---|---|
| Revisar `19_AI_DOCS_INDEXING.md` — integrar trail-docs ao fluxo | `docs/19_AI_DOCS_INDEXING.md` | P2 | ⬜ |
| Revisar `20_DEPLOYMENT.md` — integrar com runbook | `docs/20_DEPLOYMENT.md` | P1 | ⬜ |
| Revisar `21_PLANO_CONCLUSAO_FINAL.md` — atualizar status | `docs/21_PLANO_CONCLUSAO_FINAL.md` | P1 | ⬜ |
| Atualizar `DESIGN_REFERENCES.md` — novos sites de referência 2026 | `docs/DESIGN_REFERENCES.md` | P2 | ⬜ |

---

## 4. Conclusão

Todos os itens P0, P1 e P2 do plano original foram implementados.
A sessão de Abril 2026 adicionou o `22_SKILLS_INDEX.md` e revisou os 16 documentos principais do framework, integrando skills, LGPD, STRIDE, quick start por papel e `/using-superpowers` como comando obrigatório em todos os prompts.
Ver `docs/21_PLANO_CONCLUSAO_FINAL.md` para status consolidado.
