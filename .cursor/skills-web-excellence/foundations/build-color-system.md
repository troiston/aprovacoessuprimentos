---
id: skill-build-color-system
title: "Build Color System"
agent: 02-designer
version: 1.0
category: foundations
priority: critical
requires:
  - skill: skill-build-design-tokens
  - rule: design/tokens
provides:
  - paleta de cores OKLCH completa
used_by:
  - agent: 02-designer
---

# Build Color System

Sistema de cores completo usando OKLCH. Gera paletas perceptualmente uniformes, compatíveis com wide gamut e otimizadas para contraste WCAG.

## Por que OKLCH

| Propriedade | HSL | OKLCH |
|-------------|-----|-------|
| Uniformidade perceptual | Não — azul e amarelo com mesma L% parecem diferentes | Sim — mesma Lightness = mesma luminosidade percebida |
| Independência de canais | H/S/L se influenciam | L/C/H são independentes |
| Gerar shade scales | Precisa ajustar S e L manualmente | Basta variar L mantendo C e H |
| Wide gamut (P3) | Limitado a sRGB | Suporta P3 nativamente |
| Contraste WCAG | Calcular separadamente | Diferença de L correlaciona com contraste |

## Anatomia oklch(L C H / alpha)

```
L → Lightness:  0 (preto) a 1 (branco)
C → Chroma:     0 (cinza) a ~0.4 (máxima saturação)
H → Hue:        0-360 (ângulo no color wheel)
```

Mapa de hues principais:
- Vermelho: ~25    - Rosa: ~350     - Roxo: ~300
- Azul: ~250       - Ciano: ~200    - Verde: ~145
- Lima: ~125       - Amarelo: ~85   - Laranja: ~55

## Gerando uma Paleta Primária

Mantenha C (chroma) e H (hue) constantes. Varie apenas L (lightness):

```
Shade   L       Uso típico
50      0.97    Background sutil
100     0.93    Background hover
200     0.86    Background active, bordas sutis
300     0.75    Bordas, ícones desabilitados
400     0.65    Ícones secundários
500     0.55    COR BASE — botões, links
600     0.48    Hover state de botões
700     0.40    Active/pressed state
800     0.33    Text on light bg
900     0.27    Heading text
950     0.20    Darkest — backgrounds escuros
```

Exemplo para primary com hue 250 (azul) e chroma 0.20:

```css
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
```

A chroma diminui nos extremos (50, 900, 950) porque tons muito claros ou escuros não suportam alta saturação.

## Paleta Neutra com Tint

Neutros puros (chroma 0) parecem sem vida. Adicione chroma 0.005–0.01 usando o hue do primary:

```css
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
```

## Cores Semânticas

```css
/* Success — Hue 145 (verde), chroma 0.19 */
--color-success-100: oklch(0.93 0.04 145);
--color-success-300: oklch(0.75 0.14 145);
--color-success-500: oklch(0.60 0.19 145);
--color-success-700: oklch(0.42 0.13 145);
--color-success-900: oklch(0.25 0.07 145);

/* Warning — Hue 85 (amarelo), chroma 0.17 */
--color-warning-100: oklch(0.95 0.05 85);
--color-warning-300: oklch(0.83 0.14 85);
--color-warning-500: oklch(0.75 0.17 85);
--color-warning-700: oklch(0.55 0.12 85);
--color-warning-900: oklch(0.35 0.07 85);

/* Error — Hue 25 (vermelho), chroma 0.22 */
--color-error-100: oklch(0.93 0.04 25);
--color-error-300: oklch(0.75 0.14 25);
--color-error-500: oklch(0.58 0.22 25);
--color-error-700: oklch(0.42 0.15 25);
--color-error-900: oklch(0.25 0.08 25);

/* Info — Hue 230 (azul índigo), chroma 0.18 */
--color-info-100: oklch(0.93 0.04 230);
--color-info-300: oklch(0.75 0.13 230);
--color-info-500: oklch(0.58 0.18 230);
--color-info-700: oklch(0.42 0.13 230);
--color-info-900: oklch(0.25 0.07 230);
```

## Verificação de Contraste com OKLCH

Regra simplificada: diferença de Lightness ≥ 0.40 para texto normal, ≥ 0.30 para texto grande (≥18px bold ou ≥24px normal).

```
Texto on-surface (L=0.20) sobre surface (L=0.98):
ΔL = 0.98 - 0.20 = 0.78 ✅ passa AA e AAA

Muted text (L=0.55) sobre surface (L=0.98):
ΔL = 0.98 - 0.55 = 0.43 ✅ passa AA

Accent text (L=0.55) sobre surface (L=0.98):
ΔL = 0.98 - 0.55 = 0.43 ✅ passa AA
```

Para validação exata, use ferramentas como `contrast.tools` ou `oklch.com`.

## Hover/Active com color-mix()

Evite criar shades extras manualmente. Use `color-mix()` para estados:

```css
.btn-primary {
  background: var(--color-accent);
}
.btn-primary:hover {
  background: color-mix(in oklch, var(--color-accent), black 12%);
}
.btn-primary:active {
  background: color-mix(in oklch, var(--color-accent), black 20%);
}
```

Para clarear (botões ghost):
```css
.btn-ghost:hover {
  background: color-mix(in oklch, var(--color-accent), transparent 88%);
}
```

## Dark Mode — Inversão de Lightness

No dark mode, inverta o mapeamento semântico:

| Token | Light | Dark |
|-------|-------|------|
| surface | neutral-50 (L=0.98) | neutral-950 (L=0.14) |
| surface-raised | white (L=1.0) | neutral-900 (L=0.20) |
| on-surface | neutral-900 (L=0.20) | neutral-100 (L=0.94) |
| border | neutral-200 (L=0.88) | neutral-800 (L=0.27) |
| muted | neutral-200 (L=0.88) | neutral-800 (L=0.27) |

A cor accent (500) geralmente funciona em ambos os modos. Se necessário, use o shade 400 no dark para melhor contraste sobre fundo escuro.

## Paleta Completa — Template para Customização

Para trocar a identidade visual, altere apenas o valor de H (hue) nos primitivos:

```
Brand azul:    H = 250   (default deste sistema)
Brand roxo:    H = 290
Brand verde:   H = 160
Brand coral:   H = 20
Brand laranja: H = 55
```

Mantenha a mesma curva de L e C — a paleta inteira se adapta.

## Validação

- [ ] Todas as cores usam `oklch()`, nenhuma `rgb()` ou `hsl()`
- [ ] Chroma diminui nos extremos (50: ~0.01, 950: ~0.06)
- [ ] Neutros têm tint do primary (chroma 0.005–0.01)
- [ ] Contraste ΔL ≥ 0.40 para texto normal sobre surface
- [ ] Dark mode inverte tokens semânticos, não primitivos
- [ ] `color-mix()` usado para hover/active em vez de shades extras
- [ ] Semânticas cobrem: success, warning, error, info
