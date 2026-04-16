---
id: skill-build-notification-system
title: "Build Notification System"
agent: 03-builder
version: 1.0
category: saas
priority: standard
requires:
  - rule: 00-constitution
provides:
  - toast-notifications
  - notification-center
  - badge-counter
used_by:
  - agent: 03-builder
  - command: /new-page
---

# Sistema de Notificações — Toast + Badge + Centro

## Arquitetura

```
┌─────────────────────────────┐
│ Toast (flutuante)           │  ← Feedback imediato de ação
│ Auto-dismiss 5s             │
├─────────────────────────────┤
│ Badge (ícone no header)     │  ← Contador de não-lidas
├─────────────────────────────┤
│ Notification Center         │  ← Dropdown com histórico
│ (dropdown)                  │
└─────────────────────────────┘
```

## Toast Provider (Context + Portal)

```typescript
// src/components/notifications/toast-context.tsx
'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  variant: ToastVariant
  title: string
  description?: string
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro de ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { ...toast, id }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}
```

## Toast Container

```typescript
// src/components/notifications/toast-container.tsx
import { X } from 'lucide-react'

const VARIANT_STYLES = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100',
  error: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
  warning: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100',
  info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100',
} as const

const VARIANT_ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

interface ToastContainerProps {
  toasts: Array<{
    id: string
    variant: keyof typeof VARIANT_STYLES
    title: string
    description?: string
  }>
  onRemove: (id: string) => void
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-label="Notificações"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 sm:bottom-6 sm:right-6"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={`flex w-80 items-start gap-3 rounded-xl border p-4 shadow-lg animate-in slide-in-from-right-full duration-300 ${VARIANT_STYLES[toast.variant]}`}
        >
          <span className="mt-0.5 text-base">{VARIANT_ICONS[toast.variant]}</span>
          <div className="flex-1 space-y-0.5">
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.description && (
              <p className="text-xs opacity-80">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => onRemove(toast.id)}
            className="shrink-0 opacity-60 hover:opacity-100"
            aria-label="Fechar notificação"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}

export { ToastContainer }
```

## Badge no Header

```typescript
// src/components/notifications/notification-bell.tsx
'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { NotificationCenter } from './notification-center'

interface NotificationBellProps {
  unreadCount: number
}

export function NotificationBell({ unreadCount }: NotificationBellProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={`Notificações${unreadCount > 0 ? `, ${unreadCount} não lidas` : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2">
            <NotificationCenter onClose={() => setOpen(false)} />
          </div>
        </>
      )}
    </div>
  )
}
```

## Notification Center (Dropdown)

```typescript
// src/components/notifications/notification-center.tsx
'use client'

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: 'info' | 'success' | 'warning' | 'error'
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Novo lead cadastrado', description: 'Maria Silva se inscreveu na newsletter.', time: '2 min', read: false, type: 'info' },
  { id: '2', title: 'Pagamento confirmado', description: 'Fatura #1234 de R$97 foi paga.', time: '1h', read: false, type: 'success' },
  { id: '3', title: 'Limite de API próximo', description: 'Você usou 85% da cota mensal.', time: '3h', read: true, type: 'warning' },
  { id: '4', title: 'Deploy falhado', description: 'Build #89 falhou no preview.', time: '5h', read: true, type: 'error' },
]

interface NotificationCenterProps {
  onClose: () => void
}

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  return (
    <div className="w-80 overflow-hidden rounded-xl border bg-card shadow-xl sm:w-96">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Notificações</h2>
        <button className="text-xs text-primary hover:underline">
          Marcar todas como lidas
        </button>
      </div>

      {/* Lista */}
      <div className="max-h-80 divide-y overflow-y-auto">
        {MOCK_NOTIFICATIONS.map((notification) => (
          <button
            key={notification.id}
            className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
              !notification.read ? 'bg-primary/[0.03]' : ''
            }`}
          >
            {!notification.read && (
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
            )}
            {notification.read && <span className="mt-1.5 h-2 w-2 shrink-0" />}
            <div className="flex-1 space-y-0.5">
              <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'}`}>
                {notification.title}
              </p>
              <p className="text-xs text-muted-foreground">{notification.description}</p>
              <p className="text-[11px] text-muted-foreground/70">{notification.time} atrás</p>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t px-4 py-2">
        <button
          onClick={onClose}
          className="w-full text-center text-xs font-medium text-primary hover:underline"
        >
          Ver todas as notificações
        </button>
      </div>
    </div>
  )
}
```

## Integração no Layout

```typescript
// src/app/layout.tsx
import { ToastProvider } from '@/components/notifications/toast-context'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
```

## Uso do Toast em Qualquer Componente

```typescript
'use client'

import { useToast } from '@/components/notifications/toast-context'

export function SaveButton() {
  const { addToast } = useToast()

  async function handleSave() {
    try {
      await saveData()
      addToast({
        variant: 'success',
        title: 'Salvo com sucesso',
        description: 'Suas alterações foram aplicadas.',
      })
    } catch {
      addToast({
        variant: 'error',
        title: 'Erro ao salvar',
        description: 'Tente novamente em alguns instantes.',
      })
    }
  }

  return <button onClick={handleSave}>Salvar</button>
}
```

## Acessibilidade

| Requisito | Implementação |
|-----------|---------------|
| `aria-live="polite"` | No container de toasts |
| `role="alert"` | Em cada toast individual |
| `aria-label` no bell | Inclui contagem de não-lidas |
| `aria-expanded` | No botão do dropdown |
| Auto-dismiss 5s | Tempo suficiente para ler |
| Botão fechar | Em cada toast |
