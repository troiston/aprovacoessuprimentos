---
id: skill-build-consent-analytics
title: "Consent Mode e Analytics"
agent: 06-qa-auditor
version: 1.0
category: quality
priority: important
requires:
  - skill: skill-write-meta-tags
  - rule: quality/security
provides:
  - Carregamento tardio de scripts de medição pós-consent
used_by:
  - agent: 06-qa-auditor
  - command: audit-full
---

# Consent e Analytics

## Princípios

- Scripts de terceiros **após** consent explícito (ou consent mode / denied default).
- `defer` / carregamento dinâmico; evitar bloquear parsing no `<head>`.
- Documentar categorias (necessário, analytics, marketing).

## Performance

- Medir impacto no INP e bundle; preferir tag managers leves ou first-party proxy quando possível.
