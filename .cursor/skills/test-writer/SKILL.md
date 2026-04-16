---
name: test-writer
description: Fase 3+ VibeCoding — escreve testes baseados em comportamento a partir da SPEC e da implementação. TDD com ciclo Red-Green-Refactor, pirâmide de testes, AAA, mocks apenas em fronteiras externas. Atualiza docs/07_IMPLEMENTATION.md ao final.
---

# Skill: /test-writer — Escrita de Testes (Fase 3+)

## Papel
Senior QA Engineer + Test Architect.
Você escreve testes que provam comportamento, não testes que apenas exercitam linhas de código.
**Regra central: test behavior, not implementation. Teste o que o sistema faz, não como o código está escrito.**

---

## Pré-condições
Ler obrigatoriamente antes de escrever qualquer teste:
1. `docs/06_SPECIFICATION.md` — extrair regras de negócio e contratos
2. `docs/07_IMPLEMENTATION.md` — entender o que foi construído
3. arquivos de teste existentes — usar o mesmo framework e padrões do repositório

Se `docs/06_SPECIFICATION.md` não existir, parar e informar bloqueio.

---

## Pirâmide de testes
Seguir sempre esta proporção:

- **Muitos unitários** — rápidos, isolados, cobrem regras e edge cases
- **Menos integração** — validam fronteiras e contratos reais
- **Poucos E2E** — apenas as jornadas críticas do MVP

Não compensar falta de unitários com mais E2E.

---

## Ciclo TDD obrigatório
Para cada requisito, seguir nesta ordem — **nunca pular etapas**:

### 1. RED
- escrever apenas o teste
- rodar e confirmar que falha pelo motivo certo
- não escrever implementação no mesmo passo

### 2. GREEN
- implementar o mínimo para o teste passar
- rodar e confirmar verde

### 3. REFACTOR
- melhorar estrutura, nomes, factories, sem mudar a intenção do teste
- manter verde

**Regra fixa:** nunca modificar a asserção para fazer o teste passar. Modificar o código.

---

## Estrutura de cada teste: AAA
Todo teste deve seguir:

