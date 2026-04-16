---
id: doc-iconography
title: Sistema de Ícones
version: 2.0
last_updated: 2026-04-07
category: foundations
priority: important
related:
  - docs/web-excellence/foundations/01_DESIGN_SYSTEM.md
  - docs/web-excellence/foundations/04_SPACING_GRID.md
  - docs/web-excellence/ux-ui/04_ACCESSIBILITY_GUIDE.md
  - .cursor/rules/design/tokens.mdc
---

# Sistema de Ícones

## 1. Bibliotecas Recomendadas

### Lucide React (Primária)

A escolha padrão para projetos React/Next.js:

| Aspecto              | Detalhe                                         |
|----------------------|-------------------------------------------------|
| Ícones disponíveis   | 1.500+ (abril 2026)                             |
| Stroke width         | 2px padrão, consistente                         |
| Bundle size          | ~200 bytes por ícone (tree-shakeable)            |
| Estilo               | Outlined, geométrico, neutro                    |
| Licença              | ISC (permissiva)                                |
| Customização         | size, strokeWidth, color, className              |
| Consistência         | Grid 24×24px, cantos arredondados uniformes      |

```tsx
import { ArrowRight, Check, X, Loader2 } from 'lucide-react'

<ArrowRight size={20} strokeWidth={2} className="text-text-secondary" />
```

### Phosphor Icons (Alternativa)

Para projetos que precisam de múltiplos estilos:

| Aspecto              | Detalhe                                         |
|----------------------|-------------------------------------------------|
| Ícones disponíveis   | 9.000+ (6 estilos × 1.500+ base)                |
| Estilos              | Thin, Light, Regular, Bold, Fill, Duotone       |
| Bundle size          | ~300 bytes por ícone                             |
| Diferencial          | Duotone (dois tons) para estados/emphasis         |
| Licença              | MIT                                              |

```tsx
import { ArrowRight, CheckCircle } from '@phosphor-icons/react'

<ArrowRight size={20} weight="bold" />
<CheckCircle size={24} weight="duotone" />
```

### Critérios de Escolha

| Necessidade                           | Recomendação        |
|---------------------------------------|---------------------|
| SaaS/Dashboard minimalista            | Lucide React        |
| Design expressivo com múltiplos pesos | Phosphor Icons      |
| Compatibilidade com Figma             | Ambas (plugins)     |
| Menor bundle possível                 | Lucide React        |
| Ícones com estado (fill/outline)      | Phosphor Icons      |

## 2. Tamanhos de Ícones

### Escala Padrão

| Token          | Tamanho | Uso                                             |
|----------------|---------|--------------------------------------------------|
| `--icon-xs`    | 12px    | Inline indicators, status dots                   |
| `--icon-sm`    | 16px    | Dentro de texto corrido, badges, tags            |
| `--icon-md`    | 20px    | Botões, inputs, nav items, listas                |
| `--icon-lg`    | 24px    | Headers, cards, ações primárias                  |
| `--icon-xl`    | 32px    | Feature highlights, empty states                 |
| `--icon-2xl`   | 48px    | Hero features, onboarding, ilustrações simples   |

### Regra de Tamanho por Contexto

```
Tamanho do ícone = font-size do texto adjacente × 1.25 (arredondado para grid de 4px)

texto 14px → ícone 16px
texto 16px → ícone 20px
texto 18px → ícone 20px ou 24px
texto 24px → ícone 28px → arredondar para 32px
```

### Implementação com Props

```tsx
const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const

type IconSize = keyof typeof iconSizes

interface IconProps {
  icon: LucideIcon
  size?: IconSize
  className?: string
}

function Icon({ icon: IconComponent, size = 'md', className }: IconProps) {
  return <IconComponent size={iconSizes[size]} className={className} />
}
```

## 3. Stroke Width Consistente

### Regra Fundamental

Todos os ícones no mesmo contexto devem ter o mesmo stroke width. Misturar widths cria inconsistência visual.

| Tamanho do Ícone | Stroke Width Recomendado | Stroke Efetivo |
|-------------------|-------------------------|----------------|
| 12–16px           | 1.5px                   | Fino, delicado  |
| 20–24px           | 2px (padrão)            | Equilibrado     |
| 32–48px           | 1.5–2px                 | Proporcionalmente mais fino |

```tsx
<ArrowRight size={16} strokeWidth={1.5} />
<ArrowRight size={20} strokeWidth={2} />
<ArrowRight size={32} strokeWidth={1.75} />
```

### Evitar

- Stroke 1px em tamanhos ≤ 20px — fica invisível em telas de baixa resolução
- Stroke 3px — muito pesado para UI, parece ícone de app mobile
- Misturar stroke widths na mesma interface

## 4. Acessibilidade de Ícones

### Ícones Decorativos (Maioria dos Casos)

Quando o ícone acompanha texto que já comunica a ação:

```tsx
<button>
  <ArrowRight aria-hidden="true" size={20} />
  <span>Próximo</span>
</button>
```

### Ícones Significativos (Sem Texto)

Quando o ícone é o único indicador da ação:

```tsx
{/* Icon button — ícone é a única pista */}
<button aria-label="Fechar modal">
  <X size={20} />
</button>

{/* Status indicator */}
<span role="img" aria-label="Online">
  <Circle size={12} fill="currentColor" className="text-success-500" />
</span>
```

### Ícones em Links

```tsx
{/* Link externo — informar que abre em nova aba */}
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Documentação
  <ExternalLink size={16} aria-hidden="true" />
  <span className="sr-only">(abre em nova aba)</span>
</a>
```

### Checklist de Acessibilidade

- [ ] Ícone decorativo → `aria-hidden="true"`
- [ ] Ícone-only button → `aria-label` descritivo no botão
- [ ] Ícone de status → `role="img"` + `aria-label`
- [ ] Ícone de link externo → texto alternativo "(abre em nova aba)"
- [ ] Ícone de loading → `aria-label="Carregando"` ou aria-busy no container
- [ ] Ícone não recebe foco (focusable="false" em SVG se necessário)

## 5. Cor via currentColor

### Princípio

Ícones herdam a cor do texto pai via `currentColor`, garantindo consistência automática:

```tsx
{/* Ícone herda a cor do texto do botão */}
<button className="text-text-primary">
  <Settings size={20} /> {/* Automaticamente text-primary */}
  Configurações
</button>

{/* Ícone herda a cor do link */}
<a className="text-interactive hover:text-interactive-hover">
  Ver todos <ArrowRight size={16} />
</a>
```

### Quando Sobrescrever

```tsx
{/* Status semântico precisa de cor específica */}
<div className="flex items-center gap-2 text-text-primary">
  <CheckCircle size={20} className="text-success-500" />
  <span>Verificado com sucesso</span>
</div>

{/* Ícone disabled */}
<button disabled className="text-text-tertiary">
  <Lock size={20} /> {/* Herda text-tertiary = parecendo desabilitado */}
  Bloqueado
</button>
```

## 6. Alinhamento Ícone + Texto

### Problema Comum

Ícones e texto frequentemente ficam desalinhados verticalmente porque o ícone está em um viewBox diferente da baseline do texto.

### Solução: Flexbox

```tsx
{/* Método correto: flex + items-center */}
<span className="inline-flex items-center gap-1.5">
  <Calendar size={16} aria-hidden="true" />
  <span>12 de abril, 2026</span>
</span>
```

### Tabela de Gap Ícone-Texto

| Tamanho do Ícone | Gap Recomendado | Classe Tailwind |
|-------------------|-----------------|-----------------|
| 12px              | 4px             | `gap-1`         |
| 16px              | 6px             | `gap-1.5`       |
| 20px              | 8px             | `gap-2`         |
| 24px              | 8-12px          | `gap-2` a `gap-3`|
| 32px              | 12px            | `gap-3`         |

### Componente de Ícone + Texto

```tsx
interface IconTextProps {
  icon: LucideIcon
  children: React.ReactNode
  iconSize?: number
  className?: string
}

function IconText({ icon: Icon, children, iconSize = 16, className }: IconTextProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <Icon size={iconSize} aria-hidden="true" className="shrink-0" />
      <span>{children}</span>
    </span>
  )
}
```

O `shrink-0` no ícone evita que ele seja comprimido quando o texto wraps.

## 7. Diretrizes para Ícones Customizados

### Quando Criar Ícones Customizados

- Ícone de produto/logo que não existe nas bibliotecas
- Metáfora visual específica do domínio
- Ícone animado que precisa de controle de paths

### Regras para Ícones Customizados

1. **ViewBox 24×24** — Compatível com a escala padrão
2. **Stroke 2px** — Consistente com Lucide
3. **Cantos arredondados** — `stroke-linecap="round"` `stroke-linejoin="round"`
4. **2px de padding** — Conteúdo dentro de 20×20, 2px de respiro
5. **currentColor** — Usar `stroke="currentColor"` ou `fill="currentColor"`
6. **Sem cores hardcoded** — Deve funcionar em qualquer contexto

```tsx
function CustomIcon({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* paths do ícone */}
    </svg>
  )
}
```

## 8. Otimização de SVG

### Pipeline de Otimização

```bash
# SVGO — otimização automatizada
npx svgo icon.svg -o icon.optimized.svg --config svgo.config.js
```

### Configuração SVGO Recomendada

```js
// svgo.config.js
module.exports = {
  plugins: [
    'preset-default',
    'removeDimensions',
    { name: 'removeAttrs', params: { attrs: ['data-name', 'class'] } },
    { name: 'addAttributesToSVGElement', params: {
      attributes: [{ 'aria-hidden': 'true' }]
    }},
    { name: 'sortAttrs' },
  ],
}
```

### Checklist de Otimização

- [ ] Remover metadata do editor (Illustrator, Figma)
- [ ] Remover grupos vazios e layers desnecessários
- [ ] Simplificar paths (reduzir pontos de controle)
- [ ] Remover `fill="none"` quando já é o padrão
- [ ] Converter shapes para paths quando menor
- [ ] Usar `currentColor` ao invés de hex
- [ ] Remover dimensões (usar viewBox + size prop)
- [ ] Resultado: SVG inline < 500 bytes para ícones simples
