# 18_POST_MORTEM.md — Template de Post-Mortem (Blameless)

> **Skills:** `/using-superpowers` `/postmortem-writing` `/systematic-debugging`  
> **Referência:** Google SRE, ghostinthewires/Post-Mortems-Template, incident.io  
> **Prazo:** preencher em até **48h** após resolução do incidente

> **Princípio blameless:** Foco em sistemas e processos, não em pessoas.  
> **Quando fazer:** SEV-1/2, perda de dados, segurança, resolução > 1h, recorrência.

Status: DRAFT  
Owner: [preencher]  
Data de preenchimento: [preencher]

---

## Metadados

| Campo | Valor |
|---|---|
| Incidente ID | INC-[NNNN] |
| Severidade | SEV-1 / SEV-2 / SEV-3 |
| Data de início (UTC) | YYYY-MM-DD HH:MM |
| Data de resolução (UTC) | YYYY-MM-DD HH:MM |
| Duração total | [minutos / horas] |
| Tempo até detecção | [minutos] |
| Tempo até mitigação | [minutos] |
| Impacto | [usuários afetados, % de requests, receita, SLA] |
| Serviços afetados | [preencher] |
| Runbook usado | `docs/16_RUNBOOK.md` |

---

## Resumo Executivo

> 2–3 frases: o que aconteceu, causa raiz em uma linha, ação principal tomada.

[preencher]

---

## Impacto em SLOs

| SLO | Meta | Valor durante incidente | Violação? |
|---|---|---|---|
| Disponibilidade | 99.9% | | Sim / Não |
| Latência p99 | < Xms | | Sim / Não |
| Error rate | < X% | | Sim / Não |

---

## Timeline (UTC)

| Timestamp | Evento | Responsável |
|---|---|---|
| HH:MM | Primeiro sintoma / alerta disparado | Sistema |
| HH:MM | Incidente reconhecido | |
| HH:MM | Investigação iniciada | |
| HH:MM | Causa raiz identificada | |
| HH:MM | Mitigação aplicada | |
| HH:MM | Resolução confirmada | |
| HH:MM | Canal de incidente fechado | |

---

## Causa Raiz

> Use 5 Whys. Inclua evidências: logs, métricas, trechos de código — não narrativa.

**Sintoma observado:**

**Por quê 1:**  
**Por quê 2:**  
**Por quê 3:**  
**Por quê 4:**  
**Por quê 5 (causa raiz):**  

**Evidências:**
```
[colar log, métrica ou código relevante]
```

---

## Fatores Contribuintes

> Sistemas, processos, ferramentas — não pessoas.

| Fator | Categoria | Descrição |
|---|---|---|
| | Falta de alerta / monitoramento | |
| | Configuração incorreta | |
| | Ausência de teste de regressão | |
| | Runbook desatualizado | |
| | Deploy sem gate de qualidade | |

---

## O que Funcionou

-
-

## O que Não Funcionou

-
-

---

## Action Items

> Itens P0 = bloqueiam próximo deploy; P1 = concluir em 1 semana; P2 = em 1 mês.

| Item | Categoria | Owner | Prazo | Prioridade | Status |
|---|---|---|---|---|---|
| | Monitoramento | | | P0 | ⬜ |
| | Processo | | | P1 | ⬜ |
| | Código | | | P1 | ⬜ |

---

## Lições Aprendidas

-
-

---

## Links

| Recurso | Link |
|---|---|
| Runbook do incidente | `docs/16_RUNBOOK.md` |
| Release que causou o incidente | [link PR/commit] |
| Dashboards do período | [link Grafana] |
| Logs do período | [link] |
| Incidente relacionado anterior | [INC-XXXX se houver] |
