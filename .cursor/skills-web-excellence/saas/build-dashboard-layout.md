---
id: skill-build-dashboard-layout
title: "Build Dashboard Layout"
agent: 03-builder
version: 1.0
category: saas
priority: critical
requires:
  - skill: skill-build-auth-flow
  - rule: 00-constitution
provides:
  - dashboard-layout
  - sidebar-navigation
  - f-pattern-hierarchy
used_by:
  - agent: 03-builder
  - command: /new-page
---

# Layout de Dashboard — Sidebar + Header + Content

## Padrão F-Pattern

```
┌─────────────────────────────────────────┐
│ Header: breadcrumbs + search + user     │
├────────┬────────────────────────────────┤
│        │ Status/Alertas (topo)          │
│ Side   │ Métricas (3-5 headline cards)  │
│ bar    │ Charts (linha temporal)        │
│        │ Tabela (dados detalhados)      │
│ Nav    │                                │
│ items  │                                │
│        │                                │
└────────┴────────────────────────────────┘
```

## Sidebar Component

```typescript
// src/components/dashboard/sidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  CreditCard,
  FileText,
  Bell,
  HelpCircle,
  ChevronLeft,
  LogOut,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Clientes', href: '/dashboard/clientes', icon: Users, badge: 3 },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Conteúdo', href: '/dashboard/conteudo', icon: FileText },
  { label: 'Faturamento', href: '/dashboard/faturamento', icon: CreditCard },
  { label: 'Notificações', href: '/dashboard/notificacoes', icon: Bell, badge: 12 },
]

const BOTTOM_ITEMS = [
  { label: 'Ajuda', href: '/dashboard/ajuda', icon: HelpCircle },
  { label: 'Configurações', href: '/dashboard/configuracoes', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`flex h-screen flex-col border-r bg-card transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href="/dashboard" className="text-lg font-bold">
            Marca
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
          aria-label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Nav principal — scrollável */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && item.badge && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Nav inferior */}
      <div className="border-t p-3">
        <ul className="space-y-1">
          {BOTTOM_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
          <li>
            <button
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              title={collapsed ? 'Sair' : undefined}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Sair</span>}
            </button>
          </li>
        </ul>
      </div>
    </aside>
  )
}
```

## Header Component

```typescript
// src/components/dashboard/header.tsx
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { Search } from 'lucide-react'

interface HeaderProps {
  children?: React.ReactNode
}

export function DashboardHeader({ children }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <Breadcrumbs />

      <div className="flex items-center gap-4">
        {/* Busca */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar... (⌘K)"
            className="h-9 w-64 rounded-lg border bg-muted/50 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {children}

        {/* Avatar do usuário */}
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          JD
        </button>
      </div>
    </header>
  )
}
```

## Layout Root do Dashboard

```typescript
// src/app/dashboard/layout.tsx
import { Sidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
```

## Página Dashboard com F-Pattern

```typescript
// src/app/dashboard/page.tsx
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* 1. Status/Alertas no topo */}
      <Suspense fallback={<AlertSkeleton />}>
        <AlertBanner />
      </Suspense>

      {/* 2. Métricas headline (3-5 cards) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Receita Mensal" value="R$ 47.850" change="+12.3%" trend="up" />
        <MetricCard title="Clientes Ativos" value="1.284" change="+4.1%" trend="up" />
        <MetricCard title="Taxa de Churn" value="2.1%" change="-0.3%" trend="down" />
        <MetricCard title="NPS Score" value="72" change="+5" trend="up" />
      </div>

      {/* 3. Charts */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <Suspense fallback={<ChartSkeleton />}>
            <RevenueChart />
          </Suspense>
        </div>
        <div className="lg:col-span-3">
          <Suspense fallback={<ChartSkeleton />}>
            <TopSourcesChart />
          </Suspense>
        </div>
      </div>

      {/* 4. Tabela de dados detalhados */}
      <Suspense fallback={<TableSkeleton />}>
        <RecentTransactionsTable />
      </Suspense>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
}

function MetricCard({ title, value, change, trend }: MetricCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <p className="text-sm text-muted-foreground">{title}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-2xl font-bold">{value}</p>
        <span
          className={`text-xs font-medium ${
            trend === 'up' ? 'text-emerald-600' : 'text-red-500'
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  )
}
```

## Mobile — Sidebar como Sheet

Para mobile, converter a sidebar em um drawer/sheet:

```typescript
// src/components/dashboard/mobile-nav.tsx
'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Sidebar } from './sidebar'

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <div className="relative">
              <Sidebar />
              <button
                onClick={() => setOpen(false)}
                className="absolute right-2 top-4 p-1"
                aria-label="Fechar menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
```

## Regras de Sidebar

- **6+ itens de navegação** → sidebar obrigatória (não usar top-nav)
- **Scrollável** → conteúdo da nav deve scrollar independente
- **Colapsável** → ícone + label → só ícone
- **Badges** → número de itens pendentes em destaque
- **Active state** → fundo colorido + texto primary no item ativo
- **Bottom section** → Help, Settings e Logout sempre no rodapé
