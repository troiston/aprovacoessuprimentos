---
id: skill-visual-regression-checklist
title: "Checklist QA visual"
agent: 06-qa-auditor
version: 1.0
category: quality
priority: standard
requires:
  - skill: skill-audit-a11y
provides:
  - Lista verificável pré-merge (hierarquia, ritmo, dark mode)
used_by:
  - agent: 06-qa-auditor
  - command: audit-full
---

# QA visual

## Desktop + mobile

- Hierarquia H1–H3 consistente; ritmo vertical (escala de espaçamento).
- Estados: hover, focus, active, disabled em todos os CTAs.
- Dark mode: contraste e borders sem desaparecer.

## Dados

- Imagens com ratio fixo; skeleton alinhado ao layout final (CLS).

## Opcional

- Playwright screenshots em 2 viewports; comparar com baseline no CI.
