---
id: cmd-gen-copy
title: Gerar Copy e Textos
version: 2.0
last_updated: 2026-04-07
category: generate
agent: 05-asset-creator
skills:
  - gen-copy-headline
  - gen-copy-description
---

# `/gen-copy [tipo] [contexto]`

Gera textos de conversão otimizados para diferentes partes do site. Analisa o contexto, seleciona a fórmula de copywriting mais adequada (PAS, AIDA, BAB), gera variantes, e respeita limites de caracteres por tipo.

---

## Parâmetros

| Parâmetro | Obrigatório | Valores Aceitos | Descrição |
|-----------|-------------|-----------------|-----------|
| `tipo` | ✅ Sim | `headline` · `subheadline` · `description` · `cta` · `feature` · `meta-description` | Tipo de texto que define fórmula, extensão e tom |
| `contexto` | ✅ Sim | String descritiva (ex: `"hero section de um SaaS de gestão para startups"`) | Contexto da página/section onde o texto será usado |

---

## Especificação por Tipo de Copy

### `headline`
- **Limite:** 6–12 palavras (40–80 caracteres)
- **Fórmula primária:** Benefício + Diferencial + Público
- **Tom:** Direto, impactante, sem jargão
- **Variantes:** 5 opções (1 emocional, 1 racional, 1 curiosidade, 1 urgência, 1 aspiracional)
- **Onde:** Hero h1, section h2, card titles
- **SEO:** Incluir keyword principal naturalmente

```
Exemplos:
✅ "Transforme Dados em Decisões que Geram Receita" (benefício claro)
✅ "O CRM que Startups Usam para Crescer 3x Mais Rápido" (prova social)
❌ "Bem-vindo ao Nosso Incrível Produto" (genérico, sem benefício)
❌ "Solução Enterprise-Grade Best-in-Class" (jargão corporativo)
```

### `subheadline`
- **Limite:** 15–30 palavras (80–200 caracteres)
- **Fórmula primária:** Expandir headline + Como funciona + Prova
- **Tom:** Explicativo, persuasivo, complementar ao headline
- **Variantes:** 3 opções
- **Onde:** Abaixo do headline principal, descrição de section

```
Exemplos:
✅ "Automatize o acompanhamento de leads, feche negócios 40% mais rápido e tenha visibilidade completa do seu pipeline — tudo em uma interface que sua equipe vai adorar."
❌ "Nosso produto é muito bom e tem muitas funcionalidades incríveis."
```

### `description`
- **Limite:** 30–80 palavras (150–500 caracteres)
- **Fórmula primária:** PAS (Problema → Agitação → Solução) ou BAB (Before → After → Bridge)
- **Tom:** Narrativo, empático, orientado ao benefício
- **Variantes:** 3 opções
- **Onde:** Seções de features, cards de produto, blocos informativos

### `cta`
- **Limite:** 2–5 palavras (10–35 caracteres)
- **Fórmula primária:** Verbo de ação + Benefício implícito
- **Tom:** Urgente, claro, sem ambiguidade
- **Variantes:** 5 opções (variando nível de urgência)
- **Onde:** Botões, links de ação, formulários

```
Exemplos por nível de urgência:
Baixo:  "Saiba Mais" · "Conhecer Planos" · "Ver Demonstração"
Médio:  "Comece Agora" · "Experimentar Grátis" · "Agendar Demo"
Alto:   "Quero Começar Hoje" · "Garantir Minha Vaga" · "Ativar Agora"
```

### `feature`
- **Limite:** Título (3–6 palavras) + Descrição (15–30 palavras)
- **Fórmula primária:** Benefício como título + Como funciona como descrição
- **Tom:** Conciso, orientado ao resultado
- **Variantes:** 1 opção por feature (título + descrição)
- **Onde:** Feature grids, comparison tables, listas de benefícios

```
Exemplo:
Título: "Relatórios em Tempo Real"
Descrição: "Acompanhe métricas de desempenho ao vivo com dashboards customizáveis que atualizam automaticamente conforme novos dados chegam."
```

### `meta-description`
- **Limite:** 120–160 caracteres (ESTRITO — Google trunca após 160)
- **Fórmula primária:** Keyword + Benefício + CTA implícito
- **Tom:** Informativo, persuasivo, otimizado para clique no SERP
- **Variantes:** 3 opções
- **Onde:** Tag `<meta name="description">`, Open Graph description

```
Exemplos:
✅ "Gerencie projetos com IA que prioriza tarefas automaticamente. Usado por +5.000 startups. Teste grátis por 14 dias." (154 chars)
❌ "Somos a melhor empresa de software do Brasil." (sem keyword, sem benefício)
```

---

## Fórmulas de Copywriting

### PAS (Problem → Agitation → Solution)
```
Problema: Identificar a dor do público
Agitação: Amplificar a consequência de não resolver
Solução: Apresentar o produto como resposta
```
**Quando usar:** Features, descrições de produto, emails

### AIDA (Attention → Interest → Desire → Action)
```
Atenção: Hook visual ou textual
Interesse: Benefício relevante
Desejo: Prova social, escassez, exclusividade
Ação: CTA claro
```
**Quando usar:** Landing pages, hero sections, ads

### BAB (Before → After → Bridge)
```
Antes: Situação atual do público (com dor)
Depois: Situação ideal (com benefício)
Ponte: O produto como caminho entre os dois
```
**Quando usar:** About pages, testimonials, case studies

---

## Passo a Passo de Execução

### Passo 1 — Analisar o contexto
Identificar: público-alvo, nicho, proposta de valor, página/section de destino.

### Passo 2 — Selecionar fórmula
Escolher entre PAS, AIDA, BAB baseado no tipo de copy e posição no funil.

### Passo 3 — Gerar variantes
Produzir N variantes conforme especificação do tipo, cada uma com abordagem diferente (emocional, racional, urgência, etc.).

### Passo 4 — Validar limites
Verificar que cada variante está dentro dos limites de caracteres.

### Passo 5 — Otimizar para SEO (se aplicável)
Para `headline` e `meta-description`: incluir keyword principal naturalmente, evitar stuffing.

---

## Formato de Saída

```json
{
  "type": "headline",
  "context": "Hero section de um SaaS de gestão para startups",
  "formula": "AIDA",
  "variants": [
    {
      "id": 1,
      "text": "Gerencie Sua Startup Como as Grandes Empresas",
      "approach": "aspiracional",
      "chars": 47,
      "keyword": "gestão startup"
    },
    {
      "id": 2,
      "text": "De Planilhas ao Crescimento: Gestão que Escala",
      "approach": "before-after",
      "chars": 47,
      "keyword": "gestão escala"
    },
    {
      "id": 3,
      "text": "+5.000 Startups Já Eliminaram o Caos Operacional",
      "approach": "prova-social",
      "chars": 49,
      "keyword": "startups operacional"
    },
    {
      "id": 4,
      "text": "Pare de Perder Tempo com Processos Manuais",
      "approach": "dor",
      "chars": 43,
      "keyword": "processos manuais"
    },
    {
      "id": 5,
      "text": "A Gestão Inteligente que Sua Startup Merece",
      "approach": "emocional",
      "chars": 44,
      "keyword": "gestão inteligente startup"
    }
  ],
  "recommendation": 3,
  "reasoning": "Variante 3 combina prova social (5.000 startups) com dor resolvida (caos operacional), gerando credibilidade e urgência."
}
```

---

## Regras de Qualidade

1. **Sem clichês** — evitar "solução inovadora", "best-in-class", "cutting-edge"
2. **Benefício > Feature** — sempre liderar com o resultado, não a funcionalidade
3. **Específico > Genérico** — números, nomes, prazos concretos
4. **pt-BR nativo** — usar português brasileiro natural, sem anglicismos desnecessários
5. **Escaneabilidade** — textos longos devem ser quebrados em frases curtas
6. **Acessibilidade** — linguagem clara, nível de leitura 8ª série

---

## Saída Esperada

```
✅ Copy gerada — [tipo] para contexto: "[contexto]"
├── Fórmula: [PAS/AIDA/BAB]
├── [N] variantes geradas
├── Limites de caracteres respeitados
├── Keyword principal incluída (se SEO)
├── Recomendação: variante #[N]
└── Justificativa da recomendação
```

---

## Exemplo de Uso

```
/gen-copy headline "hero section de um SaaS de gestão para startups"
/gen-copy subheadline "seção de features de uma cafeteria artesanal"
/gen-copy description "card de produto de moda sustentável"
/gen-copy cta "botão de signup na página de pricing de fintech"
/gen-copy feature "automação de emails para plataforma de educação"
/gen-copy meta-description "página inicial de clínica de dermatologia"
```
