---
id: doc-spacing-grid
title: Sistema de Espaçamento e Grid
version: 2.0
last_updated: 2026-04-07
category: foundations
priority: critical
related:
  - docs/web-excellence/foundations/01_DESIGN_SYSTEM.md
  - docs/web-excellence/ux-ui/05_RESPONSIVE_STRATEGY.md
  - .cursor/rules/design/responsive.mdc
  - .cursor/rules/stack/tailwind.mdc
---

# Sistema de Espaçamento e Grid

## 1. Unidade Base: 4px

Todo espaçamento no sistema é múltiplo de 4px (0.25rem). Essa base garante:

- Alinhamento consistente em todos os breakpoints
- Compatibilidade com grids de 8px (subconjunto)
- Precisão em telas de alta densidade (2x, 3x)
- Snap visual previsível

### Escala de Espaçamento

| Token       | Valor   | px   | Uso Primário                                  |
|-------------|---------|------|-----------------------------------------------|
| `--space-0` | 0       | 0    | Reset                                         |
| `--space-px`| 1px     | 1    | Bordas, separadores de 1px                    |
| `--space-0.5`| 0.125rem| 2   | Micro ajuste (raro)                            |
| `--space-1` | 0.25rem | 4    | Gap mínimo ícone-texto, padding inline tight  |
| `--space-1.5`| 0.375rem| 6   | Padding de badges, tags                        |
| `--space-2` | 0.5rem  | 8    | Padding de inputs, gap horizontal pequeno     |
| `--space-3` | 0.75rem | 12   | Padding de botões, gap de form fields         |
| `--space-4` | 1rem    | 16   | Padding de cards, gap entre itens de lista    |
| `--space-5` | 1.25rem | 20   | Espaçamento médio                              |
| `--space-6` | 1.5rem  | 24   | Gap de grid de cards, padding de seções       |
| `--space-8` | 2rem    | 32   | Separação entre blocos de conteúdo            |
| `--space-10`| 2.5rem  | 40   | Padding vertical de seções mobile             |
| `--space-12`| 3rem    | 48   | Separação entre seções de conteúdo            |
| `--space-16`| 4rem    | 64   | Padding vertical de seções desktop            |
| `--space-20`| 5rem    | 80   | Espaço entre seções de página                 |
| `--space-24`| 6rem    | 96   | Padding de hero, separação macro              |
| `--space-32`| 8rem    | 128  | Espaço vertical macro entre blocos de página  |

### Aliases Semânticos

| Alias        | Valor         | Uso                                           |
|--------------|---------------|-----------------------------------------------|
| `--gap-xs`   | `--space-1`   | Gap mínimo, ícone-texto                       |
| `--gap-sm`   | `--space-2`   | Gap entre itens relacionados                  |
| `--gap-md`   | `--space-4`   | Gap padrão de grids                           |
| `--gap-lg`   | `--space-6`   | Gap entre cards, blocos                       |
| `--gap-xl`   | `--space-8`   | Gap entre seções de conteúdo                  |
| `--gap-2xl`  | `--space-12`  | Gap entre blocos de página                    |
| `--gap-3xl`  | `--space-16`  | Gap macro                                     |

## 2. Sistema de Grid

### Estrutura de Colunas Responsiva

| Breakpoint | Colunas | Gutter  | Margem   | Container Max  |
|------------|---------|---------|----------|----------------|
| < 640px    | 4       | 16px    | 16px     | 100%           |
| 640–767px  | 8       | 16px    | 24px     | 640px          |
| 768–1023px | 8       | 24px    | 32px     | 768px          |
| 1024–1279px| 12      | 24px    | 32px     | 1024px         |
| 1280–1535px| 12      | 24px    | 48px     | 1280px         |
| ≥ 1536px   | 12      | 32px    | auto     | 1440px         |

### Implementação CSS Grid

```css
.grid-layout {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  padding-inline: var(--space-4);
}

@media (min-width: 40rem) {
  .grid-layout {
    grid-template-columns: repeat(8, 1fr);
    gap: var(--space-4);
    padding-inline: var(--space-6);
  }
}

@media (min-width: 64rem) {
  .grid-layout {
    grid-template-columns: repeat(12, 1fr);
    gap: var(--space-6);
    padding-inline: var(--space-8);
  }
}
```

### Container Max-Widths

```css
@theme {
  --container-sm: 40rem;    /* 640px */
  --container-md: 48rem;    /* 768px */
  --container-lg: 64rem;    /* 1024px */
  --container-xl: 80rem;    /* 1280px */
  --container-2xl: 90rem;   /* 1440px */
  --container-prose: 65ch;  /* Texto corrido */
}
```

```tsx
<div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-8">
  {/* Container principal */}
</div>
```

## 3. Espaçamento Fluido com clamp()

Espaçamento que escala suavemente entre mobile e desktop:

```css
:root {
  /* Section padding: 40px no mobile → 96px no desktop */
  --section-padding-y: clamp(2.5rem, 1.667rem + 4.17vw, 6rem);

  /* Section gap: 48px → 128px */
  --section-gap: clamp(3rem, 1.333rem + 8.33vw, 8rem);

  /* Card padding: 16px → 32px */
  --card-padding: clamp(1rem, 0.667rem + 1.67vw, 2rem);

  /* Hero padding: 64px → 160px */
  --hero-padding-y: clamp(4rem, 2rem + 10vw, 10rem);

  /* Grid gap: 16px → 32px */
  --grid-gap: clamp(1rem, 0.667rem + 1.67vw, 2rem);
}
```

### Fórmula de Clamp para Espaçamento

```
clamp(min, preferred, max)

Para viewport 320px–1280px:
preferred = min + (max - min) × ((100vw - 20rem) / 60rem)

Simplificado:
preferred = min(rem) + ((max - min) / 60) × 100vw - ((max - min) / 60) × 20rem
```

## 4. Padrões de Bento Grid

Bento grids (popularizados pela Apple em 2023, dominantes em SaaS em 2026) usam cards de tamanhos variados em grid:

### Estrutura Base

```tsx
<div className="grid grid-cols-4 gap-4 lg:grid-cols-12 lg:gap-6">
  {/* Card grande — 2×2 no mobile, 8×6 no desktop */}
  <div className="col-span-4 row-span-2 lg:col-span-8 lg:row-span-2">
    <BentoCard size="large" />
  </div>

  {/* Card médio — 2×1 no mobile, 4×3 no desktop */}
  <div className="col-span-2 lg:col-span-4 lg:row-span-1">
    <BentoCard size="medium" />
  </div>

  {/* Card pequeno — 2×1 no mobile, 4×1 no desktop */}
  <div className="col-span-2 lg:col-span-4 lg:row-span-1">
    <BentoCard size="small" />
  </div>

  {/* Card largo — full no mobile, 12×2 no desktop */}
  <div className="col-span-4 lg:col-span-12 lg:row-span-1">
    <BentoCard size="wide" />
  </div>
</div>
```

### Proporções de Bento Card

| Tamanho   | Colunas (lg) | Rows  | Aspect Ratio | Conteúdo Típico              |
|-----------|-------------|-------|--------------|-------------------------------|
| Small     | 4           | 1     | ~2:1         | Métrica, stat, ícone          |
| Medium    | 4           | 2     | ~1:1         | Feature highlight, gráfico    |
| Large     | 8           | 2     | ~2:1         | Hero feature, demo            |
| Wide      | 12          | 1     | ~4:1         | Banner, CTA, testimonial      |
| Tall      | 4           | 3     | ~2:3         | Lista, timeline, sidebar      |

### Regras de Composição

1. **Variar tamanhos** — Nunca ter todos os cards iguais
2. **Card hero** — O card maior comunica a feature principal
3. **Ritmo visual** — Alternar entre grande e pequeno cria dinamismo
4. **Gap uniforme** — Mesmo gap entre todos os cards
5. **Alinhamento de baseline** — Cards na mesma row devem ter alturas iguais (use `row-span`)
6. **Mobile:** Stack vertical de cards full-width ou 2 colunas

## 5. Convenções de Padding de Seções

### Padding Vertical por Tipo de Seção

| Seção                   | Mobile           | Desktop          | Fluido                                         |
|-------------------------|------------------|------------------|-------------------------------------------------|
| Hero                    | 64px (4rem)      | 160px (10rem)    | `clamp(4rem, 2rem + 10vw, 10rem)`              |
| Feature Section         | 48px (3rem)      | 96px (6rem)      | `clamp(3rem, 1.667rem + 4.17vw, 6rem)`         |
| CTA Section             | 40px (2.5rem)    | 80px (5rem)      | `clamp(2.5rem, 1.667rem + 4.17vw, 5rem)`       |
| Footer                  | 48px (3rem)      | 64px (4rem)      | `clamp(3rem, 2.667rem + 1.67vw, 4rem)`         |
| Content (blog, docs)    | 32px (2rem)      | 48px (3rem)      | `clamp(2rem, 1.667rem + 1.67vw, 3rem)`         |

### Padding Horizontal (Container)

```css
.container {
  width: 100%;
  margin-inline: auto;
  padding-inline: var(--space-4); /* 16px */
}

@media (min-width: 40rem) {
  .container { padding-inline: var(--space-6); } /* 24px */
}

@media (min-width: 64rem) {
  .container { padding-inline: var(--space-8); } /* 32px */
}

@media (min-width: 96rem) {
  .container { max-width: 90rem; } /* 1440px cap */
}
```

## 6. Padrões de Espaçamento em Componentes

### Card

```css
.card {
  padding: var(--card-padding); /* clamp(1rem, ..., 2rem) */
  gap: var(--space-3);
  border-radius: var(--radius-lg);
}
.card-header { gap: var(--space-1); }
.card-footer { padding-top: var(--space-4); }
```

### Form

```css
.form { gap: var(--space-5); }
.form-field { gap: var(--space-1.5); }
.form-field label { margin-bottom: var(--space-1); }
.form-actions { gap: var(--space-3); margin-top: var(--space-6); }
```

### Lista / Stack

```css
.stack-xs { gap: var(--space-1); }   /* Itens compactos (tags, badges) */
.stack-sm { gap: var(--space-2); }   /* Itens de lista */
.stack-md { gap: var(--space-4); }   /* Cards de lista */
.stack-lg { gap: var(--space-6); }   /* Seções de conteúdo */
.stack-xl { gap: var(--space-8); }   /* Blocos de página */
```

### Navigation

```css
.nav { gap: var(--space-1); }
.nav-item { padding: var(--space-2) var(--space-3); }
.nav-section { gap: var(--space-6); }
```

## 7. Estratégias Responsivas de Gap

### Fluid Gap com Container Queries

```css
.card-grid {
  container-type: inline-size;
  display: grid;
  gap: var(--space-4);
}

@container (min-width: 40rem) {
  .card-grid { gap: var(--space-6); }
}

@container (min-width: 60rem) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
  }
}
```

### Gap Responsivo com Tailwind

```tsx
<div className="grid gap-4 sm:gap-5 lg:gap-6 xl:gap-8">
  {/* Grid responsivo */}
</div>
```

### Regra de Proporção de Gap

O gap deve ser proporcional ao tamanho dos itens:

| Tamanho do Item | Gap Recomendado | Ratio   |
|-----------------|-----------------|---------|
| < 100px         | 8-12px          | ~10%    |
| 100-300px       | 16-24px         | ~7%     |
| 300-600px       | 24-32px         | ~5%     |
| > 600px         | 32-48px         | ~5%     |
