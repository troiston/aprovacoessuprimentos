---
id: doc-loading-strategy
title: Estratégias de Loading para Performance Percebida
version: 2.0
last_updated: 2026-04-07
category: performance
priority: important
related:
  - docs/web-excellence/performance/01_CORE_WEB_VITALS.md
  - docs/web-excellence/performance/02_IMAGE_OPTIMIZATION.md
  - docs/web-excellence/performance/03_FONT_OPTIMIZATION.md
  - .cursor/rules/stack/nextjs.mdc
---

# Estratégias de Loading para Performance Percebida

## Visão Geral

Performance percebida é tão importante quanto performance real. Skeletons reduzem a percepção de tempo de espera em **~35%** (Nielsen Norman Group, 2025). Streaming SSR no Next.js 15 permite enviar HTML incremental, e Suspense boundaries dão controle granular sobre o que carrega primeiro.

---

## 1. loading.tsx — Skeletons no Next.js

### 1.1 Como Funciona

`loading.tsx` é automaticamente envolvido em um `<Suspense>` pelo Next.js. Quando a page está carregando (server component fetching data), o skeleton é exibido.

### 1.2 Skeleton Component

```tsx
// components/ui/skeleton.tsx
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
      {...props}
    />
  )
}
```

### 1.3 loading.tsx de Dashboard

```tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* KPI Cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border p-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-32" />
            <Skeleton className="mt-2 h-4 w-20" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="rounded-2xl border p-6 lg:col-span-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-4 h-[300px] w-full" />
        </div>
        <div className="rounded-2xl border p-6 lg:col-span-3">
          <Skeleton className="h-4 w-24" />
          <div className="mt-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 1.4 Princípios de Skeleton Design

| Princípio | Regra | Motivo |
|-----------|-------|--------|
| Reflita o layout real | Skeleton deve ter mesma estrutura | Evita CLS quando conteúdo carrega |
| Animação pulse | `animate-pulse` suave | Indica carregamento ativo |
| Cor neutra | `bg-muted` (cinza claro) | Não distrai |
| Sem texto placeholder | Blocos sólidos, não "Loading..." | Mais limpo e rápido |
| Dimensões reais | Mesma altura/largura do conteúdo | Zero CLS |

---

## 2. Streaming SSR

### 2.1 Como Funciona

Next.js 15 com React Server Components usa streaming por padrão. O HTML é enviado em chunks:

```
1. Shell (layout, nav, skeleton) → Enviado IMEDIATAMENTE
2. Above-fold content → Enviado assim que pronto
3. Below-fold content → Enviado posteriormente
4. Dados assíncronos → Streamados conforme resolvem
```

### 2.2 Benefícios

| Métrica | Sem Streaming | Com Streaming | Melhoria |
|---------|--------------|---------------|----------|
| TTFB | Espera tudo carregar | Shell imediata | -50-80% |
| LCP | Bloqueado por dados lentos | Independente | -30-50% |
| FCP | Igual TTFB | Shell imediata | -50-80% |

---

## 3. Suspense Boundaries

### 3.1 Granularidade de Suspense

```tsx
// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPIs — Prioridade alta, carrega primeiro */}
      <Suspense fallback={<KPISkeleton />}>
        <KPICards />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Chart — Prioridade média */}
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueChart className="lg:col-span-4" />
        </Suspense>

        {/* Activity — Prioridade baixa */}
        <Suspense fallback={<ActivitySkeleton />}>
          <RecentActivity className="lg:col-span-3" />
        </Suspense>
      </div>

      {/* Table — Prioridade mais baixa */}
      <Suspense fallback={<TableSkeleton rows={10} />}>
        <TransactionsTable />
      </Suspense>
    </div>
  )
}
```

### 3.2 Regra de Suspense

> Cada seção que faz fetch de dados independente deve ter seu próprio `<Suspense>`. Isso permite que seções rápidas apareçam imediatamente enquanto lentas ainda carregam.

---

## 4. Optimistic Updates

### 4.1 Princípio

> Atualizar a UI imediatamente antes da confirmação do servidor. Se o servidor falhar, reverter.

### 4.2 Implementação com useOptimistic

```tsx
'use client'

import { useOptimistic } from 'react'
import { addTodo } from './actions'

function TodoList({ todos }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: string) => [
      ...state,
      { id: crypto.randomUUID(), text: newTodo, pending: true },
    ]
  )

  async function handleSubmit(formData: FormData) {
    const text = formData.get('text') as string
    addOptimisticTodo(text)
    await addTodo(text)
  }

  return (
    <>
      <form action={handleSubmit}>
        <input name="text" required />
        <button type="submit">Adicionar</button>
      </form>
      <ul>
        {optimisticTodos.map((todo) => (
          <li key={todo.id} className={todo.pending ? 'opacity-50' : ''}>
            {todo.text}
          </li>
        ))}
      </ul>
    </>
  )
}
```

### 4.3 Quando Usar

| Ação | Optimistic? | Motivo |
|------|------------|--------|
| Adicionar item a lista | ✅ Sim | UX instantânea, revert é fácil |
| Toggle (like, favorite) | ✅ Sim | Binary state, fácil de reverter |
| Deletar item | ✅ Sim (com undo) | Mostrar "desfeito" temporariamente |
| Pagamento | ❌ Não | Consequências irreversíveis |
| Criar recurso complexo | 🟡 Parcial | Mostrar "criando..." mas não finalizar |

---

## 5. Progressive Loading

### 5.1 Ordem de Carregamento

```
Prioridade 1 — CRITICAL (blocking)
├── HTML shell + critical CSS
├── Font principal (preloaded)
└── Imagem LCP (priority)

Prioridade 2 — ABOVE-FOLD (high)
├── Dados dos KPI cards
├── Imagens acima do fold
└── JS interativo essencial

Prioridade 3 — BELOW-FOLD (medium)
├── Charts e gráficos
├── Imagens abaixo do fold (lazy)
└── Components secundários

Prioridade 4 — DEFERRED (low)
├── Third-party analytics
├── Chat widget
├── Footer content
└── Prefetch de próximas páginas
```

### 5.2 Implementação

```tsx
// Prioridade 1 — No HTML inicial
<Image src="/hero.avif" priority />
<link rel="preload" href="/fonts/inter.woff2" as="font" />

// Prioridade 2 — Suspense com fallback
<Suspense fallback={<Skeleton />}>
  <KPICards />
</Suspense>

// Prioridade 3 — Lazy loaded
const Chart = dynamic(() => import('./chart'), {
  loading: () => <Skeleton className="h-[400px]" />,
  ssr: false,
})

// Prioridade 4 — Deferred
<Script src="https://analytics.com/script.js" strategy="lazyOnload" />
```

---

## 6. Resource Hints

### 6.1 Tipos e Uso

| Hint | Sintaxe | Quando | O que Faz |
|------|---------|--------|-----------|
| `preload` | `<link rel="preload">` | Recursos críticos na página atual | Baixa ASAP, alta prioridade |
| `prefetch` | `<link rel="prefetch">` | Recursos da próxima navegação provável | Baixa em idle time |
| `preconnect` | `<link rel="preconnect">` | Domínios third-party que serão usados | DNS + TCP + TLS antecipado |
| `dns-prefetch` | `<link rel="dns-prefetch">` | Domínios que podem ser usados | Apenas DNS lookup |

### 6.2 Implementação no Next.js

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Preconnect para serviços críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://cdn.supabase.co" crossOrigin="anonymous" />

        {/* DNS prefetch para analytics (não crítico) */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 6.3 Regras

| Regra | Detalhe |
|-------|---------|
| Preload máximo | 2-3 recursos (fonts + LCP image) |
| Preconnect máximo | 2-4 domínios |
| Prefetch | Link hovered (Next.js faz automaticamente) |
| Não preload tudo | Dilui a prioridade, piora performance |

---

## 7. Third-Party Scripts

### 7.1 next/script Strategies

| Strategy | Quando Carrega | Uso |
|----------|---------------|-----|
| `beforeInteractive` | Antes da hydration | Consent managers, polyfills (raro) |
| `afterInteractive` | Após hydration (default) | Analytics, chat (se importante) |
| `lazyOnload` | Após tudo carregar | Não-essenciais (social, widgets) |
| `worker` | Web Worker (experimental) | Scripts pesados isolados |

### 7.2 Implementação

```tsx
import Script from 'next/script'

// Analytics — após interatividade
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"
  strategy="afterInteractive"
/>

// Chat widget — preguiçoso
<Script
  src="https://widget.intercom.com/widget/xxxxx"
  strategy="lazyOnload"
/>

// Consent manager — antes (obrigatório legal)
<Script
  src="/scripts/consent.js"
  strategy="beforeInteractive"
/>
```

### 7.3 Impacto de Third-Party Scripts

| Script | Impacto INP Típico | Tamanho | Recomendação |
|--------|-------------------|---------|--------------|
| Google Analytics (GA4) | +20-50ms | ~45KB | `afterInteractive` |
| Google Tag Manager | +30-80ms | ~80KB | `afterInteractive` |
| Intercom | +50-150ms | ~200KB | `lazyOnload` |
| Hotjar | +40-100ms | ~100KB | `lazyOnload` |
| Facebook Pixel | +20-60ms | ~60KB | `lazyOnload` |
| Stripe.js | +10-30ms | ~40KB | Carregar apenas em checkout |

---

## 8. Service Worker Caching

### 8.1 Estratégias de Cache

| Estratégia | Quando | Conteúdo |
|-----------|--------|----------|
| Cache First | Assets estáticos (fonts, imagens) | Servir do cache, atualizar em background |
| Network First | API responses, HTML | Tentar rede, fallback para cache |
| Stale While Revalidate | Assets semi-dinâmicos | Servir cache, atualizar em background |
| Network Only | Dados sensíveis (auth) | Nunca cachear |

### 8.2 next-pwa Basic Setup

```js
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
      },
    },
  ],
})
```

---

## 9. CDN Strategy

### 9.1 O que Cachear no CDN

| Recurso | Cache-Control | TTL |
|---------|--------------|-----|
| Imagens otimizadas | `public, max-age=31536000, immutable` | 1 ano |
| Fonts | `public, max-age=31536000, immutable` | 1 ano |
| JS/CSS (hashed) | `public, max-age=31536000, immutable` | 1 ano |
| HTML (SSG) | `public, s-maxage=3600, stale-while-revalidate` | 1h + SWR |
| HTML (SSR) | `private, no-cache` ou ISR | Por demanda |
| API responses | `private, max-age=0` ou ISR | Dinâmico |

### 9.2 Vercel Edge Config

```tsx
// Em route handlers ou pages
export const revalidate = 3600

// Headers customizados
export const headers = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
}
```

---

## 10. Checklist de Loading Strategy

| # | Item | Prioridade |
|---|------|-----------|
| 1 | `loading.tsx` com skeleton que reflete o layout real | 🔴 Crítico |
| 2 | Suspense boundaries por seção independente | 🔴 Crítico |
| 3 | `priority` no elemento LCP | 🔴 Crítico |
| 4 | Third-party scripts com `lazyOnload` quando possível | 🟡 Alto |
| 5 | Preconnect para domínios third-party críticos | 🟡 Alto |
| 6 | Dynamic imports para components pesados abaixo do fold | 🟡 Alto |
| 7 | Optimistic updates para ações frequentes | 🟡 Alto |
| 8 | Progressive loading (critical → above → below → deferred) | 🟢 Médio |
| 9 | Service worker para caching offline | 🟢 Médio |
| 10 | CDN com cache headers corretos | 🟢 Médio |

---

## Fontes e Referências

- Next.js Documentation — Loading UI and Streaming
- React Documentation — Suspense for Data Fetching
- Google Web Vitals — Loading Performance
- Nielsen Norman Group — Skeleton Screens Perception Study 2025
- Addy Osmani — Loading Priorities (web.dev, 2025)
- Vercel — Edge Caching Best Practices
