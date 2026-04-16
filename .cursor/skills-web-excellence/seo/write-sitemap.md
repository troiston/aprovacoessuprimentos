---
id: skill-write-sitemap
title: "Write Sitemap"
agent: 04-seo-specialist
version: 1.0
category: seo
priority: important
requires:
  - rule: 00-constitution
provides:
  - sitemap-xml
  - robots-txt
used_by:
  - agent: 04-seo-specialist
  - command: /audit-seo
---

# Sitemap e Robots.txt Programáticos

## sitemap.ts — Geração Dinâmica

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL = 'https://seudominio.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Rotas estáticas do app
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/sobre`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contato`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/precos`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // Posts do blog via CMS/Prisma
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  })

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Produtos (se ecommerce)
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  })

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/produtos/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Rotas a EXCLUIR (não incluir no sitemap)
  // - /api/* (rotas de API)
  // - /admin/* (painel protegido)
  // - /auth/* (login, signup)
  // - /dashboard/* (área logada)

  return [...staticRoutes, ...blogRoutes, ...productRoutes]
}
```

## Sitemap Segmentado (Sites Grandes)

Para sites com >50.000 URLs, use múltiplos sitemaps:

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://seudominio.com.br', lastModified: new Date(), priority: 1.0 },
    { url: 'https://seudominio.com.br/sobre', lastModified: new Date(), priority: 0.8 },
  ]
}

// src/app/blog/sitemap.ts — sitemap separado para blog
export async function generateSitemaps() {
  const totalPosts = await prisma.post.count({ where: { published: true } })
  const POSTS_PER_SITEMAP = 50000
  const sitemapCount = Math.ceil(totalPosts / POSTS_PER_SITEMAP)

  return Array.from({ length: sitemapCount }, (_, i) => ({ id: i }))
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  const POSTS_PER_SITEMAP = 50000
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    skip: id * POSTS_PER_SITEMAP,
    take: POSTS_PER_SITEMAP,
    orderBy: { updatedAt: 'desc' },
  })

  return posts.map((post) => ({
    url: `https://seudominio.com.br/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }))
}
```

## robots.ts — Regras por Ambiente

```typescript
// src/app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === 'production'
    && process.env.VERCEL_ENV === 'production'

  if (!isProduction) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/auth/',
          '/dashboard/',
          '/settings/',
          '/checkout/',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
    ],
    sitemap: 'https://seudominio.com.br/sitemap.xml',
  }
}
```

## Guia de `priority`

| Tipo de Página | Priority | changeFrequency |
|---------------|:--------:|:---------------:|
| Home | 1.0 | weekly |
| Preços/Pricing | 0.9 | weekly |
| Blog index | 0.9 | daily |
| Categorias | 0.8 | weekly |
| Sobre/Contato | 0.8 | monthly |
| Posts individuais | 0.7 | weekly |
| Produtos | 0.8 | daily |
| Legal (termos) | 0.3 | yearly |

## Checklist

- [ ] Todas as páginas públicas incluídas
- [ ] Rotas protegidas (api, admin, auth, dashboard) excluídas
- [ ] `lastModified` reflete data real de atualização
- [ ] robots.txt bloqueia indexação em staging/preview
- [ ] robots.txt aponta para sitemap.xml
- [ ] Bots de scraping de IA (GPTBot, CCBot) bloqueados se desejado
- [ ] Submeter sitemap no Google Search Console após deploy
