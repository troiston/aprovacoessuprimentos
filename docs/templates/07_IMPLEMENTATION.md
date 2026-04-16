# 05_IMPLEMENTATION.md — Implementação

> **Skills Backend:** `/using-superpowers` `/implement-backend` `/auth-implementation-patterns` `/supabase-postgres-best-practices` `/test-driven-development` `/secrets-management`  
> **Skills Frontend:** `/using-superpowers` `/implement-frontend` `/react-state-management` `/tailwind-design-system` `/accessibility-compliance` `/test-driven-development`  
> **Prompt pack:** `12_PROMPT_PACKS.md` → Fase 3B e 3F  
> **Responsável:** Tech Lead (backend) · Designer (frontend)  
> **Depende de:** `03_SPECIFICATION.md` (completo, sem TODOs abertos)  
> **Gate de saída:** Typecheck/lint/test verdes; todos os estados de UI implementados

Status: DRAFT  
Data: [preencher]  
Autores: [Tech Lead] · [Designer]

---

## Backend

### 1. Decisões Técnicas

| Decisão | Alternativa descartada | Justificativa | ADR |
|---|---|---|---|
| | | | ADR-001 |

### 2. Comandos

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Typecheck
npm run typecheck

# Lint
npm run lint

# Testes
npm run test
npm run test:e2e

# Migração de banco
npm run db:migrate
```

### 3. Variáveis de Ambiente

> Nunca commitar valores reais. Usar `.env.example` como referência.

| Variável | Obrigatória | Descrição |
|---|---|---|
| | ☑ | |

### 4. Contratos Implementados

| Endpoint | Método | Status | Testes |
|---|---|---|---|
| | | ✅/⬜ | ✅/⬜ |

### 5. Checklist Backend

- [ ] Validação de input com Zod em todas as entradas
- [ ] Autorização por ownership (IDOR prevention)
- [ ] Idempotência em operações críticas
- [ ] Logs sem PII + eventos de auditoria
- [ ] Typecheck verde
- [ ] Lint verde
- [ ] Testes unitários verdes
- [ ] `/secrets-management` executado antes do commit

---

## Frontend

### 1. Decisões de Componentes

| Componente | Decisão | Justificativa |
|---|---|---|
| | | |

### 2. Páginas Implementadas

| Página | Estados | A11y | Testes | Status |
|---|---|---|---|---|
| | loading/empty/error/success | ⬜ | ⬜ | ⬜ |

### 3. Checklist Frontend

- [ ] Todos os estados implementados (loading/empty/error/success)
- [ ] Navegação por teclado funcional
- [ ] Focus visível em todos os interativos
- [ ] Labels em todos os inputs
- [ ] Confirmação em ações destrutivas
- [ ] Consistência visual com styleguide (`/app/styleguide`)
- [ ] Sem dead-end (toda tela tem saída clara)
- [ ] Typecheck verde
- [ ] Lint verde
- [ ] Testes de componente verdes

---

## Decisões de Arquitetura (ADRs)

| ADR | Decisão | Data | Status |
|---|---|---|---|
| ADR-001 | | | Aceito |

---

## Pendências

| # | Descrição | Owner | Prazo | Bloqueio |
|---|---|---|---|---|
| | | | | |

---

## Impacto em Segurança e UX
> Preencher mesmo quando "sem impacto" — obrigatório pelo processo.

- Segurança:
- UX:
