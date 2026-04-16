---
id: skill-optimize-bundle
title: "Optimize Bundle"
agent: 06-qa-auditor
version: 1.0
category: performance
priority: important
requires:
  - rule: 00-constitution
provides:
  - bundle size dentro do budget (<200KB first load JS)
  - code splitting otimizado
  - tree shaking verificado
used_by:
  - agent: 06-qa-auditor
  - command: /audit-full
---

# Otimização de Bundle

## Budget: First Load JS < 200KB

Cada KB de JavaScript custa mais que 1KB de imagem — JS precisa ser parseado, compilado e executado. O target é agressivo: **< 200KB** de First Load JS.

## Setup: @next/bundle-analyzer

```bash
npm install @next/bundle-analyzer
```

```typescript
// next.config.ts
import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'

const nextConfig: NextConfig = {
  // ... outras configs
}

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig)
```

```json
// package.json — adicionar script
{
  "scripts": {
    "analyze": "ANALYZE=true next build",
    "analyze:server": "ANALYZE=true BUNDLE_ANALYZE=server next build",
    "analyze:browser": "ANALYZE=true BUNDLE_ANALYZE=browser next build"
  }
}
```

### Workflow de Análise

```bash
# 1. Rodar análise
npm run analyze

# 2. Abre 2 abas no browser:
#    - client.html (bundles do client)
#    - server.html (bundles do server)

# 3. Identificar os maiores módulos no treemap
# 4. Para cada módulo grande, decidir: substituir, lazy load, ou remover
```

## Dynamic Imports para Below-the-Fold

Qualquer componente que não é visível no viewport inicial deve ser lazy loaded:

```tsx
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Componentes below-the-fold com dynamic import
const TestimonialCarousel = dynamic(
  () => import('@/components/testimonial-carousel'),
  {
    loading: () => <TestimonialSkeleton />,
  }
)

const PricingTable = dynamic(
  () => import('@/components/pricing-table'),
  {
    loading: () => <PricingSkeleton />,
  }
)

const ContactForm = dynamic(
  () => import('@/components/contact-form'),
  {
    loading: () => <FormSkeleton />,
    ssr: false, // Form não precisa SSR
  }
)

export default function LandingPage() {
  return (
    <main>
      {/* Above-the-fold — carregamento normal */}
      <HeroSection />
      <FeaturesGrid />

      {/* Below-the-fold — lazy loaded */}
      <Suspense fallback={<TestimonialSkeleton />}>
        <TestimonialCarousel />
      </Suspense>

      <Suspense fallback={<PricingSkeleton />}>
        <PricingTable />
      </Suspense>

      <Suspense fallback={<FormSkeleton />}>
        <ContactForm />
      </Suspense>
    </main>
  )
}
```

### Dynamic Import com React.lazy (Client Components)

```tsx
'use client'

import { lazy, Suspense } from 'react'

const HeavyChart = lazy(() => import('@/components/heavy-chart'))

export function Dashboard() {
  const [showChart, setShowChart] = useState(false)

  return (
    <div>
      <button onClick={() => setShowChart(true)}>Ver Gráfico</button>
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  )
}
```

## Substituição de Dependências Pesadas

### moment → date-fns (ou nativo)

```typescript
// ❌ moment.js — 300KB+ (não tem tree shaking)
import moment from 'moment'
moment().format('DD/MM/YYYY')

// ✅ date-fns — ~2KB por função (tree shakeable)
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
format(new Date(), 'dd/MM/yyyy', { locale: ptBR })

// ✅ Intl nativo — 0KB (built-in do browser)
new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
}).format(new Date())
```

### lodash → lodash-es ou nativo

```typescript
// ❌ lodash completo — 70KB+
import _ from 'lodash'
_.debounce(fn, 300)

// ⚠️ Import individual — melhor, mas ainda bundla helpers
import debounce from 'lodash/debounce'

// ✅ lodash-es — tree shakeable
import { debounce } from 'lodash-es'

// ✅ Nativo — 0KB
function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
```

### Tabela de Substituições Comuns

| Dep Pesada | Tamanho | Alternativa | Tamanho |
|---|---|---|---|
| `moment` | 300KB | `date-fns` / Intl | 2-5KB / 0KB |
| `lodash` | 70KB | `lodash-es` / nativo | 2-5KB / 0KB |
| `axios` | 13KB | `fetch` nativo | 0KB |
| `classnames` | 2KB | `clsx` | 0.5KB |
| `uuid` | 4KB | `crypto.randomUUID()` | 0KB |
| `numeral` | 17KB | `Intl.NumberFormat` | 0KB |
| `chalk` (server) | ok | ok (server only) | — |

## Tree Shaking — Verificação

O tree shaking funciona com ESM (`import/export`). Verificar que:

```typescript
// ✅ Named exports — tree shakeable
export function formatCurrency(value: number) { ... }
export function formatDate(date: Date) { ... }

// ❌ Default export de objeto — não tree shakeable
export default {
  formatCurrency,
  formatDate,
}

// ❌ Re-export de barrel com side effects
// utils/index.ts
export * from './format'  // pode importar tudo
export * from './validate'
export * from './transform'
```

### Verificar Tree Shaking no Bundle

```bash
# 1. Build com analyze
npm run analyze

# 2. No treemap, procurar módulos que deveriam ser removidos
# 3. Se um módulo inteiro aparece mas só usa 1 função:
#    - Verificar se é ESM (import/export, não require)
#    - Verificar barrel exports
#    - Verificar side effects no package.json
```

## Barrel Exports — O Problema

```typescript
// ❌ components/index.ts (barrel export)
export { Button } from './button'
export { Card } from './card'
export { Modal } from './modal'      // 50KB com animações
export { DataTable } from './table'  // 100KB com sorting/filtering
export { RichEditor } from './editor' // 200KB

// Quando alguém faz:
import { Button } from '@/components'
// Pode trazer TODO o barrel, incluindo Modal, DataTable, RichEditor
```

### Solução

```typescript
// ✅ Import direto do arquivo
import { Button } from '@/components/button'
import { Card } from '@/components/card'

// ✅ Se precisa de barrel, use modularizeImports no next.config
const nextConfig: NextConfig = {
  modularizeImports: {
    '@/components': {
      transform: '@/components/{{member}}',
    },
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },
}
```

## Code Splitting Automático

O Next.js já faz code splitting por rota automaticamente. Cada `page.tsx` gera seu próprio chunk. Para otimizar:

```typescript
// next.config.ts — otimizar splitting de pacotes
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      '@radix-ui/react-icons',
      'framer-motion',
    ],
  },
}
```

## Workflow Completo de Análise

```bash
# 1. Build baseline
next build
# Anotar: First Load JS de cada rota

# 2. Analisar
ANALYZE=true next build
# Identificar top 5 maiores módulos

# 3. Para cada módulo grande:
#    a) É usado above-the-fold? → Manter
#    b) É usado below-the-fold? → Dynamic import
#    c) Tem alternativa menor? → Substituir
#    d) Usa barrel export? → Import direto
#    e) Não é usado? → Remover

# 4. Rebuild e comparar
next build
# Verificar redução no First Load JS

# 5. Repeat até First Load JS < 200KB
```

## Verificação Rápida no Build Output

```
Route (app)                    Size     First Load JS
┌ ○ /                          5.2 kB   180 kB  ✅ < 200KB
├ ○ /about                     3.1 kB   175 kB  ✅
├ ● /blog/[slug]               8.4 kB   210 kB  ❌ > 200KB — investigar
├ ○ /contact                   4.3 kB   176 kB  ✅
└ ○ /pricing                   6.1 kB   185 kB  ✅

+ First Load JS shared by all routes: 170 kB
  ├ chunks/framework-xxxxx.js   45 kB   (React)
  ├ chunks/main-xxxxx.js        28 kB   (Next.js runtime)
  └ other shared chunks          97 kB   ← investigar se > 100KB
```

## Checklist de Auditoria

- [ ] `@next/bundle-analyzer` configurado
- [ ] First Load JS < 200KB em todas as rotas
- [ ] Componentes below-the-fold com dynamic import
- [ ] `moment` substituído por `date-fns` ou Intl
- [ ] `lodash` substituído por `lodash-es` ou nativo
- [ ] `axios` substituído por `fetch` nativo
- [ ] Barrel exports eliminados ou com `modularizeImports`
- [ ] `optimizePackageImports` configurado para libs com muitos exports
- [ ] Tree shaking verificado (sem módulos desnecessários no treemap)
- [ ] Shared chunks < 100KB
- [ ] Nenhum polyfill desnecessário incluído
