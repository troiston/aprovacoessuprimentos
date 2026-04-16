---
id: skill-build-grid-layout
title: "Build Grid Layout"
agent: 03-builder
version: 1.0
category: layout
priority: important
requires:
  - skill: skill-build-design-tokens
  - skill: skill-build-spacing-grid
provides:
  - componente bento grid layout
used_by:
  - agent: 03-builder
  - command: new-section
---

# Build Grid Layout (Bento)

Implementação de bento grid com CSS Grid. 67% dos top SaaS usam bento layouts — usuários completam tarefas 23% mais rápido com hierarquia visual de tiles.

## Conceito

Bento grid = grid com tiles de tamanhos variados, como uma caixa de bentō japonesa. Cada tile ocupa um span de colunas × linhas, criando hierarquia visual sem esforço do usuário.

```
┌──────────────┬───────┬───────┐
│              │       │       │
│    6×3       │  3×2  │  3×2  │
│              │       │       │
│              ├───────┴───────┤
├──────┬───────┤               │
│      │       │     6×2       │
│ 3×2  │  3×2  │               │
│      │       │               │
└──────┴───────┴───────────────┘
```

## CSS Base

```css
/* src/app/globals.css — adicione após @theme */

.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: 90px;
  gap: 1rem;
  grid-auto-flow: dense;
}

/* Tile sizes */
.tile-2x2 { grid-column: span 2; grid-row: span 2; }
.tile-2x3 { grid-column: span 2; grid-row: span 3; }
.tile-3x2 { grid-column: span 3; grid-row: span 2; }
.tile-3x3 { grid-column: span 3; grid-row: span 3; }
.tile-4x2 { grid-column: span 4; grid-row: span 2; }
.tile-4x3 { grid-column: span 4; grid-row: span 3; }
.tile-4x4 { grid-column: span 4; grid-row: span 4; }
.tile-6x2 { grid-column: span 6; grid-row: span 2; }
.tile-6x3 { grid-column: span 6; grid-row: span 3; }
.tile-6x4 { grid-column: span 6; grid-row: span 4; }
.tile-12x2 { grid-column: span 12; grid-row: span 2; }
.tile-12x3 { grid-column: span 12; grid-row: span 3; }

/* Tablet: 8 colunas */
@media (max-width: 1023px) {
  .bento-grid {
    grid-template-columns: repeat(8, 1fr);
    grid-auto-rows: 80px;
  }
  .tile-6x2, .tile-6x3, .tile-6x4 {
    grid-column: span 4;
  }
  .tile-12x2, .tile-12x3 {
    grid-column: span 8;
    grid-row: span 2;
  }
}

/* Mobile: 4 colunas */
@media (max-width: 639px) {
  .bento-grid {
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 70px;
  }
  .tile-2x2, .tile-2x3, .tile-3x2, .tile-3x3,
  .tile-4x2, .tile-4x3, .tile-4x4,
  .tile-6x2, .tile-6x3, .tile-6x4 {
    grid-column: span 4;
    grid-row: span 2;
  }
  .tile-12x2, .tile-12x3 {
    grid-column: span 4;
    grid-row: span 2;
  }
}
```

## grid-auto-flow: dense

A propriedade `dense` faz o grid preencher buracos automaticamente, reordenando tiles menores para caber nos espaços vazios. Essencial para bento grids.

Sem `dense`: tiles seguem ordem do DOM, deixando gaps.
Com `dense`: tiles menores preenchem gaps, layout denso sem buracos.

## Componente BentoGrid

```tsx
// src/components/ui/bento-grid.tsx
'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type ComponentPropsWithoutRef } from 'react'

type TileSize =
  | '2x2' | '2x3'
  | '3x2' | '3x3'
  | '4x2' | '4x3' | '4x4'
  | '6x2' | '6x3' | '6x4'
  | '12x2' | '12x3'

interface BentoGridProps extends ComponentPropsWithoutRef<'div'> {
  stagger?: boolean
}

export function BentoGrid({ className, children, stagger = true, ...props }: BentoGridProps) {
  if (!stagger) {
    return (
      <div className={cn('bento-grid', className)} {...props}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={cn('bento-grid', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.08 },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface BentoTileProps extends ComponentPropsWithoutRef<'div'> {
  size?: TileSize
  animated?: boolean
}

const tileVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
}

export function BentoTile({
  size = '4x3',
  animated = true,
  className,
  children,
  ...props
}: BentoTileProps) {
  const Component = animated ? motion.div : 'div'
  const motionProps = animated ? { variants: tileVariants } : {}

  return (
    <Component
      className={cn(
        `tile-${size}`,
        'overflow-hidden rounded-xl border border-border bg-surface-raised p-6 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  )
}
```

## Exemplo de Uso — Features Section

```tsx
// src/components/sections/features-bento.tsx
'use client'

import { BentoGrid, BentoTile } from '@/components/ui/bento-grid'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Heading } from '@/components/ui/heading'

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
  size: '3x2' | '3x3' | '4x3' | '6x2' | '6x3'
  highlight?: boolean
}

interface FeaturesBentoProps {
  headline: string
  subheadline: string
  features: Feature[]
}

export function FeaturesBento({ headline, subheadline, features }: FeaturesBentoProps) {
  return (
    <Section spacing="lg">
      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Heading as="h2">{headline}</Heading>
          <p className="mt-4 text-lg text-on-surface-muted">{subheadline}</p>
        </div>

        <BentoGrid>
          {features.map((feature) => (
            <BentoTile
              key={feature.title}
              size={feature.size}
              className={cn(
                'flex flex-col justify-between',
                feature.highlight && 'border-accent bg-accent-subtle'
              )}
            >
              <div>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-subtle text-accent">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-on-surface">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-muted">
                  {feature.description}
                </p>
              </div>
            </BentoTile>
          ))}
        </BentoGrid>
      </Container>
    </Section>
  )
}
```

Dados de exemplo:

```tsx
const features: Feature[] = [
  {
    title: 'Analytics em Tempo Real',
    description: 'Acompanhe métricas de performance com dashboards atualizados em tempo real.',
    icon: <ChartIcon />,
    size: '6x3',
    highlight: true,
  },
  {
    title: 'Automações',
    description: 'Configure workflows automatizados sem código.',
    icon: <BoltIcon />,
    size: '3x3',
  },
  {
    title: 'Integrações',
    description: 'Conecte com +100 ferramentas que você já usa.',
    icon: <PlugIcon />,
    size: '3x3',
  },
  {
    title: 'API Completa',
    description: 'RESTful API documentada para customização total.',
    icon: <CodeIcon />,
    size: '4x2',
  },
  {
    title: 'Segurança',
    description: 'Criptografia end-to-end e compliance SOC 2.',
    icon: <ShieldIcon />,
    size: '4x2',
  },
  {
    title: 'Suporte 24/7',
    description: 'Equipe dedicada disponível a qualquer hora.',
    icon: <HeadsetIcon />,
    size: '4x2',
  },
]
```

## Animação Staggered

A entrada dos tiles é escalonada (staggered) com 80ms de delay entre cada um. Cada tile faz fade-up com spring physics:

```
Tile 1: delay 0ms    → opacity 0→1, y 16→0
Tile 2: delay 80ms   → opacity 0→1, y 16→0
Tile 3: delay 160ms  → opacity 0→1, y 16→0
...
```

`whileInView` com `viewport.once: true` garante que a animação acontece apenas uma vez quando a seção entra no viewport.

## Layouts Pré-definidos

### 3 colunas iguais
```
[4x3] [4x3] [4x3]
```

### Hero + 2 secundários
```
[6x3       ] [3x3] 
             [3x3]
```

### Dashboard
```
[6x2       ] [6x2       ]
[4x3] [4x3 ] [4x3       ]
```

### Feature highlight
```
[6x4              ] [6x2       ]
                    [3x2] [3x2]
[4x2] [4x2] [4x2 ]
```

## Regras

1. **Sempre** use `grid-auto-flow: dense` em bento grids
2. Tiles highlight usam `6x3` ou maior — ocupam destaque visual
3. Mobile: todos os tiles colapsam para `span 4` (full width), `row span 2`
4. Conteúdo do tile deve ser legível sem scroll interno
5. Border radius `rounded-xl` (1rem) para todos os tiles
6. Stagger animation com 80ms de delay, máximo 500ms total de duração

## Validação

- [ ] Grid usa 12 colunas desktop, 8 tablet, 4 mobile
- [ ] `grid-auto-flow: dense` ativo
- [ ] auto-rows definido (90px desktop, 80px tablet, 70px mobile)
- [ ] Tiles responsivos: colapsam em mobile
- [ ] Animação staggered com `whileInView`
- [ ] Tiles têm border, radius e shadow consistentes
- [ ] Nenhum scroll horizontal em qualquer viewport
