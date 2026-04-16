---
id: doc-ux-principles
title: Princípios de UX
version: 2.0
last_updated: 2026-04-07
category: ux-ui
priority: critical
related:
  - docs/web-excellence/ux-ui/02_UI_PATTERNS.md
  - docs/web-excellence/ux-ui/03_MOTION_GUIDELINES.md
  - docs/web-excellence/ux-ui/04_ACCESSIBILITY_GUIDE.md
  - docs/web-excellence/seo/02_SEO_CONTENT.md
---

# Princípios de UX — Dados de 2026

## 1. A Janela de Decisão de 3-5 Segundos

Dados do Google UX Research (2025) e Baymard Institute (2026) convergem: um usuário decide se permanece ou abandona uma página em **3-5 segundos**. Esse período determina o destino de toda a experiência subsequente.

### 1.1 O Que o Usuário Avalia nos Primeiros 3 Segundos

| Segundo | Processo Cognitivo | O que Precisa Existir |
|---|---|---|
| 0-1s | Orientação visual: "Onde estou?" | Logo, navegação reconhecível, hierarquia clara |
| 1-2s | Proposta de valor: "Isso é para mim?" | Headline clara, subtítulo que comunica benefício |
| 2-3s | Call-to-action: "O que faço aqui?" | CTA visível, caminho de ação óbvio |
| 3-5s | Credibilidade: "Posso confiar?" | Social proof, design profissional, sem erros |

### 1.2 Implicações para Design

- **Above the fold:** Headline + proposta de valor + CTA devem ser visíveis sem scroll em qualquer dispositivo
- **LCP obrigatório < 2.5s:** Se a página não renderiza a tempo, o usuário não inicia a avaliação
- **Zero ambiguidade:** A headline deve comunicar valor em 6-12 palavras
- **CTA com contraste máximo:** Deve ser o elemento mais proeminente da viewport inicial

### 1.3 Dados de Suporte

- Bounce rate médio: 47% em mobile, 38% em desktop (Contentsquare Digital Experience Benchmark 2026)
- Páginas que carregam em 1s vs. 5s: 90% mais conversões (Google/Deloitte 2025)
- Users que encontram proposta de valor em < 3s: 2.7x mais propensos a converter

## 2. F-Pattern de Scanning

Pesquisa consolidada (Nielsen Norman Group, atualizada 2025) sobre como usuários escaneiam páginas web.

### 2.1 Padrão F (Conteúdo Textual)

```
████████████████████████   ← Primeira barra horizontal (headline)
████████████████████████
████████████████████         ← Segunda barra (subtítulo/primeiro parágrafo)
████████████████
████                         ← Movimento vertical pelo lado esquerdo
████
████
████
████
```

### 2.2 Padrão Z (Landing Pages)

```
████████████████████████   ← Topo esquerdo → topo direito (logo → nav/CTA)
          ████               ← Diagonal descendente
████████████████████████   ← Inferior esquerdo → inferior direito (conteúdo → CTA)
```

### 2.3 Implicações Práticas

1. **Informação crítica à esquerda:** Headlines, benefícios, preços
2. **Primeira linha é mais lida:** 80% dos usuários leem a primeira linha; apenas 20% leem além da dobra
3. **Front-load conteúdo:** As 2 primeiras palavras de cada linha são as mais percebidas
4. **CTA no final da linha de escaneamento:** Canto superior direito (nav) ou inferior direito (seção)
5. **Quebrar padrão F com elementos visuais:** Imagens, ícones e cores resetam o scanning

## 3. Redução de Carga Cognitiva

### 3.1 Teoria da Carga Cognitiva (Sweller, 1988; atualização Mayer 2025)

A memória de trabalho processa **4±1 chunks** simultaneamente. Cada decisão, elemento visual ou texto competindo por atenção consome capacidade.

### 3.2 Estratégias de Redução

| Estratégia | Implementação | Impacto |
|---|---|---|
| Chunking | Agrupar informações relacionadas com cards, seções, dividers | -30% tempo de processamento |
| Defaults inteligentes | Pré-selecionar opções mais comuns em forms | -25% abandonos em forms |
| Reconhecimento > Recall | Menus visíveis, autocomplete, sugestões | -40% erros de input |
| Eliminação | Remover campos opcionais, simplificar navegação | +20% completude de tasks |
| Progressive disclosure | Mostrar detalhes sob demanda (expandable, tabs) | -35% overwhelm percebido |
| Consistência | Mesmos padrões em todo o sistema | -50% curva de aprendizado |

### 3.3 Regra dos 7±2 (Miller, 1956) — Atualização 2026

Revisão de Cowan (2001, confirmada em meta-análise 2025): o limite real é **4±1 items**, não 7±2. Aplicação:
- Menu de navegação: máximo 5-7 itens no nível principal
- Opções de pricing: 3 tiers (recomendado) a 4 (máximo)
- Passos de formulário: 3-5 etapas visíveis
- Cards em grid visível: 3-4 por linha (sem scroll)

## 4. Progressive Disclosure

### 4.1 Princípio

Apresente apenas o necessário para a decisão atual. Detalhes ficam acessíveis sob demanda.

### 4.2 Padrões de Implementação

| Padrão | Quando Usar | Exemplo |
|---|---|---|
| Accordion | FAQ, configurações com muitas seções | Pergunta visível, resposta expandível |
| Tabs | Conteúdo paralelo de mesmo nível | Pricing mensal/anual |
| Modal / Sheet | Ação secundária que precisa de foco | Formulário de edição |
| Tooltip | Informação auxiliar rápida | Explicação de termos |
| Read more | Textos longos | Descrições de features |
| Stepper | Processos multi-etapa | Checkout, onboarding |
| Expandable card | Preview → detalhe | Lista de resultados |

### 4.3 Regra de Ouro

> Se removesse esse elemento, o usuário ainda conseguiria completar a tarefa principal da página? Se sim, considere escondê-lo atrás de progressive disclosure.

## 5. Lei de Fitts (1954)

### 5.1 Fórmula

```
T = a + b × log₂(1 + D/W)

T = tempo para alcançar o alvo
D = distância até o alvo
W = largura (tamanho) do alvo
```

Implicação: **alvos maiores e mais próximos são mais rápidos de atingir.**

### 5.2 Aplicações Web 2026

| Aplicação | Regra | Valor Mínimo |
|---|---|---|
| Botão primário | Maior e mais proeminente da página | 44×44px mínimo, 48×48px recomendado |
| Touch target mobile | Dedo = ~7mm de contato | 48×48px (Material Design) |
| Área de clique de links | Expandir com padding | padding: 8px mínimo |
| Navegação principal | Posicionar nas bordas (Fitts: bordas são infinitas) | sticky no topo |
| CTA floating | Canto inferior direito (Fitts: canto = fácil) | 56×56px FAB |
| Menu dropdown | Itens grandes, sem gap entre eles | min-height: 40px por item |

### 5.3 Fitts para Botões de Ação

```
Primário:    height: 48px, padding: 24px horizontal  → Maior target
Secundário:  height: 40px, padding: 20px horizontal  → Menor, mas acessível
Terciário:   height: 36px, padding: 16px horizontal  → Compacto
Ghost/Link:  padding: 8px                            → Expandir área clicável
```

## 6. Lei de Hick (1952)

### 6.1 Fórmula

```
T = b × log₂(n + 1)

T = tempo de decisão
n = número de opções
```

**Mais opções = mais tempo para decidir = mais abandono.**

### 6.2 Dados de Suporte

- Estudo Iyengar & Lepper (2000, replicado em 2024 digital): 6 opções → 30% taxa de escolha. 24 opções → 3% taxa de escolha.
- Conversion Rate Optimization Report 2025: Reduzir campos de form de 11 para 4 → +120% conversão
- Página de pricing com 3 planos vs. 5 planos → +34% seleção de plano (HubSpot A/B test 2025)

### 6.3 Aplicações

| Contexto | Máximo de Opções | Estratégia se Exceder |
|---|---|---|
| Nav principal | 5-7 | Agrupar em "Mais" ou mega menu |
| Pricing | 3 (máx 4) | Destacar "Recomendado" |
| Filtros visíveis | 4-6 | Restante em "Mais filtros" |
| Opções de form | 5-8 por grupo | Radio → Select se > 8 |
| CTAs por seção | 1 primário + 1 secundário | Nunca 3+ CTAs competindo |
| Steps de onboarding | 3-5 | Dividir em sub-fluxos |

## 7. Lei de Jakob (2000)

### 7.1 Princípio

> Usuários passam a maior parte do tempo em **outros** sites. Eles preferem que seu site funcione como os sites que já conhecem.

### 7.2 Convenções Invioláveis (2026)

| Elemento | Convenção Esperada | Violar = Confusão |
|---|---|---|
| Logo | Topo esquerdo → link para home | Logo no centro ou sem link |
| Menu hambúrguer | 3 linhas, canto superior direito (mobile) | Ícone customizado |
| Busca | Ícone de lupa, topo direito, expandível | Posição incomum |
| Cart/Bag | Canto superior direito, com badge de quantidade | Texto "carrinho" sem ícone |
| CTA primário | Cor mais saturada, posição proeminente | Botão ghost para ação principal |
| Links | Azul ou cor de destaque + underline (body) | Texto não-clicável que parece link |
| Back | Seta ← no topo esquerdo (mobile) | Texto "voltar" sem seta |
| Scroll indicator | Seta ↓ ou dots para carousels | Sem indicação de mais conteúdo |
| 404 page | Mensagem clara + link para home + busca | Página completamente em branco |

### 7.3 Quando Inovar

Inovação em UX é válida **apenas quando melhora métricas mensuráveis** (conversion rate, task completion, NPS). Inovar por estética ou diferenciação visual sem dados é risco direto.

## 8. Efeito Estético-Usabilidade (Kurosu & Kashimura, 1995)

### 8.1 Princípio

Interfaces visualmente atraentes são **percebidas como mais fáceis de usar**, mesmo quando a usabilidade real é idêntica. O cérebro associa beleza a qualidade.

### 8.2 Implicações

- Investir em visual polish aumenta tolerância a problemas de usabilidade em ~30%
- Primeira impressão visual afeta toda a experiência subsequente (halo effect)
- Design profissional = percepção de confiabilidade (crucial para e-commerce, SaaS)
- Espaço em branco generoso é percebido como premium e mais usável

### 8.3 Dados 2026

- Stanford Web Credibility Research (atualizado 2025): 75% dos usuários julgam credibilidade de uma empresa pelo design do site
- Adobe State of Create (2025): 38% abandonam site se layout ou imagens forem desagradáveis

## 9. Peak-End Rule (Kahneman, 1999)

### 9.1 Princípio

Pessoas julgam uma experiência com base em como se sentiram no **momento de pico** (melhor ou pior) e no **momento final**, não pela média da experiência.

### 9.2 Aplicação Web

| Momento | Oportunidade | Implementação |
|---|---|---|
| Pico positivo | Momento "wow" ao descobrir feature | Micro-interação deleitosa, animação de sucesso |
| Pico negativo | Erro frustrante, loading infinito | Error handling elegante, skeleton screens |
| Final do fluxo | Confirmação de compra, onboarding completo | Página de sucesso com confetti, próximos passos claros |
| Final de sessão | Logout, fechar aba | Salvar progresso, mensagem amigável |

### 9.3 Exemplos Práticos

```
✅ Bom final: "Pagamento confirmado! 🎉 Seu pedido chega em 2 dias."
   + Animação de confetti + Próximos passos + Link de rastreio

❌ Mau final: "Transação processada. Código: TX-289472-B"
   + Sem feedback visual + Técnico + Sem próximo passo
```

## 10. Psicologia de Conversão

### 10.1 Escassez (Cialdini, 1984)

```
"Restam apenas 3 unidades" → +226% urgência percebida
"Oferta termina em 2h" → +332% taxa de ação vs. sem timer
```

**Uso ético:** Apenas quando a escassez é real. Escassez fabricada detectada destrói confiança permanentemente.

### 10.2 Prova Social

| Tipo | Eficácia | Implementação |
|---|---|---|
| Número de clientes | Alta | "Usado por 10.000+ empresas" |
| Logos de clientes | Alta | Grid de logos reconhecíveis |
| Testimonials | Média-Alta | Citação + foto + nome + cargo |
| Ratings/Reviews | Alta | Estrelas + número de reviews |
| "Mais popular" badge | Média | Tag no plano recomendado |
| Contador em tempo real | Média | "847 pessoas visualizando agora" |

**Dados 2026:** 92% dos consumidores leem reviews antes de comprar (BrightLocal). Testimonials com foto aumentam confiança em 35% vs. texto sozinho.

### 10.3 Reciprocidade

Oferecer valor gratuito antes de pedir conversão:
- Free trial sem cartão de crédito (+44% signups vs. trial com cartão)
- Conteúdo gratuito antes de paywall (lead magnet)
- Calculadora/ferramenta gratuita
- Template ou recurso downloadable

### 10.4 Urgência

| Tipo | Exemplo | Nota |
|---|---|---|
| Prazo real | "Inscrições encerram sexta 23:59" | Ética, verificável |
| Countdown timer | Timer visual regressivo | Eficaz se real |
| Disponibilidade limitada | "Vagas limitadas a 50 participantes" | Deve ser verdade |
| Bônus temporal | "Bônus exclusivo para inscrições até amanhã" | Comum em launches |

### 10.5 Anchoring (Kahneman & Tversky)

O primeiro número que o usuário vê influencia toda avaliação subsequente.

```
❌ Sem âncora:  Plano Pro: R$97/mês
✅ Com âncora:  De R$197/mês por R$97/mês (economia de R$1.200/ano)

❌ Sem âncora:  Feature X
✅ Com âncora:  Feature X (economiza 10h/semana para equipes)
```

## 11. Checklist de UX

- [ ] Proposta de valor visível em < 3 segundos?
- [ ] CTA primário acima da dobra em mobile?
- [ ] Navegação segue convenções (Lei de Jakob)?
- [ ] Máximo 1 CTA primário por viewport?
- [ ] Campos de formulário reduzidos ao mínimo?
- [ ] Progressive disclosure implementado onde relevante?
- [ ] Feedback visual para toda ação do usuário (< 100ms)?
- [ ] Página de sucesso (peak-end) é positiva e clara?
- [ ] Social proof visível (logos, testimonials, ratings)?
- [ ] Mobile-first: touch targets ≥ 48px?
