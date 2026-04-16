---
id: doc-color-system
title: Sistema de Cores OKLCH
version: 2.0
last_updated: 2026-04-07
category: foundations
priority: critical
related:
  - docs/web-excellence/foundations/01_DESIGN_SYSTEM.md
  - docs/web-excellence/ux-ui/04_ACCESSIBILITY_GUIDE.md
  - .cursor/rules/design/tokens.mdc
  - .cursor/rules/core/02-code-style.mdc
---

# Sistema de Cores OKLCH

## 1. Por Que OKLCH

### O Problema com HSL/Hex/RGB

Espaços de cor tradicionais (sRGB, HSL, HWB) não são perceptualmente uniformes. Isso significa que dois valores com a mesma "lightness" numérica podem parecer dramaticamente diferentes ao olho humano:

```css
/* HSL: mesma lightness (50%), percepção MUITO diferente */
.amarelo { background: hsl(60, 100%, 50%); }  /* Parece brilhante */
.azul    { background: hsl(240, 100%, 50%); }  /* Parece escuro */
```

### OKLCH Resolve

OKLCH (Oklab Lightness, Chroma, Hue) é um espaço de cor perceptualmente uniforme:

| Canal      | Range    | Significado                                  |
|------------|----------|----------------------------------------------|
| **L** (Lightness) | 0–1  | Brilho perceptual — 0.5 REALMENTE parece 50% |
| **C** (Chroma)    | 0–0.4| Saturação — 0 é cinza, 0.4 é máximo         |
| **H** (Hue)       | 0–360| Matiz no círculo cromático                    |

```css
oklch(L C H)
oklch(0.65 0.19 250)  /* azul médio vivido */
```

### Vantagens Concretas

1. **Uniformidade perceptual** — Variações de L produzem paletas visualmente consistentes
2. **Canais independentes** — Alterar L não muda saturação ou matiz percebidos
3. **WCAG simplificado** — Diferença de L correlaciona diretamente com contraste percebido
4. **Wide gamut** — Acesso a cores P3 e HDR (30% mais cores que sRGB)
5. **Interpolação superior** — Gradientes sem zonas cinzentas/mortas
6. **Suporte** — 92.8% dos navegadores globais (abril 2026, caniuse)

## 2. Construção de Paletas

### Método: Lightness Linear, H+C Constantes

Para gerar uma paleta coerente de 11 paradas (50–950):

1. Fixar Hue (H) — define a família cromática
2. Fixar Chroma (C) — define a vivacidade (ajustar em extremos)
3. Variar Lightness (L) — de 0.97 (50) até 0.15 (950) linearmente

```
Passo de L = (L_50 - L_950) / 10

L_50  = 0.97  (quase branco)
L_100 = 0.93
L_200 = 0.87
L_300 = 0.78
L_400 = 0.68
L_500 = 0.58  (ponto médio — cor principal)
L_600 = 0.48
L_700 = 0.40
L_800 = 0.33
L_900 = 0.25
L_950 = 0.15  (quase preto)
```

### Ajuste de Chroma por Lightness

Cores muito claras e muito escuras não suportam alto chroma (limitação do gamut). Reduzir C nos extremos:

```
C_50  = 0.01–0.03   (quase neutra)
C_100 = 0.03–0.05
C_200 = 0.06–0.08
C_300 = 0.10–0.13
C_400 = 0.14–0.17
C_500 = 0.17–0.22   (máximo chroma)
C_600 = 0.17–0.20
C_700 = 0.14–0.17
C_800 = 0.11–0.14
C_900 = 0.07–0.10
C_950 = 0.04–0.07
```

### Exemplo: Paleta Azul Completa

```css
:root {
  --color-blue-50:  oklch(0.97 0.01 250);
  --color-blue-100: oklch(0.93 0.03 250);
  --color-blue-200: oklch(0.87 0.07 250);
  --color-blue-300: oklch(0.78 0.12 250);
  --color-blue-400: oklch(0.68 0.16 250);
  --color-blue-500: oklch(0.58 0.20 250);  /* primária */
  --color-blue-600: oklch(0.48 0.19 250);
  --color-blue-700: oklch(0.40 0.17 250);
  --color-blue-800: oklch(0.33 0.14 250);
  --color-blue-900: oklch(0.25 0.10 250);
  --color-blue-950: oklch(0.15 0.06 250);
}
```

## 3. Estrutura da Paleta

### Paleta Primária (Brand)

A cor que define a identidade. Usada em CTAs, links, elementos interativos.

```css
:root {
  --brand-50 a --brand-950: /* H fixo da marca, C/L escalonados */
}
```

### Paleta Neutra (Gray)

Fundação do sistema — superfícies, texto, bordas. Chroma de 0 a 0.02 máximo.

```css
:root {
  --neutral-50:  oklch(0.98 0.005 250); /* tinta levíssima de brand hue */
  --neutral-100: oklch(0.95 0.005 250);
  --neutral-200: oklch(0.90 0.005 250);
  --neutral-300: oklch(0.83 0.005 250);
  --neutral-400: oklch(0.70 0.01 250);
  --neutral-500: oklch(0.55 0.01 250);
  --neutral-600: oklch(0.44 0.01 250);
  --neutral-700: oklch(0.37 0.01 250);
  --neutral-800: oklch(0.27 0.01 250);
  --neutral-900: oklch(0.20 0.01 250);
  --neutral-950: oklch(0.13 0.01 250);
}
```

A tinta de chroma (0.005–0.01) no hue do brand harmoniza os cinzas com a identidade visual.

### Paletas Semânticas (Feedback)

| Semântica  | Hue   | Uso                                        |
|------------|-------|--------------------------------------------|
| Success    | 145   | Confirmações, status positivo, conclusão   |
| Warning    | 80    | Alertas, atenção necessária, estados parciais |
| Error      | 25    | Erros, exclusão, ações destrutivas         |
| Info       | 250   | Informações neutras, dicas, status         |

```css
:root {
  --color-success-500: oklch(0.58 0.17 145);
  --color-warning-500: oklch(0.75 0.16 80);
  --color-error-500:   oklch(0.55 0.20 25);
  --color-info-500:    oklch(0.58 0.20 250);
}
```

## 4. Dark Mode — Inversão Inteligente

### Regras de Inversão

A inversão de dark mode NÃO é simplesmente trocar claro/escuro. Regras:

| Princípio                          | Light                    | Dark                     |
|------------------------------------|--------------------------|--------------------------|
| Background base                    | L ≈ 0.98–1.00           | L ≈ 0.12–0.15           |
| Texto primário                     | L ≈ 0.15–0.20           | L ≈ 0.93–0.97           |
| Nunca usar preto puro             | —                        | L mínimo 0.10, nunca 0  |
| Nunca usar branco puro            | —                        | L máximo 0.97, nunca 1  |
| Cor brand                          | 500–600                  | 300–400 (mais clara)     |
| Elevação                           | Sombra mais escura       | Lightness mais alta      |
| Bordas                             | L ≈ 0.88–0.90           | L ≈ 0.25–0.30           |
| Chroma de brand em superfícies     | Manter ou reduzir 10%   | Reduzir 20-30%           |

### Elevação no Dark Mode

No dark mode, sombras são quase invisíveis contra fundos escuros. Usar lightness progressiva:

```css
.dark {
  --surface-0: oklch(0.13 0.01 250);  /* base */
  --surface-1: oklch(0.16 0.01 250);  /* card */
  --surface-2: oklch(0.19 0.01 250);  /* dropdown */
  --surface-3: oklch(0.22 0.01 250);  /* modal */
  --surface-4: oklch(0.25 0.01 250);  /* popover sobre modal */
}
```

## 5. Verificação de Contraste

### Método Simplificado com OKLCH

A diferença de Lightness (ΔL) em OKLCH correlaciona fortemente com contraste percebido:

| ΔL OKLCH   | Contraste Aproximado | Adequação WCAG       |
|------------|---------------------|----------------------|
| ≥ 0.60     | ≥ 7:1               | AAA texto normal     |
| ≥ 0.50     | ≥ 4.5:1             | AA texto normal      |
| ≥ 0.40     | ≥ 3:1               | AA texto grande      |
| < 0.40     | < 3:1               | Falha WCAG           |

```
Exemplo: texto L=0.20 sobre fundo L=0.98
ΔL = 0.98 - 0.20 = 0.78 → AAA ✓

Exemplo: texto L=0.55 sobre fundo L=0.98
ΔL = 0.98 - 0.55 = 0.43 → AA para texto grande ✓, normal ✗
```

**Importante:** ΔL é uma heurística útil para design, mas a verificação oficial WCAG usa o algoritmo de Relative Luminance (WCAG 2.x) ou APCA (WCAG 3.0 draft). Sempre validar com ferramentas dedicadas para compliance.

### Ferramentas de Verificação

| Ferramenta          | Tipo                          |
|---------------------|-------------------------------|
| OKLCH.com           | Picker + contraste OKLCH      |
| Colour Contrast     | Checker WCAG 2.2 oficial      |
| Stark (Figma)       | Plugin de acessibilidade       |
| axe DevTools        | Auditoria automatizada         |

## 6. color-mix() para Estados Interativos

`color-mix()` permite derivar cores de estado sem definir tokens extras:

```css
:root {
  --btn-primary: oklch(0.55 0.20 250);
}

.btn-primary {
  background: var(--btn-primary);
}

.btn-primary:hover {
  /* Escurecer 15% misturando com preto */
  background: color-mix(in oklch, var(--btn-primary) 85%, black);
}

.btn-primary:active {
  /* Escurecer 25% */
  background: color-mix(in oklch, var(--btn-primary) 75%, black);
}

.btn-primary:disabled {
  /* Desaturar misturando com cinza */
  background: color-mix(in oklch, var(--btn-primary) 40%, oklch(0.70 0 0));
  opacity: 0.6;
}
```

### Padrão de Estados

```css
:root {
  --state-hover-mix: 85%;   /* 15% mais escuro/claro */
  --state-active-mix: 75%;  /* 25% mais escuro/claro */
  --state-focus-ring: oklch(0.65 0.20 250 / 0.5); /* ring semitransparente */
}
```

No dark mode, inverter a direção: misturar com branco ao invés de preto.

```css
.dark .btn-primary:hover {
  background: color-mix(in oklch, var(--btn-primary) 85%, white);
}
```

## 7. Acessibilidade de Cor

### Não Transmitir Informação Só por Cor

WCAG 1.4.1: cor não pode ser o único indicador visual. Sempre combinar com:

- Ícone (✓ para sucesso, ✗ para erro)
- Texto descritivo ("Salvo com sucesso")
- Padrão/textura (gráficos e charts)
- Borda ou sublinhado (links)

### Daltonismo

~8% dos homens e ~0.5% das mulheres têm algum tipo de deficiência na visão de cores:

| Tipo            | Prevalência | Cores Problemáticas     | Mitigação                      |
|-----------------|-------------|-------------------------|--------------------------------|
| Deuteranopia    | 6% homens   | Verde/vermelho          | Usar azul + laranja            |
| Protanopia      | 2% homens   | Vermelho/verde          | Usar azul + amarelo            |
| Tritanopia      | 0.01%       | Azul/amarelo            | Usar vermelho + verde          |
| Achromatopsia   | 0.003%      | Todas                   | Depender de luminosidade       |

### Paleta Acessível por Padrão

Usar hues com ΔH ≥ 60° entre cores semânticas garante distinguibilidade mesmo com daltonismo:

```
Success: H = 145 (verde)
Warning: H = 80  (amarelo/âmbar) — ΔH = 65° de success
Error:   H = 25  (vermelho)      — ΔH = 55° de warning, 120° de success
Info:    H = 250 (azul)          — ΔH = 105° de success
```

## 8. Wide Gamut e P3

### Cores Além do sRGB

Display P3 oferece ~30% mais cores que sRGB. OKLCH acessa esse gamut naturalmente:

```css
.badge-premium {
  /* Cor P3 vivida — fallback automático para sRGB se não suportado */
  background: oklch(0.65 0.28 330); /* magenta vivido, fora do sRGB */
}
```

### Progressive Enhancement para Wide Gamut

```css
.hero-gradient {
  /* Fallback sRGB */
  background: linear-gradient(135deg, oklch(0.55 0.20 250), oklch(0.60 0.18 300));
}

@media (color-gamut: p3) {
  .hero-gradient {
    /* P3 enhanced — chroma mais alto */
    background: linear-gradient(135deg, oklch(0.55 0.28 250), oklch(0.60 0.26 300));
  }
}
```

### Suporte (Abril 2026)

| Feature              | Suporte Global |
|----------------------|----------------|
| oklch()              | 92.8%          |
| color-mix()          | 91.4%          |
| color-gamut: p3      | 89.2%          |
| @supports (color:)   | 97.1%          |

Para os ~7% sem suporte, declarar fallback hex antes da declaração OKLCH:

```css
.brand {
  color: #3b82f6;                     /* fallback sRGB */
  color: oklch(0.58 0.20 250);       /* override OKLCH */
}
```
