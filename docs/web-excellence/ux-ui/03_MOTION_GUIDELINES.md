---
id: doc-motion-guidelines
title: Guia de Motion Design
version: 2.0
last_updated: 2026-04-07
category: ux-ui
priority: important
related:
  - docs/web-excellence/ux-ui/01_UX_PRINCIPLES.md
  - docs/web-excellence/ux-ui/02_UI_PATTERNS.md
  - docs/web-excellence/ux-ui/04_ACCESSIBILITY_GUIDE.md
  - docs/web-excellence/seo/03_SEO_PERFORMANCE.md
  - .cursor/rules/stack/framer-motion.mdc
---

# Guia de Motion Design

## 1. Propósito do Motion

Animação na web serve a três funções hierárquicas — nunca é decoração pura.

### 1.1 Hierarquia de Propósito

| Prioridade | Propósito | Exemplo | Obrigatório? |
|---|---|---|---|
| 1 | **Feedback** | Button press, toggle, form validation | ✅ Sim |
| 2 | **Orientação** | Page transition, scroll indication, navigation | ✅ Sim |
| 3 | **Hierarquia** | Stagger de cards, entrance sequencing | Recomendado |
| 4 | **Deleite** | Confetti no sucesso, hover Easter eggs | Opcional |

### 1.2 Regra de Ouro

> Se remover a animação e a interface ficar confusa ou perder feedback, a animação é necessária. Se nada muda, era decoração.

## 2. Os 12 Princípios da Animação (Adaptados para Web)

### 2.1 Princípios Essenciais

| # | Princípio Disney | Adaptação Web | Implementação |
|---|---|---|---|
| 1 | Squash & Stretch | Scale em botões e toasts | `scale(0.95)` → `scale(1)` |
| 2 | Anticipation | Micro-recuo antes de ação | Button press: `scale(0.97)` antes de navigate |
| 3 | Staging | Foco visual no elemento ativo | Backdrop dim + elemento focado |
| 4 | Straight Ahead / Pose to Pose | Keyframes definidos vs. physics | Keyframes para sequências, spring para interação |
| 5 | Follow Through | Elementos continuam levemente após parar | Spring com `damping: 15-25` (pequeno overshoot) |
| 6 | Slow In / Slow Out | Easing curves | `ease-out` para entrada, `ease-in` para saída |
| 7 | Arcs | Movimento em curva, não linear | `motion-path` para trajectórias orgânicas |
| 8 | Secondary Action | Elementos secundários reagem ao primário | Badge shake quando cart recebe item |
| 9 | Timing | Duração proporcional ao propósito | Ver tabela seção 3 |
| 10 | Exaggeration | Ênfase sutil para comunicar estado | Error shake 10px (não 50px) |
| 11 | Solid Drawing | Consistência 3D (em web: consistência de profundidade) | Z-index + shadow consistentes |
| 12 | Appeal | Personalidade e polish | Spring physics ao invés de linear |

## 3. Timing

### 3.1 Tabela de Referência

| Categoria | Duração | Uso | Exemplo |
|---|---|---|---|
| Instantâneo | 0-50ms | Feedback tátil | Color change on tap |
| Micro | 50-120ms | State changes mínimos | Checkbox toggle, icon swap |
| Rápido | 120-220ms | **Sweet spot** — maioria das interações | Hover, focus, dropdown open |
| Médio | 220-400ms | Transições de layout | Modal enter, card expand |
| Lento | 400-700ms | Transições complexas | Page transition, hero animation |
| Dramático | 700-1200ms | Entrada de página, first load | Landing hero sequence |

### 3.2 Stagger Timing

Quando múltiplos elementos entram em sequência:

```
Stagger delay: 50-100ms entre cada item
Máximo 5-8 items em stagger (depois, usar group fade)
Duração individual: 300-500ms
Total máximo: ~1200ms para toda a sequência
```

```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-100px' }}
  variants={{
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### 3.3 Regras de Timing

1. **Entrada > Saída:** Entradas são ~50% mais longas que saídas (enter 400ms, exit 250ms)
2. **Proporcional ao tamanho:** Elementos maiores precisam de mais tempo
3. **Mobile mais rápido:** Reduzir 20-30% em mobile (interações são mais rápidas)
4. **Máximo absoluto:** Nenhuma animação de UI deve exceder 1200ms
5. **400ms rule:** Se o usuário precisa esperar a animação para agir, ela é longa demais

## 4. Easing

### 4.1 Curvas CSS Padrão

| Easing | CSS | Quando Usar |
|---|---|---|
| ease-out | `cubic-bezier(0, 0, 0.2, 1)` | **Entrada** de elementos (decelera ao chegar) |
| ease-in | `cubic-bezier(0.4, 0, 1, 1)` | **Saída** de elementos (acelera ao sair) |
| ease-in-out | `cubic-bezier(0.4, 0, 0.2, 1)` | Transições de **estado** (A → B no mesmo lugar) |
| linear | `linear` | Animações **contínuas** (loading spinner, progress bar) |
| ease (browser default) | `cubic-bezier(0.25, 0.1, 0.25, 1)` | ❌ Evitar — pouco controle |

### 4.2 Spring Physics (Recomendado para Interações)

Spring simula física real — mais natural que curvas de Bézier para elementos interativos.

```tsx
// Framer Motion spring configs
const SPRING_CONFIGS = {
  snappy: { type: 'spring', stiffness: 500, damping: 30 },
  responsive: { type: 'spring', stiffness: 300, damping: 25 },
  gentle: { type: 'spring', stiffness: 150, damping: 20 },
  bouncy: { type: 'spring', stiffness: 400, damping: 15 },
} as const;
```

| Config | Stiffness | Damping | Comportamento | Uso |
|---|---|---|---|---|
| Snappy | 400-600 | 25-35 | Rápido, sem overshoot | Toggles, dropdowns |
| Responsive | 250-350 | 20-28 | Equilibrado | Modais, expansões |
| Gentle | 100-200 | 15-25 | Suave, leve overshoot | Page transitions |
| Bouncy | 300-500 | 10-18 | Bounce visível | Feedback divertido |

### 4.3 Quando Usar Spring vs. Easing

| Contexto | Método | Razão |
|---|---|---|
| Elementos interativos (drag, press) | Spring | Responde a velocidade do gesto |
| Hover/Focus states | CSS easing | Mais leve (sem JS) |
| Enter/Exit animations | Spring ou easing | Spring para elementos, easing para fade |
| Scroll-linked | CSS easing | Performance (compositor thread) |
| Loading/Progress | Linear | Continuidade constante |

## 5. Regra GPU-Only

### 5.1 Propriedades GPU-Accelerated

| Propriedade | GPU? | Custo | Usar? |
|---|---|---|---|
| `transform` (translate, scale, rotate) | ✅ | Muito baixo | ✅ Sempre |
| `opacity` | ✅ | Muito baixo | ✅ Sempre |
| `filter` (blur, brightness) | ✅ | Baixo | ✅ Com moderação |
| `backdrop-filter` | ✅ | Médio | ⚠️ Elementos estáticos |
| `clip-path` | ✅ | Baixo | ✅ Para reveals |
| `width` / `height` | ❌ | Alto (layout) | ❌ Nunca animar |
| `padding` / `margin` | ❌ | Alto (layout) | ❌ Nunca animar |
| `top` / `left` / `right` / `bottom` | ❌ | Alto (layout) | ❌ Usar transform |
| `border-radius` | ❌ | Médio (paint) | ⚠️ Evitar animar |
| `background-color` | ❌ | Médio (paint) | ⚠️ Evitar, preferir opacity |
| `box-shadow` | ❌ | Alto (paint) | ❌ Usar shadow estático + opacity |

### 5.2 Padrão: Shadow Animada via Opacity

```css
/* ❌ ERRADO: animar box-shadow diretamente */
.card:hover {
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  transition: box-shadow 0.3s;
}

/* ✅ CORRETO: shadow estática, animar opacity */
.card {
  position: relative;
}
.card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  opacity: 0;
  transition: opacity 0.3s ease-out;
  pointer-events: none;
}
.card:hover::after {
  opacity: 1;
}
```

### 5.3 will-change

```css
/* Usar APENAS quando há jank medido — não preventivamente */
.animating-element {
  will-change: transform, opacity;
}
```

**Regras:**
- Aplicar via classe durante a animação, remover depois
- Nunca aplicar em muitos elementos simultaneamente (consome memória GPU)
- `transform: translateZ(0)` como alternativa leve (força compositing layer)

## 6. Scroll Animations

### 6.1 Intersection Observer (Nativo)

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.2, rootMargin: '-80px', ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}
```

### 6.2 Framer Motion whileInView

```tsx
<motion.section
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
>
  <h2>Seção que aparece no scroll</h2>
</motion.section>
```

### 6.3 CSS Scroll-Driven Animations (2026)

```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.scroll-reveal {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

Suporte em abril 2026: ~85% (Chrome, Edge, Safari 18+, Firefox 125+).

## 7. Page Transitions

### 7.1 View Transitions API (Nativo)

```tsx
// Next.js App Router com View Transitions
import Link from 'next/link';

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        if (!document.startViewTransition) return;
        e.preventDefault();
        document.startViewTransition(() => {
          window.location.href = href;
        });
      }}
    >
      {children}
    </Link>
  );
}
```

### 7.2 Framer Motion AnimatePresence

```tsx
// app/template.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

## 8. Loading States

### 8.1 Hierarquia de Loading

| Tipo | Duração | Padrão Visual |
|---|---|---|
| Instant (< 100ms) | Imperceptível | Nenhum (não mostrar loading) |
| Fast (100-300ms) | Breve | Subtle pulse ou skeleton |
| Normal (300ms-1s) | Perceptível | Skeleton screen |
| Slow (1-5s) | Longo | Skeleton + mensagem/progress |
| Very slow (5s+) | Frustrante | Progress bar + estimativa de tempo |

### 8.2 Skeleton Screen

```tsx
export function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-surface-elevated p-6 animate-pulse">
      <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-3 h-3 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-2 h-3 w-5/6 rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-6 h-10 w-32 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
    </div>
  );
}
```

### 8.3 Shimmer Effect (Premium)

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    oklch(0.91 0.006 260) 25%,
    oklch(0.95 0.004 260) 50%,
    oklch(0.91 0.006 260) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

## 9. Acessibilidade de Motion

### 9.1 prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 9.2 Framer Motion Reduced Motion

```tsx
import { useReducedMotion } from 'framer-motion';

export function AnimatedCard({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
```

### 9.3 O que Reduzir vs. Eliminar

| Tipo de Motion | Reduced Motion | Razão |
|---|---|---|
| Parallax | Eliminar | Causa náusea vestibular |
| Auto-playing video/animation | Pausar | Distração, trigger de enxaqueca |
| Page transitions | Fade simples (200ms) | Manter orientação |
| Scroll animations | Mostrar sem animação | Conteúdo deve ser acessível |
| Hover micro-interactions | Manter, reduzir amplitude | São feedback útil |
| Loading spinners | Manter | Feedback funcional |
| Carousels auto-play | Pausar, controle manual | Acessibilidade geral |

### 9.4 Dados

- 35% dos adultos experimentam motion sensitivity em algum grau (Vestibular Disorders Association 2024)
- iOS motion sensitivity toggle usado por ~7% dos usuários (Apple Analytics 2025)
- WCAG 2.2 Critério 2.3.3: Animação de interação pode ser desativada (AA)

## 10. Checklist de Motion

- [ ] Toda animação serve a propósito (feedback, orientação, hierarquia)?
- [ ] Micro-interações no range 120-220ms?
- [ ] Entradas 300-600ms, saídas 200-400ms?
- [ ] Apenas transform + opacity animados (GPU-only)?
- [ ] Spring physics para elementos interativos?
- [ ] `prefers-reduced-motion` respeitado?
- [ ] Stagger máximo de 5-8 items por grupo?
- [ ] Nenhuma animação > 1200ms?
- [ ] Skeleton screens para loading > 300ms?
- [ ] Testado em dispositivos low-end?
