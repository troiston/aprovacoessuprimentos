---
id: doc-hero-patterns
title: Padrões de Hero Section para Alta Conversão
version: 2.0
last_updated: 2026-04-07
category: components
priority: critical
related:
  - docs/web-excellence/components/02_CTA_PATTERNS.md
  - docs/web-excellence/components/06_CONVERSION_ELEMENTS.md
  - docs/web-excellence/performance/01_CORE_WEB_VITALS.md
  - docs/web-excellence/performance/02_IMAGE_OPTIMIZATION.md
  - .cursor/rules/design/tokens.mdc
---

# Padrões de Hero Section para Alta Conversão

## Visão Geral

A hero section é o elemento mais impactante de qualquer landing page. Dados de 2025-2026 mostram que uma hero otimizada pode aumentar a conversão em até **+30%** quando contém os 5 elementos essenciais above-the-fold. O tempo médio de atenção caiu para **6.8 segundos** em 2026 — a hero precisa comunicar valor instantaneamente.

---

## 1. Os 5 Elementos Essenciais Above-the-Fold

Pesquisas com mais de 12.000 landing pages (Unbounce, 2025) mostram que a presença simultânea destes 5 elementos correlaciona com +30% de conversão:

| # | Elemento | Impacto Isolado | Função |
|---|----------|----------------|--------|
| 1 | **Headline orientada a benefício** | +20% conversão vs feature-driven | Comunicar valor único em < 3s |
| 2 | **Sub-headline de suporte** | +8% quando presente | Expandir headline com contexto |
| 3 | **CTA primário visível** | +15% vs CTA abaixo do fold | Ação imediata sem scroll |
| 4 | **Visual hero** (imagem/vídeo/ilustração) | +12% engagement | Contexto visual do produto |
| 5 | **Prova social mínima** (logos, rating, contagem) | +10-15% trust | Reduzir fricção de decisão |

### Regra de Ouro

> Tudo que o visitante precisa para decidir clicar no CTA deve estar visível sem scroll no viewport de 375×667px (iPhone SE — menor viewport comum).

---

## 2. Layouts de Hero — 4 Variantes Comprovadas

### 2.1 Full-Screen Hero (Imersivo)

**Quando usar:** Branding forte, produto visual, primeira impressão impactante.

```
┌─────────────────────────────────────┐
│         [Background Image/Video]     │
│                                      │
│          HEADLINE GRANDE             │
│        Sub-headline de suporte       │
│                                      │
│        [ CTA Primário ]              │
│        [ CTA Secundário ]            │
│                                      │
│     ★★★★★ 4.9/5 · 10.000+ clientes │
└─────────────────────────────────────┘
```

**Specs técnicos:**
- Background: `min-height: 100svh` (safe viewport height — evita barra de navegação mobile)
- Overlay: gradient `oklch(0.15 0 0 / 0.6)` a `oklch(0.15 0 0 / 0.8)` para legibilidade
- Texto: contraste mínimo 7:1 sobre overlay (AAA)
- Vídeo: autoplay muted, max 5s loop, poster estático para LCP

**Dados:** Full-screen hero converte **+18%** em páginas de produto vs layouts parciais (ConversionXL, 2025), mas piora performance se não otimizado.

### 2.2 Split Hero (50/50 ou 60/40)

**Quando usar:** SaaS, produtos digitais, quando o produto precisa ser mostrado.

```
┌──────────────────┬──────────────────┐
│                  │                  │
│   HEADLINE       │   [Product       │
│   Sub-headline   │    Screenshot    │
│                  │    ou Mockup]    │
│  [ CTA ]         │                  │
│  ★★★★★ Prova    │                  │
│                  │                  │
└──────────────────┴──────────────────┘
```

**Specs técnicos:**
- Grid: `grid-cols-1 lg:grid-cols-2 gap-12 items-center`
- Texto à esquerda (LTR) — padrão F de leitura favorece texto primeiro
- Imagem: `priority` + `sizes="(max-width: 1024px) 100vw, 50vw"`
- Mobile: stack vertical, texto acima da imagem

**Dados:** Layout mais usado em SaaS — 62% das top 100 SaaS landing pages usam split hero (PageFly, 2025).

### 2.3 Product Hero (Centrado no Produto)

**Quando usar:** E-commerce, apps móveis, quando o produto é o hero.

```
┌─────────────────────────────────────┐
│          HEADLINE CENTRADA           │
│        Sub-headline centrada         │
│        [ CTA ]  [ CTA Ghost ]        │
│                                      │
│      ┌───────────────────────┐       │
│      │   [Product Image /    │       │
│      │    App Screenshot     │       │
│      │    em perspectiva]    │       │
│      └───────────────────────┘       │
│    Logo │ Logo │ Logo │ Logo │ Logo  │
└─────────────────────────────────────┘
```

**Specs técnicos:**
- Texto: `text-center max-w-3xl mx-auto`
- Produto: perspectiva CSS ou imagem 3D pré-renderizada
- Sombra: `shadow-2xl` com leve rotação `rotate-x-1`
- Background: gradient radial sutil atrás do produto

**Dados:** Imagens de produto em perspectiva geram **+24%** mais cliques vs flat screenshots (Baymard, 2025).

### 2.4 Minimal Hero (Texto-First)

**Quando usar:** Produtos técnicos, B2B, quando copy é o diferencial.

```
┌─────────────────────────────────────┐
│                                      │
│                                      │
│       HEADLINE GRANDE BOLD           │
│                                      │
│    Sub-headline com mais detalhes    │
│    sobre o valor entregue            │
│                                      │
│    [ CTA Primário ]                  │
│                                      │
│                                      │
└─────────────────────────────────────┘
```

**Specs técnicos:**
- Headline: `text-5xl md:text-7xl font-bold tracking-tight`
- Max-width: `max-w-4xl` para headline, `max-w-2xl` para sub-headline
- Whitespace generoso: `py-24 md:py-32`
- Background: cor sólida ou gradient sutil

**Dados:** Heroes minimalistas têm **LCP 40% mais rápido** vs image-heavy (HTTP Archive, 2025). Ideais quando performance é prioridade máxima.

---

## 3. Fórmulas de Headline

### 3.1 Regras de Comprimento

| Comprimento | Performance | Uso Ideal |
|-------------|-------------|-----------|
| 5-7 palavras | Melhor recall (+35%) | Mobile, brand awareness |
| 8-12 palavras | Melhor conversão (+20%) | Landing pages, SaaS |
| 13+ palavras | Queda de 15% na atenção | Evitar na hero |

### 3.2 Fórmulas Comprovadas

**Fórmula 1: Benefício Direto**
> [Verbo de Ação] + [Resultado Desejado] + [Sem Objeção Principal]

Exemplos:
- "Crie sites bonitos sem escrever código"
- "Automatize seu marketing sem complexidade"
- "Gerencie equipes remotas com simplicidade"

**Fórmula 2: Antes → Depois**
> De [Situação Atual Ruim] para [Resultado Desejado]

Exemplos:
- "De planilhas caóticas para gestão inteligente"
- "De horas de trabalho manual para automação em minutos"

**Fórmula 3: Quem + O Que**
> [Ferramenta/Produto] que [Audiência] [usa para resultado]

Exemplos:
- "O CRM que startups usam para crescer 3x"
- "A plataforma que designers usam para colaborar em tempo real"

**Fórmula 4: Superlativo com Prova**
> O [superlativo] [categoria] do [mercado/nicho]

Exemplos:
- "A forma mais rápida de construir APIs" (Usar dados: "Deploy em < 5 min")
- "O editor mais amado por desenvolvedores" (Usar prova: "★4.9 no G2")

**Fórmula 5: Provocativa (Question)**
> [Pergunta que expõe a dor] + Resposta implícita no sub-headline

Exemplos:
- "Ainda perdendo clientes por formulários complexos?"
- "Quanto tempo sua equipe desperdiça em reuniões desnecessárias?"

### 3.3 Anti-Padrões de Headline

| Anti-Padrão | Problema | Conversão |
|-------------|----------|-----------|
| "Bem-vindo ao nosso site" | Zero valor, genérico | -40% vs benefício |
| "Solução inovadora para empresas" | Buzzword vazio | -25% vs específico |
| "Plataforma all-in-one" | Não comunica benefício | -20% vs nicho |
| Headline > 15 palavras | Cognitive overload | -15% vs conciso |

---

## 4. Otimização de CTA na Hero

### 4.1 Texto do CTA

| Texto | Tipo | Conversão Relativa |
|-------|------|-------------------|
| "Começar grátis" | Específico + Low-risk | Baseline (+3-7% vs genérico) |
| "Ver demonstração" | Específico | +5% vs "Saiba mais" |
| "Criar minha conta" | Possessivo | +2% vs "Criar conta" |
| "Testar por 14 dias" | Específico + Temporal | +4% vs "Começar" |
| "Enviar" / "Clique aqui" | Genérico | -15% vs específico |

### 4.2 Hierarquia Visual de CTAs

```tsx
{/* CTA Stack na Hero */}
<div className="flex flex-col sm:flex-row gap-4">
  {/* Primário — Ação principal */}
  <Button size="lg" className="min-w-[200px]">
    Começar grátis
  </Button>

  {/* Secundário — Alternativa de menor comprometimento */}
  <Button variant="outline" size="lg">
    Ver demonstração
  </Button>
</div>
```

### 4.3 Micro-Copy Abaixo do CTA

Reduz fricção em **+8-12%** (Baymard, 2025):

- "Sem cartão de crédito • Setup em 2 min"
- "Grátis para sempre até 10 usuários"
- "Cancele quando quiser, sem burocracia"
- "Usado por 10.000+ empresas"

---

## 5. Prova Social na Hero

### 5.1 Padrões de Posicionamento

| Padrão | Quando Usar | Implementação |
|--------|-------------|---------------|
| Logo bar abaixo do CTA | B2B, marcas conhecidas | 4-6 logos em grayscale, `opacity-60 hover:opacity-100` |
| Rating inline com CTA | SaaS, apps | `★ 4.9/5 de 2.000+ avaliações` ao lado do CTA |
| Contagem de clientes | Product-led growth | `Usado por 50.000+ times` abaixo do headline |
| Micro-testimonial | Alta confiança necessária | Foto + quote curta + nome/cargo |
| Badge de premiação | Autoridade | G2 badge, Product Hunt badge |

### 5.2 Regra dos Números Reais

- Use números reais, não arredondados: "12.847 empresas" > "10.000+ empresas"
- Números específicos geram **+18% mais trust** (Nielsen Norman, 2025)
- Atualize dinamicamente quando possível (via API ou rebuild)

---

## 6. Otimização de Imagem para LCP

A imagem hero é o elemento LCP mais comum (**72% das páginas** — HTTP Archive, 2025).

### 6.1 Checklist de Performance

```tsx
import Image from 'next/image'

<Image
  src="/hero-image.avif"
  alt="Descrição detalhada e útil"
  width={1200}
  height={630}
  priority                           // Preload — CRÍTICO para LCP
  sizes="100vw"                      // Full-width hero
  quality={75}                       // Equilíbrio qualidade/tamanho
  placeholder="blur"                 // Evita CLS
  blurDataURL={shimmerBase64}        // Placeholder inline base64
/>
```

### 6.2 Formato e Tamanho

| Formato | Uso | Suporte (2026) | Economia vs JPEG |
|---------|-----|----------------|------------------|
| AVIF | Preferencial | 93% browsers | -50% tamanho |
| WebP | Fallback | 97% browsers | -30% tamanho |
| JPEG | Legacy fallback | 100% browsers | Baseline |

### 6.3 Tamanhos Recomendados

| Breakpoint | Largura Imagem | Sizes Prop |
|------------|---------------|------------|
| Mobile (<640px) | 640px | 100vw |
| Tablet (640-1024px) | 1024px | 100vw |
| Desktop (1024-1440px) | 1440px | 100vw |
| Wide (>1440px) | 1920px | 100vw |

Para split hero, substitua `100vw` por `50vw` em viewports > 1024px:
```
sizes="(max-width: 1024px) 100vw, 50vw"
```

---

## 7. Animações na Hero

### 7.1 Princípios de Animação

| Princípio | Regra | Motivo |
|-----------|-------|--------|
| GPU-only | Apenas `transform` e `opacity` | Evitar layout shifts, manter 60fps |
| Duração | 300-600ms para entrada | Perceptível mas não lento |
| Physics | Spring > linear/ease | Mais natural, dados de preferência +15% |
| Delay | Stagger 50-100ms entre elementos | Guia o olhar na hierarquia |
| Redução | `prefers-reduced-motion: reduce` | Acessibilidade obrigatória |

### 7.2 Sequência de Animação Recomendada

```tsx
const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
}

// Ordem de aparição: Headline → Sub-headline → CTA → Prova Social → Imagem
```

### 7.3 Hero com Vídeo Background

- **Autoplay:** `autoplay muted loop playsInline`
- **Poster:** imagem estática como fallback e LCP (OBRIGATÓRIO)
- **Tamanho:** max 3-5MB, 720p é suficiente para background
- **Formato:** MP4 (H.264) com fallback WebM
- **Mobile:** considerar imagem estática para economia de dados — `(prefers-reduced-data: reduce)` quando disponível

---

## 8. Considerações Mobile (60%+ do Tráfego)

### 8.1 Dados de Tráfego Mobile (2026)

- **63%** do tráfego web global é mobile (Statcounter, 2026)
- **53%** dos visitantes mobile abandonam se carregar > 3 segundos
- **70%** das conversões SaaS B2B iniciam em mobile (pesquisa, depois convertem em desktop)

### 8.2 Adaptações Obrigatórias

| Elemento | Desktop | Mobile |
|----------|---------|--------|
| Headline | `text-5xl` a `text-7xl` | `text-3xl` a `text-4xl` |
| Sub-headline | 2-3 linhas | 2 linhas max |
| CTA | Inline (lado a lado) | Stack vertical, full-width |
| Imagem | Ao lado ou atrás | Abaixo do CTA ou oculta |
| Logo bar | 5-6 logos | 3-4 logos |
| Espaçamento | `py-24` a `py-32` | `py-16` a `py-20` |

### 8.3 Touch Targets

- CTA mínimo: **48×48px** (WCAG 2.2 AA) — recomendado **56×48px**
- Espaço entre botões: mínimo **16px**
- Área de toque: incluir padding no cálculo

---

## 9. Prioridades de A/B Testing

Impacto estimado por elemento testável, ordenado por ROI de teste:

| Prioridade | Teste | Impacto Potencial | Facilidade |
|------------|-------|-------------------|------------|
| 🔴 P0 | Headline (benefício vs feature) | +20-30% | Alta |
| 🔴 P0 | Texto do CTA (específico vs genérico) | +3-15% | Alta |
| 🟡 P1 | Layout (split vs centered) | +10-20% | Média |
| 🟡 P1 | Presença de prova social | +10-15% | Alta |
| 🟡 P1 | Cor do CTA (contraste) | +5-10% | Alta |
| 🟢 P2 | Sub-headline (com vs sem) | +5-8% | Alta |
| 🟢 P2 | Micro-copy abaixo do CTA | +3-8% | Alta |
| 🟢 P2 | Tipo de visual (foto vs ilustração) | +5-15% | Média |
| 🔵 P3 | Animação (com vs sem) | +2-5% | Média |
| 🔵 P3 | Background (vídeo vs imagem) | +3-8% | Baixa |

### 9.1 Metodologia de Teste

1. **Tamanho mínimo da amostra:** 1.000 visitantes por variante (mínimo estatístico)
2. **Duração mínima:** 2 semanas completas (capturar ciclos semanais)
3. **Significância:** 95% de confiança (p < 0.05)
4. **Uma variável por vez:** testar headline E cta simultaneamente polui resultados
5. **Segmentar por dispositivo:** mobile e desktop podem ter vencedores diferentes

---

## 10. Exemplo Completo — Hero SaaS Split

```tsx
import { motion } from 'framer-motion'
import Image from 'next/image'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
}

export function HeroSaaS() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium">
                ✨ Novo: Integração com IA
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              Automatize seu marketing sem complexidade
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-lg text-lg text-muted-foreground text-pretty"
            >
              A plataforma que equipes de growth usam para criar, testar e
              escalar campanhas — tudo em um só lugar.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <Button size="lg" className="min-w-[200px]">
                Começar grátis
              </Button>
              <Button variant="outline" size="lg">
                Ver demonstração
              </Button>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-sm text-muted-foreground"
            >
              Sem cartão de crédito · Setup em 2 min · Cancele quando quiser
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex items-center gap-6"
            >
              {['vercel', 'stripe', 'linear', 'notion'].map((logo) => (
                <Image
                  key={logo}
                  src={`/logos/${logo}.svg`}
                  alt={logo}
                  width={100}
                  height={32}
                  className="h-8 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
                />
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: 'spring',
              stiffness: 60,
              damping: 20,
              delay: 0.3,
            }}
          >
            <Image
              src="/hero-dashboard.avif"
              alt="Dashboard mostrando métricas de campanha em tempo real"
              width={1200}
              height={800}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={75}
              className="rounded-2xl shadow-2xl ring-1 ring-border"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

---

## Fontes e Referências

- Unbounce Conversion Benchmark Report 2025
- ConversionXL Landing Page Research 2025
- Baymard Institute UX Research 2025
- Nielsen Norman Group: F-Pattern Studies (atualizado 2025)
- HTTP Archive Web Almanac 2025 — Performance Chapter
- Google Web Vitals Documentation 2026
- PageFly SaaS Landing Page Analysis 2025
- Statcounter Global Stats Q1 2026
