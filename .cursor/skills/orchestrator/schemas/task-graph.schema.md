# Schema: task-graph

## Objetivo
Representar o plano executável derivado do PRD em formato de grafo.

## Estrutura
```markdown
# Task Graph

## Metadata
- source_prd: docs/01_PRD.md
- generated_at:
- orchestrator_version:

## Slice
- id:
- nome:
- objetivo:
- rfs_cobertos:
- acceptance_global:

### Task
- id:
- titulo:
- tipo: data | backend | frontend | test | seo | review
- complexidade: mechanical | integration | judgment
- owner_worker:
- modelo:
- arquivos_write:
- arquivos_read:
- blockedBy:
- acceptance:
- definitionOfDone:
- paralelizavel: true|false
```

## Regras de consistência
1. Não permitir ciclo em `blockedBy`
2. Toda task precisa de `definitionOfDone`
3. Task sem arquivo-alvo é inválida
4. Slice sem critério de aceite global é inválido

