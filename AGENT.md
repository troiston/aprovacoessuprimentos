# AGENT.md — Regras de Operação do Agente

## Ciclo de vida

- **Gerado no bootstrap/setup do projeto** (template ou `scripts/bootstrap.sh`), **antes da Fase 0** (`/validate`).
- É o contrato operacional do agente humano/IA no repositório: atualizar quando mudarem gates, precedência de documentos ou políticas de evidência/segurança — não substitui `docs/06_SPECIFICATION.md`.

---

## Leitura Obrigatória Antes de Agir

1. `/using-superpowers` — ativar antes de qualquer ação
2. `docs/DOCS_INDEX.md` — status atual e precedência (produto VibeCoding)
3. `docs/S03_SKILLS_INDEX.md` — skills Cursor por fase + skills Web Excellence (71 em `.cursor/skills-web-excellence/`)
4. `docs/web-excellence/DOCS_INDEX.md` — guias de página, SEO, UX, performance (complementares; não substituem PRD/spec)
5. `.cursorrules` e `.cursor/rules/RULES_INDEX.md` — hierarquia core → stack → quality → design + rules VibeCoding (`domain/`, `security/`)
6. Documento da fase atual (fonte de verdade)
7. Documentos predecessores relevantes

---

## Precedência entre Documentos

Em conflito, obedecer esta ordem:

1. `docs/01_PRD.md` — o que construir
2. `docs/02_MONETIZATION.md` — modelo de negócio, pricing e integração de pagamentos (gate antes de market/design)
3. `docs/05_DESIGN.md` — como deve parecer e comportar na UI (insumo da spec para UI)
4. `docs/06_SPECIFICATION.md` — como construir
5. `docs/07_IMPLEMENTATION.md` — estado real implementado
6. `docs/00_VALIDATION.md` — direção de problema/mercado e limites de escopo
7. `docs/08_SECURITY.md`, `docs/09_TESTS.md`, `docs/10_DEBUG.md`, `docs/11_UX_AUDIT.md`, `docs/12_THREAT_MODEL.md` — gates de qualidade

---

## Regras Operacionais

- Uma tarefa por chat.
- Mudou de fase → abrir chat novo.
- Se repetir erro duas vezes → resetar contexto e reiniciar com instruções mais granulares.
- Não implementar sem `docs/06_SPECIFICATION.md` aprovada.
- Não alterar escopo da fase sem atualizar o documento da fase.
- Não fechar fase sem rodar `bash scripts/verify-docs.sh`.
- Não abrir PR sem `docs/13_RELEASE_READINESS.md` preenchido com GO ou GO WITH RISK.

---

## Padrões Técnicos Obrigatórios

- TypeScript strict, sem `any`.
- Zod em todas as entradas externas (API, forms, env parsing).
- Erros com respostas consistentes e sem vazar stack trace.
- Logs sem dados sensíveis (tokens, PII, segredos).
- Reuso de componentes de `src/app/styleguide` antes de criar novos.
- Acessibilidade WCAG AA obrigatória em fluxos críticos (teclado, foco, contraste, semântica).

---

## Segurança por Design (Obrigatório)

- Toda feature nova deve declarar superfície de ataque e dados sensíveis envolvidos.
- Aplicar princípio do menor privilégio em authz (usuário só acessa o que precisa).
- Definir limites de abuso: rate limit, anti-automação e proteção de brute force.
- Privacidade por padrão: minimização de dados, retenção definida, mascaramento em logs.
- Dependências novas exigem checagem de licença, manutenção e risco de CVE.
- Risco residual deve ser explicitado com owner e plano de monitoração.
- `/secrets-management` antes de todo commit na Fase 3.

---

## Padrão de Evidência (Obrigatório)

- Toda recomendação crítica deve indicar fonte ou premissa verificável.
- Evitar "achismo": quando não houver dado, registrar nível de confiança (alto/médio/baixo).
- Decisões de alto impacto devem trazer alternativa descartada e motivo.
- Decisões arquiteturais relevantes → ADR em `docs/decisions/`.

---

## Critérios de Qualidade UI/UX

- Nenhuma tela sem estados explícitos: loading, empty, error, success.
- Formulários devem ter mensagens acionáveis, validação instantânea e recuperação fácil.
- Fluxo principal deve ser navegável por teclado e compreensível sem ambiguidade textual.
- Decisões de UX devem registrar trade-off (performance, clareza, conversão, acessibilidade).
- Hierarquia visual clara (escala tipográfica, peso, cor); micro-interações sutis permitidas.
- Evitar estética genérica (AI slop): consultar `docs/S05_DESIGN_REFERENCES.md`.

---

## Política de Mudanças

- Diffs pequenos, rastreáveis e com objetivo único.
- Não adicionar dependência sem justificativa técnica e impacto.
- Não hardcode de segredo, URL, chave ou token.
- Mudança de schema exige migration e plano de rollback.
- Refatoração com mudança de contratos públicos → ADR em `docs/decisions/`.

---

## Camada Web Excellence (páginas e marketing)

- **Agents numerados:** `.cursor/agents/01-architect.md` … `07-deploy-manager.md` — pipeline de landing/UI/SEO (ver `AGENTS_INDEX.md`).
- **Commands:** `.cursor/commands/project|build|generate|audit/` — ex.: `/init-tokens`, `/new-page`, `/audit-full`. Em **brownfield**, seguir secção em `project/init-project.md` (nunca `create-next-app` na raiz deste repo).
- **Skills com grafo:** `@.cursor/skills-web-excellence/...` — `npm run verify:framework` valida `requires:` / `rule:`.
- **Ordem prática:** PRD + `06_SPECIFICATION` aprovados antes de implementação em massa com `/new-page`; tokens e UI alinhados a `docs/05_DESIGN.md` quando existir.

---

## Subagents

| Subagent | Quando usar |
|---|---|
| **explore** | Explorar codebase ampla; buscar por padrões; "onde está X?", "como funciona Y?" |
| **shell** | Git, npm, comandos de terminal; operações que exigem execução de comandos |
| **orchestrator** | Coordenar execução por fases/slices via `/orchestrate` com gates e controle de contexto |
| **debugger** | Investigar bugs; code review com foco em riscos; antes de release |
| **security-auditor** | Revisão OWASP antes de deploy; ativar com `@security` |
| **ui-reviewer** | Auditar fidelidade visual, estados UX e acessibilidade WCAG após mudanças de UI |
| **test-writer** | Criar suites Vitest/Playwright; cobrir fluxos críticos |

> Regra: para tarefas estreitas (arquivo específico, comando único) → ferramentas diretas.  
> Para exploração ampla ou tarefas multi-etapa → considerar subagent.

---

## Comandos Preferências

```bash
# typecheck focado
npx tsc --noEmit src/path/to/file.ts

# lint focado
npx eslint --fix src/path/to/file.ts

# teste focado
npx vitest run src/path/to/file.test.ts

# verificação de saúde dos docs (gates VibeCoding)
bash scripts/verify-docs.sh

# integridade frontmatter/links só no kit Web Excellence (scoped)
bash scripts/verify-docs-integrity.sh

# grafo skills/commands Web Excellence
npm run verify:framework

# validação completa (somente quando necessário)
npm run typecheck && npm run lint && npm run test
```

---

## Definição de Pronto por Fase

- Fase concluída somente com documento atualizado e checklist fechado.
- Se houver lacuna, registrar explicitamente em "Riscos / Suposições / Pendências".
- Sem checklist de segurança e UX fechado, fase não é considerada pronta.
- Sem owner para risco residual, item não pode ser marcado como pronto.
- `bash scripts/verify-docs.sh` deve retornar exit 0 antes de fechar qualquer fase.
