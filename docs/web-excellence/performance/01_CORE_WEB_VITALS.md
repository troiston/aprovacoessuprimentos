---
id: doc-core-web-vitals
title: Guia Completo de Core Web Vitals (2026)
version: 2.0
last_updated: 2026-04-07
category: performance
priority: critical
related:
  - docs/web-excellence/performance/02_IMAGE_OPTIMIZATION.md
  - docs/web-excellence/performance/03_FONT_OPTIMIZATION.md
  - docs/web-excellence/performance/04_LOADING_STRATEGY.md
  - .cursor/rules/quality/performance.mdc
---

# Guia Completo de Core Web Vitals (2026)

## Visão Geral

Core Web Vitals (CWV) são as métricas do Google que medem a experiência real do usuário. Desde março 2024, **INP substituiu FID** como métrica de interatividade. Em 2026, CWV continuam sendo fator de ranking confirmado, e sites com bons CWV têm **24% menos abandono** (Google, 2025).

---

## 1. As 3 Métricas

| Métrica | O que Mede | Threshold Bom | Threshold Ruim | Taxa de Aprovação (2025) |
|---------|-----------|---------------|----------------|--------------------------|
| **LCP** | Carregamento (maior elemento visível) | ≤ 2.5s | > 4.0s | 63% dos sites |
| **INP** | Interatividade (responsividade a input) | ≤ 200ms | > 500ms | 57% dos sites |
| **CLS** | Estabilidade visual (layout shifts) | ≤ 0.1 | > 0.25 | 85% dos sites |

---

## 2. LCP — Largest Contentful Paint

### 2.1 O que é LCP

LCP mede quanto tempo leva para o **maior elemento visível** no viewport ser renderizado. O elemento LCP mais comum é:

| Elemento LCP | Frequência | Otimização Principal |
|-------------|-----------|---------------------|
| Imagem hero | 72% | `priority` + tamanho correto + AVIF |
| Heading (H1) | 15% | Font loading otimizado |
| Vídeo poster | 8% | Poster image otimizado |
| Background image | 5% | Inline critical CSS |

### 2.2 Estratégias de Otimização

| Estratégia | Impacto | Implementação |
|-----------|---------|---------------|
| **Preload imagem LCP** | -500ms a -1.5s | `priority` no next/image |
| **AVIF com fallback WebP** | -30-50% payload | Formato moderno |
| **Correto `sizes` prop** | -40-60% download | Evitar baixar imagem maior que necessário |
| **Server-side rendering** | -200ms a -1s | Server Components (default Next.js 15) |
| **CDN com edge caching** | -100-500ms | Vercel, Cloudflare |
| **Remove render-blocking CSS** | -200-500ms | Critical CSS inline |
| **Font preload** | -100-300ms | `next/font` com preload |

### 2.3 Diagnóstico de LCP Ruim

```
LCP > 2.5s? Investigar:

1. TTFB alto (>800ms)?
   → Otimizar servidor, CDN, caching
   
2. Resource load delay?
   → Preload imagem LCP, eliminar chain de requests
   
3. Resource load time?
   → Comprimir imagem (AVIF), reduzir tamanho, CDN
   
4. Element render delay?
   → Eliminar render-blocking JS/CSS, font-display: swap
```

### 2.4 Next.js Specific

```tsx
// ✅ BOM — Preload automático com priority
<Image
  src="/hero.avif"
  alt="Hero"
  width={1440}
  height={810}
  priority
  sizes="100vw"
/>

// ❌ RUIM — Sem priority, sem sizes
<Image
  src="/hero.avif"
  alt="Hero"
  width={1440}
  height={810}
/>

// ❌ RUIM — Lazy loading no LCP element
<Image
  src="/hero.avif"
  alt="Hero"
  width={1440}
  height={810}
  loading="lazy"  // NUNCA no elemento LCP
/>
```

---

## 3. INP — Interaction to Next Paint

### 3.1 O que é INP

INP mede a **latência de todas as interações** do usuário (cliques, taps, keystrokes) e reporta o pior percentil (p75-p98). Substituiu FID em março 2024. **43% dos sites falham** em INP (HTTP Archive, 2025).

### 3.2 Causas Comuns de INP Ruim

| Causa | Impacto | Solução |
|-------|---------|---------|
| **Long tasks no main thread** | Bloqueia rendering | Code splitting, web workers |
| **Hydration pesada** | Bloqueia interação | React Server Components |
| **Event handlers pesados** | Atrasa resposta | Debounce, requestAnimationFrame |
| **Third-party scripts** | Compete por main thread | Async/defer, next/script |
| **Re-renders React excessivos** | Layout thrashing | useMemo, useCallback, memo |
| **Layout/style recalculation** | Forced synchronous layout | Batch DOM reads/writes |

### 3.3 Otimizações para INP

```tsx
// ✅ Usar startTransition para updates não urgentes
import { useTransition } from 'react'

function SearchFilter({ onFilter }) {
  const [isPending, startTransition] = useTransition()

  function handleChange(query: string) {
    startTransition(() => {
      onFilter(query)
    })
  }

  return (
    <input
      onChange={(e) => handleChange(e.target.value)}
      className={isPending ? 'opacity-70' : ''}
    />
  )
}

// ✅ Debounce para inputs frequentes
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

// ✅ Virtualização para listas longas
import { useVirtualizer } from '@tanstack/react-virtual'
```

---

## 4. CLS — Cumulative Layout Shift

### 4.1 O que é CLS

CLS mede a soma de todos os **shifts inesperados de layout** durante a vida da página. É a métrica com maior taxa de aprovação (85%), mas quando falha, o impacto na UX é severo.

### 4.2 Causas e Soluções

| Causa | CLS Impacto | Solução |
|-------|-------------|---------|
| **Imagens sem dimensões** | 0.1-0.5 | Sempre definir width/height ou aspect-ratio |
| **Fonts causando FOIT/FOUT** | 0.05-0.2 | font-display: optional, size-adjust |
| **Ads/embeds sem espaço reservado** | 0.1-0.3 | Reservar espaço com min-height |
| **Conteúdo injetado dinamicamente** | 0.05-0.2 | Reservar espaço, usar skeleton |
| **Animações usando top/left** | 0.01-0.1 | Usar transform (não causa layout) |

### 4.3 Prevenção no Next.js

```tsx
// ✅ Imagem com dimensões (CLS = 0)
<Image src="/photo.jpg" width={800} height={600} alt="..." />

// ✅ Aspect ratio para containers dinâmicos
<div className="aspect-video w-full">
  <iframe src="..." className="h-full w-full" />
</div>

// ✅ Skeleton placeholder previne CLS
<Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
  <DynamicChart />
</Suspense>

// ✅ Font com size-adjust previne CLS
import { Inter } from 'next/font/google'
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
```

---

## 5. Medição: CrUX vs Lighthouse

### 5.1 Comparação

| Aspecto | CrUX (Chrome UX Report) | Lighthouse |
|---------|------------------------|-----------|
| Tipo | Real User Monitoring (RUM) | Lab/Synthetic |
| Dados | 28 dias de usuários reais | Simulação em condições fixas |
| Usado para ranking | ✅ **Sim** | ❌ Não diretamente |
| Acesso | PageSpeed Insights, Search Console | DevTools, CI/CD |
| Variabilidade | Alta (dispositivos reais) | Baixa (controlada) |
| Velocidade de feedback | Lento (28 dias) | Instantâneo |

### 5.2 Onde Medir

| Ferramenta | O que Mede | Quando Usar |
|-----------|-----------|-------------|
| **PageSpeed Insights** | CrUX + Lighthouse | Verificação rápida |
| **Chrome DevTools** | Lighthouse + Performance tab | Debug local |
| **Search Console** | CWV report (CrUX) | Monitoramento de ranking |
| **web-vitals (npm)** | RUM próprio | Monitoramento contínuo |
| **CrUX API** | Dados de campo históricos | Análise de tendências |

### 5.3 Monitoramento com web-vitals

```tsx
// app/layout.tsx (ou web-vitals reporter)
import { onCLS, onINP, onLCP } from 'web-vitals'

function reportWebVitals() {
  onCLS((metric) => sendToAnalytics('CLS', metric))
  onINP((metric) => sendToAnalytics('INP', metric))
  onLCP((metric) => sendToAnalytics('LCP', metric))
}

function sendToAnalytics(name: string, metric: { value: number; id: string }) {
  fetch('/api/analytics/web-vitals', {
    method: 'POST',
    body: JSON.stringify({
      name,
      value: metric.value,
      id: metric.id,
      page: window.location.pathname,
      timestamp: Date.now(),
    }),
    keepalive: true,
  })
}
```

---

## 6. Otimizações Específicas do Next.js

| Feature Next.js | CWV Beneficiado | Como |
|----------------|-----------------|------|
| Server Components | LCP, INP | Menos JS no client |
| `next/image` | LCP, CLS | Otimização automática |
| `next/font` | CLS, LCP | Font loading otimizado |
| `next/script` | INP | Controle de loading de scripts |
| Streaming SSR | LCP | Renderização incremental |
| `loading.tsx` | CLS | Placeholder durante carregamento |
| ISR/SSG | LCP | Páginas pré-renderizadas |
| Route prefetching | LCP (next page) | Prefetch no hover de links |

---

## 7. Impacto no SEO

### 7.1 CWV como Fator de Ranking

| Fato | Detalhe |
|------|---------|
| Fator confirmado | Google confirma CWV como fator de ranking (desde 2021) |
| Peso relativo | Tiebreaker — não substitui relevância de conteúdo |
| Dados usados | CrUX (real users), não Lighthouse |
| Granularidade | Por URL individual + agrupamento por grupo de URLs |
| Atualização | Rolling 28 dias |

### 7.2 Impacto Medido

| Cenário | Resultado |
|---------|----------|
| CWV bom → bom | Sem mudança |
| CWV ruim → bom | +5-15% impressões orgânicas (mediana) |
| CWV bom → ruim | -5-10% impressões orgânicas |

> CWV sozinho não vai levar um site da página 3 para a página 1, mas pode ser o diferencial entre posição 5 e posição 3 quando o conteúdo é comparável.

---

## 8. Performance Budget

### 8.1 Budget Recomendado

| Recurso | Budget | Motivo |
|---------|--------|--------|
| First Load JS | < 200 KB (gzipped) | Hydration rápida |
| Total page weight | < 1.5 MB | Conexões lentas |
| Número de requests | < 50 | Overhead de conexão |
| Imagem hero | < 200 KB | LCP rápido |
| Total de fontes | < 100 KB | Font loading |
| Third-party JS | < 100 KB | INP proteção |
| Time to Interactive | < 3.5s (3G) | Interatividade |

### 8.2 Monitoramento de Budget no CI

```json
// next.config.js — experimental.buildActivityBudget
{
  "budgets": [
    {
      "path": "/_app",
      "type": "bundle",
      "maximumWarning": "170kb",
      "maximumError": "200kb"
    }
  ]
}
```

---

## Fontes e Referências

- Google Web Vitals Documentation 2026
- HTTP Archive Web Almanac 2025
- Chrome UX Report — CrUX Dataset 2025
- Google Search Central — Page Experience Update
- web.dev — Core Web Vitals Optimization Guide
- Vercel — Next.js Performance Best Practices 2025
- Philip Walton — INP Deep Dive (web.dev, 2025)
