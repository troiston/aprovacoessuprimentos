---
id: skill-build-brand-voice-microcopy
title: "Voz de marca e microcopy"
agent: 05-asset-creator
version: 1.0
category: ai-assets
priority: standard
requires:
  - skill: skill-gen-copy-headline
provides:
  - Tom por persona, padrões de botão e erro
used_by:
  - agent: 05-asset-creator
  - command: gen-copy
---

# Brand voice

## Definir

- 3 adjetivos de marca; 3 palavras banidas; tratamento (tu/você).
- Personas: tom secundário permitido por segmento.

## Microcopy

- Botões: verbo + resultado ("Criar conta grátis" > "Submeter").
- Erros: o que aconteceu + próximo passo; sem culpar o utilizador.

## Ligação

- Usar antes de `skill-gen-copy-headline` e `skill-gen-copy-description` para consistência.
