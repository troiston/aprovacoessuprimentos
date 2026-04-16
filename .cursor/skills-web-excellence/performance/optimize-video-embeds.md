---
id: skill-optimize-video-embeds
title: "Otimizar vídeo e embeds"
agent: 03-builder
version: 1.0
category: performance
priority: important
requires:
  - skill: skill-optimize-images
  - rule: quality/performance
provides:
  - Embeds com poster, lazy, sem LCP regressivo
used_by:
  - agent: 03-builder
  - command: new-section
---

# Video embeds

## Padrões

- YouTube/Vimeo: thumbnail + `loading=lazy`, click-to-play ou facade (lite-youtube pattern).
- Vídeo hero: `poster`, `preload="metadata"`, formatos modernos, dimensões explícitas (evitar CLS).
- `prefers-reduced-motion`: oferecer imagem estática alternativa.

## LCP

- Nunca competir com imagem LCP principal; adiar iframe até interação quando possível.
