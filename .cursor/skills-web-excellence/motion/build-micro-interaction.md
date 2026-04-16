---
id: skill-build-micro-interaction
title: "Build Micro Interaction"
agent: 03-builder
version: 1.0
category: motion
priority: important
requires:
  - skill: skill-build-design-tokens
  - rule: 02-code-style
provides:
  - micro-interações reutilizáveis (hover, click, focus, toggle, tooltip)
used_by:
  - agent: 03-builder
  - command: /new-page
---

# Build Micro-Interaction — Feedback Visual Instantâneo

## Por que Importa

Micro-interações dão **feedback tátil** — o usuário sente que a interface responde. Timing é tudo: **120-220ms** é o sweet spot perceptual. Abaixo de 100ms parece instantâneo (sem animação percebida), acima de 300ms parece lento.

## Timing Reference

| Interação       | Duração  | Easing                          |
|-----------------|----------|---------------------------------|
| Hover (enter)   | `150ms`  | `ease-out`                      |
| Hover (leave)   | `200ms`  | `ease-in`                       |
| Click/Tap       | `100ms`  | `ease-out`                      |
| Focus ring      | `150ms`  | `ease-out`                      |
| Toggle slide    | `200ms`  | spring `stiffness:500 damping:30` |
| Tooltip show    | `150ms`  | `ease-out`                      |
| Tooltip hide    | `100ms`  | `ease-in`                       |

## Variants Reutilizáveis (objeto centralizado)

```tsx
// lib/motion/variants.ts
import type { Variants, Transition } from "framer-motion";

export const springTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 17,
};

export const hoverScale: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

export const hoverLift: Variants = {
  rest: {
    y: 0,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  hover: {
    y: -4,
    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
  },
};

export const hoverGlow: Variants = {
  rest: { scale: 1, filter: "brightness(1)" },
  hover: { scale: 1.02, filter: "brightness(1.05)" },
  tap: { scale: 0.98, filter: "brightness(0.98)" },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export const tooltipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.15, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 4,
    transition: { duration: 0.1, ease: "easeIn" },
  },
};
```

## Interactive Card (hover lift + tap)

```tsx
// components/motion/interactive-card.tsx
"use client";

import { motion } from "framer-motion";
import { hoverLift, springTransition } from "@/lib/motion/variants";
import type { ReactNode } from "react";

interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function InteractiveCard({ children, className, onClick }: InteractiveCardProps) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      variants={hoverLift}
      transition={springTransition}
      onClick={onClick}
      className={[
        "rounded-xl border border-border bg-background p-6 cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </motion.div>
  );
}
```

## Animated Focus Ring

```tsx
// components/motion/focus-ring.tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FocusRingProps {
  children: ReactNode;
  className?: string;
}

export function FocusRing({ children, className }: FocusRingProps) {
  return (
    <motion.div
      className={["relative inline-flex", className].filter(Boolean).join(" ")}
      whileFocus={{
        boxShadow: "0 0 0 3px oklch(0.65 0.2 250 / 0.4)",
      }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  );
}
```

## Animated Toggle

```tsx
// components/motion/animated-toggle.tsx
"use client";

import { motion } from "framer-motion";

interface AnimatedToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  size?: "sm" | "md";
}

const sizes = {
  sm: { track: "h-5 w-9", thumb: "h-4 w-4", translate: "17px" },
  md: { track: "h-7 w-14", thumb: "h-6 w-6", translate: "29px" },
};

export function AnimatedToggle({
  checked,
  onChange,
  label,
  size = "md",
}: AnimatedToggleProps) {
  const s = sizes[size];

  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex shrink-0 rounded-full transition-colors duration-200",
        s.track,
        checked ? "bg-primary" : "bg-muted",
      ].join(" ")}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={[
          "block rounded-full bg-white shadow-sm",
          s.thumb,
          "absolute top-0.5",
        ].join(" ")}
        style={{ left: checked ? s.translate : "2px" }}
      />
    </button>
  );
}
```

## Tooltip Animado

```tsx
// components/motion/animated-tooltip.tsx
"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tooltipVariants } from "@/lib/motion/variants";

interface AnimatedTooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom";
}

const positionStyles = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
};

export function AnimatedTooltip({
  children,
  content,
  position = "top",
}: AnimatedTooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            role="tooltip"
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={[
              "pointer-events-none absolute z-50 whitespace-nowrap",
              "rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-lg",
              positionStyles[position],
            ].join(" ")}
          >
            {content}
            <span
              className={[
                "absolute left-1/2 -translate-x-1/2 border-4 border-transparent",
                position === "top"
                  ? "top-full border-t-foreground"
                  : "bottom-full border-b-foreground",
              ].join(" ")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

## Uso Combinado

```tsx
import { InteractiveCard } from "@/components/motion/interactive-card";
import { AnimatedToggle } from "@/components/motion/animated-toggle";
import { AnimatedTooltip } from "@/components/motion/animated-tooltip";
import { motion } from "framer-motion";
import { hoverScale, springTransition } from "@/lib/motion/variants";

// Card com hover lift
<InteractiveCard onClick={() => router.push("/details")}>
  <h3>Título do card</h3>
  <p>Descrição breve...</p>
</InteractiveCard>

// Botão com hover + tap scale
<motion.button
  variants={hoverScale}
  initial="rest"
  whileHover="hover"
  whileTap="tap"
  transition={springTransition}
>
  Clique aqui
</motion.button>

// Toggle animado
<AnimatedToggle
  checked={isDark}
  onChange={setIsDark}
  label="Modo escuro"
/>

// Tooltip em ícone
<AnimatedTooltip content="Copiar para clipboard">
  <button aria-label="Copiar">
    <Copy className="h-4 w-4" />
  </button>
</AnimatedTooltip>
```

## Checklist

- [ ] Hover: `150ms ease-out`, scale `1.02` ou lift `-4px`
- [ ] Click/Tap: `100ms`, scale `0.98`
- [ ] Focus: ring visível com `150ms` transition
- [ ] Toggle: spring physics, não linear
- [ ] Tooltip: `AnimatePresence` para exit animation
- [ ] Variants centralizados em `lib/motion/variants.ts`
- [ ] Timing entre `120-220ms` para feedback perceptível
