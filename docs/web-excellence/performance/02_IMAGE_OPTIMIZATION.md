---
id: doc-image-optimization
title: Guia Completo de Otimização de Imagens
version: 2.0
last_updated: 2026-04-07
category: performance
priority: critical
related:
  - docs/web-excellence/performance/01_CORE_WEB_VITALS.md
  - docs/web-excellence/components/01_HERO_PATTERNS.md
  - .cursor/rules/quality/performance.mdc
---

# Guia Completo de Otimização de Imagens

## Visão Geral

Imagens representam **~50% do peso total** de páginas web (HTTP Archive, 2025). Otimização de imagens é a forma mais impactante de melhorar LCP e tempo de carregamento. AVIF economiza **20% a mais que WebP** e **50% a mais que JPEG**, com suporte de **93% dos browsers** em 2026.

---

## 1. Formatos de Imagem

### 1.1 Comparação de Formatos

| Formato | Compressão vs JPEG | Suporte (2026) | Uso Ideal |
|---------|-------------------|----------------|-----------|
| **AVIF** | -50% | 93% | Formato preferencial para tudo |
| **WebP** | -30% | 97% | Fallback para AVIF |
| **JPEG** | Baseline | 100% | Legacy fallback |
| **PNG** | +200-500% vs JPEG | 100% | Transparência com bordas duras |
| **SVG** | N/A (vetorial) | 100% | Ícones, logos, ilustrações simples |
| **WebP (lossless)** | -26% vs PNG | 97% | Transparência com boa compressão |

### 1.2 Quando Usar Cada Formato

| Conteúdo | Formato Primário | Fallback |
|----------|-----------------|----------|
| Fotos (hero, produto) | AVIF | WebP → JPEG |
| Screenshots | AVIF | WebP → PNG |
| Logos | SVG | PNG (se complexo) |
| Ícones | SVG (inline) | N/A |
| Ilustrações simples | SVG | PNG |
| Backgrounds com gradient | CSS | SVG |
| Animações curtas | Video (MP4) | GIF → WebP animado |

---

## 2. next/image — Componente Otimizado

### 2.1 Props Essenciais

| Prop | Obrigatória? | Default | Impacto |
|------|-------------|---------|---------|
| `src` | ✅ | - | URL da imagem |
| `alt` | ✅ | - | Acessibilidade e SEO |
| `width` / `height` | ✅ (ou fill) | - | Previne CLS |
| `sizes` | 🔴 Crítica | `100vw` | **40-60% redução de payload** se configurado |
| `priority` | LCP only | `false` | Preload para elemento LCP |
| `quality` | Opcional | 75 | Balanço qualidade/tamanho |
| `placeholder` | Opcional | `empty` | CLS prevention com blur |
| `loading` | Opcional | `lazy` | `eager` apenas para LCP |

### 2.2 A Prop `sizes` — A Mais Subestimada

O `sizes` informa ao browser qual largura a imagem ocupará em cada viewport, permitindo baixar a versão correta. **Sem `sizes`, o browser assume `100vw` e pode baixar uma imagem 2-3x maior que o necessário.**

| Layout | Sizes Correto | Economia |
|--------|--------------|----------|
| Full-width | `100vw` | Baseline |
| Split (50%) | `(max-width: 768px) 100vw, 50vw` | ~40% em desktop |
| Grid 3-col | `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw` | ~50% em desktop |
| Thumbnail | `(max-width: 768px) 50vw, 200px` | ~70% em desktop |
| Sidebar | `(max-width: 768px) 100vw, 300px` | ~60% em desktop |

### 2.3 Exemplos de Uso

```tsx
// Hero image — Full width, LCP element
<Image
  src="/hero.avif"
  alt="Dashboard mostrando métricas em tempo real"
  width={1440}
  height={810}
  priority
  sizes="100vw"
  quality={75}
  placeholder="blur"
  blurDataURL={heroBlurDataURL}
/>

// Product image em grid de 3 colunas
<Image
  src={product.image}
  alt={product.name}
  width={600}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={80}
/>

// Avatar / Thumbnail
<Image
  src={user.avatar}
  alt={user.name}
  width={48}
  height={48}
  sizes="48px"
  className="rounded-full"
/>

// Background decorativo (não é LCP)
<Image
  src="/pattern.avif"
  alt=""
  fill
  sizes="100vw"
  quality={60}
  className="object-cover"
  aria-hidden="true"
/>
```

---

## 3. Blur Placeholder

### 3.1 Tipos de Placeholder

| Tipo | CLS | UX | Performance |
|------|-----|-----|------------|
| Nenhum | Ruim (shift quando carrega) | Ruim | Boa |
| `blur` (base64 inline) | Bom | Bom | +~100 bytes por imagem |
| Dominant color | Bom | OK | +~50 bytes |
| LQIP (Low Quality Image) | Bom | Muito bom | +200-500 bytes |
| Skeleton | Bom | OK | Nenhum overhead |

### 3.2 Gerando BlurDataURL

```tsx
// Estático (build time) — Importação direta
import heroImage from '@/public/hero.avif'
<Image src={heroImage} alt="..." placeholder="blur" />

// Dinâmico — Gerar no servidor
import { getPlaiceholder } from 'plaiceholder'

async function getBlurDataURL(src: string) {
  const buffer = await fetch(src).then((res) => res.arrayBuffer())
  const { base64 } = await getPlaiceholder(Buffer.from(buffer))
  return base64
}

// Shimmer placeholder (leve, sem dependência)
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="0%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)" />
</svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)
```

---

## 4. Responsive Images (Art Direction)

### 4.1 Quando Usar `<picture>`

Usar `<picture>` quando a **composição da imagem** muda entre breakpoints (crop diferente, imagem diferente):

```tsx
<picture>
  {/* Mobile: crop quadrado focando no rosto */}
  <source
    media="(max-width: 768px)"
    srcSet="/hero-mobile.avif"
    type="image/avif"
  />
  <source
    media="(max-width: 768px)"
    srcSet="/hero-mobile.webp"
    type="image/webp"
  />
  {/* Desktop: crop widescreen */}
  <source
    srcSet="/hero-desktop.avif"
    type="image/avif"
  />
  <source
    srcSet="/hero-desktop.webp"
    type="image/webp"
  />
  <img
    src="/hero-desktop.jpg"
    alt="Equipe colaborando no produto"
    width={1440}
    height={810}
    loading="eager"
    fetchPriority="high"
  />
</picture>
```

### 4.2 `<picture>` vs `sizes`

| Cenário | Usar | Motivo |
|---------|------|--------|
| Mesma imagem, tamanhos diferentes | `sizes` prop | Browser escolhe srcset ótimo |
| Imagens diferentes por viewport | `<picture>` | Art direction (crops diferentes) |
| Formato moderno com fallback | `next/image` (auto) | Next.js gera formatos automaticamente |

---

## 5. Configurações de Qualidade

### 5.1 Guidelines por Tipo de Conteúdo

| Tipo | Quality | Motivo |
|------|---------|--------|
| Fotos (hero, produto) | 75 | Balanço qualidade/tamanho |
| Screenshots UI | 85-90 | Texto precisa ser legível |
| Thumbnails | 60-70 | Pequenas, compressão menos notável |
| Background decorativo | 50-60 | Detalhes não importam |
| Imagens com texto overlay | 65-75 | Foco está no texto sobreposto |

### 5.2 next.config.js — Configuração Global

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
}
```

---

## 6. Remote Patterns e Domínios

### 6.1 Configuração Segura

```js
// next.config.js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
    {
      protocol: 'https',
      hostname: '*.supabase.co',
      pathname: '/storage/v1/object/public/**',
    },
    {
      protocol: 'https',
      hostname: 'avatars.githubusercontent.com',
    },
  ],
}
```

> NUNCA usar `domains` (deprecated) — use `remotePatterns` com hostname específico e pathname quando possível.

---

## 7. Lazy Loading

### 7.1 Regras

| Posição | Loading | Motivo |
|---------|---------|--------|
| Above-the-fold (LCP) | `priority` (eager) | Carregar ASAP |
| Above-the-fold (não LCP) | `eager` | Visível imediatamente |
| Below-the-fold | `lazy` (default) | Carregar sob demanda |
| Carrossel (slide 1) | `eager` | Visível imediatamente |
| Carrossel (slides 2+) | `lazy` | Carregar sob demanda |

### 7.2 Intersection Observer Custom

Para lazy loading de conteúdo pesado além de imagens:

```tsx
function useLazyLoad(ref: RefObject<HTMLElement>, rootMargin = '200px') {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref, rootMargin])

  return isVisible
}
```

---

## 8. SVG Optimization

### 8.1 Guidelines

| Aspecto | Regra |
|---------|-------|
| Ícones | SVG inline (componente React) para controle de cor via `currentColor` |
| Logos | SVG como arquivo, `<Image>` se não precisa de controle de cor |
| Ilustrações | SVG como arquivo, otimizado com SVGO |
| Tamanho | SVGO reduz 40-80% do tamanho |

### 8.2 SVGO Configuration

```js
// svgo.config.js
module.exports = {
  plugins: [
    'preset-default',
    'removeDimensions',
    { name: 'removeViewBox', active: false },
    { name: 'sortAttrs' },
  ],
}
```

---

## 9. Checklist de Otimização de Imagens

| # | Item | Prioridade | Impacto |
|---|------|-----------|---------|
| 1 | Usar AVIF como formato primário | 🔴 Crítico | -50% tamanho |
| 2 | Configurar `sizes` correto em toda imagem | 🔴 Crítico | -40-60% download |
| 3 | `priority` no elemento LCP | 🔴 Crítico | -500ms LCP |
| 4 | `placeholder="blur"` em todas as imagens | 🟡 Alto | CLS = 0 |
| 5 | Width/height explícitos (previne CLS) | 🟡 Alto | CLS = 0 |
| 6 | Quality ajustado por contexto (75 foto, 90 UI) | 🟡 Alto | -20% tamanho |
| 7 | Lazy load abaixo do fold (default) | 🟢 Médio | Menos requests iniciais |
| 8 | SVGs otimizados com SVGO | 🟢 Médio | -40-80% tamanho SVG |
| 9 | Remote patterns configurados (não domains) | 🟢 Médio | Segurança |
| 10 | Alt text descritivo em toda imagem | 🟢 Médio | Acessibilidade + SEO |

---

## Fontes e Referências

- HTTP Archive Web Almanac 2025 — Images Chapter
- Google Web Vitals — Image Optimization Guide 2026
- Next.js Documentation — Image Component
- Squoosh — Image Compression Research (Google)
- AVIF.io — Format Comparison Data
- Cloudinary — Image Optimization Report 2025
