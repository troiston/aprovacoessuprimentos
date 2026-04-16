---
id: skill-build-legal-pages
title: "Legal Pages (Privacidade, Termos)"
agent: 03-builder
version: 1.0
category: components
priority: important
requires:
  - skill: skill-build-cta
  - rule: quality/security
provides:
  - Rotas legais com leitura clara e last_updated
used_by:
  - agent: 03-builder
  - command: new-page
---

# Legal Pages

## Estrutura

- `/privacidade`, `/termos` (ou `/legal/privacy`): tipografia legível, índice âncora, data de revisão.
- Evitar trackers até consent; formulários mínimos.
- LGPD/GDPR: bases legais, contacto DPO quando aplicável — conteúdo jurídico validado por humano.

## SEO

- `noindex` opcional para drafts; produção com metadata honesta.
