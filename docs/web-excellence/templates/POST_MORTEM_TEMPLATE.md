---
id: doc-post-mortem-template
title: Template de Post Mortem
version: 2.0
last_updated: 2026-04-07
category: templates
priority: standard
related:
  - docs/web-excellence/decisions/_TEMPLATE_ADR.md
  - docs/web-excellence/security/01_SECURITY_CHECKLIST.md
---

# Template de Post Mortem

## Resumo Executivo

Post mortems são documentos que analisam incidentes de produção para aprender e prevenir recorrência. O formato é **blameless** (sem culpa individual) — o foco é em sistemas, processos e melhorias. Baseado nas práticas do Google SRE, PagerDuty e Atlassian Incident Management Handbook.

---

## Princípios de Post Mortem Blameless

### Por que Blameless?

1. **Culpa inibe transparência** — pessoas escondem erros quando temem punição
2. **Sistemas falham, não pessoas** — se uma pessoa pode derrubar produção, o sistema falhou antes
3. **Aprendizado > punição** — cada incidente é oportunidade de fortalecer o sistema
4. **Cultura de confiança** — post mortems blameless constroem equipes mais resilientes

### Linguagem

| ❌ Evitar | ✅ Preferir |
|-----------|-----------|
| "João causou o outage" | "Uma mudança na config de deploy causou o outage" |
| "O time de infra errou" | "O processo de rollback não tinha guardrails suficientes" |
| "Falta de atenção" | "O checklist de deploy não cobria esta verificação" |
| "Falha humana" | "O sistema permitiu que uma config inválida fosse aplicada" |

---

## Template

```markdown
# Post Mortem: [Título Descritivo do Incidente]

## Metadata
- **Data do Incidente:** YYYY-MM-DD
- **Duração:** [tempo total de impacto]
- **Severidade:** SEV-1 | SEV-2 | SEV-3
- **Autores:** [nomes]
- **Data do Post Mortem:** YYYY-MM-DD
- **Status:** draft | reviewed | final

## 1. Resumo do Incidente

[Parágrafo de 2-3 frases descrevendo o que aconteceu, o impacto,
e a duração. Deve ser compreensível por qualquer pessoa da empresa.]

**Exemplo:**
Em 15/03/2026, das 14:23 às 15:47 (1h24min), o serviço de autenticação
ficou indisponível, impedindo login de todos os usuários. Aproximadamente
15.000 usuários foram afetados. A causa raiz foi uma migração de banco de
dados que travou uma tabela crítica.

## 2. Timeline

| Horário (UTC-3) | Evento |
|-----------------|--------|
| 14:15 | Deploy da versão v2.3.1 iniciado (inclui migration 20260315_add_index) |
| 14:23 | Alertas de latência disparados (p99 > 5s) |
| 14:25 | Usuários reportam erros de login no Intercom |
| 14:28 | Engenheiro de plantão (Maria) acionada via PagerDuty |
| 14:32 | Maria identifica locks na tabela `users` via pg_stat_activity |
| 14:35 | Tentativa de cancelar a migration |
| 14:40 | Migration cancelada, mas locks persistem |
| 14:45 | Decisão de fazer rollback do deploy |
| 14:52 | Rollback iniciado |
| 15:10 | Rollback completado, locks liberados gradualmente |
| 15:30 | Latência normaliza (p99 < 200ms) |
| 15:47 | Todos os alertas resolvidos, incidente encerrado |

## 3. Causa Raiz

[Descrição técnica detalhada da causa fundamental. Não a causa
imediata (trigger), mas a causa sistêmica que permitiu o problema.]

**Exemplo:**
A migration `20260315_add_index` criou um índice na tabela `users`
(3.2M rows) usando `CREATE INDEX` sem a flag `CONCURRENTLY`. Isso
adquiriu um `ACCESS EXCLUSIVE` lock na tabela inteira, bloqueando
todas as queries de SELECT e UPDATE durante a criação do índice
(estimado em ~20 minutos para o volume de dados).

O processo de review de migrations não tinha checklist para
verificar o uso de `CONCURRENTLY` em tabelas com mais de 100K rows.
O ambiente de staging tinha apenas 10K rows, onde a migration
completou em <1 segundo sem problemas perceptíveis.

## 4. Impacto

### Usuários Afetados
- **~15.000 usuários** não conseguiram fazer login
- **~3.000 sessões ativas** expiraram durante o incidente
- **0 perda de dados** confirmada

### Impacto no Negócio
- **1h24min** de indisponibilidade do serviço de auth
- **~200 tickets** de suporte recebidos
- **~R$45.000** em receita estimada não processada (signups + upgrades)
- **SLA breach** para 3 clientes enterprise (99.9% → violado)

### Impacto Técnico
- **Database:** Lock contention por 87 minutos
- **API:** Error rate de 78% durante o incidente
- **Monitoring:** Alertas funcionaram em <5 minutos

## 5. O que Deu Certo

- ✅ Alertas dispararam em 2 minutos (dentro do SLO)
- ✅ Engenheira de plantão respondeu em 5 minutos
- ✅ Diagnóstico correto em 7 minutos (pg_stat_activity)
- ✅ Comunicação com clientes enterprise em 15 minutos
- ✅ Status page atualizada em 10 minutos
- ✅ Zero perda de dados

## 6. O que Deu Errado

- ❌ Migration não-concorrente em tabela de produção com 3.2M rows
- ❌ Review de migration não detectou o problema
- ❌ Staging não representava escala de produção (10K vs 3.2M rows)
- ❌ Rollback demorou 20 minutos (sem procedimento automatizado)
- ❌ Sem dry-run de migration em cópia de produção
- ❌ Cancelar a migration não liberou os locks imediatamente

## 7. Action Items

| # | Ação | Responsável | Prioridade | Prazo | Status |
|---|------|-------------|-----------|-------|--------|
| 1 | Adicionar lint rule para `CREATE INDEX` sem `CONCURRENTLY` | @carlos | P0 | 2026-03-22 | ☐ |
| 2 | Criar checklist de review de migrations para tabelas > 100K rows | @maria | P0 | 2026-03-25 | ☐ |
| 3 | Seed de staging com dataset representativo (1M+ rows) | @devops | P1 | 2026-04-01 | ☐ |
| 4 | Automatizar rollback com um comando | @carlos | P1 | 2026-04-01 | ☐ |
| 5 | Implementar migration dry-run em cópia de prod | @devops | P1 | 2026-04-15 | ☐ |
| 6 | Adicionar lock monitoring alert (locks > 30s) | @maria | P1 | 2026-03-29 | ☐ |
| 7 | Documentar runbook para "database lock contention" | @maria | P2 | 2026-04-08 | ☐ |

## 8. Lições Aprendidas

### Para a Equipe de Engenharia
1. **Migrations são deploys de infraestrutura** — devem ter o mesmo rigor
   de review que código de produção.
2. **Staging precisa representar produção** — especialmente em volume de dados.
   Um teste que passa em 10K rows e falha em 3M rows não é um teste.
3. **`CONCURRENTLY` é obrigatório** para qualquer DDL em tabelas > 100K rows.

### Para o Processo
1. **Checklists previnem classes inteiras de erros** — se a checklist de
   migration existisse, este incidente não teria acontecido.
2. **Rollback deve ser um botão** — cada minuto de deliberação é um minuto
   de impacto. Automatizar decisões previsíveis.

### Para a Organização
1. **Investir em staging realista** paga-se no primeiro incidente evitado.
2. **Post mortems são investimento** — 2 horas de análise salvam semanas
   de firefighting futuro.
```

---

## Severidade

### Definições

| Severidade | Descrição | Exemplos |
|-----------|-----------|---------|
| **SEV-1** | Serviço principal indisponível para todos os usuários | Login down, data loss, security breach |
| **SEV-2** | Feature importante degradada ou indisponível | Pagamentos falhando, search lento, feature inacessível |
| **SEV-3** | Problema menor com workaround disponível | Bug visual, feature edge case, performance degradada para subconjunto |

---

## Processo

### Fluxo de Post Mortem

```
Incidente Resolvido
    ↓ (dentro de 24h)
Draft do Post Mortem
    ↓ (dentro de 48h)
Review com envolvidos
    ↓ (dentro de 72h)
Post Mortem Meeting (30-60min)
    ↓
Action Items atribuídos com prazo
    ↓
Follow-up semanal até todos AIs completados
    ↓
Post Mortem arquivado
```

### Quem Participa

| Role | Responsabilidade |
|------|-----------------|
| **Incident Commander** | Coordenou a resposta, escreve o draft |
| **Engenheiros envolvidos** | Contribuem com timeline e detalhes técnicos |
| **Engineering Manager** | Garante que action items tem owner e prazo |
| **Product Manager** | Contribui com impacto no negócio |
| **Stakeholders** (se SEV-1) | Informados do resultado e ações |

---

## Frequência

| Severidade | Post Mortem Obrigatório? | Meeting Obrigatório? |
|-----------|------------------------|---------------------|
| SEV-1 | ✅ Sim | ✅ Sim (toda equipe) |
| SEV-2 | ✅ Sim | ⚠️ Opcional (envolvidos) |
| SEV-3 | ⚠️ Opcional (recomendado) | ❌ Não (async) |

---

## Métricas de Eficácia

### Post Mortem Health Check

```
□ Post mortems escritos em < 72h após incidente?
□ Action items com owner e prazo definidos?
□ Action items completados no prazo (> 80%)?
□ Incidentes com mesma causa raiz recorrendo? (deve ser 0)
□ Equipe se sente segura para reportar erros?
□ Post mortems são lidos por outras equipes? (learning sharing)
```

### Métricas para Acompanhar

| Métrica | Alvo |
|---------|------|
| Tempo para post mortem (draft) | < 72h |
| % action items completados no prazo | > 80% |
| Recorrência de mesma causa raiz | 0 |
| SEV-1 por trimestre | Tendência de queda |
| MTTR (Mean Time to Recovery) | Tendência de queda |
