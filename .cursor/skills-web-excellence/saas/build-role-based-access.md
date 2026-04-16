---
id: skill-build-role-based-access
title: "Build Role Based Access"
agent: 03-builder
version: 1.0
category: saas
priority: standard
requires:
  - skill: skill-build-auth-flow
  - rule: 00-constitution
provides:
  - rbac-middleware
  - conditional-ui-by-role
  - server-action-authorization
used_by:
  - agent: 03-builder
  - command: /new-page
---

# RBAC — Controle de Acesso Baseado em Roles

## Roles e Permissões

| Role | Descrição | Pode ver dashboard | Pode editar | Pode gerenciar time | Pode faturar | Admin |
|------|-----------|:------------------:|:-----------:|:-------------------:|:------------:|:-----:|
| `admin` | Acesso total | ✓ | ✓ | ✓ | ✓ | ✓ |
| `member` | Colaborador | ✓ | ✓ | ✗ | ✗ | ✗ |
| `viewer` | Apenas leitura | ✓ | ✗ | ✗ | ✗ | ✗ |

## Definição de Permissões

```typescript
// src/lib/permissions.ts
export const ROLES = ['admin', 'member', 'viewer'] as const
export type Role = (typeof ROLES)[number]

export const PERMISSIONS = {
  'dashboard:view': ['admin', 'member', 'viewer'],
  'dashboard:edit': ['admin', 'member'],
  'content:create': ['admin', 'member'],
  'content:edit': ['admin', 'member'],
  'content:delete': ['admin'],
  'content:publish': ['admin'],
  'team:view': ['admin', 'member'],
  'team:manage': ['admin'],
  'team:invite': ['admin'],
  'billing:view': ['admin'],
  'billing:manage': ['admin'],
  'settings:view': ['admin', 'member', 'viewer'],
  'settings:edit': ['admin'],
  'api-keys:view': ['admin'],
  'api-keys:manage': ['admin'],
} as const satisfies Record<string, readonly Role[]>

export type Permission = keyof typeof PERMISSIONS

export function hasPermission(role: Role, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(role)
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p))
}

export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p))
}
```

## Utilidade de Sessão no Servidor

```typescript
// src/lib/auth-utils.ts
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import type { Role, Permission } from '@/lib/permissions'
import { hasPermission } from '@/lib/permissions'

export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  return session.user as typeof session.user & { role: Role }
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Não autenticado')
  return user
}

export async function requirePermission(permission: Permission) {
  const user = await requireUser()
  if (!hasPermission(user.role, permission)) {
    throw new Error(`Permissão negada: ${permission}`)
  }
  return user
}

export async function requireRole(allowedRoles: Role[]) {
  const user = await requireUser()
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Role insuficiente. Necessário: ${allowedRoles.join(', ')}`)
  }
  return user
}
```

## Middleware de Proteção de Rotas

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Role } from '@/lib/permissions'

interface RouteConfig {
  path: string
  roles: Role[]
}

const PROTECTED_ROUTES: RouteConfig[] = [
  { path: '/dashboard/faturamento', roles: ['admin'] },
  { path: '/dashboard/configuracoes', roles: ['admin'] },
  { path: '/dashboard/equipe', roles: ['admin', 'member'] },
  { path: '/dashboard', roles: ['admin', 'member', 'viewer'] },
]

const PUBLIC_ROUTES = ['/', '/login', '/signup', '/forgot-password', '/verify-email']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get('session_token')?.value
  const roleCookie = request.cookies.get('user_role')?.value as Role | undefined

  if (PUBLIC_ROUTES.some((r) => pathname === r)) {
    return NextResponse.next()
  }

  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (roleCookie) {
    const routeConfig = PROTECTED_ROUTES.find(
      (r) => pathname === r.path || pathname.startsWith(r.path + '/')
    )

    if (routeConfig && !routeConfig.roles.includes(roleCookie)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
```

## Componentes de UI Condicional

### Gate Component

```typescript
// src/components/auth/permission-gate.tsx
'use client'

import { useSession } from '@/hooks/use-session'
import { hasPermission, type Permission, type Role } from '@/lib/permissions'

interface PermissionGateProps {
  permission: Permission
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGate({ permission, fallback = null, children }: PermissionGateProps) {
  const { user } = useSession()
  if (!user) return null

  const userRole = user.role as Role

  if (!hasPermission(userRole, permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
```

### Role Gate

```typescript
// src/components/auth/role-gate.tsx
'use client'

import { useSession } from '@/hooks/use-session'
import type { Role } from '@/lib/permissions'

interface RoleGateProps {
  roles: Role[]
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function RoleGate({ roles, fallback = null, children }: RoleGateProps) {
  const { user } = useSession()
  if (!user) return null

  if (!roles.includes(user.role as Role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
```

### Uso nos Componentes

```typescript
// src/app/dashboard/page.tsx
import { PermissionGate } from '@/components/auth/permission-gate'
import { RoleGate } from '@/components/auth/role-gate'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Métricas visíveis para todos */}
      <MetricsCards />

      {/* Botão de criar — apenas members e admin */}
      <PermissionGate permission="content:create">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Criar novo conteúdo
        </button>
      </PermissionGate>

      {/* Tabela editável vs read-only */}
      <PermissionGate
        permission="content:edit"
        fallback={<ContentTableReadOnly />}
      >
        <ContentTableEditable />
      </PermissionGate>

      {/* Admin-only: link para settings */}
      <RoleGate roles={['admin']}>
        <AdminPanel />
      </RoleGate>

      {/* Viewer vê aviso */}
      <RoleGate roles={['viewer']}>
        <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
          Você tem acesso somente leitura. Solicite ao admin para editar conteúdo.
        </div>
      </RoleGate>
    </div>
  )
}
```

## Autorização em Server Actions

```typescript
// src/actions/content.ts
'use server'

import { requirePermission } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  slug: z.string().min(1).max(100),
})

export async function createPost(input: z.infer<typeof createPostSchema>) {
  const user = await requirePermission('content:create')
  const data = createPostSchema.parse(input)

  return prisma.post.create({
    data: {
      ...data,
      authorId: user.id,
    },
  })
}

export async function deletePost(postId: string) {
  const user = await requirePermission('content:delete')

  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) throw new Error('Post não encontrado')

  return prisma.post.delete({ where: { id: postId } })
}

export async function publishPost(postId: string) {
  await requirePermission('content:publish')

  return prisma.post.update({
    where: { id: postId },
    data: { published: true, publishedAt: new Date() },
  })
}

export async function inviteTeamMember(email: string, role: string) {
  await requirePermission('team:invite')

  return prisma.invitation.create({
    data: { email, role, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  })
}
```

## Autorização em Server Components

```typescript
// src/app/dashboard/equipe/page.tsx
import { requirePermission } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function TeamPage() {
  try {
    await requirePermission('team:view')
  } catch {
    redirect('/dashboard')
  }

  const members = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Equipe</h1>
      </div>
      <TeamMembersTable members={members} />
    </div>
  )
}
```

## Checklist de Segurança

- [ ] Permissões verificadas no **servidor** (não apenas UI)
- [ ] Server Actions protegidas com `requirePermission`
- [ ] Middleware redireciona roles insuficientes
- [ ] UI condicional via `PermissionGate` / `RoleGate`
- [ ] Viewers não veem botões de ação
- [ ] Admin actions em danger zone com confirmação
- [ ] Role armazenada no JWT/session, não apenas cookie de client
- [ ] Logs de auditoria para ações administrativas
