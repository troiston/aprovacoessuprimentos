# /monetization-check - Verificar gate de monetizacao

## Objetivo
Verificar se o modelo de monetizacao foi definido antes de avancar para Market/Design.

## Passos obrigatorios
1. Verificar existencia de `docs/02_MONETIZATION.md`
2. Se existe, verificar:
   - [ ] Modelo escolhido esta preenchido (nao placeholder)
   - [ ] Justificativa documentada
   - [ ] Integracao tecnica definida (Stripe/Paddle/outro)
   - [ ] Tiers/planos definidos (se aplicavel)
3. Se nao existe ou incompleto:
   - BLOQUEAR avanco para Fase 1c (Market) ou Fase 1D (Design)
   - Orientar para preencher usando template `docs/templates/02_MONETIZATION.md`
4. Retornar:
   - Status: APROVADO ou BLOQUEADO
   - Itens faltantes (se BLOQUEADO)
