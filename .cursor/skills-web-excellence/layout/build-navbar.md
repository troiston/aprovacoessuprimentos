---
id: skill-build-navbar
title: "Build Navbar"
agent: 03-builder
version: 1.0
category: layout
priority: critical
requires:
  - skill: skill-build-design-tokens
  - rule: quality/accessibility
provides:
  - componente navbar responsivo
used_by:
  - agent: 03-builder
---

# Build Navbar

Navegação responsiva com scroll detection, mobile drawer, estados ativos e acessibilidade completa.

## Requisitos

| Feature | Desktop | Mobile |
|---------|---------|--------|
| Layout | Horizontal: logo + links + CTA | Hamburger → drawer |
| Scroll | Transparente → sólido com backdrop-blur | Sempre sólido |
| Active | Estilo distinto no link da rota atual | Idem |
| Focus | Tab navigation completa | Focus trap no drawer |
| Skip nav | Primeiro elemento focável | Idem |

## Componente Completo

```tsx
// src/components/layout/navbar.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
}

interface NavbarProps {
  logo: React.ReactNode
  items: NavItem[]
  ctaText: string
  ctaHref: string
}

export function Navbar({ logo, items, ctaText, ctaHref }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setMobileOpen(false)
  }, [])

  return (
    <>
      {/* Skip Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent focus:shadow-lg"
      >
        Pular para o conteúdo
      </a>

      <header
        className={cn(
          'fixed top-0 right-0 left-0 z-fixed transition-all duration-normal',
          scrolled
            ? 'border-b border-border bg-surface/80 backdrop-blur-lg shadow-sm'
            : 'bg-transparent'
        )}
      >
        <nav
          className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
          aria-label="Navegação principal"
        >
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            {logo}
          </Link>

          {/* Desktop Links */}
          <ul className="hidden items-center gap-1 lg:flex" role="list">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-fast',
                    pathname === item.href
                      ? 'bg-accent-subtle text-accent'
                      : 'text-on-surface-muted hover:bg-muted hover:text-on-surface'
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:flex">
            <Link
              href={ctaHref}
              className="inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent shadow-sm transition-all duration-fast hover:bg-accent-hover hover:shadow-md active:scale-[0.98]"
            >
              {ctaText}
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-on-surface transition-colors hover:bg-muted lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              )}
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-fixed bg-surface-overlay/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              id="mobile-menu"
              className="fixed inset-y-0 right-0 z-modal w-full max-w-sm bg-surface-raised shadow-xl lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onKeyDown={handleKeyDown}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
            >
              <div className="flex h-full flex-col px-6 py-6">
                {/* Close */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="rounded-md p-2 text-on-surface-muted hover:bg-muted"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Fechar menu"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Links */}
                <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Menu mobile">
                  {items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'rounded-lg px-4 py-3 text-base font-medium transition-colors',
                        pathname === item.href
                          ? 'bg-accent-subtle text-accent'
                          : 'text-on-surface hover:bg-muted'
                      )}
                      aria-current={pathname === item.href ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* CTA */}
                <Link
                  href={ctaHref}
                  className="mt-auto inline-flex w-full items-center justify-center rounded-lg bg-accent px-5 py-3 text-base font-semibold text-on-accent transition-all duration-fast hover:bg-accent-hover active:scale-[0.98]"
                >
                  {ctaText}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
```

## Uso no Layout

```tsx
// src/app/layout.tsx
import { Navbar } from '@/components/layout/navbar'

const navItems = [
  { label: 'Produto', href: '/produto' },
  { label: 'Preços', href: '/precos' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Blog', href: '/blog' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Navbar
          logo={<span className="text-xl font-bold text-on-surface">Logo</span>}
          items={navItems}
          ctaText="Comece Grátis"
          ctaHref="/signup"
        />
        <main id="main-content" className="pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}
```

## Acessibilidade

| Requisito | Implementação |
|-----------|---------------|
| Skip nav | `<a href="#main-content">` como primeiro focável, `sr-only` visível no focus |
| Landmark | `<nav aria-label="Navegação principal">` |
| aria-current | `aria-current="page"` no link ativo |
| aria-expanded | No botão hamburger |
| aria-modal | No drawer mobile |
| Focus trap | `onKeyDown` Escape fecha drawer |
| Body scroll lock | `overflow: hidden` quando drawer aberto |

## Scroll Detection

O navbar muda de transparente para sólido com `backdrop-blur-lg` após 20px de scroll. O event listener usa `{ passive: true }` para não bloquear scroll.

## Regras

1. **Sempre** inclua skip navigation link antes do header
2. Hamburger só aparece em `lg:hidden`
3. Drawer fecha no `pathname` change e na tecla Escape
4. Logo sempre linka para `/`
5. CTA é o último elemento (hierarquia visual de importância)
6. Máximo 6 links de navegação no desktop
7. Mobile drawer ocupa `max-w-sm`, não fullscreen

## Validação

- [ ] Skip nav funciona com Tab + Enter
- [ ] `aria-label` no `<nav>` e no drawer
- [ ] `aria-current="page"` no link ativo
- [ ] Hamburger tem `aria-expanded` e `aria-label`
- [ ] Drawer fecha com Escape
- [ ] Body scroll travado quando drawer aberto
- [ ] Transition transparente→sólido suave (300ms)
- [ ] Logo linka para home
