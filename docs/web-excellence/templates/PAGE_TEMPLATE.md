---
id: doc-page-template
title: Checklist de Criação de Página
version: 2.0
last_updated: 2026-04-07
category: templates
priority: important
related:
  - docs/web-excellence/templates/COMPONENT_TEMPLATE.md
  - docs/web-excellence/performance/01_CORE_WEB_VITALS.md
  - docs/web-excellence/components/01_HERO_PATTERNS.md
---

# Checklist de Criação de Página

## Resumo Executivo

Template e checklist completo para criar uma nova página no projeto Next.js. Cobre metadata, layout, seções, componentes, SEO, performance, acessibilidade e testes. Use como ponto de partida para qualquer nova rota.

---

## 1. Metadata

### 1.1 Metadata API (Next.js)

```tsx
// app/[page]/page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Título da Página — Nome do Produto",
  description: "Descrição concisa da página em 150-160 caracteres que inclui a keyword principal e gera curiosidade.",
  alternates: {
    canonical: "https://example.com/pagina",
  },
  openGraph: {
    title: "Título para Social Media",
    description: "Descrição otimizada para compartilhamento social (pode ser diferente da meta description).",
    url: "https://example.com/pagina",
    siteName: "Nome do Produto",
    images: [
      {
        url: "https://example.com/og/pagina.png",
        width: 1200,
        height: 630,
        alt: "Descrição da imagem OG",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Título para Twitter",
    description: "Descrição para Twitter.",
    images: ["https://example.com/og/pagina.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

### 1.2 Checklist de Metadata

```
□ title: Inclui keyword + brand (max 60 chars)
□ description: 150-160 chars, keyword + CTA
□ canonical: URL absoluta, sem trailing slash
□ og:title: Pode ser diferente do <title>
□ og:description: Otimizada para social (engajamento > SEO)
□ og:image: 1200x630px, < 200KB
□ og:type: website | article | product
□ og:locale: pt_BR
□ twitter:card: summary_large_image
□ robots: index,follow (exceto staging/dev)
```

---

## 2. Layout

### 2.1 Escolha do Layout

| Tipo de Página | Layout | Sidebar | Header | Footer |
|----------------|--------|---------|--------|--------|
| Landing Page | Marketing | Não | Transparente/sticky | Full |
| Página de Produto | Marketing | Não | Sticky | Full |
| Blog Post | Content | Não | Compact | Full |
| Dashboard | App | Sim | Mini | Não |
| Settings | App | Sim | Mini | Não |
| Auth (login/signup) | Auth | Não | Logo only | Minimal |
| Legal (termos, privacy) | Content | Não | Compact | Full |

### 2.2 Estrutura de Arquivo

```
app/
  (marketing)/
    layout.tsx          ← Marketing layout (header + footer)
    page.tsx            ← Homepage
    pricing/
      page.tsx
    blog/
      [slug]/
        page.tsx
  (app)/
    layout.tsx          ← App layout (sidebar + header)
    dashboard/
      page.tsx
      loading.tsx       ← Skeleton loader
    settings/
      page.tsx
  (auth)/
    layout.tsx          ← Auth layout (centered, minimal)
    login/
      page.tsx
    signup/
      page.tsx
```

---

## 3. Seções por Tipo de Página

### 3.1 Landing Page (Homepage)

```
1. Hero Section (headline, sub, CTA, trust signal)
2. Logo Bar (social proof — clientes)
3. Features/Benefits (3-6 cards ou alternating sections)
4. How It Works (3 steps)
5. Social Proof (testimonials, case studies)
6. Pricing (3 tiers + comparison)
7. FAQ (5-7 perguntas)
8. Final CTA (headline + CTA repetido)
9. Footer
```

### 3.2 Página de Produto/Feature

```
1. Hero Section (feature-specific headline + demo)
2. Problem Statement (pain point)
3. Solution (how the feature solves it)
4. Details (sub-features, specs)
5. Social Proof (testimonial relevante)
6. Integration/Compatibility
7. CTA (trial ou demo)
```

### 3.3 Blog Post

```
1. Article Header (title, author, date, reading time)
2. Featured Image
3. Article Body (MDX content)
4. Author Bio
5. Related Posts
6. Newsletter CTA
```

### 3.4 Pricing Page

```
1. Headline + Sub-headline
2. Billing Toggle (annual/monthly)
3. Pricing Cards (3 tiers)
4. Comparison Table
5. FAQ
6. Trust Signals (guarantees, certifications)
7. CTA Final
```

---

## 4. Componentes por Variante

### 4.1 Registro de Componentes

```tsx
// Para cada componente usado na página, documentar:
type ComponentUsage = {
  component: string       // Nome do componente
  variant?: string        // Variante usada
  props: Record<string, unknown> // Props principais
  position: string        // Posição na página
  priority: "lcp" | "above-fold" | "below-fold" | "deferred"
}

// Exemplo para homepage:
const pageComponents: ComponentUsage[] = [
  { component: "Hero", variant: "split", props: { withVideo: false }, position: "section-1", priority: "lcp" },
  { component: "LogoBar", variant: "static", props: { count: 6 }, position: "section-2", priority: "above-fold" },
  { component: "FeatureGrid", variant: "3-col", props: { animated: true }, position: "section-3", priority: "below-fold" },
  { component: "Testimonials", variant: "carousel", props: { count: 5 }, position: "section-5", priority: "below-fold" },
  { component: "PricingSection", variant: "3-tier", props: { annual: true }, position: "section-6", priority: "below-fold" },
  { component: "FAQSection", variant: "accordion", props: { schema: true }, position: "section-7", priority: "deferred" },
]
```

---

## 5. SEO

### 5.1 JSON-LD Schema

```tsx
// Selecionar o schema apropriado por tipo de página
const schemaByPageType = {
  homepage: "Organization",
  product: "Product",
  pricing: "Product" + "Offer",
  blog: "Article" + "BreadcrumbList",
  faq: "FAQPage",
  about: "AboutPage",
  contact: "ContactPage",
}
```

### 5.2 Implementação JSON-LD

```tsx
function PageSchema({ type, data }: PageSchemaProps) {
  const schema = generateSchema(type, data)
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

### 5.3 Internal Links

```
□ Breadcrumbs em todas as páginas (exceto homepage)
□ Links contextuais para páginas relacionadas
□ Link para pricing em toda página de feature
□ Link para docs/blog em contexto relevante
□ Anchor text descritivo (nunca "clique aqui")
```

---

## 6. Performance

### 6.1 LCP Image

```
□ Identificar o LCP element da página
□ Se imagem: priority + sizes + AVIF + quality 75
□ Se texto: fontes com preload + font-display
□ Verificar LCP < 2.5s no PageSpeed Insights
```

### 6.2 Lazy Loading

```
□ Imagens below-fold: loading="lazy" (default)
□ Componentes below-fold: dynamic import ou Suspense
□ Third-party scripts: next/script lazyOnload
□ Iframes (YouTube, maps): loading="lazy"
```

### 6.3 Suspense Boundaries

```tsx
export default function Page() {
  return (
    <>
      {/* Above fold: render imediato */}
      <HeroSection />
      <LogoBar />

      {/* Below fold: streaming */}
      <Suspense fallback={<FeaturesSkeleton />}>
        <FeaturesSection />
      </Suspense>

      <Suspense fallback={<TestimonialsSkeleton />}>
        <TestimonialsSection />
      </Suspense>

      <Suspense fallback={<PricingSkeleton />}>
        <PricingSection />
      </Suspense>
    </>
  )
}
```

---

## 7. Acessibilidade

### 7.1 Heading Hierarchy

```
<h1> Headline principal (1 por página)
  <h2> Título de seção (Features, Pricing, FAQ...)
    <h3> Sub-item de seção (Feature card title, FAQ question)
      <h4> Detalhe (raro em landing pages)
```

**Regra:** NUNCA pular níveis (h1 → h3 sem h2). Hierarquia sequencial.

### 7.2 Focus Order

```
□ Tab order segue a ordem visual (sem tabindex positivo)
□ Skip to main content link (primeiro focável)
□ Focus visible em todos os interativos
□ Modal trap focus (focus não escapa do modal)
```

### 7.3 Contrast Check

```
□ Texto normal: ratio ≥ 4.5:1 (WCAG AA)
□ Texto grande (≥18px bold ou ≥24px): ratio ≥ 3:1
□ UI components (borders, icons): ratio ≥ 3:1
□ Verificar em AMBOS os modos (light e dark)
```

### 7.4 Landmark Regions

```html
<header>        <!-- Banner -->
<nav>           <!-- Navigation -->
<main>          <!-- Main content -->
<section>       <!-- Sections with aria-label -->
<aside>         <!-- Complementary -->
<footer>        <!-- Contentinfo -->
```

---

## 8. Testing

### 8.1 Testes por Tipo

| Tipo | O que Testar | Ferramenta |
|------|-------------|-----------|
| **Unit** | Componentes isolados, utils | Vitest + Testing Library |
| **Integration** | Seções compostas, forms | Vitest + Testing Library |
| **E2E** | Fluxos completos (signup, purchase) | Playwright |
| **Visual** | Regressions visuais | Playwright screenshots |
| **A11y** | Acessibilidade automatizada | axe-core + Playwright |
| **Performance** | CWV, bundle size | Lighthouse CI |

### 8.2 Checklist de Testes

```
□ Render test: página renderiza sem erros
□ Metadata test: title, description, OG corretos
□ CTA test: botões clicáveis, links corretos
□ Mobile test: responsive em 375px, 768px
□ A11y test: axe-core sem critical violations
□ Performance test: LCP < 2.5s, Lighthouse > 90
□ Visual test: screenshot comparison com baseline
□ SEO test: schema válido, heading hierarchy
```

---

## 9. Checklist Completo (Pré-Deploy)

```
METADATA
□ title com keyword + brand (max 60 chars)
□ description 150-160 chars
□ canonical URL
□ OG tags (title, description, image 1200x630)
□ Twitter card
□ robots index,follow

LAYOUT
□ Layout correto selecionado
□ Header/footer correspondentes
□ Mobile responsive verificado

SEÇÕES
□ Todas as seções da page type incluídas
□ Ordem lógica de storytelling
□ CTA em pelo menos 3 posições

SEO
□ JSON-LD schema correto
□ Heading hierarchy (h1 único, sequencial)
□ Internal links contextuais
□ Breadcrumbs (se não homepage)
□ Alt text em todas as imagens
□ Sitemap atualizado

PERFORMANCE
□ LCP image com priority + sizes
□ Below-fold com lazy loading
□ Suspense boundaries em Server Components async
□ LCP < 2.5s verificado
□ CLS < 0.1 verificado

ACESSIBILIDADE
□ Heading hierarchy correta
□ Focus order lógico
□ Contraste ≥ 4.5:1
□ Skip to content link
□ Landmarks (header, nav, main, footer)
□ ARIA labels em interativos
□ Testado com screen reader

TESTES
□ Render sem erros
□ Mobile responsive
□ axe-core sem critical
□ Lighthouse > 90
□ E2E para fluxos críticos
```
