---
id: doc-seo-technical
title: SEO Técnico
version: 2.0
last_updated: 2026-04-07
category: seo
priority: critical
related:
  - docs/web-excellence/seo/02_SEO_CONTENT.md
  - docs/web-excellence/seo/03_SEO_PERFORMANCE.md
  - docs/web-excellence/seo/05_SEO_CHECKLIST.md
  - .cursor/rules/stack/nextjs.mdc
  - .cursor/rules/quality/seo.mdc
---

# SEO Técnico — Next.js 15+

## 1. Metadata API do Next.js

### 1.1 metadataBase

Define a URL base para todas as metadata relativas. Obrigatório para OG images, canonical, etc.

```tsx
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://exemplo.com.br'),
  title: {
    default: 'Empresa — Transforme ideias em realidade',
    template: '%s | Empresa',
  },
  description: 'Descrição padrão com 150-160 caracteres para meta description.',
  keywords: ['palavra-chave-1', 'palavra-chave-2'],
  authors: [{ name: 'Empresa', url: 'https://exemplo.com.br' }],
  creator: 'Empresa',
  publisher: 'Empresa',
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
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://exemplo.com.br',
    siteName: 'Empresa',
    title: 'Empresa — Transforme ideias em realidade',
    description: 'Descrição para compartilhamento social.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Empresa — Banner principal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Empresa — Transforme ideias em realidade',
    description: 'Descrição para Twitter/X.',
    images: ['/og-image.jpg'],
    creator: '@empresa',
  },
  alternates: {
    canonical: 'https://exemplo.com.br',
    languages: {
      'pt-BR': 'https://exemplo.com.br',
      'en-US': 'https://exemplo.com.br/en',
      'es-ES': 'https://exemplo.com.br/es',
    },
  },
  verification: {
    google: 'google-verification-code',
  },
};
```

### 1.2 title.template

O `template` define o padrão de título para páginas filhas:

```tsx
// app/layout.tsx
title: {
  default: 'Empresa — Solução completa',  // Homepage
  template: '%s | Empresa',                // Outras páginas: "Sobre | Empresa"
},

// app/sobre/page.tsx
export const metadata: Metadata = {
  title: 'Sobre Nós',  // Renderiza: "Sobre Nós | Empresa"
};
```

### 1.3 generateMetadata (Dinâmico)

Para páginas com dados dinâmicos (blog posts, produtos):

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: 'Post não encontrado' };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}
```

## 2. Estratégias de Renderização para SEO

### 2.1 Impacto por Estratégia

| Estratégia | Indexação | Performance | Freshness | Uso |
|---|---|---|---|---|
| **SSG** (Static Site Generation) | ✅ Excelente | ✅ Mais rápido | ⚠️ Rebuild needed | Landing pages, docs, blog estático |
| **ISR** (Incremental Static Regen) | ✅ Excelente | ✅ Muito rápido | ✅ Revalida periódico | Blog, catálogo, e-commerce |
| **SSR** (Server-Side Rendering) | ✅ Boa | ⚠️ Mais lento | ✅ Sempre atual | Dashboards públicos, conteúdo personalizado |
| **CSR** (Client-Side Rendering) | ❌ Problemático | ❌ Lento FCP | ✅ Sempre atual | ❌ Não usar para conteúdo SEO |

### 2.2 Hierarquia de Preferência

```
SSG > ISR > SSR > CSR

Para SEO, sempre preferir a opção mais estática possível.
```

### 2.3 Implementação Next.js

```tsx
// SSG (default em App Router para Server Components sem dados dinâmicos)
export default function Page() {
  return <div>Conteúdo estático</div>;
}

// ISR
export const revalidate = 3600; // Revalida a cada 1 hora

export default async function BlogPost({ params }: Props) {
  const post = await getPost(params.slug);
  return <Article post={post} />;
}

// SSR (force dynamic)
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const data = await getData();
  return <DashboardView data={data} />;
}
```

## 3. JSON-LD Structured Data

### 3.1 Por que JSON-LD

- Google recomenda explicitamente JSON-LD sobre microdata e RDFa
- Não interfere no HTML/CSS do documento
- Pode ser gerado no servidor via Server Components
- Habilita rich snippets no Google (FAQ, rating, breadcrumb, article, etc.)

### 3.2 Implementação com schema-dts

```tsx
// lib/structured-data.tsx
import type {
  Organization,
  WebSite,
  Article,
  BreadcrumbList,
  FAQPage,
  Product,
  LocalBusiness,
} from 'schema-dts';

export function JsonLd<T>({ data }: { data: T }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### 3.3 Organization

```tsx
// app/layout.tsx
const organizationData: Organization = {
  '@type': 'Organization',
  '@context': 'https://schema.org',
  name: 'Empresa',
  url: 'https://exemplo.com.br',
  logo: 'https://exemplo.com.br/logo.png',
  sameAs: [
    'https://twitter.com/empresa',
    'https://linkedin.com/company/empresa',
    'https://github.com/empresa',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+55-11-99999-9999',
    contactType: 'customer service',
    areaServed: 'BR',
    availableLanguage: ['Portuguese', 'English'],
  },
};
```

### 3.4 WebSite + SearchAction

```tsx
const websiteData: WebSite = {
  '@type': 'WebSite',
  '@context': 'https://schema.org',
  name: 'Empresa',
  url: 'https://exemplo.com.br',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://exemplo.com.br/busca?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};
```

### 3.5 Article (Blog)

```tsx
const articleData: Article = {
  '@type': 'Article',
  '@context': 'https://schema.org',
  headline: post.title,
  description: post.excerpt,
  image: post.coverImage,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  author: {
    '@type': 'Person',
    name: post.author.name,
    url: post.author.url,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Empresa',
    logo: {
      '@type': 'ImageObject',
      url: 'https://exemplo.com.br/logo.png',
    },
  },
};
```

### 3.6 BreadcrumbList

```tsx
const breadcrumbData: BreadcrumbList = {
  '@type': 'BreadcrumbList',
  '@context': 'https://schema.org',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://exemplo.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://exemplo.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: post.title, item: `https://exemplo.com.br/blog/${post.slug}` },
  ],
};
```

### 3.7 FAQPage

```tsx
const faqData: FAQPage = {
  '@type': 'FAQPage',
  '@context': 'https://schema.org',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};
```

### 3.8 Product

```tsx
const productData: Product = {
  '@type': 'Product',
  '@context': 'https://schema.org',
  name: 'Plano Pro',
  description: 'Plano profissional com todos os recursos.',
  offers: {
    '@type': 'Offer',
    price: '97.00',
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock',
    url: 'https://exemplo.com.br/pricing',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '1247',
  },
};
```

## 4. Sitemap Programático

```tsx
// app/sitemap.ts
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const products = await getAllProducts();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://exemplo.com.br',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://exemplo.com.br/sobre',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://exemplo.com.br/pricing',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://exemplo.com.br/contato',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = posts.map(post => ({
    url: `https://exemplo.com.br/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const productPages: MetadataRoute.Sitemap = products.map(product => ({
    url: `https://exemplo.com.br/produtos/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages, ...productPages];
}
```

## 5. Robots.ts

```tsx
// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/_next/'],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
    ],
    sitemap: 'https://exemplo.com.br/sitemap.xml',
  };
}
```

## 6. Canonical URLs

### 6.1 Por que Canonical

Canonical previne conteúdo duplicado causado por:
- Parâmetros de query string (`?utm_source=...`, `?page=2`)
- Trailing slashes (`/about` vs. `/about/`)
- Protocolo (`http` vs. `https`)
- Subdomínios (`www` vs. non-www`)
- Variações de capitalização (`/About` vs. `/about`)

### 6.2 Implementação

```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}
```

A `metadataBase` do layout resolve para URL absoluta: `https://exemplo.com.br/blog/my-post`.

## 7. Hreflang para i18n

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://exemplo.com.br',
    languages: {
      'pt-BR': 'https://exemplo.com.br',
      'en-US': 'https://exemplo.com.br/en',
      'es-ES': 'https://exemplo.com.br/es',
      'x-default': 'https://exemplo.com.br/en',
    },
  },
};
```

Renderiza:
```html
<link rel="alternate" hreflang="pt-BR" href="https://exemplo.com.br" />
<link rel="alternate" hreflang="en-US" href="https://exemplo.com.br/en" />
<link rel="alternate" hreflang="es-ES" href="https://exemplo.com.br/es" />
<link rel="alternate" hreflang="x-default" href="https://exemplo.com.br/en" />
```

## 8. Estrutura de URL

### 8.1 Boas Práticas

| Regra | Bom | Ruim |
|---|---|---|
| Curto e descritivo | `/blog/como-usar-nextjs` | `/blog/post?id=123&cat=dev` |
| Kebab-case | `/sobre-nos` | `/sobreNos`, `/sobre_nos` |
| Sem parâmetros desnecessários | `/produtos/camisa-azul` | `/produtos?id=456&color=blue` |
| Hierárquico | `/blog/categoria/slug` | `/p/slug` (sem contexto) |
| Sem trailing slash | `/sobre` | `/sobre/` |
| Lowercase | `/contato` | `/Contato` |
| Sem extensão | `/blog/post` | `/blog/post.html` |

### 8.2 Next.js URL Conventions

```
app/
├── page.tsx                    → /
├── sobre/page.tsx              → /sobre
├── blog/page.tsx               → /blog
├── blog/[slug]/page.tsx        → /blog/my-post
├── blog/categoria/[cat]/page.tsx → /blog/categoria/nextjs
└── (marketing)/pricing/page.tsx → /pricing (route group invisível na URL)
```

## 9. Crawl Budget Optimization

### 9.1 O que Consome Crawl Budget

| Problema | Impacto | Solução |
|---|---|---|
| Páginas duplicadas | Crawl gasto em duplicatas | Canonical + robots noindex |
| Páginas infinitas (filtros, sorts) | Googlebot preso em loops | `robots.txt` disallow params |
| Soft 404s | Crawl gasto em páginas vazias | Retornar 404 real |
| Redirects chains (A→B→C→D) | 3 crawls por URL final | Redirect A→D direto |
| Recursos bloqueados | Googlebot não renderiza | Permitir JS/CSS no robots.txt |
| Páginas lentas | Crawl rate reduzido | Performance optimization |

### 9.2 Dicas

1. **Sitemap atualizado:** Inclua apenas URLs canônicas indexáveis
2. **Internal linking limpo:** Sem links para 404s ou redirects
3. **Paginação com rel="next/prev"** (Google não usa mais oficialmente, mas não prejudica)
4. **Noindex para páginas thin:** Resultados de busca internos, páginas de tag com pouco conteúdo
5. **Server-side redirects (308):** Não use client-side redirects

## 10. Core Web Vitals como Ranking Factor

### 10.1 Status em 2026

Core Web Vitals são fator de ranking confirmado desde junho 2021. Em 2026:

- **Page Experience signals** incluem: CWV + mobile-friendly + HTTPS + no intrusive interstitials
- **Impacto no ranking:** Tiebreaker entre conteúdo de qualidade similar (~3-5% impacto)
- **Chrome UX Report (CrUX):** Dados reais de campo usados pelo Google, não lab data
- **INP substituiu FID:** desde março 2024

### 10.2 Thresholds

| Métrica | Bom | Precisa Melhorar | Ruim |
|---|---|---|---|
| LCP | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| CLS | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| INP | ≤ 200ms | 200ms - 500ms | > 500ms |

Detalhes de otimização em `docs/seo/03_SEO_PERFORMANCE.md`.
