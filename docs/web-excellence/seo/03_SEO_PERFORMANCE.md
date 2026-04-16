---
id: doc-seo-performance
title: Performance como SEO
version: 2.0
last_updated: 2026-04-07
category: seo
priority: critical
related:
  - docs/web-excellence/seo/01_SEO_TECHNICAL.md
  - docs/web-excellence/seo/05_SEO_CHECKLIST.md
  - docs/web-excellence/ux-ui/03_MOTION_GUIDELINES.md
  - docs/web-excellence/foundations/02_TYPOGRAPHY.md
  - .cursor/rules/quality/performance.mdc
---

# Performance como SEO

## 1. Core Web Vitals e Ranking

### 1.1 Impacto Direto

Core Web Vitals (CWV) são fator de ranking confirmado pelo Google desde junho 2021 como parte do Page Experience signal. Dados atualizados de 2026:

- **Sites com CWV "bom"** têm 24% menos probabilidade de abandono pelo usuário (Chrome UX Report 2025)
- **Melhoria de LCP de 2.4s para 1.2s** → +15% em pageviews e +7% em conversões (Vodafone case study)
- **Cada segundo adicional** de loading → **-7% conversão** (Google/Deloitte 2025)
- **Sites com INP "ruim"** (>500ms) têm **2.8x mais bounce** que sites com INP "bom" (Web Almanac 2025)

### 1.2 CWV Thresholds (2026)

| Métrica | O que Mede | Bom | Precisa Melhorar | Ruim |
|---|---|---|---|---|
| **LCP** (Largest Contentful Paint) | Tempo até o maior elemento visível renderizar | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| **CLS** (Cumulative Layout Shift) | Instabilidade visual durante carregamento | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| **INP** (Interaction to Next Paint) | Responsividade a interações do usuário | ≤ 200ms | 200ms - 500ms | > 500ms |

### 1.3 Lab Data vs. Field Data

| Tipo | Fonte | Uso |
|---|---|---|
| **Lab data** | Lighthouse, PageSpeed Insights (lab), WebPageTest | Debugging e otimização durante desenvolvimento |
| **Field data** | Chrome UX Report (CrUX), PageSpeed Insights (field) | **O que Google usa para ranking** |
| **RUM** (Real User Monitoring) | web-vitals library, Vercel Analytics | Monitoramento contínuo em produção |

**Importante:** Google usa field data (CrUX) para ranking, não lab data. Um Lighthouse 100 não garante CWV "bom" se usuários reais em 3G experimentam lentidão.

## 2. LCP Optimization

### 2.1 O que Causa LCP Ruim

| Causa | Frequência | Impacto |
|---|---|---|
| Imagens grandes não otimizadas | 72% dos casos | Muito alto |
| Render-blocking CSS/JS | 45% | Alto |
| Slow server response (TTFB) | 40% | Alto |
| Client-side rendering | 35% | Alto |
| Web fonts bloqueando | 25% | Médio |
| Third-party scripts | 20% | Médio |

### 2.2 Otimização de Imagens (Principal)

```tsx
// ✅ next/image com priority para hero
import Image from 'next/image';

<Image
  src="/hero.webp"
  alt="Hero banner"
  width={1200}
  height={675}
  priority       // Preload — sem lazy loading
  sizes="100vw"
  quality={85}
/>
```

**Checklist de imagem LCP:**
- [ ] `priority` no next/image (ou `<link rel="preload">` manual)
- [ ] Formato WebP ou AVIF (30-50% menor que JPEG)
- [ ] Tamanho adequado (não servir 4000px para viewport de 1200px)
- [ ] CDN com edge caching
- [ ] `fetchpriority="high"` no `<img>` do LCP element

### 2.3 Preload do LCP Element

```html
<!-- Se LCP é uma imagem de background CSS -->
<link
  rel="preload"
  as="image"
  href="/hero.webp"
  fetchpriority="high"
  type="image/webp"
/>

<!-- Se LCP é uma fonte (raro) -->
<link
  rel="preload"
  as="font"
  href="/fonts/Inter.woff2"
  type="font/woff2"
  crossorigin
/>
```

### 2.4 Server-Side Rendering

```tsx
// SSR/SSG garante que HTML chega com conteúdo, não precisa de JS para renderizar
// Next.js App Router com Server Components = SSR/SSG por padrão

export default async function HeroSection() {
  const data = await getHeroData(); // Runs on server
  return (
    <section>
      <h1>{data.title}</h1>
      <Image src={data.image} priority alt="" width={1200} height={675} />
    </section>
  );
}
```

### 2.5 TTFB (Time to First Byte)

Target: < 800ms para TTFB.

| Otimização | Impacto |
|---|---|
| CDN (Vercel Edge, Cloudflare) | -60-80% TTFB |
| SSG/ISR (conteúdo pré-renderizado) | Elimina computação por request |
| Database query optimization | -30-50% em páginas dinâmicas |
| HTTP/3 | -10-15% latência |
| Edge middleware | -20-40% para personalização |

## 3. CLS Prevention

### 3.1 Causas Comuns de CLS

| Causa | CLS Típico | Solução |
|---|---|---|
| Imagens sem dimensões | 0.1-0.5 | width + height em todo `<img>` |
| Fontes FOUT (Flash of Unstyled Text) | 0.05-0.2 | `font-display: swap` + metric override |
| Anúncios/embeds sem espaço reservado | 0.1-0.3 | Espaço reservado com aspect-ratio |
| Conteúdo dinâmico injetado acima | 0.1-0.4 | Inserir abaixo do viewport ou com espaço reservado |
| CSS carregado tarde | 0.05-0.2 | CSS crítico inline |
| Lazy-loaded images sem placeholder | 0.05-0.15 | blur placeholder ou skeleton |

### 3.2 Dimensões Explícitas em Imagens

```tsx
{/* ✅ SEMPRE definir width + height */}
<Image src="/photo.webp" alt="" width={800} height={450} />

{/* Ou via CSS aspect-ratio se dimensões são dinâmicas */}
<div className="aspect-video relative">
  <Image src="/photo.webp" alt="" fill className="object-cover" />
</div>
```

### 3.3 Font Loading sem CLS

```tsx
// next/font elimina CLS de fontes automaticamente
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
```

Se não usar next/font:

```css
@font-face {
  font-family: 'Inter Fallback';
  src: local('Arial');
  ascent-override: 90.49%;
  descent-override: 22.56%;
  line-gap-override: 0%;
  size-adjust: 107.06%;
}
```

### 3.4 Espaço Reservado para Conteúdo Dinâmico

```tsx
{/* Skeleton com tamanho fixo previne CLS */}
<div className="min-h-[400px]">
  {isLoading ? (
    <Skeleton className="h-[400px] w-full rounded-2xl" />
  ) : (
    <DynamicContent data={data} />
  )}
</div>
```

## 4. INP Optimization

### 4.1 O que é INP

INP (Interaction to Next Paint) mede o tempo entre uma interação do usuário (click, tap, key press) e a próxima atualização visual da página. Substituiu FID em março 2024.

### 4.2 Causas de INP Ruim

| Causa | Impacto | Solução |
|---|---|---|
| Long tasks no main thread (>50ms) | Bloqueia interação | Code splitting, web workers |
| Hydration pesada | Bloqueia durante hydration | React Server Components, selective hydration |
| Event handlers lentos | Click/tap demorado | useTransition, debounce, virtualization |
| Third-party scripts | Competem pelo main thread | async/defer, web workers, partytown |
| DOM muito grande | Rendering lento | Virtualization, pagination |
| Reflow/repaint caro | Blocking visual update | GPU-only animations |

### 4.3 useTransition para Interações

```tsx
'use client';

import { useState, useTransition } from 'react';

export function SearchFilter({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [isPending, startTransition] = useTransition();

  function handleSearch(value: string) {
    setQuery(value); // Urgente: atualiza input imediatamente

    startTransition(() => {
      // Não-urgente: filtra em background, não bloqueia input
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(filtered);
    });
  }

  return (
    <>
      <input
        value={query}
        onChange={e => handleSearch(e.target.value)}
        placeholder="Buscar..."
      />
      <div className={isPending ? 'opacity-60' : ''}>
        {filteredItems.map(item => <Card key={item.id} item={item} />)}
      </div>
    </>
  );
}
```

### 4.4 Code Splitting

```tsx
// Dynamic import — componente carregado sob demanda
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/heavy-chart'), {
  loading: () => <Skeleton className="h-[400px]" />,
  ssr: false, // Se for client-only
});
```

### 4.5 Virtualization para Listas Grandes

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

export function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <ItemRow item={items[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 5. Page Speed vs. Conversão

### 5.1 Dados de Impacto

| Tempo de Load | Taxa de Bounce | Conversão Relativa |
|---|---|---|
| 1-2s | 9% | 100% (baseline) |
| 2-3s | 13% | -7% |
| 3-5s | 24% | -21% |
| 5-8s | 38% | -38% |
| 8-10s | 52% | -52% |
| 10s+ | 65%+ | -65%+ |

Fonte: Google/SOASTA, Deloitte Digital, Akamai — consolidação 2025.

### 5.2 Revenue Impact

```
E-commerce médio com receita de R$1M/mês:
- Melhoria de 1 segundo no load time:
  → +7% conversão = +R$70.000/mês
  → +R$840.000/ano

- Degradação de 1 segundo:
  → -7% conversão = -R$70.000/mês
```

## 6. Mobile Performance Priority

### 6.1 Por que Mobile é Prioridade

- 62.5% do tráfego é mobile (StatCounter Q1 2026)
- Mobile tem pior performance: 4G médio = ~30Mbps (vs 100Mbps+ desktop)
- Google Mobile-First Indexing: a versão mobile é a que rankeia
- Dispositivos Android entry-level: CPU 2-5x mais lenta que flagship

### 6.2 Mobile Performance Budget

| Recurso | Budget Mobile | Budget Desktop |
|---|---|---|
| First Load JS | < 130KB (gzipped) | < 200KB |
| Total page weight | < 1.5MB | < 3MB |
| LCP | < 2.5s em 4G | < 2.0s |
| INP | < 200ms | < 150ms |
| Número de requests | < 50 | < 80 |
| DOM size | < 1500 nodes | < 3000 nodes |

### 6.3 Teste em Condições Reais

```
Chrome DevTools → Performance → Network: Slow 4G, CPU: 4x slowdown
```

Ou Lighthouse com configuração mobile:
```bash
npx lighthouse https://exemplo.com.br --preset=perf --throttling-method=simulate --form-factor=mobile
```

## 7. CDN e Edge Deployment

### 7.1 Impacto do CDN

| Sem CDN | Com CDN | Melhoria |
|---|---|---|
| TTFB: 800ms (origem São Paulo, user em Recife) | TTFB: 50ms (edge em Recife) | -94% |
| TTFB: 2000ms (origem EUA, user no Brasil) | TTFB: 80ms (edge no Brasil) | -96% |

### 7.2 Edge Rendering (Vercel Edge Functions)

```tsx
// Middleware roda na edge (mais perto do usuário)
// middleware.ts
import { NextResponse } from 'next/server';

export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] };

export function middleware(request: Request) {
  const response = NextResponse.next();

  // Headers de cache otimizados
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Content-Type-Options', 'nosniff');

  return response;
}
```

### 7.3 Cache Headers

```tsx
// next.config.ts
const config = {
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};
```

## 8. Monitoramento Contínuo

### 8.1 web-vitals Library

```tsx
// app/components/web-vitals.tsx
'use client';

import { useEffect } from 'react';
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

export function WebVitals() {
  useEffect(() => {
    const report = (metric: { name: string; value: number; id: string }) => {
      // Enviar para analytics
      console.log(metric);
    };

    onCLS(report);
    onINP(report);
    onLCP(report);
    onFCP(report);
    onTTFB(report);
  }, []);

  return null;
}
```

### 8.2 Performance Budget no CI

```yaml
# .github/workflows/performance.yml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v12
  with:
    urls: |
      https://staging.exemplo.com.br/
      https://staging.exemplo.com.br/blog
    budgetPath: .lighthouserc.json
    uploadArtifacts: true
```

```json
// .lighthouserc.json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1800 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-byte-weight": ["warning", { "maxNumericValue": 1500000 }]
      }
    }
  }
}
```

## 9. Checklist de Performance SEO

- [ ] LCP ≤ 2.5s (field data)?
- [ ] CLS ≤ 0.1?
- [ ] INP ≤ 200ms?
- [ ] Hero image com `priority` / preload?
- [ ] Imagens em WebP/AVIF com srcset?
- [ ] Fontes com next/font ou metric override?
- [ ] First Load JS < 130KB (mobile)?
- [ ] SSG/ISR para conteúdo estável?
- [ ] CDN com edge caching?
- [ ] Third-party scripts async/defer?
- [ ] Code splitting para componentes pesados?
- [ ] Skeleton screens para loading states?
- [ ] Performance budget no CI?
- [ ] RUM em produção (web-vitals)?
