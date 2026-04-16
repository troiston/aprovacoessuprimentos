# S02_PROMPT_PACKS.md — Pacotes de Prompt (Copiar e Colar)

> **Objetivo:** acelerar a execução com prompts padronizados, mantendo qualidade alta.  
> **Regra de ouro:** sempre ativar `/using-superpowers` antes de qualquer prompt.

**Como usar:**
- **Curto:** tarefa rápida com contexto já conhecido
- **Médio:** padrão recomendado para a maioria dos casos
- **Completo:** projetos novos, escopo crítico ou alta incerteza

---

## 0) Comando Obrigatório — Início de Toda Sessão

```text
/using-superpowers
```

---

## 1) Pacotes por Fase

### Fase 0 — /validate

#### Curto
```text
/using-superpowers
/validate
Problema: [descreva]
Público: [descreva]
Solução: [descreva]
Exijo veredito GO/HOLD/NO-GO com riscos de segurança e UX em docs/00_VALIDATION.md.
```

#### Médio
```text
/using-superpowers
/validate

IDEIA:
- Problema:
- Público-alvo:
- Solução proposta:
- Diferencial:
- Restrições:

Exijo:
1) pesquisa em comunidades, concorrentes e GitHub
2) build vs buy
3) riscos de segurança/compliance e UX/adoção
4) scorecard com confiança da evidência
5) veredito em docs/00_VALIDATION.md
```

#### Completo
```text
/using-superpowers
/validate
/brainstorming

IDEIA DO PRODUTO:
- Problema principal:
- ICP/persona pagante:
- Solução proposta:
- Diferencial defendível:
- Restrições não negociáveis (tempo, budget, compliance, stack):
- Hipóteses críticas:

Exijo no documento final:
- evidências externas rastreáveis (mercado/comunidade/concorrentes/GitHub)
- due diligence de OSS (licença, manutenção, CVE, lock-in)
- risco de segurança e privacidade por domínio
- risco UX (fricção, onboarding, confiança)
- score ponderado + nível de confiança + top 3 incertezas
- veredito GO/HOLD/NO-GO em docs/00_VALIDATION.md
```

---

### Fase 1 — /prd

#### Curto
```text
/using-superpowers
/prd
@docs/00_VALIDATION.md
Gere PRD com requisitos priorizados e critérios de aceitação testaveis.
```

#### Médio
```text
/using-superpowers
/prd
@docs/00_VALIDATION.md

CONTEXTO:
- Nome:
- Objetivo:
- Stack alvo:
- Restrições:

Antes do PRD, entregue diagnóstico e pare para aprovação.
Depois gere docs/01_PRD.md com escopo, requisitos, riscos, métricas e rollout.
```

#### Completo
```text
/using-superpowers
/prd
/context-driven-development
@docs/00_VALIDATION.md

CONTEXTO:
- Produto:
- Persona primária/secundária:
- Objetivo de negócio:
- Meta de resultado em 90 dias:
- Restrições técnicas/compliance:

Fluxo:
1) diagnóstico com trade-offs e riscos
2) aguardar aprovação
3) gerar docs/01_PRD.md com:
   - requisitos funcionais priorizados (P0/P1/P2)
   - requisitos não-funcionais com métricas
   - critérios de aceite testaveis
   - métricas leading/lagging
   - riscos + mitigações
   - escopo e fora de escopo
```

---

### Fase 1c — /market

#### Curto
```text
/using-superpowers
/market
@docs/01_PRD.md
Preencha docs/04_MARKET_AND_REFERENCES.md com as 4 frentes (OSS, concorrentes, comunidades, consolidação).
```

#### Médio
```text
/using-superpowers
/market
@docs/00_VALIDATION.md @docs/01_PRD.md

Guie o preenchimento de docs/04_MARKET_AND_REFERENCES.md:
- Frente 1: OSS, bibliotecas, licenças, CVEs
- Frente 2: Concorrentes, precificação, diferenciais
- Frente 3: Comunidades, avaliações, issues GitHub
- Frente 4: Consolidação, escopo confirmado/descartado, ADRs impactados
```

#### Completo
```text
/using-superpowers
/market
/brainstorming
/architecture-decision-records
@docs/00_VALIDATION.md @docs/01_PRD.md

Exijo preenchimento completo de docs/04_MARKET_AND_REFERENCES.md com pesquisa real:
- Repos e pacotes OSS aprovados (justificativa + CVEs verificados)
- Concorrentes diretos/indiretos e modelos de precificação
- Feedback de comunidades (Reddit, HN, Product Hunt, G2)
- Consolidação: ferramentas aprovadas, escopo confirmado/descartado, riscos
- ADRs criados para decisões arquiteturais derivadas
- Gate de saída atendido antes de avançar para design
```

---

### Fase 1D — /design

#### Curto
```text
/using-superpowers
/design
@docs/01_PRD.md @docs/04_MARKET_AND_REFERENCES.md
Gere design system e styleguide com preview de componentes e páginas, WCAG AA.
```

#### Médio
```text
/using-superpowers
/design
/frontend-design
/tailwind-design-system
@docs/01_PRD.md @docs/04_MARKET_AND_REFERENCES.md

Obrigatório:
- tokens e componentes base
- estados de UI (loading/empty/error/success)
- microcopy de erro/confirmação
- styleguide navegável com preview de componentes e preview de páginas
- docs/05_DESIGN.md atualizado
- aprovação do preview antes de /spec
```

#### Completo
```text
/using-superpowers
/design
/frontend-design
/design-system-patterns
/tailwind-design-system
/accessibility-compliance
/interaction-design
@docs/01_PRD.md @docs/04_MARKET_AND_REFERENCES.md

Exijo:
- design system completo com tokens e guidelines
- evitar AI slop: sem Inter/Space Grotesk para tudo; sem gradientes roxo-azul genéricos; sem emoji como ícone; Lucide como única biblioteca de ícones; paleta coesa; motion orquestrado
- acessibilidade WCAG AA nos fluxos críticos
- padrão de formulários e feedback
- regras de microcopy orientadas a recuperação
- dark mode coerente
- styleguide em /app/styleguide com preview de componentes e preview de páginas do PRD
- gerar assets de empty state com /asset-generator (salvar em assets/)
- docs/05_DESIGN.md com checklist UX/a11y por página
- aprovação do preview antes de /spec
```

---

### Fase 2 — /spec

#### Curto
```text
/using-superpowers
/spec
@docs/01_PRD.md
@docs/05_DESIGN.md
Gere especificação técnica sem ambiguidades.
```

#### Médio
```text
/using-superpowers
/spec
/api-design-principles
@docs/01_PRD.md
@docs/05_DESIGN.md

Obrigatório:
- arquivos, contratos, tipos e ordem de implementação
- dependências entre etapas
- controles de segurança e critérios UX testaveis por fluxo
- TODOs em aberto = bloqueios explícitos (não pode haver)
```

#### Completo
```text
/using-superpowers
/spec
/api-design-principles
/openapi-spec-generation
/postgresql-table-design
/architecture-decision-records
@docs/01_PRD.md
@docs/05_DESIGN.md

Exijo docs/06_SPECIFICATION.md com:
- lista de arquivos a criar/modificar + responsabilidade
- contratos API/request/response completos
- tipos/interfaces TypeScript e validação Zod
- ordem de implementação em blocos pequenos e independentes
- abuse cases por fluxo sensível
- critérios de rollback
- critério de aceite técnico e UX por fluxo
- sem TODO aberto; lacuna vira bloqueio explícito
- ADRs para decisões arquiteturais relevantes
```

---

### Fase 3B — /implement-backend

#### Curto
```text
/using-superpowers
/implement-backend
@docs/06_SPECIFICATION.md
Implemente apenas o bloco [nome] e atualize docs/07_IMPLEMENTATION.md (Backend).
```

#### Médio
```text
/using-superpowers
/implement-backend
/test-driven-development
@docs/06_SPECIFICATION.md
@docs/01_PRD.md

Obrigatório:
- Zod em entradas
- authz por ownership
- idempotência em operações críticas
- trilha de auditoria
- ciclo RED→GREEN→REFACTOR
- typecheck/lint verdes
```

#### Completo
```text
/using-superpowers
/implement-backend
/auth-implementation-patterns
/test-driven-development
/secrets-management
@docs/06_SPECIFICATION.md
@docs/01_PRD.md

Implemente APENAS o bloco [nome exato da spec].
Obrigatório:
- aderência total à spec
- validação de input/output com Zod
- ownership check (IDOR prevention)
- idempotência para retries
- logs sem PII + eventos de auditoria
- ciclo TDD: RED→GREEN→REFACTOR
- executar /secrets-management antes do commit
- docs/07_IMPLEMENTATION.md (Backend) atualizado com contratos e exemplos de teste
```

---

### Fase 3F — /implement-frontend

#### Curto
```text
/using-superpowers
/implement-frontend
@docs/06_SPECIFICATION.md
@docs/05_DESIGN.md
Implemente apenas a página [nome] com estados completos e a11y.
```

#### Médio
```text
/using-superpowers
/implement-frontend
/test-driven-development
@docs/06_SPECIFICATION.md
@docs/05_DESIGN.md
@docs/07_IMPLEMENTATION.md
@app/styleguide

Obrigatório:
- estados completos (loading/empty/error/success)
- validação client+server
- navegação por teclado e foco
- sem dead-end
```

#### Completo
```text
/using-superpowers
/implement-frontend
/react-state-management
/tailwind-design-system
/accessibility-compliance
/test-driven-development
@docs/06_SPECIFICATION.md
@docs/05_DESIGN.md
@docs/07_IMPLEMENTATION.md
@app/styleguide

Implemente APENAS a página/fluxo [nome].
Obrigatório:
- loading/empty/error/success em toda tela
- acessibilidade WCAG AA (teclado, foco, semântica, labels)
- microcopy de erro/confirmação orientado a recuperação
- confirmação para ações destrutivas
- consistência visual com styleguide
- ciclo TDD: RED→GREEN→REFACTOR
- atualizar docs/07_IMPLEMENTATION.md (Frontend)
```

---

### Fase 4 — Quality (Paralelo)

#### Curto
```text
/using-superpowers
Executar em paralelo: security-auditor, test-writer, debugger.
Gerar docs/06, 07, 08, 09 e 10.
Bloquear release se houver achado crítico.
```

#### Médio
```text
/using-superpowers

Executar em paralelo:
- /secrets-management + /auth-implementation-patterns → docs/08_SECURITY.md + docs/12_THREAT_MODEL.md
- /test-writer + /playwright-best-practices → docs/09_TESTS.md
- /debugger + /systematic-debugging → docs/10_DEBUG.md + docs/11_UX_AUDIT.md
```

#### Completo
```text
/using-superpowers

Executar em paralelo:

[Security Track]
/secrets-management
/auth-implementation-patterns
/k8s-security-policies
→ preencher docs/08_SECURITY.md (OWASP Top 10 + checklist infra)
→ preencher docs/12_THREAT_MODEL.md (STRIDE por fluxo)

[Test Track]
/test-writer
/playwright-best-practices
/e2e-testing-patterns
/accessibility-compliance
→ preencher docs/09_TESTS.md (matriz de rastreabilidade + cobertura)

[Debug + UX Track]
/debugger
/systematic-debugging
/interaction-design
→ preencher docs/10_DEBUG.md (zero bug crítico)
→ preencher docs/11_UX_AUDIT.md (Nielsen + a11y + microcopy)

Critérios para cada track:
- classificar severidade e risco residual
- definir owner e prazo para cada pendência
- emitir veredito READY/NOT READY por documento
- qualquer crítico aberto = bloquear release
```

---

### Fase Final — /pr + /release

#### Curto
```text
/using-superpowers
/verification-before-completion
/pr
Abrir PR somente se typecheck/lint/test ok e docs/13_RELEASE_READINESS.md preenchido.
```

#### Médio
```text
/using-superpowers
/verification-before-completion
/finishing-a-development-branch
/changelog-automation
/pr

Antes do PR:
- typecheck/lint/test verdes
- docs/13_RELEASE_READINESS.md preenchido
- changelog gerado

No PR:
- resumo da mudança
- riscos e mitigações
- plano de teste
```

#### Completo
```text
/using-superpowers
/verification-before-completion
/finishing-a-development-branch
/changelog-automation
/release
/pr

Pré-condição:
- todos os gates de docs/13_RELEASE_READINESS.md atendidos
- decisão GO ou GO WITH RISK documentada com justificativa

Body do PR deve conter:
- contexto e objetivo
- mudanças principais (com referência à spec)
- riscos, mitigações e risco residual aceito
- plano de teste (automatizado + manual)
- pendências com owner/prazo
- link para docs/13_RELEASE_READINESS.md
```

---

### Modo Orquestrado — /orchestrate

#### Curto
```text
/using-superpowers
/orchestrate
Continue a execução a partir da fase atual, com gates ativos e controle de token.
```

#### Médio
```text
/using-superpowers
/orchestrate [slice-alvo]

Contexto:
- Slice alvo: [nome]
- Fase atual: [fase]
- Restrição principal: [custo/tempo/risco]

Execute somente esse slice com handoffs estruturados e quality gate ao final.
```

#### Completo
```text
/using-superpowers
/orchestrate --from [fase] --budget [tokens]
@docs/01_PRD.md
@docs/06_SPECIFICATION.md
@docs/05_DESIGN.md

Objetivo:
- Executar do ponto informado até o próximo gate aprovado
- Aplicar model routing por complexidade
- Aplicar context pruning por worker
- Emitir logs estruturados [ORCH] em cada dispatch/return/gate
- Atualizar docs/ORCHESTRATOR_METRICS.md e docs/ORCHESTRATOR_LEARNINGS.md
```

---

### Hotfix — /hotfix

```text
/using-superpowers
/systematic-debugging
/incident-runbook-templates

HOTFIX:
- Problema em produção: [descreva]
- Impacto: [usuários afetados / funcionalidades]
- Reprodução: [passos]

Exijo:
1) diagnóstico com causa raiz
2) correção mínima e segura
3) testes de regressão no fluxo afetado
4) atualizar docs/10_DEBUG.md
5) preencher docs/16_RUNBOOK.md (Alert→Assess→Remediate→Verify→Close)
6) post-mortem em docs/18_POST_MORTEM.md após resolução

Não introduzir novas features ou refatorações no hotfix.
```

---

### MiniSpec — Feature em Produto Existente

#### Médio
```text
/using-superpowers
/spec
/context-driven-development
@docs/01_PRD.md
@docs/06_SPECIFICATION.md
@docs/05_DESIGN.md

FEATURE:
- Problema:
- Fluxo desejado:
- Restrições:

Gere MiniSpec com impacto técnico, segurança e UX.
Não implementar antes de aprovação explícita.
```

#### Completo
```text
/using-superpowers
/spec
/context-driven-development
/architecture-decision-records
@docs/01_PRD.md
@docs/06_SPECIFICATION.md
@docs/05_DESIGN.md

FEATURE:
- Contexto de negócio:
- Objetivo:
- Jornada esperada:
- Restrições e compatibilidade:

Primeiro entregue MiniSpec contendo:
- impacto em arquitetura e contratos (ADR se necessário)
- impacto em segurança/compliance (ameaças e controles)
- impacto em UX/a11y (fricção e estados)
- critérios de aceite técnico e UX
- plano de rollout e rollback

Não implementar antes de aprovação explícita.
```

---

### ADR — Decisão Arquitetural

```text
/using-superpowers
/architecture-decision-records
/architecture-patterns

DECISÃO:
- Contexto e problema:
- Opções consideradas: [A, B, C]
- Restrições: [licença, performance, equipe, budget]

Exijo:
1) análise de trade-offs por opção (tabela)
2) impacto em segurança e UX
3) critério de revisão futura
4) preencher decisions/NNNN-titulo.md com template MADR
```

---

## 2) Pacotes por Tipo de Produto

### SaaS B2B
```text
Contexto produto: SaaS B2B.
Priorize:
- onboarding de equipe e permissão por papel (RBAC)
- trilha de auditoria completa
- SSO / segurança corporativa
- UX orientada a produtividade e baixa fricção operacional
- LGPD: controles de acesso a dados por tenant
```

### Marketplace
```text
Contexto produto: Marketplace.
Priorize:
- antifraude, reputação e confiança entre partes
- disputa/reembolso e trilha de eventos
- proteção contra abuso e automação (rate limit, captcha)
- UX de descoberta, comparação e decisão rápida
- LGPD: dados de compradores e vendedores isolados
```

### App Mobile
```text
Contexto produto: App Mobile.
Priorize:
- performance e latência percebida (< 100ms de feedback)
- resiliência de rede (offline/instável)
- touch targets >= 44px e navegação por gestos
- segurança de sessão no dispositivo
- /mobile-ios-design e /mobile-android-design para padrões nativos
```

### AI Copilot / Produto com IA
```text
Contexto produto: AI Copilot.
Priorize:
- segurança de prompt / data leakage
- guardrails e limites de ação automatizada
- transparência de incerteza e verificabilidade da resposta
- UX de confiança: fontes visíveis; confirmação antes de ações críticas
- custo de inferência e latência percebida
```

### API-first / Developer Tool
```text
Contexto produto: API-first / Dev Tool.
Priorize:
- /openapi-spec-generation: contrato OpenAPI desde o início
- DX (developer experience): erros legíveis, exemplos de uso, changelog
- versionamento de API (backward compatibility)
- rate limiting e autenticação por token
- docs interativas (Swagger UI / Redoc)
```
