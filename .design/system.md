# .design/system.md — Persistência de Craft

> Ler este arquivo no início de qualquer sessão de design. Não reinventar decisões tomadas.

## Direção e feel

**Painel de controle operacional** — como um Bloomberg para incorporação imobiliária.
Denso, técnico, preciso. Dados na frente, sem decoração. Autoridade de ferramenta séria.

## Estratégia de profundidade

**Borders-only.** Nunca misturar com elevation SaaS.  
Sombra só em dropdown/modal para separação de camada.

## Unidade base de spacing

4px (`--spacing-px: 1px` base do Tailwind v4).

## Color world e signature

**Color world:** Blueprint blue (plantas de engenharia) + Cimento claro (off-white quente) + Terracota amazônica (solo de Manaus) + Verde aprovação (carimbo) + Vermelho prazo (caneta de correção).

**Signature:** Barra de progresso segmentada pelas 4 fases macro (Aquisição Terreno / Incorporação / Lançamento / CEF) com pesos visuais proporcionais. Componente `<Progress segments={...} />`. Aparece em todas as telas com empreendimentos.

## Tokens essenciais

```
primary:     oklch(32% 0.09 253)  # blueprint blue
accent:      oklch(55% 0.14 42)   # terracota amazônica
background:  oklch(97% 0.008 85)  # cimento claro
card:        oklch(99.5% 0.004 85)
border:      oklch(84% 0.010 85)
success:     oklch(40% 0.12 152)
destructive: oklch(52% 0.19 22)
```

## Fonte

IBM Plex Sans (corpo + UI) + IBM Plex Mono (números tabulares, porcentagens, pesos).

## Padrões de componente reutilizáveis

- Tabela: `py-2.5` nas células, cabeçalho `text-[11px] uppercase tracking-wide`
- Status pill: `inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px]` + classe semântica
- KPI card: ícone 8×8 em container rounded com bg token + número tabular 3xl bold
- Nav item: `rounded px-2.5 py-2` + `nav-item-active` quando ativo (border-left 2px primary)
- Prazo vencido: classe `deadline-overdue` + ícone `AlertCircle`
- Número de porcentagem: sempre `tabular` (font-mono, tabular-nums)

## Decisões de não-fazer

- Sem sombras decorativas em cards
- Sem gradientes roxo-azul genéricos
- Sem Inter/Roboto como fonte primária
- Sem dark mode como prioridade (tokens definidos, toggle é P2)
- Sem barra de progresso linear simples — sempre segmentada por fase onde contexto permitir

## Última sessão

Data: 15/04/2026  
Fase: 1D (Design System)  
Criado: globals.css, componentes base, 8 páginas, styleguide, docs/05_DESIGN.md
