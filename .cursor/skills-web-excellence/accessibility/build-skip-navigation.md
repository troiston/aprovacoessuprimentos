---
id: skill-build-skip-navigation
title: "Build Skip Navigation"
agent: 03-builder
version: 1.0
category: accessibility
priority: standard
requires:
  - rule: 00-constitution
provides:
  - skip navigation como primeiro elemento focável
  - navegação rápida por teclado para conteúdo principal
  - skip links adicionais para páginas complexas
used_by:
  - agent: 03-builder
  - command: /new-page
---

# Skip Navigation

## Por Que É Necessário

Usuários de teclado e leitores de tela precisam navegar por TODOS os links do header/nav antes de chegar ao conteúdo principal. Em um site com 20+ links no header, são 20+ Tabs. Skip navigation resolve isso: um link invisível que aparece no primeiro Tab e pula direto para o conteúdo.

## Componente Completo

```tsx
// components/skip-navigation.tsx
import { cn } from '@/lib/utils'

interface SkipLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

function SkipLink({ href, children, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        // Invisível por padrão (fora da tela)
        'sr-only',
        // Visível quando focado via Tab
        'focus:not-sr-only',
        'focus:fixed focus:left-4 focus:top-4 focus:z-[9999]',
        'focus:rounded-lg focus:bg-primary focus:px-6 focus:py-3',
        'focus:text-sm focus:font-semibold focus:text-primary-foreground',
        'focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        className
      )}
    >
      {children}
    </a>
  )
}

export function SkipNavigation() {
  return (
    <SkipLink href="#main-content">
      Pular para o conteúdo principal
    </SkipLink>
  )
}

export function SkipNavigationExtended() {
  return (
    <div className="contents">
      <SkipLink href="#main-content">
        Pular para o conteúdo principal
      </SkipLink>
      <SkipLink href="#search">
        Pular para a busca
      </SkipLink>
      <SkipLink href="#footer-nav">
        Pular para o rodapé
      </SkipLink>
    </div>
  )
}
```

## Integração no Layout

```tsx
// app/layout.tsx
import { SkipNavigation } from '@/components/skip-navigation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        {/* PRIMEIRO elemento do body — antes de tudo */}
        <SkipNavigation />

        <header>
          <nav aria-label="Navegação principal">
            {/* ... links do menu ... */}
          </nav>
        </header>

        {/* Âncora de destino do skip link */}
        <main id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </main>

        <footer>
          <nav id="footer-nav" aria-label="Navegação do rodapé">
            {/* ... */}
          </nav>
        </footer>
      </body>
    </html>
  )
}
```

### Por que `tabIndex={-1}` no `<main>`?

O `<main>` não é focável por padrão. Quando o skip link ativa (`#main-content`), o browser scrolla até o elemento, mas o foco pode não mover. `tabIndex={-1}` permite que o elemento receba foco programaticamente sem entrar na ordem de Tab natural.

A classe `outline-none` evita o anel de foco visível no `<main>` (já que o conteúdo inteiro não precisa de indicação visual de foco).

## Páginas Complexas — Skip Links Extras

Para dashboards, aplicações com sidebar, ou páginas com muitas seções:

```tsx
// components/skip-navigation-dashboard.tsx
export function SkipNavigationDashboard() {
  return (
    <div className="contents">
      <SkipLink href="#main-content">
        Pular para o conteúdo principal
      </SkipLink>
      <SkipLink href="#sidebar-nav">
        Pular para a navegação lateral
      </SkipLink>
      <SkipLink href="#search-input">
        Pular para a busca
      </SkipLink>
    </div>
  )
}
```

```tsx
// app/dashboard/layout.tsx
import { SkipNavigationDashboard } from '@/components/skip-navigation-dashboard'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipNavigationDashboard />

      <div className="flex min-h-screen">
        <aside id="sidebar-nav" className="w-64 border-r">
          <nav aria-label="Menu do dashboard">
            {/* ... sidebar links ... */}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="border-b px-6 py-4">
            <div className="relative">
              <label htmlFor="search-input" className="sr-only">Buscar</label>
              <input
                id="search-input"
                type="search"
                placeholder="Buscar..."
                className="w-full rounded-lg border px-4 py-2 pl-10"
              />
            </div>
          </header>

          <main id="main-content" tabIndex={-1} className="p-6 outline-none">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
```

## Teste do Skip Navigation

```typescript
// e2e/skip-nav.spec.ts
import { test, expect } from '@playwright/test'

test('skip navigation funciona corretamente', async ({ page }) => {
  await page.goto('/')

  // Tab para o primeiro elemento focável
  await page.keyboard.press('Tab')

  // Skip link deve ser o primeiro
  const skipLink = page.getByText('Pular para o conteúdo principal')
  await expect(skipLink).toBeFocused()
  await expect(skipLink).toBeVisible()

  // Ativar o skip link
  await page.keyboard.press('Enter')

  // Focus deve estar no main
  const main = page.locator('#main-content')
  await expect(main).toBeFocused()

  // Próximo Tab deve ir para o primeiro elemento interativo DENTRO do main
  await page.keyboard.press('Tab')
  const focusedElement = page.locator(':focus')
  const isInsideMain = await focusedElement.evaluate(
    (el) => !!el.closest('#main-content')
  )
  expect(isInsideMain).toBe(true)
})

test('skip link invisível quando não focado', async ({ page }) => {
  await page.goto('/')

  const skipLink = page.getByText('Pular para o conteúdo principal')

  // Antes do Tab — invisível
  await expect(skipLink).not.toBeVisible()

  // Após Tab — visível
  await page.keyboard.press('Tab')
  await expect(skipLink).toBeVisible()

  // Após Tab novamente — invisível de novo
  await page.keyboard.press('Tab')
  await expect(skipLink).not.toBeVisible()
})
```

## Checklist

- [ ] Skip link é o **primeiro** elemento focável da página
- [ ] Skip link invisível por padrão (sr-only)
- [ ] Skip link visível quando recebe foco (Tab)
- [ ] Destino `#main-content` existe no `<main>`
- [ ] `<main>` tem `tabIndex={-1}` para receber foco
- [ ] Skip links adicionais em páginas complexas (busca, sidebar)
- [ ] Teste E2E validando comportamento de foco
- [ ] Funciona em todos os browsers (Chrome, Firefox, Safari)
