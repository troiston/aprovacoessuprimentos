---
id: skill-optimize-images
title: "Optimize Images"
agent: 06-qa-auditor
version: 1.0
category: performance
priority: critical
requires:
  - rule: 00-constitution
provides:
  - imagens otimizadas com AVIF/WebP
  - LCP abaixo de 2.5s
  - CLS zero em carregamento de imagens
used_by:
  - agent: 06-qa-auditor
  - command: /audit-full
---

# Otimização de Imagens

## Regra Absoluta

**Toda imagem visível DEVE usar `next/image`.** Nunca usar `<img>` nativo. O componente `Image` do Next.js fornece otimização automática, lazy loading, e prevenção de CLS.

## Formato e Qualidade

O Next.js serve AVIF automaticamente quando o navegador suporta, com fallback para WebP. Configure no `next.config.ts`:

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 ano
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.exemplo.com.br',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
```

### Qualidade por Contexto

| Tipo de Imagem | Quality | Justificativa |
|---|---|---|
| Fotos (hero, galeria) | 75 | Equilíbrio visual vs peso |
| UI com texto (badges, overlays) | 90 | Texto precisa nitidez |
| Ícones/logos | 95 | Poucos pixels, qualidade máxima |
| Thumbnails | 60 | Tamanho pequeno, economia máxima |

## Prop `sizes` — Cálculo por Contexto

A prop `sizes` é **obrigatória** para imagens responsivas. Sem ela, o browser baixa a versão maior.

### Hero Full-Width

```tsx
import Image from 'next/image'
import heroImg from '@/assets/hero.jpg'

export function HeroSection() {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden">
      <Image
        src={heroImg}
        alt="Descrição significativa do hero"
        fill
        sizes="100vw"
        priority
        quality={75}
        className="object-cover"
        placeholder="blur"
      />
    </section>
  )
}
```

### Card em Grid Responsivo

```tsx
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={75}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          placeholder="blur"
          blurDataURL={product.blurHash}
        />
      </div>
    </article>
  )
}
```

### Thumbnail em Lista

```tsx
export function ArticleListItem({ article }: { article: Article }) {
  return (
    <li className="flex gap-4">
      <div className="relative size-16 shrink-0 overflow-hidden rounded">
        <Image
          src={article.thumbnail}
          alt=""
          fill
          sizes="64px"
          quality={60}
          className="object-cover"
        />
      </div>
      <div>
        <h3>{article.title}</h3>
      </div>
    </li>
  )
}
```

### Referência Rápida para `sizes`

```
Hero full-width:           sizes="100vw"
2 colunas (mobile 1):     sizes="(max-width: 768px) 100vw, 50vw"
3 colunas (mobile 1):     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
4 colunas (mobile 2):     sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
Sidebar (fixo):           sizes="300px"
Avatar:                   sizes="48px"
Thumbnail:                sizes="64px"
```

## LCP — Prop `priority`

Apenas **1 a 2 imagens por página** devem ter `priority`. Essa prop:
- Remove `loading="lazy"` (que é o default)
- Adiciona `<link rel="preload">` no `<head>`
- Garante que o LCP element carregue o mais rápido possível

```tsx
// ✅ Hero image — priority
<Image src={hero} alt="..." priority sizes="100vw" fill />

// ✅ Logo no header — priority (se for LCP)
<Image src={logo} alt="Logo" priority width={160} height={40} />

// ❌ NUNCA colocar priority em imagens below the fold
<Image src={card} alt="..." sizes="33vw" fill /> // lazy por default, correto
```

## Placeholder Strategy

### Imagens Locais (import estático)

O Next.js gera `blurDataURL` automaticamente:

```tsx
import heroImage from '@/assets/hero.jpg'

<Image
  src={heroImage}
  alt="Hero"
  placeholder="blur" // blur automático, sem config extra
  priority
  fill
  sizes="100vw"
/>
```

### Imagens Remotas

Gere o `blurDataURL` no build ou no servidor:

```typescript
// lib/blur-data-url.ts
import { getPlaiceholder } from 'plaiceholder'

export async function getBlurDataURL(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl)
  const buffer = Buffer.from(await response.arrayBuffer())
  const { base64 } = await getPlaiceholder(buffer, { size: 10 })
  return base64
}
```

```tsx
// Em Server Component
import { getBlurDataURL } from '@/lib/blur-data-url'

export default async function Page() {
  const blurDataURL = await getBlurDataURL(product.imageUrl)

  return (
    <Image
      src={product.imageUrl}
      alt={product.name}
      placeholder="blur"
      blurDataURL={blurDataURL}
      fill
      sizes="100vw"
    />
  )
}
```

### Placeholder com cor sólida (alternativa leve)

```tsx
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${w}" height="${h}" fill="oklch(0.92 0 0)"/>
</svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

<Image
  src={remoteUrl}
  alt="Produto"
  placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

## Art Direction com `<picture>`

Para casos que exigem imagens diferentes por viewport (crop diferente, não apenas resize):

```tsx
export function HeroArtDirected() {
  return (
    <picture>
      <source
        media="(min-width: 1024px)"
        srcSet="/hero-desktop.avif"
        type="image/avif"
      />
      <source
        media="(min-width: 1024px)"
        srcSet="/hero-desktop.webp"
        type="image/webp"
      />
      <source
        srcSet="/hero-mobile.avif"
        type="image/avif"
      />
      <source
        srcSet="/hero-mobile.webp"
        type="image/webp"
      />
      {/* Fallback com next/image para otimização */}
      <Image
        src="/hero-mobile.webp"
        alt="Hero com art direction"
        width={1200}
        height={600}
        priority
        className="h-[60vh] w-full object-cover"
      />
    </picture>
  )
}
```

## Fill Mode com Aspect Ratio

```tsx
// Container com aspect ratio controlado via CSS
<div className="relative aspect-video w-full overflow-hidden rounded-2xl">
  <Image
    src={video.thumbnail}
    alt={video.title}
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
    className="object-cover"
  />
</div>

// Container com aspect ratio customizado
<div className="relative aspect-[3/4] w-full overflow-hidden">
  <Image
    src={portrait}
    alt="Retrato"
    fill
    sizes="(max-width: 640px) 50vw, 25vw"
    className="object-cover object-top" // object-top para rostos
  />
</div>
```

## Checklist de Auditoria

- [ ] Toda `<img>` substituída por `next/image`
- [ ] `sizes` definido corretamente para cada contexto
- [ ] `priority` apenas em 1-2 imagens above the fold
- [ ] `placeholder="blur"` em todas imagens visíveis
- [ ] `quality` ajustado por tipo (75 fotos, 90 UI)
- [ ] `remotePatterns` configurado para todos os domínios externos
- [ ] `alt` descritivo em imagens informativas, `alt=""` em decorativas
- [ ] Formatos AVIF/WebP habilitados no config
- [ ] Nenhuma imagem acima de 200KB após otimização
- [ ] LCP image preloaded (verificar no DevTools Network)
