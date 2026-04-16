---
id: skill-build-loading-strategy
title: "Build Loading Strategy"
agent: 03-builder
version: 1.0
category: performance
priority: important
requires:
  - rule: 00-constitution
provides:
  - loading states em todas as rotas
  - streaming SSR para dados lentos
  - progressive loading do conteúdo
used_by:
  - agent: 03-builder
  - command: /new-page
---

# Estratégia de Loading

## Regra: Toda Rota DEVE ter `loading.tsx`

O `loading.tsx` é exibido automaticamente pelo Next.js enquanto o `page.tsx` carrega. Sem ele, a página fica em branco.

## Skeleton em Toda Rota

### Layout Base do Skeleton

```tsx
// components/skeletons/skeleton.tsx
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-oklch(0.92_0_0)',
        className
      )}
    />
  )
}
```

### Skeleton da Home Page

```tsx
// app/loading.tsx
import { Skeleton } from '@/components/skeletons/skeleton'

export default function HomeLoading() {
  return (
    <main>
      {/* Hero skeleton */}
      <section className="relative h-[70vh] w-full">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
          <Skeleton className="h-12 w-[60%] max-w-2xl" />
          <Skeleton className="h-6 w-[40%] max-w-lg" />
          <Skeleton className="mt-4 h-12 w-40 rounded-full" />
        </div>
      </section>

      {/* Features grid skeleton */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Skeleton className="mx-auto mb-12 h-10 w-64" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4 rounded-2xl border p-6">
              <Skeleton className="size-12 rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
```

### Skeleton de Blog Post

```tsx
// app/blog/[slug]/loading.tsx
import { Skeleton } from '@/components/skeletons/skeleton'

export default function BlogPostLoading() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {/* Breadcrumb */}
      <div className="mb-8 flex gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Title + meta */}
      <Skeleton className="mb-4 h-12 w-full" />
      <Skeleton className="mb-8 h-12 w-3/4" />
      <div className="mb-12 flex items-center gap-4">
        <Skeleton className="size-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Hero image */}
      <Skeleton className="mb-12 aspect-video w-full rounded-2xl" />

      {/* Content paragraphs */}
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
        <Skeleton className="h-4 w-2/3" />
      </div>
    </article>
  )
}
```

## Streaming SSR para Dados Lentos

Quando parte do conteúdo depende de dados lentos (API externa, banco), use Suspense para streaming:

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'
import { DashboardHeader } from '@/components/dashboard-header'
import { QuickStats } from '@/components/quick-stats'
import { RecentActivity } from '@/components/recent-activity'
import { AnalyticsChart } from '@/components/analytics-chart'

export default function DashboardPage() {
  return (
    <main className="space-y-8 p-8">
      {/* Renderiza imediatamente — sem dados */}
      <DashboardHeader />

      {/* Stats — dados rápidos (cache, ~100ms) */}
      <Suspense fallback={<QuickStatsSkeleton />}>
        <QuickStats />
      </Suspense>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Analytics — dados médios (~500ms) */}
        <Suspense fallback={<ChartSkeleton />}>
          <AnalyticsChart />
        </Suspense>

        {/* Activity — dados lentos (API externa, ~2s) */}
        <Suspense fallback={<ActivitySkeleton />}>
          <RecentActivity />
        </Suspense>
      </div>
    </main>
  )
}
```

### Server Component com Fetch Lento

```tsx
// components/recent-activity.tsx (Server Component)
import { getRecentActivity } from '@/lib/api'

export async function RecentActivity() {
  // Este fetch pode demorar 2s — mas não bloqueia a página inteira
  // O Suspense boundary faz streaming: envia o skeleton primeiro,
  // depois substitui com o conteúdo quando os dados chegam
  const activities = await getRecentActivity()

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">Atividade Recente</h2>
      <ul className="divide-y">
        {activities.map((activity) => (
          <li key={activity.id} className="flex items-center gap-4 py-3">
            <div className="size-8 rounded-full bg-primary/10" />
            <div>
              <p className="text-sm font-medium">{activity.description}</p>
              <time className="text-xs text-muted-foreground">
                {activity.timestamp}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

## Suspense Granular — Por Seção, Não por Página

```tsx
// ❌ Suspense wrapping a página inteira — página inteira fica em loading
<Suspense fallback={<FullPageSkeleton />}>
  <EntirePage />
</Suspense>

// ✅ Suspense granular — cada seção independente
<main>
  <Header /> {/* Imediato */}

  <Suspense fallback={<HeroSkeleton />}>
    <HeroWithData /> {/* Stream quando dados chegam */}
  </Suspense>

  <Suspense fallback={<ProductsSkeleton />}>
    <FeaturedProducts /> {/* Stream independente */}
  </Suspense>

  <Suspense fallback={<ReviewsSkeleton />}>
    <CustomerReviews /> {/* Stream independente */}
  </Suspense>

  <Footer /> {/* Imediato */}
</main>
```

## Optimistic Updates para Interações

Quando o usuário faz uma ação (like, bookmark, toggle), atualizar a UI imediatamente antes da resposta do servidor:

```tsx
'use client'

import { useOptimistic, useTransition } from 'react'
import { toggleBookmark } from '@/actions/bookmark'

interface BookmarkButtonProps {
  postId: string
  isBookmarked: boolean
}

export function BookmarkButton({ postId, isBookmarked }: BookmarkButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [optimisticBookmarked, setOptimisticBookmarked] = useOptimistic(
    isBookmarked,
    (_, newState: boolean) => newState
  )

  function handleClick() {
    startTransition(async () => {
      setOptimisticBookmarked(!optimisticBookmarked)
      await toggleBookmark(postId)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={optimisticBookmarked}
      className={cn(
        'transition-colors',
        optimisticBookmarked ? 'text-primary' : 'text-muted-foreground'
      )}
    >
      <BookmarkIcon filled={optimisticBookmarked} />
    </button>
  )
}
```

### Optimistic Update em Lista (adicionar item)

```tsx
'use client'

import { useOptimistic } from 'react'
import { addComment } from '@/actions/comments'

export function CommentSection({ comments }: { comments: Comment[] }) {
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, newComment: Comment) => [...state, newComment]
  )

  async function handleSubmit(formData: FormData) {
    const text = formData.get('text') as string
    const optimistic: Comment = {
      id: `temp-${Date.now()}`,
      text,
      author: 'Você',
      createdAt: new Date().toISOString(),
      isPending: true,
    }

    addOptimisticComment(optimistic)
    await addComment(formData)
  }

  return (
    <section>
      <ul className="space-y-4">
        {optimisticComments.map((comment) => (
          <li
            key={comment.id}
            className={cn(comment.isPending && 'opacity-60')}
          >
            <p>{comment.text}</p>
            <span className="text-xs text-muted-foreground">
              {comment.author}
            </span>
          </li>
        ))}
      </ul>

      <form action={handleSubmit} className="mt-6">
        <textarea name="text" required className="w-full rounded-lg border p-3" />
        <button type="submit" className="mt-2 rounded-lg bg-primary px-4 py-2 text-white">
          Comentar
        </button>
      </form>
    </section>
  )
}
```

## Progressive Loading — Ordem de Prioridade

```
Fase 1: Conteúdo Crítico (0-500ms)
  → Shell do layout (header, nav, footer)
  → Hero com imagem priority
  → H1 e texto principal
  → CTA primário

Fase 2: Above-the-Fold (500ms-1.5s)
  → Features grid com dados
  → Stats com números
  → Social proof

Fase 3: Below-the-Fold (1.5s-3s)
  → Seções adicionais (stream via Suspense)
  → Imagens lazy loaded
  → Componentes dynamic import

Fase 4: Deferred (3s+)
  → Analytics scripts (afterInteractive)
  → Chat widget (lazyOnload)
  → Tracking pixels
  → A/B testing scripts
```

### Implementação Completa

```tsx
// app/page.tsx
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Script from 'next/script'

// Fase 3: Below-the-fold com dynamic import
const Testimonials = dynamic(() => import('@/components/testimonials'))
const FAQ = dynamic(() => import('@/components/faq'))
const Newsletter = dynamic(() => import('@/components/newsletter'), {
  ssr: false,
})

export default function HomePage() {
  return (
    <>
      <main>
        {/* Fase 1: Crítico — Server Component, sem Suspense */}
        <HeroSection />

        {/* Fase 2: Above-fold com dados — Suspense streaming */}
        <Suspense fallback={<FeaturesSkeleton />}>
          <FeaturesWithData />
        </Suspense>

        <Suspense fallback={<StatsSkeleton />}>
          <StatsWithData />
        </Suspense>

        {/* Fase 3: Below-fold — dynamic import + Suspense */}
        <Suspense fallback={<TestimonialsSkeleton />}>
          <Testimonials />
        </Suspense>

        <Suspense fallback={<FAQSkeleton />}>
          <FAQ />
        </Suspense>

        <Suspense fallback={null}>
          <Newsletter />
        </Suspense>
      </main>

      {/* Fase 4: Deferred scripts */}
      <Script
        src="https://www.googletagmanager.com/gtag/js"
        strategy="afterInteractive"
      />
      <Script
        src="https://widget.intercom.io/widget/abc123"
        strategy="lazyOnload"
      />
    </>
  )
}
```

## Checklist

- [ ] `loading.tsx` com skeleton em toda rota
- [ ] Skeletons refletem o layout real do conteúdo
- [ ] Suspense granular (por seção, não por página)
- [ ] Streaming SSR para dados lentos (>500ms)
- [ ] Optimistic updates em todas interações do usuário
- [ ] Progressive loading: crítico → above-fold → below-fold → deferred
- [ ] Dynamic imports para componentes below-the-fold pesados
- [ ] Scripts não-críticos com `afterInteractive` ou `lazyOnload`
- [ ] Nenhum flash de conteúdo vazio (skeleton ou blur placeholder)
