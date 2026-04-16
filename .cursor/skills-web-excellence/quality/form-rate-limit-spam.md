---
id: skill-form-rate-limit-spam
title: "Rate limit e anti-spam em formulários"
agent: 03-builder
version: 1.0
category: quality
priority: important
requires:
  - skill: skill-audit-security
  - rule: quality/security
provides:
  - Padrões honeypot, tempo mínimo, limit por IP
used_by:
  - agent: 03-builder
  - command: new-component
---

# Anti-spam

## Técnicas

- Honeypot field oculto (CSS + aria-hidden); rejeitar se preenchido.
- Timestamp mínimo entre render e submit (server-side).
- Rate limit: edge middleware ou server action com store (KV/Redis) quando existir infra.

## A11y

- Honeypot não deve ser focável por teclado.
