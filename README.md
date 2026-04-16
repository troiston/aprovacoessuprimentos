# VibeCoding — Framework de Desenvolvimento

Base **VibeCoding** (produto: PRD, spec, implementação) + **Web Excellence** (páginas, SEO, UX, tokens): um único repositório Next.js com Prisma, Stripe e kit Cursor.

---

## Como Começar

```
1. .cursorrules + AGENT.md           → hierarquia de rules e precedência
2. /using-superpowers                → antes de usar skills Cursor
3. docs/DOCS_INDEX.md                → fase e documentos VibeCoding
4. docs/S03_SKILLS_INDEX.md          → 87 skills Cursor + 71 skills Web Excellence
5. docs/web-excellence/DOCS_INDEX.md → guias de página/SEO (complementares)
6. docs/S01_QUICK_START.md           → guia de 1 página
7. WORKFLOW.md                       → fluxo VibeCoding + pipeline Web Excellence
```

**Setup local:** `bash scripts/bootstrap.sh` (Node 20+, `npm install`, Prisma generate, `verify-docs`).

---

## Fluxo

**Produto (VibeCoding):**

```
/validate → /prd → /monetization-check → /market → /design → /spec → /implement-backend + /implement-frontend
           ↓ a cada fase ↓
     bash scripts/verify-docs.sh
```

**Páginas (Web Excellence), após spec:** `/init-tokens`, `/new-page`, `/audit-full`, … — ver `.cursor/commands/COMMANDS_INDEX.md`. Em repo já existente, **não** usar `create-next-app` na raiz (ver secção brownfield em `init-project`).

---

## Estrutura

```
.
├── ARCHITECTURE.md → visão de arquitetura (Fase 2 /spec com a spec; refinado na Fase 3)
├── AGENT.md        → regras do agente (bootstrap pré-Fase 0)
├── README.md
├── WORKFLOW.md

.cursor/
├── agents/         → 01–07 Web Excellence + debugger, review, security-auditor, ui-reviewer
├── commands/     → project/, build/, generate/, audit/ + deploy, pr, hotfix, …
├── rules/
│   ├── core/       → constitution, typescript, code-style, project, vibecoding-phases
│   ├── stack/      → nextjs, tailwind, framer-motion (opcional), database
│   ├── quality/    → seo, performance, accessibility, security
│   ├── design/     → tokens, typography, motion, responsive
│   ├── framework/  → nextjs (ponteiro), typescript
│   ├── domain/     → api, marketing, monetization
│   └── security/   → security, secrets
├── skills/         → 87 skills Cursor (SKILL.md)
└── skills-web-excellence/ → 71 skills com grafo (ver SKILLS_INDEX.md)

docs/
├── DOCS_INDEX.md                    → índice geral com status por fase
├── S03_SKILLS_INDEX.md              → mapa de 87 skills por fase e responsável
├── S01_QUICK_START.md               → guia de 1 página + mid-flight onboarding
├── S02_PROMPT_PACKS.md              → prompts prontos por fase (curto/médio/completo)
├── S04_IMAGE_GENERATION.md          → geração de assets com Cursor
├── S05_DESIGN_REFERENCES.md         → referências de design, a11y e anti-padrões
├── 00_VALIDATION.md                 → validação de ideia / GO·HOLD·NO-GO
├── 01_PRD.md                        → requisitos priorizados e critérios de aceite
├── 02_MONETIZATION.md               → modelo de negócio, pricing e pagamentos (gate)
├── 03_RESEARCH.md                   → pesquisa técnica quando houver integrações
├── 04_MARKET_AND_REFERENCES.md      → pesquisa 4 frentes (OSS, concorrentes, comunidades)
├── 05_DESIGN.md                     → design system, tokens, estados, microcopy
├── 06_SPECIFICATION.md              → contratos, tipos e ordem de implementação
├── 07_IMPLEMENTATION.md             → estado real implementado (backend + frontend)
├── 08_SECURITY.md                   → OWASP Top 10 + infra checklist
├── 09_TESTS.md                      → suite, cobertura, rastreabilidade
├── 10_DEBUG.md                      → bugs conhecidos, processo sistemático
├── 11_UX_AUDIT.md                   → Nielsen, WCAG AA, mobile UX
├── 12_THREAT_MODEL.md               → STRIDE, LGPD, controles
├── 13_RELEASE_READINESS.md          → GO / GO WITH RISK / NO-GO
├── INT01_PLANO_ARQUITETURA.md       → plano de arquitetura revisado
├── INT02_PLANO_CONCLUSAO.md         → status consolidado / conclusão
├── INT03_AI_DOCS_INDEXING.md        → trail-docs (opcional, 15+ docs)
├── OPS01_DEPLOYMENT.md              → runbook de deploy Docker Swarm/Traefik
├── OPS02_RUNBOOK.md                 → resposta a incidentes (5 fases, SEV-1/2/3)
├── OPS03_POST_MORTEM.md             → post-mortem blameless
├── decisions/                       → ADRs em formato MADR
└── templates/                       → seeds para cada documento de fase

docs/web-excellence/                 → guias Web Excellence (SEO, UX, foundations, …)

scripts/
├── verify-docs.sh           → gates VibeCoding + estrutura .cursor
├── verify-docs-integrity.sh → frontmatter/links scoped (web-excellence + skills-web-excellence)
├── verify-framework.sh      → grafo requires das 71 skills Web Excellence
├── generate-framework-manifest.mjs
├── generate-sitemap.ts      → `npm run sitemap` (tsx)
├── audit-lighthouse.sh
├── bootstrap.sh, new-phase.sh
└── …
```

### Verificação rápida

| Comando | Função |
|--------|--------|
| `npm run verify` | `verify-docs` + `verify-framework` + `verify-docs-integrity` |
| `npm run manifest` | Regenera `docs/web-excellence/framework-manifest.json` |
| `npm run test:e2e` | Playwright (smoke em `/`, `/login`, `/register`, `/dashboard`) |

---

## Regras Fundamentais

| Regra | Consequência se quebrada |
|---|---|
| `/using-superpowers` primeiro | Agente age sem as skills certas |
| Sem `06_SPECIFICATION.md` aprovada, não implementar | Retrabalho e drift |
| `verify-docs.sh` exit 0 antes de fechar fase | Fase fechada com estado incompleto |
| `13_RELEASE_READINESS.md` preenchido antes do PR | PR sem gates de qualidade |
| Risco residual com owner e prazo | Risco invisível em produção |

---

## Planos

Planos de arquitetura e evolução em `.cursor/plans/` para referência do time.
