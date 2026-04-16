---
id: skill-build-design-tokens
title: "Build Design Tokens"
agent: 02-designer
version: 1.0
category: foundations
priority: critical
requires:
  - rule: core/00-constitution
provides:
  - globals.css com @theme
  - sistema completo de tokens
used_by:
  - agent: 02-designer
  - command: init-tokens
---

# Build Design Tokens

Sistema completo de design tokens usando Tailwind CSS v4 com diretiva `@theme`. Hierarquia de 3 camadas: primitivos → semânticos → componente.

## Hierarquia de Tokens

```
Primitivos (valores brutos)     → --color-blue-500: oklch(0.55 0.2 255)
Semânticos (intenção de uso)    → --color-accent: var(--color-blue-500)
Componente (contexto específico) → --btn-bg: var(--color-accent)
```

Regra: nunca use primitivos diretamente no markup. Sempre referencie tokens semânticos ou de componente.

## Estrutura do globals.css

Crie `src/app/globals.css` com a seguinte estrutura:

```css
@import "tailwindcss";

/* ============================================
   DESIGN TOKENS — Hierarquia de 3 Camadas
   ============================================ */

@theme {

  /* ----------------------------------------
     CAMADA 1: PRIMITIVOS (valores brutos)
     ---------------------------------------- */

  /* Cores Primárias — OKLCH (Lightness, Chroma, Hue) */
  --color-primary-50:  oklch(0.97 0.01 250);
  --color-primary-100: oklch(0.93 0.02 250);
  --color-primary-200: oklch(0.86 0.05 250);
  --color-primary-300: oklch(0.75 0.10 250);
  --color-primary-400: oklch(0.65 0.15 250);
  --color-primary-500: oklch(0.55 0.20 250);
  --color-primary-600: oklch(0.48 0.18 250);
  --color-primary-700: oklch(0.40 0.15 250);
  --color-primary-800: oklch(0.33 0.12 250);
  --color-primary-900: oklch(0.27 0.09 250);
  --color-primary-950: oklch(0.20 0.06 250);

  /* Neutros — chroma mínimo com tint do primary */
  --color-neutral-50:  oklch(0.98 0.005 250);
  --color-neutral-100: oklch(0.94 0.005 250);
  --color-neutral-200: oklch(0.88 0.008 250);
  --color-neutral-300: oklch(0.80 0.008 250);
  --color-neutral-400: oklch(0.65 0.008 250);
  --color-neutral-500: oklch(0.55 0.008 250);
  --color-neutral-600: oklch(0.45 0.008 250);
  --color-neutral-700: oklch(0.37 0.008 250);
  --color-neutral-800: oklch(0.27 0.008 250);
  --color-neutral-900: oklch(0.20 0.008 250);
  --color-neutral-950: oklch(0.14 0.006 250);

  /* Success — Hue ~145 (verde) */
  --color-success-100: oklch(0.93 0.04 145);
  --color-success-300: oklch(0.75 0.14 145);
  --color-success-500: oklch(0.60 0.19 145);
  --color-success-700: oklch(0.42 0.13 145);
  --color-success-900: oklch(0.25 0.07 145);

  /* Warning — Hue ~85 (amarelo) */
  --color-warning-100: oklch(0.95 0.05 85);
  --color-warning-300: oklch(0.83 0.14 85);
  --color-warning-500: oklch(0.75 0.17 85);
  --color-warning-700: oklch(0.55 0.12 85);
  --color-warning-900: oklch(0.35 0.07 85);

  /* Error — Hue ~25 (vermelho) */
  --color-error-100: oklch(0.93 0.04 25);
  --color-error-300: oklch(0.75 0.14 25);
  --color-error-500: oklch(0.58 0.22 25);
  --color-error-700: oklch(0.42 0.15 25);
  --color-error-900: oklch(0.25 0.08 25);

  /* ----------------------------------------
     CAMADA 2: SEMÂNTICOS (intenção)
     ---------------------------------------- */

  /* Superfícies */
  --color-surface:         var(--color-neutral-50);
  --color-surface-raised:  oklch(1.00 0 0);
  --color-surface-sunken:  var(--color-neutral-100);
  --color-surface-overlay: var(--color-neutral-900);

  /* Texto */
  --color-on-surface:       var(--color-neutral-900);
  --color-on-surface-muted: var(--color-neutral-500);
  --color-on-surface-subtle:var(--color-neutral-400);
  --color-on-overlay:       var(--color-neutral-50);

  /* Accent / Interativo */
  --color-accent:           var(--color-primary-500);
  --color-accent-hover:     var(--color-primary-600);
  --color-accent-active:    var(--color-primary-700);
  --color-accent-subtle:    var(--color-primary-100);
  --color-on-accent:        oklch(1.00 0 0);

  /* Muted */
  --color-muted:            var(--color-neutral-200);
  --color-muted-foreground: var(--color-neutral-600);

  /* Bordas */
  --color-border:           var(--color-neutral-200);
  --color-border-strong:    var(--color-neutral-300);
  --color-border-accent:    var(--color-primary-300);

  /* Estados semânticos */
  --color-success:          var(--color-success-500);
  --color-warning:          var(--color-warning-500);
  --color-error:            var(--color-error-500);

  /* Focus ring */
  --color-focus-ring:       var(--color-primary-400);

  /* ----------------------------------------
     Spacing — Base 4px (0.25rem)
     ---------------------------------------- */
  --spacing-xs:   0.25rem;  /* 4px  */
  --spacing-sm:   0.5rem;   /* 8px  */
  --spacing-md:   1rem;     /* 16px */
  --spacing-lg:   1.5rem;   /* 24px */
  --spacing-xl:   2rem;     /* 32px */
  --spacing-2xl:  3rem;     /* 48px */
  --spacing-3xl:  4rem;     /* 64px */

  /* ----------------------------------------
     Shadows
     ---------------------------------------- */
  --shadow-sm:  0 1px 2px 0 oklch(0 0 0 / 0.05);
  --shadow-md:  0 4px 6px -1px oklch(0 0 0 / 0.07), 0 2px 4px -2px oklch(0 0 0 / 0.05);
  --shadow-lg:  0 10px 15px -3px oklch(0 0 0 / 0.08), 0 4px 6px -4px oklch(0 0 0 / 0.04);
  --shadow-xl:  0 20px 25px -5px oklch(0 0 0 / 0.10), 0 8px 10px -6px oklch(0 0 0 / 0.05);
  --shadow-focus: 0 0 0 3px var(--color-focus-ring);

  /* ----------------------------------------
     Border Radius
     ---------------------------------------- */
  --radius-sm:   0.25rem;   /* 4px   */
  --radius-md:   0.5rem;    /* 8px   */
  --radius-lg:   1rem;      /* 16px  */
  --radius-xl:   1.5rem;    /* 24px  */
  --radius-full: 9999px;

  /* ----------------------------------------
     Transitions
     ---------------------------------------- */
  --duration-fast:   150ms;
  --duration-normal: 300ms;
  --duration-slow:   500ms;
  --ease-default:    cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in:         cubic-bezier(0.4, 0, 1, 1);
  --ease-out:        cubic-bezier(0, 0, 0.2, 1);
  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);

  /* ----------------------------------------
     Z-Index Scale
     ---------------------------------------- */
  --z-dropdown: 10;
  --z-sticky:   20;
  --z-fixed:    30;
  --z-modal:    40;
  --z-toast:    50;

  /* ----------------------------------------
     Containers
     ---------------------------------------- */
  --container-sm:  640px;
  --container-md:  768px;
  --container-lg:  1024px;
  --container-xl:  1280px;
  --container-2xl: 1536px;

}

/* ============================================
   CAMADA 3: TOKENS DE COMPONENTE
   ============================================ */

:root {
  /* Botão primário */
  --btn-primary-bg:    var(--color-accent);
  --btn-primary-hover: var(--color-accent-hover);
  --btn-primary-text:  var(--color-on-accent);

  /* Card */
  --card-bg:           var(--color-surface-raised);
  --card-border:       var(--color-border);
  --card-shadow:       var(--shadow-md);
  --card-radius:       var(--radius-lg);
  --card-padding:      var(--spacing-lg);

  /* Input */
  --input-bg:          var(--color-surface-raised);
  --input-border:      var(--color-border);
  --input-focus:       var(--color-border-accent);
  --input-radius:      var(--radius-md);
  --input-padding-x:   var(--spacing-md);
  --input-padding-y:   var(--spacing-sm);

  /* Badge */
  --badge-bg:          var(--color-accent-subtle);
  --badge-text:        var(--color-accent);
  --badge-radius:      var(--radius-full);
}
```

## Regras de Uso

1. **Nunca** use valores hardcoded — sempre tokens
2. **Nunca** use `rgb()` ou `hsl()` — use `oklch()`
3. Tokens de componente ficam em `:root`, não dentro do `@theme`
4. Para dark mode, sobrescreva tokens semânticos em `@media (prefers-color-scheme: dark)` ou classe `.dark`
5. Mantenha primitivos com sufixo numérico, semânticos com nome descritivo

## Dark Mode

Adicione após o bloco `:root`:

```css
.dark {
  --color-surface:         var(--color-neutral-950);
  --color-surface-raised:  var(--color-neutral-900);
  --color-surface-sunken:  var(--color-neutral-950);
  --color-surface-overlay: oklch(0 0 0 / 0.7);

  --color-on-surface:        var(--color-neutral-100);
  --color-on-surface-muted:  var(--color-neutral-400);
  --color-on-surface-subtle: var(--color-neutral-500);

  --color-border:        var(--color-neutral-800);
  --color-border-strong: var(--color-neutral-700);

  --color-muted:            var(--color-neutral-800);
  --color-muted-foreground: var(--color-neutral-400);

  --shadow-sm:  0 1px 2px 0 oklch(0 0 0 / 0.2);
  --shadow-md:  0 4px 6px -1px oklch(0 0 0 / 0.3), 0 2px 4px -2px oklch(0 0 0 / 0.2);
  --shadow-lg:  0 10px 15px -3px oklch(0 0 0 / 0.35), 0 4px 6px -4px oklch(0 0 0 / 0.2);
}
```

## Validação

Checklist antes de finalizar:

- [ ] Todos os primitivos usam OKLCH
- [ ] Contraste texto/fundo ≥ 4.5:1 (use `oklch` lightness diff ≥ 0.4)
- [ ] Tokens semânticos cobrem: surface, on-surface, accent, muted, border, error, success, warning
- [ ] Dark mode inverte lightness corretamente
- [ ] Nenhum valor magic number no código de componentes
- [ ] `@theme` contém apenas variáveis CSS (sem classes utilitárias)
