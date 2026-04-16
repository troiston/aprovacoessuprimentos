---
id: skill-build-feature-grid
title: "Build Feature Grid"
agent: 03-builder
version: 1.0
category: components
priority: important
requires:
  - skill: skill-build-cta
  - rule: 02-code-style
provides:
  - grid de features com hover, bento layout e animações staggered
used_by:
  - agent: 03-builder
  - command: /new-page
---

# Build Feature Grid — Showcase de Funcionalidades

## Por que Importa

Feature grid é a seção onde o visitante decide se o produto resolve o problema dele. Cada card precisa de: ícone reconhecível + título curto + descrição de benefício (não feature). Bento grid para features premium cria hierarquia visual e destaca diferenciais.

## Padrões

| Layout           | Quando usar                      | Colunas         |
|------------------|----------------------------------|-----------------|
| Grid uniforme    | 6-9 features de mesmo peso      | 3 → 2 → 1      |
| Bento grid       | 2-3 features premium + menores  | Variável        |

## Micro-Interações

- **Hover**: `translateY(-4px)` + sombra elevada em `200ms ease-out`
- **Entrada**: staggered fade-up com `50ms` de delay entre cards
- **Ícone**: sutil `scale(1.1)` no hover do card

## Tipos

```tsx
// lib/types/feature.ts
import type { ReactNode } from "react";

export interface Feature {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
}
```

## Feature Card

```tsx
// components/features/feature-card.tsx
"use client";

import { motion } from "framer-motion";
import type { Feature } from "@/lib/types/feature";

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

export function FeatureCard({ feature, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className={[
        "group relative rounded-2xl border border-border bg-background p-6",
        "transition-shadow duration-200 ease-out",
        "hover:shadow-lg hover:shadow-primary/5",
        feature.highlight ? "md:col-span-2 md:row-span-2 p-8" : "",
      ].join(" ")}
    >
      <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-transform duration-200 group-hover:scale-110">
        {feature.icon}
      </div>

      <h3 className={[
        "font-bold text-foreground",
        feature.highlight ? "text-xl mb-2" : "text-lg mb-1",
      ].join(" ")}>
        {feature.title}
      </h3>

      <p className={[
        "leading-relaxed text-muted-foreground",
        feature.highlight ? "text-base" : "text-sm",
      ].join(" ")}>
        {feature.description}
      </p>
    </motion.div>
  );
}
```

## Feature Grid (Uniforme)

```tsx
// components/features/feature-grid.tsx
import { FeatureCard } from "@/components/features/feature-card";
import type { Feature } from "@/lib/types/feature";

interface FeatureGridProps {
  title: string;
  subtitle?: string;
  features: Feature[];
}

export function FeatureGrid({ title, subtitle, features }: FeatureGridProps) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">{title}</h2>
          {subtitle && (
            <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FeatureCard key={f.id} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Bento Grid (Premium)

```tsx
// components/features/bento-grid.tsx
import { FeatureCard } from "@/components/features/feature-card";
import type { Feature } from "@/lib/types/feature";

interface BentoGridProps {
  title: string;
  subtitle?: string;
  features: Feature[];
}

export function BentoGrid({ title, subtitle, features }: BentoGridProps) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">{title}</h2>
          {subtitle && (
            <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:grid-rows-2">
          {features.map((f, i) => (
            <FeatureCard key={f.id} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Exemplo de Uso

```tsx
import { FeatureGrid } from "@/components/features/feature-grid";
import { BentoGrid } from "@/components/features/bento-grid";
import { Zap, Shield, BarChart3, Globe, Layers, Cpu, Sparkles, Lock } from "lucide-react";

// Grid uniforme — 6 features
<FeatureGrid
  title="Tudo que você precisa"
  subtitle="Ferramentas poderosas para escalar seu negócio"
  features={[
    {
      id: "speed",
      icon: <Zap className="h-6 w-6" />,
      title: "Velocidade extrema",
      description: "Respostas em menos de 100ms com nossa infraestrutura global de edge.",
    },
    {
      id: "security",
      icon: <Shield className="h-6 w-6" />,
      title: "Segurança bancária",
      description: "Criptografia AES-256 e certificação SOC 2 Type II incluídos.",
    },
    {
      id: "analytics",
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics em tempo real",
      description: "Dashboards ao vivo para acompanhar métricas que importam.",
    },
    {
      id: "global",
      icon: <Globe className="h-6 w-6" />,
      title: "Multi-idioma",
      description: "Suporte nativo a 40+ idiomas com detecção automática.",
    },
    {
      id: "integrations",
      icon: <Layers className="h-6 w-6" />,
      title: "100+ integrações",
      description: "Conecte com as ferramentas que seu time já usa.",
    },
    {
      id: "ai",
      icon: <Cpu className="h-6 w-6" />,
      title: "IA integrada",
      description: "Automação inteligente que aprende com seu negócio.",
    },
  ]}
/>

// Bento grid — 2 features grandes + 4 normais
<BentoGrid
  title="Por que nos escolher"
  features={[
    {
      id: "ai-hero",
      icon: <Sparkles className="h-7 w-7" />,
      title: "IA que realmente funciona",
      description: "Modelos treinados com dados reais do mercado brasileiro...",
      highlight: true,
    },
    {
      id: "speed-2",
      icon: <Zap className="h-6 w-6" />,
      title: "Ultra rápido",
      description: "Edge computing em São Paulo, Fortaleza e Curitiba.",
    },
    {
      id: "secure",
      icon: <Lock className="h-6 w-6" />,
      title: "LGPD nativo",
      description: "Conformidade total sem configuração extra.",
    },
    {
      id: "security-hero",
      icon: <Shield className="h-7 w-7" />,
      title: "Segurança enterprise",
      description: "SSO, RBAC, audit logs e criptografia ponta a ponta...",
      highlight: true,
    },
    {
      id: "global-2",
      icon: <Globe className="h-6 w-6" />,
      title: "Escala global",
      description: "CDN em 200+ locais com failover automático.",
    },
    {
      id: "analytics-2",
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Relatórios ricos",
      description: "Exportação PDF, CSV e integração com BI tools.",
    },
  ]}
/>
```

## Checklist

- [ ] Ícone + título curto + descrição de benefício (não feature)
- [ ] Hover: `translateY(-4px)` + sombra elevada
- [ ] Staggered entrance: `50ms` delay entre cards
- [ ] Responsivo: 3 → 2 → 1 colunas
- [ ] Bento: features premium com `col-span-2 row-span-2`
- [ ] Ícone com fundo colorido sutil e scale no hover
