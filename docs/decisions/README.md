# Architecture Decision Records (ADR)

> Decisões arquiteturais são documentadas aqui usando o template [MADR](https://adr.github.io/madr/).  
> **Skills:** `/using-superpowers` `/architecture-decision-records` `/architecture-patterns`  
> **Responsável por criar ADRs:** Tech Lead  
> **Quando criar:** toda decisão técnica com trade-offs relevantes ou impacto em segurança/UX

---

## Quando criar um ADR

Crie um ADR sempre que a decisão:
- Envolver escolha de stack, biblioteca ou serviço externo
- Definir um padrão arquitetural que o time deverá seguir
- Mudar fronteiras de módulo ou contratos públicos
- Ter impacto em segurança, compliance ou UX
- For questionada ou precisar ser rastreada no futuro

Decisões simples (ex: nome de variável, ordem de imports) **não** precisam de ADR.

---

## Como usar

1. Copie `template-madr.md` para um novo arquivo: `NNNN-titulo-com-hifens.md`  
   Ex: `0001-escolha-stack-nextjs.md`
2. Preencha todas as seções obrigatórias
3. Atualize o índice abaixo ao adicionar a decisão
4. Referencie o ADR no documento de fase correspondente:
   - Decisão de arquitetura → `03_SPECIFICATION.md` seção 12
   - Decisão executada → `05_IMPLEMENTATION.md` seção ADRs

---

## Índice

| ID | Título | Fase | Status | Data | Autor |
|---|---|---|---|---|---|
| - | - | - | - | - | - |

---

## Status possíveis

| Status | Significado |
|---|---|
| `proposed` | Proposta aberta para discussão |
| `accepted` | Decisão aceita e em vigor |
| `deprecated` | Decisão superada, mas não substituída |
| `superseded by ADR-XXXX` | Substituída por uma nova decisão |

---

## Referência

- [MADR](https://adr.github.io/madr/) — Markdown Architectural Decision Records
- [npm madr](https://www.npmjs.com/package/madr) — `npm install madr`
- [`S03_SKILLS_INDEX.md`](../S03_SKILLS_INDEX.md) — skills de arquitetura: `/architecture-decision-records` `/architecture-patterns`
