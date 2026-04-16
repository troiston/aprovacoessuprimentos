---
id: skill-write-meta-tags
title: "Write Meta Tags"
agent: 04-seo-specialist
version: 1.0
category: seo
priority: critical
requires:
  - rule: 00-constitution
provides:
  - metadata-completa-next
  - open-graph-tags
  - twitter-cards
used_by:
  - agent: 04-seo-specialist
  - command: /new-page
---

# Metadata Completa via Next.js Metadata API

## Quando Usar

Toda página pública DEVE ter metadata. Sem exceção. Páginas sem metadata são invisíveis para buscadores.

## metadataBase — Configurar Uma Vez

No `layout.tsx` raiz, defina a base para todas as URLs relativas:

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://seudominio.com.br'),
  title: {
    template: '%s | NomeDaMarca',
    default: 'NomeDaMarca — Frase de Posicionamento',
  },
  description: 'Descrição padrão do site com até 160 caracteres focada em benefício principal.',
  alternates: {
    canonical: '/',
    languages: {
      'pt-BR': '/',
      'en-US': '/en',
      'es': '/es',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'NomeDaMarca',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'NomeDaMarca — Frase de Posicionamento',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@handle',
    creator: '@handle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

## Página Estática — Exportar `metadata`

```typescript
// src/app/sobre/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nós',
  description: 'Conheça a história e os valores da NomeDaMarca. Transparência e inovação desde 2020.',
  alternates: {
    canonical: '/sobre',
  },
  openGraph: {
    title: 'Sobre Nós | NomeDaMarca',
    description: 'Conheça a história e os valores da NomeDaMarca.',
    url: '/sobre',
    images: [{ url: '/og-sobre.png', width: 1200, height: 630 }],
  },
}

export default function SobrePage() {
  return <main>...</main>
}
```

## Página Dinâmica — `generateMetadata`

```typescript
// src/app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPostSlugs } from '@/lib/posts'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) return {}

  const ogImage = post.coverImage
    ? { url: post.coverImage, width: 1200, height: 630, alt: post.title }
    : { url: `/api/og?title=${encodeURIComponent(post.title)}`, width: 1200, height: 630 }

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `/blog/${slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImage.url],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return <article>...</article>
}
```

## Checklist de Validação

| Campo | Obrigatório | Limite |
|-------|:-----------:|--------|
| `title` | Sim | 50-60 chars |
| `description` | Sim | 120-160 chars |
| `canonical` | Sim | URL absoluta |
| `og:title` | Sim | 60 chars |
| `og:description` | Sim | 155 chars |
| `og:image` | Sim | 1200×630px |
| `og:type` | Sim | website/article |
| `twitter:card` | Sim | summary_large_image |
| `alternates` | Se i18n | hreflang correto |

## Template `title` — Padrão `%s`

O `%s` no template é substituído pelo título da página filha:
- Layout raiz: `template: '%s | Marca'`
- Página "Sobre": `title: 'Sobre Nós'` → renderiza `Sobre Nós | Marca`
- Página raiz usa `default` quando nenhum filho define título

## Erros Comuns

1. **Esquecer `metadataBase`** → URLs relativas quebram no OG
2. **Duplicar canonical** → use `alternates.canonical` relativo, não absoluto
3. **`og:image` sem dimensões** → preview quebrado em redes sociais
4. **Título > 60 chars** → truncado no Google com reticências
5. **Descrição genérica** → CTR baixo mesmo com posição alta
