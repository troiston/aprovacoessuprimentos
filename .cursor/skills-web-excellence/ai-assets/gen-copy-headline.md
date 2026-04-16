---
id: skill-gen-copy-headline
title: "Generate Copy Headline"
agent: 05-asset-creator
version: 1.0
category: ai-assets
priority: important
requires:
  - rule: 00-constitution
provides:
  - conversion-headlines
  - ab-test-variants
used_by:
  - agent: 05-asset-creator
  - command: /new-page
---

# Headlines de Conversão com Fórmulas Comprovadas

## Princípios Fundamentais

1. **Benefício > Feature** — "Economize 5h por semana" > "Automação integrada"
2. **Nível de leitura 5ª-7ª série** — frases curtas, palavras simples
3. **Uma ideia por headline** — se precisa de "e", são duas headlines
4. **Verbos de ação** — começar com verbos sempre que possível
5. **Números concretos** — "347 empresas" > "centenas de empresas"

## Fórmulas de Conversão

### PAS — Problem-Agitation-Solution

```
1. PROBLEM: Identifique a dor específica do público
2. AGITATION: Amplifique a dor com consequências
3. SOLUTION: Apresente a solução como alívio

Headline: [Dor específica]? [Sua marca] [verbo de resolução] em [tempo/facilidade].
```

**Exemplos:**
- "Perdendo clientes por site lento? Acelere seu site em 48 horas."
- "Planilhas que nunca fecham? Automatize sua contabilidade em minutos."
- "Equipe desorganizada? Centralize tudo em um painel."

### AIDA — Attention-Interest-Desire-Action

```
1. ATTENTION: Fato surpreendente ou pergunta provocativa
2. INTEREST: Detalhe que aprofunda a atenção
3. DESIRE: Benefício emocional ou resultado tangível
4. ACTION: CTA claro e urgente

Headline (A+I): [Fato surpreendente sobre o problema].
Subheadline (D+A): [Benefício] — [CTA com urgência].
```

**Exemplos:**
- A: "93% dos visitantes nunca voltam a um site lento."
- I: "Cada segundo de loading custa 7% das conversões."
- D: "Sites que carregam em <2s convertem 3x mais."
- A: "Otimize agora — resultado em 24h."

### BAB — Before-After-Bridge

```
1. BEFORE: Situação atual do público (dor)
2. AFTER: Futuro desejado (resultado)
3. BRIDGE: Como chegar lá (sua solução)

Headline: De [situação ruim] para [resultado desejado].
Subheadline: [Marca] é o caminho.
```

**Exemplos:**
- "De planilhas caóticas para relatórios automáticos."
- "De 3h no caixa para fechamento em 15 minutos."
- "De site invisível para primeira página do Google."

## Palavras de Poder

### Urgência
`agora`, `hoje`, `imediato`, `rápido`, `em minutos`, `já`, `antes que`

### Exclusividade
`exclusivo`, `selecionado`, `primeiro`, `limitado`, `convite`, `VIP`

### Resultado
`garantido`, `comprovado`, `resultado`, `transforme`, `conquiste`, `alcance`

### Facilidade
`simples`, `fácil`, `sem complicação`, `automatizado`, `pronto`, `instantâneo`

### Segurança
`seguro`, `protegido`, `confiável`, `certificado`, `aprovado`, `testado`

## Comprimento de Headlines

| Local | Caracteres | Exemplo |
|-------|:----------:|---------|
| Hero H1 | 40-70 | "Crie sites que convertem. Sem código." |
| Subheadline | 80-120 | "Plataforma completa para lançar seu negócio online em horas, não semanas." |
| Card/Feature | 30-50 | "Análises em tempo real" |
| CTA Button | 15-30 | "Comece grátis agora" |
| Meta title | 50-60 | "NomeDaMarca — Sites que Convertem" |

## Variantes A/B por Niche

### Café / Restaurante

```json
{
  "niche": "cafe",
  "hero_variants": [
    {
      "id": "A",
      "formula": "BAB",
      "headline": "De grão selecionado à sua xícara perfeita.",
      "subheadline": "Café artesanal torrado na hora, servido com carinho desde 2018."
    },
    {
      "id": "B",
      "formula": "PAS",
      "headline": "Cansado de café sem alma? Prove a diferença.",
      "subheadline": "Grãos de origem única, torra artesanal, entrega toda semana."
    },
    {
      "id": "C",
      "formula": "AIDA",
      "headline": "O café que baristas escolhem para casa.",
      "subheadline": "Nota 87+ na escala SCA. Experimente o primeiro pacote com 30% off."
    }
  ]
}
```

### SaaS / Tech

```json
{
  "niche": "saas",
  "hero_variants": [
    {
      "id": "A",
      "formula": "PAS",
      "headline": "Dados espalhados em 10 ferramentas? Unifique tudo.",
      "subheadline": "Um painel para métricas, tarefas e comunicação da equipe inteira."
    },
    {
      "id": "B",
      "formula": "BAB",
      "headline": "De horas em planilhas para insights em segundos.",
      "subheadline": "Dashboards automáticos que mostram o que importa, quando importa."
    },
    {
      "id": "C",
      "formula": "AIDA",
      "headline": "347 startups escalaram com essa ferramenta.",
      "subheadline": "Gerencie projetos, clientes e faturamento em um só lugar. Grátis por 14 dias."
    }
  ]
}
```

### E-commerce

```json
{
  "niche": "ecommerce",
  "hero_variants": [
    {
      "id": "A",
      "formula": "BAB",
      "headline": "De looks repetidos para estilo que impressiona.",
      "subheadline": "Peças exclusivas curadas por stylists. Entrega em 24h para SP."
    },
    {
      "id": "B",
      "formula": "PAS",
      "headline": "Não encontra roupas que combinam com você? Nós resolvemos.",
      "subheadline": "Quiz de estilo + curadoria pessoal. Peças que realmente vestem bem."
    },
    {
      "id": "C",
      "formula": "AIDA",
      "headline": "12.000 mulheres já transformaram seu guarda-roupa.",
      "subheadline": "Moda consciente, preço justo. Primeira compra com frete grátis."
    }
  ]
}
```

### Portfolio Criativo

```json
{
  "niche": "portfolio",
  "hero_variants": [
    {
      "id": "A",
      "formula": "direct",
      "headline": "Design que resolve problemas de negócio.",
      "subheadline": "10 anos criando interfaces que convertem para startups e enterprises."
    },
    {
      "id": "B",
      "formula": "BAB",
      "headline": "De briefing confuso para produto que encanta.",
      "subheadline": "Product Design · UI/UX · Design System · Prototipação"
    }
  ]
}
```

### Restaurante

```json
{
  "niche": "restaurant",
  "hero_variants": [
    {
      "id": "A",
      "formula": "direct",
      "headline": "Sabor italiano autêntico no coração de SP.",
      "subheadline": "Massa fresca feita diariamente. Reservas para hoje à noite disponíveis."
    },
    {
      "id": "B",
      "formula": "AIDA",
      "headline": "Avaliado 4.9★ por 2.300 clientes no Google.",
      "subheadline": "Descubra por que somos o italiano favorito da Vila Madalena."
    }
  ]
}
```

## Processo de Validação

1. **Teste de 5 segundos** — alguém entende a proposta de valor em 5s?
2. **Teste de "E daí?"** — cada afirmação responde "e daí?" do leitor?
3. **Teste de especificidade** — trocar o nome da marca muda algo? Se não, é genérico demais.
4. **Teste de nível de leitura** — use hemingwayapp.com, mire em Grade 5-7.
