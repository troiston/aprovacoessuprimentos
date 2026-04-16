# DOCS_INDEX.md — Índice de Documentação Framework VibeCoding

> **Versão:** 3.0  
> **Atualizado em:** Abril de 2026  
> **Regra de ouro:** Antes de executar qualquer fase, leia este índice para saber o status atual,
> o documento fonte de verdade, os bloqueios para avançar e as skills a ativar no Cursor.

---

## Início Rápido

```
1. Identifique a fase atual na tabela de status abaixo
2. Abra o documento da fase
3. Ative as skills indicadas na coluna "Skills no Cursor"
4. Use o prompt pack correspondente em S02_PROMPT_PACKS.md
5. Ao concluir, atualize o status e os gates neste índice
```

**Primeiro comando de toda sessão — sem exceção:**
```
/using-superpowers
```

### Documentos na raiz do repositório

| Ficheiro | Momento |
|----------|---------|
| **`AGENT.md`** | Gerado no **bootstrap/setup** do projeto (**pré-Fase 0**). |
| **`ARCHITECTURE.md`** | **Gerado ou atualizado na Fase 2** (`/spec`), quando a estrutura técnica é definida com `docs/06_SPECIFICATION.md`; **refinado na Fase 3** à medida que a implementação evolui. |

### Biblioteca Web Excellence (complementar)

Guias de página, SEO, UX, performance e componentes — **não** substituem PRD, monetização ou `06_SPECIFICATION.md`.

- **Índice:** [`docs/web-excellence/DOCS_INDEX.md`](web-excellence/DOCS_INDEX.md) (caminho no repo: `docs/web-excellence/DOCS_INDEX.md`)
- **ADRs (template WEB):** `docs/web-excellence/decisions/` — decisões de produto continuam em `docs/decisions/` (MADR)
- **Templates duplicados (PAGE/COMPONENT/POST_MORTEM):** comparar com `docs/templates/` (VibeCoding) antes de sobrescrever; preferir o mais completo para o contexto

---

## Status do Projeto

| Fase | Nome | Documento | Status | Última atualização | Responsável | Skills no Cursor | Gate para avançar |
|---|---|---|---|---|---|---|---|
| 0 | Validação | `00_VALIDATION.md` | Concluído | 15/04/2026 | Tech Lead | `/validate` `/brainstorming` `/writing-plans` | Nota >= 7 e veredito GO |
| 1a | PRD | `01_PRD.md` | Concluído | 15/04/2026 | Tech Lead | `/prd` `/context-driven-development` `/writing-plans` | Requisitos e critérios aceitos |
| 1b | Monetização | `02_MONETIZATION.md` | N/A — produto interno | 15/04/2026 | Tech Lead | — | Decisão documentada em `01_PRD.md` §3 (Não Objetivos N1/N2) |
| 1c-sup | Pesquisa Técnica | `03_RESEARCH.md` | Concluído | 15/04/2026 | Tech Lead | `/api-design-principles` `/architecture-patterns` | SMTP baseline; Graph fora do MVP |
| 1c | Pesquisa Mercado | `04_MARKET_AND_REFERENCES.md` | Concluído | 15/04/2026 | Tech Lead | `/market` `/brainstorming` `/architecture-decision-records` | Pesquisa 4 frentes concluída; consolidação aprovada |
| 1d | Design System | `05_DESIGN.md` | **Concluído** | 15/04/2026 | Designer | `/design` `/frontend-design` `/design-system-patterns` `/tailwind-design-system` `/accessibility-compliance` | Preview aprovado pelo owner |
| 2 | Especificação Técnica | `06_SPECIFICATION.md` | Concluído | 15/04/2026 | Tech Lead | `/spec` `/openapi-spec-generation` `/postgresql-table-design` `/typescript-advanced-types` | Plano implementável sem ambiguidades |
| 3B | Implementação Backend | `07_IMPLEMENTATION.md` | Concluído | 15/04/2026 | Tech Lead | `/implement-backend` `/auth-implementation-patterns` `/test-driven-development` | APIs domínio + mail + audit |
| 3F | Implementação Frontend | `07_IMPLEMENTATION.md` | Concluído | 15/04/2026 | Designer | `/implement-frontend` `/react-state-management` `/accessibility-compliance` | Painéis, tarefas, settings mail |
| 4a | Segurança | `08_SECURITY.md` | Concluído | 15/04/2026 | Tech Lead | `/secrets-management` `/auth-implementation-patterns` | Veredito APROVADO — ver doc |
| 4b | Testes | `09_TESTS.md` | Concluído | 15/04/2026 | QA Jr. | `/test-writer` `/playwright-best-practices` | Suite verde; E2E smoke |
| 4c | Debug | `10_DEBUG.md` | Concluído | 15/04/2026 | QA Jr. | `/debugger` `/systematic-debugging` | Veredito PRONTO |
| 4d | Auditoria UX | `11_UX_AUDIT.md` | Concluído | 15/04/2026 | Designer | `/accessibility-compliance` `/responsive-design` | Veredito READY |
| 4e | Threat Model | `12_THREAT_MODEL.md` | Concluído | 15/04/2026 | Tech Lead | `/secrets-management` | Veredito READY |
| Final | Release Readiness | `13_RELEASE_READINESS.md` | Concluído | 15/04/2026 | Tech Lead + QA Jr. | `/release` `/pr` `/verification-before-completion` | **GO WITH RISK** — MVP interno |

**Legenda de status:** Pendente · Em andamento · Bloqueado · Concluído

---

## Propósito de Cada Documento

### Documentos de Fase (00-13)

| Documento | O que responde | Saída obrigatória |
|---|---|---|
| `00_VALIDATION.md` | Vale a pena construir? | Veredito GO/NO-GO com evidências |
| `01_PRD.md` | O que construir para quem e por quê? | Requisitos priorizados e critérios de aceitação |
| `02_MONETIZATION.md` | Como monetizar o produto? | Modelo escolhido, justificativa, provedor e tiers |
| `03_RESEARCH.md` | Quais integrações e limites técnicos? | Mapa de opções e trade-offs |
| `04_MARKET_AND_REFERENCES.md` | O que o mercado oferece e exige? | Ferramentas aprovadas, escopo confirmado/descartado |
| `05_DESIGN.md` | Como deve parecer e se comportar? | Tokens, componentes, padrões, acessibilidade e styleguide |
| `06_SPECIFICATION.md` | Como implementar com baixo risco? | Blueprint por arquivos, contratos e ordem |
| `07_IMPLEMENTATION.md` | O que foi implementado e como operar? | Decisões, comandos, env e checklist técnico |
| `08_SECURITY.md` | Está seguro para produção? | Auditoria OWASP + plano de correção |
| `09_TESTS.md` | Está confiável para evoluir? | Suite, cobertura, rastreabilidade |
| `10_DEBUG.md` | Quais riscos de comportamento restam? | Diagnóstico, reproduções e status de bugs |
| `11_UX_AUDIT.md` | A experiência está clara, acessível e sem fricção? | Achados UX/a11y priorizados + plano de melhoria |
| `12_THREAT_MODEL.md` | Quais ameaças aceitamos e mitigamos? | Modelo de ameaça, controles e risco residual |
| `13_RELEASE_READINESS.md` | Podemos liberar com segurança e qualidade? | Decisão GO/NO-GO com checklist unificado |

### Documentos de Suporte (S01-S05)

| Documento | Propósito |
|---|---|
| `S01_QUICK_START.md` | Guia de 1 página para uso diário + mid-flight onboarding |
| `S02_PROMPT_PACKS.md` | Prompts prontos por fase (curto/médio/completo) |
| `S03_SKILLS_INDEX.md` | Mapa de 87+ skills por fase, responsável e comando de ativação |
| `S04_IMAGE_GENERATION.md` | Guia de geração de assets com Cursor |
| `S05_DESIGN_REFERENCES.md` | Referências de design, a11y e anti-padrões |
| `ROADMAP_FINALIZACAO_PRODUTO.md` | Roadmap operacional até release: waves, RF, riscos, gates e paralelização |
| `ORCHESTRATOR_METRICS.md` | Métricas operacionais e de token do modo orquestrado |
| `folder-structure.md` | Mapa rápido `src/`, `prisma/`, `.cursor/` (referência architect → designer) |

### Documentos de Operações (OPS01-OPS03)

| Documento | Propósito |
|---|---|
| `OPS01_DEPLOYMENT.md` | Runbook de deploy Docker Swarm/Traefik |
| `OPS02_RUNBOOK.md` | Resposta a incidentes (5 fases, SEV-1/2/3) |
| `OPS03_POST_MORTEM.md` | Post-mortem blameless (Google SRE) |

### Documentos Internos (INT01-INT03)

| Documento | Propósito |
|---|---|
| `INT01_PLANO_ARQUITETURA.md` | Status do plano de arquitetura — implementado vs pendente |
| `INT02_PLANO_CONCLUSAO.md` | Status consolidado dos planos |
| `INT03_AI_DOCS_INDEXING.md` | trail-docs (opcional, 15+ docs) |

---

## Skills — Referência Rápida por Fase

> Consulta rápida para uso diário. Detalhes completos em `S03_SKILLS_INDEX.md`.

**Ativar sempre primeiro:**
```
/using-superpowers
```

**Execução orquestrada (opcional):**
```
/orchestrate
```

**Não sabe qual skill usar?**
```
/find-skills
```

**Planejamento antes de qualquer fase complexa:**
```
/writing-plans → /executing-plans
```

**Fase 0 — Validação:**
```
/validate  /brainstorming  /writing-plans
```

**Fase 1a — PRD:**
```
/prd  /context-driven-development  /executing-plans
```

**Fase 1b — Monetização:**
```
/brainstorming  /writing-plans  /monetization-check
```

**Fase 1c — Mercado:**
```
/market  /brainstorming  /architecture-decision-records
```

**Fase 1D — Design:**
```
/design  /frontend-design  /design-system-patterns  /tailwind-design-system  /accessibility-compliance
```

**Fase 2 — Spec:**
```
/spec  /openapi-spec-generation  /postgresql-table-design  /architecture-decision-records
```

**Fase 3B — Backend:**
```
/implement-backend  /auth-implementation-patterns  /test-driven-development  /secrets-management
```

**Fase 3F — Frontend:**
```
/implement-frontend  /react-state-management  /tailwind-design-system  /accessibility-compliance
```

**Fase 4 — Qualidade:**
```
/test-writer  /playwright-best-practices  /debugger  /systematic-debugging  /secrets-management
```

**Release / PR:**
```
/verification-before-completion  /finishing-a-development-branch  /changelog-automation  /release  /pr
```

**Incidente em produção:**
```
/incident-runbook-templates  /systematic-debugging  /postmortem-writing
```

---

## Precedência em Caso de Conflito

1. `01_PRD.md` — requisito de negócio
2. `06_SPECIFICATION.md` — contrato técnico
3. `05_DESIGN.md` — contrato de UI/UX
4. `07_IMPLEMENTATION.md` — estado atual e decisões executadas
5. `00_VALIDATION.md` — direcionamento estratégico e escopo

---

## Ordem de Leitura Recomendada

1. `DOCS_INDEX.md` ← você está aqui
2. `S03_SKILLS_INDEX.md` — identificar e ativar skills da fase atual
3. `S02_PROMPT_PACKS.md` — copiar prompt com skills já ativas
4. `00_VALIDATION.md`
5. `01_PRD.md`
6. `02_MONETIZATION.md`
7. `03_RESEARCH.md`
8. `04_MARKET_AND_REFERENCES.md`
9. `05_DESIGN.md`
10. `06_SPECIFICATION.md`
11. `07_IMPLEMENTATION.md`
12. `08_SECURITY.md`, `09_TESTS.md`, `10_DEBUG.md`

---

## Convenções de Nomenclatura

| Prefixo | Área | Contagem |
|---|---|---|
| `00-13` | Documentos de fase (ordem = execução) | 14 docs |
| `S01-S05` | Suporte (consultados transversalmente) | 5 docs |
| `OPS01-OPS03` | Operações (pós-deploy) | 3 docs |
| `INT01-INT03` | Internos (planejamento do framework) | 3 docs |

Templates em `docs/templates/` espelham os nomes dos docs de fase.

---

## Regras de Atualização

- Ao finalizar uma fase, atualizar **imediatamente** a linha correspondente em "Status do projeto" (status + data)
- Se uma fase ficar bloqueada, registrar motivo e ação de desbloqueio no documento da fase
- Toda atualização de fase deve mencionar impactos de segurança e UX, mesmo quando "sem impacto"
- Ao instalar novas skills, atualizar `S03_SKILLS_INDEX.md` e a coluna "Skills no Cursor" acima
- Ao rodar o modo orquestrado, atualizar `docs/ORCHESTRATOR_METRICS.md` ao final da sessão
- PRs só podem ser abertos com `13_RELEASE_READINESS.md` preenchido e decisão GO ou GO WITH RISK
- Gate de monetização (Fase 1b) é obrigatório — não avançar sem `02_MONETIZATION.md` preenchido

---

## Regras que Não Podem Quebrar

1. Não iniciar `/spec` ou implementação sem aprovação do preview de design
2. Não implementar sem `06_SPECIFICATION.md` concluído
3. Não avançar de Fase 1a para 1c/1D sem `02_MONETIZATION.md` aprovado
4. Sem typecheck/lint/test verde, não fecha fase
5. Sem checklist de segurança e UX, não fecha fase
6. Nenhum PR sem `13_RELEASE_READINESS.md` preenchido
7. Risco residual sempre com owner e prazo de revisão
8. Nunca commitar secrets — `/secrets-management` ativo em toda fase 3

---

## Documentos de Suporte da Equipe

> Documentação operacional do time — consultar ao onboarding e ao início de cada projeto.

| Documento | Propósito |
|---|---|
| `processo_desenvolvimento_equipe.md` | Papéis, responsabilidades e fluxo completo de atendimento ao cliente (Estágios 0–8) |
| `setup_github_equipe.md` | Setup completo da organização GitHub, branches, proteções, CODEOWNERS e workflow Git |
| `S03_SKILLS_INDEX.md` | Mapa de todas as skills instaladas por fase, responsável e comando de ativação |

---

*Documento interno — revisar ao início de cada novo projeto.*
