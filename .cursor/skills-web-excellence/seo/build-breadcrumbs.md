---
id: skill-build-breadcrumbs
title: "Build Breadcrumbs"
agent: 04-seo-specialist
version: 1.0
category: seo
priority: standard
requires:
  - skill: skill-generate-schema
  - rule: 00-constitution
provides:
  - breadcrumb-navigation
  - breadcrumb-json-ld
used_by:
  - agent: 04-seo-specialist
  - command: /new-page
---

# Breadcrumbs Navegáveis com JSON-LD Automático

## Conceito

Breadcrumbs servem três propósitos:
1. **Navegação** — usuário sabe onde está e volta facilmente
2. **SEO** — Google exibe breadcrumbs nos resultados
3. **Acessibilidade** — `aria-label` e `aria-current` para leitores de tela

## Componente Completo

```typescript
// src/components/navigation/breadcrumbs.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { JsonLd } from '@/components/seo/json-ld'
import type { BreadcrumbList, WithContext } from 'schema-dts'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://seudominio.com.br'

const ROUTE_LABELS: Record<string, string> = {
  blog: 'Blog',
  sobre: 'Sobre',
  contato: 'Contato',
  produtos: 'Produtos',
  precos: 'Preços',
  categorias: 'Categorias',
  ajuda: 'Ajuda',
  configuracoes: 'Configurações',
}

function formatSegment(segment: string): string {
  return (
    ROUTE_LABELS[segment] ??
    decodeURIComponent(segment)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  )
}

interface BreadcrumbItem {
  label: string
  href: string
}

function buildItems(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }]

  segments.forEach((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    items.push({ label: formatSegment(segment), href })
  })

  return items
}

function buildSchema(items: BreadcrumbItem[]): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${BASE_URL}${item.href}`,
    })),
  }
}

interface BreadcrumbsProps {
  overrides?: Array<{ label: string; href: string }>
  className?: string
}

export function Breadcrumbs({ overrides, className }: BreadcrumbsProps) {
  const pathname = usePathname()
  const items = overrides ?? buildItems(pathname)

  if (items.length <= 1) return null

  const schema = buildSchema(items)

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {items.map((item, index) => {
            const isLast = index === items.length - 1

            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {index > 0 && (
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}

                {isLast ? (
                  <span
                    aria-current="page"
                    className="truncate max-w-[200px] font-medium text-foreground"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="truncate max-w-[150px] transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
```

## Uso em Páginas

### Automático (baseado no pathname)

```typescript
// src/app/blog/[slug]/page.tsx
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'

export default async function BlogPost({ params }: Props) {
  return (
    <main>
      <Breadcrumbs />
      <article>...</article>
    </main>
  )
}
```

### Com Override (título do post ao invés do slug)

```typescript
export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  return (
    <main>
      <Breadcrumbs
        overrides={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.title, href: `/blog/${slug}` },
        ]}
      />
      <article>...</article>
    </main>
  )
}
```

## Truncamento no Mobile

As classes `truncate max-w-[150px]` e `max-w-[200px]` garantem que labels longas são cortadas com reticências em telas pequenas. Para controle mais fino:

```css
/* Variação responsiva via Tailwind */
.breadcrumb-label {
  @apply truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-none;
}
```

## Acessibilidade Obrigatória

| Atributo | Onde | Motivo |
|----------|------|--------|
| `aria-label="Breadcrumb"` | `<nav>` | Identifica a região |
| `aria-current="page"` | Último item | Indica página atual |
| `aria-hidden="true"` | Separadores | Oculta decoração |
| `<ol>` | Lista | Semântica ordenada |

## Server Component Alternativo

Se não precisar de `usePathname` (breadcrumbs passados como prop):

```typescript
// src/components/navigation/breadcrumbs-server.tsx
import Link from 'next/link'
import { JsonLd } from '@/components/seo/json-ld'
import type { BreadcrumbList, WithContext } from 'schema-dts'

interface BreadcrumbItem {
  label: string
  href: string
}

interface Props {
  items: BreadcrumbItem[]
}

export function BreadcrumbsServer({ items }: Props) {
  const schema: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: `${process.env.NEXT_PUBLIC_BASE_URL}${item.href}`,
    })),
  }

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {index > 0 && (
                  <span aria-hidden="true" className="text-muted-foreground/50">/</span>
                )}
                {isLast ? (
                  <span aria-current="page" className="font-medium text-foreground">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
```

Preferir Server Component quando os itens são conhecidos no servidor — evita `'use client'` desnecessário.
