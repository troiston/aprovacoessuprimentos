---
id: doc-competitor-analysis
title: Framework de Análise de Concorrentes
version: 2.0
last_updated: 2026-04-07
category: references
priority: standard
related:
  - docs/web-excellence/references/MARKET_REFERENCES.md
  - docs/web-excellence/references/DESIGN_REFERENCES.md
  - docs/web-excellence/decisions/_TEMPLATE_ADR.md
---

# Framework de Análise de Concorrentes

## Resumo Executivo

Um framework estruturado para analisar sites concorrentes em 6 dimensões: tech stack, performance, SEO, design patterns, funil de conversão e estratégia de conteúdo. Inclui ferramentas recomendadas e template para documentar cada análise. Use para competitive intelligence e identificação de oportunidades.

---

## 1. Tech Stack Detection

### 1.1 Ferramentas

| Ferramenta | O que Detecta | Custo |
|-----------|---------------|-------|
| **Wappalyzer** | Framework, CMS, CDN, analytics, libs | Free (extensão) |
| **BuiltWith** | Stack completo, histórico de mudanças | Free tier |
| **Chrome DevTools** | Headers, network requests, performance | Free |
| **WhatRuns** | Alternativa ao Wappalyzer | Free |

### 1.2 O que Investigar

| Dimensão | Perguntas | Como Descobrir |
|----------|-----------|----------------|
| **Framework** | Next.js? Nuxt? Gatsby? Custom? | Wappalyzer, `__NEXT_DATA__`, source HTML |
| **Hosting** | Vercel? AWS? Netlify? | DNS lookup, response headers |
| **CDN** | Cloudflare? Fastly? CloudFront? | Response headers (`cf-ray`, `x-served-by`) |
| **CMS** | Headless? WordPress? Contentful? | Wappalyzer, API endpoints |
| **Analytics** | GA4? Mixpanel? Amplitude? | Network tab, script tags |
| **A/B Testing** | Optimizely? VWO? LaunchDarkly? | Network tab, cookies |
| **Chat** | Intercom? Drift? Crisp? | DOM elements, script tags |
| **Payments** | Stripe? PayPal? | Checkout page, script tags |

### 1.3 Template de Documentação

```markdown
### Tech Stack: [Concorrente]
- **Framework:** Next.js 14 (App Router)
- **Hosting:** Vercel (pro plan)
- **CDN:** Vercel Edge Network
- **CMS:** Contentful (headless)
- **Analytics:** GA4 + Amplitude
- **A/B Testing:** LaunchDarkly
- **Chat:** Intercom
- **Payments:** Stripe
- **Auth:** Auth0
- **Observação:** Migraram de Gatsby para Next.js em Q3 2025
```

---

## 2. Performance Audit

### 2.1 Ferramentas

| Ferramenta | Métricas | Tipo |
|-----------|---------|------|
| **PageSpeed Insights** | CWV (LCP, INP, CLS), FCP, TTFB | Lab + Field |
| **WebPageTest** | Waterfall, filmstrip, CWV | Lab |
| **GTmetrix** | Speed Index, CWV, waterfall | Lab |
| **CrUX Dashboard** | Field data mensal | Field |

### 2.2 Métricas para Comparar

| Métrica | Bom | Comparar |
|---------|-----|---------|
| LCP (mobile) | < 2.5s | Seu vs concorrente |
| INP (mobile) | < 200ms | Seu vs concorrente |
| CLS (mobile) | < 0.1 | Seu vs concorrente |
| FCP | < 1.8s | Time to first paint |
| TTFB | < 800ms | Server response time |
| Total Weight | < 1MB | Page weight |
| Requests | < 30 | HTTP requests first load |
| Lighthouse Score | > 90 | Overall performance |

### 2.3 Template

```markdown
### Performance: [Concorrente]
- **Lighthouse Score:** 87 (mobile)
- **LCP:** 3.1s (precisa melhorar) — hero image 450KB sem AVIF
- **INP:** 150ms (bom)
- **CLS:** 0.05 (bom)
- **TTFB:** 620ms
- **Page Weight:** 1.8MB (alto)
- **Requests:** 45 first load
- **Oportunidade:** Imagens não otimizadas, third-party scripts pesados
```

---

## 3. SEO Analysis

### 3.1 Ferramentas

| Ferramenta | Análise | Custo |
|-----------|--------|-------|
| **Ahrefs** | Backlinks, keywords, DR, tráfego estimado | Pago |
| **Semrush** | Keywords, tráfego, ads, content gap | Pago |
| **Screaming Frog** | Crawl técnico, meta tags, redirects | Free (500 URLs) |
| **SimilarWeb** | Tráfego estimado, fontes, geografia | Free tier |
| **Google Search Console** | Apenas próprio site | Free |

### 3.2 Dimensões SEO

| Dimensão | O que Analisar | Ferramenta |
|----------|---------------|-----------|
| **Authority** | Domain Rating, backlinks de qualidade | Ahrefs |
| **Keywords** | Top keywords, keyword gap com você | Semrush |
| **Technical** | Sitemap, robots.txt, schema, canonical | Screaming Frog |
| **Content** | Blog frequency, content types, word count | Manual + Ahrefs |
| **On-page** | Meta titles, descriptions, H1s, alt text | Screaming Frog |
| **Speed** | CWV como fator de ranking | PageSpeed Insights |

### 3.3 Template

```markdown
### SEO: [Concorrente]
- **Domain Rating:** 72 (Ahrefs)
- **Organic Traffic:** ~150K visits/month
- **Top Keywords:**
  1. "project management tool" (pos. 3)
  2. "team collaboration app" (pos. 5)
  3. "task management software" (pos. 2)
- **Content Strategy:** Blog 3x/semana, case studies mensais
- **Schema:** FAQPage, Product, Organization
- **Technical Issues:** 12 páginas com meta description duplicada
- **Oportunidade:** Não cobrem keywords de "integração com [tool]"
```

---

## 4. Design Patterns

### 4.1 O que Analisar

| Elemento | Perguntas |
|----------|-----------|
| **Hero** | Layout? Headline formula? CTA? Trust signal? |
| **Navigation** | Mega menu? Sticky? Mobile pattern? |
| **Social Proof** | Logos? Testimonials? Números? Posição? |
| **Pricing** | Tiers? Anchoring? Toggle? Comparison? |
| **CTA** | Texto? Cor? Posições? Repetição? |
| **Footer** | Links? Newsletter? Trust badges? |
| **Dark/Light** | Disponível? Default? Quality? |
| **Mobile** | Adaptações? Bottom nav? Touch targets? |

### 4.2 Processo de Análise Visual

1. **Screenshot full-page** (extensão GoFullPage ou DevTools)
2. **Screenshot mobile** (DevTools responsive mode, 375px)
3. **Marcar padrões** em cada seção (hero, features, social proof, pricing, CTA, footer)
4. **Capturar animações** (screen record para motion patterns)
5. **Medir tipografia** (DevTools computed styles)
6. **Extrair cores** (ColorZilla ou eyedropper DevTools)

### 4.3 Template

```markdown
### Design: [Concorrente]
- **Hero:** Split layout, headline 48px semibold, "Start Free Trial" CTA
- **Trust:** Logo bar (6 logos grayscale), "10,000+ teams" counter
- **Features:** 3-column cards com ícone + título + descrição
- **Social Proof:** 3 testimonial cards, video testimonial highlight
- **Pricing:** 3 tiers, middle "Most Popular", annual toggle
- **Motion:** Fade up on scroll, spring physics, 400ms duration
- **Dark Mode:** Não disponível
- **Mobile:** Stack vertical, bottom sticky CTA
- **Diferencial:** Interactive product demo inline no hero
```

---

## 5. Conversion Funnel

### 5.1 O que Mapear

```
Homepage → Signup → Onboarding → First Value → Activation → Paid
```

| Step | Perguntas |
|------|-----------|
| **Homepage→Signup** | Quantos CTAs? Free trial vs demo? Form fields? |
| **Signup** | OAuth? Campos mínimos? Progressive profiling? |
| **Onboarding** | Steps? Intent routing? Time to value? |
| **Activation** | O que define "ativado"? Triggers? |
| **Conversion** | Trial length? Payment friction? |

### 5.2 Exercício: Signup Flow Analysis

Criar conta no concorrente e documentar cada tela:

1. Screenshot de cada step
2. Contar campos por step
3. Medir tempo total (signup → first value)
4. Identificar friction points
5. Notar emails recebidos (onboarding sequence)

### 5.3 Template

```markdown
### Funnel: [Concorrente]
- **Homepage CTAs:** 2 ("Start Free" hero + "Try Free" nav)
- **Signup:** Google OAuth + email/senha (2 campos)
- **Trial:** 14 dias, sem cartão
- **Onboarding:** 4 steps (role, team size, use case, invite)
- **Time to first value:** ~3 minutos (criou primeiro projeto)
- **Activation trigger:** Criar 3 tasks + convidar 1 membro
- **Emails:** Welcome, Day 1 tip, Day 3 checklist, Day 7 "how's it going", Day 12 "trial ending"
- **Paywall:** Soft (feature-gated), não hard (block all)
```

---

## 6. Content Strategy

### 6.1 Dimensões

| Dimensão | O que Analisar |
|----------|---------------|
| **Blog** | Frequência, tópicos, formato (how-to, opinion, news) |
| **Changelog** | Formato, frequência, engagement |
| **Docs** | Estrutura, search, AI assistant, exemplos |
| **Resources** | E-books, webinars, templates, tools |
| **Community** | Discord, Slack, Forum, GitHub |
| **Social** | Twitter/X, LinkedIn, YouTube — frequência e tipo |

### 6.2 Template

```markdown
### Content: [Concorrente]
- **Blog:** 2-3 posts/semana, mix de how-to (60%) e thought leadership (40%)
- **Changelog:** Semanal, formato visual com screenshots
- **Docs:** Estrutura excelente, search com Algolia, code examples
- **Resources:** 5 e-books, webinars mensais, template gallery
- **Community:** Discord (12K members), GitHub discussions
- **Social:** Twitter 3-5x/dia, LinkedIn 2x/semana, YouTube 2x/mês
- **Oportunidade:** Sem conteúdo em português, sem video tutorials
```

---

## 7. Template Completo de Análise

```markdown
# Análise Competitiva: [Nome do Concorrente]

**URL:** https://
**Data da Análise:** YYYY-MM-DD
**Analista:** [Nome]

## 1. Overview
- **Fundação:** [ano]
- **Funding:** [valor total]
- **Funcionários:** [estimativa]
- **Público-alvo:** [descrição]
- **Proposta de valor:** [1 frase]

## 2. Tech Stack
[Template seção 1.3]

## 3. Performance
[Template seção 2.3]

## 4. SEO
[Template seção 3.3]

## 5. Design Patterns
[Template seção 4.3]

## 6. Conversion Funnel
[Template seção 5.3]

## 7. Content Strategy
[Template seção 6.2]

## 8. Pontos Fortes
1. [...]
2. [...]
3. [...]

## 9. Pontos Fracos (Oportunidades para nós)
1. [...]
2. [...]
3. [...]

## 10. Action Items
- [ ] [Ação específica derivada da análise]
- [ ] [Ação específica derivada da análise]
- [ ] [Ação específica derivada da análise]
```

---

## 8. Cadência de Análise

| Frequência | Atividade |
|-----------|-----------|
| Trimestral | Análise completa dos top 3 concorrentes |
| Mensal | Check de performance e SEO dos concorrentes |
| Semanal | Monitorar changelogs e updates |
| Contínuo | Alertas de Google para menções e novos features |
