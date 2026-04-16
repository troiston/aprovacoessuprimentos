# 00_VALIDATION.md — Validação de Produto

> **Skills:** `/using-superpowers` `/validate` `/brainstorming`  
> **Contexto:** solução **pontual e interna** para o setor de incorporação da empresa, **substituindo de forma definitiva** a planilha `Pendências Incorporação 2.xlsx`. **Sem** página de venda, **sem** modelo de receita no momento e **sem** fase de MVP separada: a entrega alvo é o **produto final** operacional para o time.  
> **Responsável:** Tech Lead + dono do processo de incorporação  
> **Data:** 15/04/2026  
> **Autor:** Validação assistida (evidência: planilha inspecionada + pesquisa web pontual)

---

## 1. Resumo executivo

| Campo | Valor |
|---|---|
| **Veredito** | **GO** — construir o sistema interno conforme escopo de substituição da planilha |
| **Nota ponderada** | **8,5 / 10** (ver §11) |
| **Confiança** | **Alta** no problema e no encaixe; **média** na migração de dados e adoção no primeiro mês |
| **Razão em 3 linhas** | A planilha concentra risco operacional (colaboração, auditoria, consistência), já existe modelo de dados e fórmulas replicáveis; o custo de manter Excel supera o de um app interno na stack já adotada (Next.js + Postgres). Concorrentes “de prateleira” cobrem um universo maior (ERP/incorporação) e não substituem o **workflow exato** e os **pesos** já calibrados pelo time. |

**Próximo passo recomendado:** `/prd` → `docs/01_PRD.md` com escopo fechado de **paridade funcional** + melhorias mínimas acordadas (sem escopo de produto comercial).

**Nota sobre o framework VibeCoding:** a Fase **1b (Monetização)** permanece obrigatória no processo do repositório, mas para este produto deve ser preenchida como **“interno / sem receita”** (custo, owner, critério de sucesso), **não** como SaaS ou página de vendas — alinhado à decisão explícita do negócio.

---

## 2. Kill criteria definidos

| # | Kill criterion | Status | Evidência |
|---|----------------|--------|-----------|
| K1 | Não existe dor operacional real (time segue confortável só com Excel) | **Não ativado** | Planilha multi-aba, ~66 pendências, 9 empreendimentos, fórmulas de avanço; risco de colisão e falta de trilha de auditoria |
| K2 | ERP corporativo (ex.: Sienge) já cobre **100%** do fluxo com custo marginal aceito pelo time | **Não ativado** | Sienge/Prevision focam planejamento amplo e ecossistema; não há evidência de que o arquivo atual seja redundante — é a fonte de verdade hoje |
| K3 | Compliance (LGPD/acesso) inviabiliza hospedar dados do processo em app próprio | **Não ativado** | Dados já existem em planilha compartilhada; app com auth, RBAC e logs melhora o controle |
| K4 | Custo de construção/manutenção **>** custo anualizado de retrabalho + risco da planilha (TCO) | **Não ativado** | Time pequeno; stack já no repo; escopo fechado a paridade |
| K5 | Sponsorship: não há owner de negócio para priorizar migração | **Risco** — monitorar | Definir owner na abertura do PRD (kill se ficar indefinido após PRD) |

---

## 3. Pre-mortem (18 meses após “go-live”)

Imaginando que o sistema foi abandonado e a planilha voltou.

| Categoria | Causa provável de morte | Hipótese a refutar / mitigar |
|-----------|-------------------------|------------------------------|
| **“Mercado” interno** | O time não adotou; continuaram copiando Excel. | Migração assistida, paridade de telas, treino de 1 dia, desligar permissão de edição da planilha só após checklist |
| **Produto** | Faltou **paridade**: pesos, % avanço, painel por empreendimento, “minhas tarefas”, datas. | PRD com matriz de paridade linha a linha com as abas críticas (Lançamentos, Acompanhamento, Parâmetros, Datas, Painel) |
| **Técnico** | Conflitos de edição, perda de dados, deploy frágil. | Postgres + transações, auditoria, backups; testes nas regras de cálculo |
| **Negócio** | N/A receita — falha seria **custo** ou **reputação interna**. | Roadmap curto, evitar gold plating; medir tempo gasto em status meetings antes/depois |
| **Regulatório** | Vazamento de dados de terceiros ou obra. | LGPD mínimo: acesso por perfil, retenção, DPA se houver dados de parceiros |
| **Competição** | Compraram Sienge ou outra suíte e duplicaram cadastro. | Integração futura opcional; hoje o escopo é **substituir planilha**, não ERP |

---

## 4. Problema, “ICP” interno e JTBD

### 4.1 Problema

A planilha **Pendências Incorporação 2.xlsx** é a ferramenta atual para:

- **Matriz de status** por empreendimento e etapa de incorporação (**aba Lançamentos**), com **% de avanço** derivado de pesos e status (Finalizado / Em andamento / Não iniciado).
- **Backlog operacional** de ações com responsável e prazo (**aba Acompanhamento**).
- **Parâmetros** de negócio: peso bruto por etapa `(2×Impacto + Dependência + Tempo + Esforço) / 5`, pesos relativos por fase macro (Aquisição de terreno, Incorporação, Atividades para lançamento, CEF) e **peso global** por etapa.
- **Cronograma** (**aba Datas**) com protocolos e prazos.
- **Painel** por empreendimento e protótipo de visão por responsável (**aba Teste**).

Riscos da planilha: **concorrência de edição**, **histórico fraco**, **fórmulas quebradiças**, **dados pessoais e de terceiros** sem controle de acesso granular, **dependência de “Planilha1”** gigante (estrutura para dependências entre etapas ainda não populada).

### 4.2 “ICP” (quem usa)

Equipe interna de **incorporação / suprimentos / projetos** (nomes hoje na planilha: Lyvia, France, Renan, Jusci, Mixcon/Cix, Chirstiane, etc.) e liderança que consome **% avanço** e **pendências críticas**.

### 4.3 JTBD (Job to be done)

- **Quando** acompanham vários empreendimentos em etapas regulatórias parecidas, **querem** um único lugar com status, pendências, prazos e indicador de avanço **consistente** com a política de pesos da empresa.
- **Hoje** “contratam” a planilha; **demitiriam** se um app interno entregar **a mesma informação** com menos retrabalho e mais segurança.
- **Gatilho** da substituição: conclusão do app com **paridade** + migração + desativação gradual da edição da planilha.

---

## 5. Evidências de mercado (qualitativo + fontes)

### 5.1 Dor e workaround

- **Workaround atual:** Excel multiusuário + abas de parâmetros + painéis manuais — padrão comum em incorporação até certo porte.
- **Sinais na própria planilha:** mistura de tipos em colunas (ex.: prazo numérico vs texto “ok”), linhas com colunas deslocadas (ex.: FIT Lago Azul linha 13), tarefas transversais (“Analisar DEFs…”, “Criar controle…”) — típico de **ferramenta que cresceu organicamente** e precisa de modelo de dados explícito.

### 5.2 Fontes web (concorrência / ecossistema)

- **Sienge / Prevision Incorporação** — ecossistema consolidado no Brasil para construção e incorporação, com Gantt, Kanban, dashboards e integração obra/incorporação. Material público: [Sienge](https://www.sienge.com.br/), [Prevision Incorporação](https://sienge.com.br/prevision-incorporacoes). **Gap para nós:** não é substituto direto de uma planilha hiper-específica sem projeto de implantação; foco corporativo amplo.
- **OpenProject** (OSS, GPLv3, auto-hospedável) — gestão de projetos com Gantt e colaboração; referência: [OpenProject](https://www.openproject.org/). **Gap:** exigiria modelagem pesada e ainda assim não codifica os **pesos internos** nem o vocabulário exato das 22 etapas sem customização massiva.

Nenhuma busca rápida substitui a **regra de negócio calibrada** já embutida nos Parâmetros da planilha — reforça **build** orientado a paridade.

---

## 6. Mapa competitivo

| Opção | Tipo | Prós | Contras | Decisão |
|-------|------|------|---------|---------|
| **Manter Excel** | Status quo | Zero dev | Risco, escala ruim, auditoria fraca | **Substituir** |
| **Sienge / ERP / Prevision** | Compra | Maduro, suporte | Custo, implantação, excesso de escopo vs planilha atual | **Avaliar futuro**; fora do escopo **agora** |
| **OpenProject / LibrePlan / etc.** | OSS / commodity | Gantt genérico | Não replica pesos nem abas atuais sem projeto grande | **Não** para v1 de paridade |
| **App interno (este repo)** | Build | Paridade, LGPD, UX sob medida | Custo de engenharia | **GO** |

**Diferenciação:** não é “mais um PM”; é **replicar e endurecer** o modelo já aceito pelo time (incluindo fórmula de avanço validada).

---

## 7. OSS due diligence (resumo)

| Projeto | Licença / uso | Atividade percebida | Risco | Decisão |
|---------|----------------|----------------------|-------|---------|
| OpenProject | GPLv3 — auto-hospedagem viável | Comunidade ativa | Curva de customização; GPLv3 pode conflitar com política de IP interna | **Evitar** como base; inspirar apenas padrões de Gantt se necessário |
| Prisma / Next.js (já no repo) | MIT / Apache-2.0 | Alta | Baixo | **Usar** |
| Auth (a definir no PRD) | — | — | Médio se ad-hoc | **Comprar/adotar** padrão já previsto no scaffold (sessões) |

---

## 8. Build vs buy

| Domínio | Recomendação | Classe |
|---------|--------------|--------|
| **Motor de pesos, etapas, empreendimentos, tarefas, cronograma** | **Construir** — é o **core** do que a planilha faz | Core IP interno |
| **Auth, banco, deploy, observabilidade** | Usar stack existente + boas práticas | Commodity |
| **Notificações / e-mail** | Opcional fase 2; não bloqueia paridade inicial | Commodity |
| **ERP Sienge** | Não integrar na v1 salvo decisão explícita no PRD | Integração futura |

---

## 9. Segurança e compliance

| Ativo sensível | Ameaça | Requisito | Mitigação inicial |
|-----------------|--------|-----------|-------------------|
| Nomes de pessoas, parceiros (adv., cartório), datas de processo | Vazamento, edição não autorizada | LGPD mínimo + segregação | Auth obrigatória, papéis (leitura vs edição), logs de alteração em status e prazos |
| Dados de múltiplos empreendimentos | Usuário vê o que não deve | Autorização por perfil | RBAC no PRD; testes de autorização |
| Planilha legada | Cópia descontrolada após migração | Política interna | Marcar planilha como arquivada; export só por perfil admin |

---

## 10. Riscos de UX e adoção

| Risco | Severidade | Mitigação |
|-------|------------|-----------|
| Time acha “mais lento que Excel” | M | Atalhos, cópia em massa, filtros por responsável e empreendimento |
| Migração incompleta dos Parâmetros | A | Importação guiada + tela de auditoria numérica (% avanço batendo com planilha para 1 empreendimento piloto) |
| “Campos extras” da planilha (Coluna1, Status livre) | B | PRD define o que vira **campo estruturado** vs **nota** |

**Time-to-value:** primeiro valor quando **uma** visão (ex.: Acompanhamento + Lançamentos) estiver live com dados reais — meta de sucesso na implementação, não na validação.

---

## 11. Scorecard e veredito

**Ajuste de pesos (justificado):** em produto **interno sem receita**, o critério econômico do template original foi substituído por **“Viabilidade org / TCO interno”** (mesmo peso de 15%). Demais pesos iguais ao `/validate`.

| Critério | Peso | Nota | Evidência |
|----------|------|------|-----------|
| Intensidade e frequência da dor | 20% | **9** | Planilha crítica no dia a dia; muitas linhas de pendência; vários empreendimentos |
| Clareza de escopo e “ICP” interno | 20% | **10** | Usuários e artefato fonte existentes; escopo = substituir planilha |
| Viabilidade técnica + time-to-market | 20% | **8** | Repo já com Next.js, Prisma, Postgres, testes |
| Viabilidade org / TCO interno | 15% | **9** | Sem CAC; custo previsível de time interno; redução de risco operacional |
| Segurança e compliance | 15% | **7** | LGPD e RBAC são obrigatórios; dados sensíveis presentes |
| UX, adoção e time-to-value | 10% | **7** | Depende de migração e paridade; mitigável |

**Cálculo:** 0,20×9 + 0,20×10 + 0,20×8 + 0,15×9 + 0,15×7 + 0,10×7 = **8,5**

### Veredito formal

- **GO** (≥ 7,5 no scorecard ajustado; ≥ 7 no gate do `DOCS_INDEX` do projeto)
- **Confiança global:** **média-alta**
- **Top 3 incertezas:** (1) owner de negócio e critério de “paridade aceita”; (2) tratamento de tarefas “fora do modelo” na planilha; (3) necessidade futura de integração com ERP.
- **O que mudaria HOLD → GO:** sponsor explícito + piloto com 1 empreendimento com % batendo.
- **Invalidador imediato:** proibição formal de armazenar dados do processo fora do ERP corporativo (aparecer **depois** do PRD).

---

## 12. Incertezas críticas

1. **Paridade exata:** a aba **Planilha1** (milhares de linhas) está majoritariamente vazia de dependências — decidir no PRD se v1 exige matriz de dependências ou só a lista de etapas.
2. **Normalização de prazos:** mistura de serial Excel, texto (“ok”) e células trocadas — regra única no sistema.
3. **Multi-tenant:** apenas uma empresa (Olá) — simplifica; confirmar no PRD.

---

## 13. Backlog inicial por evidência (entrega final — sem MVP comercial)

> Não haverá página de vendas nem modelo de receita neste momento. O “backlog inicial” abaixo é **escopo de produto final mínimo** para **aposentar a planilha como fonte de verdade**, não um MVP de mercado.

| # | Item | Evidência | Prioridade |
|---|------|-----------|------------|
| 1 | Cadastro de **empreendimentos** e **etapas** + **status** com mesmos três valores | Aba Lançamentos | P0 |
| 2 | Motor **Parâmetros** (peso bruto, pesos por fase, peso global, % avanço) | Aba Parâmetros + validação matemática | P0 |
| 3 | CRUD de **tarefas** (Acompanhamento) com responsável e prazo | Aba Acompanhamento | P0 |
| 4 | **Datas** por empreendimento × etapa (protocolo, prazos) | Aba Datas | P1 |
| 5 | **Painel** consolidado por empreendimento + visão por responsável | Abas Painel e Teste | P1 |
| 6 | **Importação** ou carga inicial a partir do xlsx + conferência | Reduz risco de migração | P1 |
| 7 | **Auditoria** e perfis de acesso | §9 | P0 |
| 8 | Matriz de dependências (**Planilha1**) | Só se PRD confirmar necessidade na v1 | P2 |

---

## 14. Próximos passos

1. **`/prd`** — gerar `docs/01_PRD.md` com matriz de **paridade** (planilha → sistema), fora de escopo explícito, e owner de negócio.
2. **`02_MONETIZATION.md`** — preencher como **produto interno** (custo, manutenção, critério de sucesso), sem página de venda, para respeitar o gate do framework.
3. Rodar `bash scripts/verify-docs.sh` ao fechar fases subsequentes.
4. Atualizar `docs/DOCS_INDEX.md` (Fase 0 → Concluído).

---

## Anexo A — Snapshot do artefato legado (para rastreabilidade)

| Aba | Função resumida |
|-----|-----------------|
| Lançamentos | Matriz etapa × empreendimento + colunas de cálculo (fator de status × peso global) |
| Acompanhamento | Lista de pendências com responsável e prazo |
| Painel / Teste | Dashboards (por obra e por pessoa) |
| Datas | Linha do tempo / prazos |
| Parâmetros | Pesos, fases macro, mapeamento status → número |
| Planilha1 / (2) | Estrutura de dependências (curada / nomes curtos) |

**Arquivo analisado:** `/home/usuario/Downloads/Pendências Incorporação 2.xlsx` (inspeção estrutural em 15/04/2026).
