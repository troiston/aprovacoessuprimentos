---
id: skill-build-announcement-bar
title: "Announcement bar"
agent: 03-builder
version: 1.0
category: components
priority: standard
requires:
  - skill: skill-build-design-tokens
  - rule: quality/accessibility
provides:
  - Barra dismissível, foco e anúncio para screen readers
used_by:
  - agent: 03-builder
  - command: new-component
---

# Announcement bar

## A11y

- `role="region"` + `aria-label`; botão fechar com nome acessível.
- Não roubar foco ao abrir; respeitar `prefers-reduced-motion`.

## Persistência

- `localStorage` para dismissed (documentar privacidade se ligado a ID).
