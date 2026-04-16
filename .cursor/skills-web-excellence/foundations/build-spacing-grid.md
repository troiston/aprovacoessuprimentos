---
id: skill-build-spacing-grid
title: "Build Spacing Grid"
agent: 02-designer
version: 1.0
category: foundations
priority: important
requires:
  - skill: skill-build-design-tokens
provides:
  - sistema de grid e escala de espaçamento
used_by:
  - agent: 02-designer
---

# Build Spacing & Grid System

Sistema de espaçamento baseado em unidade de 4px e grid responsivo de 12 colunas.

## Escala de Espaçamento — Base 4px

Toda medida de espaçamento é múltiplo de 4px (0.25rem). Isso garante alinhamento consistente em qualquer combinação.

```css
@theme {
  /* Spacing Scale — 4px base */
  --spacing-0:    0;
  --spacing-px:   1px;
  --spacing-0.5:  0.125rem;  /* 2px  */
  --spacing-1:    0.25rem;   /* 4px  */
  --spacing-1.5:  0.375rem;  /* 6px  */
  --spacing-2:    0.5rem;    /* 8px  */
  --spacing-3:    0.75rem;   /* 12px */
  --spacing-4:    1rem;      /* 16px */
  --spacing-5:    1.25rem;   /* 20px */
  --spacing-6:    1.5rem;    /* 24px */
  --spacing-8:    2rem;      /* 32px */
  --spacing-10:   2.5rem;    /* 40px */
  --spacing-12:   3rem;      /* 48px */
  --spacing-16:   4rem;      /* 64px */
  --spacing-20:   5rem;      /* 80px */
  --spacing-24:   6rem;      /* 96px */
  --spacing-32:   8rem;      /* 128px */
}
```

## Container Max-Widths

```css
@theme {
  --container-sm:  640px;
  --container-md:  768px;
  --container-lg:  1024px;
  --container-xl:  1280px;
  --container-2xl: 1536px;
}
```

Componente container com padding fluido:

```tsx
// src/components/ui/container.tsx
import { cn } from '@/lib/utils'
import { type ComponentPropsWithoutRef } from 'react'

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const sizes: Record<ContainerSize, string> = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
}

interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  size?: ContainerSize
}

export function Container({ size = 'xl', className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

## Grid System — 12 → 8 → 4 Colunas

| Breakpoint | Colunas | Gap | Uso |
|------------|---------|-----|-----|
| < 640px    | 4       | 16px | Mobile |
| 640–1023px | 8       | 20px | Tablet |
| ≥ 1024px   | 12      | 24px | Desktop |

```tsx
// src/components/ui/grid.tsx
import { cn } from '@/lib/utils'
import { type ComponentPropsWithoutRef } from 'react'

interface GridProps extends ComponentPropsWithoutRef<'div'> {
  cols?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
}

export function Grid({
  cols = { mobile: 4, tablet: 8, desktop: 12 },
  className,
  children,
  ...props
}: GridProps) {
  return (
    <div
      className={cn(
        'grid gap-4 sm:gap-5 lg:gap-6',
        `grid-cols-${cols.mobile}`,
        `sm:grid-cols-${cols.tablet}`,
        `lg:grid-cols-${cols.desktop}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

Para colunas arbitrárias, use classes utilitárias:

```tsx
<div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
  <div className="col-span-4 lg:col-span-6">{/* metade */}</div>
  <div className="col-span-4 lg:col-span-6">{/* metade */}</div>
</div>
```

## Gap Fluido

```css
@theme {
  --gap-grid: clamp(1rem, 0.5rem + 1.5vw, 1.5rem);
}
```

Uso: `gap-[var(--gap-grid)]` ou no componente Grid.

## Section Padding — Fluido Vertical

Seções de página usam padding vertical fluido:

```css
@theme {
  --section-py-sm: clamp(2rem, 1rem + 3vw, 3rem);
  --section-py-md: clamp(3rem, 1.5rem + 5vw, 5rem);
  --section-py-lg: clamp(4rem, 2rem + 7vw, 7rem);
}
```

```tsx
// src/components/ui/section.tsx
import { cn } from '@/lib/utils'
import { type ComponentPropsWithoutRef } from 'react'

type SectionSpacing = 'sm' | 'md' | 'lg'

const spacingMap: Record<SectionSpacing, string> = {
  sm: 'py-[var(--section-py-sm)]',
  md: 'py-[var(--section-py-md)]',
  lg: 'py-[var(--section-py-lg)]',
}

interface SectionProps extends ComponentPropsWithoutRef<'section'> {
  spacing?: SectionSpacing
}

export function Section({ spacing = 'md', className, children, ...props }: SectionProps) {
  return (
    <section className={cn(spacingMap[spacing], className)} {...props}>
      {children}
    </section>
  )
}
```

## Bento Grid — CSS Grid Avançado

Setup para layouts bento (tiles de tamanhos variados):

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: 90px;
  gap: 1rem;
  grid-auto-flow: dense;
}

@media (max-width: 1023px) {
  .bento-grid {
    grid-template-columns: repeat(8, 1fr);
    grid-auto-rows: 80px;
  }
}

@media (max-width: 639px) {
  .bento-grid {
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 70px;
  }
}
```

Classes utilitárias de tile:

```css
.tile-2x2 { grid-column: span 2; grid-row: span 2; }
.tile-3x2 { grid-column: span 3; grid-row: span 2; }
.tile-4x2 { grid-column: span 4; grid-row: span 2; }
.tile-4x3 { grid-column: span 4; grid-row: span 3; }
.tile-6x2 { grid-column: span 6; grid-row: span 2; }
.tile-6x3 { grid-column: span 6; grid-row: span 3; }
.tile-6x4 { grid-column: span 6; grid-row: span 4; }

@media (max-width: 639px) {
  .tile-3x2, .tile-4x2, .tile-4x3,
  .tile-6x2, .tile-6x3, .tile-6x4 {
    grid-column: span 4;
    grid-row: span 2;
  }
}
```

## Padrões de Espaçamento por Componente

| Componente | Padding interno | Gap entre itens | Margem externa |
|-----------|----------------|-----------------|----------------|
| Card      | spacing-6 (24px) | spacing-4 (16px) | — |
| Form      | spacing-6 | spacing-5 (20px) entre campos | spacing-8 do conteúdo |
| List item | spacing-4 vertical, spacing-3 horizontal | spacing-2 (8px) | — |
| Nav links | spacing-2 vertical, spacing-3 horizontal | spacing-1 (4px) | — |
| Section   | py fluido | spacing-8–spacing-16 entre blocos | — |
| Modal     | spacing-6 | spacing-5 | — |

## Regras

1. **Sempre** use valores da escala de 4px — nunca valores quebrados como 13px ou 22px
2. Espaçamento interno (padding) ≥ espaçamento externo (gap) em cards
3. Seções usam padding vertical fluido com `clamp()`
4. Container sempre tem `px-4 sm:px-6 lg:px-8`
5. Grid 12 colunas no desktop, 8 tablet, 4 mobile
6. `grid-auto-flow: dense` no bento grid para preenchimento ótimo

## Validação

- [ ] Todos os espaçamentos são múltiplos de 4px
- [ ] Container tem padding horizontal responsivo
- [ ] Grid colapsa corretamente: 12 → 8 → 4
- [ ] Section padding é fluido (clamp)
- [ ] Bento tiles se adaptam em mobile (span 4)
- [ ] Nenhum margin/padding com valor magic number
