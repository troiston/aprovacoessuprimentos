# Schema: metrics

## Objetivo
Padronizar coleta de métricas operacionais e de token por sessão orquestrada.

## Estrutura
```markdown
# ORCHESTRATOR_METRICS

## Sessão
- started_at:
- finished_at:
- source_prd:
- orchestrator_version:

## Resumo global
- total_slices:
- total_tasks:
- total_retries:
- escalations_to_human:
- gates_failed:

## Tokens
- input_tokens_total:
- output_tokens_total:
- by_phase:
  - phase:
    input_tokens:
    output_tokens:
    budget:
    status: within_budget | exceeded

## Throughput por fase
| Fase | Tasks | Modelos usados | Retries | Gate |
|---|---|---|---|---|

## Bloqueios recorrentes
- causa:
- frequência:
- ação corretiva recomendada:
```

## Regras
1. Registrar sempre modelos por fase
2. Separar token de entrada e saída
3. Destacar excesso de budget com recomendação

