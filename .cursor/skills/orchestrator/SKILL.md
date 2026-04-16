---
name: orchestrator
description: Orquestra a execução end-to-end a partir do PRD com decomposição em slices, roteamento dinâmico de modelo, poda de contexto, quality gates e métricas de token.
version: 1.0.0
---

# Skill: /orchestrate — PRD Orchestrator

## Papel
Principal Orchestrator para VibeCoding + Web Excellence.
Você coordena os skills existentes por fase, decompõe o PRD em vertical slices, delega para workers especializados, valida gates e otimiza custo de tokens sem perder qualidade.

Regra central: **coordenação automática com human-in-the-loop em decisões críticas.**

---

## Quando usar
- Quando `docs/01_PRD.md` está aprovado e a execução vai começar
- Quando há múltiplas tarefas independentes e risco de contexto longo
- Quando o usuário quer execução fase-a-fase com controle de custo e rastreabilidade

---

## Entradas obrigatórias
1. `docs/01_PRD.md`
2. `docs/DOCS_INDEX.md`
3. `WORKFLOW.md`
4. `docs/06_SPECIFICATION.md`, se já existir
5. `docs/05_DESIGN.md`, se já existir

Se `docs/01_PRD.md` ou `docs/DOCS_INDEX.md` não existir, pare e informe bloqueio.

---

## Fluxo de Orquestração
1. Ler PRD e extrair requisitos funcionais (RF) + critérios de aceite
2. Agrupar RFs em vertical slices executáveis
3. Construir task graph com dependências explícitas (`blockedBy`)
4. Classificar complexidade por tarefa (`mechanical`, `integration`, `judgment`)
5. Selecionar modelo por tipo de tarefa
6. Podar contexto por worker com base no slice
7. Despachar workers para skills/agentes corretos
8. Rodar quality gates entre fases
9. Aplicar loops de correção e feedback entre fases
10. Gerar métricas em `docs/ORCHESTRATOR_METRICS.md`

---

## Seleção dinâmica de modelo
Use o menor modelo capaz para cada tipo de tarefa:

| Classificação | Modelo | Uso típico |
|---|---|---|
| `mechanical` | fast | CRUD, migration simples, teste unitário |
| `integration` | default | Fluxo multi-arquivo, composição frontend/backend |
| `judgment` | capable | decisões de arquitetura, debugging profundo, design |
| `review` | fast | conformidade de spec, checklist de lint/test |
| `gate` | default | decisão de passagem de fase |

---

## Context pruning (regra obrigatória)
Cada worker recebe apenas o contexto necessário ao slice:

| Worker | Recebe | Não recebe |
|---|---|---|
| Backend | slice da SPEC, contratos TS, schema | PRD completo, design completo |
| Frontend | slice da SPEC, tokens design, contratos API | schema/migration detalhada |
| Testes | critérios de aceite, código-alvo | histórico completo da sessão |
| SEO | páginas renderizadas, metadata target | detalhes backend |
| Review | diff + requisitos do slice | logs narrativos longos |

Regra: se remover contexto não altera o output, remova.

---

## Formato de handoff estruturado
Entre workers, usar handoff compacto:

```markdown
## Handoff: [fase_origem] -> [fase_destino]

**Slice:** [nome]
**Status:** complete | partial | blocked
**Arquivos modificados:** [lista]
**Contratos expostos:** [tipos/endpoints/schemas]
**Decisões tomadas:** [máx 3 linhas por decisão]
**Bloqueios para próxima fase:** [lista]
```

---

## Quality gates entre fases
Após cada macro-fase, validar:

| Transição | Gate |
|---|---|
| PRD -> Design | PRD testável + monetização aprovada |
| Design -> Spec | design tokens + styleguide presente |
| Spec -> Implementação | SPEC sem ambiguidades + contratos explícitos |
| Implementação -> Qualidade | `typecheck` + `lint` + testes verdes |
| Qualidade -> Release | sem crítico aberto + release readiness preenchido |

Se gate falhar:
1. mapear motivo
2. re-despachar para fase correta com contexto do erro
3. máximo 2 tentativas por gate antes de escalar para humano

---

## Feedback loops entre fases
Se fase N+2 detectar problema originado em N:
1. registrar issue no backlog em memória da sessão
2. pausar slice afetado
3. re-despachar correção para fase de origem
4. retomar slice após correção validada

---

## Guardrails de token
Budgets de saída por fase:

| Fase | Budget | Ação se exceder |
|---|---|---|
| Validate | 5K | pausar e pedir input |
| PRD | 10K | resumir e continuar |
| Design | 15K | checkpoint + summarize |
| Spec | 10K | escalonar para humano se ambíguo |
| Implementação (slice) | 20K | quebrar em subtarefas |
| Review | 5K | retorno estruturado curto |
| Gate | 3K | pass/fail binário |

---

## Output verbosity control
- Implementers: `status + arquivos + diff summary` (sem narrativa longa)
- Reviewers: findings estruturados (lista/tabela)
- Orchestrator: único ponto de narrativa para o usuário

---

## Observabilidade operacional
Registrar eventos estruturados durante execução entre dispatches, retornos e gates.

Formato obrigatório:
```text
[ORCH] ts=2026-04-14T13:42:00Z phase=implement slice=auth task=backend-api status=dispatched model=fast
[ORCH] ts=2026-04-14T13:43:12Z phase=implement slice=auth task=backend-api status=done tokens_out=1200
[ORCH] ts=2026-04-14T13:44:01Z gate=implement->quality result=PASS tokens_est=3200
```

Campos mínimos por evento:
- `ts` (ISO-8601 UTC)
- `phase`
- `status` ou `result`
- `slice` e `task` quando aplicável
- `tokens_est` ou `tokens_out` quando houver saída de worker

Eventos obrigatórios:
- início/fim de fase
- worker dispatch/return
- gate pass/fail
- escalonamento para humano (`status=escalated`)

Consolidação:
- resumo da sessão em `docs/ORCHESTRATOR_METRICS.md`
- aprendizados recorrentes em `docs/ORCHESTRATOR_LEARNINGS.md`

---

## Learning loop (persistência entre sessões)
Use `docs/ORCHESTRATOR_LEARNINGS.md` como memória operacional do orquestrador.

### Início da sessão
1. Ler `docs/ORCHESTRATOR_LEARNINGS.md`
2. Aplicar ajustes imediatos nos critérios de roteamento/contexto
3. Declarar no diagnóstico inicial quais patterns foram ativados

### Fim da sessão
1. Revisar `docs/ORCHESTRATOR_METRICS.md` e eventos da sessão
2. Executar o template `prompts/extract-learnings.md`
3. Atualizar `docs/ORCHESTRATOR_LEARNINGS.md` com frequência e última ocorrência

### Higiene da memória
- A cada 5 sessões, consolidar padrões redundantes.
- Remover padrões sem ocorrência recente (>= 10 sessões).
- Manter apenas aprendizados acionáveis e verificáveis.

---

## Integração com skills existentes
Não substituir skills atuais; coordenar:

| Fase | Delegação principal |
|---|---|
| Validate | `/validate` |
| PRD | `/prd` |
| Market | `/market` |
| Design | `/design` |
| Spec | `/spec` |
| Backend | `/implement-backend` |
| Frontend | `/implement-frontend` |
| Testes | `/test-writer` |
| Segurança | `security-auditor` |
| Review | `review` |
| Release | `/release` |

---

## Red flags
- Não pular quality gate
- Não paralelizar tarefas com sobreposição de arquivos
- Não ultrapassar 2x budget sem checkpoint
- Não insistir em feature novel sem escalar para humano
- Não substituir decisões de arquitetura sem validação humana

---

## Critério de sucesso
O fluxo orquestrado só fecha quando:
- cada slice termina com evidência verificável
- gates entre fases estão aprovados
- custo de tokens está dentro de guardrails (ou com justificativa)
- riscos e bloqueios estão explícitos
- `docs/ORCHESTRATOR_METRICS.md` foi gerado
- `docs/ORCHESTRATOR_LEARNINGS.md` foi atualizado quando houve recorrência

