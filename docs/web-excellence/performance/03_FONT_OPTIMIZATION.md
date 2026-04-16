---
id: doc-font-optimization
title: Guia Completo de Otimização de Fontes
version: 2.0
last_updated: 2026-04-07
category: performance
priority: important
related:
  - docs/web-excellence/performance/01_CORE_WEB_VITALS.md
  - docs/web-excellence/performance/04_LOADING_STRATEGY.md
  - .cursor/rules/design/typography.mdc
---

# Guia Completo de Otimização de Fontes

## Visão Geral

Fontes web são responsáveis por **CLS (layout shifts)** e impactam **LCP** quando são render-blocking. Uma fonte Google Fonts típica tem ~1MB antes de subsetting — após subsetting para Latin, reduz para **~30KB (97% de redução)**. `next/font` automatiza a maioria das otimizações, mas entender os fundamentos é crítico para decisões de design.

---

## 1. font-display Values

### 1.1 Comparação

| Valor | Comportamento | CLS | FOIT | FOUT | Quando Usar |
|-------|--------------|-----|------|------|-------------|
| `swap` | Fallback imediato, troca quando carrega | 🟡 Médio | ❌ Nenhum | ✅ Sim | **Default recomendado** — texto sempre visível |
| `optional` | Fallback imediato, usa fonte apenas se já em cache | ✅ Mínimo | ❌ Nenhum | 🟡 Sutil | Performance máxima, aceita inconsistência |
| `fallback` | 100ms invisível, depois fallback, troca se carrega em 3s | 🟡 Médio | 🟡 100ms | ✅ Sim | Compromisso razoável |
| `block` | Invisível por até 3s, depois fallback | ❌ Alto | ✅ Até 3s | ❌ Nenhum | Quase nunca — texto invisível é ruim |
| `auto` | Depende do browser (geralmente `block`) | ❌ | ✅ | ❌ | Nunca usar explicitamente |

### 1.2 Recomendação por Contexto

| Contexto | font-display | Justificativa |
|----------|-------------|---------------|
| Body text | `swap` | Texto deve ser legível ASAP |
| Headlines (LCP) | `optional` | Evita CLS no elemento LCP |
| Ícones (font icon) | `block` | Ícones sem fonte = caracteres unicode visíveis |
| Fonte decorativa | `optional` | Nice-to-have, não essencial |

---

## 2. Preload de Fontes Críticas

### 2.1 Regra: Máximo 1-2 Fontes Preloaded

```html
<!-- Preload APENAS a variante mais usada -->
<link
  rel="preload"
  href="/fonts/inter-var-latin.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
```

### 2.2 Com next/font (Recomendado)

```tsx
// app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

**O que `next/font` faz automaticamente:**
- Self-hosting (sem request para Google Fonts)
- Subsetting automático
- Preload automático
- CSS variables para uso com Tailwind
- Zero layout shift com `size-adjust`

---

## 3. Subsetting

### 3.1 Impacto do Subsetting

| Estado | Tamanho | Caracteres |
|--------|---------|------------|
| Fonte completa (todos scripts) | ~1 MB | ~60.000 glyphs |
| Latin + Latin Extended | ~50 KB | ~600 glyphs |
| **Latin only** | **~30 KB** | **~300 glyphs** |
| Custom subset (só usado) | ~15-20 KB | Apenas necessários |

### 3.2 Subsets para Português Brasileiro

```tsx
const inter = Inter({
  subsets: ['latin'],
  // Latin inclui: A-Z, a-z, 0-9, acentos básicos (á, é, ç, ã, õ, etc.)
  // Suficiente para 99.9% do conteúdo em PT-BR
})
```

### 3.3 Subset Manual com fonttools

```bash
# Instalar
pip install fonttools brotli

# Subset para Latin + caracteres PT-BR
pyftsubset Inter.ttf \
  --output-file=Inter-latin.woff2 \
  --flavor=woff2 \
  --layout-features='kern,liga,calt' \
  --unicodes='U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0300-0301,U+0303,U+0327,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'
```

---

## 4. Variable Fonts

### 4.1 Vantagens

| Aspecto | Fontes Estáticas | Variable Font |
|---------|-----------------|---------------|
| Arquivo para 4 pesos | 4 × ~30KB = ~120KB | 1 × ~50KB |
| Flexibilidade | Regular, Medium, SemiBold, Bold | Qualquer peso de 100-900 |
| Pesos customizados | Impossível | font-weight: 450, 550, etc. |
| Transições animadas | Troca abrupta | Smooth transitions |

### 4.2 Uso em CSS

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-display: swap;
}

/* Usar pesos customizados */
.heading { font-weight: 750; }
.body { font-weight: 400; }
.caption { font-weight: 350; }
```

---

## 5. Metric Override (Fallback Font Matching)

### 5.1 O Problema

Quando a web font carrega e substitui o fallback, o tamanho diferente causa CLS (FOUT — Flash of Unstyled Text).

### 5.2 A Solução: size-adjust + ascent/descent override

```css
/* Fallback que imita as métricas da Inter */
@font-face {
  font-family: 'Inter Fallback';
  src: local('Arial');
  size-adjust: 107%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}

body {
  font-family: 'Inter', 'Inter Fallback', system-ui, sans-serif;
}
```

### 5.3 next/font faz isso automaticamente

```tsx
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: true,
})
```

### 5.4 Ferramentas para Calcular Overrides

| Ferramenta | URL | Método |
|-----------|------|--------|
| fontaine | npm package | Automático via PostCSS |
| Font Style Matcher | meowni.ca/font-style-matcher | Visual comparação |
| next/font | built-in | Automático |

---

## 6. Máximo 2 Famílias de Fonte

### 6.1 Regra

| Quantidade | Uso | Performance |
|-----------|-----|-------------|
| 1 família | Ideal (suficiente para 90% dos sites) | Melhor |
| **2 famílias** | **Sans + Mono (ou Sans + Serif)** | **Bom** |
| 3+ famílias | Raramente justificável | Impacto negativo |

### 6.2 Stack Recomendado

```tsx
// Opção 1: Uma família (melhor performance)
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

// Opção 2: Sans + Mono (recomendado para dev tools / SaaS técnico)
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

// tailwind.config — Tailwind v4 usa CSS variables
// @theme { --font-sans: var(--font-sans); --font-mono: var(--font-mono); }
```

---

## 7. Performance Budget para Fontes

### 7.1 Budget

| Recurso | Budget | Justificativa |
|---------|--------|---------------|
| Total de fontes | < 100 KB | Não deve exceder 10% do page weight |
| Por arquivo de fonte | < 50 KB | Após subsetting |
| Número de arquivos | ≤ 2-3 | Menos requests |
| Preloaded fonts | ≤ 2 | Não bloquear outros recursos |
| Font loading time | < 500ms | Não impactar LCP |

### 7.2 Monitoramento

```bash
# Verificar tamanho das fontes servidas
curl -sI "https://meusite.com/fonts/inter-var.woff2" | grep content-length
```

---

## 8. System Font Stack (Alternativa Zero-Cost)

### 8.1 Quando Usar

Se performance é prioridade absoluta e design permite:

```css
font-family: system-ui, -apple-system, BlinkMacSystemFont,
  'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

| Plataforma | Fonte Exibida |
|-----------|--------------|
| macOS/iOS | San Francisco |
| Windows | Segoe UI |
| Android | Roboto |
| Linux | Cantarell / Liberation Sans |

**Vantagem:** Zero bytes de fonte transferidos, zero CLS de fonts, LCP ótimo.

**Desvantagem:** Design menos consistente entre plataformas, sem controle tipográfico fino.

---

## 9. Checklist de Otimização de Fontes

| # | Item | Prioridade |
|---|------|-----------|
| 1 | Usar `next/font` para self-hosting automático | 🔴 Crítico |
| 2 | `display: 'swap'` como default | 🔴 Crítico |
| 3 | Subset para `latin` (PT-BR incluso) | 🔴 Crítico |
| 4 | Máximo 2 famílias de fonte | 🟡 Alto |
| 5 | Variable fonts em vez de múltiplos arquivos estáticos | 🟡 Alto |
| 6 | Preload apenas 1-2 fontes críticas | 🟡 Alto |
| 7 | Fallback font matching (`adjustFontFallback: true`) | 🟡 Alto |
| 8 | Formato woff2 exclusivamente | 🟢 Médio |
| 9 | Total de fontes < 100KB | 🟢 Médio |
| 10 | Testar CLS de font swap no PageSpeed Insights | 🟢 Médio |

---

## Fontes e Referências

- Google Fonts — Performance Best Practices 2025
- web.dev — Optimize Web Fonts Guide
- Next.js Documentation — Font Optimization
- Barry Pollard — Font Performance (web.dev, 2025)
- HTTP Archive — Font Usage Report 2025
- fontaine — npm package for font metric overrides
