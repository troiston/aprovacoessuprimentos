---
id: skill-build-rtl-layout
title: "Layout RTL (árabe, hebraico)"
agent: 03-builder
version: 1.0
category: seo
priority: standard
requires:
  - skill: skill-build-i18n-routing
  - rule: design/responsive
provides:
  - dir=rtl, mirroring e tipografia compatível
used_by:
  - agent: 03-builder
  - command: new-page
---

# RTL

## HTML

- `dir="rtl"` no `html` ou wrapper por locale; `lang` correto.

## CSS

- Usar logical properties (`margin-inline`, `padding-inline`, `border-inline`).
- Rever ícones direcionais (setas, chevrons).

## Tipografia

- Font stacks que suportam script; line-height generoso se necessário.
