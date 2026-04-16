# 01_PRD.md — Product Requirements Document

> **Skills:** `/using-superpowers` `/prd` `/context-driven-development`  
> **Depende de:** `00_VALIDATION.md` (GO — nota 8,5)  
> **Responsável:** Tech Lead + Owner de processo: setor de incorporação  
> **Artefato-fonte:** planilha `Pendências Incorporação 2.xlsx` (inspecionada em 15/04/2026)  
> **Natureza:** produto **interno final** — sem página de vendas, sem monetização, sem MVP separado  
> **Gate de saída:** requisitos priorizados, critérios de aceitação testáveis, owner aprovado

Status: CONCLUÍDO  
Data: 15/04/2026  
Autor: PRD assistido (base: validação + engenharia reversa da planilha)

---

## 1. Resumo executivo

Construir um **sistema web interno** que substitua definitivamente a planilha Excel usada pelo setor de incorporação da Olá para acompanhar **empreendimentos imobiliários** ao longo de **22 etapas** regulatórias e operacionais. O sistema deve replicar com fidelidade o **modelo de pesos e cálculo de % de avanço**, oferecer a mesma **visão de pendências por responsável e prazo**, e agregar o que a planilha não entrega: controle de acesso, trilha de auditoria, edição concorrente segura e histórico de alterações. Entrega como **produto final operacional** na stack Next.js + Prisma + PostgreSQL já presente no repositório.

---

## 2. Problema e contexto

| Aspecto | Detalhe |
|---------|---------|
| **Dor principal** | A planilha é a **única fonte de verdade** para 9 empreendimentos e ~66 pendências ativas, mas não suporta edição concorrente segura, auditoria nem controle de acesso |
| **Frequência** | Uso **diário** pelo time (6+ pessoas), atualização em reuniões semanais |
| **Intensidade** | Alta — erros de fórmula, linhas desalinhadas e dados duplicados já observados na inspeção |
| **Alternativa atual** | Excel com 8 abas, 22 etapas, motor de pesos manual e painéis semi-automáticos |
| **Gatilho para substituir** | App live com **paridade** validada para ≥1 empreendimento piloto → desativação da edição da planilha |
| **Evidência** | `docs/00_VALIDATION.md` §3-§5; engenharia reversa confirmou fórmula: `PesoBruto = (2×Impacto + Dep + Tempo + Esforço) / 5` |

---

## 3. Objetivos e não objetivos

### Objetivos (esta entrega)

1. **Paridade funcional** com as abas Lançamentos, Acompanhamento, Parâmetros, Datas e Painel/Teste da planilha.
2. **Motor de cálculo** fiel: pesos por etapa, fases macro, % de avanço por empreendimento.
3. **Controle de acesso** (autenticação + perfis leitura/edição/admin) e **auditoria** de alterações.
4. **Visão por responsável** ("Minhas tarefas") com filtros e ordenação por prazo.
5. **Carga inicial** dos dados existentes na planilha para garantir migração sem perda.

### Não objetivos (fora de escopo)

| # | Item explicitamente fora |
|---|--------------------------|
| N1 | Página de marketing / vendas / landing page |
| N2 | Monetização, planos, Stripe, billing |
| N3 | Integração com ERP Sienge ou qualquer sistema externo |
| N4 | Matriz de dependências entre etapas (aba Planilha1 — está vazia; avaliar em fase futura) |
| N5 | Notificações por e-mail/push (avaliar pós-go-live) |
| N6 | App mobile nativo (web responsiva é suficiente) |
| N7 | Multi-empresa / multi-tenant (apenas Olá) |
| N8 | Geração automática de documentos (contratos, pizzas, CVs) |

---

## 4. Personas e JTBD

### Persona 1 — Coordenador(a) de incorporação (ex.: Lyvia, France)

| Campo | Valor |
|-------|-------|
| Perfil | Profissional que coordena aprovações, prazos e documentação de múltiplos empreendimentos |
| Dor | Precisa manter status e pendências atualizados em planilha compartilhada sem conflitos |
| Job | "Quando preciso saber o que fazer esta semana, abro a planilha e filtro minhas linhas" |
| Gatilho | Início do dia / reunião semanal de acompanhamento |
| Critério de abandono | Se o sistema for mais lento ou mostrar menos informação que o Excel |

### Persona 2 — Gestor / direção (ex.: Renan, liderança)

| Campo | Valor |
|-------|-------|
| Perfil | Toma decisões sobre prioridade de empreendimentos e aloca recursos |
| Dor | Quer ver rapidamente % de avanço consolidado e gargalos (etapas em andamento há muito tempo) |
| Job | "Quando entro em reunião, quero ver todos os empreendimentos lado a lado com barra de progresso" |
| Gatilho | Reunião de diretoria / cobrança de prazo |
| Critério de abandono | Se o painel não replicar pelo menos o que a aba Lançamentos mostra hoje |

### Persona 3 — Operacional / suporte (ex.: Jusci, Mixcon/Cix)

| Campo | Valor |
|-------|-------|
| Perfil | Executa tarefas de campo: protocola documentos, cobra terceiros, coleta assinaturas |
| Dor | Precisa saber exatamente o que é responsabilidade dele e qual o prazo |
| Job | "Quando abro o sistema, quero uma lista só com o que EU preciso entregar" |
| Gatilho | Designação de nova tarefa ou cobrança de prazo |
| Critério de abandono | Se não tiver visão filtrada por responsável |

---

## 5. Jornada principal

### Fluxo A — Gestor consulta avanço geral

1. Faz login no sistema.
2. Vê **dashboard** com cards dos empreendimentos: nome, barra de progresso (%), etapa mais avançada e etapa com mais atraso.
3. Clica num empreendimento → **painel** detalhado: lista de etapas com status (Finalizado / Em andamento / Não iniciado), peso, contribuição ao %, e lista de pendências daquela obra.
4. Filtra pendências por etapa, responsável ou faixa de prazo.

### Fluxo B — Coordenador atualiza status

1. Abre um empreendimento ou a lista geral de pendências.
2. Altera o **status** de uma etapa (ex.: "Em andamento" → "Finalizado").
3. O sistema **recalcula % de avanço** automaticamente e registra quem alterou, quando e valor anterior.
4. Adiciona/edita **tarefa** (ação, responsável, prazo, observação).

### Fluxo C — Operacional vê "Minhas tarefas"

1. Faz login → cai na tela "Minhas tarefas" filtrada pelo seu usuário.
2. Vê pendências ordenadas por prazo (mais urgente primeiro), com nome do empreendimento e etapa.
3. Marca tarefa como concluída ou adiciona observação (ex.: "Protocolado dia 01/04/2026").

### Edge cases críticos

- Etapa marcada como "Finalizado" quando ainda há tarefas abertas → sistema exibe aviso mas permite (decisão consciente).
- Prazo vencido → destaque visual (vermelho) na lista.
- Exclusão de empreendimento → soft delete com log; tarefas ficam acessíveis em modo leitura.

---

## 6. Requisitos funcionais (MoSCoW)

### Must Have (P0)

| ID | Requisito | Origem planilha | Valor |
|----|-----------|-----------------|-------|
| **RF-01** | CRUD de **empreendimentos** (nome, status geral) | Linha 3 aba Lançamentos (colunas C–K) | Base de tudo |
| **RF-02** | Cadastro de **etapas** com 4 parâmetros (Impacto 1–5, Dependência 1–5, Tempo 1–5, Esforço 1–5) e cálculo automático de peso bruto `(2×Imp + Dep + Tempo + Esf) / 5` | Aba Parâmetros R4–R28 | Fidelidade ao modelo |
| **RF-03** | Agrupamento de etapas em **fases macro** (Aquisição Terreno, Incorporação, Atividades p/ Lançamento, CEF) com peso global derivado | Aba Parâmetros R3/R10/R20/R24 | Cálculo de avanço |
| **RF-04** | **Status por empreendimento × etapa**: Finalizado (1,0), Em andamento (0,5), Não iniciado (0,0) | Aba Lançamentos R5–R26 colunas C–K | Entrada principal |
| **RF-05** | Cálculo automático de **% de avanço** = `Σ(status × pesoGlobal)` por empreendimento | Aba Lançamentos R4 colunas C–K | Indicador-chave |
| **RF-06** | CRUD de **tarefas/ações** vinculadas a empreendimento + etapa, com campos: descrição, responsável, prazo, status, observação | Aba Acompanhamento R3–R66 | Backlog operacional |
| **RF-07** | **Painel por empreendimento**: % avanço, lista de etapas com status e peso, pendências associadas, indicador de itens críticos | Aba Painel R2–R24 | Visão executiva |
| **RF-08** | **Visão "Minhas tarefas"**: lista filtrada por responsável logado, ordenável por prazo | Aba Teste R2–R19 (protótipo Lyvia) | Operacional |
| **RF-09** | **Dashboard geral**: todos os empreendimentos com % avanço, quantidade de pendências, destaque para prazos vencidos | Aba Lançamentos (resumo) | Visão de portfólio |
| **RF-10** | **Auth e RBAC**: login por e-mail/senha; perfis `admin` (tudo), `editor` (status + tarefas), `viewer` (somente leitura) | `00_VALIDATION.md` §9 | Segurança |
| **RF-11** | **Trilha de auditoria**: registrar quem alterou, quando, valor anterior e novo para mudanças em status de etapa, tarefas e parâmetros | `00_VALIDATION.md` §9 | Compliance |
| **RF-12** | **Carga inicial** (seed/import): popular banco com os 9 empreendimentos, 22 etapas, 4 fases, pesos e status atuais da planilha | `00_VALIDATION.md` §13 item 6 | Migração |

### Should Have (P1)

| ID | Requisito | Origem | Valor |
|----|-----------|--------|-------|
| **RF-13** | **Cronograma por etapa**: data de protocolo, prazo estimado, dias corridos e dias restantes (referência: "Hoje") | Aba Datas R3–R25 | Planejamento |
| **RF-14** | **Contadores no painel**: total de atividades, atividades críticas (prazo < 7 dias ou vencido) por empreendimento | Aba Painel R3–R4 | Alertas |
| **RF-15** | **Filtros combinados** na lista de tarefas: empreendimento + etapa + responsável + faixa de prazo | Uso geral | Produtividade |
| **RF-16** | **Edição inline** de status de etapa e campos de tarefa (sem abrir modal para cada alteração) | UX paridade com Excel | Agilidade |

### Could Have (P2)

| ID | Requisito | Valor |
|----|-----------|-------|
| **RF-17** | **Export CSV/Excel** da lista de tarefas e do status de etapas | Compatibilidade com processos legados |
| **RF-18** | **Dark mode** | Conforto visual |
| **RF-19** | **Histórico gráfico** de evolução do % avanço ao longo do tempo | Visibilidade de tendência |
| **RF-20** | **Cadastro de responsáveis** com foto e contato | Complementa "Minhas tarefas" |

### Won't Have (nesta fase)

| Item | Justificativa |
|------|---------------|
| Monetização / Stripe / billing | Produto interno (N1/N2) |
| Landing page / marketing | Produto interno (N1) |
| Integração ERP (Sienge) | Fora de escopo inicial (N3) |
| Matriz de dependências entre etapas | Planilha1 está vazia; complexidade desnecessária agora (N4) |
| Notificações e-mail / push | Pós-go-live (N5) |
| App mobile nativo | Web responsiva basta (N6) |
| Multi-tenant | Apenas 1 empresa (N7) |

---

## 7. Critérios de aceitação (Given / When / Then)

### RF-01 — Empreendimentos

- *Given* admin logado  
- *When* cria empreendimento com nome "Residencial Teste"  
- *Then* empreendimento aparece no dashboard com 0% de avanço e 22 etapas "Não iniciado"  
- *Error:* nome duplicado → mensagem de erro, não cria

### RF-02 / RF-03 — Etapas e fases macro

- *Given* admin na tela de parâmetros  
- *When* edita "Impacto" da etapa "LMC" de 5 para 4  
- *Then* peso bruto recalcula para `(2×4 + 3 + 3 + 5) / 5 = 3,8` e peso global de todas as etapas da fase "Incorporação" redistribui  
- *Error:* valor fora de 1–5 → validação impede salvamento

### RF-04 / RF-05 — Status e % de avanço

- *Given* empreendimento "REALIZE LARANJEIRAS" com 19 etapas Finalizadas e 3 Em andamento (LAE, Licença Ambiental, Alvará)  
- *When* consulto o dashboard  
- *Then* % exibido = **93,93%** (±0,01%) — validado contra planilha  
- *When* marco "LAE" como "Finalizado"  
- *Then* % sobe para `93,93% + 0,5 × 4,36% = 96,11%` (±0,01%)  
- *Audit:* registro criado com `{user, etapa, empreendimento, de: "Em andamento", para: "Finalizado", timestamp}`

### RF-06 — Tarefas

- *Given* editor logado no empreendimento "FIT Lago Azul"  
- *When* cria tarefa: etapa "LMC", ação "Protocolo Estudo hidrológico", responsável "Renan", prazo 08/04/2026  
- *Then* tarefa aparece na lista do empreendimento e na visão "Minhas tarefas" de Renan  
- *Error:* prazo em branco → permitido (campo opcional); exibe "(sem prazo)" na lista

### RF-07 — Painel por empreendimento

- *Given* qualquer usuário logado  
- *When* abre painel de "FIT LAGO AZUL"  
- *Then* vê: % avanço (28,04%), lista de 22 etapas com status/peso, seção de pendências (8 ações), destaque em atividades com prazo < 7 dias

### RF-08 — Minhas tarefas

- *Given* "Lyvia" logada  
- *When* acessa "Minhas tarefas"  
- *Then* vê lista filtrada contendo apenas tarefas onde responsável = "Lyvia", ordenadas por prazo ascendente  
- *Then* cada item mostra: empreendimento, etapa, ação, prazo, indicador de vencimento

### RF-10 — Auth e RBAC

- *Given* usuário com perfil `viewer`  
- *When* tenta alterar status de uma etapa  
- *Then* botão desabilitado; tentativa via API retorna 403  

### RF-11 — Auditoria

- *Given* admin na tela de auditoria  
- *When* filtra por empreendimento "Olá Mosaico" nas últimas 48h  
- *Then* lista mostra alterações com: timestamp, usuário, campo, valor anterior, valor novo

### RF-12 — Carga inicial

- *Given* admin executa seed/import  
- *When* script processa os 9 empreendimentos e 22 etapas da planilha  
- *Then* % de avanço de cada empreendimento no sistema bate com o calculado da planilha (tolerância ±0,01%)

---

## 8. Requisitos não funcionais

| Requisito | Métrica-alvo | Como medir |
|-----------|--------------|------------|
| **Performance** | Dashboard com 9 empreendimentos carrega em < 1s (LCP) | Lighthouse CI / Web Vitals |
| **Disponibilidade** | 99,5% uptime em horário comercial (8h–18h) | Health check + uptime monitor |
| **Segurança** | Auth obrigatória; RBAC; CSP; rate limit em API de escrita; sanitização com Zod | Testes de auth + pen test leve |
| **Acessibilidade** | WCAG 2.2 AA: contraste 4,5:1, teclado navegável, foco visível, aria-labels | Axe-core + teste manual |
| **Responsividade** | Funcional em 360px–1920px; touch targets 44px | Testes visuais em breakpoints |
| **Auditabilidade** | Toda mudança em status/tarefa/parâmetro registrada com user + timestamp | Query na tabela de audit |
| **Backup** | Backup diário do PostgreSQL com retenção de 30 dias | pg_dump cron |
| **Observabilidade** | Logs estruturados (JSON) para erros 4xx/5xx; alerta se > 10 erros/minuto | Logger + alerta básico |

---

## 9. Impacto técnico

### 9.1 Modelos / tabelas novas

| Modelo | Campos principais | Relação |
|--------|-------------------|---------|
| `MacroPhase` | id, name, sortOrder | 1:N → Stage |
| `Stage` | id, macroPhaseId, name, impactScore, dependencyScore, timeScore, effortScore, rawWeight (calculado), globalWeight (calculado) | N:1 MacroPhase |
| `Development` | id, name, isActive, createdAt | (empreendimento) |
| `DevelopmentStage` | id, developmentId, stageId, status (enum: NOT_STARTED / IN_PROGRESS / COMPLETED) | junction: Development × Stage |
| `Task` | id, developmentId, stageId, description, assigneeId, deadline, status, notes | N:1 Development, N:1 Stage, N:1 User |
| `StageSchedule` | id, developmentId, stageId, protocolDate, estimatedDeadline | N:1 Development × Stage |
| `AuditLog` | id, userId, entity, entityId, field, oldValue, newValue, timestamp | append-only |
| `User` (existente) | adicionar: `role` (ADMIN / EDITOR / VIEWER), `displayName` | já existe no schema |

### 9.2 Modelos a remover / ignorar

- `Subscription`, `Usage`, `Account` (Stripe/SaaS) — **não serão usados**; manter no schema sem migração destrutiva, ou remover na spec se não há dados.

### 9.3 Endpoints / Server Actions novos

| Recurso | Operações |
|---------|-----------|
| `/api/developments` | GET (lista), POST, PATCH, DELETE (soft) |
| `/api/developments/[id]/stages` | GET, PATCH (status) |
| `/api/developments/[id]/tasks` | GET, POST, PATCH, DELETE |
| `/api/stages` | GET (config), PATCH (parâmetros) |
| `/api/macro-phases` | GET |
| `/api/schedules` | GET, PATCH |
| `/api/audit-logs` | GET (filtro por entidade, user, data) |
| `/api/users` | GET (lista responsáveis), PATCH (role) |
| `/api/seed` | POST (admin-only; carga inicial) |

### 9.4 Páginas / rotas novas

| Rota | Tela |
|------|------|
| `/(app)/dashboard` | Dashboard geral (substituir placeholder atual) |
| `/(app)/developments/[id]` | Painel do empreendimento |
| `/(app)/tasks` | "Minhas tarefas" |
| `/(app)/tasks/all` | Todas as tarefas (admin/editor) |
| `/(app)/settings/stages` | Configuração de etapas e pesos (admin) |
| `/(app)/settings/users` | Gestão de usuários e perfis (admin) |
| `/(app)/audit` | Log de auditoria (admin) |

### 9.5 Dependências externas novas

Nenhuma obrigatória. Stack atual (Next.js 16, React 19, Prisma 7, Tailwind 4, Zod 4) é suficiente. Auth simplificada via sessões Prisma (já há modelo `Session`) ou Better Auth (env var `BETTER_AUTH_SECRET` já prevista em `env.ts`).

### 9.6 Riscos de compatibilidade

| Risco | Mitigação |
|-------|-----------|
| Schema Prisma atual tem modelos SaaS (Subscription, etc.) | Migrar de forma aditiva; não remover tabelas existentes na v1 |
| Middleware atual focado em CSP/Stripe | Adicionar proteção de rotas `/(app)` por auth |
| `layout.tsx` referencia "VibeCoding SaaS" em metadata | Atualizar nome e descrição |

---

## 10. Métricas de sucesso

| Tipo | Métrica | Baseline | Meta 30d | Meta 90d |
|------|---------|----------|----------|----------|
| **Leading** | % de tarefas criadas/atualizadas no sistema (vs planilha) | 0% | ≥ 80% | 100% |
| **Leading** | Logins diários do time | 0 | ≥ 4 dos 6 membros | 6/6 |
| **Lagging** | Planilha editada como fonte primária | 100% | ≤ 20% | 0% |
| **Lagging** | Tempo médio para obter "% avanço de todos os empreendimentos" | ~5min (abrir Excel, conferir) | < 5s (abrir dashboard) | < 5s |
| **Sinal de falha** | Time volta a editar planilha para operação corrente | — | Se > 50% das edições voltarem ao Excel na semana 3, investigar lacuna de paridade |

---

## 11. Riscos e mitigações

| # | Risco | Prob. | Impacto | Mitigação |
|---|-------|-------|---------|-----------|
| R1 | Time não adota — continua usando Excel | Média | Alto | Paridade validada com piloto; desativar edição do Excel gradualmente |
| R2 | Fórmula de peso diverge entre sistema e planilha | Baixa | Alto | Testes automatizados com valores da planilha como fixture |
| R3 | Dados sensíveis de terceiros sem proteção | Média | Médio | RBAC desde v1; logs de acesso; LGPD mínima |
| R4 | Escopo cresce além da paridade | Alta | Médio | Won't Have explícito; owner valida cada RF novo |
| R5 | Sponsor não definido → prioridade cai | Média | Alto | Definir owner nomeado antes de iniciar implementação |

---

## 12. Rollout

### Fase 1 — Go-live (paridade)

- Deploy com os 12 Must Have (RF-01 a RF-12).
- Carga dos dados da planilha.
- Piloto: **1 empreendimento** (sugestão: FIT LAGO AZUL — 28% avanço, 8 pendências ativas, bom para testar).
- Validação: `% avanço no sistema == % avanço na planilha` (±0,01%).
- Após validação, expandir para os 9 empreendimentos e desativar edição da planilha.

### Fase 2 — Consolidação

- Should Have (RF-13 a RF-16): cronograma, contadores, filtros combinados, edição inline.
- Feedback do time → backlog de ajustes.

### Fase 3 — Evolução (futura, fora deste PRD)

- Could Have (RF-17 a RF-20).
- Avaliar dependências entre etapas, notificações, integração ERP.

### Feature flags

Não para esta fase; complexidade desnecessária em produto interno com rollout controlado.

### Plano de feedback pós-lançamento

- Reunião semanal de 15 min na 1ª e 2ª semana pós-piloto.
- Canal dedicado (grupo de mensagens ou board interno) para reportar fricções.
- Threshold: se ≥ 3 reclamações do mesmo tipo na semana → priorizar fix.

---

## 13. Questões em aberto

| # | Questão | Impacto em | Quando resolver |
|---|---------|------------|-----------------|
| Q1 | Quem é o **owner de negócio** nomeado? | Priorização e validação de paridade | Antes da spec |
| Q2 | A aba **Planilha1** (dependências entre etapas) precisa estar na v1? | RF potencial / complexidade | Spec — atualmente Won't Have |
| Q3 | Manter modelos SaaS (Subscription, Usage) no schema ou remover? | Migration Prisma | Spec |
| Q4 | Auth via sessão Prisma simples ou Better Auth (já tem env var)? | Implementação de RF-10 | Spec |
| Q5 | Dados históricos: importar só o snapshot atual ou também retroativos? | Seed script | Spec |

---

## 14. Glossário

| Termo | Definição |
|-------|-----------|
| **Empreendimento** | Projeto imobiliário (ex.: REALIZE LARANJEIRAS, FIT PONTA NEGRA) |
| **Etapa** | Fase regulatória/operacional do processo de incorporação (ex.: Projeto Legal, LMC, Aprovação IMPLURB) |
| **Fase macro** | Agrupamento de etapas (Aquisição Terreno, Incorporação, Atividades p/ Lançamento, CEF) |
| **Peso bruto** | `(2×Impacto + Dependência + Tempo + Esforço) / 5` — mede importância relativa da etapa |
| **Peso global** | Peso relativo dentro da fase × peso da fase no total — usado no cálculo de % |
| **% de avanço** | `Σ(statusNumérico × pesoGlobal)` — indicador consolidado de progresso do empreendimento |
| **Tarefa / ação** | Item operacional concreto: "Protocolar estudo hidrológico", "Recolher assinatura Henrique" |
| **Responsável** | Pessoa atribuída a uma tarefa |
| **Pizza Contrato/CV** | Documento interno de apresentação do contrato para venda (jargão do setor) |
| **LMC** | Licença Municipal de Construção |
| **EIV** | Estudo de Impacto de Vizinhança |
| **LAE** | Licença Ambiental Estadual |
| **IMMU** | Instituto Municipal de Meio Urbano (órgão de Manaus) |
| **IMPLURB** | Instituto Municipal de Planejamento Urbano |
| **CEF** | Caixa Econômica Federal |

---

## 15. Impacto em segurança e UX

- **Segurança:** RBAC obrigatório (RF-10); auditoria (RF-11); auth em todas as rotas `/(app)`; sanitização Zod em inputs; CSP existente mantida. Dados de terceiros (nomes de advogados, cartórios) protegidos por perfil. Sem secrets adicionais além de `DATABASE_URL` e auth secret.
- **UX:** paridade visual com a experiência da planilha (tabelas, filtros, edição rápida); destaque de prazos vencidos; barra de progresso por empreendimento; layout mobile-friendly para uso em campo. Sem dependência apenas de cor para indicar status (ícones + texto).

---

## 16. Matriz de rastreabilidade (dor → RF → critério → métrica)

| Dor validada | RF | Critério de aceite | Métrica |
|--------------|----|--------------------|---------|
| "Onde cada empreendimento está no funil?" | RF-05, RF-09 | % avanço bate com planilha | Dashboard carrega em < 1s; % correto ±0,01% |
| "Quem faz o quê até quando?" | RF-06, RF-08 | Lista filtrada por responsável com prazo | ≥ 80% tarefas no sistema em 30d |
| "Fórmulas quebram, dados desalinham" | RF-02, RF-05 | Motor de pesos testado com fixtures | Zero divergência em seed de validação |
| "Edição concorrente insegura" | RF-10, RF-11 | RBAC + audit log | 100% das alterações rastreáveis |
| "Não sei o que mudou desde a última reunião" | RF-11 | Filtro de audit por data | Gestor consulta audit antes da reunião |

---

## Anexo — Paridade aba a aba

| Aba da planilha | Função | Cobertura no sistema |
|-----------------|--------|----------------------|
| **Lançamentos** | Matriz etapa × empreendimento + % avanço | RF-01, RF-04, RF-05, RF-09 (dashboard) |
| **Acompanhamento** | Lista de tarefas com responsável e prazo | RF-06, RF-08 |
| **Parâmetros** | Pesos, fases macro, mapeamento status → número | RF-02, RF-03 |
| **Painel** | Dashboard por empreendimento | RF-07, RF-14 |
| **Teste** | Visão filtrada por responsável (protótipo) | RF-08 |
| **Datas** | Protocolo, prazos, dias restantes | RF-13 (Should Have) |
| **Planilha1** | Matriz de dependências (vazia) | Won't Have (N4) |
| **Planilha1 (2)** | Lista de nomes curtos | Seed data no RF-12 |
