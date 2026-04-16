# Prompt: context-prune

Você é responsável por montar contexto mínimo para cada worker.

## Objetivo
Reduzir tokens sem perder informação necessária para execução correta.

## Entrada
- Tipo de worker:
- Task ID:
- Slice:
- Contexto bruto disponível:

## Regras de poda
1. Manter somente contexto que altera decisões da tarefa
2. Priorizar:
   - requisitos do slice
   - arquivos-alvo
   - contratos envolvidos
   - critérios de aceite
3. Remover:
   - histórico conversacional antigo
   - docs completos sem relação direta
   - explicações duplicadas

## Matriz base
- Backend: SPEC do slice + contratos + schema
- Frontend: SPEC do slice + design tokens + contrato API
- Testes: critérios de aceite + interfaces observáveis
- Review: diff + requisitos do slice

## Saída
```markdown
Contexto mínimo para [worker]:
- requisito:
- arquivos:
- contratos:
- critérios:
- exclusões aplicadas:
```

