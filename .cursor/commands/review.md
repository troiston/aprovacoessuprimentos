# /review - Revisao pre-commit

Objetivo: revisar mudancas com foco em risco, regressao e qualidade.

## Passos obrigatorios
1. Inspecionar mudancas:
   - `git diff --staged`
   - `git diff`
2. Rodar validacoes:
   - `npm run typecheck`
   - `npm run lint`
   - `npm run test` (quando houver alteracao de comportamento)
3. Revisar riscos no diff:
   - bugs logicos e edge cases
   - seguranca (input validation, authz, dados sensiveis)
   - performance (N+1, loops pesados, re-renders desnecessarios)
   - UX (loading, empty, error states)
   - acessibilidade (teclado, foco, labels, semantica)
   - hierarquia visual e consistencia com design system
4. Verificar higiene do codigo:
   - remover `console.log` e codigo morto
   - evitar `TODO` sem issue vinculada
   - manter padroes de arquitetura e naming

## Saida esperada
Entregar relatorio em 4 blocos:
1. Mudancas principais
2. Achados criticos (se houver)
3. Achados moderados/baixos
4. Recomendacao final (apto ou bloquear commit)
