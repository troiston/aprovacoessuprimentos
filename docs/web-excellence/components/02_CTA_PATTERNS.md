---
id: doc-cta-patterns
title: Padrões de CTA para Conversão Máxima
version: 2.0
last_updated: 2026-04-07
category: components
priority: critical
related:
  - docs/web-excellence/components/01_HERO_PATTERNS.md
  - docs/web-excellence/components/06_CONVERSION_ELEMENTS.md
  - docs/web-excellence/components/03_SOCIAL_PROOF_PATTERNS.md
  - .cursor/rules/design/tokens.mdc
---

# Padrões de CTA para Conversão Máxima

## Visão Geral

Call-to-Action (CTA) é o ponto de conversão. Dados de 2025-2026 confirmam que CTAs com texto específico orientado a ação convertem **+30%** mais que textos genéricos. A diferença entre "Enviar" e "Começar meu trial grátis" pode representar milhares de conversões perdidas.

---

## 1. Hierarquia de Botões

### 1.1 Sistema de 3 Níveis

| Nível | Variante | Uso | Estilo |
|-------|----------|-----|--------|
| **Primário** | `default` | Ação principal da página (1 por seção) | Fundo sólido, alto contraste |
| **Secundário** | `outline` / `secondary` | Ação alternativa | Borda + texto, fundo transparente |
| **Terciário** | `ghost` / `link` | Ações de menor importância | Sem borda, sem fundo, apenas texto |

### 1.2 Regra de Ouro

> Máximo **1 CTA primário** por viewport visível. Múltiplos CTAs primários competem entre si e reduzem conversão em **-12%** (HubSpot, 2025).

### 1.3 Implementação

```tsx
// Primário — Ação principal
<Button size="lg">Começar grátis</Button>

// Secundário — Alternativa
<Button variant="outline" size="lg">Ver demonstração</Button>

// Terciário — Informacional
<Button variant="ghost" size="sm">Saiba mais →</Button>

// Link — Navegação contextual
<Button variant="link">Ver todos os recursos</Button>
```

---

## 2. Texto Orientado a Ação

### 2.1 Princípio: Específico > Genérico

Dados de A/B testing agregados (Unbounce, VWO, ConvertKit — 2024-2025):

| Texto Genérico | Texto Específico | Diferença |
|----------------|------------------|-----------|
| "Enviar" | "Receber meu ebook" | +30% |
| "Saiba mais" | "Ver como funciona" | +18% |
| "Clique aqui" | "Começar grátis agora" | +25% |
| "Registrar" | "Criar minha conta grátis" | +15% |
| "Comprar" | "Adicionar ao carrinho — R$99" | +12% |
| "Continuar" | "Próximo: Escolher plano" | +8% |

### 2.2 Fórmulas de Texto para CTA

**Fórmula 1: Verbo + Objeto + Benefício**
- "Criar minha loja online"
- "Baixar o guia completo"
- "Agendar demonstração grátis"

**Fórmula 2: Verbo + Objeto Possessivo (1ª pessoa)**
- "Começar meu trial" (+2.4% vs "Começar seu trial" — ContentVerve, 2025)
- "Ver meu diagnóstico"
- "Ativar minha conta"

**Fórmula 3: Verbo + Resultado**
- "Automatizar agora"
- "Economizar tempo"
- "Acelerar meu site"

**Fórmula 4: Temporal + Ação**
- "Testar 14 dias grátis"
- "Começar em 2 minutos"
- "Ver resultados hoje"

### 2.3 Anti-Padrões de Texto

| Evitar | Por quê | Alternativa |
|--------|---------|-------------|
| "Enviar" | Zero contexto de resultado | "Receber [benefício]" |
| "Clique aqui" | Não acessível, genérico | Descrever a ação |
| "Ir" | Vago demais | "Ir para o dashboard" |
| Verbos passivos | Sem agency | Verbos ativos na 1ª pessoa |
| Texto > 5 palavras | Perde impacto | Condensar com clareza |

---

## 3. Contraste e Cor

### 3.1 Contraste para Visibilidade

O CTA precisa ser o elemento de **maior contraste cromático** na seção:

| Regra | Mínimo | Ideal |
|-------|--------|-------|
| Texto sobre botão | 4.5:1 (AA) | 7:1 (AAA) |
| Botão vs background | Contraste visual evidente | Stand out claramente |
| Botão vs elementos vizinhos | Distinto de outros elementos | Hierarquia visual clara |

### 3.2 Cores em OKLCH

```css
/* CTA Primário — Alta saturação para destaque */
--cta-primary: oklch(0.65 0.25 145);       /* Verde vibrante */
--cta-primary-hover: oklch(0.60 0.25 145);  /* Tom mais escuro no hover */
--cta-primary-text: oklch(1.0 0 0);         /* Branco puro */

/* CTA Secundário — Baixa saturação */
--cta-secondary: oklch(0.95 0.01 0);       /* Quase branco */
--cta-secondary-hover: oklch(0.90 0.01 0);
--cta-secondary-text: oklch(0.25 0 0);     /* Quase preto */
```

### 3.3 Regra do Contraste Isolado

> A cor do CTA primário NÃO deve ser usada em nenhum outro elemento da mesma seção. Isso garante isolamento visual e direciona o olho automaticamente.

**Dados:** CTAs com cor exclusiva na seção têm **+14%** mais cliques vs CTAs que compartilham cor com outros elementos (EyeQuant, 2025).

---

## 4. Micro-Interações

### 4.1 Estados Interativos

| Estado | Animação | Propriedade CSS | Duração |
|--------|----------|----------------|---------|
| **Hover** | Scale up suave | `scale: 1.02` | 200ms |
| **Active/Click** | Scale down (feedback tátil) | `scale: 0.98` | 100ms |
| **Focus** | Ring de foco visível | `ring-2 ring-offset-2` | Instantâneo |
| **Loading** | Spinner + texto alterado | `opacity-80` + spinner | Até completar |
| **Disabled** | Opacidade reduzida | `opacity-50 cursor-not-allowed` | - |

### 4.2 Implementação com Framer Motion

```tsx
import { motion } from 'framer-motion'

function CTAButton({ children, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      {...props}
    >
      {children}
    </motion.button>
  )
}
```

### 4.3 Animação de Brilho (Shine Effect)

Efeito sutil que chama atenção para o CTA periodicamente:

```tsx
<motion.button
  className="relative overflow-hidden"
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  <span className="relative z-10">Começar grátis</span>
  <motion.div
    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
    animate={{ translateX: ['−100%', '100%'] }}
    transition={{
      duration: 2,
      repeat: Infinity,
      repeatDelay: 5,
      ease: 'easeInOut',
    }}
  />
</motion.button>
```

**Dados:** Shine effects aumentam cliques em **+3-5%** quando usados com moderação (VWO, 2025). Usar com `repeatDelay` de 5-10s para não irritar.

---

## 5. Tamanhos e Dimensões

### 5.1 Guidelines de Tamanho

| Contexto | Tamanho | Padding | Font Size | Min Width |
|----------|---------|---------|-----------|-----------|
| Hero CTA | `lg` | `px-8 py-4` | `text-lg` | 200px |
| Seção CTA | `default` | `px-6 py-3` | `text-base` | 160px |
| Inline CTA | `sm` | `px-4 py-2` | `text-sm` | 120px |
| Card CTA | `default` | `px-6 py-3` | `text-base` | Full width |
| Nav CTA | `sm` | `px-4 py-2` | `text-sm` | Auto |

### 5.2 Touch Targets (Mobile)

| Requisito | Mínimo | Recomendado |
|-----------|--------|-------------|
| WCAG 2.2 AA | 24×24px | - |
| WCAG 2.2 AAA | 44×44px | - |
| Apple HIG | 44×44px | - |
| Material Design | 48×48px | 56×48px |
| **Recomendação** | **48×48px** | **56×48px** |

### 5.3 Border Radius

```css
/* Tendência 2026: rounded suave, não totalmente pill */
--radius-sm: 0.5rem;   /* 8px — Botões pequenos */
--radius-md: 0.75rem;  /* 12px — Botões default */
--radius-lg: 1rem;     /* 16px — Botões hero */
--radius-pill: 9999px; /* Pill — Apenas para badges/tags */
```

**Dados:** Border-radius de 12-16px converte **+3%** melhor que cantos retos E que pill buttons em contextos SaaS (GoodUI, 2025).

---

## 6. Estratégia de Posicionamento

### 6.1 Onde Posicionar CTAs

| Posição | Quando | Impacto |
|---------|--------|---------|
| **Above-the-fold (Hero)** | Sempre | Baseline — primeiro ponto de conversão |
| **Após proposta de valor** | Quando value prop é seção separada | +8% vs apenas hero |
| **Após prova social** | Após logos/testimonials/cases | +12% vs sem CTA pós-social-proof |
| **Sticky mobile bottom** | Mobile, páginas longas | +15% conversão mobile |
| **Fim da página** | Sempre | Captura quem leu tudo |
| **Mid-page repeat** | Páginas > 3 viewports | +10% captura incremental |

### 6.2 CTA Sticky Mobile

```tsx
<div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/80 p-4 backdrop-blur-lg lg:hidden">
  <Button size="lg" className="w-full">
    Começar grátis
  </Button>
  <p className="mt-2 text-center text-xs text-muted-foreground">
    Sem cartão de crédito necessário
  </p>
</div>
```

**Dados:** CTA sticky mobile aumenta conversões em **+15%** em páginas longas (Sumo, 2025). Implementar com `lg:hidden` para não afetar desktop.

### 6.3 Padrão de Repetição

> Repita o CTA a cada **2-3 viewports de scroll**. Cada repetição deve ter contexto local (após um argumento de valor diferente).

---

## 7. Elementos de Urgência no CTA

### 7.1 Padrões de Urgência Ética

| Tipo | Exemplo | Ético? | Impacto |
|------|---------|--------|---------|
| Urgência real | "Oferta válida até 15/04" (data real) | ✅ | +8% |
| Escassez real | "Restam 3 vagas de 20" (contagem real) | ✅ | +12% |
| Temporal real | "Próxima turma: 20/04" | ✅ | +10% |
| Countdown fake | Timer que reseta a cada visita | ❌ | Trust damage |
| Escassez fake | "Últimas unidades!" (sem controle real) | ❌ | Trust damage |

### 7.2 Implementação de Urgência

```tsx
<div className="flex flex-col items-center gap-3">
  <Button size="lg">
    Garantir minha vaga
  </Button>
  <p className="flex items-center gap-2 text-sm text-muted-foreground">
    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
    <span>7 vagas restantes para esta turma</span>
  </p>
</div>
```

---

## 8. A/B Testing de CTAs

### 8.1 Testes Prioritários (ROI de teste)

| # | Teste | Impacto Esperado | Facilidade |
|---|-------|------------------|------------|
| 1 | Texto genérico vs específico | +10-30% | Muito fácil |
| 2 | 1ª pessoa vs 2ª pessoa ("Meu" vs "Seu") | +2-5% | Muito fácil |
| 3 | Com micro-copy vs sem | +5-12% | Fácil |
| 4 | Cor de alto contraste vs baixo | +5-10% | Fácil |
| 5 | Tamanho lg vs default | +3-8% | Fácil |
| 6 | Com urgência vs sem | +5-15% | Médio |
| 7 | Sticky mobile vs scroll | +10-20% | Médio |
| 8 | Posição na página | +5-15% | Médio |

### 8.2 Framework de Teste

1. **Hipótese clara:** "Se mudarmos X para Y, esperamos Z porque [razão]"
2. **Métrica primária:** Taxa de clique no CTA (CTR)
3. **Métrica secundária:** Conversão final (signup/purchase)
4. **Guardrail:** Não piorar bounce rate
5. **Amostra:** Mínimo 1.000 visitantes por variante
6. **Duração:** Mínimo 1 ciclo semanal completo

---

## 9. Acessibilidade do CTA

### 9.1 Requisitos WCAG 2.2

| Requisito | Critério | Implementação |
|-----------|----------|---------------|
| Contraste de texto | 4.5:1 mínimo (AA) | Verificar com ferramentas |
| Target size | 24×24px mínimo (AA), 44×44px (AAA) | Padding generoso |
| Focus visible | Indicador de foco visível | `focus-visible:ring-2` |
| Estado acessível | `aria-label` quando texto é ícone | `aria-label="Fechar menu"` |
| Loading state | Comunicar loading | `aria-busy="true"` + texto SR |
| Disabled state | Comunicar desabilitado | `aria-disabled="true"` |

### 9.2 Keyboard Navigation

```tsx
<Button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }}
  tabIndex={0}
  role="button"
>
  Começar grátis
</Button>
```

> Usar `<button>` nativo sempre que possível — já inclui keyboard handling e ARIA role automaticamente.

---

## 10. CTA Patterns por Contexto

### 10.1 SaaS B2B

```
[ Agendar Demo ]  [ Ver Preços ]
Sem compromisso · Consultoria de 30 min com especialista
```

### 10.2 SaaS B2C / PLG

```
[ Começar Grátis ]  [ Ver Como Funciona ]
Sem cartão de crédito · Setup em 2 min
```

### 10.3 E-commerce

```
[ Comprar Agora — R$199 ]
ou 4x de R$49,75 sem juros · Frete grátis
```

### 10.4 Lead Generation

```
[ Baixar Ebook Grátis ]
+10.000 downloads · PDF de 45 páginas
```

### 10.5 Newsletter

```
[email@exemplo.com] [ Assinar Grátis ]
Toda segunda-feira · 5 min de leitura · 25.000 assinantes
```

---

## Fontes e Referências

- HubSpot CTA Research Report 2025
- Unbounce Conversion Benchmark Report 2025
- ContentVerve A/B Testing Studies 2025
- VWO Knowledge Base — Button Optimization
- GoodUI A/B Testing Patterns 2025
- Baymard Institute — Checkout UX (2025)
- EyeQuant Visual Attention Studies 2025
- WCAG 2.2 Specification — Target Size
- Sumo — Sticky CTA Mobile Study 2025
