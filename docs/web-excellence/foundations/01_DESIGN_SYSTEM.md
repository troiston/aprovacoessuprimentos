---
id: doc-design-system
title: Arquitetura de Design System
version: 2.0
last_updated: 2026-04-07
category: foundations
priority: critical
related:
  - docs/web-excellence/foundations/02_TYPOGRAPHY.md
  - docs/web-excellence/foundations/03_COLOR_SYSTEM.md
  - docs/web-excellence/foundations/04_SPACING_GRID.md
  - .cursor/rules/design/tokens.mdc
  - .cursor/rules/stack/tailwind.mdc
---

# Arquitetura de Design System

## 1. Hierarquia de Tokens em 3 Camadas

Um design system maduro organiza seus tokens em três camadas com responsabilidades distintas. A violação dessa hierarquia é a causa #1 de inconsistência visual em projetos escaláveis.

### Camada 1 — Tokens Primitivos (Global)

Valores brutos sem contexto semântico. Representam o universo completo de opções disponíveis.

```css
/* primitives.css */
:root {
  /* Cores — OKLCH para uniformidade perceptual */
  --color-blue-50: oklch(0.97 0.01 250);
  --color-blue-100: oklch(0.93 0.03 250);
  --color-blue-200: oklch(0.87 0.06 250);
  --color-blue-300: oklch(0.78 0.10 250);
  --color-blue-400: oklch(0.68 0.15 250);
  --color-blue-500: oklch(0.58 0.19 250);
  --color-blue-600: oklch(0.48 0.19 250);
  --color-blue-700: oklch(0.40 0.17 250);
  --color-blue-800: oklch(0.33 0.14 250);
  --color-blue-900: oklch(0.27 0.10 250);
  --color-blue-950: oklch(0.20 0.07 250);

  /* Espaçamento — base 4px */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-24: 6rem;      /* 96px */

  /* Tipografia */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;

  /* Raios de borda */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;
}
```

**Quando usar:** Nunca diretamente em componentes. Primitivos são consumidos exclusivamente pela camada semântica.

### Camada 2 — Tokens Semânticos (Alias)

Atribuem significado contextual aos primitivos. São a principal interface de consumo para desenvolvedores.

```css
/* semantic.css */
:root {
  /* Superfícies */
  --surface-primary: var(--color-white);
  --surface-secondary: var(--color-neutral-50);
  --surface-tertiary: var(--color-neutral-100);
  --surface-inverse: var(--color-neutral-900);
  --surface-brand: var(--color-blue-500);
  --surface-elevated: var(--color-white);

  /* Texto */
  --text-primary: var(--color-neutral-900);
  --text-secondary: var(--color-neutral-600);
  --text-tertiary: var(--color-neutral-400);
  --text-inverse: var(--color-white);
  --text-brand: var(--color-blue-600);
  --text-link: var(--color-blue-600);
  --text-success: var(--color-green-600);
  --text-warning: var(--color-amber-600);
  --text-error: var(--color-red-600);

  /* Bordas */
  --border-default: var(--color-neutral-200);
  --border-strong: var(--color-neutral-400);
  --border-brand: var(--color-blue-500);
  --border-error: var(--color-red-500);

  /* Interação */
  --interactive-primary: var(--color-blue-600);
  --interactive-primary-hover: var(--color-blue-700);
  --interactive-primary-active: var(--color-blue-800);
  --interactive-secondary: var(--color-neutral-100);
  --interactive-secondary-hover: var(--color-neutral-200);
  --interactive-destructive: var(--color-red-600);
  --interactive-destructive-hover: var(--color-red-700);

  /* Feedback */
  --feedback-success-bg: var(--color-green-50);
  --feedback-success-border: var(--color-green-200);
  --feedback-success-text: var(--color-green-800);
  --feedback-warning-bg: var(--color-amber-50);
  --feedback-warning-border: var(--color-amber-200);
  --feedback-warning-text: var(--color-amber-800);
  --feedback-error-bg: var(--color-red-50);
  --feedback-error-border: var(--color-red-200);
  --feedback-error-text: var(--color-red-800);
  --feedback-info-bg: var(--color-blue-50);
  --feedback-info-border: var(--color-blue-200);
  --feedback-info-text: var(--color-blue-800);

  /* Elevação */
  --shadow-sm: 0 1px 2px oklch(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px oklch(0 0 0 / 0.07), 0 2px 4px -2px oklch(0 0 0 / 0.05);
  --shadow-lg: 0 10px 15px -3px oklch(0 0 0 / 0.08), 0 4px 6px -4px oklch(0 0 0 / 0.04);
  --shadow-xl: 0 20px 25px -5px oklch(0 0 0 / 0.1), 0 8px 10px -6px oklch(0 0 0 / 0.05);
}
```

**Quando usar:** Em todos os componentes e layouts. Tokens semânticos são a interface padrão de consumo.

### Camada 3 — Tokens de Componente (Scoped)

Específicos de um componente. Referenciam tokens semânticos e permitem personalização local.

```css
/* button.css */
.btn {
  --btn-bg: var(--interactive-primary);
  --btn-bg-hover: var(--interactive-primary-hover);
  --btn-text: var(--text-inverse);
  --btn-radius: var(--radius-md);
  --btn-padding-x: var(--space-4);
  --btn-padding-y: var(--space-2);
  --btn-font-size: var(--font-size-sm);
  --btn-font-weight: 600;
  --btn-height: 2.5rem;

  background: var(--btn-bg);
  color: var(--btn-text);
  border-radius: var(--btn-radius);
  padding: var(--btn-padding-y) var(--btn-padding-x);
  font-size: var(--btn-font-size);
  font-weight: var(--btn-font-weight);
  height: var(--btn-height);
}

.btn:hover {
  background: var(--btn-bg-hover);
}
```

**Quando usar:** Quando um componente tem variantes visuais que não mapeiam diretamente para tokens semânticos, ou quando é necessário permitir customização sem alterar o sistema global.

## 2. Convenção de Nomenclatura de Tokens

### Fórmula

```
--[categoria]-[propriedade]-[variante]-[estado]-[escala]
```

| Segmento      | Exemplos                              | Obrigatório |
|---------------|---------------------------------------|-------------|
| Categoria     | `color`, `space`, `font`, `shadow`    | Sim         |
| Propriedade   | `bg`, `text`, `border`, `size`        | Sim         |
| Variante      | `primary`, `secondary`, `brand`       | Contexto    |
| Estado        | `hover`, `active`, `disabled`, `focus`| Não         |
| Escala        | `sm`, `md`, `lg`, `50`-`950`          | Não         |

### Regras de Nomenclatura

1. **kebab-case** exclusivamente — sem camelCase, sem underscores
2. **Prefixo de categoria** obrigatório no nível primitivo
3. **Semântica descritiva** no nível alias — `--text-primary` ao invés de `--color-neutral-900`
4. **Sem valores no nome** — `--space-md` ao invés de `--space-16px`
5. **Consistência de escalas** — usar a mesma progressão em todo o sistema

## 3. Integração com Tailwind CSS v4

Tailwind v4 adota CSS-first config com `@theme`. Os tokens do design system conectam-se diretamente:

```css
/* app.css */
@import "tailwindcss";

@theme {
  /* Cores semânticas como utilitários Tailwind */
  --color-surface-primary: var(--surface-primary);
  --color-surface-secondary: var(--surface-secondary);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-interactive: var(--interactive-primary);
  --color-interactive-hover: var(--interactive-primary-hover);
  --color-border: var(--border-default);
  --color-border-strong: var(--border-strong);

  /* Espaçamento */
  --spacing: 0.25rem; /* base 4px */

  /* Raios customizados */
  --radius-card: var(--radius-lg);
  --radius-button: var(--radius-md);
  --radius-input: var(--radius-md);
  --radius-badge: var(--radius-full);

  /* Sombras */
  --shadow-card: var(--shadow-md);
  --shadow-dropdown: var(--shadow-lg);
  --shadow-modal: var(--shadow-xl);

  /* Fontes */
  --font-sans: "Inter Variable", "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", "JetBrains Mono", monospace;

  /* Breakpoints */
  --breakpoint-sm: 40rem;   /* 640px */
  --breakpoint-md: 48rem;   /* 768px */
  --breakpoint-lg: 64rem;   /* 1024px */
  --breakpoint-xl: 80rem;   /* 1280px */
  --breakpoint-2xl: 96rem;  /* 1536px */
}
```

Uso resultante em JSX:

```tsx
<div className="bg-surface-primary text-text-primary border-border rounded-card shadow-card p-4">
  <h2 className="text-text-primary font-semibold">Título</h2>
  <p className="text-text-secondary">Descrição</p>
  <button className="bg-interactive hover:bg-interactive-hover text-white rounded-button px-4 py-2">
    Ação
  </button>
</div>
```

## 4. Estratégia de Dark Mode

### Abordagem: Inversão Semântica via CSS Custom Properties

```css
/* light (padrão) */
:root {
  --surface-primary: var(--color-white);
  --surface-secondary: var(--color-neutral-50);
  --text-primary: var(--color-neutral-900);
  --text-secondary: var(--color-neutral-600);
  --border-default: var(--color-neutral-200);
  --interactive-primary: var(--color-blue-600);
}

/* dark */
.dark {
  --surface-primary: var(--color-neutral-950);
  --surface-secondary: var(--color-neutral-900);
  --text-primary: var(--color-neutral-50);
  --text-secondary: var(--color-neutral-400);
  --border-default: var(--color-neutral-800);
  --interactive-primary: var(--color-blue-400);
}
```

### Princípios de Inversão

| Propriedade         | Light              | Dark               | Regra                                    |
|---------------------|--------------------|---------------------|------------------------------------------|
| Superfície base     | white              | neutral-950         | Fundo mais escuro, não preto puro        |
| Texto primário      | neutral-900        | neutral-50          | Nunca branco puro (#fff) — usar 95-97% L |
| Texto secundário    | neutral-600        | neutral-400         | Reduzir contraste proporcional           |
| Bordas              | neutral-200        | neutral-800         | Manter relação relativa à superfície     |
| Brand primary       | blue-600           | blue-400            | Desaturar levemente, aumentar lightness  |
| Sombras             | oklch(0 0 0 / 0.1) | oklch(0 0 0 / 0.4) | Aumentar opacidade 3-4x                  |
| Elevação            | sombra mais forte  | lightness maior     | Dark mode usa lightness ao invés de sombra |

### Implementação no Next.js

```tsx
// providers/theme-provider.tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ReactNode } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
```

## 5. Extensão do Sistema

### Adicionando uma Nova Cor Semântica

1. Definir primitivos na paleta (se não existirem)
2. Criar tokens semânticos para light e dark
3. Registrar no `@theme` do Tailwind
4. Documentar uso pretendido

```css
/* 1. Primitivo */
:root {
  --color-violet-500: oklch(0.55 0.20 295);
  --color-violet-400: oklch(0.65 0.18 295);
}

/* 2. Semântico */
:root {
  --accent-primary: var(--color-violet-500);
}
.dark {
  --accent-primary: var(--color-violet-400);
}

/* 3. Tailwind */
@theme {
  --color-accent: var(--accent-primary);
}
```

### Adicionando um Novo Componente

1. Criar tokens de componente referenciando semânticos
2. Definir variantes como modificadores de tokens
3. Nunca referenciar primitivos diretamente

## 6. Padrões de Composição de Componentes

### Compound Components

```tsx
// Composição declarativa com contexto compartilhado
<Card>
  <Card.Header>
    <Card.Title>Título</Card.Title>
    <Card.Description>Descrição</Card.Description>
  </Card.Header>
  <Card.Content>
    {/* conteúdo */}
  </Card.Content>
  <Card.Footer>
    <Card.Action>Confirmar</Card.Action>
  </Card.Footer>
</Card>
```

### Variant Pattern com CVA

```tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-interactive text-white hover:bg-interactive-hover',
        secondary: 'bg-surface-secondary text-text-primary hover:bg-surface-tertiary border border-border',
        ghost: 'text-text-primary hover:bg-surface-secondary',
        destructive: 'bg-feedback-error-text text-white hover:opacity-90',
      },
      size: {
        sm: 'h-8 px-3 text-sm rounded-md',
        md: 'h-10 px-4 text-sm rounded-md',
        lg: 'h-12 px-6 text-base rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

type ButtonProps = React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={buttonVariants({ variant, size, className })} {...props} />
}
```

### Slot Pattern

```tsx
import { Slot } from '@radix-ui/react-slot'

type ButtonProps = React.ComponentProps<'button'> & {
  asChild?: boolean
}

export function Button({ asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp {...props} />
}

// Uso: renderiza <a> com estilos de Button
<Button asChild>
  <a href="/dashboard">Ir ao Dashboard</a>
</Button>
```

## 7. Workflow de Handoff Design–Desenvolvimento

### Fluxo Recomendado

```
Designer (Figma)           Developer (Código)
─────────────────          ──────────────────
1. Define tokens       →   tokens.css (primitivos)
   no Figma Variables      ↓
2. Cria componentes    →   semantic.css (aliases)
   com Auto Layout         ↓
3. Prototipa fluxos    →   Componentes React + CVA
   ↓                       ↓
4. Review conjunto     ←→  Storybook / Preview
   ↓                       ↓
5. Iteração            ←→  Refinamento
```

### Checklist de Handoff

- [ ] Tokens Figma sincronizados com CSS variables
- [ ] Todas as variantes documentadas (hover, focus, disabled, loading)
- [ ] Breakpoints e comportamento responsivo especificados
- [ ] Estados de erro e vazio definidos
- [ ] Animações descritas (duração, easing, propriedade)
- [ ] Casos edge documentados (texto longo, imagem ausente, lista vazia)
- [ ] Acessibilidade verificada (contraste, ordem de foco, labels)

### Ferramentas de Sincronização

| Ferramenta          | Função                                    |
|---------------------|-------------------------------------------|
| Figma Variables     | Source of truth para tokens primitivos     |
| Figma Code Connect  | Mapeia componentes Figma → código         |
| Storybook           | Documentação viva dos componentes         |
| Chromatic           | Visual regression testing                  |
| Style Dictionary    | Transformação cross-platform de tokens     |
