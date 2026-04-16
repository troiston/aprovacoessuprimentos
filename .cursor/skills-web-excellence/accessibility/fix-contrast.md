---
id: skill-fix-contrast
title: "Fix Contrast"
agent: 06-qa-auditor
version: 1.0
category: accessibility
priority: important
requires:
  - skill: skill-audit-a11y
  - rule: 00-constitution
  - rule: design/tokens
provides:
  - todos os pares texto/fundo com contraste WCAG AA
  - contraste verificado em light e dark mode
  - uso de OKLCH para ajustes perceptuais
used_by:
  - agent: 06-qa-auditor
  - command: /audit-full
---

# Correção de Contraste

## Requisitos WCAG 2.2 AA

| Tipo de Texto | Ratio Mínimo | Tamanho |
|---|---|---|
| Texto normal | **4.5:1** | < 18pt (24px) |
| Texto grande | **3:1** | ≥ 18pt (24px) ou ≥ 14pt bold |
| Elementos UI (bordas, ícones) | **3:1** | — |
| Texto decorativo/logotipos | Sem requisito | — |
| Texto desabilitado | Sem requisito | — |

## Vantagem do OKLCH para Contraste

OKLCH separa Lightness (L), Chroma (C) e Hue (H). Para ajustar contraste, mude **apenas L** mantendo C e H constantes — a cor mantém a identidade visual:

```css
/* Ajuste de contraste mantendo a mesma cor */
--color-text-primary: oklch(0.20 0.02 260);     /* L=0.20, quase preto */
--color-text-secondary: oklch(0.40 0.02 260);   /* L=0.40, contraste 7:1+ */
--color-text-muted: oklch(0.45 0.015 260);      /* L=0.45, contraste 4.7:1 ✅ */
--color-text-placeholder: oklch(0.55 0.01 260); /* L=0.55, contraste 3.2:1 ❌ para texto normal */
```

### Mapa de Lightness para Contraste sobre Fundo Branco

```
L=0.20 → ratio ~15:1  (excelente)
L=0.30 → ratio ~9:1   (ótimo)
L=0.40 → ratio ~6:1   (bom para texto normal)
L=0.45 → ratio ~4.8:1 (mínimo AA para texto normal) ✅
L=0.50 → ratio ~3.8:1 (falha AA texto normal, ok texto grande)
L=0.55 → ratio ~3.1:1 (mínimo AA para texto grande) ✅
L=0.60 → ratio ~2.5:1 (falha em tudo)
L=0.65 → ratio ~2.0:1 (falha em tudo)
```

### Mapa de Lightness para Contraste sobre Fundo Escuro (dark mode)

```
Fundo dark: oklch(0.15 0.01 260) — quase preto

L=0.95 → ratio ~14:1  (excelente)
L=0.85 → ratio ~8:1   (ótimo)
L=0.75 → ratio ~5.5:1 (bom para texto normal)
L=0.70 → ratio ~4.5:1 (mínimo AA texto normal) ✅
L=0.65 → ratio ~3.5:1 (falha AA texto normal)
L=0.60 → ratio ~3.0:1 (mínimo AA texto grande) ✅
```

## Falhas Comuns e Correções

### 1. Texto Cinza Claro sobre Branco

```css
/* ❌ Falha — texto muted muito claro */
.text-muted {
  color: oklch(0.65 0 0); /* ratio ~2.0:1 */
}

/* ✅ Correção — escurecer L para 0.45 */
.text-muted {
  color: oklch(0.45 0.01 260); /* ratio ~4.8:1 */
}
```

### 2. Placeholder Text

```css
/* ❌ Placeholder padrão do browser — ratio insuficiente */
::placeholder {
  color: oklch(0.70 0 0); /* ratio ~1.6:1 */
}

/* ✅ Placeholder não precisa de 4.5:1 (é dica, não informação)
   Mas manter ao menos 3:1 para legibilidade */
::placeholder {
  color: oklch(0.55 0.005 260); /* ratio ~3.2:1 */
}
```

### 3. Botões com Cores de Marca

```css
/* ❌ Texto branco sobre primary claro */
.btn-primary {
  background: oklch(0.65 0.20 250); /* azul médio */
  color: oklch(1.0 0 0); /* branco — ratio 2.1:1 ❌ */
}

/* ✅ Escurecer o background */
.btn-primary {
  background: oklch(0.45 0.20 250); /* azul escuro */
  color: oklch(1.0 0 0); /* branco — ratio 6.2:1 ✅ */
}

/* ✅ Ou escurecer o texto */
.btn-primary {
  background: oklch(0.65 0.20 250);
  color: oklch(0.15 0.05 250); /* quase preto azulado — ratio 5.5:1 ✅ */
}
```

### 4. Links em Texto

```css
/* ❌ Link azul claro em texto preto — sem contraste suficiente com texto ao redor */
.link {
  color: oklch(0.60 0.20 250);
}

/* ✅ Link mais escuro + underline para distinguir do texto */
.link {
  color: oklch(0.40 0.18 250); /* ratio 6:1 com fundo branco ✅ */
  text-decoration: underline;
  text-underline-offset: 2px;
}
```

### 5. Estados Desabilitados

```tsx
// Elementos desabilitados NÃO precisam de contraste mínimo (WCAG exceção)
// Mas devem ser visualmente distintos

<button
  disabled
  aria-disabled="true"
  className="cursor-not-allowed opacity-40"
  // opacity 40% = visualmente diferente, sem requisito de contraste
>
  Salvar
</button>
```

### 6. Texto sobre Imagem

```tsx
// ❌ Texto direto sobre imagem — contraste imprevisível
<div className="relative">
  <Image src={hero} alt="" fill />
  <h1 className="text-white">Título</h1>
</div>

// ✅ Overlay escuro garantindo contraste
<div className="relative">
  <Image src={hero} alt="" fill className="object-cover" />
  <div className="absolute inset-0 bg-black/50" /> {/* overlay */}
  <h1 className="relative z-10 text-white">Título</h1>
</div>

// ✅ Alternativa: fundo sólido atrás do texto
<div className="relative">
  <Image src={hero} alt="" fill className="object-cover" />
  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
    <h1 className="text-white">Título</h1>
  </div>
</div>
```

## Ferramentas de Verificação

### oklch.org — Calculadora OKLCH

```
1. Acessar oklch.org
2. Inserir a cor do texto
3. Inserir a cor do fundo
4. Verificar o ratio calculado
5. Ajustar L até atingir 4.5:1 (ou 3:1 para texto grande)
```

### WebAIM Contrast Checker

```
1. Acessar webaim.org/resources/contrastchecker/
2. Converter OKLCH para hex (usar oklch.org)
3. Inserir foreground e background
4. Verificar AA e AAA compliance
```

### Verificação Automatizada com axe-core

```typescript
// e2e/contrast.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('verificar contraste em todas as páginas', async ({ page }) => {
  const routes = ['/', '/about', '/pricing', '/blog', '/contact']

  for (const route of routes) {
    await page.goto(route)

    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze()

    for (const violation of results.violations) {
      console.log(`\n❌ ${route}:`)
      for (const node of violation.nodes) {
        console.log(`  Element: ${node.target}`)
        console.log(`  ${node.failureSummary}`)
      }
    }

    expect(
      results.violations,
      `Contraste falhou em ${route}`
    ).toEqual([])
  }
})
```

### Script de Verificação em Massa dos Design Tokens

```typescript
// scripts/check-contrast.ts
type ColorPair = {
  name: string
  fg: string
  bg: string
  type: 'normal' | 'large' | 'ui'
}

const pairs: ColorPair[] = [
  { name: 'body text', fg: '--color-foreground', bg: '--color-background', type: 'normal' },
  { name: 'muted text', fg: '--color-muted-foreground', bg: '--color-background', type: 'normal' },
  { name: 'primary btn', fg: '--color-primary-foreground', bg: '--color-primary', type: 'large' },
  { name: 'card text', fg: '--color-card-foreground', bg: '--color-card', type: 'normal' },
  { name: 'link text', fg: '--color-primary', bg: '--color-background', type: 'normal' },
  { name: 'border', fg: '--color-border', bg: '--color-background', type: 'ui' },
]

const minRatios = { normal: 4.5, large: 3.0, ui: 3.0 }

// Usar uma lib como `wcag-contrast` para calcular
// npm install wcag-contrast

for (const pair of pairs) {
  const ratio = calculateContrast(pair.fg, pair.bg)
  const min = minRatios[pair.type]
  const pass = ratio >= min
  console.log(
    `${pass ? '✅' : '❌'} ${pair.name}: ${ratio.toFixed(1)}:1 (min: ${min}:1)`
  )
}
```

## Dark Mode — Verificação Dupla

Todos os pares de cores DEVEM ser verificados em ambos os modos:

```css
/* Light mode */
@theme {
  --color-foreground: oklch(0.15 0.01 260);   /* escuro sobre claro */
  --color-background: oklch(0.99 0 0);
  --color-muted-foreground: oklch(0.45 0.01 260); /* 4.8:1 ✅ */
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-foreground: oklch(0.95 0.01 260);   /* claro sobre escuro */
    --color-background: oklch(0.13 0.01 260);
    --color-muted-foreground: oklch(0.70 0.01 260); /* 4.6:1 ✅ */
  }
}
```

## Checklist

- [ ] Todos pares texto/fundo com ratio ≥ 4.5:1 (texto normal)
- [ ] Texto grande com ratio ≥ 3:1
- [ ] Elementos UI (bordas, ícones, focus ring) com ratio ≥ 3:1
- [ ] Contraste verificado em light mode
- [ ] Contraste verificado em dark mode
- [ ] Placeholder com ratio ≥ 3:1 (recomendado)
- [ ] Links distinguíveis do texto ao redor (cor + underline)
- [ ] Texto sobre imagem com overlay garantindo contraste
- [ ] axe-core `color-contrast` passando em todas as páginas
- [ ] Design tokens documentados com ratios calculados
