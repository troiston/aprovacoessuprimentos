---
id: cmd-orchestrate
title: Orquestrar Execucao por PRD
version: 1.0
last_updated: 2026-04-14
category: project
agent: orchestrator
skills:
  - orchestrator
---

# `/orchestrate`

Orquestra a execução de ponta a ponta com base no `docs/01_PRD.md`, coordenando fases, slices, workers e quality gates.

---

## Pré-condições

1. `docs/01_PRD.md` existe e está aprovado
2. `docs/DOCS_INDEX.md` existe
3. `bash scripts/verify-docs.sh` sem erros bloqueantes

Se alguma pré-condição falhar, o comando deve parar e reportar bloqueio.

---

## O que faz

1. Lê `docs/01_PRD.md` e extrai RFs
2. Decompõe em vertical slices
3. Monta task graph com dependências
4. Seleciona modelo por complexidade da tarefa
5. Faz context pruning por worker
6. Despacha execução por fase/skill
7. Roda quality gates entre fases
8. Aplica feedback loop quando fase posterior detecta falha de fase anterior
9. Gera `docs/ORCHESTRATOR_METRICS.md`

---

## Guardrails

- Não pular gate entre fases
- Não paralelizar tarefas com sobreposição de arquivos
- Limitar retries por gate (máx 2 antes de escalar para humano)
- Respeitar budgets de token por fase

---

## Saída esperada

```text
✅ Orquestração concluída
- Slices executados: X
- Gates PASS: Y / FAIL: Z
- Escalações humanas: N
- Métricas: docs/ORCHESTRATOR_METRICS.md
```

