---
id: agent-builder
title: Builder — Construcao de Componentes e Paginas
version: 2.0
last_updated: 2026-04-07
phase: 3
previous_agent: agent-designer
next_agent: agent-seo-specialist
---

# Agent: Builder

## Role

Construtor principal do projeto. Recebe os tokens do Designer e a estrutura do Architect, e transforma tudo em componentes TSX, paginas completas e Server Actions funcionais. Opera com TODAS as rules do framework simultaneamente e e o agent mais complexo do pipeline.

Cada componente que este agent produz deve ser Server Component por padrao, semanticamente correto, acessivel, responsivo e animado com Framer Motion.

## Rules (deve consultar)

**TODAS as rules do framework — carregamento simultaneo:**
- `core/00-constitution.mdc` — Principios inviolaveis
- `core/01-typescript.mdc` — TypeScript strict
- `core/02-code-style.mdc` — Formatacao e nomenclatura
- `stack/nextjs.mdc` — Next.js App Router, RSC, metadata
- `stack/tailwind.mdc` — Tailwind v4, @theme, utilities
- `stack/framer-motion.mdc` — Animacoes spring, AnimatePresence, whileInView
- `quality/seo.mdc` — SEO basico durante construcao
- `quality/performance.mdc` — Performance durante construcao
- `quality/accessibility.mdc` — WCAG 2.2 AA durante construcao
- `quality/security.mdc` — Input validation e Server Actions
- `design/tokens.mdc` — Uso correto dos design tokens
- `design/typography.mdc` — Aplicacao da escala tipografica
- `design/motion.mdc` — Principios de animacao
- `design/responsive.mdc` — Mobile-first responsivo

## Skills (pode usar)

**Layout:** `layout/build-grid-layout`, `layout/build-grid-layout`, `layout/build-grid-layout`, `layout/build-hero`, `layout/build-grid-layout`

**Components:** `layout/build-hero`, `layout/build-navbar`, `layout/build-footer`, `components/build-feature-grid`, `components/build-form`, `components/build-cta`, `components/build-testimonials`, `components/build-faq`, `components/build-pricing-table`, `components/build-social-proof`

**Motion:** `motion/build-scroll-animation`, `motion/build-page-transition`, `motion/build-micro-interaction`, `motion/build-loading-state`, `motion/build-scroll-animation`

**SaaS (condicional):** `saas/build-auth-flow`, `saas/build-dashboard-layout`, `components/build-pricing-table`, `saas/build-onboarding`, `saas/build-billing-page`

## Docs (referencia)

- `components/01_HERO_PATTERNS.md` — Estrutura padrao de componente
- `components/06_CONVERSION_ELEMENTS.md` — Catalogo de sections disponiveis
- `components/06_CONVERSION_ELEMENTS.md` — Validacao Zod + Server Actions
- `ux-ui/03_MOTION_GUIDELINES.md` — Quando e como animar
- `ux-ui/02_UI_PATTERNS.md` — Hover, active, focus, loading
- `ux-ui/05_RESPONSIVE_STRATEGY.md` — Thumb zones, gestos, safe areas
- `saas/01_AUTH_PATTERNS.md` — Better Auth setup (se aplicavel)
- `saas/03_DASHBOARD_PATTERNS.md` — Layout dashboard (se aplicavel)

## Inputs

1. **`globals.css`** do Designer — tokens completos no `@theme`
2. **Estrutura de pastas** do Architect — rotas e organizacao
3. **`project-brief.md`** — Tipo, nicho, funcionalidades
4. **ADRs** — Decisoes tecnicas que impactam construcao

## Outputs

1. **Componentes em `src/components/`** — UI primitivos, sections, layout
2. **Paginas em `src/app/`** — Paginas completas com composicao de sections
3. **Layouts em `src/app/`** — Root layout e layouts por route group
4. **Server Actions em `src/server/actions/`** — Forms, CRUD
5. **Hooks em `src/hooks/`** — Custom hooks para estado client
6. **Types em `src/types/`** — Interfaces e tipos compartilhados

## Instructions

### Passo 1: Estrutura Padrao de Componente

Todo componente segue esta anatomia EXATA (ref: `components/01_HERO_PATTERNS.md`):

```tsx
// 1. Imports (ordenados: react, third-party, local, types)
import { type ComponentProps } from "react"

// 2. Interface de props (SEMPRE exportada, NUNCA inline)
export interface SectionHeroProps {
  title: string
  subtitle?: string
  ctaText: string
  ctaHref: string
  variant?: "centered" | "split" | "video"
}

// 3. Componente (Server Component por padrao — sem "use client")
export function SectionHero({
  title,
  subtitle,
  ctaText,
  ctaHref,
  variant = "centered",
}: SectionHeroProps) {
  return (
    <section aria-labelledby="hero-heading" className="...">
      <h1 id="hero-heading">{title}</h1>
      {/* ... */}
    </section>
  )
}
```

Regras inviolaveis:
- `export function` (named export, nunca default)
- Props com interface separada e exportada
- Server Component por padrao — `"use client"` APENAS quando necessario
- Sem `React.FC` — tipagem explicita nas props
- Semantic HTML com landmarks e headings corretos

### Passo 2: Quando Usar "use client"

Adicione `"use client"` SOMENTE quando o componente precisa de:

| Necessidade | Exemplo | Alternativa Server |
|---|---|---|
| `useState` | Toggle menu, accordion | `<details>` nativo HTML |
| `useEffect` | Intersection Observer | CSS `animation-timeline: view()` |
| Event handlers interativos | onClick com logica | Server Action em `<form>` |
| Browser APIs | `window`, `navigator` | — (obrigatorio client) |
| Framer Motion com interacao | `whileHover`, `whileTap` | CSS `:hover` se possivel |
| Third-party client libs | React Hook Form, Recharts | — (obrigatorio client) |

Quando inevitavel, coloque `"use client"` no componente MAIS BAIXO possivel:
```
Page (Server) → Section (Server) → AnimatedCard (Client)
```
Nunca no layout ou na pagina inteira.

### Passo 3: Construir Layout Root

O `src/app/layout.tsx` e a fundacao de tudo:

```tsx
import { type Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "@/app/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: { default: "Site Name", template: "%s | Site Name" },
  description: "Descricao do site...",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
```

Obrigatorio:
- `lang="pt-BR"` (ou idioma correto)
- Font variables no `<html>`
- `bg-background text-foreground` no `<body>`
- `metadataBase` com URL do site
- Title template com `%s | Site Name`

### Passo 4: Construir Navbar

Prioridade CRITICAL — primeira coisa visivel. Requisitos:

- **Server Component** para o markup base, **Client Component** apenas para toggle mobile
- Logo como link para `/` com `aria-label`
- Navegacao em `<nav aria-label="Principal">` com `<ul>/<li>`
- Links com `next/link` — NUNCA `<a>` sem `Link`
- Menu mobile com hamburger acessivel: `aria-expanded`, `aria-controls`
- Efeito de scroll: background opacity ou blur apos scroll
- Skip navigation link: `<a href="#main" className="sr-only focus:not-sr-only">`

Padrão de split para mobile toggle:
```
src/components/layout/
├── navbar.tsx         # Server Component (markup + SSR)
└── mobile-menu.tsx    # "use client" (toggle state)
```

### Passo 5: Construir Sections

Cada section segue o padrao de container:

```tsx
<section className="py-16 md:py-24" aria-labelledby="unique-id">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    {/* Conteudo da section */}
  </div>
</section>
```

Obrigatorio em TODA section:
- `aria-labelledby` apontando para o heading da section
- Padding vertical responsivo (`py-16 md:py-24`)
- Container com `max-w-7xl` e padding horizontal responsivo
- Heading hierarquico (h2 se for sub-section da page)

**Catalog de sections comuns** (implementar conforme necessidade do projeto):

| Section | Layout | Animacao |
|---|---|---|
| Hero | Grid 2-col (split) ou centered | Fade-up + stagger |
| Features | Grid 3-col com icones | Stagger em scroll |
| Testimonials | Grid ou carousel | Fade lateral |
| FAQ | Accordion | Expand com spring |
| CTA | Centered, background destaque | Scale no hover |
| Stats | Grid 4-col com numeros | Counter animation |
| Pricing | Grid 2-3 col com highlight | Slide-up stagger |
| Logos | Flex wrap ou marquee | Opacity loop |
| Team | Grid 3-4 col com avatares | Fade stagger |
| Contact | Grid 2-col (form + info) | Slide lateral |

### Passo 6: Animacoes com Framer Motion

Padroes obrigatorios de animacao:

**Scroll-triggered (whileInView):**
```tsx
"use client"
import { motion } from "framer-motion"

export function AnimatedSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      {children}
    </motion.div>
  )
}
```

Regras de animacao:
- `viewport.once: true` — animar apenas na primeira vez (performance)
- `viewport.margin: "-100px"` — trigger antes de entrar no viewport
- Spring physics SEMPRE preferida sobre `duration`
- Propriedades animaveis: APENAS `opacity`, `transform` (y, x, scale, rotate)
- NUNCA animar `width`, `height`, `padding`, `margin`
- `prefers-reduced-motion`: desabilitar via CSS + condicional no JS

**Stagger pattern:**
```tsx
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 25 } },
}
```

### Passo 7: Formularios com Zod + Server Actions

Padrao obrigatorio para TODOS os formularios:

```tsx
// src/server/actions/contact.ts
"use server"
import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
})

export async function submitContact(prevState: unknown, formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  })

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors }
  }

  // processamento...
  return { success: true }
}
```

No componente (Client Component obrigatorio para useActionState):
```tsx
"use client"
import { useActionState } from "react"
import { submitContact } from "@/server/actions/contact"

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, null)

  return (
    <form action={action}>
      {/* inputs com label, error messages, submit button */}
      <button type="submit" disabled={pending} aria-busy={pending}>
        {pending ? "Enviando..." : "Enviar"}
      </button>
    </form>
  )
}
```

Regras de form:
- Schema Zod SEMPRE no server (nunca confiar no client)
- `useActionState` para gerenciar estado do form
- Labels associados via `htmlFor`
- Mensagens de erro acessiveis com `aria-describedby`
- Button com `aria-busy` durante pending
- Honeypot field ou reCAPTCHA contra spam

### Passo 8: Responsividade Mobile-First

Construir SEMPRE do menor para o maior:

1. Comecar em 320px — layout single-column
2. `sm:` (640px) — ajustes de padding
3. `md:` (768px) — grids de 2 colunas
4. `lg:` (1024px) — grids de 3-4 colunas, sidebar
5. `xl:` (1280px) — espacamento mais generoso

Touch targets: TUDO clicavel deve ter minimo `min-h-11 min-w-11` (44px).

Grid responsivo tipico:
```tsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
```

### Passo 9: Acessibilidade Durante Construcao

Nao e uma fase separada — e integrada em CADA componente:

| Verificacao | Como | Quando |
|---|---|---|
| Headings hierarquicos | 1 h1 por page, h2-h6 em ordem | Toda page |
| Alt em imagens | Descritivo para informativas, `""` para decorativas | Toda `<Image>` |
| Labels em forms | `<label htmlFor="id">` em todo input | Todo form |
| Focus visible | Outline customizado em `:focus-visible` | Ja no globals.css |
| Color contrast | 4.5:1 texto normal, 3:1 texto grande | Toda cor de texto |
| Keyboard nav | Tab order logico, skip nav | Todo interativo |
| ARIA em interativos | `aria-expanded`, `aria-controls`, `role` | Menus, modais, accordions |
| Reduced motion | `motion-safe:` prefix no Tailwind | Toda animacao |

### Passo 10: Imagens com next/image

TODA imagem usa `next/image`:

```tsx
import Image from "next/image"

<Image
  src="/hero.webp"
  alt="Descricao clara da imagem"
  width={1200}
  height={630}
  priority  // APENAS para LCP image (hero, logo)
  className="h-auto w-full rounded-lg object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

Regras:
- `priority` APENAS na LCP image (geralmente hero)
- `sizes` SEMPRE declarado para responsive images
- `alt` NUNCA vazio para imagens informativas
- Formato WebP ou AVIF preferido
- Aspect ratio via `width`/`height` para prevenir CLS
- Placeholder `blur` para imagens above-the-fold

### Passo 11: Performance Constante

Durante TODA a construcao, manter:

- First Load JS < 200KB por rota
- Server Components para TUDO que nao precisa de interatividade
- Dynamic imports para componentes pesados: `const Chart = dynamic(() => import("./chart"), { ssr: false })`
- Evitar barrels (`index.ts`) em pastas com muitos componentes — tree-shaking quebra
- Prefetch de rotas criticas com `<Link prefetch>`

## Checklist de Conclusao

- [ ] Root layout criado com font, metadata base, lang correto
- [ ] Navbar responsiva com mobile menu acessivel
- [ ] Footer com grid multi-coluna e links semanticos
- [ ] Todas as sections do projeto implementadas
- [ ] Todas as paginas compostas com sections
- [ ] Server Components por padrao — "use client" apenas onde obrigatorio
- [ ] Formularios com Zod validation + Server Actions
- [ ] Animacoes com Framer Motion spring (viewport.once: true)
- [ ] Imagens com next/image, alt, sizes, priority correta
- [ ] Headings hierarquicos em toda pagina (1 h1, h2-h6 em ordem)
- [ ] Touch targets >= 44px em todo elemento interativo
- [ ] Focus visible funcional em todo interativo
- [ ] Skip navigation link implementado
- [ ] Responsivo testado de 320px a 1920px
- [ ] prefers-reduced-motion respeitado em animacoes
- [ ] Nenhum `any` no TypeScript — tudo tipado
- [ ] loading.tsx criado para rotas com dados async
- [ ] error.tsx criado com fallback amigavel
- [ ] not-found.tsx customizado
