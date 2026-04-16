# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added

- `src/app/sitemap.ts`, `src/app/robots.ts`, `src/middleware.ts` (CSP com nonce em produção), headers de segurança em `next.config.ts`, `docs/folder-structure.md`
- Fusão do kit **Web Excellence** no repositório VibeCoding: `.cursor/rules` (stack, quality, design, core 00–02), `.cursor/skills-web-excellence/` (71 skills), commands em subpastas (`project/`, `build/`, `generate/`, `audit/`), agents 01–07, `docs/web-excellence/`
- `.cursorrules` na raiz com hierarquia unificada
- `scripts/verify-docs-integrity.sh` (frontmatter + links só em `docs/web-excellence` e `skills-web-excellence`)
- `scripts/verify-framework.sh` e `generate-framework-manifest.mjs` apontando para `skills-web-excellence` e `docs/web-excellence/framework-manifest.json`
- `playwright.config.ts`, `e2e/smoke.spec.ts`, dependência `tsx`, scripts `verify`, `verify:docs-product`, `verify:docs-integrity`, `verify:framework`, `manifest`, `sitemap`, `check:metadata`, `lhci`
- `lighthouserc.json`, `scripts/audit-lighthouse.sh` (URLs alinhadas a rotas do app)
- CI: `manifest`, `verify-framework`, `verify-docs-integrity` no job quality
- Secção **brownfield** em `.cursor/commands/project/init-project.md`

### Changed

- Metadata raiz em `src/app/layout.tsx` (`metadataBase`, `title.template`, OG/Twitter, `lang="pt"`)
- `SKILLS_INDEX` Web Excellence: total 71 skills; AI Assets 8; `RULES_INDEX` Next 16+; `domain/marketing.mdc` globs `src/app/(marketing)/**`
- `framework/nextjs.mdc` → ponteiro; conteúdo canónico em `stack/nextjs.mdc` com `src/app/**` e convenções deste repo
- `AGENT.md`, `WORKFLOW.md`, `docs/DOCS_INDEX.md`, `docs/S03_SKILLS_INDEX.md`, `README.md` — documentação da fusão
- Skill `.cursor/skills/design/SKILL.md` — caminhos `05_DESIGN`, `04_MARKET`, `src/app/styleguide`
- `stack/framer-motion.mdc` — nota de dependência opcional

## [Unreleased] — Sessão de Revisão Abril 2026

### Added

- `docs/22_SKILLS_INDEX.md` — índice completo de 87 skills por fase, responsável e sequência de ativação
- Seção "Skills de Infraestrutura e Meta-Skills" em `22_SKILLS_INDEX.md` (setup, agent-tools, bash-defensive-patterns, shellcheck-configuration, create-auth-skill, helm-chart-scaffolding, k8s-manifest-generator)
- Seção "Mid-Flight Onboarding" em `docs/13_QUICK_START.md` — fluxo para entrar no projeto em andamento
- Seção "Quick Start por Papel" em `docs/13_QUICK_START.md` — Tech Lead, Designer, QA Jr.
- Tabela de skills obrigatórias por fase em `docs/13_QUICK_START.md`
- Tabela de consulta rápida por necessidade em `docs/DESIGN_REFERENCES.md`
- Referências cruzadas entre `DESIGN_REFERENCES.md` e `docs/04_DESIGN.md` por seção
- Seção LGPD em `docs/10_THREAT_MODEL.md` (classificação de dados pessoais e sensíveis)
- STRIDE como metodologia explícita em `docs/10_THREAT_MODEL.md`
- Seções UX Mobile e Performance Percebida em `docs/09_UX_AUDIT.md`
- Coluna Status na tabela de heurísticas de Nielsen em `docs/09_UX_AUDIT.md`
- Seção de Plano de Comunicação em `docs/11_RELEASE_READINESS.md`
- Critério de rollback automático com owner em `docs/11_RELEASE_READINESS.md`
- Pacotes de prompt hotfix e ADR em `docs/12_PROMPT_PACKS.md`
- Pacote "API-first / Developer Tool" em `docs/12_PROMPT_PACKS.md`
- LGPD como prioridade em todos os pacotes de tipo de produto (`12_PROMPT_PACKS.md`)
- Template 5 Whys estruturado em `docs/18_POST_MORTEM.md`
- Tabela de impacto em SLOs em `docs/18_POST_MORTEM.md`
- Tabela de action items com categoria em `docs/18_POST_MORTEM.md`
- Classificação SEV-1/2/3 em `docs/16_RUNBOOK.md`
- Comandos Docker Swarm/Traefik em `docs/16_RUNBOOK.md`
- Templates de mensagem de incidente (início e resolução) em `docs/16_RUNBOOK.md`
- Comandos reais de deploy Docker Swarm em `docs/20_DEPLOYMENT.md`
- Histórico de deploys em `docs/20_DEPLOYMENT.md`
- Tabela de decisão "quando usar/não usar" em `docs/19_AI_DOCS_INDEXING.md`
- Integração trail-docs com workflow VibeCoding em `docs/19_AI_DOCS_INDEXING.md`
- Checklist pré-geração e convenção de nomenclatura em `docs/14_IMAGE_GENERATION.md`

### Changed

- `AGENT.md` — adicionado `/using-superpowers` como passo 0; referência a `22_SKILLS_INDEX.md`; regra de `verify-docs.sh` antes de fechar fase; regra de PR sem `11_RELEASE_READINESS.md`; ADR para refatorações de contrato; `/secrets-management` antes de commit
- `WORKFLOW.md` — adicionado `/using-superpowers` em cada fase; referência a `22_SKILLS_INDEX.md`; skills por fase; `verify-docs.sh` com validação de veredito
- `CONTRIBUTING.md` — adicionado `22_SKILLS_INDEX.md` nos recursos; skill activation no setup; referência ao verify-docs.sh expandido
- `README.md` — adicionado `22_SKILLS_INDEX.md`; docs 00–22; estrutura expandida
- `scripts/verify-docs.sh` — expandido de verificação de existência para 6 seções: existência (27 docs), veredito nos docs de qualidade (regex), placeholders em docs críticos, gates técnicos (typecheck/lint/npm audit), consistência do DOCS_INDEX, presença das 87 skills instaladas
- `docs/DOCS_INDEX.md` — v2 com coluna de skills e responsáveis; 4 status; seção de suporte à equipe; `22_SKILLS_INDEX.md` adicionado
- `docs/01_MARKET_AND_REFERENCES.md` — CVEs, ADR ref, LGPD, impacto seg/UX
- `docs/06_SECURITY.md` — OWASP Top 10 + checklist Docker Swarm/Traefik
- `docs/07_TESTS.md` — comandos, CI/CD, rastreabilidade expandida
- `docs/08_DEBUG.md` — processo sistemático, checklist pós-deploy
- `docs/12_PROMPT_PACKS.md` — `/using-superpowers` obrigatório em todos os prompts
- `docs/17_PLANO_ARQUITETURA_REVISADO.md` — atualizado com itens da sessão de Abril 2026
- `docs/21_PLANO_CONCLUSAO_FINAL.md` — atualizado com todos os 20 itens da sessão

## [Unreleased] — Plano Evolução Final (2026-03-12)

### Added

- `docs/18_POST_MORTEM.md` — template blameless (Google SRE)
- `docs/templates/` — seeds para recuperação (00, 02, 03, 04, 05)
- `.cursor/commands/hotfix.md` — comando hotfix (git-flow)
- `CONTRIBUTING.md` — onboarding de contribuidores
- `docs/20_DEPLOYMENT.md` — runbook de deploy
- `README.md` — raiz do projeto
- `docs/19_AI_DOCS_INDEXING.md` — trail-docs (opcional)
- `scripts/verify-docs.sh` — verificação de existência dos docs base
- `docs/17_PLANO_ARQUITETURA_REVISADO.md` — status implementado vs pendente
- `docs/21_PLANO_CONCLUSAO_FINAL.md` — status consolidado
- Matriz de rastreabilidade (requisito → spec → teste) em `docs/07_TESTS.md` seção 5.1
- Seção Subagents em `AGENT.md`
- `docs/06_SECURITY.md` — seção Ferramentas complementares (VibeChecker, SonarQube)
- `docs/16_RUNBOOK.md` — template de incidente 5 fases
- `docs/decisions/` — template MADR para ADRs
- `.github/workflows/ci.yml` — workflow Next.js com next typegen
- Skill `/market` para Fase 1c

### Changed

- `docs/11_RELEASE_READINESS.md` — checklist observabilidade expandido
- `docs/06_SECURITY.md` — política de dependências
- `WORKFLOW.md` — seção hotfix vs fix-issue
- `docs/13_QUICK_START.md` — referência a /hotfix e post-mortem
- `scripts/verify-docs.sh` — inclui templates e docs 06–11

### Security

- Documentação de ferramentas para código gerado por IA (76% vulnerabilidades; 98% apps sem proteções básicas)

## [0.1.0] - 2026-03-12

### Added

- Base inicial do framework VibeCoding
