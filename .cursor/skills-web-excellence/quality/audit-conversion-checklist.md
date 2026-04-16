---
id: skill-audit-conversion-checklist
title: "Checklist de conversão (CRO ético)"
agent: 06-qa-auditor
version: 1.0
category: quality
priority: important
requires:
  - skill: skill-build-form
provides:
  - Relatório de fricção e confiança na página
used_by:
  - agent: 06-qa-auditor
  - command: audit-conversion
---

# CRO ético

## Verificações

- Proposta de valor acima da dobra; CTA primário único por viewport.
- Formulários: labels, erros inline, política de dados visível.
- Prova social: verificável; evitar números inventados.
- Urgência: só se real; sem countdown falso.

## Documentação

- Ver `docs/conversion/01_CRO_HEURISTICS.md`.
