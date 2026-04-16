---
id: skill-build-billing-page
title: "Build Billing Page"
agent: 03-builder
version: 1.0
category: saas
priority: important
requires:
  - skill: skill-build-dashboard-layout
  - rule: 00-constitution
provides:
  - pricing-tiers
  - billing-management
  - invoice-history
used_by:
  - agent: 03-builder
  - command: /new-page
---

# Página de Billing — Planos, Pagamento e Faturas

## Princípios de Pricing UX

1. **Anchoring alto→baixo** — mostrar plano mais caro primeiro (ou destacar o do meio)
2. **Economia em % E valor absoluto** — "Economize 20% (R$240/ano)"
3. **Plano atual destacado** — badge "Seu plano" visível
4. **CTA diferenciado** — upgrade = primary, downgrade = secondary
5. **Social proof** — "Mais popular" no plano intermediário

## Toggle Mensal/Anual

```typescript
// src/components/billing/pricing-toggle.tsx
'use client'

import { useState } from 'react'

interface PricingToggleProps {
  onToggle: (annual: boolean) => void
}

export function PricingToggle({ onToggle }: PricingToggleProps) {
  const [annual, setAnnual] = useState(false)

  function toggle() {
    setAnnual(!annual)
    onToggle(!annual)
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <span className={`text-sm ${!annual ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
        Mensal
      </span>
      <button
        role="switch"
        aria-checked={annual}
        onClick={toggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          annual ? 'bg-primary' : 'bg-muted'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            annual ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={`text-sm ${annual ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
        Anual
      </span>
      {annual && (
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
          -20%
        </span>
      )}
    </div>
  )
}
```

## Cards de Plano

```typescript
// src/components/billing/plan-card.tsx
interface PlanCardProps {
  name: string
  description: string
  price: number
  annualPrice: number
  isAnnual: boolean
  features: string[]
  highlighted?: boolean
  isCurrent?: boolean
  cta: string
  onSelect: () => void
}

export function PlanCard({
  name,
  description,
  price,
  annualPrice,
  isAnnual,
  features,
  highlighted,
  isCurrent,
  cta,
  onSelect,
}: PlanCardProps) {
  const displayPrice = isAnnual ? annualPrice : price
  const monthlyEquivalent = isAnnual ? (annualPrice / 12).toFixed(0) : null
  const savings = isAnnual ? ((price * 12 - annualPrice) / (price * 12) * 100).toFixed(0) : null
  const savingsValue = isAnnual ? (price * 12 - annualPrice).toFixed(0) : null

  return (
    <div
      className={`relative flex flex-col rounded-2xl border-2 p-6 ${
        highlighted
          ? 'border-primary bg-primary/[0.02] shadow-lg shadow-primary/10'
          : 'border-border'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Mais popular
          </span>
        </div>
      )}

      {isCurrent && (
        <div className="absolute -top-3 right-4">
          <span className="rounded-full border bg-background px-3 py-1 text-xs font-semibold">
            Seu plano
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">R${displayPrice}</span>
          <span className="text-muted-foreground">/{isAnnual ? 'ano' : 'mês'}</span>
        </div>
        {monthlyEquivalent && (
          <p className="mt-1 text-sm text-muted-foreground">
            R${monthlyEquivalent}/mês · Economia de {savings}% (R${savingsValue})
          </p>
        )}
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        disabled={isCurrent}
        className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
          isCurrent
            ? 'cursor-default border bg-muted text-muted-foreground'
            : highlighted
              ? 'bg-primary text-primary-foreground hover:opacity-90'
              : 'border hover:border-primary hover:text-primary'
        }`}
      >
        {isCurrent ? 'Plano atual' : cta}
      </button>
    </div>
  )
}
```

## Página de Billing Completa

```typescript
// src/app/dashboard/faturamento/page.tsx
'use client'

import { useState } from 'react'
import { PricingToggle } from '@/components/billing/pricing-toggle'
import { PlanCard } from '@/components/billing/plan-card'

const PLANS = [
  {
    name: 'Starter',
    description: 'Para quem está começando',
    price: 0,
    annualPrice: 0,
    features: ['1 projeto', '1.000 visitantes/mês', 'SSL incluso', 'Suporte por email'],
    cta: 'Downgrade para Starter',
  },
  {
    name: 'Pro',
    description: 'Para negócios em crescimento',
    price: 97,
    annualPrice: 932,
    features: [
      '10 projetos',
      '100.000 visitantes/mês',
      'Domínio customizado',
      'Analytics avançado',
      'Suporte prioritário',
      'API completa',
    ],
    highlighted: true,
    cta: 'Fazer upgrade para Pro',
  },
  {
    name: 'Enterprise',
    description: 'Para grandes operações',
    price: 297,
    annualPrice: 2852,
    features: [
      'Projetos ilimitados',
      'Visitantes ilimitados',
      'SSO / SAML',
      'SLA 99.9%',
      'Gerente de conta dedicado',
      'Contrato customizado',
      'On-premise disponível',
    ],
    cta: 'Falar com vendas',
  },
]

export default function BillingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const currentPlan = 'Starter'

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Faturamento</h1>
        <p className="mt-1 text-muted-foreground">Gerencie seu plano e método de pagamento.</p>
      </div>

      {/* Planos */}
      <section className="space-y-6">
        <PricingToggle onToggle={setIsAnnual} />

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.name}
              {...plan}
              isAnnual={isAnnual}
              isCurrent={plan.name === currentPlan}
              onSelect={() => console.log('Selecionar:', plan.name)}
            />
          ))}
        </div>
      </section>

      {/* Método de Pagamento */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Método de pagamento</h2>
        <div className="flex items-center justify-between rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-16 items-center justify-center rounded-md bg-muted text-xs font-bold">
              VISA
            </div>
            <div>
              <p className="text-sm font-medium">•••• •••• •••• 4242</p>
              <p className="text-xs text-muted-foreground">Expira 12/2027</p>
            </div>
          </div>
          <button className="text-sm text-primary hover:underline">Alterar</button>
        </div>
      </section>

      {/* Histórico de Faturas */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Histórico de faturas</h2>
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Data</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Descrição</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Valor</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '01/04/2026', desc: 'Plano Pro — Mensal', amount: 'R$97,00', status: 'Pago' },
                { date: '01/03/2026', desc: 'Plano Pro — Mensal', amount: 'R$97,00', status: 'Pago' },
                { date: '01/02/2026', desc: 'Plano Pro — Mensal', amount: 'R$97,00', status: 'Pago' },
              ].map((invoice, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="px-4 py-3">{invoice.date}</td>
                  <td className="px-4 py-3">{invoice.desc}</td>
                  <td className="px-4 py-3 text-right">{invoice.amount}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs text-primary hover:underline">PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
```
