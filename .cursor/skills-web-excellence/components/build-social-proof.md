---
id: skill-build-social-proof
title: "Build Social Proof"
agent: 03-builder
version: 1.0
category: components
priority: critical
requires:
  - skill: skill-build-cta
  - rule: 02-code-style
provides:
  - componentes de prova social (logo bar, badges, counters)
used_by:
  - agent: 03-builder
  - command: /new-page
---

# Build Social Proof — Prova Social que Converte

## Por que Importa

Prova social próxima ao CTA aumenta conversão em **+15-30%**. Reviews podem aumentar conversão em até **+270%** (Spiegel Research Center). Logos de clientes conhecidos criam confiança instantânea. Counter animado de clientes cria senso de comunidade.

## Componentes Obrigatórios

1. **Logo bar** com marquee auto-scroll — "Usado por X+ empresas"
2. **Rating badges** próximos ao CTA — estrelas + nota + fonte
3. **Counter animado** — número de clientes/usuários com animação de incremento
4. **Trust badges** — certificações, segurança, garantia

## Logo Marquee

```tsx
// components/social-proof/logo-marquee.tsx
"use client";

import Image from "next/image";

interface LogoItem {
  name: string;
  src: string;
  width: number;
  height: number;
}

interface LogoMarqueeProps {
  logos: LogoItem[];
  title?: string;
  speed?: number;
}

export function LogoMarquee({
  logos,
  title = "Empresas que confiam em nós",
  speed = 30,
}: LogoMarqueeProps) {
  const duplicated = [...logos, ...logos];

  return (
    <section className="py-12 overflow-hidden">
      <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <div
        className="flex w-max gap-12 items-center"
        style={{
          animation: `marquee ${speed}s linear infinite`,
        }}
      >
        {duplicated.map((logo, i) => (
          <Image
            key={`${logo.name}-${i}`}
            src={logo.src}
            alt={logo.name}
            width={logo.width}
            height={logo.height}
            className="h-8 w-auto object-contain opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
          />
        ))}
      </div>
      <style jsx global>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
```

## Counter Animado

```tsx
// components/social-proof/animated-counter.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  label: string;
}

export function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2000,
  label,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-extrabold tracking-tight text-foreground">
        {prefix}
        {count.toLocaleString("pt-BR")}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
```

## Stats Bar

```tsx
// components/social-proof/stats-bar.tsx
import { AnimatedCounter } from "@/components/social-proof/animated-counter";

interface Stat {
  target: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

interface StatsBarProps {
  stats: Stat[];
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <section className="border-y border-border bg-muted/30 py-12">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 md:grid-cols-4">
        {stats.map((stat) => (
          <AnimatedCounter key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
```

## Rating Badge

```tsx
// components/social-proof/rating-badge.tsx
import { Star } from "lucide-react";

interface RatingBadgeProps {
  rating: number;
  maxRating?: number;
  source: string;
  reviewCount: number;
  logoSrc?: string;
}

export function RatingBadge({
  rating,
  maxRating = 5,
  source,
  reviewCount,
  logoSrc,
}: RatingBadgeProps) {
  return (
    <div className="inline-flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 shadow-sm">
      {logoSrc && (
        <img src={logoSrc} alt={source} className="h-5 w-auto" />
      )}
      <div className="flex items-center gap-1">
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            className={[
              "h-4 w-4",
              i < Math.floor(rating)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30",
            ].join(" ")}
          />
        ))}
      </div>
      <div className="text-sm">
        <span className="font-bold">{rating}</span>
        <span className="text-muted-foreground">
          /{maxRating} ({reviewCount.toLocaleString("pt-BR")}+ avaliações)
        </span>
      </div>
    </div>
  );
}
```

## Trust Badges Strip

```tsx
// components/social-proof/trust-badges.tsx
import { Shield, Lock, RefreshCw, Award } from "lucide-react";
import type { ReactNode } from "react";

interface Badge {
  icon: ReactNode;
  label: string;
}

const DEFAULT_BADGES: Badge[] = [
  { icon: <Shield className="h-5 w-5" />, label: "SSL Seguro" },
  { icon: <Lock className="h-5 w-5" />, label: "LGPD Compliant" },
  { icon: <RefreshCw className="h-5 w-5" />, label: "30 dias de garantia" },
  { icon: <Award className="h-5 w-5" />, label: "SOC 2 Certificado" },
];

export function TrustBadges({ badges = DEFAULT_BADGES }: { badges?: Badge[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-6">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <span className="text-green-600">{badge.icon}</span>
          {badge.label}
        </div>
      ))}
    </div>
  );
}
```

## Uso Combinado

```tsx
import { LogoMarquee } from "@/components/social-proof/logo-marquee";
import { StatsBar } from "@/components/social-proof/stats-bar";
import { RatingBadge } from "@/components/social-proof/rating-badge";
import { TrustBadges } from "@/components/social-proof/trust-badges";

// Logo bar no topo
<LogoMarquee
  logos={[
    { name: "Nubank", src: "/logos/nubank.svg", width: 120, height: 32 },
    { name: "iFood", src: "/logos/ifood.svg", width: 100, height: 32 },
    { name: "VTEX", src: "/logos/vtex.svg", width: 80, height: 32 },
    // ...
  ]}
/>

// Stats bar
<StatsBar
  stats={[
    { target: 5000, suffix: "+", label: "Empresas ativas" },
    { target: 99, suffix: "%", label: "Satisfação" },
    { target: 2, prefix: "", suffix: "M+", label: "Mensagens enviadas" },
    { target: 24, suffix: "/7", label: "Suporte disponível" },
  ]}
/>

// Rating próximo ao CTA
<div className="flex flex-col items-center gap-4">
  <CTAButton size="lg">Começar agora</CTAButton>
  <RatingBadge rating={4.8} source="G2" reviewCount={342} />
  <TrustBadges />
</div>
```

## Checklist

- [ ] Logo bar com marquee CSS (não JS) para performance
- [ ] Logos em grayscale, cor no hover
- [ ] Counter animado com `requestAnimationFrame` + easing
- [ ] Rating badge próximo ao CTA principal
- [ ] Trust badges abaixo do CTA (SSL, garantia, certificações)
- [ ] Números específicos ("5.247 empresas" > "milhares de empresas")
