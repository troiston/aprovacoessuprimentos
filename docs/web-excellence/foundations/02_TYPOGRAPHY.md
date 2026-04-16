---
id: doc-typography
title: Guia Completo de Tipografia
version: 2.0
last_updated: 2026-04-07
category: foundations
priority: critical
related:
  - docs/web-excellence/foundations/01_DESIGN_SYSTEM.md
  - docs/web-excellence/foundations/03_COLOR_SYSTEM.md
  - .cursor/rules/design/typography.mdc
  - .cursor/rules/quality/performance.mdc
---

# Guia Completo de Tipografia

## 1. Tipografia Fluida com clamp()

Tipografia fluida elimina media queries para `font-size`, usando `clamp()` para escalar suavemente entre viewports. A escala Major Third (1.25) produz hierarquia equilibrada entre autoridade e legibilidade.

### Fórmula de Cálculo

```
clamp(min, preferred, max)

preferred = min + (max - min) × ((100vw - minViewport) / (maxViewport - minViewport))

Simplificado para viewport 320px–1280px:
preferred = min + (max - min) × ((100vw - 20rem) / (80rem - 20rem))
```

### Escala Tipográfica Completa — Major Third (1.25)

| Nível   | Token             | Min (px) | Max (px) | clamp()                              | Uso                      |
|---------|-------------------|----------|----------|--------------------------------------|--------------------------|
| -2      | `--text-xs`       | 10       | 12       | `clamp(0.625rem, 0.583rem + 0.21vw, 0.75rem)`  | Captions, fine print     |
| -1      | `--text-sm`       | 12       | 14       | `clamp(0.75rem, 0.708rem + 0.21vw, 0.875rem)`  | Labels, metadata         |
| 0       | `--text-base`     | 15       | 16       | `clamp(0.938rem, 0.917rem + 0.1vw, 1rem)`      | Body text                |
| 1       | `--text-lg`       | 17       | 20       | `clamp(1.063rem, 1rem + 0.31vw, 1.25rem)`      | Lead paragraphs          |
| 2       | `--text-xl`       | 20       | 25       | `clamp(1.25rem, 1.146rem + 0.52vw, 1.563rem)`  | H5, card titles          |
| 3       | `--text-2xl`      | 24       | 31       | `clamp(1.5rem, 1.354rem + 0.73vw, 1.938rem)`   | H4, section headers      |
| 4       | `--text-3xl`      | 28       | 39       | `clamp(1.75rem, 1.521rem + 1.15vw, 2.438rem)`  | H3                       |
| 5       | `--text-4xl`      | 33       | 49       | `clamp(2.063rem, 1.729rem + 1.67vw, 3.063rem)` | H2                       |
| 6       | `--text-5xl`      | 39       | 61       | `clamp(2.438rem, 1.979rem + 2.29vw, 3.813rem)` | H1                       |
| 7       | `--text-6xl`      | 47       | 76       | `clamp(2.938rem, 2.333rem + 3.02vw, 4.75rem)`  | Display, hero            |

### Implementação CSS

```css
:root {
  --text-xs: clamp(0.625rem, 0.583rem + 0.21vw, 0.75rem);
  --text-sm: clamp(0.75rem, 0.708rem + 0.21vw, 0.875rem);
  --text-base: clamp(0.938rem, 0.917rem + 0.1vw, 1rem);
  --text-lg: clamp(1.063rem, 1rem + 0.31vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.146rem + 0.52vw, 1.563rem);
  --text-2xl: clamp(1.5rem, 1.354rem + 0.73vw, 1.938rem);
  --text-3xl: clamp(1.75rem, 1.521rem + 1.15vw, 2.438rem);
  --text-4xl: clamp(2.063rem, 1.729rem + 1.67vw, 3.063rem);
  --text-5xl: clamp(2.438rem, 1.979rem + 2.29vw, 3.813rem);
  --text-6xl: clamp(2.938rem, 2.333rem + 3.02vw, 4.75rem);
}
```

## 2. Line-Height (Altura de Linha)

Line-height afeta legibilidade, ritmo vertical e aparência de densidade.

| Contexto            | Valor    | Racional                                             |
|---------------------|----------|------------------------------------------------------|
| Display (6xl–5xl)   | 1.0–1.1  | Texto grande precisa de leading apertado             |
| Headings (4xl–2xl)  | 1.1–1.2  | Equilibrar compactação com legibilidade              |
| Subheadings (xl–lg) | 1.25–1.35| Transição entre heading e body                       |
| Body (base)         | 1.5–1.6  | Padrão WCAG para legibilidade contínua               |
| Small text (sm–xs)  | 1.5–1.7  | Texto pequeno precisa de mais ar para ser legível    |
| UI Labels           | 1.0–1.25 | Single-line, alinhamento preciso com ícones          |

### Implementação

```css
:root {
  --leading-none: 1;
  --leading-tight: 1.15;
  --leading-snug: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 1.75;
}

h1, .h1 { line-height: var(--leading-tight); }
h2, .h2 { line-height: var(--leading-tight); }
h3, .h3 { line-height: var(--leading-snug); }
h4, .h4 { line-height: var(--leading-snug); }
p, li, dd { line-height: var(--leading-normal); }
```

## 3. Letter-Spacing (Tracking)

| Tamanho de Texto | Tracking         | Valor       | Racional                          |
|------------------|------------------|-------------|-----------------------------------|
| Display (≥48px)  | Negativo forte   | -0.03em     | Compactar para coesão visual      |
| Headings (24–47px)| Negativo leve   | -0.02em     | Melhorar encaixe de caracteres    |
| Body (15–20px)   | Normal           | 0           | Padrão otimizado pelo type designer|
| Small (10–14px)  | Positivo leve    | +0.01em     | Abrir para legibilidade           |
| ALL CAPS         | Positivo forte   | +0.05–0.1em | Compensar percepção de densidade  |
| Monospace        | Normal           | 0           | Largura fixa já define spacing    |

```css
:root {
  --tracking-tighter: -0.03em;
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.01em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
}
```

## 4. Hierarquia de Font Weight

| Weight | Nome      | Token            | Uso                                     |
|--------|-----------|------------------|-----------------------------------------|
| 400    | Regular   | `--font-regular` | Body text, descrições, parágrafos       |
| 500    | Medium    | `--font-medium`  | Labels de UI, nav links, metadata emphasis|
| 600    | Semibold  | `--font-semibold`| Subheadings, botões, table headers      |
| 700    | Bold      | `--font-bold`    | Headings, títulos primários             |
| 800    | Extrabold | `--font-extrabold`| Display text, hero, marketing          |

**Regra:** Não usar mais de 3 weights por página. A combinação ideal para web é Regular + Semibold + Bold.

## 5. Medida (Measure) — Largura de Linha

A largura de linha ideal para leitura contínua é 45-75 caracteres (66ch considerado ótimo).

| Contexto         | Measure  | Racional                                    |
|------------------|----------|---------------------------------------------|
| Prosa/artigos    | 60–70ch  | Leitura sustentada confortável              |
| UI descriptions  | 45–55ch  | Texto de suporte, mais curto               |
| Captions         | 35–45ch  | Texto auxiliar, colunas estreitas          |
| Headings         | 20–35ch  | Forçar quebras em pontos naturais          |

```css
.prose { max-width: 65ch; }
.prose-narrow { max-width: 45ch; }
.prose-wide { max-width: 80ch; }
```

## 6. Estratégia de Carregamento de Fontes

### Prioridade: Performance + Estabilidade Visual (CLS)

#### 6.1 font-display

```css
@font-face {
  font-family: "Inter Variable";
  src: url("/fonts/inter-variable.woff2") format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap; /* Texto visível imediatamente, troca quando carregada */
}
```

| Valor     | Comportamento                | Recomendação                          |
|-----------|------------------------------|---------------------------------------|
| `swap`    | Fallback imediato, troca     | Body text — prioriza visibilidade     |
| `optional`| Usa fallback se não carregou | Fontes decorativas, não-críticas      |
| `fallback`| 100ms invisível, depois troca| Headings — compromisso               |

#### 6.2 Preload de Fontes Críticas

```html
<!-- No <head> — apenas o formato e subset mais críticos -->
<link
  rel="preload"
  href="/fonts/inter-variable-latin.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
```

Implementação no Next.js:

```tsx
// app/layout.tsx
import localFont from 'next/font/local'

const inter = localFont({
  src: './fonts/inter-variable-latin.woff2',
  variable: '--font-sans',
  display: 'swap',
  preload: true,
})

const jetbrainsMono = localFont({
  src: './fonts/jetbrains-mono-variable-latin.woff2',
  variable: '--font-mono',
  display: 'swap',
  preload: false, // secundária — não precarregar
})
```

#### 6.3 Subsetting

Reduzir o peso do arquivo carregando apenas os glifos necessários:

```bash
# Usando pyftsubset (fonttools)
pyftsubset InterVariable.ttf \
  --output-file=inter-variable-latin.woff2 \
  --flavor=woff2 \
  --layout-features="kern,liga,calt,ss01,ss02,cv01,cv05" \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
```

Resultado típico: Inter Variable 300KB → 85KB (subset latin + features essenciais).

#### 6.4 Metric Override para CLS Zero

```css
@font-face {
  font-family: "Inter Fallback";
  src: local("Arial");
  ascent-override: 90.49%;
  descent-override: 22.56%;
  line-gap-override: 0%;
  size-adjust: 107.06%;
}
```

O `size-adjust` e overrides de métricas fazem o fallback (Arial) ocupar o mesmo espaço que Inter, eliminando layout shift na troca.

Ferramenta: [Fontaine](https://github.com/unjs/fontaine) calcula automaticamente.

## 7. Fontes Variáveis — Vantagens

| Aspecto        | Fontes Estáticas          | Fontes Variáveis                |
|----------------|---------------------------|---------------------------------|
| Arquivos       | 1 por weight/style (6+)  | 1 arquivo para todos os eixos   |
| Tamanho total  | ~150-400KB                | ~85-150KB (com subset)          |
| Requests HTTP  | 6+                        | 1-2                             |
| Animação       | Impossível                | Transição suave entre weights   |
| Granularidade  | 400, 500, 600, 700...    | Qualquer valor 100-900          |
| Optical sizing | Não                       | Sim (opsz axis)                 |

```css
/* Animação de weight impossível com fontes estáticas */
.interactive-text {
  font-variation-settings: "wght" 400;
  transition: font-variation-settings 200ms ease-out;
}
.interactive-text:hover {
  font-variation-settings: "wght" 600;
}
```

## 8. Pareamento de Fontes

### Princípios de Pareamento

1. **Contraste suficiente** — Serif + Sans-serif, ou Geométrica + Humanista
2. **Proporções similares** — x-height compatível para alinhamento visual
3. **Máximo 2 famílias** — Mais que isso fragmenta a identidade visual
4. **Mesma época/escola** — Fontes de tradições tipográficas compatíveis

### Combinações Recomendadas (2026)

| Heading              | Body                 | Personalidade           |
|----------------------|----------------------|-------------------------|
| Inter                | Inter                | Neutro, técnico, SaaS   |
| Plus Jakarta Sans    | Inter                | Moderno, amigável       |
| Cabinet Grotesk      | Satoshi              | Bold, startup           |
| Fraunces (serif)     | Inter                | Editorial, sofisticado  |
| Space Grotesk        | DM Sans              | Tech, inovador          |
| Instrument Serif     | Instrument Sans      | Elegante, designer      |
| Geist                | Geist                | Minimalista, dev-first  |
| Bricolage Grotesque  | Source Sans 3        | Expressivo, editorial   |

### Implementação de Pareamento

```css
@theme {
  --font-heading: "Plus Jakarta Sans Variable", "Plus Jakarta Sans", system-ui, sans-serif;
  --font-body: "Inter Variable", "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", "JetBrains Mono", ui-monospace, monospace;
}
```

```tsx
<h1 className="font-heading text-5xl font-bold tracking-tighter">
  Título Principal
</h1>
<p className="font-body text-base leading-relaxed">
  Corpo do texto com leitura confortável.
</p>
```

## 9. Tipografia Responsável — Acessibilidade

- Tamanho mínimo de body: 15px (mobile), 16px (desktop)
- Nunca desativar zoom do usuário (`user-scalable=no` é proibido)
- Usar `rem` para font-size — respeita configuração do navegador
- Contraste mínimo: 4.5:1 para texto normal, 3:1 para texto grande (≥24px ou ≥18.66px bold)
- Espaçamento ajustável pelo usuário deve funcionar (WCAG 1.4.12):
  - Line-height até 1.5× o font-size
  - Spacing após parágrafos até 2× o font-size
  - Letter-spacing até 0.12× o font-size
  - Word-spacing até 0.16× o font-size
