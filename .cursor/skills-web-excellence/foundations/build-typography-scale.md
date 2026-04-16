---
id: skill-build-typography-scale
title: "Build Typography Scale"
agent: 02-designer
version: 1.0
category: foundations
priority: critical
requires:
  - skill: skill-build-design-tokens
  - rule: design/typography
provides:
  - escala tipográfica fluida
used_by:
  - agent: 02-designer
---

# Build Typography Scale

Escala tipográfica fluida usando `clamp()` com ratio Major Third (1.25). Sem media queries para font-size — tudo fluido entre 320px e 1280px viewport.

## Fórmula clamp()

```
clamp(min, preferred, max)
preferred = min + (max - min) * ((100vw - 320px) / (1280px - 320px))
simplificado: min + (max - min) * (100vw - 20rem) / 60rem
```

Para cada nível, `min` é o tamanho em 320px e `max` é o tamanho em 1280px.

## Escala Completa — 10 Níveis

| Nível | Min (px) | Max (px) | Ratio | Uso |
|-------|----------|----------|-------|-----|
| xs    | 12       | 12       | 0.75  | captions, labels tiny |
| sm    | 13       | 14       | 0.875 | captions, metadata |
| base  | 16       | 16       | 1.0   | corpo de texto |
| lg    | 18       | 20       | 1.25  | lead paragraphs |
| xl    | 20       | 25       | 1.25² | H5, subtítulos |
| 2xl   | 24       | 31       | 1.25³ | H4 |
| 3xl   | 28       | 39       | 1.25⁴ | H3 |
| 4xl   | 33       | 49       | 1.25⁵ | H2 |
| 5xl   | 39       | 61       | 1.25⁶ | H1 hero |
| 6xl   | 46       | 76       | 1.25⁷ | Display, hero destaque |

## Tokens @theme

Adicione ao `globals.css` dentro do bloco `@theme`:

```css
@theme {
  /* Typography Scale — Fluid com clamp() */
  --text-xs:   0.75rem;
  --text-sm:   clamp(0.8125rem, 0.79rem + 0.10vw, 0.875rem);
  --text-base: 1rem;
  --text-lg:   clamp(1.125rem, 1.08rem + 0.21vw, 1.25rem);
  --text-xl:   clamp(1.25rem, 1.14rem + 0.52vw, 1.5625rem);
  --text-2xl:  clamp(1.5rem, 1.32rem + 0.83vw, 1.9375rem);
  --text-3xl:  clamp(1.75rem, 1.46rem + 1.35vw, 2.4375rem);
  --text-4xl:  clamp(2.0625rem, 1.62rem + 2.08vw, 3.0625rem);
  --text-5xl:  clamp(2.4375rem, 1.85rem + 2.76vw, 3.8125rem);
  --text-6xl:  clamp(2.875rem, 2.08rem + 3.75vw, 4.75rem);

  /* Line Heights */
  --leading-none:    1;
  --leading-tight:   1.15;
  --leading-snug:    1.3;
  --leading-normal:  1.5;
  --leading-relaxed: 1.625;
  --leading-loose:   1.8;

  /* Letter Spacing */
  --tracking-tighter: -0.03em;
  --tracking-tight:   -0.02em;
  --tracking-normal:  0em;
  --tracking-wide:    0.02em;
  --tracking-wider:   0.04em;

  /* Font Weights */
  --font-normal:    400;
  --font-medium:    500;
  --font-semibold:  600;
  --font-bold:      700;
  --font-extrabold: 800;
}
```

## Mapeamento por Contexto

| Elemento     | Size     | Weight       | Leading  | Tracking    |
|-------------|----------|-------------|----------|-------------|
| Display     | 6xl      | extrabold   | none     | tighter     |
| H1 (hero)   | 5xl      | extrabold   | tight    | tighter     |
| H2          | 4xl      | bold        | tight    | tight       |
| H3          | 3xl      | bold        | snug     | tight       |
| H4          | 2xl      | semibold    | snug     | normal      |
| H5          | xl       | semibold    | snug     | normal      |
| H6          | lg       | semibold    | normal   | normal      |
| Body        | base     | normal      | normal   | normal      |
| Body small  | sm       | normal      | normal   | normal      |
| Caption     | xs       | medium      | normal   | wide        |

## Font Loading — next/font

```tsx
// src/app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
```

Registre as fontes no `@theme`:

```css
@theme {
  --font-sans: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-mono), ui-monospace, monospace;
}
```

## Fallback Font com size-adjust (CLS Prevention)

Se usar fonte local ou custom, defina fallback com métricas ajustadas:

```css
@font-face {
  font-family: 'Inter Fallback';
  src: local('Arial');
  size-adjust: 107%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}
```

Isso elimina layout shift (CLS) durante o carregamento da fonte. O `next/font` já faz isso automaticamente — prefira usá-lo.

## Componente Heading Tipado

```tsx
// src/components/ui/heading.tsx
import { type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

const headingStyles: Record<HeadingLevel, string> = {
  h1: 'text-5xl font-extrabold leading-tight tracking-tighter',
  h2: 'text-4xl font-bold leading-tight tracking-tight',
  h3: 'text-3xl font-bold leading-snug tracking-tight',
  h4: 'text-2xl font-semibold leading-snug',
  h5: 'text-xl font-semibold leading-snug',
  h6: 'text-lg font-semibold leading-normal',
}

interface HeadingProps extends ComponentPropsWithoutRef<'h1'> {
  as?: HeadingLevel
}

export function Heading({ as: Tag = 'h2', className, children, ...props }: HeadingProps) {
  return (
    <Tag
      className={cn(
        headingStyles[Tag],
        'text-on-surface',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
```

## Regras

1. **Nunca** defina font-size com valor fixo em componentes — use tokens da escala
2. **Sempre** use `clamp()` para tamanhos acima de `base`
3. Display e H1 usam tracking negativo para densidade visual
4. Body text nunca abaixo de 16px (acessibilidade)
5. Line-height para headings: 1.1–1.3. Para body: 1.5–1.6
6. Máximo 2 famílias tipográficas (sans + mono)
7. Prefira `next/font` — evita FOUT e reduz CLS automaticamente

## Validação

- [ ] Todos os tamanhos usam tokens, nunca valores manuais
- [ ] `clamp()` aplicado em todos os níveis `lg` e acima
- [ ] Heading hierarchy é sequencial (h1 > h2 > h3, sem pular)
- [ ] Font loading usa `display: swap` ou `display: optional`
- [ ] Body text mínimo 16px em qualquer viewport
- [ ] Contraste tipográfico: peso + tamanho suficientes para hierarquia visual clara
