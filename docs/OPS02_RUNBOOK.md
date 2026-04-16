# 16_RUNBOOK.md — Runbook de Incidente

> **Skills:** `/using-superpowers` `/incident-runbook-templates` `/systematic-debugging` `/on-call-handoff-patterns`  
> **Referência:** Rootly, Stew, IncidentHub (2024–2025)  
> **Após resolução:** preencher `docs/18_POST_MORTEM.md` em até 48h

Status: DRAFT  
Owner: [preencher]  
Última atualização: [preencher]

---

## Classificação de Severidade

| Severidade | Critério | Tempo de resposta | Owner |
|---|---|---|---|
| SEV-1 | Produção fora do ar; perda de dados; impacto em todos os usuários | Imediato (< 5 min) | Tech Lead |
| SEV-2 | Degradação severa; funcionalidade crítica comprometida; impacto parcial | < 15 min | Tech Lead |
| SEV-3 | Comportamento anormal sem impacto crítico; afeta poucos usuários | < 1h | QA Jr. |

---

## Estrutura — 5 Fases (Decision Tree)

> Cada fase pode ter ramificações conforme os sintomas. Não é linear.

---

### 1. Alert and Acknowledge (0–5 min)

- [ ] Reconhecer alerta no monitoramento (Grafana / Prometheus / logs)
- [ ] Classificar severidade (SEV-1 / SEV-2 / SEV-3)
- [ ] Criar canal de comunicação do incidente (`#incident-YYYY-MM-DD`)
- [ ] Postar status inicial: severidade, sintomas observados, impacto estimado
- [ ] Acionar Tech Lead se SEV-1 ou SEV-2

**Template de status inicial:**
```
🚨 INCIDENTE [SEV-X] — [HH:MM UTC]
Sintoma: [o que está errado]
Impacto: [usuários afetados / funcionalidade]
Status: Investigando
Owner: [nome]
```

---

### 2. Assess and Triage (5–15 min)

- [ ] Verificar health endpoints
- [ ] Revisar dashboards (Grafana) — error rate, latência, CPU/memória
- [ ] Revisar logs estruturados nos últimos 30 min
- [ ] Verificar deploys e mudanças recentes (git log, Docker Swarm services)
- [ ] Identificar serviços e containers afetados
- [ ] Formular hipóteses de causa raiz (máx. 3)

**Comandos de diagnóstico (Docker Swarm):**
```bash
# Ver estado dos serviços
docker service ls
docker service ps [nome-servico]

# Logs de um serviço
docker service logs [nome-servico] --tail 100 -f

# Inspetar container específico
docker inspect [container-id]

# Verificar recursos
docker stats --no-stream
```

---

### 3. Remediate

- [ ] Escolher ação de remediação com base nos sintomas
- [ ] Comunicar ação antes de executar (`"Executando rollback em 2 min"`)
- [ ] Documentar comando exato executado e motivo
- [ ] Verificar melhoria após cada ação antes de prosseguir

**Ações típicas por sintoma:**

| Sintoma | Ação | Comando / referência |
|---|---|---|
| Erro 5xx em API após deploy | Rollback | Ver `docs/20_DEPLOYMENT.md` — seção Rollback |
| Alta latência / timeout | Reiniciar serviço | `docker service update --force [servico]` |
| Out of memory | Escalar réplicas | `docker service scale [servico]=N` |
| Traefik não roteando | Verificar labels e rede | `docker network inspect [rede]` |
| Banco de dados lento | Verificar queries longas | `SELECT * FROM pg_stat_activity WHERE wait_event IS NOT NULL;` |
| Secrets incorretos | Recriar serviço com secrets | Ver `docs/06_SECURITY.md` seção Infra |

---

### 4. Verify Resolution (após remediação)

- [ ] Confirmar health endpoints respondem 200
- [ ] Verificar error rate normalizada no Grafana
- [ ] Verificar latência dentro dos SLOs
- [ ] Limpar alertas no monitoramento
- [ ] Testar fluxo crítico manualmente
- [ ] Comunicar resolução no canal do incidente

**Template de resolução:**
```
✅ RESOLVIDO — [HH:MM UTC]
Duração: [X min]
Causa raiz: [uma linha]
Ação tomada: [o que foi feito]
Próximos passos: post-mortem em 48h
```

---

### 5. Close and Document

- [ ] Registrar duração total do incidente
- [ ] Atualizar status final no canal
- [ ] Preencher `docs/18_POST_MORTEM.md` em até **48h** (blameless)
- [ ] Atualizar este runbook com correções identificadas
- [ ] Agendar review do post-mortem com o time

---

## Links de Referência

| Recurso | URL / Localização |
|---|---|
| Dashboards Grafana | [preencher] |
| Logs (centralizados) | [preencher] |
| Plano de rollback | `docs/20_DEPLOYMENT.md` |
| Template post-mortem | `docs/18_POST_MORTEM.md` |
| Release Readiness | `docs/11_RELEASE_READINESS.md` |
| Responsável primário | [preencher] |
| Responsável backup | [preencher] |

---

## Manutenção do Runbook

- Testar runbook em máquina limpa antes de cada deploy em produção
- Atualizar durante post-incident review
- Realizar exercícios de mock com novos membros do time
- Revisar links e comandos a cada major deploy de infraestrutura
