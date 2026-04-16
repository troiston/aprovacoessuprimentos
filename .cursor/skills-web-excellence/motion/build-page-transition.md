---
id: skill-build-page-transition
title: "Build Page Transition"
agent: 03-builder
version: 1.0
category: motion
priority: standard
requires:
  - skill: skill-build-scroll-animation
  - rule: 02-code-style
provides:
  - transições de página com AnimatePresence no Next.js App Router
used_by:
  - agent: 03-builder
  - command: /new-page
---

# Build Page Transition — Transições entre Páginas

## Por que Importa

Transições suaves entre páginas eliminam o "flash branco" e criam percepção de app nativo. Com Next.js App Router, usamos `AnimatePresence` no `template.tsx` (re-renderiza a cada navegação, diferente do `layout.tsx`).

## Regras

- **mode="wait"**: saída completa antes da entrada (evita sobreposição)
- **Duração**: `200-300ms` — rápido o suficiente para não atrasar
- **Propriedades**: apenas `opacity` + `translateX/Y` (GPU)
- **Exit antes de enter**: AnimatePresence garante isso com `mode="wait"`
- **Skeleton**: se dados demoram, skeleton aparece durante a transição

## PageTransition Wrapper

```tsx
// components/motion/page-transition.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const variants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

## Integração com App Router (template.tsx)

```tsx
// app/template.tsx
import { PageTransition } from "@/components/motion/page-transition";
import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
```

## Variante: Fade Puro (sem slide)

```tsx
// components/motion/fade-transition.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function FadeTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }}
        exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeIn" } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

## Variante: Slide Up (para modais / overlays)

```tsx
// components/motion/slide-up-transition.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface SlideUpTransitionProps {
  children: ReactNode;
  show: boolean;
  onExitComplete?: () => void;
}

export function SlideUpTransition({
  children,
  show,
  onExitComplete,
}: SlideUpTransitionProps) {
  return (
    <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 24 },
          }}
          exit={{
            opacity: 0,
            y: 40,
            transition: { duration: 0.2, ease: "easeIn" },
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

## Skeleton durante Transição

```tsx
// components/motion/page-skeleton.tsx
import { Suspense, type ReactNode } from "react";

interface PageSkeletonProps {
  children: ReactNode;
  fallback: ReactNode;
}

export function PageWithSkeleton({ children, fallback }: PageSkeletonProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
```

```tsx
// app/(marketing)/pricing/page.tsx
import { PageWithSkeleton } from "@/components/motion/page-skeleton";
import { PricingSkeleton } from "@/components/skeletons/pricing-skeleton";
import { PricingContent } from "@/components/pricing/pricing-content";

export default function PricingPage() {
  return (
    <PageWithSkeleton fallback={<PricingSkeleton />}>
      <PricingContent />
    </PageWithSkeleton>
  );
}
```

## Combinando Page Transition + Scroll Animations

```tsx
// app/template.tsx
import { PageTransition } from "@/components/motion/page-transition";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <PageTransition>{children}</PageTransition>
    </>
  );
}
```

## Por que template.tsx e não layout.tsx

| Arquivo        | Re-renderiza na navegação? | Uso                              |
|----------------|---------------------------|----------------------------------|
| `layout.tsx`   | Não — persiste             | Header, footer, providers        |
| `template.tsx` | Sim — re-monta             | Transições de página, analytics  |

`template.tsx` é re-criado a cada navegação, gerando o `key` que `AnimatePresence` precisa para disparar animações de saída/entrada.

## Checklist

- [ ] `AnimatePresence mode="wait"` para exit antes de enter
- [ ] Usar `template.tsx`, não `layout.tsx`
- [ ] Duração total (exit + enter) < `500ms`
- [ ] Apenas `opacity` + `transform` animados
- [ ] Skeleton com `Suspense` para dados assíncronos
- [ ] `key={pathname}` para forçar re-mount
