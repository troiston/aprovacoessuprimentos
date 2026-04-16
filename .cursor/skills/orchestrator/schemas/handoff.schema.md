# Schema: handoff

## Objetivo
Padronizar comunicação entre workers sem enviar documentos longos.

## Estrutura
```markdown
## Handoff: [fase_origem] -> [fase_destino]

**Slice:** [id/nome]
**Task:** [id]
**Status:** complete | partial | blocked
**Arquivos modificados:**
- ...
**Contratos expostos/consumidos:**
- ...
**Decisões tomadas:**
- ...
**Riscos e bloqueios:**
- ...
**Próxima ação sugerida:**
- ...
```

## Regras
1. Máximo 12 linhas por handoff
2. Incluir apenas mudanças verificáveis
3. Bloqueios devem apontar fase de origem provável

