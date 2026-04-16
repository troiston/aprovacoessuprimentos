---
id: skill-build-story-section
title: "Secção narrativa (PAS / hero's journey)"
agent: 03-builder
version: 1.0
category: components
priority: important
requires:
  - skill: skill-build-cta
  - skill: skill-build-scroll-animation
provides:
  - Blocos problema → tensão → solução → prova → CTA
used_by:
  - agent: 03-builder
  - command: new-section
---

# Story section

## Estrutura

1. Problema (dor específica do ICP).
2. Agitação (custo de não agir).
3. Solução (produto como guia).
4. Prova (métricas, logos, quote).
5. CTA primário + secundário opcional.

## Implementação

- Server Components para copy estático; motion leve em reveals.
- Evitar walls of text; scanning com subheadings e listas.
