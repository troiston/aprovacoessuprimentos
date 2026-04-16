---
id: skill-generate-schema
title: "Generate Schema"
agent: 04-seo-specialist
version: 1.0
category: seo
priority: critical
requires:
  - rule: 00-constitution
provides:
  - json-ld-structured-data
  - rich-results-eligibility
used_by:
  - agent: 04-seo-specialist
  - command: /new-page
---

# JSON-LD Type-Safe com schema-dts

## Dependência

```bash
pnpm add schema-dts
```

## Componente Reutilizável `JsonLd`

```typescript
// src/components/seo/json-ld.tsx
import type { Thing, WithContext } from 'schema-dts'

interface JsonLdProps<T extends Thing> {
  data: WithContext<T>
}

export function JsonLd<T extends Thing>({ data }: JsonLdProps<T>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

## Árvore de Decisão por Tipo de Página

```
Página → É a home?
  ├─ Sim → Organization + WebSite + SearchAction
  ├─ Blog post? → Article + BreadcrumbList
  ├─ Produto? → Product + Offer + BreadcrumbList
  ├─ FAQ? → FAQPage + BreadcrumbList
  ├─ Negócio local? → LocalBusiness + BreadcrumbList
  ├─ Tutorial? → HowTo + BreadcrumbList
  └─ Outra → BreadcrumbList (sempre)
```

## 1. Organization (Layout Raiz)

```typescript
// src/app/layout.tsx
import { JsonLd } from '@/components/seo/json-ld'
import type { Organization, WithContext } from 'schema-dts'

const orgSchema: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NomeDaMarca',
  url: 'https://seudominio.com.br',
  logo: 'https://seudominio.com.br/logo.png',
  sameAs: [
    'https://instagram.com/marca',
    'https://linkedin.com/company/marca',
    'https://twitter.com/marca',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+55-11-99999-9999',
    contactType: 'customer service',
    availableLanguage: ['Portuguese', 'English'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <JsonLd data={orgSchema} />
        {children}
      </body>
    </html>
  )
}
```

## 2. WebSite com SearchAction (Home)

```typescript
import type { WebSite, WithContext } from 'schema-dts'

const websiteSchema: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NomeDaMarca',
  url: 'https://seudominio.com.br',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://seudominio.com.br/busca?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string' as any,
  },
}
```

## 3. BreadcrumbList (Todas as Páginas)

```typescript
import type { BreadcrumbList, WithContext } from 'schema-dts'

interface BreadcrumbItem {
  name: string
  href: string
}

export function buildBreadcrumbSchema(
  items: BreadcrumbItem[],
  baseUrl: string
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.href}`,
    })),
  }
}
```

## 4. Article (Blog)

```typescript
import type { Article, WithContext } from 'schema-dts'

interface ArticleSchemaInput {
  title: string
  description: string
  slug: string
  publishedAt: string
  updatedAt: string
  authorName: string
  authorUrl: string
  image: string
  tags: string[]
}

export function buildArticleSchema(
  post: ArticleSchemaInput,
  baseUrl: string
): WithContext<Article> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    url: `${baseUrl}/blog/${post.slug}`,
    author: {
      '@type': 'Person',
      name: post.authorName,
      url: post.authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'NomeDaMarca',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    keywords: post.tags.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
  }
}
```

## 5. Product + Offer (E-commerce)

```typescript
import type { Product, WithContext } from 'schema-dts'

interface ProductSchemaInput {
  name: string
  description: string
  slug: string
  image: string[]
  price: number
  currency: string
  availability: 'InStock' | 'OutOfStock' | 'PreOrder'
  sku: string
  brand: string
  ratingValue?: number
  reviewCount?: number
}

export function buildProductSchema(
  product: ProductSchemaInput,
  baseUrl: string
): WithContext<Product> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/produtos/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      availability: `https://schema.org/${product.availability}`,
      priceValidUntil: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString().split('T')[0],
    },
    ...(product.ratingValue && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.ratingValue,
        reviewCount: product.reviewCount,
      },
    }),
  }
}
```

## 6. FAQPage

```typescript
import type { FAQPage, WithContext } from 'schema-dts'

interface FaqItem {
  question: string
  answer: string
}

export function buildFaqSchema(items: FaqItem[]): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
```

## 7. LocalBusiness

```typescript
import type { LocalBusiness, WithContext } from 'schema-dts'

const localBusinessSchema: WithContext<LocalBusiness> = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Café Aroma',
  image: 'https://cafearoma.com.br/fachada.jpg',
  telephone: '+55-11-3333-4444',
  email: 'contato@cafearoma.com.br',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rua Augusta, 1500',
    addressLocality: 'São Paulo',
    addressRegion: 'SP',
    postalCode: '01304-001',
    addressCountry: 'BR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -23.5505,
    longitude: -46.6333,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:00',
      closes: '22:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday'],
      opens: '08:00',
      closes: '20:00',
    },
  ],
  priceRange: '$$',
}
```

## 8. HowTo (Tutoriais)

```typescript
import type { HowTo, WithContext } from 'schema-dts'

interface HowToInput {
  title: string
  description: string
  totalTime: string
  image: string
  steps: Array<{
    name: string
    text: string
    image?: string
  }>
}

export function buildHowToSchema(input: HowToInput): WithContext<HowTo> {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: input.title,
    description: input.description,
    totalTime: input.totalTime,
    image: input.image,
    step: input.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
    })),
  }
}
```

## Uso Combinado em Página

```typescript
// src/app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: post.title, href: `/blog/${slug}` },
  ]

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs, BASE_URL)} />
      <JsonLd data={buildArticleSchema(post, BASE_URL)} />
      <article>...</article>
    </>
  )
}
```

## Validação

Sempre testar schemas gerados em:
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org)
