# /deploy [ambiente] - Deploy com checklist

## Pre-requisitos
1. Verificar branch:
   - Deploy para producao somente de `main`
   - Deploy para staging de qualquer branch
2. Validar qualidade:
   - `npm run typecheck && npm run lint && npm run test`
   - `bash scripts/verify-docs.sh` exit 0
3. Verificar `docs/13_RELEASE_READINESS.md`:
   - Deve estar preenchido com GO ou GO WITH RISK
4. Checklist pre-deploy:
   - [ ] Migrations pendentes revisadas
   - [ ] Variaveis de ambiente atualizadas
   - [ ] Rollback plan documentado
   - [ ] Monitoramento configurado
5. Executar deploy conforme `docs/OPS01_DEPLOYMENT.md`
6. Verificar pos-deploy:
   - Smoke test dos fluxos criticos
   - Verificar logs por erros
   - Confirmar metricas de saude
