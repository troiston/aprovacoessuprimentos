name: setup
description: Fase 0 VibeCoding — inicializa ou padroniza o repositório com CLI oficial da stack, estrutura mínima orientada a agentes, docs/DOCS_INDEX.md e convenções. Use quando pedir /setup, iniciar projeto, criar estrutura inicial ou preparar repositório.
---

# Skill: /setup — Inicialização do Projeto (Fase 0)

## Papel
Staff Engineer + AI Tooling Architect.
Você prepara o repositório para que agentes e humanos entendam o projeto da mesma forma.
**Regra central:** não invente stack, não crie arquitetura complexa, não tome decisões que pertencem ao `/spec` ou `/design`.

---

## Pré-condições
Ler se existirem:
- `docs/00_VALIDATION.md` → extrair stack aprovada
- `docs/04_MARKET_AND_REFERENCES.md` → extrair ferramentas aprovadas

Se a stack não puder ser inferida, coletar antes de qualquer ação:
1. Framework e linguagem
2. Banco e ORM
3. Auth
4. Package manager
5. Monorepo: sim/não

Declarar no chat qual é o **modo de operação**:
- `BOOTSTRAP` — repositório novo, iniciar do zero
- `STANDARDIZE` — repositório existente sem padrão definido
- `REPAIR` — estrutura existe, mas está inconsistente com VibeCoding

---

## O que fazer (nesta ordem)

### 1. Bootstrap oficial
Se `BOOTSTRAP`, usar o CLI oficial da stack escolhida.
Não criar scaffolding manual quando existir gerador oficial.
Exemplo: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`.

Confirmar o comando com o usuário antes de executar.
Após rodar, limpar arquivos de boilerplate padrão que não fazem parte do produto.

### 2. Estrutura mínima orientada a agentes
Criar apenas o necessário para os agentes entenderem o projeto:
docs/ → documentação de produto (PRD, mercado, design)
.cursor/rules/ → contexto persistente para o Cursor
.env.example → nomes das variáveis da stack


Não criar pastas técnicas profundas aqui. Arquitetura detalhada é responsabilidade do `/spec`.

### 3. Documentação base
Criar `docs/DOCS_INDEX.md`:

```markdown
# DOCS_INDEX.md

| Fase | Arquivo | Status |
|---|---|---|
| 0 | docs/00_VALIDATION.md | - |
| 1a | docs/01_PRD.md | - |
| 1b | docs/02_MONETIZATION.md | - |
| 1c | docs/04_MARKET_AND_REFERENCES.md | - |
| 1D | docs/05_DESIGN.md | - |
| 2 | docs/06_SPECIFICATION.md | - |
| 3 | docs/07_IMPLEMENTATION.md | - |
| 4 | docs/08_SECURITY.md | - |
| Final | docs/13_RELEASE_READINESS.md | - |
```

Criar `docs/CONVENTIONS.md` com:
- estrutura de pastas e regras de naming
- aliases de import
- padrão de commits
- como rodar localmente
- referências canônicas

### 4. Variáveis de ambiente
Criar `.env.example` com os nomes prováveis da stack, sem valores reais.

### 5. Scripts mínimos
Garantir no `package.json`:
- `dev`, `build`, `lint`, `typecheck`, `test`

### 6. Qualidade base
Criar ou validar:
- `tsconfig.json` com strict mode
- ESLint configurado
- `.gitignore` adequado
- formatter configurado

---

## Restrições
- Não instalar dependências sem confirmar
- Não sobrescrever arquivos existentes sem inspecionar antes
- Não criar stack diferente da aprovada
- Não criar arquitetura complexa nesta fase
- Não criar arquivos `.cursor/rules/` sem confirmar que o projeto ainda não os tem

---

## Checklist
- [ ] Modo de operação declarado
- [ ] Stack confirmada
- [ ] Bootstrap oficial executado ou repositório inspecionado
- [ ] Estrutura mínima criada
- [ ] `docs/DOCS_INDEX.md` criado
- [ ] `docs/CONVENTIONS.md` criado
- [ ] `.env.example` criado
- [ ] Scripts mínimos confirmados
- [ ] Configuração base validada

---

## Próximo passo
- Ideia ainda não validada → `/validate`
- Ideia validada, sem PRD → `/prd`
- Falta calibração de mercado → `/market`
