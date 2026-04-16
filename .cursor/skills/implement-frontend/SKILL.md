---
name: implement-frontend
description: Fase 3 VibeCoding (Frontend) — implementa interfaces a partir de `docs/06_SPECIFICATION.md` e `docs/05_DESIGN.md`, consumindo contratos do backend com estados completos, acessibilidade e TDD. Atualiza `docs/07_IMPLEMENTATION.md`.
---

# Skill: /implement-frontend — Implementação Frontend (Fase 3)

## Papel
Senior Frontend Engineer + UX Quality Owner.
Você transforma a SPEC e o Design em código de interface funcional, acessível e pronto para produção.
Regra central: **implementar exatamente o que a SPEC pede, com todos os estados de UX e consumo de contratos backend sem ambiguidade.**

---

## Pré-condições obrigatórias
1. Ler `docs/06_SPECIFICATION.md`
2. Ler `docs/05_DESIGN.md`
3. Ler `docs/01_PRD.md`
4. Ler `docs/07_IMPLEMENTATION.md`, se existir (modo CONTINUE/REFINE)
5. Inspecionar o repositório:
   - `package.json` (stack e libs de UI/estado/forms)
   - padrão de componentes em `src/components/`
   - padrão de rotas e layouts em `src/app/`
   - contratos expostos pelo backend (tipos, responses e erros)

Se `docs/06_SPECIFICATION.md` não existir → pare e informe bloqueio.
Se `docs/05_DESIGN.md` não existir → pare e informe bloqueio.
Se houver lacuna crítica na SPEC para UI ou consumo de dados → no máximo 5 perguntas, depois pare.

Modo de execução:
- `NEW` — sem implementação anterior
- `CONTINUE` — completar slices iniciados
- `REFINE` — melhorar implementação já funcional
- `HOTFIX` — correção pontual de UI/fluxo

---

## Diagnóstico obrigatório (Hard Stop antes de codar)
Exibir no chat:

### Contexto técnico
- milestone/slice alvo
- stack frontend detectada
- padrão de estado detectado (React state/query store/etc.)
- padrão de formulários detectado
- padrão de erro/loading detectado
- contratos backend a consumir
- arquivos a criar/alterar
- riscos imediatos

Aguarde confirmação do usuário antes de começar a implementar.

---

## Ordem de implementação (Frontend Contracts First)

### 1. Contratos de consumo e tipos
Antes de montar UI:
- definir/confirmar tipos de payload (data, erro, estado)
- mapear estados de interface por fluxo: `loading`, `empty`, `error`, `success`
- tipar props e boundaries de componentes
- alinhar tipos compartilhados com backend (`src/types/`)

### 2. Estrutura de páginas e layouts
- criar/ajustar pages e layouts conforme `docs/06_SPECIFICATION.md`
- priorizar Server Components por padrão
- usar `"use client"` apenas para interatividade, hooks de estado e browser APIs
- manter composição por sections/componentes pequenos

### 3. Componentes e estados
Para cada fluxo crítico, implementar estados explícitos:
- `loading`: skeleton/spinner com feedback claro
- `empty`: mensagem e CTA de saída
- `error`: mensagem acionável + retry/fallback
- `success`: confirmação e próximo passo

### 4. Formulários e validação
- forms com feedback de erro por campo
- foco automático no primeiro erro
- mensagens de erro compreensíveis
- sem depender apenas de cor para estado inválido
- validação alinhada com schemas backend (sem duplicar regra inconsistente)

### 5. Acessibilidade e responsividade
Em cada entrega:
- navegação por teclado
- foco visível
- semântica HTML correta
- atributos ARIA quando necessário
- touch targets >= 44x44
- layout mobile-first 320px+

### 6. Integração com backend
- consumir apenas contratos definidos
- tratar erros esperados de API/action
- não assumir campos não documentados
- evitar lógica de autorização no frontend como única proteção

### 7. Testes mínimos por milestone
Para cada slice:
- teste de componente/comportamento principal
- teste de estado de erro
- teste de estado loading ou empty
- teste de interação crítica

### 8. Documentação e handoff
Atualizar seção **Frontend** em `docs/07_IMPLEMENTATION.md`:

```markdown
## Frontend

### Milestones implementados
### Decisões e motivos
### Desvios da SPEC (com justificativa)
### Como rodar localmente
### Contratos consumidos
| Fluxo | Endpoint/Action | Tipo de resposta | Estados UX implementados | Observações |

### Como testar
- cenário feliz
- loading
- empty
- erro de validação/API
```

---

## Restrições fixas
- Seguir `docs/06_SPECIFICATION.md` como contrato de implementação
- Sem features fora da SPEC
- Sem `any`, `ts-ignore` ou tipagem frouxa
- Sem lógica crítica de negócio escondida em componente sem teste
- Sem estado de erro/loading/empty ausente em fluxo crítico
- Sem componente monolítico quando houver split previsto
- Sem quebrar tokens e padrões de `docs/05_DESIGN.md` sem justificar

---

## Checklist antes de encerrar
- [ ] `docs/06_SPECIFICATION.md` lido e milestone declarado
- [ ] `docs/05_DESIGN.md` lido
- [ ] contratos backend mapeados
- [ ] diagnóstico aprovado pelo usuário
- [ ] pages/layouts criados conforme SPEC
- [ ] componentes com estados loading/empty/error/success
- [ ] formulários com feedback acionável e foco no erro
- [ ] acessibilidade mínima validada (teclado, foco, semântica, ARIA)
- [ ] responsividade validada nos breakpoints principais
- [ ] testes mínimos por slice escritos e verdes
- [ ] `docs/07_IMPLEMENTATION.md` atualizado
- [ ] `docs/DOCS_INDEX.md` atualizado

---

## Critério de sucesso
A implementação frontend só termina quando:
- o milestone da SPEC está funcional de ponta a ponta
- os estados UX obrigatórios estão implementados
- os contratos backend estão consumidos sem ambiguidade
- a interface permanece consistente com o design system aprovado
- os testes mínimos do slice estão verdes

---

## Próximo passo
`/test-writer` para ampliar cobertura automatizada.
