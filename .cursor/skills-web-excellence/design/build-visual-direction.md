---
id: skill-build-visual-direction
title: "Direção visual e anti-genérico"
agent: 02-designer
version: 1.0
category: design
priority: important
requires:
  - skill: skill-build-design-tokens
  - rule: design/tokens
provides:
  - Brief visual: referências, restrições, assimetria controlada
used_by:
  - agent: 02-designer
  - command: init-tokens
---

# Direção visual

## Brief

- 3 referências (URLs ou moodboard); o que **não** fazer (anti-slop).
- Grid: proporção áurea vs simétrico; hero assimétrico permitido com hierarquia clara.

## Execução

- Tokens antes de componentes; uma família display + uma body; acento cromático limitado.
- Evitar clichês: gradientes genéricos, blobs sem contexto, glassmorphism sem marca.

## Motion

- Ver `design/motion.mdc`: só transform/opacity; reduced-motion.
