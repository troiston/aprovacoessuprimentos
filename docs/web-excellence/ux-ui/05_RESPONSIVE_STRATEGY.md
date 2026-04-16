---
id: doc-responsive-strategy
title: Estratégia Responsiva
version: 2.0
last_updated: 2026-04-07
category: ux-ui
priority: critical
related:
  - docs/web-excellence/foundations/02_TYPOGRAPHY.md
  - docs/web-excellence/foundations/04_SPACING_GRID.md
  - docs/web-excellence/ux-ui/04_ACCESSIBILITY_GUIDE.md
  - docs/web-excellence/seo/03_SEO_PERFORMANCE.md
  - .cursor/rules/design/responsive.mdc
---

# Estratégia Responsiva

## 1. Mobile-First Methodology

### 1.1 Por que Mobile-First

- **62.5% do tráfego web** global é mobile (StatCounter Q1 2026)
- **Google Mobile-First Indexing:** 100% dos sites desde 2023 — a versão mobile é a que o Google indexa
- **Performance por default:** Começar pelo mínimo e adicionar, nunca pelo máximo e remover
- **Content priority:** Mobile força decisões de hierarquia que beneficiam todas as viewports
- **Progressive Enhancement:** Base funcional para todos, enhancements para telas maiores

### 1.2 Fluxo de Desenvolvimento

```
1. Design para 320px (mínimo absoluto)
2. Testar em 375px (iPhone SE/standard)
3. Adicionar breakpoint sm (640px) — ajustes de layout
4. Adicionar breakpoint md (768px) — tablets, 2 colunas
5. Adicionar breakpoint lg (1024px) — laptops, layout completo
6. Adicionar breakpoint xl (1280px) — desktops, espaçamento generoso
7. Adicionar breakpoint 2xl (1536px) — wide screens, max-width container
```

### 1.3 CSS Mobile-First

```css
/* Base: mobile (< 640px) */
.grid { grid-template-columns: 1fr; }

/* sm: 640px+ */
@media (min-width: 640px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* lg: 1024px+ */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

Tailwind (mobile-first por padrão):
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
```

## 2. Breakpoints

### 2.1 Sistema de Breakpoints

| Token | Valor | Dispositivos Típicos | Colunas |
|---|---|---|---|
| (base) | 0-639px | Smartphones | 4 |
| `sm` | ≥ 640px | Smartphones grandes, landscape | 8 |
| `md` | ≥ 768px | Tablets portrait | 8 |
| `lg` | ≥ 1024px | Tablets landscape, laptops | 12 |
| `xl` | ≥ 1280px | Desktops | 12 |
| `2xl` | ≥ 1536px | Wide screens | 12 |

### 2.2 Distribuição Real de Viewports (2026)

| Range | % Global | Nota |
|---|---|---|
| 320-479px | 28% | iPhone SE, Android entry-level |
| 480-767px | 22% | Smartphones premium landscape |
| 768-1023px | 12% | iPads, tablets Android |
| 1024-1439px | 21% | Laptops, monitores padrão |
| 1440px+ | 17% | Desktops, ultrawides |

### 2.3 Viewport Crítico: 320px

320px é o mínimo absoluto que deve funcionar sem scroll horizontal. Dispositivos reais em 320px em 2026:
- iPhone SE (3ª geração)
- Dispositivos Android entry-level
- Sidebar do Galaxy Fold (quando multitask)

Teste obrigatório: `@media (min-width: 320px)` — tudo deve caber.

## 3. Container Queries vs. Viewport Queries

### 3.1 Viewport Queries (Tradicionais)

```css
/* Responde ao tamanho do VIEWPORT */
@media (min-width: 768px) {
  .card { flex-direction: row; }
}
```

**Problema:** Um card em uma sidebar de 300px recebe o estilo de "desktop" mesmo sendo estreito.

### 3.2 Container Queries (Modernas)

```css
/* Responde ao tamanho do CONTAINER PAI */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card { flex-direction: row; }
}

@container card (max-width: 399px) {
  .card { flex-direction: column; }
}
```

Suporte em abril 2026: **93.5%** (Can I Use).

### 3.3 Tailwind v4 Container Queries

```tsx
<div className="@container">
  <div className="flex flex-col @md:flex-row @lg:gap-8">
    <img className="w-full @md:w-1/3" />
    <div className="flex-1">
      <h3 className="text-lg @lg:text-xl">Título</h3>
    </div>
  </div>
</div>
```

### 3.4 Quando Usar Qual

| Cenário | Método | Razão |
|---|---|---|
| Layout de página (grid principal) | Viewport query | Depende da janela |
| Componente reutilizável | Container query | Adapta-se ao contexto |
| Tipografia fluid | Viewport (`clamp(vw)`) | Escala com janela |
| Card em sidebar vs. main | Container query | Mesmo componente, contextos diferentes |
| Navegação responsive | Viewport query | Decisão global (hamburger vs. full) |
| Media queries para imagens | Viewport query (`<picture>`) | Art direction depende da janela |

## 4. Tipografia Fluida

Documentação completa em `docs/foundations/02_TYPOGRAPHY.md`. Resumo:

```css
/* Sem media queries — escala contínua */
font-size: clamp(1rem, 0.95rem + 0.24vw, 1.125rem);
```

Garante que texto nunca é pequeno demais em mobile nem grande demais em desktop, sem breakpoints.

## 5. Espaçamento Fluido

Documentação completa em `docs/foundations/04_SPACING_GRID.md`. Resumo:

```css
/* Seções */
padding-block: clamp(3rem, 6vw, 6rem);

/* Padding lateral */
padding-inline: clamp(1rem, 5vw, 4rem);

/* Gaps */
gap: clamp(1rem, 2vw, 2rem);
```

## 6. Imagens Responsivas

### 6.1 srcset + sizes (Resolution Switching)

```tsx
<img
  src="/hero-800.webp"
  srcSet="/hero-400.webp 400w, /hero-800.webp 800w, /hero-1200.webp 1200w, /hero-1600.webp 1600w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
  alt="Descrição da imagem"
  width={1200}
  height={675}
  loading="lazy"
  decoding="async"
/>
```

### 6.2 Art Direction com `<picture>`

```tsx
<picture>
  {/* Mobile: imagem vertical/quadrada */}
  <source
    media="(max-width: 639px)"
    srcSet="/hero-mobile.webp"
    type="image/webp"
  />
  {/* Tablet: imagem 4:3 */}
  <source
    media="(max-width: 1023px)"
    srcSet="/hero-tablet.webp"
    type="image/webp"
  />
  {/* Desktop: imagem widescreen */}
  <source
    media="(min-width: 1024px)"
    srcSet="/hero-desktop.webp"
    type="image/webp"
  />
  {/* Fallback */}
  <img
    src="/hero-desktop.jpg"
    alt="Hero image"
    width={1920}
    height={1080}
    loading="eager"
  />
</picture>
```

### 6.3 Next.js Image Optimization

```tsx
import Image from 'next/image';

<Image
  src="/hero.webp"
  alt="Descrição"
  width={1200}
  height={675}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
  priority  // Above the fold = priority
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

`next/image` automaticamente:
- Gera srcset com múltiplos tamanhos
- Serve WebP/AVIF quando suportado
- Lazy loading por padrão
- Previne CLS com aspect-ratio

### 6.4 Dimensões Obrigatórias

**Sempre** definir `width` e `height` em `<img>` ou via CSS `aspect-ratio`. Sem dimensões:
- CLS alto (imagem empurra conteúdo ao carregar)
- Core Web Vitals penalizado

```css
/* Se não souber dimensão exata, pelo menos defina aspect-ratio */
img {
  aspect-ratio: 16/9;
  width: 100%;
  height: auto;
  object-fit: cover;
}
```

## 7. Navegação Responsiva

### 7.1 Padrões por Viewport

| Viewport | Padrão de Nav | Nota |
|---|---|---|
| < 768px (mobile) | Hamburger menu (off-canvas ou full-screen overlay) | Padrão esperado pelo usuário |
| 768-1023px (tablet) | Hamburger ou nav compacta (ícones + labels selecionados) | Depende da quantidade de items |
| ≥ 1024px (desktop) | Nav horizontal completa | Todos os links visíveis |

### 7.2 Mobile Navigation Best Practices

1. **Hamburger icon:** 3 linhas horizontais (universal em 2026)
2. **Posição:** Canto superior direito (padrão global)
3. **Overlay:** Full-screen com backdrop escuro
4. **Links grandes:** Mínimo 48px height, padding generoso
5. **Fechar:** X icon visível + tap no backdrop + swipe + Escape
6. **Animação:** Slide-in da direita (200-300ms, ease-out)
7. **Focus trap:** Foco preso no menu aberto
8. **CTA destacado:** Botão primário visível no menu

### 7.3 Implementação Base

```tsx
'use client';

import { useState, useEffect } from 'react';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <button
        className="lg:hidden p-2"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label="Abrir menu de navegação"
      >
        <Menu size={24} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <nav className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-surface p-6">
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Fechar menu"
              className="absolute top-4 right-4 p-2"
            >
              <X size={24} aria-hidden="true" />
            </button>
            {/* Nav links */}
          </nav>
        </div>
      )}
    </>
  );
}
```

## 8. Tabelas Responsivas

### 8.1 Estratégias

| Estratégia | Quando Usar | Implementação |
|---|---|---|
| Scroll horizontal | Tabela com muitas colunas | `overflow-x: auto` wrapper |
| Stack vertical | Tabela com poucas colunas | Cada row vira card em mobile |
| Priorização | Colunas com importância variada | Esconder colunas menos importantes em mobile |
| Card layout | Tabela de dados complexos | Cada row vira card completo |

### 8.2 Scroll Horizontal (Mais Simples)

```tsx
<div className="overflow-x-auto -mx-4 px-4">
  <table className="w-full min-w-[600px]">
    <thead>
      <tr>
        <th>Nome</th>
        <th>Email</th>
        <th>Status</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>{/* rows */}</tbody>
  </table>
</div>
```

### 8.3 Stack em Mobile

```tsx
<div className="space-y-4 md:hidden">
  {data.map(row => (
    <div key={row.id} className="rounded-xl bg-surface-elevated p-4 space-y-2">
      <div className="flex justify-between">
        <span className="font-medium">{row.name}</span>
        <StatusBadge status={row.status} />
      </div>
      <p className="text-sm text-text-secondary">{row.email}</p>
    </div>
  ))}
</div>

<table className="hidden md:table w-full">
  {/* Tabela normal para desktop */}
</table>
```

## 9. Touch vs. Pointer Optimization

### 9.1 Diferenças Fundamentais

| Aspecto | Touch (Mobile) | Pointer (Desktop) |
|---|---|---|
| Precisão | ~7mm (44px) | ~1px |
| Hover | ❌ Inexistente | ✅ Disponível |
| States | tap → active | hover → focus → active |
| Gestos | Swipe, pinch, long press | Click, double-click, drag |
| Target size | ≥ 48×48px | ≥ 24×24px |
| Espaçamento mínimo entre targets | 8px | 2px |

### 9.2 CSS pointer media queries

```css
/* Dispositivo com pointer preciso (mouse) */
@media (pointer: fine) {
  .button { min-height: 36px; }
  .menu-item { padding: 8px 12px; }
}

/* Dispositivo com pointer impreciso (touch) */
@media (pointer: coarse) {
  .button { min-height: 48px; }
  .menu-item { padding: 12px 16px; }
}

/* Hover disponível */
@media (hover: hover) {
  .card:hover { transform: translateY(-4px); }
}

/* Hover NÃO disponível */
@media (hover: none) {
  .card:hover { transform: none; }
}
```

### 9.3 Tailwind Touch Optimization

```tsx
{/* Touch-friendly: padding generoso, sem dependência de hover */}
<button className="
  min-h-[48px] px-6
  hover:bg-interactive-hover
  active:scale-[0.98]
  touch-manipulation
">
  Ação
</button>
```

`touch-manipulation` remove o delay de 300ms do tap em browsers mobile.

## 10. Dispositivos e Viewports de Teste

### 10.1 Dispositivos Prioritários (2026)

| Prioridade | Dispositivo | Viewport | DPR | Nota |
|---|---|---|---|---|
| P0 | iPhone 15/16 | 393×852 | 3x | iOS mainstream |
| P0 | Samsung Galaxy S24 | 360×780 | 3x | Android mainstream |
| P0 | Desktop 1920×1080 | 1920×1080 | 1x | Monitor padrão |
| P1 | iPhone SE 3 | 375×667 | 2x | Viewport mínimo iOS |
| P1 | iPad 10th gen | 820×1180 | 2x | Tablet mainstream |
| P1 | MacBook Pro 14" | 1512×982 | 2x | Laptop premium |
| P2 | Galaxy Fold 5 | 344×882 (fold) | 3x | Narrow viewport |
| P2 | Desktop 2560×1440 | 2560×1440 | 1x | Monitor grande |
| P2 | Desktop 3840×2160 | 3840×2160 | 2x | 4K |

### 10.2 Viewports de Teste Mínimos

```
320px  — Mínimo absoluto (sem horizontal scroll)
375px  — iPhone padrão
390px  — iPhone 15 padrão
768px  — iPad portrait
1024px — iPad landscape / laptop
1280px — Desktop padrão
1440px — Desktop wide
1920px — Full HD
```

### 10.3 Ferramentas de Teste

| Ferramenta | Tipo | Nota |
|---|---|---|
| Chrome DevTools Responsive | Emulação | Rápido, integrado |
| Firefox Responsive Design Mode | Emulação | Boa alternativa |
| BrowserStack | Dispositivos reais | Gold standard para QA |
| Playwright viewports | Testes automatizados | CI/CD |
| Device Lab físico | Hardware real | Toque real, performance real |

## 11. Checklist Responsivo

- [ ] Funciona em 320px sem scroll horizontal?
- [ ] Mobile-first CSS (min-width breakpoints)?
- [ ] Container queries para componentes reutilizáveis?
- [ ] Tipografia fluida com clamp()?
- [ ] Espaçamento fluido para seções?
- [ ] Imagens com srcset + sizes?
- [ ] `<picture>` para art direction quando necessário?
- [ ] width + height em todas as imagens?
- [ ] Navegação mobile com hamburger?
- [ ] Tabelas com estratégia responsiva?
- [ ] Touch targets ≥ 48×48px em mobile?
- [ ] Hover states têm fallback para touch?
- [ ] Testado nos 10 viewports prioritários?
- [ ] Performance testada em 3G throttling?
