---
id: skill-generate-og-image
title: "Generate OG Image"
agent: 04-seo-specialist
version: 1.0
category: seo
priority: important
requires:
  - skill: skill-write-meta-tags
  - rule: 00-constitution
provides:
  - dynamic-og-images
  - social-share-previews
used_by:
  - agent: 04-seo-specialist
  - agent: 05-asset-creator
  - command: /new-page
---

# OG Image Dinâmica com next/og + Satori

## Conceito

Gerar imagens de preview para redes sociais em tempo de build/request usando JSX → Satori → PNG. Edge Runtime com ~100ms de resposta.

## Restrições do Satori

- **Apenas flexbox** — sem CSS Grid, sem position absolute/relative (use flex)
- **Inline styles obrigatório** — sem classes CSS, sem Tailwind
- **Fontes como ArrayBuffer** — precisam ser carregadas explicitamente
- **Sem tags interativas** — apenas `div`, `span`, `p`, `img`
- **Dimensões fixas** — 1200×630 para OG, 1200×1200 para quadrado

## Estrutura de Arquivo

```
src/app/
├── opengraph-image.tsx          ← OG estática da home
├── blog/
│   └── [slug]/
│       └── opengraph-image.tsx  ← OG dinâmica por post
```

## Fonte como ArrayBuffer

```typescript
// src/lib/og-fonts.ts
export async function loadFonts() {
  const [fontBold, fontRegular] = await Promise.all([
    fetch(new URL('../../public/fonts/Inter-Bold.ttf', import.meta.url)).then(
      (res) => res.arrayBuffer()
    ),
    fetch(new URL('../../public/fonts/Inter-Regular.ttf', import.meta.url)).then(
      (res) => res.arrayBuffer()
    ),
  ])

  return { fontBold, fontRegular }
}
```

## OG Estática da Home

```typescript
// src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { loadFonts } from '@/lib/og-fonts'

export const runtime = 'edge'
export const alt = 'NomeDaMarca — Frase de Posicionamento'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
  const { fontBold, fontRegular } = await loadFonts()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          fontFamily: 'Inter',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src="https://seudominio.com.br/icon-white.png"
            width={48}
            height={48}
            style={{ borderRadius: '12px' }}
          />
          <span style={{ color: '#94a3b8', fontSize: '24px', fontFamily: 'Inter' }}>
            NomeDaMarca
          </span>
        </div>

        {/* Título */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: '#f8fafc',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Transforme sua presença digital
          </h1>
          <p
            style={{
              fontSize: '28px',
              color: '#94a3b8',
              margin: 0,
            }}
          >
            Sites rápidos, bonitos e que convertem.
          </p>
        </div>

        {/* Rodapé */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#64748b', fontSize: '20px' }}>seudominio.com.br</span>
          <div
            style={{
              display: 'flex',
              padding: '12px 28px',
              background: '#3b82f6',
              borderRadius: '9999px',
              color: '#fff',
              fontSize: '20px',
              fontWeight: 600,
            }}
          >
            Saiba mais →
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Inter', data: fontBold, weight: 700, style: 'normal' },
        { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
      ],
    }
  )
}
```

## OG Dinâmica por Post

```typescript
// src/app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@/lib/posts'
import { loadFonts } from '@/lib/og-fonts'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export const alt = 'Imagem do post'

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  const { fontBold, fontRegular } = await loadFonts()

  const title = post?.title ?? 'Blog | NomeDaMarca'
  const category = post?.category ?? 'Artigo'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          fontFamily: 'Inter',
        }}
      >
        <div
          style={{
            display: 'flex',
            padding: '8px 20px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '9999px',
            color: '#c7d2fe',
            fontSize: '18px',
            fontWeight: 600,
            alignSelf: 'flex-start',
          }}
        >
          {category}
        </div>

        <h1
          style={{
            fontSize: title.length > 60 ? '48px' : '56px',
            fontWeight: 700,
            color: '#f8fafc',
            lineHeight: 1.15,
            margin: 0,
            maxHeight: '280px',
            overflow: 'hidden',
          }}
        >
          {title}
        </h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="https://seudominio.com.br/icon-white.png"
              width={36}
              height={36}
              style={{ borderRadius: '8px' }}
            />
            <span style={{ color: '#a5b4fc', fontSize: '20px' }}>NomeDaMarca</span>
          </div>
          <span style={{ color: '#6366f1', fontSize: '18px' }}>seudominio.com.br</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Inter', data: fontBold, weight: 700, style: 'normal' },
        { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
      ],
    }
  )
}
```

## Cache e Headers

O Next.js automaticamente define:
- `Cache-Control: public, immutable, no-transform, max-age=31536000`
- Content-Type baseado em `contentType`

Para invalidar cache em revalidações:

```typescript
export const revalidate = 3600 // revalida a cada 1h
```

## Estratégia de Fallback

Se a geração dinâmica falhar, configure uma imagem estática:

```typescript
// src/app/blog/[slug]/opengraph-image.tsx
export default async function OgImage({ params }: Props) {
  try {
    const { slug } = await params
    const post = await getPostBySlug(slug)
    if (!post) return staticFallback()
    // ... render dinâmico
  } catch {
    return staticFallback()
  }
}

function staticFallback() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#0f172a' }}>
        <img src="https://seudominio.com.br/og-default.png" width={1200} height={630} />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

## Checklist

- [ ] Fonte carregada como ArrayBuffer (não URL externa)
- [ ] `runtime = 'edge'` declarado
- [ ] Dimensão 1200×630
- [ ] Apenas flexbox, sem Grid
- [ ] `alt` text descritivo exportado
- [ ] Fallback para erro de geração
- [ ] Testar preview em [ogimage.dev](https://ogimage.dev)
