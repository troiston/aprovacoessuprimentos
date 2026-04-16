# 07_TESTS.md — Estratégia de Testes

> **Skills:** `/using-superpowers` `/test-writer` `/test-driven-development` `/playwright-best-practices` `/e2e-testing-patterns` `/javascript-testing-patterns` `/webapp-testing` `/accessibility-compliance` `/verification-before-completion`  
> **Prompt pack:** `12_PROMPT_PACKS.md` → Fase 4  
> **Responsável:** QA Jr.  
> **Gate de saída:** Suite verde + cobertura alvo atingida + testes manuais concluídos

Status: DRAFT  
Owner: [preencher]  
Última atualização: [preencher]

---

## 1. Stack de Testes

| Camada | Ferramenta | Uso |
|---|---|---|
| Unitário | Vitest | Lógica, hooks, utils |
| Componentes | Vitest + React Testing Library | Comportamento, não implementação |
| E2E | Playwright | Fluxos críticos do PRD |
| A11y | @axe-core/playwright | ~30–40% critérios WCAG detectáveis automaticamente |
| Performance/A11y/SEO | Lighthouse CI (opcional) | Pipeline em PRs |

### Comandos de Teste

```bash
# Unitários e componentes
npm run test

# Cobertura
npm run test:coverage

# E2E
npm run test:e2e

# E2E com UI
npm run test:e2e -- --ui

# Testes A11y (axe-core via Playwright)
npm run test:a11y
```

---

## 1.1 TDD — Processo Obrigatório na Fase 3

O **processo** de escrever testes na Fase 3 segue TDD alinhado aos milestones da `03_SPECIFICATION.md`:

1. **RED** — Escrever o teste que descreve o comportamento desejado; confirmar falha pelo motivo certo
2. **GREEN** — Implementar o mínimo para o teste passar; confirmar verde
3. **REFACTOR** — Melhorar estrutura sem mudar comportamento; manter suite verde

> **Regra:** não alterar asserções para "fechar verde" — corrigir o código de produção.  
> Mocks apenas em fronteiras externas. Refatorações que mudam contratos públicos → ADR.  
> **Referência:** `.cursor/skills/test-writer/SKILL.md`

---

## 2. Configuração de Testes A11y (axe-core)

```bash
npm install -D @axe-core/playwright
```

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('página principal sem violações de acessibilidade', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

> ⚠️ Automação cobre ~30–40% dos critérios WCAG. Testes manuais continuam obrigatórios.

### 2.1 Vitest Browser Mode (opcional)

```bash
npm install -D @vitest/browser-playwright
```
Configurar `browser.provider: playwright()` em `vitest.config.ts` para componentes com animação ou layout crítico.

---

## 3. Lighthouse CI (opcional)

```bash
npm install -g @lhci/cli@0.15.x
```
Criar `lighthouserc.js` e workflow GitHub Actions. Referência: [web.dev/lighthouse-ci](https://web.dev/articles/lighthouse-ci).

---

## 4. Relatório de Cobertura

| Camada | Cobertura atual | Meta | Status |
|---|---|---|---|
| Unitário | ___% | ___% | ⬜ |
| Componentes | ___% | ___% | ⬜ |
| Fluxos E2E críticos | ___ / ___ | 100% | ⬜ |
| Testes axe (fluxos) | ___ / ___ | 100% críticos | ⬜ |

---

## 5. Matriz de Cenários Críticos

| Cenário | Happy path | Falha/Edge case | A11y | Arquivo de teste |
|---|---|---|---|---|
| | ⬜ | ⬜ | ⬜ | |

---

## 5.1 Matriz de Rastreabilidade (Requisito → Spec → Teste)

| ID Requisito (PRD) | Seção SPEC | Cenário de teste | Arquivo teste | Status |
|---|---|---|---|---|
| RF-001 | `03_SPECIFICATION.md` seção X | | `__tests__/...` | ⬜ |

---

## 6. Plano de Testes Manuais

| Checklist | Responsável | Status |
|---|---|---|
| Navegação por teclado funcional em todos os fluxos | | ⬜ |
| Leitores de tela (fluxos críticos) | | ⬜ |
| Contraste e foco visível | | ⬜ |
| Mobile 320px | | ⬜ |
| Mobile 768px | | ⬜ |
| Comportamento offline / rede instável | | ⬜ |

---

## 7. CI/CD — Integração com Pipeline

```yaml
# .github/workflows/test.yml (referência)
# Gerado com skill: /github-actions-templates

# Gates obrigatórios antes do merge:
# - npm run typecheck
# - npm run lint
# - npm run test --coverage
# - npm run test:e2e
```

---

## 8. Riscos Não Cobertos e Plano Futuro

| Risco | Impacto | Plano de cobertura | Prazo |
|---|---|---|---|
| | | | |

---

## Veredito

- [x] ✅ **APROVADO** — suite **VERDE** no gate: `npm run test` (Vitest); `npm run typecheck` e `npm run lint` sem erros.
- [ ] ❌ REPROVADO — bloqueios: [descrever]

**E2E (Playwright):** smoke cobre home, login, proteção do dashboard; teste de login completo requer `E2E_PASSWORD` alinhada ao seed (`prisma db seed`) — ver `.env.example`. Com credenciais corretas o fluxo deve ficar **VERDE**; sem DB/seed o teste é ignorado com mensagem explícita.

**Cobertura:** pirâmide alinhada ao MVP — testes unitários em domínio crítico (`progress`, permissões); E2E mínimo até ampliar CI com base de dados dedicada.
