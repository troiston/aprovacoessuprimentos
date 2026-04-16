# /hotfix [descricao] - Correcao urgente em producao

> Diferente de /fix-issue: hotfix e para SEV-1/2 (producao down, seguranca). Git-flow: branch de main, merge main + develop.

## Passos obrigatorios

1. **Confirmar severidade:** SEV-1 (producao down) ou SEV-2 (seguranca critica)
2. **Branch:** `git checkout main && git pull && git checkout -b hotfix/[versao ou descricao]`
   - Ex: `hotfix/1.2.1` ou `hotfix/auth-bypass`
3. **Correcao minima:** Um problema por branch; sem escopo extra
4. **Smoke test:** Validar localmente o minimo
5. **PR + code review:** Reduz risco mesmo em hotfix
6. **Merge em main:** Tag semver (ex: `git tag v1.2.1`)
7. **Merge em develop:** `git checkout develop && git merge main` (sincronizar)
8. **Deploy:** Executar conforme docs/20_DEPLOYMENT.md ou runbook do projeto
9. **CHANGELOG:** Atualizar com [Security] ou [Fixed]
10. **Post-mortem:** Agendar em 48h; usar template `docs/18_POST_MORTEM.md`

## Regras

- Um hotfix por vez
- Nunca criar hotfix de branch instavel (develop com WIP)
- Documentar em WORKFLOW.md quando usar hotfix vs fix-issue
