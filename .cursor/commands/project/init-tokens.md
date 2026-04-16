---
id: cmd-init-tokens
title: Gerar Design Tokens
version: 2.0
last_updated: 2026-04-07
category: project
agent: 02-designer
skills:
  - build-design-tokens
  - build-typography-scale
  - build-color-system
  - build-spacing-grid
---

# `/init-tokens [paleta] [mood]`

Gera o sistema completo de design tokens em OKLCH: paleta de cores com 11 shades × 6 cores semânticas, tipografia fluida com `clamp()`, escala de espaçamento, e configuração de dark mode. Tudo via CSS-first com `@theme` do Tailwind CSS v4.

---

## Parâmetros

| Parâmetro | Obrigatório | Valores Aceitos | Descrição |
|-----------|-------------|-----------------|-----------|
| `paleta` | ✅ Sim | `warm` · `cool` · `neutral` · `vibrant` · `earth` · `ocean` · `sunset` · `forest` | Família cromática base que define matizes e saturação |
| `mood` | ❌ Não | `luxury` · `playful` · `corporate` · `minimal` · `bold` · `elegant` · `tech` | Ajuste de personalidade que modifica saturação, contraste e pesos tipográficos |

---

## Mapeamento de Paletas → Matizes OKLCH

| Paleta | Hue Primário | Hue Secundário | Hue Accent | Saturação Base | Descrição |
|--------|-------------|----------------|------------|----------------|-----------|
| `warm` | 25–40 (laranja/âmbar) | 15–20 (vermelho morno) | 50–60 (dourado) | 0.15–0.20 | Tons acolhedores, café, artesanal |
| `cool` | 230–260 (azul) | 200–220 (azul-verde) | 270–290 (violeta) | 0.12–0.18 | Tons profissionais, tecnológicos |
| `neutral` | 80–100 (amarelo-verde neutro) | 250–270 (cinza-azulado) | 40–60 (âmbar sutil) | 0.04–0.08 | Tons sofisticados, minimalistas |
| `vibrant` | 310–340 (magenta/rosa) | 150–180 (ciano/verde) | 50–80 (amarelo vivo) | 0.22–0.30 | Tons energéticos, chamativos |
| `earth` | 50–70 (amarelo terra) | 130–150 (verde oliva) | 20–35 (terracota) | 0.10–0.16 | Tons naturais, orgânicos |
| `ocean` | 200–230 (azul oceano) | 170–190 (verde água) | 250–270 (azul profundo) | 0.14–0.20 | Tons calmos, fluidos |
| `sunset` | 15–30 (coral/salmão) | 40–60 (dourado) | 340–360 (rosa) | 0.18–0.24 | Tons vibrantes e quentes |
| `forest` | 140–165 (verde floresta) | 90–110 (verde limão) | 170–190 (teal) | 0.12–0.18 | Tons naturais, profundos |

## Ajustes de Mood

| Mood | Saturação | Contraste (L-bg/L-fg) | Peso Heading | Peso Body | Radius | Fontes Recomendadas |
|------|-----------|------------------------|--------------|-----------|--------|---------------------|
| `luxury` | -20% | Alto (0.98/0.12) | 300–400 (light) | 300 | 0px | Serifadas: Playfair Display, Cormorant |
| `playful` | +15% | Médio (0.96/0.18) | 700–800 | 400 | 16px | Arredondadas: Nunito, Quicksand |
| `corporate` | -10% | Alto (0.98/0.14) | 600–700 | 400 | 6px | Sólidas: Inter, Source Sans 3 |
| `minimal` | -30% | Médio-alto (0.97/0.15) | 500–600 | 300 | 4px | Geométricas: DM Sans, Outfit |
| `bold` | +25% | Máximo (0.99/0.08) | 800–900 | 400 | 8px | Impactantes: Space Grotesk, Syne |
| `elegant` | -15% | Alto (0.97/0.12) | 300–400 (light) | 300 | 0px | Clássicas: Source Serif 4, Lora |
| `tech` | Base (sem ajuste) | Alto (0.98/0.10) | 600–700 | 400 | 8px | Mono-mix: JetBrains Mono + Inter |

---

## Passo a Passo de Execução

### Passo 1 — Gerar paleta OKLCH base

A partir do `[paleta]`, gerar 11 shades (50–950) para cada cor semântica usando a fórmula:

```
Lightness:  50=0.98  100=0.95  200=0.88  300=0.78  400=0.68  500=0.58  600=0.50  700=0.42  800=0.34  900=0.27  950=0.18
Chroma:     50=C×0.1 100=C×0.2 200=C×0.4 300=C×0.6 400=C×0.85 500=C×1.0 600=C×0.9 700=C×0.75 800=C×0.55 900=C×0.4 950=C×0.25
```

Onde `C` = saturação base da paleta selecionada.

Exemplo para `warm` (hue 30, C=0.18):
```css
--color-primary-50:  oklch(0.98 0.018 30);
--color-primary-100: oklch(0.95 0.036 30);
--color-primary-200: oklch(0.88 0.072 30);
--color-primary-300: oklch(0.78 0.108 30);
--color-primary-400: oklch(0.68 0.153 30);
--color-primary-500: oklch(0.58 0.180 30);
--color-primary-600: oklch(0.50 0.162 30);
--color-primary-700: oklch(0.42 0.135 30);
--color-primary-800: oklch(0.34 0.099 30);
--color-primary-900: oklch(0.27 0.072 30);
--color-primary-950: oklch(0.18 0.045 30);
```

Repetir para: `primary` (hue primário), `secondary` (hue secundário), `accent` (hue accent), `destructive` (hue 25, vermelho), `success` (hue 145, verde), `warning` (hue 85, amarelo).

### Passo 2 — Aplicar ajustes de mood

Se `[mood]` fornecido, aplicar modificadores da tabela:

1. **Saturação**: multiplicar chroma de todas as shades pelo fator do mood
2. **Contraste**: ajustar lightness do background e foreground
3. **Radius**: definir escala de border-radius
4. **Pesos**: configurar font-weight para headings e body

Exemplo `luxury`:
- Reduzir chroma em 20% → `C × 0.80`
- Background: `oklch(0.98 0.005 hue)` (branco creme)
- Foreground: `oklch(0.12 0.01 hue)` (preto profundo)
- Radius: 0px em todos os níveis

### Passo 3 — Criar `src/app/globals.css`

```css
@import "tailwindcss";

@theme {
  /* ═══════════════════════════════════════════
     CORES — Sistema OKLCH ([paleta] + [mood])
     ═══════════════════════════════════════════ */

  --color-background: oklch(0.98 0.01 80);
  --color-foreground: oklch(0.12 0.02 80);
  --color-muted: oklch(0.94 0.02 80);
  --color-muted-foreground: oklch(0.45 0.03 80);
  --color-border: oklch(0.88 0.02 80);
  --color-ring: oklch(0.58 0.18 30);

  /* Primary — Hue do [paleta] */
  --color-primary-50:  oklch(0.98 0.02 30);
  --color-primary-100: oklch(0.95 0.04 30);
  --color-primary-200: oklch(0.88 0.08 30);
  --color-primary-300: oklch(0.78 0.12 30);
  --color-primary-400: oklch(0.68 0.16 30);
  --color-primary-500: oklch(0.58 0.18 30);
  --color-primary-600: oklch(0.50 0.16 30);
  --color-primary-700: oklch(0.42 0.14 30);
  --color-primary-800: oklch(0.34 0.10 30);
  --color-primary-900: oklch(0.27 0.08 30);
  --color-primary-950: oklch(0.18 0.05 30);

  /* Secondary — Hue secundário do [paleta] */
  /* Accent — Hue accent do [paleta] */
  /* Destructive — Hue 25 (vermelho) */
  /* Success — Hue 145 (verde) */
  /* Warning — Hue 85 (amarelo) */
  /* (gerar todas as 11 shades para cada) */

  /* ═══════════════════════════════════════════
     TIPOGRAFIA — Escala Fluida com clamp()
     ═══════════════════════════════════════════ */

  --font-sans: "Inter Variable", "Inter", system-ui, sans-serif;
  --font-heading: "Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif;
  --font-mono: "JetBrains Mono Variable", "JetBrains Mono", monospace;

  --text-xs:   clamp(0.6875rem, 0.65rem + 0.1vw, 0.75rem);
  --text-sm:   clamp(0.8125rem, 0.77rem + 0.15vw, 0.875rem);
  --text-base: clamp(0.9375rem, 0.88rem + 0.2vw, 1rem);
  --text-lg:   clamp(1.0625rem, 0.98rem + 0.3vw, 1.125rem);
  --text-xl:   clamp(1.1875rem, 1.05rem + 0.5vw, 1.25rem);
  --text-2xl:  clamp(1.4375rem, 1.2rem + 0.8vw, 1.5rem);
  --text-3xl:  clamp(1.75rem, 1.4rem + 1.2vw, 1.875rem);
  --text-4xl:  clamp(2.125rem, 1.6rem + 1.8vw, 2.25rem);
  --text-5xl:  clamp(2.75rem, 2rem + 2.5vw, 3rem);
  --text-6xl:  clamp(3.25rem, 2.2rem + 3.5vw, 3.75rem);
  --text-7xl:  clamp(3.75rem, 2.5rem + 4.5vw, 4.5rem);

  /* ═══════════════════════════════════════════
     ESPAÇAMENTO — Escala Consistente
     ═══════════════════════════════════════════ */

  --spacing-section: clamp(4rem, 3rem + 4vw, 7rem);
  --spacing-container: clamp(1rem, 0.5rem + 2vw, 2rem);

  /* ═══════════════════════════════════════════
     RADIUS — Definido pelo [mood]
     ═══════════════════════════════════════════ */

  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;

  /* ═══════════════════════════════════════════
     SOMBRAS — Profundidade Sutil
     ═══════════════════════════════════════════ */

  --shadow-xs: 0 1px 2px oklch(0.2 0.01 80 / 0.05);
  --shadow-sm: 0 1px 3px oklch(0.2 0.01 80 / 0.08), 0 1px 2px oklch(0.2 0.01 80 / 0.04);
  --shadow-md: 0 4px 6px oklch(0.2 0.01 80 / 0.07), 0 2px 4px oklch(0.2 0.01 80 / 0.04);
  --shadow-lg: 0 10px 15px oklch(0.2 0.01 80 / 0.08), 0 4px 6px oklch(0.2 0.01 80 / 0.03);
  --shadow-xl: 0 20px 25px oklch(0.2 0.01 80 / 0.10), 0 8px 10px oklch(0.2 0.01 80 / 0.04);

  /* ═══════════════════════════════════════════
     ANIMAÇÕES
     ═══════════════════════════════════════════ */

  --ease-spring: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
}

/* ═══════════════════════════════════════════
   DARK MODE
   ═══════════════════════════════════════════ */

@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: oklch(0.14 0.02 80);
    --color-foreground: oklch(0.94 0.01 80);
    --color-muted: oklch(0.20 0.02 80);
    --color-muted-foreground: oklch(0.60 0.03 80);
    --color-border: oklch(0.26 0.02 80);

    --shadow-xs: 0 1px 2px oklch(0 0 0 / 0.2);
    --shadow-sm: 0 1px 3px oklch(0 0 0 / 0.3), 0 1px 2px oklch(0 0 0 / 0.2);
    --shadow-md: 0 4px 6px oklch(0 0 0 / 0.3), 0 2px 4px oklch(0 0 0 / 0.2);
    --shadow-lg: 0 10px 15px oklch(0 0 0 / 0.35), 0 4px 6px oklch(0 0 0 / 0.2);
    --shadow-xl: 0 20px 25px oklch(0 0 0 / 0.4), 0 8px 10px oklch(0 0 0 / 0.25);
  }
}

/* ═══════════════════════════════════════════
   RESET & BASE
   ═══════════════════════════════════════════ */

@layer base {
  * {
    border-color: var(--color-border);
  }

  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  ::selection {
    background-color: oklch(from var(--color-primary-500) l c h / 0.3);
    color: var(--color-foreground);
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

### Passo 4 — Configurar fontes em `src/lib/fonts.ts`

Selecionar fontes com base no `[mood]` e tabela de recomendações:
```typescript
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const fontHeading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
```

### Passo 5 — Verificar contraste WCAG

Validar que todas as combinações de cor atendem WCAG 2.2 AA:
- Texto normal: ratio ≥ 4.5:1
- Texto grande (≥18px bold ou ≥24px): ratio ≥ 3:1
- Elementos UI interativos: ratio ≥ 3:1

---

## Saída Esperada

```
✅ Design tokens gerados — paleta [paleta] + mood [mood]
├── Paleta OKLCH com 11 shades × 6 cores semânticas (66 variáveis)
├── Tipografia fluida com clamp() (11 tamanhos responsivos)
├── Escala de espaçamento geométrica
├── Sistema de sombras adaptativas
├── Border-radius conforme mood
├── Dark mode com inversão perceptual
├── Fontes configuradas em src/lib/fonts.ts
├── Contraste WCAG 2.2 AA verificado
├── globals.css completo com @theme
└── Pronto para /init-seo [dominio] [nome-empresa]
```

---

## Exemplo de Uso

```
/init-tokens warm luxury
/init-tokens cool tech
/init-tokens vibrant playful
/init-tokens earth minimal
/init-tokens ocean
/init-tokens sunset bold
/init-tokens forest elegant
/init-tokens neutral corporate
```
