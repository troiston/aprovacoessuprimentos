---
id: skill-build-settings-page
title: "Build Settings Page"
agent: 03-builder
version: 1.0
category: saas
priority: standard
requires:
  - skill: skill-build-dashboard-layout
  - rule: 00-constitution
provides:
  - settings-tabs
  - profile-management
  - danger-zone
used_by:
  - agent: 03-builder
  - command: /new-page
---

# Página de Configurações — Tabs com Auto-Save

## Estrutura de Tabs

```
Configurações
├── Perfil (nome, email, avatar, bio)
├── Notificações (email, push, in-app toggles)
├── Equipe (membros, convites, roles)
├── API Keys (gerar, copiar, revogar)
└── Billing (redirect para /faturamento)
```

## Layout com Tabs

```typescript
// src/app/dashboard/configuracoes/page.tsx
'use client'

import { useState } from 'react'
import { ProfileTab } from '@/components/settings/profile-tab'
import { NotificationsTab } from '@/components/settings/notifications-tab'
import { TeamTab } from '@/components/settings/team-tab'
import { ApiKeysTab } from '@/components/settings/api-keys-tab'
import { DangerZone } from '@/components/settings/danger-zone'

const TABS = [
  { id: 'profile', label: 'Perfil' },
  { id: 'notifications', label: 'Notificações' },
  { id: 'team', label: 'Equipe' },
  { id: 'api-keys', label: 'API Keys' },
] as const

type TabId = (typeof TABS)[number]['id']

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('profile')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="mt-1 text-muted-foreground">Gerencie sua conta e preferências.</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="-mb-px flex gap-6" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'team' && <TeamTab />}
        {activeTab === 'api-keys' && <ApiKeysTab />}
      </div>

      {/* Danger Zone — sempre visível */}
      {activeTab === 'profile' && <DangerZone />}
    </div>
  )
}
```

## Tab Perfil com Auto-Save

```typescript
// src/components/settings/profile-tab.tsx
'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateProfile } from '@/actions/settings'

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  bio: z.string().max(160, 'Bio deve ter no máximo 160 caracteres').optional(),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
})

type ProfileInput = z.infer<typeof profileSchema>

export function ProfileTab() {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'João da Silva',
      email: 'joao@email.com',
      bio: '',
      website: '',
    },
  })

  const onSubmit = useCallback(async (data: ProfileInput) => {
    setSaveStatus('saving')
    try {
      await updateProfile(data)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch {
      setSaveStatus('error')
    }
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
          JS
        </div>
        <div>
          <button type="button" className="text-sm font-medium text-primary hover:underline">
            Alterar foto
          </button>
          <p className="text-xs text-muted-foreground">JPG, PNG. Máx 2MB.</p>
        </div>
      </div>

      {/* Nome */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Nome</label>
        <input
          id="name"
          type="text"
          className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          {...register('name')}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input
          id="email"
          type="email"
          className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          {...register('email')}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">Bio</label>
        <textarea
          id="bio"
          rows={3}
          maxLength={160}
          placeholder="Breve descrição sobre você"
          className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          {...register('bio')}
        />
        {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
      </div>

      {/* Website */}
      <div className="space-y-2">
        <label htmlFor="website" className="text-sm font-medium">Website</label>
        <input
          id="website"
          type="url"
          placeholder="https://seusite.com"
          className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          {...register('website')}
        />
        {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
      </div>

      {/* Submit com feedback */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saveStatus === 'saving'}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saveStatus === 'saving' ? 'Salvando...' : 'Salvar alterações'}
        </button>
        {saveStatus === 'saved' && (
          <span className="text-sm text-emerald-600">✓ Salvo com sucesso</span>
        )}
        {saveStatus === 'error' && (
          <span className="text-sm text-destructive">Erro ao salvar. Tente novamente.</span>
        )}
      </div>
    </form>
  )
}
```

## Tab Notificações

```typescript
// src/components/settings/notifications-tab.tsx
'use client'

import { useState } from 'react'

interface NotificationSetting {
  id: string
  label: string
  description: string
  email: boolean
  push: boolean
  inApp: boolean
}

const DEFAULTS: NotificationSetting[] = [
  { id: 'new-lead', label: 'Novo lead', description: 'Quando um novo lead se cadastra', email: true, push: true, inApp: true },
  { id: 'payment', label: 'Pagamento recebido', description: 'Quando um pagamento é processado', email: true, push: false, inApp: true },
  { id: 'team-invite', label: 'Convite de equipe', description: 'Quando alguém te convida', email: true, push: true, inApp: true },
  { id: 'weekly-report', label: 'Relatório semanal', description: 'Resumo de métricas toda segunda', email: true, push: false, inApp: false },
  { id: 'marketing', label: 'Novidades e dicas', description: 'Atualizações de produto e conteúdo', email: false, push: false, inApp: true },
]

export function NotificationsTab() {
  const [settings, setSettings] = useState(DEFAULTS)

  function toggle(id: string, channel: 'email' | 'push' | 'inApp') {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [channel]: !s[channel] } : s))
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Notificação</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Push</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">In-app</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((setting) => (
              <tr key={setting.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{setting.label}</p>
                  <p className="text-xs text-muted-foreground">{setting.description}</p>
                </td>
                {(['email', 'push', 'inApp'] as const).map((channel) => (
                  <td key={channel} className="px-4 py-3 text-center">
                    <button
                      role="switch"
                      aria-checked={setting[channel]}
                      onClick={() => toggle(setting.id, channel)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        setting[channel] ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          setting[channel] ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

## Tab API Keys

```typescript
// src/components/settings/api-keys-tab.tsx
'use client'

import { useState } from 'react'
import { Copy, Eye, EyeOff, Trash2 } from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed: string | null
}

export function ApiKeysTab() {
  const [keys, setKeys] = useState<ApiKey[]>([
    { id: '1', name: 'Production', key: 'sk_live_abc123...xyz', createdAt: '2026-01-15', lastUsed: '2026-04-07' },
    { id: '2', name: 'Development', key: 'sk_test_def456...uvw', createdAt: '2026-03-01', lastUsed: '2026-04-06' },
  ])
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  function toggleVisibility(id: string) {
    setVisibleKeys((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function copyKey(key: string) {
    await navigator.clipboard.writeText(key)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Chaves de API para integrar com serviços externos.
        </p>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Gerar nova chave
        </button>
      </div>

      <div className="space-y-3">
        {keys.map((apiKey) => (
          <div key={apiKey.id} className="flex items-center justify-between rounded-xl border p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">{apiKey.name}</p>
              <div className="flex items-center gap-2">
                <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono">
                  {visibleKeys.has(apiKey.id) ? apiKey.key : '••••••••••••••••'}
                </code>
                <button
                  onClick={() => toggleVisibility(apiKey.id)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={visibleKeys.has(apiKey.id) ? 'Ocultar chave' : 'Mostrar chave'}
                >
                  {visibleKeys.has(apiKey.id) ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => copyKey(apiKey.key)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Copiar chave"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Criada em {apiKey.createdAt}
                {apiKey.lastUsed && ` · Último uso: ${apiKey.lastUsed}`}
              </p>
            </div>
            <button className="text-muted-foreground hover:text-destructive" aria-label="Revogar chave">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Danger Zone

```typescript
// src/components/settings/danger-zone.tsx
'use client'

import { useState } from 'react'

export function DangerZone() {
  const [confirmText, setConfirmText] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const CONFIRM_PHRASE = 'EXCLUIR MINHA CONTA'

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-destructive">Zona de perigo</h2>

      <div className="rounded-xl border border-destructive/30 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-medium">Excluir conta permanentemente</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Todos os seus dados, projetos e configurações serão removidos.
              Esta ação não pode ser desfeita.
            </p>
          </div>
          <button
            onClick={() => setShowConfirm(!showConfirm)}
            className="shrink-0 rounded-lg border border-destructive px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-white"
          >
            Excluir conta
          </button>
        </div>

        {showConfirm && (
          <div className="mt-6 space-y-4 border-t pt-4">
            <p className="text-sm text-destructive">
              Para confirmar, digite <strong>{CONFIRM_PHRASE}</strong> abaixo:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={CONFIRM_PHRASE}
              className="w-full rounded-lg border border-destructive/30 px-3 py-2 text-sm outline-none focus:border-destructive focus:ring-2 focus:ring-destructive/20"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowConfirm(false); setConfirmText('') }}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancelar
              </button>
              <button
                disabled={confirmText !== CONFIRM_PHRASE}
                className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                Excluir permanentemente
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
```
