# /fix-issue [numero] - Corrigir issue

## Passos obrigatorios
1. Ler issue:
   - `gh issue view [numero]`
2. Clarificar diagnostico:
   - causa raiz provavel
   - escopo de impacto
   - criterio de aceite reproduzivel
3. Criar branch:
   - `git checkout -b fix/issue-[numero]-[slug-curto]`
4. Implementar correcao minima suficiente, sem escopo extra.
5. Criar/ajustar teste que falha antes e passa depois.
6. Rodar validacoes:
   - `npm run typecheck`
   - `npm run lint`
   - `npm run test`
7. Abrir PR referenciando issue:
   - `gh pr create --body "Fixes #[numero]"`
8. Retornar:
   - causa raiz
   - estrategia de correcao
   - URL do PR
