---
id: skill-optimize-fonts
title: "Optimize Fonts"
agent: 06-qa-auditor
version: 1.0
category: performance
priority: important
requires:
  - rule: 00-constitution
provides:
  - fontes otimizadas com zero CLS
  - subsetting automático via next/font
  - carregamento performático de tipografia
used_by:
  - agent: 06-qa-auditor
  - command: /audit-full
---

# Otimização de Fontes

## Regras Fundamentais

1. **Máximo 2 famílias** — uma para corpo, outra para headings (ou a mesma em weights diferentes)
2. **Fontes variáveis preferidas** — 1 arquivo substitui múltiplos weights (Regular, Medium, Bold = 3 requests → 1)
3. **Sempre via `next/font`** — garante self-hosting, subsetting automático, e zero CLS

## Setup com `next/font/google`

```typescript
// app/fonts.ts
import { Inter, JetBrains_Mono } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: [
    'system-ui',
    '-apple-system',
    'Segoe UI',
    'Roboto',
    'sans-serif',
  ],
})

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'optional',
  variable: '--font-mono',
  weight: ['400', '700'],
  fallback: ['Consolas', 'Monaco', 'Courier New', 'monospace'],
})
```

```tsx
// app/layout.tsx
import { inter, jetbrainsMono } from './fonts'

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

```css
/* app/globals.css — Tailwind v4 */
@theme {
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-mono), 'Courier New', monospace;
}
```

## `font-display` — Estratégia por Uso

| Uso | `display` | Razão |
|---|---|---|
| Corpo do texto (body) | `swap` | Texto visível imediatamente, troca quando carrega |
| Headings decorativos | `optional` | Se não carregar em ~100ms, usa fallback — sem flash |
| Fonte de ícones | `block` | Evitar ícones aparecendo como texto estranho |

```typescript
// Fonte de corpo — swap (sempre visível)
const bodyFont = Inter({
  subsets: ['latin'],
  display: 'swap',
})

// Fonte de heading decorativa — optional (sem flash)
const headingFont = Playfair_Display({
  subsets: ['latin'],
  display: 'optional',
  weight: ['700'],
})
```

## Subsetting — Economia de 97%

O `next/font` faz subsetting automático por `subsets`. A diferença é brutal:

```
Inter completa:     ~1.0 MB (todos os glifos, todos os scripts)
Inter latin only:   ~30 KB (97% de redução)
Inter latin-ext:    ~45 KB (inclui acentos, ç, ñ)
```

Para sites em português, `latin` basta (inclui acentos básicos). Use `latin-ext` se precisar de caracteres menos comuns.

```typescript
const inter = Inter({
  subsets: ['latin'], // pt-BR coberto
  // subsets: ['latin', 'latin-ext'], // se precisar de glifos raros
})
```

### Fonte Local com Subsetting Manual

```typescript
import localFont from 'next/font/local'

const customFont = localFont({
  src: [
    {
      path: './fonts/CustomFont-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/CustomFont-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-custom',
  fallback: ['system-ui', 'sans-serif'],
})
```

Para subsetting manual de fontes locais, use `pyftsubset`:

```bash
# Instalar fonttools
pip install fonttools brotli

# Subset para latin (glifos pt-BR)
pyftsubset CustomFont.ttf \
  --output-file=CustomFont-latin.woff2 \
  --flavor=woff2 \
  --layout-features='kern,liga,calt,ccmp,locl' \
  --unicodes='U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'
```

## Preload de Fontes Críticas

O `next/font` faz preload automaticamente. Mas se usar fontes fora do sistema:

```tsx
// app/layout.tsx — preload manual (raro, next/font já faz)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="preload"
          href="/fonts/CustomFont-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**Limite: preload em no máximo 1-2 fontes críticas.** Mais que isso satura a bandwidth inicial.

## Metric Override — Prevenção de CLS

Quando a fonte custom carrega e substitui o fallback, o tamanho das letras muda, causando CLS. As propriedades `size-adjust`, `ascent-override`, e `descent-override` alinham o fallback à fonte final:

```typescript
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: true, // default no next/font — gera overrides automáticos
})
```

O `next/font` calcula automaticamente os overrides. Para fontes locais, faça manualmente:

```css
/* Metric override manual para alinhar fallback ao custom font */
@font-face {
  font-family: 'CustomFont Fallback';
  src: local('Arial');
  size-adjust: 105.2%;
  ascent-override: 96%;
  descent-override: 24%;
  line-gap-override: 0%;
}
```

### Ferramenta para Calcular Overrides

Use [Fallback Font Generator](https://screenspan.net/fallback) ou calcule via script:

```typescript
// scripts/calculate-font-metrics.ts
// Gera os valores de override comparando custom font com fallback
// Execute: npx tsx scripts/calculate-font-metrics.ts

import { readFileSync } from 'fs'

// Métricas da fonte custom (extrair com fonttools)
const customMetrics = {
  unitsPerEm: 2048,
  ascent: 1984,
  descent: -494,
  lineGap: 0,
  xWidthAvg: 938,
}

// Métricas do Arial (fallback system)
const arialMetrics = {
  unitsPerEm: 2048,
  ascent: 1854,
  descent: -434,
  lineGap: 67,
  xWidthAvg: 904,
}

const sizeAdjust = (customMetrics.xWidthAvg / arialMetrics.xWidthAvg) * 100
const ascentOverride = (customMetrics.ascent / (customMetrics.unitsPerEm * (sizeAdjust / 100))) * 100
const descentOverride = (Math.abs(customMetrics.descent) / (customMetrics.unitsPerEm * (sizeAdjust / 100))) * 100

console.log(`size-adjust: ${sizeAdjust.toFixed(1)}%`)
console.log(`ascent-override: ${ascentOverride.toFixed(1)}%`)
console.log(`descent-override: ${descentOverride.toFixed(1)}%`)
console.log(`line-gap-override: 0%`)
```

## Configuração Completa Tailwind v4

```css
/* app/globals.css */
@import 'tailwindcss';

@theme {
  --font-sans: var(--font-inter), 'Inter Fallback', system-ui, sans-serif;
  --font-mono: var(--font-mono), 'JetBrains Mono Fallback', ui-monospace, monospace;
  --font-heading: var(--font-heading), 'Heading Fallback', system-ui, sans-serif;

  /* Fluid typography com clamp — sem media queries */
  --text-fluid-sm: clamp(0.875rem, 0.8rem + 0.25vw, 1rem);
  --text-fluid-base: clamp(1rem, 0.9rem + 0.35vw, 1.125rem);
  --text-fluid-lg: clamp(1.125rem, 1rem + 0.5vw, 1.375rem);
  --text-fluid-xl: clamp(1.25rem, 1rem + 0.75vw, 1.75rem);
  --text-fluid-2xl: clamp(1.5rem, 1rem + 1.5vw, 2.5rem);
  --text-fluid-3xl: clamp(1.875rem, 1rem + 2.5vw, 3.5rem);
  --text-fluid-4xl: clamp(2.25rem, 1rem + 3.5vw, 4.5rem);
}
```

## Checklist de Auditoria

- [ ] Máximo 2 famílias tipográficas carregadas
- [ ] Fontes variáveis quando disponíveis
- [ ] `next/font` usado (self-hosting automático)
- [ ] `display: swap` no body, `optional` em decorativas
- [ ] Subsetting: apenas `latin` (ou `latin-ext` se necessário)
- [ ] Preload em no máximo 2 arquivos de fonte
- [ ] CLS = 0 no carregamento de fontes (verificar DevTools)
- [ ] Tamanho total de fontes < 100KB
- [ ] Fallback stack definido com fontes do sistema
- [ ] `adjustFontFallback: true` habilitado (default)
