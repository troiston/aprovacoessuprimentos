# 13_QUICK_START.md — Execução Rápida (1 Página)

> Use este guia para executar o framework sem perder qualidade.  
> **Primeiro comando de toda sessão — sem exceção:** `/using-superpowers`

---

## Cursor — Requisitos e Estabilidade

- **Versão mínima:** Cursor 2.0.40+ (layout reset em versões antigas; Forum #139511, #146915)
- **Extensões recomendadas:** ESLint, Prettier, Tailwind CSS IntelliSense
- **Extensões conflitantes** (podem causar reset de layout): Markdown preview alternativos, AI agent assistants que alteram workspace
- Em caso de layout resetando: desative extensões conflitantes ou use "Reset Layout State" no Command Palette

---

## Ordem de Consulta no Início de Cada Projeto

```
1. docs/DOCS_INDEX.md        → status atual + fase
2. docs/22_SKILLS_INDEX.md   → skills a ativar na fase atual
3. docs/12_PROMPT_PACKS.md   → prompt pronto para copiar
4. Documento da fase atual   → executar
```

Documentos de suporte: `docs/DESIGN_REFERENCES.md` (Fase 1D) · `docs/14_IMAGE_GENERATION.md` (geração de imagens)

---

## Fluxo Mínimo por Fase

| Fase | Comando | Entrega | Skills obrigatórias |
|---|---|---|---|
| 0 — Validação | `/validate` | `00_VALIDATION.md` — GO/HOLD/NO-GO | `/validate` `/brainstorming` |
| 1b — PRD | `/prd` | `02_PRD.md` — requisitos priorizados | `/prd` `/context-driven-development` |
| 1c — Mercado | `/market` | `01_MARKET_AND_REFERENCES.md` — 4 frentes | `/market` |
| 1D — Design | `/design` | `04_DESIGN.md` + styleguide — preview aprovado | `/design` `/frontend-design` `/tailwind-design-system` `/accessibility-compliance` |
| 2 — Spec | `/spec` | `03_SPECIFICATION.md` — sem TODOs abertos | `/spec` `/openapi-spec-generation` `/postgresql-table-design` |
| 3B — Backend | `/implement-backend` | `05_IMPLEMENTATION.md` — backend | `/implement-backend` `/test-driven-development` `/secrets-management` |
| 3F — Frontend | `/implement-frontend` | `05_IMPLEMENTATION.md` — frontend | `/implement-frontend` `/react-state-management` `/accessibility-compliance` |
| 4 — Quality | agents em paralelo | `06` `07` `08` `09` `10` | `/test-writer` `/debugger` `/secrets-management` `/systematic-debugging` |
| Final | `/pr` | PR aberto | `/verification-before-completion` `/release` `/pr` |
| Hotfix | `/hotfix` | Correção + runbook + post-mortem | `/systematic-debugging` `/incident-runbook-templates` |

> **TDD na Fase 3:** ciclo **RED → GREEN → REFACTOR** por milestone da `03_SPECIFICATION.md`.  
> Detalhes: `.cursor/skills/test-writer/SKILL.md` e `docs/07_TESTS.md` seção 1.1.

> **Validação de entrada** (APIs/formulários) ≠ `/validate` (validação de ideia/negócio).  
> Usar Zod + contratos na SPEC para input validation — não misturar os vocabulários.

---

## Quick Start por Papel

### Tech Lead
```
1. /using-superpowers
2. Abrir DOCS_INDEX.md → identificar fase atual
3. Fases 0, 1a, 1b, 1c, 2, 3B, 4a/4e → Tech Lead executa
4. Revisar PRs com /receiving-code-review
5. Assinar 11_RELEASE_READINESS.md antes do PR
```

### Designer
```
1. /using-superpowers
2. Aguardar Tech Lead concluir Fases 0, 1b, 1c
3. Fase 1D → /design /frontend-design /tailwind-design-system /accessibility-compliance
4. Fase 3F → /implement-frontend /react-state-management
5. Fase 4D → /accessibility-compliance /interaction-design
```

### QA Jr.
```
1. /using-superpowers
2. Fase 4B → /test-writer /playwright-best-practices /e2e-testing-patterns
3. Fase 4C → /debugger /systematic-debugging
4. Preencher 07_TESTS.md, 08_DEBUG.md com veredito
5. Abrir PR com /requesting-code-review após verification-before-completion
```

---

## Regras que Não Podem Quebrar

1. `⛔` Não iniciar `/spec` ou implementação sem aprovação do preview de design
2. `⛔` Não implementar sem `03_SPECIFICATION.md` concluído e sem TODOs
3. `⛔` Refatoração com mudança de contratos públicos → ADR em `decisions/`
4. `⛔` Sem typecheck/lint/test verde, não fecha fase
5. `⛔` Sem checklist de segurança e UX, não fecha fase
6. `⛔` Nenhum PR sem `11_RELEASE_READINESS.md` preenchido
7. `⛔` Risco residual sempre com owner e prazo de revisão
8. `⛔` `/secrets-management` antes de todo commit na Fase 3

---

## Checklist Antes de Avançar de Fase

- [ ] Documento da fase atualizado com status e data
- [ ] Gates técnicos atendidos (typecheck/lint/test)
- [ ] Gates de segurança atendidos
- [ ] Gates UX/a11y atendidos
- [ ] Pendências com owner e prazo definidos
- [ ] Linha correspondente no `DOCS_INDEX.md` atualizada

---

## Comandos Base

```bash
# Verificação de docs
bash scripts/verify-docs.sh

# Gates técnicos (requer package.json)
npm run typecheck
npm run lint
npm run test
npm run test:e2e

# Audit de segurança
npm audit

# Análise de bundle (quando necessário)
ANALYZE=true npm run build
```

---

## Decisão de Release

```
docs/11_RELEASE_READINESS.md → preencher ANTES de abrir qualquer PR

✅ GO             → todos os gates aprovados
🟡 GO WITH RISK   → risco aceito, documentado com owner e prazo
❌ NO-GO          → bloqueios listados com IDs
```
