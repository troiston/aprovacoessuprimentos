---
id: skill-build-onboarding
title: "Build Onboarding"
agent: 03-builder
version: 1.0
category: saas
priority: important
requires:
  - skill: skill-build-auth-flow
  - rule: 00-constitution
provides:
  - onboarding-wizard
  - activation-flow
used_by:
  - agent: 03-builder
  - command: /new-page
---

# Onboarding Wizard — Ativação Value-First

## Princípios

1. **3-5 steps máximo** — mais que isso = abandono
2. **Value-first** — guie até o "Aha! moment" o mais rápido possível
3. **Intent-based routing** — pergunte o papel/objetivo no primeiro passo
4. **Skip permitido** — nunca force preenchimento desnecessário
5. **Progresso visual** — o usuário sempre sabe onde está
6. **+50% ativação** — onboarding bem feito dobra a taxa de ativação

## Hook de Estado do Wizard

```typescript
// src/hooks/use-onboarding.ts
'use client'

import { useState, useCallback } from 'react'

interface UseOnboardingOptions {
  totalSteps: number
  onComplete: (data: Record<string, unknown>) => Promise<void>
}

export function useOnboarding({ totalSteps, onComplete }: UseOnboardingOptions) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [isCompleting, setIsCompleting] = useState(false)

  const updateData = useCallback((stepData: Record<string, unknown>) => {
    setFormData((prev) => ({ ...prev, ...stepData }))
  }, [])

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }, [totalSteps])

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)))
  }, [totalSteps])

  const complete = useCallback(async () => {
    setIsCompleting(true)
    try {
      await onComplete(formData)
    } finally {
      setIsCompleting(false)
    }
  }, [formData, onComplete])

  return {
    currentStep,
    totalSteps,
    formData,
    isCompleting,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    progress: ((currentStep + 1) / totalSteps) * 100,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    complete,
  }
}
```

## Barra de Progresso

```typescript
// src/components/onboarding/progress-bar.tsx
interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  labels: string[]
}

export function ProgressBar({ currentStep, totalSteps, labels }: ProgressBarProps) {
  return (
    <div className="w-full">
      {/* Barra visual */}
      <div className="mb-6 flex items-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex flex-1 items-center">
            <div
              className={`h-1.5 w-full rounded-full transition-colors duration-300 ${
                i <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Label do passo atual */}
      <p className="text-sm text-muted-foreground">
        Passo {currentStep + 1} de {totalSteps}
        <span className="ml-2 font-medium text-foreground">{labels[currentStep]}</span>
      </p>
    </div>
  )
}
```

## Wizard Completo

```typescript
// src/app/(auth)/onboarding/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useOnboarding } from '@/hooks/use-onboarding'
import { ProgressBar } from '@/components/onboarding/progress-bar'
import { saveOnboardingData } from '@/actions/onboarding'

const STEP_LABELS = ['Seu papel', 'Sua empresa', 'Seus objetivos', 'Pronto!']

export default function OnboardingPage() {
  const router = useRouter()

  const wizard = useOnboarding({
    totalSteps: 4,
    onComplete: async (data) => {
      await saveOnboardingData(data)
      router.push('/dashboard')
      router.refresh()
    },
  })

  const steps = [
    <StepRole key="role" wizard={wizard} />,
    <StepCompany key="company" wizard={wizard} />,
    <StepGoals key="goals" wizard={wizard} />,
    <StepReady key="ready" wizard={wizard} />,
  ]

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-8">
        <ProgressBar
          currentStep={wizard.currentStep}
          totalSteps={wizard.totalSteps}
          labels={STEP_LABELS}
        />

        <div className="min-h-[400px]">{steps[wizard.currentStep]}</div>
      </div>
    </div>
  )
}

type WizardProps = { wizard: ReturnType<typeof useOnboarding> }

function StepRole({ wizard }: WizardProps) {
  const roles = [
    { id: 'founder', label: 'Fundador / CEO', icon: '🚀', description: 'Estou construindo meu negócio' },
    { id: 'developer', label: 'Desenvolvedor', icon: '💻', description: 'Vou usar a API e integrações' },
    { id: 'marketer', label: 'Marketing', icon: '📈', description: 'Quero métricas e conversões' },
    { id: 'designer', label: 'Designer', icon: '🎨', description: 'Preciso de personalização visual' },
  ]

  const selectedRole = wizard.formData.role as string | undefined

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Qual é o seu papel?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Vamos personalizar sua experiência.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => {
              wizard.updateData({ role: role.id })
              wizard.nextStep()
            }}
            className={`flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all hover:border-primary/50 ${
              selectedRole === role.id ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/50'
            }`}
          >
            <span className="text-2xl">{role.icon}</span>
            <span className="text-sm font-semibold">{role.label}</span>
            <span className="text-xs text-muted-foreground">{role.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepCompany({ wizard }: WizardProps) {
  const sizes = ['Só eu', '2-10', '11-50', '51-200', '200+']

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Sobre sua empresa</h2>
        <p className="mt-1 text-sm text-muted-foreground">Nos ajuda a recomendar os recursos certos.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="company" className="text-sm font-medium">Nome da empresa</label>
          <input
            id="company"
            type="text"
            placeholder="Nome da sua empresa"
            defaultValue={(wizard.formData.companyName as string) ?? ''}
            onChange={(e) => wizard.updateData({ companyName: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tamanho da equipe</label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => wizard.updateData({ teamSize: size })}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  wizard.formData.teamSize === size
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'hover:border-primary/50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={wizard.prevStep}
          className="rounded-lg border px-4 py-2 text-sm"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={wizard.nextStep}
          className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Continuar
        </button>
      </div>

      <button
        type="button"
        onClick={wizard.nextStep}
        className="block w-full text-center text-xs text-muted-foreground hover:text-foreground"
      >
        Pular este passo
      </button>
    </div>
  )
}

function StepGoals({ wizard }: WizardProps) {
  const goals = [
    'Criar landing page',
    'Lançar SaaS',
    'Blog/Conteúdo',
    'E-commerce',
    'Portfolio',
    'App interno',
  ]

  const selected = (wizard.formData.goals as string[]) ?? []

  function toggleGoal(goal: string) {
    const current = (wizard.formData.goals as string[]) ?? []
    const updated = current.includes(goal)
      ? current.filter((g) => g !== goal)
      : [...current, goal]
    wizard.updateData({ goals: updated })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">O que você quer construir?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Selecione um ou mais objetivos.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {goals.map((goal) => (
          <button
            key={goal}
            type="button"
            onClick={() => toggleGoal(goal)}
            className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
              selected.includes(goal)
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-transparent bg-muted/50 hover:border-primary/30'
            }`}
          >
            {goal}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={wizard.prevStep} className="rounded-lg border px-4 py-2 text-sm">
          Voltar
        </button>
        <button
          type="button"
          onClick={wizard.nextStep}
          className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

function StepReady({ wizard }: WizardProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <span className="text-4xl">🎉</span>
      </div>
      <div>
        <h2 className="text-xl font-bold">Tudo pronto!</h2>
        <p className="mt-2 text-muted-foreground">
          Personalizamos sua experiência com base nas suas respostas.
          Vamos começar?
        </p>
      </div>

      <button
        type="button"
        onClick={wizard.complete}
        disabled={wizard.isCompleting}
        className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {wizard.isCompleting ? 'Preparando...' : 'Ir para o dashboard →'}
      </button>

      <button
        type="button"
        onClick={wizard.prevStep}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Voltar e ajustar
      </button>
    </div>
  )
}
```

## Server Action para Salvar

```typescript
// src/actions/onboarding.ts
'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function saveOnboardingData(data: Record<string, unknown>) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Não autenticado')

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      role: data.role as string,
      companyName: data.companyName as string,
      teamSize: data.teamSize as string,
      goals: data.goals as string[],
      onboardingCompleted: true,
    },
  })
}
```
