---
id: skill-build-hero
title: "Build Hero Section"
agent: 03-builder
version: 1.0
category: layout
priority: critical
requires:
  - skill: skill-build-design-tokens
  - skill: skill-build-typography-scale
  - rule: quality/seo
  - rule: quality/performance
provides:
  - Hero component com 4 variantes
used_by:
  - agent: 03-builder
  - command: new-page
  - command: new-section
---

# Build Hero Section

Seção hero otimizada para conversão. Os 5 elementos essenciais above-the-fold aumentam conversão em ~30%: headline, subheadline, CTA, visual e trust signal.

## 5 Elementos Essenciais

| Elemento | Regra | Impacto |
|----------|-------|---------|
| **Headline (H1)** | Orientado a benefício, 5–12 palavras, contém keyword principal | SEO + primeira impressão |
| **Subheadline** | Proposta de valor de suporte, 15–25 palavras | Clarifica a promessa |
| **CTA primário** | Texto orientado a ação ("Comece Grátis", não "Enviar") | Conversão direta |
| **Visual** | Imagem/vídeo relevante, next/image com priority | LCP + engajamento |
| **Trust signal** | Logos de clientes, rating, número de usuários | Credibilidade |

## 4 Variantes

1. **Full-screen** — visual ocupa viewport inteira, texto sobre overlay
2. **Split** — texto à esquerda, imagem à direita (50/50)
3. **Product-focused** — screenshot/mockup centralizado abaixo do texto
4. **Minimal** — apenas texto e CTA, sem visual pesado

## Variante Split — Código Completo

```tsx
// src/components/sections/hero-split.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface HeroSplitProps {
  headline: string
  subheadline: string
  ctaText: string
  ctaHref: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  imageSrc: string
  imageAlt: string
  trustLogos?: { src: string; alt: string; width: number; height: number }[]
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1],
    },
  }),
}

export function HeroSplit({
  headline,
  subheadline,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  imageSrc,
  imageAlt,
  trustLogos,
}: HeroSplitProps) {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-12 px-4 py-[var(--section-py-lg)] sm:px-6 lg:flex-row lg:gap-16 lg:px-8">
        {/* Texto */}
        <div className="flex max-w-xl flex-1 flex-col items-start">
          <motion.h1
            className="text-5xl font-extrabold leading-tight tracking-tighter text-on-surface"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            {headline}
          </motion.h1>

          <motion.p
            className="mt-6 text-lg leading-relaxed text-on-surface-muted"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            {subheadline}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-4"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-base font-semibold text-on-accent shadow-md transition-all duration-fast hover:bg-accent-hover hover:shadow-lg active:bg-accent-active active:scale-[0.98]"
            >
              {ctaText}
            </Link>
            {secondaryCtaText && secondaryCtaHref && (
              <Link
                href={secondaryCtaHref}
                className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-base font-semibold text-on-surface transition-colors duration-fast hover:bg-muted"
              >
                {secondaryCtaText}
              </Link>
            )}
          </motion.div>

          {/* Trust signals */}
          {trustLogos && trustLogos.length > 0 && (
            <motion.div
              className="mt-10 flex flex-col gap-3"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
            >
              <p className="text-sm font-medium text-on-surface-subtle">
                Utilizado por empresas líderes
              </p>
              <div className="flex flex-wrap items-center gap-6 opacity-60 grayscale transition-opacity hover:opacity-100 hover:grayscale-0">
                {trustLogos.map((logo) => (
                  <Image
                    key={logo.alt}
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    className="h-8 w-auto"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Imagem */}
        <motion.div
          className="relative flex-1"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={640}
            height={480}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="rounded-xl shadow-xl"
          />
        </motion.div>
      </div>
    </section>
  )
}
```

## Variante Full-Screen

```tsx
// src/components/sections/hero-fullscreen.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface HeroFullscreenProps {
  headline: string
  subheadline: string
  ctaText: string
  ctaHref: string
  backgroundSrc: string
  backgroundAlt: string
}

export function HeroFullscreen({
  headline,
  subheadline,
  ctaText,
  ctaHref,
  backgroundSrc,
  backgroundAlt,
}: HeroFullscreenProps) {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden">
      <Image
        src={backgroundSrc}
        alt={backgroundAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-neutral-950/60" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <motion.h1
          className="text-5xl font-extrabold leading-tight tracking-tighter text-white sm:text-6xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {headline}
        </motion.h1>
        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          {subheadline}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Link
            href={ctaHref}
            className="mt-8 inline-flex items-center rounded-lg bg-accent px-8 py-4 text-lg font-semibold text-on-accent shadow-lg transition-all duration-fast hover:bg-accent-hover hover:shadow-xl active:scale-[0.98]"
          >
            {ctaText}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
```

## Variante Product-Focused

```tsx
// src/components/sections/hero-product.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface HeroProductProps {
  headline: string
  subheadline: string
  ctaText: string
  ctaHref: string
  productImageSrc: string
  productImageAlt: string
}

export function HeroProduct({
  headline,
  subheadline,
  ctaText,
  ctaHref,
  productImageSrc,
  productImageAlt,
}: HeroProductProps) {
  return (
    <section className="overflow-hidden bg-surface">
      <div className="mx-auto max-w-screen-xl px-4 pt-[var(--section-py-lg)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            className="text-5xl font-extrabold leading-tight tracking-tighter text-on-surface"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {headline}
          </motion.h1>
          <motion.p
            className="mt-6 text-lg leading-relaxed text-on-surface-muted"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            {subheadline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Link
              href={ctaHref}
              className="mt-8 inline-flex items-center rounded-lg bg-accent px-6 py-3 text-base font-semibold text-on-accent shadow-md transition-all duration-fast hover:bg-accent-hover hover:shadow-lg active:scale-[0.98]"
            >
              {ctaText}
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Image
            src={productImageSrc}
            alt={productImageAlt}
            width={1280}
            height={720}
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="rounded-t-xl shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  )
}
```

## Variante Minimal

```tsx
// src/components/sections/hero-minimal.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface HeroMinimalProps {
  headline: string
  subheadline: string
  ctaText: string
  ctaHref: string
  badge?: string
}

export function HeroMinimal({
  headline,
  subheadline,
  ctaText,
  ctaHref,
  badge,
}: HeroMinimalProps) {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-[var(--section-py-lg)] text-center sm:px-6">
        {badge && (
          <motion.span
            className="mb-6 inline-flex items-center rounded-full bg-accent-subtle px-4 py-1.5 text-sm font-medium text-accent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {badge}
          </motion.span>
        )}
        <motion.h1
          className="text-5xl font-extrabold leading-tight tracking-tighter text-on-surface sm:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {headline}
        </motion.h1>
        <motion.p
          className="mt-6 text-lg leading-relaxed text-on-surface-muted"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          {subheadline}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Link
            href={ctaHref}
            className="mt-8 inline-flex items-center rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-on-accent shadow-md transition-all duration-fast hover:bg-accent-hover hover:shadow-lg active:scale-[0.98]"
          >
            {ctaText}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
```

## Animação Padrão

Spring physics para entrada natural:

```ts
const springEntrance = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1], // spring overshoot
    },
  },
}
```

Stagger entre elementos: 100ms de delay incremental. Máximo 400ms total de duração por elemento.

## SEO

- H1 é o **primeiro heading** da página — contém keyword principal
- H1 deve ter 5–12 palavras, orientado ao benefício do usuário
- Subheadline expande a keyword com termos relacionados
- Imagem hero tem `alt` descritivo e relevante para SEO
- `priority={true}` no Image para otimizar LCP

## Performance

- Image com `priority` + `sizes` para LCP
- `'use client'` apenas neste componente (Framer Motion requer)
- Trust logos: dimensões explícitas, lazy load (sem priority)
- Background images em fullscreen: `fill` + `object-cover` + `sizes="100vw"`

## Validação

- [ ] H1 é o primeiro heading, 5–12 palavras com keyword
- [ ] CTA tem texto de ação, não genérico
- [ ] Image hero usa `priority={true}` e `sizes`
- [ ] Animações ≤ 400ms por elemento
- [ ] Layout responsivo: stack mobile, side-by-side desktop
- [ ] Trust signals presentes (logos ou social proof)
- [ ] Contraste texto/fundo ≥ 4.5:1 em fullscreen overlay
