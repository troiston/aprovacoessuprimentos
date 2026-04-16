---
id: skill-build-cta
title: "Build CTA"
agent: 03-builder
version: 1.0
category: components
priority: critical
requires:
  - skill: skill-build-design-tokens
  - rule: 02-code-style
provides:
  - componente CTA reutilizável com variantes e micro-interações
used_by:
  - agent: 03-builder
  - command: /new-page
---

# Build CTA — Botões de Ação que Convertem

## Por que Importa

Texto de ação específico gera **+30% de cliques** vs genérico. "Começar meu teste grátis" > "Enviar". Hierarquia visual clara guia o olhar: **um** CTA primário por viewport, secundários como suporte.

## Hierarquia de Variantes

| Variante    | Uso                        | Visual                          |
|-------------|----------------------------|---------------------------------|
| `primary`   | Ação principal da página   | Preenchido, cor de destaque     |
| `secondary` | Ação alternativa           | Contorno (outlined)             |
| `ghost`     | Ação terciária / nav       | Sem fundo, apenas texto         |

## Regras de Micro-Interação

- **Hover**: `scale(1.02)` + elevação de sombra em `150ms` com `ease-out`
- **Active/Click**: `scale(0.98)` em `100ms` — feedback tátil
- **Focus**: ring animado `2px` offset para acessibilidade via teclado
- **Disabled**: `opacity-50`, `cursor-not-allowed`, sem hover
- **Loading**: spinner inline, texto muda para "Processando...", `pointer-events-none`

## Tamanhos

| Size | Padding        | Font Size | Min Height |
|------|----------------|-----------|------------|
| `sm` | `px-3 py-1.5`  | `text-sm` | `32px`     |
| `md` | `px-5 py-2.5`  | `text-base`| `40px`    |
| `lg` | `px-7 py-3.5`  | `text-lg` | `48px`     |

## Código Completo

```tsx
// components/ui/cta-button.tsx
"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface CTAButtonProps
  extends Omit<HTMLMotionProps<"button">, "children" | "disabled"> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  disabled?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loadingText?: string;
}

const variantStyles: Record<Variant, string> = {
  primary: [
    "bg-primary text-primary-foreground",
    "shadow-md hover:shadow-lg",
    "focus-visible:ring-primary/50",
  ].join(" "),
  secondary: [
    "border-2 border-primary text-primary bg-transparent",
    "hover:bg-primary/5",
    "focus-visible:ring-primary/30",
  ].join(" "),
  ghost: [
    "text-foreground bg-transparent",
    "hover:bg-foreground/5",
    "focus-visible:ring-foreground/20",
  ].join(" "),
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm min-h-[32px] gap-1.5",
  md: "px-5 py-2.5 text-base min-h-[40px] gap-2",
  lg: "px-7 py-3.5 text-lg min-h-[48px] gap-2.5",
};

const spinnerSizes: Record<Size, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export const CTAButton = forwardRef<HTMLButtonElement, CTAButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      iconLeft,
      iconRight,
      loadingText = "Processando...",
      className = "",
      ...motionProps
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        whileHover={isDisabled ? undefined : { scale: 1.02 }}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={[
          "relative inline-flex items-center justify-center",
          "rounded-lg font-semibold",
          "transition-shadow duration-150 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className,
        ].join(" ")}
        {...motionProps}
      >
        {isLoading ? (
          <>
            <Loader2 className={`animate-spin ${spinnerSizes[size]}`} />
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            {iconLeft && <span className="shrink-0">{iconLeft}</span>}
            <span>{children}</span>
            {iconRight && <span className="shrink-0">{iconRight}</span>}
          </>
        )}
      </motion.button>
    );
  },
);

CTAButton.displayName = "CTAButton";
```

## Uso com Variantes

```tsx
import { CTAButton } from "@/components/ui/cta-button";
import { ArrowRight, Download } from "lucide-react";

// Primário — ação principal
<CTAButton size="lg" iconRight={<ArrowRight className="h-5 w-5" />}>
  Começar meu teste grátis
</CTAButton>

// Secundário — ação alternativa
<CTAButton variant="secondary">
  Ver demonstração
</CTAButton>

// Ghost — ação terciária
<CTAButton variant="ghost" size="sm" iconLeft={<Download className="h-4 w-4" />}>
  Baixar PDF
</CTAButton>

// Loading state
<CTAButton isLoading loadingText="Criando conta...">
  Criar conta
</CTAButton>

// Disabled
<CTAButton disabled>
  Indisponível
</CTAButton>
```

## Boas Práticas de Copy

| Ruim (genérico)     | Bom (específico)                  |
|----------------------|-----------------------------------|
| Enviar               | Começar meu teste grátis          |
| Clique aqui          | Ver planos e preços               |
| Saiba mais           | Descobrir como economizar 40%     |
| Cadastrar            | Criar minha conta em 30 segundos  |

## Checklist de Implementação

- [ ] Apenas **um** CTA primário visível por viewport
- [ ] Texto de ação específico e orientado ao benefício
- [ ] Contraste mínimo 4.5:1 (WCAG AA)
- [ ] `hover`, `focus`, `active`, `disabled`, `loading` — todos os estados
- [ ] Ícone reforça a ação, nunca decora
- [ ] Tamanho `lg` para hero, `md` para seções, `sm` para inline
