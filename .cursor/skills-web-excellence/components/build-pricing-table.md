---
id: skill-build-pricing-table
title: "Build Pricing Table"
agent: 03-builder
version: 1.0
category: components
priority: critical
requires:
  - skill: skill-build-cta
  - rule: 02-code-style
provides:
  - tabela de preços com toggle anual/mensal e psicologia de conversão
used_by:
  - agent: 03-builder
  - command: /new-page
---

# Build Pricing Table — Preços que Vendem

## Por que Importa

**60-70%** dos usuários escolhem o plano do meio quando há 3 opções. Tabelas comparativas aumentam conversão em **+15-25%**. Toggle anual/mensal com economia visível em % E valor absoluto aumenta upsell para anual em **+20%**.

## Princípios de Pricing Psychology

1. **Ancoragem**: preços exibidos do mais caro para o mais barato (left-to-right reading priming)
2. **Decoy**: plano básico existe para fazer o intermediário parecer ótimo
3. **Destaque**: plano do meio com badge "MAIS POPULAR" + borda/sombra diferenciada
4. **Especificidade**: "R$ 97/mês" > "~R$ 100/mês" — número específico é mais crível
5. **Economia explícita**: toggle anual mostra TANTO % quanto valor absoluto economizado

## Tipos de Dados

```tsx
// lib/types/pricing.ts
export interface PricingTier {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  cta: {
    text: string;
    href: string;
  };
}

export interface PricingFeatureRow {
  label: string;
  tiers: Record<string, boolean | string>;
}
```

## Dados de Exemplo

```tsx
// lib/data/pricing.ts
import type { PricingTier, PricingFeatureRow } from "@/lib/types/pricing";

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Para quem está começando",
    priceMonthly: 47,
    priceAnnual: 37,
    features: [
      "1.000 contatos",
      "5 automações",
      "Suporte por e-mail",
      "1 usuário",
    ],
    cta: { text: "Começar grátis", href: "/signup?plan=starter" },
  },
  {
    id: "pro",
    name: "Pro",
    description: "Para times em crescimento",
    priceMonthly: 97,
    priceAnnual: 79,
    highlighted: true,
    badge: "MAIS POPULAR",
    features: [
      "10.000 contatos",
      "Automações ilimitadas",
      "Suporte prioritário",
      "5 usuários",
      "Integrações avançadas",
      "Relatórios detalhados",
    ],
    cta: { text: "Escolher Pro", href: "/signup?plan=pro" },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Para grandes operações",
    priceMonthly: 297,
    priceAnnual: 247,
    features: [
      "Contatos ilimitados",
      "Automações ilimitadas",
      "Suporte 24/7 dedicado",
      "Usuários ilimitados",
      "API completa",
      "SSO / SAML",
      "SLA 99.99%",
    ],
    cta: { text: "Falar com vendas", href: "/contact?plan=enterprise" },
  },
];

export const COMPARISON_FEATURES: PricingFeatureRow[] = [
  { label: "Contatos", tiers: { starter: "1.000", pro: "10.000", enterprise: "Ilimitado" } },
  { label: "Automações", tiers: { starter: "5", pro: "Ilimitado", enterprise: "Ilimitado" } },
  { label: "Usuários", tiers: { starter: "1", pro: "5", enterprise: "Ilimitado" } },
  { label: "Integrações", tiers: { starter: false, pro: true, enterprise: true } },
  { label: "API", tiers: { starter: false, pro: false, enterprise: true } },
  { label: "SSO / SAML", tiers: { starter: false, pro: false, enterprise: true } },
  { label: "SLA garantido", tiers: { starter: false, pro: false, enterprise: true } },
  { label: "Suporte prioritário", tiers: { starter: false, pro: true, enterprise: true } },
];
```

## Componente Principal

```tsx
// components/pricing/pricing-section.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CTAButton } from "@/components/ui/cta-button";
import { Check } from "lucide-react";
import type { PricingTier } from "@/lib/types/pricing";

interface PricingSectionProps {
  tiers: PricingTier[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(value);
}

export function PricingSection({ tiers }: PricingSectionProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Toggle */}
        <div className="mb-12 flex items-center justify-center gap-4">
          <span className={isAnnual ? "text-muted-foreground" : "font-semibold text-foreground"}>
            Mensal
          </span>
          <button
            role="switch"
            aria-checked={isAnnual}
            onClick={() => setIsAnnual((v) => !v)}
            className={[
              "relative h-7 w-14 rounded-full transition-colors duration-200",
              isAnnual ? "bg-primary" : "bg-muted",
            ].join(" ")}
          >
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={[
                "absolute top-0.5 block h-6 w-6 rounded-full bg-white shadow-sm",
                isAnnual ? "left-[calc(100%-1.625rem)]" : "left-0.5",
              ].join(" ")}
            />
          </button>
          <span className={isAnnual ? "font-semibold text-foreground" : "text-muted-foreground"}>
            Anual
          </span>
          {isAnnual && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700"
            >
              Economize até 20%
            </motion.span>
          )}
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier, i) => {
            const price = isAnnual ? tier.priceAnnual : tier.priceMonthly;
            const savingsPercent = Math.round(
              ((tier.priceMonthly - tier.priceAnnual) / tier.priceMonthly) * 100,
            );
            const savingsAbsolute = (tier.priceMonthly - tier.priceAnnual) * 12;

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={[
                  "relative flex flex-col rounded-2xl border-2 p-8",
                  tier.highlighted
                    ? "border-primary bg-primary/[0.02] shadow-xl scale-[1.03] z-10"
                    : "border-border bg-background",
                ].join(" ")}
              >
                {tier.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                    {tier.badge}
                  </span>
                )}

                <h3 className="text-xl font-bold">{tier.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>

                <div className="mt-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight">
                      {formatCurrency(price)}
                    </span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  {isAnnual && savingsPercent > 0 && (
                    <p className="mt-1 text-sm text-green-600 font-medium">
                      -{savingsPercent}% ({formatCurrency(savingsAbsolute)}/ano de economia)
                    </p>
                  )}
                </div>

                <ul className="mt-8 flex-1 space-y-3">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <CTAButton
                    variant={tier.highlighted ? "primary" : "secondary"}
                    size="lg"
                    className="w-full"
                    onClick={() => (window.location.href = tier.cta.href)}
                  >
                    {tier.cta.text}
                  </CTAButton>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

## Tabela Comparativa (Mobile-Friendly)

```tsx
// components/pricing/comparison-table.tsx
"use client";

import { Check, X } from "lucide-react";
import type { PricingFeatureRow, PricingTier } from "@/lib/types/pricing";

interface ComparisonTableProps {
  features: PricingFeatureRow[];
  tiers: PricingTier[];
}

export function ComparisonTable({ features, tiers }: ComparisonTableProps) {
  return (
    <div className="mt-16 overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="sticky left-0 bg-muted/50 px-4 py-3 text-left font-medium">
              Recurso
            </th>
            {tiers.map((tier) => (
              <th
                key={tier.id}
                className={[
                  "px-4 py-3 text-center font-semibold",
                  tier.highlighted ? "bg-primary/5 text-primary" : "",
                ].join(" ")}
              >
                {tier.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((row, i) => (
            <tr
              key={row.label}
              className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}
            >
              <td className="sticky left-0 bg-inherit px-4 py-3 font-medium">
                {row.label}
              </td>
              {tiers.map((tier) => {
                const val = row.tiers[tier.id];
                return (
                  <td
                    key={tier.id}
                    className={[
                      "px-4 py-3 text-center",
                      tier.highlighted ? "bg-primary/[0.02]" : "",
                    ].join(" ")}
                  >
                    {typeof val === "boolean" ? (
                      val ? (
                        <Check className="mx-auto h-5 w-5 text-green-500" />
                      ) : (
                        <X className="mx-auto h-5 w-5 text-muted-foreground/40" />
                      )
                    ) : (
                      <span className="font-medium">{val}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Uso Completo

```tsx
import { PricingSection } from "@/components/pricing/pricing-section";
import { ComparisonTable } from "@/components/pricing/comparison-table";
import { PRICING_TIERS, COMPARISON_FEATURES } from "@/lib/data/pricing";

export default function PricingPage() {
  return (
    <>
      <PricingSection tiers={PRICING_TIERS} />
      <div className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="mb-4 text-2xl font-bold text-center">Comparação detalhada</h2>
        <ComparisonTable features={COMPARISON_FEATURES} tiers={PRICING_TIERS} />
      </div>
    </>
  );
}
```

## Checklist

- [ ] 3 tiers com plano do meio destacado ("MAIS POPULAR")
- [ ] Toggle anual/mensal com economia em % E valor absoluto
- [ ] CTAs específicos por tier (não genéricos)
- [ ] Preços exibidos alto → baixo para ancoragem
- [ ] Tabela comparativa com scroll horizontal no mobile
- [ ] Primeira coluna sticky no mobile
- [ ] Coluna do plano destacado com fundo sutil
