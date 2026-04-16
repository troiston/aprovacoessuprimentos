---
id: skill-build-waitlist-flow
title: "Waitlist e lead capture"
agent: 03-builder
version: 1.0
category: components
priority: standard
requires:
  - skill: skill-build-form
  - rule: quality/security
provides:
  - Fluxo waitlist com estados sucesso/erro e anti-spam básico
used_by:
  - agent: 03-builder
  - command: new-page
---

# Waitlist

## UX

- Uma ação primária; confirmação clara (e-mail double opt-in se necessário).
- Mensagens de erro específicas; loading acessível.

## Segurança

- Rate limit no server action / route handler; validação Zod.
