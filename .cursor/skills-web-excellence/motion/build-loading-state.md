---
id: skill-build-loading-state
title: "Build Loading State"
agent: 03-builder
version: 1.0
category: motion
priority: important
requires:
  - skill: skill-build-design-tokens
  - rule: 02-code-style
provides:
  - skeleton screens, spinners, progress bars e shimmer effects
used_by:
  - agent: 03-builder
  - command: /new-page
---

# Build Loading State — Estados de Carregamento

## Por que Importa

Skeleton screens reduzem **percepção de espera em até 30%** comparado a spinners genéricos. O cérebro "preenche" o layout previsto, criando sensação de velocidade. Cada tipo de loading tem seu uso: skeleton para conteúdo, spinner para ações inline, progress bar para uploads/processos com progresso conhecido.

## Quando Usar Cada Um

| Tipo           | Quando                                           |
|----------------|--------------------------------------------------|
| Skeleton       | Carregamento de conteúdo (cards, listas, textos) |
| Spinner inline | Ação do usuário (submit, salvar, deletar)        |
| Progress bar   | Upload, download, processo com % conhecida       |
| Shimmer        | Cards de produto, imagens (premium feel)         |

## Base: Skeleton Primitivo

```tsx
// components/ui/skeleton.tsx
import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  variant = "text",
  width,
  height,
  className = "",
  style,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    text: "rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={[
        "animate-pulse bg-muted",
        variantStyles[variant],
        className,
      ].join(" ")}
      style={{
        width: width ?? (variant === "text" ? "100%" : undefined),
        height:
          height ??
          (variant === "text" ? "1em" : variant === "circular" ? width : undefined),
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}
```

## Skeleton: Card

```tsx
// components/skeletons/card-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-background p-6 space-y-4">
      <Skeleton variant="rectangular" height={160} className="w-full" />
      <Skeleton variant="text" width="75%" height={20} />
      <Skeleton variant="text" width="100%" height={14} />
      <Skeleton variant="text" width="60%" height={14} />
      <div className="flex items-center gap-3 pt-2">
        <Skeleton variant="circular" width={32} height={32} />
        <div className="flex-1 space-y-1.5">
          <Skeleton variant="text" width="40%" height={12} />
          <Skeleton variant="text" width="25%" height={10} />
        </div>
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
```

## Skeleton: Tabela

```tsx
// components/skeletons/table-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 border-b border-border bg-muted/50 px-4 py-3">
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton key={`h-${i}`} variant="text" height={14} className="flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }, (_, ri) => (
        <div
          key={`r-${ri}`}
          className={[
            "flex gap-4 px-4 py-3",
            ri % 2 === 0 ? "bg-background" : "bg-muted/10",
          ].join(" ")}
        >
          {Array.from({ length: columns }, (_, ci) => (
            <Skeleton
              key={`r-${ri}-c-${ci}`}
              variant="text"
              height={12}
              width={ci === 0 ? "60%" : "80%"}
              className="flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
```

## Skeleton: Bloco de Texto

```tsx
// components/skeletons/text-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

interface TextSkeletonProps {
  lines?: number;
  hasTitle?: boolean;
}

export function TextSkeleton({ lines = 4, hasTitle = true }: TextSkeletonProps) {
  return (
    <div className="space-y-3">
      {hasTitle && <Skeleton variant="text" width="50%" height={24} />}
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? "70%" : "100%"}
          height={14}
        />
      ))}
    </div>
  );
}
```

## Skeleton: Avatar + Info

```tsx
// components/skeletons/avatar-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

interface AvatarSkeletonProps {
  size?: number;
  withText?: boolean;
}

export function AvatarSkeleton({ size = 40, withText = true }: AvatarSkeletonProps) {
  return (
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" width={size} height={size} />
      {withText && (
        <div className="space-y-1.5">
          <Skeleton variant="text" width={120} height={14} />
          <Skeleton variant="text" width={80} height={10} />
        </div>
      )}
    </div>
  );
}
```

## Skeleton: Imagem

```tsx
// components/skeletons/image-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

interface ImageSkeletonProps {
  aspectRatio?: "square" | "video" | "wide";
  className?: string;
}

const ratioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[21/9]",
};

export function ImageSkeleton({ aspectRatio = "video", className }: ImageSkeletonProps) {
  return (
    <Skeleton
      variant="rectangular"
      className={[ratioClasses[aspectRatio], "w-full", className].filter(Boolean).join(" ")}
    />
  );
}
```

## Shimmer Effect (Premium)

```tsx
// components/ui/shimmer.tsx
import type { HTMLAttributes } from "react";

export function Shimmer({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-lg bg-muted",
        className,
      ].join(" ")}
      aria-hidden="true"
      {...props}
    >
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
      />
      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
```

```tsx
// Shimmer card
<Shimmer className="h-[200px] w-full rounded-xl" />
```

## Spinner Inline

```tsx
// components/ui/spinner.tsx
interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const spinnerSizes = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-3",
};

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className={[
        "animate-spin rounded-full border-muted border-t-primary",
        spinnerSizes[size],
        className,
      ].join(" ")}
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
```

## Progress Bar

```tsx
// components/ui/progress-bar.tsx
"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercent?: boolean;
  size?: "sm" | "md";
}

export function ProgressBar({
  progress,
  label,
  showPercent = true,
  size = "md",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          {label && <span className="font-medium text-foreground">{label}</span>}
          {showPercent && (
            <span className="text-muted-foreground">{Math.round(clamped)}%</span>
          )}
        </div>
      )}
      <div
        className={[
          "w-full overflow-hidden rounded-full bg-muted",
          size === "sm" ? "h-1.5" : "h-2.5",
        ].join(" ")}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
```

## Uso em Pages

```tsx
// app/(marketing)/blog/loading.tsx
import { CardGridSkeleton } from "@/components/skeletons/card-skeleton";
import { TextSkeleton } from "@/components/skeletons/text-skeleton";

export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 space-y-12">
      <TextSkeleton lines={2} hasTitle />
      <CardGridSkeleton count={6} />
    </div>
  );
}
```

```tsx
// Inline spinner durante ação
<button disabled={isPending}>
  {isPending ? <Spinner size="sm" /> : "Salvar"}
</button>

// Progress bar para upload
<ProgressBar progress={uploadPercent} label="Enviando arquivo..." />
```

## Tailwind Config (shimmer + pulse)

```css
/* app/globals.css — Tailwind v4 */
@theme {
  --animate-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

A classe `animate-pulse` já vem built-in no Tailwind. O shimmer precisa do keyframe customizado definido inline no componente.

## Checklist

- [ ] Skeleton para cada tipo de conteúdo: card, tabela, texto, avatar, imagem
- [ ] `aria-hidden="true"` em skeletons (são decorativos)
- [ ] Spinner com `role="status"` + `sr-only` label
- [ ] Progress bar com `role="progressbar"` + `aria-valuenow`
- [ ] Shimmer para cards de produto/premium feel
- [ ] `loading.tsx` no App Router para cada rota com dados assíncronos
- [ ] Pulse animation via Tailwind (`animate-pulse`)
