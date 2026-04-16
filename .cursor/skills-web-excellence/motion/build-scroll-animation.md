---
id: skill-build-scroll-animation
title: "Build Scroll Animation"
agent: 03-builder
version: 1.0
category: motion
priority: important
requires:
  - skill: skill-build-design-tokens
  - rule: 02-code-style
provides:
  - animações scroll-triggered reutilizáveis (fade-up, stagger, parallax)
used_by:
  - agent: 03-builder
  - command: /new-page
---

# Build Scroll Animation — Animações ao Rolar

## Por que Importa

Animações de entrada ao scroll dão ritmo à página e guiam a atenção. Feitas errado, travam o scroll e irritam. Feitas certo: **GPU-only** (`transform` + `opacity`), **once: true** (não re-anima ao subir), **threshold 0.2** (dispara antes de ficar 100% visível).

## Regras de Ouro

| Regra                        | Valor                                  |
|------------------------------|----------------------------------------|
| Propriedades animadas        | Apenas `transform` e `opacity`         |
| `once`                       | `true` — anima só na primeira vez      |
| `margin` do viewport         | `"-100px"` — dispara um pouco antes    |
| `amount` / threshold         | `0.2` — 20% visível é suficiente       |
| Duração                      | `300-500ms` para elementos, `200ms` para micro |
| Stagger delay                | `50ms` entre siblings                  |
| Easing                       | `easeOut` ou spring `{ stiffness: 300, damping: 24 }` |

## Wrapper Reutilizável: AnimateOnScroll

```tsx
// components/motion/animate-on-scroll.tsx
"use client";

import { motion, type Variant, type Transition } from "framer-motion";
import type { ReactNode } from "react";

type AnimationType = "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale-up" | "none";

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  margin?: string;
  amount?: number;
}

const animations: Record<AnimationType, { hidden: Variant; visible: Variant }> = {
  "fade-up": {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "fade-left": {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0 },
  },
  "fade-right": {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 },
  },
  "scale-up": {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  none: {
    hidden: {},
    visible: {},
  },
};

export function AnimateOnScroll({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 0.4,
  className,
  once = true,
  margin = "-100px",
  amount = 0.2,
}: AnimateOnScrollProps) {
  const { hidden, visible } = animations[animation];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin, amount }}
      variants={{
        hidden,
        visible: {
          ...visible,
          transition: { duration, delay, ease: "easeOut" } satisfies Transition,
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

## Stagger Container

```tsx
// components/motion/stagger-container.tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

const containerVariants = (staggerDelay: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.05,
  once = true,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={containerVariants(staggerDelay)}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

## Parallax com useScroll

```tsx
// components/motion/parallax.tsx
"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({ children, speed = 0.3, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`${speed * -100}px`, `${speed * 100}px`]);

  return (
    <div ref={ref} className={["overflow-hidden", className].filter(Boolean).join(" ")}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}
```

## Scroll Progress Bar

```tsx
// components/motion/scroll-progress.tsx
"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary"
    />
  );
}
```

## Exemplos de Uso

```tsx
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { StaggerContainer, staggerItemVariants } from "@/components/motion/stagger-container";
import { Parallax } from "@/components/motion/parallax";
import { motion } from "framer-motion";

// Fade-up simples
<AnimateOnScroll>
  <h2 className="text-3xl font-bold">Título da seção</h2>
</AnimateOnScroll>

// Fade-up com delay
<AnimateOnScroll animation="fade-up" delay={0.2}>
  <p>Parágrafo com delay</p>
</AnimateOnScroll>

// Stagger em grid de cards
<StaggerContainer className="grid grid-cols-3 gap-6" staggerDelay={0.05}>
  {features.map((f) => (
    <motion.div key={f.id} variants={staggerItemVariants}>
      <FeatureCard feature={f} />
    </motion.div>
  ))}
</StaggerContainer>

// Parallax em imagem de fundo
<Parallax speed={0.2} className="h-[400px]">
  <Image src="/hero-bg.jpg" alt="" fill className="object-cover" />
</Parallax>

// Seção com parallax + fade
<Parallax speed={0.15}>
  <AnimateOnScroll animation="scale-up">
    <TestimonialCard />
  </AnimateOnScroll>
</Parallax>
```

## Performance

- **Nunca** anime `width`, `height`, `top`, `left`, `margin`, `padding`
- Apenas `transform` (translate, scale, rotate) e `opacity` rodam na GPU
- `will-change: transform` é adicionado automaticamente pelo Framer Motion
- `once: true` evita re-cálculos no scroll reverso
- Prefira `viewport.margin` negativo para animação iniciar antes de ser visível (sensação de fluidez)

## Checklist

- [ ] Apenas `transform` e `opacity` animados (GPU compositing)
- [ ] `once: true` em todas as animações de scroll
- [ ] `margin: "-100px"` para antecipar a animação
- [ ] Stagger delay de `50ms` entre siblings
- [ ] Parallax com `useScroll` + `useTransform` (não IntersectionObserver manual)
- [ ] ScrollProgress bar para artigos longos
