---
id: doc-seo-content
title: SEO de Conteúdo
version: 2.0
last_updated: 2026-04-07
category: seo
priority: critical
related:
  - docs/web-excellence/seo/01_SEO_TECHNICAL.md
  - docs/web-excellence/seo/05_SEO_CHECKLIST.md
  - docs/web-excellence/ux-ui/01_UX_PRINCIPLES.md
  - docs/web-excellence/ux-ui/04_ACCESSIBILITY_GUIDE.md
---

# SEO de Conteúdo

## 1. Hierarquia de Headings

### 1.1 Regras Fundamentais

| Regra | Detalhe |
|---|---|
| 1 h1 por página | Único, descreve o conteúdo principal |
| Hierarquia sem pular | h1 → h2 → h3, nunca h1 → h3 |
| Descritivos | Heading deve comunicar o conteúdo da seção |
| Keyword no h1 | Incluir keyword principal no h1 |
| h2 para seções | Cada seção principal da página tem h2 |
| h3-h6 para subseções | Aprofundamento lógico |

### 1.2 Estrutura Exemplo

```
h1: Guia Completo de Next.js para Iniciantes (1 por página)
  h2: O que é Next.js
    h3: Diferença entre Next.js e React
    h3: Quando usar Next.js
  h2: Instalação e Configuração
    h3: Pré-requisitos
    h3: Criando um projeto
  h2: Roteamento no App Router
    h3: Rotas estáticas
    h3: Rotas dinâmicas
      h4: Parâmetros de rota
      h4: Catch-all routes
  h2: Conclusão
```

### 1.3 Impacto SEO

- Google usa headings para entender a estrutura e tópicos da página
- Headings aparecem como featured snippets com mais frequência
- Heading bem estruturado ajuda Google a gerar sitelinks

### 1.4 Implementação Semântica

```tsx
{/* ✅ Correto: semântico */}
<h1>Título da Página</h1>
<section>
  <h2>Seção Principal</h2>
  <h3>Subseção</h3>
</section>

{/* ❌ Errado: styling sem semântica */}
<div className="text-4xl font-bold">Título da Página</div>
<div className="text-2xl font-bold">Seção Principal</div>
```

Se precisar de heading visual sem semântica (raro), use `aria-level`:
```tsx
<div role="heading" aria-level={2} className="text-h2">
  Heading visual sem h2 semântico
</div>
```

## 2. Keyword Placement

### 2.1 Posições de Máximo Impacto

| Posição | Prioridade | Detalhe |
|---|---|---|
| Title tag (`<title>`) | Crítica | Primeira palavras = mais peso. Máximo 60 caracteres |
| H1 | Crítica | Deve conter keyword principal naturalmente |
| Meta description | Alta | Não é fator direto, mas afeta CTR. 150-160 caracteres |
| URL slug | Alta | `/blog/keyword-principal` |
| Primeiro parágrafo | Alta | Keyword nas primeiras 100 palavras |
| H2 headings | Média | Keywords secundárias em subtítulos |
| Alt text de imagens | Média | Keyword quando relevante à imagem |
| Corpo do texto | Média | Distribuição natural, sem stuffing |
| Anchor text interno | Média | Links internos com texto descritivo |
| Schema markup | Baixa | name, description em structured data |

### 2.2 Densidade de Keyword

**Não existe "densidade ideal".** Google usa NLP e entende sinônimos, variações e contexto. Foque em:

- **Keyword principal:** 2-5 vezes na página (título, h1, primeiro parágrafo, corpo, conclusão)
- **Keywords relacionadas/LSI:** Naturalmente ao longo do texto
- **Evitar:** Repetição forçada, keyword stuffing (penalizado desde Panda 2011)

### 2.3 Title Tag Best Practices

```
Formato ideal: [Keyword Principal] — [Benefício/Contexto] | [Brand]
Exemplos:
  "Next.js para Iniciantes — Guia Completo 2026 | Empresa"
  "Pricing — Planos que Crescem com Você | Empresa"
  "Como Criar Landing Pages que Convertem | Empresa Blog"

Limites:
  - 50-60 caracteres (Google trunca em ~60)
  - Keyword no início quando possível
  - Cada página tem title único
```

### 2.4 Meta Description Best Practices

```
- 150-160 caracteres (Google trunca após ~160)
- Incluir keyword principal (Google destaca em bold nos resultados)
- Incluir call-to-action ("Saiba mais", "Comece grátis", "Descubra como")
- Resumir a proposta de valor da página
- Única por página (nunca duplicar entre páginas)
- Se omitida, Google gera automaticamente (nem sempre ideal)
```

## 3. Estratégia de Internal Linking

### 3.1 Por que Internal Links Importam

- Distribuem PageRank (link equity) entre páginas
- Ajudam Googlebot a descobrir e rastrear conteúdo
- Estabelecem hierarquia e relevância temática
- Reduzem bounce rate (usuário navega mais)
- Criam "topic clusters" que demonstram authority

### 3.2 Regras de Internal Linking

| Regra | Detalhe |
|---|---|
| 3-5 links internos por página | Mínimo para distribuir equity |
| Anchor text descritivo | "guia de tipografia" e não "clique aqui" |
| Link contextual | No corpo do texto, não só no footer |
| Hierarquia hub→spoke | Página hub (pilar) linka para spoke (artigos) e vice-versa |
| Sem orphan pages | Toda página deve ter pelo menos 1 link apontando para ela |
| Links para páginas de conversão | Incluir links para /pricing, /signup em conteúdo relevante |
| Evitar excesso | Mais de 100 links por página dilui equity |

### 3.3 Topic Cluster Model

```
                    ┌─────────────┐
            ┌───────┤  Página Hub  ├───────┐
            │       │  (Pilar)     │       │
            │       └──────┬──────┘       │
            │              │              │
     ┌──────▼──────┐ ┌────▼─────┐ ┌──────▼──────┐
     │ Spoke Post 1│ │ Spoke    │ │ Spoke Post 3│
     │ (subtópico) │ │ Post 2   │ │ (subtópico) │
     └──────┬──────┘ └────┬─────┘ └──────┬──────┘
            │              │              │
            └──────────────┼──────────────┘
                  Cross-linking entre spokes
```

**Exemplo prático:**
- Hub: "Guia Completo de SEO para Next.js"
- Spoke 1: "SEO Técnico: Metadata API"
- Spoke 2: "Core Web Vitals: Otimização"
- Spoke 3: "Structured Data: JSON-LD"

### 3.4 Implementação

```tsx
{/* ✅ Correto: anchor text descritivo, link contextual */}
<p>
  Para melhorar a performance, siga nosso{' '}
  <Link href="/blog/core-web-vitals-otimizacao">
    guia de otimização de Core Web Vitals
  </Link>{' '}
  que cobre LCP, CLS e INP em detalhes.
</p>

{/* ❌ Errado: anchor text genérico */}
<p>
  Para melhorar a performance, <Link href="/blog/core-web-vitals-otimizacao">clique aqui</Link>.
</p>
```

## 4. Alt Text para Imagens

### 4.1 Regras

| Tipo de Imagem | Alt Text | Exemplo |
|---|---|---|
| Informativa (foto, diagrama) | Descrever conteúdo e propósito | `alt="Dashboard mostrando métricas de performance em tempo real"` |
| Decorativa (ornamento, background) | Vazio | `alt=""` |
| Funcional (botão, link) | Descrever a ação | `alt="Ir para a homepage"` |
| Texto em imagem | Reproduzir o texto | `alt="30% de desconto em todos os planos"` |
| Complexa (gráfico, infográfico) | Resumo + link para descrição completa | `alt="Gráfico de crescimento 2024-2026"` + longdesc |

### 4.2 Best Practices

```
✅ Bom: "Equipe de desenvolvimento colaborando em torno de uma mesa com laptops"
❌ Ruim: "imagem" / "foto" / "img_001.jpg"
❌ Ruim: "equipe equipe desenvolvimento software empresa tecnologia" (keyword stuffing)

Limites:
- Ideal: 80-125 caracteres
- Máximo: 150 caracteres
- Sem "Imagem de..." ou "Foto de..." (screen readers já anunciam "imagem")
- Incluir keyword quando natural e relevante
```

## 5. Content Freshness Signals

### 5.1 Por que Freshness Importa

Google usa sinais de atualização (Query Deserves Freshness) para queries que pedem informação recente:
- Trending topics
- Eventos recorrentes ("melhores frameworks 2026")
- Informação que muda frequentemente (preços, stats)

### 5.2 Sinais de Freshness

| Sinal | Implementação |
|---|---|
| Data de publicação | `datePublished` em JSON-LD + visível na página |
| Data de atualização | `dateModified` em JSON-LD + "Atualizado em..." visível |
| Conteúdo atualizado | Revisão periódica com dados novos |
| Último crawl | Sitemap `lastmod` atualizado |
| Year in title | "Guia SEO 2026" — Google prioriza para queries com ano |

### 5.3 Estratégia de Atualização

```
Frequência recomendada por tipo de conteúdo:
- Guides/tutorials: A cada 6-12 meses
- Listas "melhores X": A cada 3-6 meses (ou quando há mudanças)
- Páginas de pricing: Imediatamente quando muda
- Landing pages: Trimestral (A/B testing contínuo)
- Documentação técnica: A cada release
```

## 6. E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)

### 6.1 O que é E-E-A-T

Não é fator de ranking direto, mas é o framework que Quality Raters do Google usam para avaliar qualidade. Sites que demonstram E-E-A-T tendem a ranquear melhor, especialmente em YMYL (Your Money or Your Life).

| Dimensão | Significado | Demonstração |
|---|---|---|
| **Experience** | O autor tem experiência real com o tópico | Exemplos pessoais, screenshots, cases reais |
| **Expertise** | O autor tem conhecimento técnico profundo | Credenciais, bio detalhada, conteúdo técnico preciso |
| **Authoritativeness** | O site/autor é referência no tema | Backlinks de sites respeitados, citações, menções |
| **Trustworthiness** | O site é confiável | HTTPS, política de privacidade, informações de contato, reviews reais |

### 6.2 Implementação Prática

```tsx
{/* Author bio em posts */}
<div className="flex items-center gap-4 mt-8 p-4 bg-surface-elevated rounded-xl">
  <Image src={author.avatar} alt="" width={64} height={64} className="rounded-full" />
  <div>
    <p className="font-semibold">{author.name}</p>
    <p className="text-sm text-text-secondary">{author.title} — {author.company}</p>
    <p className="text-sm text-text-secondary">{author.bio}</p>
    <div className="flex gap-2 mt-2">
      <a href={author.twitter}>Twitter</a>
      <a href={author.linkedin}>LinkedIn</a>
    </div>
  </div>
</div>
```

### 6.3 Checklist E-E-A-T

- [ ] Página "Sobre" com informações da empresa/equipe?
- [ ] Página de contato com endereço físico, telefone, email?
- [ ] Autores identificados em blog posts com bio e credenciais?
- [ ] Política de privacidade e termos de uso?
- [ ] HTTPS em todo o site?
- [ ] Testimonials e reviews reais com nomes e fotos?
- [ ] Referências e fontes citadas em conteúdo informativo?
- [ ] Data de publicação e atualização visíveis?

## 7. Readability (Legibilidade)

### 7.1 Dados

- Conteúdo no nível de 5ª-7ª série (grau de leitura) tem taxa de conversão 36% maior que conteúdo acadêmico (Contently 2025)
- Tempo médio na página: 54 segundos. Conteúdo precisa comunicar valor rápido.
- Parágrafos de 2-3 linhas têm 58% mais engajamento que parágrafos de 7+ linhas (Medium data)

### 7.2 Regras de Legibilidade Web

| Regra | Detalhe |
|---|---|
| Frases curtas | Máximo 20-25 palavras por frase |
| Parágrafos curtos | 2-3 frases, máximo 4 |
| Voz ativa | "Next.js renderiza páginas" não "Páginas são renderizadas pelo Next.js" |
| Palavras simples | "usar" não "utilizar", "mostrar" não "demonstrar" |
| Listas e bullets | Quebrar informação complexa em listas |
| Subtítulos frequentes | h2/h3 a cada 2-3 parágrafos |
| Negrito estratégico | Destacar termos-chave para scanning |
| Imagens e diagramas | Quebrar texto longo com visuais |

### 7.3 Ferramentas

| Ferramenta | Métrica | Grátis? |
|---|---|---|
| Hemingway Editor | Grade level, readability | Sim |
| Yoast SEO | Flesch Reading Ease | Plugin |
| Grammarly | Clarity score | Freemium |
| Readable.com | Flesch-Kincaid, SMOG | Freemium |

## 8. Content Length por Tipo de Página

### 8.1 Guidelines

| Tipo de Página | Palavras | Nota |
|---|---|---|
| Landing page (produto) | 500-1500 | Focado em conversão, não em volume |
| Homepage | 300-800 | Visão geral + links para aprofundamento |
| Blog post (tutorial) | 1500-3000 | Completude > volume |
| Blog post (opinião) | 800-1500 | Direto ao ponto |
| Pillar page (guide) | 3000-5000+ | Conteúdo exaustivo sobre o tópico |
| Página de pricing | 500-1000 | Clareza > quantidade |
| FAQ page | 1000-2000 | Perguntas + respostas completas |
| Página de produto (e-commerce) | 300-800 | Descrição + specs + reviews |
| Case study | 1000-2500 | Problema → solução → resultados |

### 8.2 Qualidade > Quantidade

Google's Helpful Content Update (2023, reforçado em 2025) penaliza:
- Conteúdo criado primariamente para ranquear (não para ajudar)
- Conteúdo AI-generated sem edição/valor humano
- Conteúdo thin (pouco valor, muitas palavras genéricas)
- Conteúdo que não responde a search intent

**Regra:** Escreva o necessário para responder completamente à intenção de busca do usuário. Nem mais, nem menos.

## 9. Search Intent Matching

### 9.1 Tipos de Intent

| Intent | Exemplo de Query | Conteúdo Esperado |
|---|---|---|
| **Informacional** | "o que é next.js" | Blog post, tutorial, guia |
| **Navegacional** | "vercel dashboard login" | Página específica do site |
| **Transacional** | "comprar plano next.js hosting" | Página de pricing/produto |
| **Comercial** | "next.js vs remix comparação" | Artigo comparativo, review |

### 9.2 Como Identificar Intent

1. Google a keyword e analise os top 10 resultados
2. Se são blogs → intent informacional
3. Se são páginas de produto → intent transacional
4. Se são comparativos → intent comercial
5. Crie conteúdo que match o formato dos top resultados

## 10. Checklist de SEO de Conteúdo

- [ ] 1 h1 por página com keyword principal?
- [ ] Hierarquia h1→h2→h3 sem pular níveis?
- [ ] Title tag ≤ 60 caracteres com keyword no início?
- [ ] Meta description 150-160 caracteres com CTA?
- [ ] URL slug curta, descritiva, kebab-case?
- [ ] Keyword no primeiro parágrafo?
- [ ] 3-5 internal links com anchor text descritivo?
- [ ] Alt text em todas as imagens significativas?
- [ ] Data de publicação e atualização visíveis?
- [ ] Autor identificado com bio (E-E-A-T)?
- [ ] Readability: frases curtas, parágrafos de 2-3 linhas?
- [ ] Conteúdo match search intent?
- [ ] Sem keyword stuffing?
