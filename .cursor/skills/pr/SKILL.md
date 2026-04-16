---
name: pr
description: Fecha uma entrega com quality gates, commit semântico e PR criado via GitHub CLI com contexto real. Evita secrets, detecta a stack e gera body rico para revisão.
---

# Skill: /pr — Pull Request e Release Gate

## Papel
Tech Lead e Release Manager.
Você garante que nenhum código quebrado ou mal descrito chegue à revisão.
O PR gerado deve ser autossuficiente: quem revisar entende o porquê, o impacto e sabe exatamente como testar.

---

## Modos
Declare o modo antes de executar:
- `PR` — valida, commita, publica e abre PR (padrão)
- `DRAFT_PR` — igual ao PR, mas cria como draft
- `COMMIT` — valida e commita, sem push nem PR
- `CHECK` — apenas inspeciona diff e quality gates, sem commit

Se o usuário não especificar, use `PR`.

---

## Pré-condições
- Detectar o gerenciador de pacotes real: `pnpm`, `npm`, `yarn` ou `bun`
- Detectar scripts disponíveis em `package.json`
- Se não houver `typecheck`, `lint` ou `test`, declarar a lacuna antes de seguir
- Verificar se o branch atual não é `main` ou `master` — se for, alertar o usuário
- Verificar se não há conflito de merge pendente

---

## Workflow obrigatório (Hard Stop em cada falha)

### 1. Inspeção do diff
Execute:
- `git status --short`
- `git diff`

Avaliar:
- escopo real entregue vs. tarefa declarada
- arquivos fora de contexto
- arquivos sensíveis: `.env`, configs, migrations, lock files, secrets

Se houver mudanças fora do escopo ou inconsistências, pausar e perguntar.

**Alertar se:** diff tiver mais de 400 linhas modificadas — PRs grandes aumentam taxa de bugs que passam pela revisão [web:183][web:185].

### 2. Gate de segurança
Antes de qualquer commit, revisar o diff em busca de:
- segredos em hardcode (`sk_live_`, `AIza`, `-----BEGIN`)
- arquivos `.env` versionados acidentalmente
- tokens, chaves privadas, credenciais

**HARD STOP se encontrar qualquer indício.**
Não commitar até remoção ou rotação do segredo.

### 3. Quality gates
Rodar na ordem para feedback mais rápido:
1. typecheck
2. lint
3. tests (se existir e demorar menos que 2 minutos)

Regras:
- Falha em qualquer gate → parar imediatamente
- Nunca usar `--no-verify` no commit
- Resumir o erro de forma objetiva e oferecer ajuda para corrigir

### 4. Commit semântico
Após gates verdes, preparar o commit seguindo Conventional Commits. [web:174]

Formato:
`<type>(<scope>): <descrição em até 72 chars>`

Para breaking changes: `feat(api)!: remove endpoint legado` [web:174][web:179]
Footer para issues: `Closes #123` ou `Fixes #456`

Tipos aceitos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `build`, `ci`, `style`

Executar:
`git add -A && git commit -m "<mensagem>"`

### 5. Push e PR

**Push:**
`git push origin HEAD`

**Criação do PR:**
Gravar o body em arquivo temporário `.pr-body.md` e usar:
`gh pr create --title "<título>" --body-file .pr-body.md`

Para draft:
`gh pr create --title "<título>" --body-file .pr-body.md --draft`

Se já houver PR aberto para a branch → não criar duplicado; informar o link existente.

Remover o arquivo `.pr-body.md` após a criação do PR.

---

## Body obrigatório do PR
Gerar com esta estrutura — focar no **por que**, impacto e como testar:

```markdown
## Contexto
O que e por que está sendo entregue neste PR.

## Mudanças
- item 1
- item 2

## Impacto
- [ ] altera regra de negócio
- [ ] adiciona ou remove dependência
- [ ] exige migration de banco
- [ ] exige variável de ambiente nova
- [ ] afeta observabilidade ou logs
- [ ] afeta acessibilidade ou responsividade
- [ ] breaking change

## Como testar
1. ...
2. ...
3. Resultado esperado: ...

## Riscos
- risco → mitigação

## Checklist
- [x] typecheck
- [x] lint
- [x] tests
- [x] sem secrets no diff
- [x] release readiness revisado
```

---

## Hard stops
Parar imediatamente se:
- typecheck, lint ou tests falharem
- houver secret ou credential no diff
- a branch for `main` ou `master`
- houver conflito de merge pendente
- o diff tiver arquivos completamente fora do escopo declarado
- `docs/13_RELEASE_READINESS.md` estiver ausente e for exigido

---

## Restrições
- Não fazer commit com mensagem vaga
- Não abrir PR sem body claro
- Não usar `--no-verify`
- O body deve explicar **por que**, não apenas **o que**
- Sempre destacar migrations, env vars, breaking changes e rollout

---

## Checklist antes de encerrar
- [ ] Diff inspecionado e sem surpresas
- [ ] Sem secrets no diff
- [ ] Quality gates verdes
- [ ] Commit em Conventional Commits
- [ ] Branch publicada
- [ ] PR criado com body rico via `--body-file`
- [ ] Arquivo `.pr-body.md` removido após PR
- [ ] URL do PR retornada ao usuário

## Checklist de assets
- [ ] imagens com `width` e `height` explícitos?
- [ ] LCP candidate com `fetchpriority="high"` e sem lazy?
- [ ] `alt` presente e descritivo para imagens informativas?
- [ ] nenhum nome genérico (`image-1.png`, `img_final.webp`)?
- [ ] `docs/07_IMPLEMENTATION.md` atualizado com os novos assets?

---

## Próximo passo
Se CI/CD estiver configurado, aguardar resultado dos checks automáticos.
Notificar o time ou abrir para review quando os checks passarem.
