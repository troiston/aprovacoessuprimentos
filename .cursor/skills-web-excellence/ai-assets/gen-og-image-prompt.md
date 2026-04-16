---
id: skill-gen-og-image-prompt
title: "Generate OG Image Prompt"
agent: 05-asset-creator
version: 1.0
category: ai-assets
priority: standard
requires:
  - skill: skill-generate-og-image
  - rule: 00-constitution
provides:
  - og-image-jsx-templates
  - satori-compatible-designs
used_by:
  - agent: 05-asset-creator
  - command: /gen-image
---

# Templates JSX para OG Image Dinâmica (next/og)

## Restrições do Satori — Referência Rápida

| Permitido | Proibido |
|-----------|----------|
| `display: flex` | `display: grid` |
| `flexDirection`, `gap` | `position: absolute/relative` |
| `justifyContent`, `alignItems` | CSS classes |
| `border`, `borderRadius` | Tailwind |
| `background` (linear-gradient) | `@keyframes` |
| `fontSize`, `fontWeight` | `::before`, `::after` |
| `color`, `opacity` | Media queries |
| `padding`, `margin` | `transform` |
| `maxWidth`, `overflow: hidden` | `animation` |
| `textOverflow: ellipsis` | External CSS files |
| `div`, `span`, `p`, `img` | `button`, `input`, `a` |

## Template 1 — Blog Post

```typescript
// src/app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Artigo do blog'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function OgImage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  const fontBold = await fetch(
    new URL('../../../../public/fonts/Inter-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  const fontRegular = await fetch(
    new URL('../../../../public/fonts/Inter-Regular.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

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
          background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 60%, #334155 100%)',
          fontFamily: 'Inter',
        }}
      >
        {/* Badge da categoria */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              padding: '6px 16px',
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '9999px',
              color: '#60a5fa',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            {post?.category ?? 'Blog'}
          </div>
          <span style={{ color: '#64748b', fontSize: '16px' }}>
            {post?.readingTime ?? '5'} min de leitura
          </span>
        </div>

        {/* Título do post */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1
            style={{
              fontSize: (post?.title?.length ?? 0) > 50 ? '48px' : '56px',
              fontWeight: 700,
              color: '#f1f5f9',
              lineHeight: 1.15,
              margin: 0,
              maxHeight: '250px',
              overflow: 'hidden',
            }}
          >
            {post?.title ?? 'Título do Artigo'}
          </h1>
        </div>

        {/* Rodapé com logo e autor */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={post?.author?.avatar ?? 'https://seudominio.com.br/icon.png'}
              width={40}
              height={40}
              style={{ borderRadius: '9999px' }}
            />
            <span style={{ color: '#94a3b8', fontSize: '18px' }}>
              {post?.author?.name ?? 'NomeDaMarca'}
            </span>
          </div>
          <span style={{ color: '#475569', fontSize: '16px' }}>seudominio.com.br</span>
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

## Template 2 — Página de Produto

```typescript
export default async function OgImage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  const { fontBold, fontRegular } = await loadFonts()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#ffffff',
          fontFamily: 'Inter',
        }}
      >
        {/* Lado esquerdo — imagem do produto */}
        <div
          style={{
            width: '50%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f8fafc',
          }}
        >
          <img
            src={product?.image ?? 'https://seudominio.com.br/placeholder.png'}
            width={400}
            height={400}
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Lado direito — info */}
        <div
          style={{
            width: '50%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px 50px',
            gap: '20px',
          }}
        >
          <span style={{ color: '#64748b', fontSize: '16px', fontWeight: 600 }}>
            {product?.category ?? 'Categoria'}
          </span>
          <h1
            style={{
              fontSize: '40px',
              fontWeight: 700,
              color: '#0f172a',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {product?.name ?? 'Nome do Produto'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '36px', fontWeight: 700, color: '#16a34a' }}>
              R$ {product?.price?.toFixed(2) ?? '99,90'}
            </span>
            {product?.originalPrice && (
              <span
                style={{
                  fontSize: '20px',
                  color: '#94a3b8',
                  textDecoration: 'line-through',
                }}
              >
                R$ {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              padding: '10px 24px',
              background: '#3b82f6',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '18px',
              fontWeight: 600,
              alignSelf: 'flex-start',
            }}
          >
            Ver produto →
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

## Template 3 — Landing Page (Genérico)

```typescript
export default async function OgImage() {
  const { fontBold } = await loadFonts()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontFamily: 'Inter',
          textAlign: 'center',
        }}
      >
        <img
          src="https://seudominio.com.br/icon-white.png"
          width={80}
          height={80}
          style={{ marginBottom: '30px' }}
        />
        <h1
          style={{
            fontSize: '60px',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.15,
            margin: 0,
            maxWidth: '900px',
          }}
        >
          Transforme sua presença digital
        </h1>
        <p
          style={{
            fontSize: '24px',
            color: 'rgba(255,255,255,0.8)',
            marginTop: '20px',
            maxWidth: '700px',
          }}
        >
          Sites rápidos, bonitos e que convertem visitantes em clientes.
        </p>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Inter', data: fontBold, weight: 700, style: 'normal' }],
    }
  )
}
```

## Integração de Cores da Marca

Ler tokens de design do projeto para gerar OG images consistentes:

```typescript
const BRAND_COLORS = {
  primary: '#3b82f6',
  primaryDark: '#1e40af',
  background: '#0f172a',
  backgroundLight: '#1e293b',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  accent: '#f59e0b',
}

function buildGradient(style: 'dark' | 'light' | 'brand') {
  const gradients = {
    dark: `linear-gradient(135deg, ${BRAND_COLORS.background} 0%, ${BRAND_COLORS.backgroundLight} 100%)`,
    light: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    brand: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%)`,
  }
  return gradients[style]
}
```

## Checklist

- [ ] Apenas flexbox — nenhum Grid
- [ ] Inline styles — nenhuma classe CSS
- [ ] Fonte como ArrayBuffer carregada
- [ ] `runtime = 'edge'` declarado
- [ ] Dimensão 1200×630
- [ ] Cores da marca consistentes
- [ ] Fallback para dados ausentes
- [ ] Texto truncado com `overflow: hidden`
