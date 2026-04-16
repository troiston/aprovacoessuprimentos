# 04_MARKET_AND_REFERENCES.md — Pesquisa de Mercado e Referências

> **Skills:** `/using-superpowers` `/market` `/brainstorming` `/architecture-decision-records`  
> **Prompt pack:** `S02_PROMPT_PACKS.md` → Fase 1c  
> **Responsável:** Tech Lead  
> **Depende de:** `docs/00_VALIDATION.md` (GO) + `docs/01_PRD.md` (Concluído)  
> **Gate de saída:** 4 frentes concluídas + consolidação aprovada como base para Fase 1D e Fase 2  
> **Modo:** `REFINE` — documento anterior era template genérico; substituído por pesquisa orientada ao PRD atual (produto interno de incorporação).

Status: CONCLUÍDO  
Data: 15/04/2026  
Autor: Pesquisa assistida (web + PRD + validação)

---

## 1. Resumo executivo

A pesquisa confirma que **não existe commodity pronta** que replique o modelo de **22 etapas + pesos calibrados + % de avanço** da planilha da Olá sem projeto grande de customização. **Sienge / Prevision** cobre incorporação de forma ampla mas implica **vendas, implantação e escopo ERP** — fora do objetivo imediato (`01_PRD.md` §3). **OpenProject** e similares são **GPLv3** ou genéricos PM: úteis como referência de UX (Gantt, Kanban), **não** como fork base para produto proprietário sem assessoria jurídica. A **voz do mercado** reforça dores de **Excel compartilhado** (versões, falta de auditoria, escala). **Decisão:** manter **build** na stack **Next.js + Prisma + Postgres** já no repo; **comprar** apenas serviços commodity (hospedagem, e-mail transacional futuro, monitorização). Próxima fase: **`/design`** focado em **tabelas densas, filtros, barra de progresso e “minhas tarefas”** — onde o produto interno ganha do mercado é **velocidade + paridade + controlo**, não em “mais features” que um ERP.

---

## 2. Contexto do PRD

| Dimensão | Conteúdo (fonte: `01_PRD.md`) |
|-----------|-------------------------------|
| **Proposta de valor** | Substituir definitivamente a planilha de pendências de incorporação por sistema web com **paridade de cálculo**, **RBAC**, **auditoria** e visões dashboard / minhas tarefas |
| **ICP** | Equipa interna Olá (incorporação / projetos / operacional) — ~6 pessoas nomeadas na planilha |
| **JTBD** | Um só lugar para status por obra, pendências com responsável e prazo, % de avanço fiável |
| **Features centrais (Must)** | RF-01 a RF-12: empreendimentos, etapas, fases macro, status, % avanço, tarefas, painel, minhas tarefas, dashboard, auth/RBAC, auditoria, seed |
| **Restrições** | Sem landing de vendas, sem Stripe/monetização, sem integração ERP na v1, single-tenant Olá |
| **Hipótese de diferenciação** | **Paridade exacta** com fórmula já aceite + **governança** (quem mudou o quê) — mercado oferece “genérico” ou “ERP pesado”, não o meio-termo calibrado |

### Perguntas que esta pesquisa responde

| Pergunta | Resposta resumida |
|----------|-------------------|
| O mercado já resolve isto bem? | **Parcialmente** — ERPs resolvem “incorporação grande”; PM genérico resolve “tarefas”; ninguém traz os **pesos Olá** de fábrica |
| O que os utilizadores odeiam nas alternativas? | Excel: versões, falta de auditoria, cópias divergentes; suites: custo e complexidade |
| O que comprar / reutilizar? | Runtime, auth patterns, DB, UI primitives — não o domínio incorporação |
| Risco legal em OSS? | **GPLv3** (ex.: OpenProject) = copyleft; evitar embed/fork proprietário sem legal |
| O escopo do PRD está calibrado? | **Sim** — Won’t Have (ERP, dependências vazias, notificações) alinhado com evidência |
| Onde o design deve diferenciar? | **Densidade informacional** + leitura rápida de prazos + acessibilidade em tabelas |

---

## 3. OSS e ferramentas (Frente 1)

Pesquisa web: OpenProject (licença, self-host), ecossistema Next/Prisma (já no repo).

| Opção | Categoria | Licença | Maturidade / atividade | Lock-in | Custo | Decisão |
|-------|-----------|---------|-------------------------|---------|-------|---------|
| **Next.js 16 + React 19** | Framework UI | MIT | Alta — releases frequentes | Baixo (framework mainstream) | $0 | **APROVAR** — já no repo |
| **Prisma 7 + PostgreSQL** | ORM + DB | Apache 2.0 / OSS PG | Alta | Baixo (SQL standard) | Infra interna | **APROVAR** — já no repo |
| **Zod 4** | Validação runtime | MIT | Alta | Baixo | $0 | **APROVAR** — já no repo |
| **Tailwind CSS 4** | UI | MIT | Alta | Baixo | $0 | **APROVAR** — já no repo |
| **OpenProject** | PM + Gantt + BIM/BCF | **GPLv3** ([LICENSE no GitHub](https://github.com/opf/openproject/blob/dev/LICENSE)) | Alta — comunidade + Enterprise opcional ([Community Edition](https://www.openproject.org/community-edition/)) | Médio (dados no produto Sienge-like workflow) | Community $0; Enterprise pago | **EVITAR** como base de código proprietário; **CONDICIONAL** como referência UX / inspiração de módulos |
| **Vitest + Playwright** | Testes | MIT | Alta | Baixo | $0 | **APROVAR** — já no repo |
| **Better Auth** (opcional) | Auth | MIT (típico) | A validar na spec | Baixo se self-hosted | $0 | **CONDICIONAL** — `env.ts` já prevê secret |

**Regra de licença aplicada:** GPL/AGPL não deve ser incorporado em produto **fechado interno** sem parecer jurídico sobre distribuição e “linking”. Para este projeto, **não** há necessidade de fork de OpenProject.

---

## 4. Concorrência e alternativas (Frente 2)

| Alternativa | Tipo | Proposta de valor | Preço / modelo | Forças | Gaps vs PRD Olá |
|--------------|------|-------------------|----------------|--------|------------------|
| **Sienge + Prevision Incorporação** | Direto (Brasil construção/incorporação) | Planejamento de incorporação, Gantt, Kanban, dashboards, ligação obra/incorporação ([Sienge Prevision](https://sienge.com.br/prevision-incorporacoes)) | **Sob consulta** — preço público não divulgado; loja referencia produto pago ([store Sienge](https://store.sienge.com.br/products/prevision-planejamento-de-incorporacao)); demo gratuita | Ecossistema maduro, suporte local, conformidade mercado BR | **Escopo e custo ERP**; não replica automaticamente os **22 pesos** da planilha; implantação longa; integração não é RF v1 |
| **Monday.com** | Indireto (work management) | Quadros, timeline, automações ([pricing monday.com](https://monday.com/project-management/pricing)) | ~$9–19/utilizador/mês (planos 2025–2026, fontes agregadoras) + mínimo de lugares | UX polida, automações | **Sem domínio incorporação**; fórmulas de % por etapa seriam workarrows frágeis; custo recorrente por cabeça |
| **Notion** | Indireto (bases + wiki) | Bases relacionadas, vistas | Freemium / Business | Flexível, rápido a prototipar | Limites de linhas/colunas ([Notion help](https://www.notion.com/help/synced-databases)); **fórmulas e permissões** fracas para o modelo de pesos; performance com dados densos ([limites discutidos](https://ones.com/blog/maximizing-efficiency-notion-database-limits-and-workarounds/)) |
| **OpenProject** | Indireto OSS | Gantt, work packages, API, BCF construção | Community GPLv3 | Self-host, dados na casa | **GPLv3**; customizar para 22 etapas Olá = projeto paralelo ao PRD |
| **Excel / SharePoint** | Substituto atual | Zero custo marginal, familiaridade | Licença M365 | Flexível | **Problema que o PRD resolve** — colaboração, auditoria, consistência |

---

## 5. Matriz de capacidades

Comparar **Must Have** do PRD com alternativas (S = suporta nativamente, P = possível com configuração pesada, N = não é foco / inviável curto prazo).

| Capacidade (PRD) | App interno (build) | Prevision / Sienge | Monday / Asana | Notion | Excel |
|------------------|----------------------|---------------------|------------------|--------|-------|
| Matriz obra × etapa + 3 estados | **S** | P / S (config) | P | P | S |
| Fórmula peso `(2I+D+T+E)/5` + fases macro | **S** | N (regra Sienge ≠ Olá) | P (fórmulas) | P | S |
| % avanço = Σ(status×peso global) | **S** | P (indicadores genéricos) | P | P | S |
| Lista tarefas + responsável + prazo | **S** | S | S | S | S |
| “Minhas tarefas” filtrado | **S** | S | S | P | P |
| RBAC + auditoria campo a campo | **S** | S (enterprise) | S (planos altos) | P | N/P |
| Sem custo ERP / sem lock-in Sienge | **S** | N | P | P | S |
| Go-live \< 3 meses equipa pequena | **S** (escopo fechado) | N | P | P | S |

**Conclusão:** só **build** alinha **S** em todas as linhas críticas sem comprometer N1–N3 do PRD.

---

## 6. Voz do mercado (Frente 3)

Fontes consultadas (web, abril 2026):

| Fonte | Tema | Insigência para o produto |
|-------|------|---------------------------|
| [Reddit r/ConstructionManagers — POs em Excel](https://www.reddit.com/r/ConstructionManagers/comments/1r6dbip/does_anyone_else_manage_all_their_pos_in_an_excel/) | Mesmo grandes empresas usam Excel; PM software ajuda em **multi-job** e automação | Validar **dashboard multi-empreendimento** e ordenação por prazo |
| [Built — Why Excel Fails Real Estate Developers (construction draw)](https://getbuilt.com/blog/construction-draw-process/) | Excel não escala em **ciclos longos**, reconciliação manual, risco de compliance | Reforçar **auditoria** e **estados explícitos** (RF-11) |
| [Construction AI — Spreadsheets to PM software](https://www.constructionai.io/blog/moving-from-spreadsheets-to-project-management) | Versões “v3 FINAL (2).xlsx”, rastreio de mudanças | **Single source of truth** + desativar edição planilha pós-piloto |
| [OnSite Teams — Excel + WhatsApp not enough](https://onsiteteams.com/why-excel-whatsapp-are-not-enough-for-construction-project-tracking/) | Falta de workflow e permissões | **RBAC** (RF-10) como mensagem interna de adoção |
| G2 / Sienge | Pesquisa não retornou página de reviews Sienge específica nos snippets | Para aprofundamento futuro: pesquisa manual em [g2.com](https://www.g2.com/) se necessário comparar com ERP já licenciado na empresa |

**Reclamações recorrentes (síntese):** versões divergentes; quem alterou o quê desconhecido; relatórios manuais; erros em cópias; escalabilidade fraca com muitas linhas/fórmulas.

**Workaround actual:** continuar no Excel + reuniões — é exactamente o que o PRD substitui.

**Saturação:** mercado **cheio** de “PM genérico”; **nicho** “planilha incorporação Olá” está **vazio** — oportunidade de **domínio específico**.

---

## 7. Build vs buy (Frente 4)

| Componente do PRD | Decisão | Opção recomendada | Lock-in | Impacto no prazo |
|-------------------|---------|-------------------|---------|------------------|
| Motor de pesos + % avanço + 22 etapas | **CORE IP** | Construir em TypeScript + Postgres | Nulo | Define o valor |
| CRUD empreendimentos / tarefas / schedules | **CORE IP** | Construir (regras + UX Olá) | Baixo | Médio |
| Auth (sessões / Better Auth) | **COMMODITY** | Reutilizar padrão repo + libs MIT | Baixo | Baixo |
| Base de dados | **COMMODITY** | PostgreSQL self-hosted ou cloud BR/EU | Médio (provedor) | Baixo |
| UI kit (tabelas, botões, formulários) | **COMMODITY** | Tailwind + componentes próprios simples; evitar shadcn pesado se não existir | Baixo | Baixo |
| Notificações e-mail | **COMMODITY** (futuro) | Resend / SendGrid / SMTP corporativo | Médio | Fora v1 |
| ERP Sienge | **HYBRID futuro** | Não v1; API Sienge só se negócio exigir | Alto | Adiar |
| OpenProject como base | **EVITAR** | GPLv3 + escopo errado | N/A | N/A |

**Regra prática aplicada:** build onde a **capacidade é o processo Olá**; buy onde é **infraestrutura padrão**.

---

## 8. Decisões consolidadas

| Decisão | Detalhe |
|---------|---------|
| **Stack aprovada** | Next.js 16, React 19, Prisma 7, PostgreSQL, Tailwind 4, Zod 4, Vitest, Playwright — conforme repo |
| **Stack / produtos vetados para o core** | Fork ou embed de **OpenProject** (GPLv3) como base proprietária; substituição total por **Prevision** sem decisão de negócio |
| **Escopo confirmado** | Alinhado com `01_PRD.md` Must/Should; Won’t Have mantido |
| **Escopo descartado** | ERP, monetização, landing, matriz dependências vazia, multi-tenant |
| **Diferenciação UX/produto** | Densidade + leitura de prazos + acessibilidade WCAG 2.2 AA em tabelas; modo “minhas tarefas” como entrada por defeito para operacionais |
| **Riscos licença/compliance** | Não misturar GPL com código fechado distribuído; LGPD em dados de terceiros (já em `00_VALIDATION.md` §9) |

**ADRs:** nenhum ADR novo obrigatório só com este documento; decisões de schema/auth ficam para **`/spec`** e `docs/decisions/` se divergirem do PRD.

---

## 9. Próximos passos — diretrizes para `/design`

1. **Personas internas:** wireframes para **Coordenador** (matriz + edição inline), **Gestor** (dashboard 9 obras), **Operacional** (minhas tarefas mobile-first).
2. **Componentes prioritários:** tabela densa com sticky header, badges de estado (não só cor), barra de progresso com valor % e legenda.
3. **Referências visuais:** inspirar em claridade de **Prevision/Gantt** (marcos) sem copiar identidade Sienge; usar tokens já previstos em `docs/S05_DESIGN_REFERENCES.md` + OKLCH nas regras do projeto.
4. **Evitar:** feature creep de “automações estilo Monday” na v1.
5. **Gate 1c → 1d:** este ficheiro considera-se **aprovado** para iniciar **`/design`** e `docs/05_DESIGN.md`.

---

## Impacto em segurança e UX

- **Segurança:** decisão de **não** integrar OSS copyleft no core reduz risco jurídico; auth commodity com secrets em env (ver `/secrets-management` na Fase 3).
- **UX:** investir em **tabela + filtros** como hero; estados vazio/erro/carregamento em cada vista (`project.mdc`); touch targets ≥ 44px para uso em obra.

---

## Histórico de atualizações

| Data | Alteração | Autor |
|------|-----------|-------|
| 15/04/2026 | Fase 1c completa — 4 frentes + consolidação para produto interno incorporação | Tech Lead |
