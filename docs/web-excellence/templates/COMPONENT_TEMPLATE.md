---
id: doc-component-template
title: Checklist de Criação de Componente
version: 2.0
last_updated: 2026-04-07
category: templates
priority: important
related:
  - docs/web-excellence/templates/PAGE_TEMPLATE.md
  - docs/web-excellence/performance/01_CORE_WEB_VITALS.md
  - .cursor/rules/core/01-typescript.mdc
  - .cursor/rules/core/02-code-style.mdc
---

# Checklist de Criação de Componente

## Resumo Executivo

Template e checklist para criar componentes React/Next.js consistentes, acessíveis, testados e documentados. Inclui estrutura de arquivos, interface de props, padrões de acessibilidade, animação, responsividade e skeleton de código TSX.

---

## 1. Estrutura de Arquivos

### 1.1 Componente Simples

```
components/
  feature-card/
    feature-card.tsx     ← Componente principal
    feature-card.test.tsx ← Testes
    index.ts             ← Re-export
```

### 1.2 Componente Complexo

```
components/
  pricing-section/
    pricing-section.tsx   ← Componente principal (Server Component)
    pricing-card.tsx      ← Sub-componente
    billing-toggle.tsx    ← Sub-componente (Client)
    types.ts              ← Interfaces e types
    pricing-section.test.tsx
    index.ts
```

### 1.3 Re-export (index.ts)

```tsx
export { FeatureCard } from "./feature-card"
export type { FeatureCardProps } from "./feature-card"
```

---

## 2. Props Interface

### 2.1 Padrão de Props

```tsx
import { type VariantProps, cva } from "class-variance-authority"

const featureCardVariants = cva(
  "rounded-2xl border border-border p-6 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-background",
        highlighted: "bg-primary/5 border-primary",
        muted: "bg-muted/50",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface FeatureCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof featureCardVariants> {
  icon: React.ReactNode
  title: string
  description: string
  href?: string
}
```

### 2.2 Regras de Props

| Regra | Motivo |
|-------|--------|
| Herdar de `HTMLAttributes` | Permite className, id, data-*, etc. |
| Usar `VariantProps` do CVA | Type safety para variants |
| Props obrigatórias sem default | Forçar explicitidade |
| Props opcionais com default | Reduzir boilerplate no uso |
| Nunca `any` | TypeScript strict |
| Documentar props complexas | JSDoc comments |

---

## 3. Acessibilidade

### 3.1 Checklist ARIA

```
□ Semântica HTML correta (button, a, section, article...)
□ Roles implícitos preferidos sobre explícitos
□ aria-label em elementos sem texto visível
□ aria-describedby para descrições adicionais
□ aria-expanded para accordions/dropdowns
□ aria-current="page" para nav item ativo
□ aria-live para conteúdo dinâmico
□ role="group" para conjuntos de controles relacionados
```

### 3.2 Keyboard Navigation

```
□ Todos os interativos focáveis (tab)
□ Enter/Space ativa buttons
□ Escape fecha modais/dropdowns
□ Arrow keys para tabs, menus, sliders
□ Focus trap em modais
□ Focus visible com outline claro
□ Sem tabindex > 0 (nunca)
```

### 3.3 Template A11y

```tsx
function InteractiveCard({ title, description, href, ...props }: CardProps) {
  const Component = href ? "a" : "div"

  return (
    <Component
      href={href}
      className={cn(
        "group rounded-2xl border p-6 transition-colors",
        href && "cursor-pointer hover:border-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
      )}
      {...(href ? { "aria-label": `Saiba mais sobre ${title}` } : {})}
      {...props}
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1">{description}</p>
    </Component>
  )
}
```

---

## 4. Responsividade

### 4.1 Breakpoints

```
320px  — Mínimo suportado (small phones)
375px  — iPhone SE/Mini
640px  — sm: Small tablets
768px  — md: Tablets
1024px — lg: Small desktops/laptops
1280px — xl: Desktops
1536px — 2xl: Large desktops
```

### 4.2 Padrão Mobile-First

```tsx
<div className={cn(
  // Mobile (default)
  "flex flex-col gap-4 p-4",
  // Tablet
  "sm:flex-row sm:gap-6 sm:p-6",
  // Desktop
  "lg:gap-8 lg:p-8"
)}>
```

### 4.3 Container Queries (quando disponível)

```tsx
<div className="@container">
  <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-4">
    {items.map((item) => <Card key={item.id} {...item} />)}
  </div>
</div>
```

---

## 5. Animação

### 5.1 Padrão de Entrada

```tsx
"use client"

import { motion } from "framer-motion"

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
}

function AnimatedCard({ children, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}
```

### 5.2 Regras de Animação

```
□ Apenas transform + opacity (GPU-accelerated)
□ Duração máxima: 400ms para micro, 600ms para macro
□ Spring physics para naturalidade
□ Respeitar prefers-reduced-motion
□ whileInView com once: true (animar só 1x)
□ Stagger máximo: 100-150ms entre items
□ Sem animação em Server Components (wrapper Client)
```

### 5.3 Reduced Motion

```tsx
"use client"

import { useReducedMotion } from "framer-motion"

function AnimatedComponent({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? false : "hidden"}
      whileInView="visible"
      variants={fadeUpVariants}
    >
      {children}
    </motion.div>
  )
}
```

---

## 6. Testing

### 6.1 Estrutura de Teste

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import { FeatureCard } from "./feature-card"

describe("FeatureCard", () => {
  const defaultProps = {
    icon: <span data-testid="icon">★</span>,
    title: "Feature Title",
    description: "Feature description text",
  }

  it("renderiza título e descrição", () => {
    render(<FeatureCard {...defaultProps} />)
    expect(screen.getByText("Feature Title")).toBeInTheDocument()
    expect(screen.getByText("Feature description text")).toBeInTheDocument()
  })

  it("renderiza como link quando href é fornecido", () => {
    render(<FeatureCard {...defaultProps} href="/feature" />)
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/feature")
  })

  it("aplica variant highlighted", () => {
    const { container } = render(<FeatureCard {...defaultProps} variant="highlighted" />)
    expect(container.firstChild).toHaveClass("border-primary")
  })

  it("é acessível por teclado quando clicável", async () => {
    const user = userEvent.setup()
    render(<FeatureCard {...defaultProps} href="/feature" />)
    const link = screen.getByRole("link")
    await user.tab()
    expect(link).toHaveFocus()
  })
})
```

### 6.2 Checklist de Testes

```
□ Renderiza sem erros com props mínimas
□ Renderiza corretamente cada variant
□ Props opcionais funcionam quando omitidas
□ Interações (click, hover, focus) respondem
□ Acessível por teclado (Tab, Enter, Space)
□ ARIA attributes corretos
□ Responsivo (snapshot em diferentes widths, se visual)
□ Edge cases (strings longas, listas vazias, loading)
```

---

## 7. TSX Skeleton Code

### 7.1 Server Component (padrão)

```tsx
import { cn } from "@/lib/utils"

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description, className, ...props }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border p-6 space-y-3",
        className
      )}
      {...props}
    >
      <div className="p-2 rounded-lg bg-primary/10 w-fit">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}

export { FeatureCard }
export type { FeatureCardProps }
```

### 7.2 Client Component (com interação)

```tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface AccordionItemProps {
  question: string
  answer: string
  defaultOpen?: boolean
}

function AccordionItem({ question, answer, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={cn(
          "flex w-full items-center justify-between py-4 text-left font-medium",
          "hover:text-primary transition-colors",
          "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        )}
      >
        {question}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-muted-foreground">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { AccordionItem }
export type { AccordionItemProps }
```

### 7.3 Componente Composto (pattern)

```tsx
interface PricingSectionProps {
  tiers: PricingTier[]
  features: ComparisonFeature[]
  faqs: FAQItem[]
}

function PricingSection({ tiers, features, faqs }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          title="Preços simples e transparentes"
          description="Sem surpresas. Sem taxas escondidas."
        />
        <BillingToggle />
        <PricingCards tiers={tiers} />
        <ComparisonTable features={features} tiers={tiers} />
        <FAQSection items={faqs} />
        <TrustSignals />
      </div>
    </section>
  )
}
```

---

## 8. Checklist Completo

```
ESTRUTURA
□ Arquivo principal: [name].tsx
□ Types em types.ts (se complexo)
□ Re-export em index.ts
□ Testes em [name].test.tsx

PROPS
□ Interface extends HTMLAttributes relevante
□ Variants com CVA (se aplicável)
□ Props obrigatórias sem default
□ Props opcionais com default sensato
□ TypeScript strict (sem any)

ACESSIBILIDADE
□ Semântica HTML correta
□ ARIA attributes quando necessário
□ Keyboard navigável
□ Focus visible
□ Contraste ≥ 4.5:1
□ Screen reader testado

RESPONSIVIDADE
□ Mobile-first (320px como base)
□ Breakpoints: sm, md, lg, xl
□ Touch targets ≥ 48px
□ Textos com clamp() para fluid sizing

ANIMAÇÃO
□ GPU-only (transform + opacity)
□ Spring physics (Framer Motion)
□ prefers-reduced-motion respeitado
□ Duração ≤ 400ms
□ "use client" no wrapper de animação

PERFORMANCE
□ Server Component por padrão
□ "use client" apenas quando necessário
□ Imagens com next/image + sizes
□ Lazy loading para below-fold
□ Sem re-renders desnecessários

TESTES
□ Render com props mínimas
□ Cada variant testada
□ Interações testadas
□ Acessibilidade testada
□ Edge cases cobertos
```
