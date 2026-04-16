---
id: skill-optimize-lcp
title: "Optimize LCP"
agent: 06-qa-auditor
version: 1.0
category: performance
priority: critical
requires:
  - skill: skill-optimize-images
  - skill: skill-optimize-fonts
  - rule: 00-constitution
provides:
  - LCP abaixo de 2.5s
  - above-the-fold renderizado no primeiro paint
  - diagnóstico completo de LCP
used_by:
  - agent: 06-qa-auditor
  - command: /audit-full
---

# Otimização de LCP (Largest Contentful Paint)

## Meta: LCP < 2.5s

O LCP mede quando o maior elemento visível do viewport termina de renderizar. Geralmente é:
- **Hero image** (mais comum)
- **Heading principal** (h1 com fonte custom)
- **Video poster**
- **Background image via CSS** (difícil de otimizar)

## Passo 1: Identificar o Elemento LCP

### Via Chrome DevTools

```
1. DevTools → Performance → Record → Reload
2. Na timeline, encontrar o marcador "LCP"
3. Clicar no marcador → mostra o elemento exato
4. Anotar: tipo (img, text, bg-image), tamanho, tempo
```

### Via web-vitals (Monitoramento em Produção)

```typescript
// lib/web-vitals.ts
import { onLCP, onFID, onCLS, onINP, onTTFB } from 'web-vitals'

type MetricReporter = (metric: {
  name: string
  value: number
  id: string
  delta: number
}) => void

export function reportWebVitals(onReport: MetricReporter) {
  onLCP(onReport)
  onFID(onReport)
  onCLS(onReport)
  onINP(onReport)
  onTTFB(onReport)
}
```

```tsx
// components/web-vitals-reporter.tsx
'use client'

import { useEffect } from 'react'
import { reportWebVitals } from '@/lib/web-vitals'

export function WebVitalsReporter() {
  useEffect(() => {
    reportWebVitals((metric) => {
      // Enviar para analytics
      console.log(`${metric.name}: ${metric.value.toFixed(0)}ms`)

      // Exemplo: enviar para endpoint customizado
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/vitals',
          JSON.stringify({
            name: metric.name,
            value: metric.value,
            id: metric.id,
            page: window.location.pathname,
          })
        )
      }
    })
  }, [])

  return null
}
```

## Passo 2: Preload do Recurso LCP

### Para Imagens (caso mais comum)

```tsx
// Se LCP é a hero image — next/image com priority
import Image from 'next/image'
import heroImg from '@/assets/hero.jpg'

export function Hero() {
  return (
    <section className="relative h-[70vh] w-full">
      <Image
        src={heroImg}
        alt="Hero principal"
        fill
        sizes="100vw"
        priority // Gera <link rel="preload"> automaticamente
        quality={75}
        placeholder="blur"
        className="object-cover"
      />
    </section>
  )
}
```

### Para Imagens Remotas (preload manual)

```tsx
// app/layout.tsx — preload explícito quando next/image priority não basta
import type { Metadata } from 'next'

export const metadata: Metadata = {
  other: {
    'link': [
      // Preload da hero image remota
      '<https://cdn.exemplo.com/hero.avif>; rel=preload; as=image; type=image/avif',
    ],
  },
}
```

Ou via `<head>` direto:

```tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="preload"
          as="image"
          href="https://cdn.exemplo.com/hero.avif"
          type="image/avif"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### Para Texto como LCP (heading com fonte custom)

Garantir que a fonte do heading carregue rápido:

```typescript
// Fonte do heading com preload automático via next/font
import { Instrument_Serif } from 'next/font/google'

const headingFont = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap', // swap para heading LCP — texto visível imediatamente
  variable: '--font-heading',
})
```

## Passo 3: Eliminar Render-Blocking

### CSS Crítico Inline

O Next.js com App Router já faz inline de CSS crítico automaticamente. Verificar que não há CSS externo bloqueante:

```tsx
// ❌ NUNCA — CSS externo bloqueante
<link rel="stylesheet" href="https://cdn.exemplo.com/styles.css" />

// ✅ CSS via Tailwind (processado no build, inline crítico automático)
// ✅ CSS Modules (processado no build)
// ✅ next/font (inline automático)
```

### JavaScript Não-Bloqueante

```tsx
// ❌ NUNCA — script bloqueante
<script src="https://analytics.com/script.js" />

// ✅ Script com defer/async via next/script
import Script from 'next/script'

<Script
  src="https://analytics.com/script.js"
  strategy="afterInteractive" // Carrega após hydration
/>

// ✅ Ou lazyOnload para scripts não-críticos
<Script
  src="https://widget.com/chat.js"
  strategy="lazyOnload" // Carrega quando browser está idle
/>
```

## Passo 4: Server-Side Rendering para Above-the-Fold

```tsx
// app/page.tsx — Server Component (default, sem 'use client')
// O conteúdo above-the-fold DEVE ser Server Component

import { HeroSection } from '@/components/hero-section'
import { FeaturesGrid } from '@/components/features-grid'
import { Suspense } from 'react'

export default function HomePage() {
  return (
    <main>
      {/* Above the fold — renderizado no servidor, sem Suspense */}
      <HeroSection />

      {/* Below the fold — pode ter loading state */}
      <Suspense fallback={<FeaturesGridSkeleton />}>
        <FeaturesGrid />
      </Suspense>
    </main>
  )
}
```

### Evitar Client Components no Above-the-Fold

```tsx
// ❌ Client component como wrapper do above-the-fold
'use client'
export function Hero() { // Toda a seção depende de JS para renderizar
  return <section>...</section>
}

// ✅ Server component com ilha interativa mínima
// components/hero-section.tsx (Server Component)
export function HeroSection() {
  return (
    <section className="relative h-[70vh]">
      <Image src={hero} alt="..." fill priority sizes="100vw" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-fluid-4xl font-bold text-white">Título</h1>
        {/* Apenas o CTA é client component */}
        <HeroCTA />
      </div>
    </section>
  )
}

// components/hero-cta.tsx
'use client'
export function HeroCTA() {
  return (
    <button onClick={() => scrollToSection('features')}>
      Começar
    </button>
  )
}
```

## Passo 5: CDN e Cache

```typescript
// next.config.ts — headers de cache para assets estáticos
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ]
  },
}
```

## Diagnóstico Rápido: Waterfall do LCP

```
Tempo total do LCP = TTFB + Resource Load + Render Delay

TTFB alto (>800ms):
  → Verificar servidor/CDN
  → Verificar redirect chains
  → Habilitar HTTP/2 ou HTTP/3

Resource Load alto:
  → Imagem muito grande → otimizar quality/sizes
  → Sem preload → adicionar priority
  → Domínio externo sem preconnect → adicionar

Render Delay alto:
  → JS bloqueante → mover para afterInteractive
  → CSS externo → inline ou remover
  → Client Component no above-fold → converter para Server
```

### Preconnect para Domínios Externos

```tsx
// app/layout.tsx
<head>
  <link rel="preconnect" href="https://cdn.exemplo.com" />
  <link rel="dns-prefetch" href="https://cdn.exemplo.com" />
  <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
</head>
```

## Checklist de Otimização LCP

- [ ] Elemento LCP identificado (DevTools Performance)
- [ ] LCP image com `priority` (next/image) ou `rel="preload"` manual
- [ ] Nenhum CSS externo bloqueante
- [ ] Nenhum JS bloqueante (tudo via `next/script` com strategy adequada)
- [ ] Above-the-fold é Server Component
- [ ] Client Components mínimos no above-fold (apenas interatividade)
- [ ] Fonte do heading com `display: swap` e preload
- [ ] `preconnect` para domínios externos de recursos críticos
- [ ] Cache headers configurados para assets estáticos
- [ ] TTFB < 800ms (verificar com WebPageTest)
- [ ] LCP < 2.5s em 75th percentile (verificar com CrUX ou web-vitals)
- [ ] Nenhum redirect chain no carregamento da página
