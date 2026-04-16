# 20_DEPLOYMENT.md — Runbook de Deploy

> **Skills:** `/using-superpowers` `/deployment-pipeline-design` `/gitops-workflow` `/github-actions-templates` `/secrets-management`  
> **Referência:** FireHydrant, Stew, LeanPivot  
> **Pré-condição:** `docs/11_RELEASE_READINESS.md` com decisão GO ou GO WITH RISK

Status: DRAFT  
Owner: [preencher]  
Última atualização: [preencher]  
Duração estimada: [preencher]

---

## Metadados da Release

| Campo | Valor |
|---|---|
| Versão | [ex: v1.2.0] |
| Tipo | Release planejada / Hotfix |
| Branch | `main` / `hotfix/NNNN` |
| Owner do deploy | [preencher] |
| Janela de deploy | [horário de menor tráfego — preencher] |
| Responsável de plantão | [preencher] |
| Responsável backup | [preencher] |

---

## Pré-requisitos

- [ ] `docs/11_RELEASE_READINESS.md` com decisão GO ou GO WITH RISK
- [ ] Acesso SSH ao VPS de produção configurado
- [ ] Secrets e variáveis de ambiente verificados (`/secrets-management`)
- [ ] `npm audit` executado — sem vulnerabilidades críticas
- [ ] Todos os testes verdes em CI (`npm run test`, `npm run test:e2e`)
- [ ] CHANGELOG atualizado com esta release

---

## Triggers de Deploy

| Trigger | Ação | Documento de referência |
|---|---|---|
| Release planejada (PR merged em main) | Este runbook | `docs/11_RELEASE_READINESS.md` |
| Hotfix crítico | Fase 3 do `16_RUNBOOK.md` → este runbook | `docs/16_RUNBOOK.md` |

---

## Passos de Deploy (Docker Swarm + Traefik)

> Adaptar conforme stack do projeto. Registrar comandos exatos abaixo.

### 1. Preparação

```bash
# Confirmar branch e commit
git log --oneline -5
git status

# Pull da imagem mais recente
docker pull [registry]/[imagem]:[tag]

# Verificar serviços atuais
docker service ls
```

### 2. Deploy

```bash
# Atualizar serviço no Swarm
docker service update   --image [registry]/[imagem]:[nova-tag]   --update-parallelism 1   --update-delay 10s   [nome-do-servico]

# Acompanhar o rollout
docker service ps [nome-do-servico] --no-trunc
```

### 3. Verificação Pós-Deploy

- [ ] Health check endpoint responde 200: `curl https://[dominio]/health`
- [ ] Logs sem erros críticos: `docker service logs [servico] --tail 50`
- [ ] Latência dentro do SLO (verificar Grafana)
- [ ] Smoke test dos fluxos críticos (manual ou automatizado)
- [ ] Certificado TLS válido (Traefik): `curl -I https://[dominio]`

```bash
# Smoke test rápido
curl -sf https://[dominio]/health | jq .
docker service logs [servico] --tail 100 | grep -i error
```

---

## Rollback

> **Critério de rollback automático:** error rate > X% nos primeiros 10 min pós-deploy.  
> **Owner:** [preencher]

```bash
# Rollback para versão anterior
docker service update   --rollback   [nome-do-servico]

# Verificar estado após rollback
docker service ps [nome-do-servico]
curl -sf https://[dominio]/health
```

**Rollback de banco de dados (se migration foi executada):**
```bash
# Desfazer última migration
npm run db:migrate:rollback

# Verificar estado do schema
npm run db:status
```

> ⚠️ O gate operacional em `docs/11_RELEASE_READINESS.md` exige que este plano esteja definido e **testado** antes do deploy.

---

## Comunicação Durante o Deploy

**Antes do deploy:**
```
🚀 Deploy [v1.x.x] iniciando em [HH:MM UTC]
Duração estimada: [X min]
Responsável: [nome]
```

**Após o deploy:**
```
✅ Deploy [v1.x.x] concluído — [HH:MM UTC]
Status: OK / Rollback executado
Próximos passos: monitorar por 30 min
```

---

## Monitoramento Pós-Deploy (primeiras 2h)

- [ ] Error rate estável no Grafana (primeiros 30 min)
- [ ] Latência p99 dentro do SLO
- [ ] Nenhum alerta disparado
- [ ] Logs limpos (sem `ERROR` ou `CRITICAL`)

**Se algo anormal:** acionar `docs/16_RUNBOOK.md` imediatamente.

---

## Histórico de Deploys

| Data | Versão | Resultado | Observação |
|---|---|---|---|
| | | ✅ OK / ❌ Rollback | |
