# Contribuindo

Obrigado por considerar contribuir com este projeto. Este documento orienta o fluxo de trabalho.

## Índice

- [Como contribuir](#como-contribuir)
- [Setup](#setup)
- [Processo de PR](#processo-de-pr)
- [Tipos de contribuição](#tipos-de-contribuição)
- [Recursos](#recursos)

---

## Como Contribuir

- **Bugs:** abra uma issue com passos de reprodução e ambiente
- **Features:** discuta em issue antes de implementar
- **Documentação:** PRs diretos são bem-vindos
- **Código:** siga o fluxo abaixo
- **Nova skill Cursor:** usar `/writing-skills` e documentar em `docs/S03_SKILLS_INDEX.md`
- **Skills Web Excellence:** grafo em `.cursor/skills-web-excellence/` — após alterações, `npm run verify:framework`

---

## Setup

1. Clone o repositório
2. Confirme a estrutura mínima em `docs/DOCS_INDEX.md`
3. Para projetos com Cursor: valide indexação (Command Palette → Reindex)
4. Execute `bash scripts/verify-docs.sh` — exit 0
5. Execute `npm run verify:framework` e `bash scripts/verify-docs-integrity.sh` quando alterar kit Web Excellence
6. Abra o Cursor e execute `/using-superpowers`
7. Consulte `docs/S03_SKILLS_INDEX.md` (e `docs/web-excellence/DOCS_INDEX.md` para UI/SEO)

---

## Processo de PR

1. Crie branch: `fix/issue-N` ou `feat/descricao`
2. Siga `docs/03_SPECIFICATION.md` se alterar código
3. Ative as skills da fase atual (`docs/S03_SKILLS_INDEX.md`)
4. Rode `npm run typecheck && npm run lint && npm run test` e, se possível, `npm run test:e2e`
5. Rode `bash scripts/verify-docs.sh` e `npm run verify:framework`; se tocou em docs/skill WEB, `bash scripts/verify-docs-integrity.sh`
6. Commit semântico: `fix:`, `feat:`, `docs:`
7. PR com descrição clara e link para issue
8. `docs/11_RELEASE_READINESS.md` preenchido antes de abrir o PR

---

## Tipos de Contribuição

| Tipo | Risco | Requer |
|---|---|---|
| Documentação | Baixo | PR direto |
| Bug report | Baixo | Issue com repro |
| Pequena correção | Médio | Teste que falha antes |
| Feature | Alto | Spec aprovada + `11_RELEASE_READINESS.md` |
| Nova skill | Médio | Entrada em `S03_SKILLS_INDEX.md` |

---

## Recursos

| Recurso | Finalidade |
|---|---|
| [docs/DOCS_INDEX.md](docs/DOCS_INDEX.md) | Índice de documentação + status por fase |
| [docs/S03_SKILLS_INDEX.md](docs/S03_SKILLS_INDEX.md) | Skills Cursor por fase; Web Excellence em `docs/web-excellence/` |
| [WORKFLOW.md](WORKFLOW.md) | Fluxo por fase; hotfix vs fix-issue |
| [docs/13_QUICK_START.md](docs/13_QUICK_START.md) | Guia rápido (inclui mid-flight onboarding) |
| [docs/12_PROMPT_PACKS.md](docs/12_PROMPT_PACKS.md) | Prompts prontos por fase |
| [.cursor/commands/hotfix.md](.cursor/commands/hotfix.md) | Correção urgente em produção |
