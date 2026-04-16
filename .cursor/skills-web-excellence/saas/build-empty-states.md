---
id: skill-build-empty-states
title: "Build Empty States"
agent: 03-builder
version: 1.0
category: saas
priority: important
requires:
  - rule: 00-constitution
provides:
  - empty-state-components
  - skeleton-previews
used_by:
  - agent: 03-builder
  - command: /new-page
---

# Empty States — Nunca Branco, Sempre Útil

## Os 3 Elementos Obrigatórios

Todo empty state DEVE conter:
1. **Contexto** — por que está vazio (explicar o que apareceria aqui)
2. **Direção** — CTA específico para popular (não genérico)
3. **Preview** — skeleton ou ilustração de como ficará populado

## Componente Base

```typescript
// src/components/empty-states/empty-state.tsx
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  children?: React.ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 px-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>

      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>

      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action && (
            <button
              onClick={action.onClick}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}

      {children}
    </div>
  )
}
```

## Empty State — Dashboard (Primeiro Acesso)

```typescript
// src/components/empty-states/dashboard-empty.tsx
import { BarChart3 } from 'lucide-react'
import { EmptyState } from './empty-state'

export function DashboardEmpty() {
  return (
    <EmptyState
      icon={BarChart3}
      title="Seu dashboard está esperando dados"
      description="Conecte sua primeira fonte de dados ou crie um projeto para ver métricas, gráficos e insights aqui."
      action={{
        label: 'Criar primeiro projeto',
        onClick: () => {},
      }}
      secondaryAction={{
        label: 'Importar dados',
        onClick: () => {},
      }}
    >
      {/* Preview skeleton de como ficará */}
      <div className="mt-8 w-full max-w-lg space-y-4 opacity-40">
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-muted/30 p-4">
              <div className="h-2.5 w-16 rounded bg-muted" />
              <div className="mt-2 h-5 w-20 rounded bg-muted" />
            </div>
          ))}
        </div>
        <div className="h-40 rounded-lg border bg-muted/30" />
      </div>
    </EmptyState>
  )
}
```

## Empty State — Tabela de Dados

```typescript
// src/components/empty-states/table-empty.tsx
import { Table2 } from 'lucide-react'
import { EmptyState } from './empty-state'

interface TableEmptyProps {
  entityName: string
  onAdd: () => void
  onImport?: () => void
}

export function TableEmpty({ entityName, onAdd, onImport }: TableEmptyProps) {
  return (
    <EmptyState
      icon={Table2}
      title={`Nenhum ${entityName} encontrado`}
      description={`Adicione seu primeiro ${entityName} para começar a gerenciar tudo por aqui.`}
      action={{
        label: `Adicionar ${entityName}`,
        onClick: onAdd,
      }}
      secondaryAction={
        onImport
          ? { label: 'Importar CSV', onClick: onImport }
          : undefined
      }
    >
      {/* Preview de tabela fantasma */}
      <div className="mt-8 w-full max-w-md opacity-30">
        <div className="overflow-hidden rounded-lg border">
          <div className="border-b bg-muted/50 px-4 py-2">
            <div className="flex gap-8">
              <div className="h-2.5 w-20 rounded bg-muted" />
              <div className="h-2.5 w-24 rounded bg-muted" />
              <div className="h-2.5 w-16 rounded bg-muted" />
            </div>
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-b px-4 py-3 last:border-0">
              <div className="flex gap-8">
                <div className="h-2.5 w-24 rounded bg-muted/60" />
                <div className="h-2.5 w-32 rounded bg-muted/40" />
                <div className="h-2.5 w-14 rounded bg-muted/30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </EmptyState>
  )
}
```

## Empty State — Lista/Feed

```typescript
// src/components/empty-states/list-empty.tsx
import { Inbox } from 'lucide-react'
import { EmptyState } from './empty-state'

interface ListEmptyProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function ListEmpty({
  title = 'Lista vazia',
  description = 'Itens aparecerão aqui quando forem adicionados.',
  actionLabel = 'Criar primeiro item',
  onAction,
}: ListEmptyProps) {
  return (
    <EmptyState
      icon={Inbox}
      title={title}
      description={description}
      action={onAction ? { label: actionLabel, onClick: onAction } : undefined}
    >
      {/* Preview de lista fantasma */}
      <div className="mt-6 w-full max-w-sm space-y-3 opacity-30">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border px-4 py-3">
            <div className="h-8 w-8 shrink-0 rounded-full bg-muted" />
            <div className="flex-1 space-y-1.5">
              <div className="h-2.5 w-2/3 rounded bg-muted" />
              <div className="h-2 w-1/3 rounded bg-muted/60" />
            </div>
          </div>
        ))}
      </div>
    </EmptyState>
  )
}
```

## Empty State — Notificações

```typescript
// src/components/empty-states/notifications-empty.tsx
import { Bell } from 'lucide-react'
import { EmptyState } from './empty-state'

export function NotificationsEmpty() {
  return (
    <EmptyState
      icon={Bell}
      title="Tudo em dia!"
      description="Você não tem notificações pendentes. Novas atualizações aparecerão aqui."
    />
  )
}
```

## Empty State — Busca Sem Resultado

```typescript
// src/components/empty-states/search-empty.tsx
import { SearchX } from 'lucide-react'

interface SearchEmptyProps {
  query: string
  onClear: () => void
}

export function SearchEmpty({ query, onClear }: SearchEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <SearchX className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-base font-semibold">
        Nenhum resultado para &ldquo;{query}&rdquo;
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        Tente usar termos mais amplos ou verifique a ortografia.
      </p>
      <button
        onClick={onClear}
        className="mt-4 text-sm font-medium text-primary hover:underline"
      >
        Limpar busca
      </button>
    </div>
  )
}
```

## Empty State — Erro de Carregamento

```typescript
// src/components/empty-states/error-state.tsx
import { AlertTriangle } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Algo deu errado',
  description = 'Não foi possível carregar os dados. Tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 py-12 px-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Tentar novamente
        </button>
      )}
    </div>
  )
}
```

## Regras de Ouro

1. **Nunca branco** — tela vazia sem orientação é abandono garantido
2. **CTA específico** — "Criar primeiro projeto" > "Começar"
3. **Tom humanizado** — "Tudo em dia!" ao invés de "0 notificações"
4. **Skeleton preview** — mostra como vai ficar populado (reduz ansiedade)
5. **Ação secundária** — ofereça importação, template ou exemplo
6. **Ilustração opcional** — ícone + texto basta; ilustração é bônus
