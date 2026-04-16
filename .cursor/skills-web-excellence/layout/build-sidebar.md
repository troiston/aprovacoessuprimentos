---
id: skill-build-sidebar
title: "Build Sidebar"
agent: 03-builder
version: 1.0
category: layout
priority: important
requires:
  - skill: skill-build-design-tokens
provides:
  - sidebar de navegação para dashboards SaaS
used_by:
  - agent: 03-builder
  - command: new-page
---

# Build Sidebar

Sidebar de navegação para dashboards SaaS com collapse/expand, estados ativos, badges, scroll independente e modo mobile.

## Requisitos

| Feature | Comportamento |
|---------|---------------|
| Desktop | Fixo à esquerda, 240px expandido, 64px colapsado |
| Mobile | Drawer overlay com backdrop |
| Items | Ícone + label + badge opcional |
| Active | Match por URL com `usePathname()` |
| Nested | Subitens com expand/collapse |
| Scroll | Scroll independente do conteúdo principal |
| Profile | Avatar + nome no rodapé |

## Componente Completo

```tsx
// src/components/layout/sidebar.tsx
'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NavSubItem {
  label: string
  href: string
}

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
  children?: NavSubItem[]
}

interface SidebarProps {
  items: NavItem[]
  user: {
    name: string
    email: string
    avatar?: string
  }
  logo: React.ReactNode
  logoCollapsed: React.ReactNode
}

interface SidebarContextType {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

function SidebarItem({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname()
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
  const [expanded, setExpanded] = useState(isActive)
  const hasChildren = item.children && item.children.length > 0

  return (
    <li>
      {hasChildren ? (
        <>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-accent-subtle text-accent'
                : 'text-on-surface-muted hover:bg-muted hover:text-on-surface'
            )}
            aria-expanded={expanded}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center">
              {item.icon}
            </span>
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                <svg
                  className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
                  fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </>
            )}
          </button>
          <AnimatePresence>
            {expanded && !collapsed && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {item.children!.map((child) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      className={cn(
                        'block rounded-lg py-2 pl-11 pr-3 text-sm transition-colors',
                        pathname === child.href
                          ? 'font-medium text-accent'
                          : 'text-on-surface-muted hover:text-on-surface'
                      )}
                      aria-current={pathname === child.href ? 'page' : undefined}
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </>
      ) : (
        <Link
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
            isActive
              ? 'bg-accent-subtle text-accent'
              : 'text-on-surface-muted hover:bg-muted hover:text-on-surface'
          )}
          aria-current={isActive ? 'page' : undefined}
          title={collapsed ? item.label : undefined}
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center">
            {item.icon}
          </span>
          {!collapsed && (
            <>
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1.5 text-xs font-semibold text-white">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </>
          )}
        </Link>
      )}
    </li>
  )
}

export function Sidebar({ items, user, logo, logoCollapsed }: SidebarProps) {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar()

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header: Logo + Toggle */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
        {collapsed ? logoCollapsed : logo}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden rounded-md p-1.5 text-on-surface-muted hover:bg-muted lg:inline-flex"
          aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          <svg className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* Nav Items (scrollable) */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navegação do dashboard">
        <ul className="flex flex-col gap-1" role="list">
          {items.map((item) => (
            <SidebarItem key={item.href} item={item} collapsed={collapsed} />
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="shrink-0 border-t border-border p-3">
        <div className={cn('flex items-center gap-3 rounded-lg px-2 py-2', collapsed && 'justify-center')}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-on-accent">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-on-surface">{user.name}</p>
              <p className="truncate text-xs text-on-surface-muted">{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-sticky hidden border-r border-border bg-surface-raised transition-[width] duration-normal lg:block',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-fixed bg-surface-overlay/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-modal w-60 bg-surface-raised shadow-xl lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              aria-label="Navegação do dashboard"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
```

## Layout com Sidebar

```tsx
// src/app/(dashboard)/layout.tsx
import { Sidebar, SidebarProvider, useSidebar } from '@/components/layout/sidebar'

const sidebarItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> },
  { label: 'Projetos', href: '/projetos', icon: <FolderIcon />, badge: 3 },
  {
    label: 'Configurações',
    href: '/configuracoes',
    icon: <GearIcon />,
    children: [
      { label: 'Perfil', href: '/configuracoes/perfil' },
      { label: 'Equipe', href: '/configuracoes/equipe' },
      { label: 'Billing', href: '/configuracoes/billing' },
    ],
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar
        items={sidebarItems}
        user={{ name: 'João Silva', email: 'joao@email.com' }}
        logo={<span className="text-lg font-bold">App</span>}
        logoCollapsed={<span className="text-lg font-bold">A</span>}
      />
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar()
  return (
    <main className={cn(
      'min-h-screen transition-[margin] duration-normal',
      collapsed ? 'lg:ml-16' : 'lg:ml-60'
    )}>
      {children}
    </main>
  )
}
```

## Acessibilidade

- `<nav aria-label>` no container de navegação
- `aria-current="page"` em links ativos
- `aria-expanded` em botões de subitem
- `aria-modal` e `role="dialog"` no drawer mobile
- Keyboard: Tab navega, Enter/Space abre subitens
- Toggle button com `aria-label` descritivo

## Regras

1. Desktop: persistente, nunca overlay
2. Mobile: drawer com backdrop, fecha no pathname change
3. Badge máximo "99+" — nunca renderize números grandes
4. Scroll independente: `overflow-y-auto` no nav, header e footer fixos
5. Transition suave para collapse: `transition-[width]`
6. User profile sempre no bottom

## Validação

- [ ] Desktop 240px expandido, 64px colapsado
- [ ] Mobile drawer com backdrop e animação
- [ ] URL matching para estado ativo
- [ ] Subitens com expand/collapse animado
- [ ] Badge counter presente e limitado a 99+
- [ ] Scroll independente no nav
- [ ] User profile no rodapé
- [ ] Navegação por teclado funcional
