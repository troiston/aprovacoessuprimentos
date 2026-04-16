---
id: index-commands
title: Indice de Commands
version: 2.1
last_updated: 2026-04-08
---

# Commands Index — Web Excellence Framework v2.1

> Referencia de todos os **16** comandos slash disponiveis.
> Cada comando aciona um agent especifico e utiliza skills predefinidas.

## Categorias de Comandos

| Categoria | Prefixo | Proposito | Qtd |
|---|---|---|---|
| **Project** | `/project/` | Inicializacao e configuracao do projeto | 4 |
| **Build** | `/build/` | Construcao de paginas, componentes e secoes | 3 |
| **Generate** | `/generate/` | Geracao de assets, copy, schemas e conteudo | 4 |
| **Audit** | `/audit/` | Auditoria de qualidade em diferentes dimensoes | 5 |

---

## Tabela Completa de Comandos

| # | Comando | Categoria | Agent | Prioridade | Descricao |
|---|---|---|---|---|---|
| 01 | `/init-project` | project | 01-architect | CRITICAL | Inicializa projeto completo com estrutura, configs e dependencias |
| 02 | `/init-tokens` | project | 02-designer | CRITICAL | Gera design tokens (cores, tipografia, espacamento) no `globals.css` |
| 03 | `/init-seo` | project | 04-seo-specialist | IMPORTANT | Configura infraestrutura SEO base (sitemap, robots, metadata padrao) |
| 04 | `/new-page` | build | 03-builder | IMPORTANT | Cria pagina completa com layout, sections e metadata |
| 05 | `/new-component` | build | 03-builder | IMPORTANT | Cria componente reutilizavel com tipagem e variants |
| 06 | `/new-section` | build | 03-builder | STANDARD | Cria section individual para compor paginas |
| 07 | `/gen-image` | generate | 05-asset-creator | STANDARD | Gera prompts otimizados para imagens IA |
| 08 | `/gen-video` | generate | 05-asset-creator | STANDARD | Gera prompts otimizados para videos IA |
| 09 | `/gen-copy` | generate | 03-builder | STANDARD | Gera textos (headlines, CTAs, descricoes) alinhados ao tom do projeto |
| 10 | `/gen-schema` | generate | 04-seo-specialist | IMPORTANT | Gera JSON-LD structured data para a pagina |
| 11 | `/audit-seo` | audit | 06-qa-auditor | IMPORTANT | Audita SEO tecnico e de conteudo |
| 12 | `/audit-a11y` | audit | 06-qa-auditor | IMPORTANT | Audita acessibilidade WCAG 2.2 AA |
| 13 | `/audit-perf` | audit | 06-qa-auditor | IMPORTANT | Audita performance e Core Web Vitals |
| 14 | `/audit-full` | audit | 06-qa-auditor | CRITICAL | Auditoria completa (SEO + A11y + Perf + Security) |
| 15 | `/audit-conversion` | audit | 06-qa-auditor | IMPORTANT | CRO etico, friccao em formularios, prova social |
| 16 | `/orchestrate` | project | orchestrator | CRITICAL | Coordena execucao por PRD em slices com gates e token budgets |

---

## Detalhamento por Comando

### Categoria: Project

#### `/init-project` — Inicializacao de Projeto

**Sintaxe:** `/init-project [briefing]`

| Parametro | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `briefing` | string | Sim | Descricao do projeto, tipo de site, publico-alvo |
| `--template` | enum | Nao | Template base: `landing`, `saas`, `portfolio`, `ecommerce`, `blog` |
| `--cms` | enum | Nao | CMS headless: `none`, `sanity`, `strapi`, `contentful` |
| `--auth` | boolean | Nao | Incluir autenticacao (Better Auth) |
| `--i18n` | boolean | Nao | Incluir internacionalizacao |

**Agent:** 01-architect
**Skills:** Nenhuma skill especifica — usa rules core
**Rules:** `core/00-constitution.mdc`, `core/01-typescript.mdc`, `core/02-code-style.mdc`

**O que faz:**
1. Analisa o briefing e extrai requisitos tecnicos
2. Cria estrutura de pastas `src/app/` com rotas identificadas
3. Gera `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`
4. Instala dependencias necessarias (`package.json`)
5. Cria `globals.css` base com reset e `@theme` placeholder
6. Gera ADR inicial documentando decisoes de stack
7. Configura ESLint, Prettier e Git hooks

**Exemplo:**
```
/init-project Site institucional para escritorio de advocacia.
  Publico: empresas B2B. Tons sobreos, profissional.
  Paginas: Home, Sobre, Servicos, Equipe, Blog, Contato.
  --template landing --cms sanity
```

---

#### `/init-tokens` — Geracao de Design Tokens

**Sintaxe:** `/init-tokens [direcao-visual]`

| Parametro | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `direcao-visual` | string | Sim | Descricao do estilo visual desejado (cores, mood, referencias) |
| `--palette` | string | Nao | Cor primaria em hex ou nome (ex: `#2563eb`, `blue`) |
| `--font-heading` | string | Nao | Fonte para titulos (ex: `Inter`, `Playfair Display`) |
| `--font-body` | string | Nao | Fonte para corpo (ex: `Inter`, `DM Sans`) |
| `--scale` | enum | Nao | Escala tipografica: `minor-third`, `major-third`, `perfect-fourth` |
| `--dark-mode` | boolean | Nao | Incluir tokens de dark mode (padrao: `true`) |

**Agent:** 02-designer
**Skills:** `foundations/color-system`, `foundations/typography-scale`, `foundations/spacing-system`, `foundations/responsive-tokens`
**Rules:** `design/tokens.mdc`, `design/typography.mdc`, `design/responsive.mdc`

**O que faz:**
1. Gera paleta de cores completa em OKLCH (primary, secondary, accent, neutral, semantic)
2. Calcula variantes automaticas (50-950) com lightness consistente
3. Cria escala tipografica fluida com `clamp()` para cada step
4. Define sistema de espacamento geometrico (4px base, escala x1.5)
5. Configura breakpoints mobile-first e container query sizes
6. Gera tudo como CSS custom properties dentro de `@theme` no `globals.css`
7. Inclui tokens de dark mode com `prefers-color-scheme`

**Exemplo:**
```
/init-tokens Estilo moderno e clean, inspirado em SaaS como Linear e Vercel.
  Fundo escuro, acentos em azul eletrico e verde neon.
  --palette #0066ff --font-heading "Space Grotesk" --font-body "Inter"
  --scale major-third --dark-mode true
```

---

#### `/init-seo` — Configuracao SEO Base

**Sintaxe:** `/init-seo [dominio]`

| Parametro | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `dominio` | string | Sim | Dominio do site (ex: `meusite.com.br`) |
| `--locale` | string | Nao | Locale principal (padrao: `pt-BR`) |
| `--analytics` | enum | Nao | Plataforma: `gtm`, `plausible`, `umami`, `none` |
| `--verification` | string | Nao | Google Search Console verification code |

**Agent:** 04-seo-specialist
**Skills:** `seo/metadata-generator`, `seo/sitemap-robots`, `seo/structured-data`
**Rules:** `quality/seo.mdc`, `stack/nextjs.mdc`

**O que faz:**
1. Cria `src/app/sitemap.ts` dinamico com todas as rotas
2. Cria `src/app/robots.ts` com politicas corretas
3. Configura metadata padrao no `layout.tsx` raiz (title template, description, OG)
4. Adiciona JSON-LD base (Organization, WebSite)
5. Configura canonical URLs
6. Adiciona Google Analytics/GTM se especificado
7. Cria template de OG image com `ImageResponse`

**Exemplo:**
```
/init-seo meuescritorio.com.br --locale pt-BR --analytics gtm
  --verification "abc123xyz"
```

---

### Categoria: Build

#### `/new-page` — Criacao de Pagina

**Sintaxe:** `/new-page [nome] [descricao]`

| Parametro | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `nome` | string | Sim | Nome/rota da pagina (ex: `sobre`, `servicos/consultoria`) |
| `descricao` | string | Sim | Descricao do conteudo e proposito da pagina |
| `--sections` | string[] | Nao | Lista de sections a incluir (ex: `hero,features,cta,faq`) |
| `--layout` | enum | Nao | Tipo de layout: `default`, `sidebar`, `full-width`, `dashboard` |
| `--dynamic` | boolean | Nao | Pagina com rota dinamica `[slug]` |

**Agent:** 03-builder
**Skills:** `layout/grid-system`, `layout/flexbox-patterns`, `components/hero`, `components/navbar`, `components/footer`, `components/cta`, `motion/scroll-animations`, `motion/page-transitions`
**Rules:** TODAS

**O que faz:**
1. Cria arquivo `page.tsx` na rota correta dentro de `src/app/`
2. Implementa `generateMetadata()` com title, description, OG
3. Compoe sections na ordem especificada
4. Aplica layout responsivo mobile-first
5. Adiciona animacoes de entrada com Framer Motion `whileInView`
6. Implementa loading states e error boundaries quando necessario
7. Garante Server Components por padrao, `"use client"` apenas onde necessario

**Exemplo:**
```
/new-page sobre "Pagina sobre o escritorio, historia de 20 anos,
  valores e missao, equipe de advogados com fotos e especializacoes"
  --sections hero,timeline,values,team,cta --layout default
```

---

#### `/new-component` — Criacao de Componente

**Sintaxe:** `/new-component [nome] [descricao]`

| Parametro | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `nome` | string | Sim | Nome PascalCase do componente (ex: `TestimonialCard`) |
| `descricao` | string | Sim | Funcao e aparencia do componente |
| `--variants` | string[] | Nao | Variantes do componente (ex: `default,compact,featured`) |
| `--interactive` | boolean | Nao | Se precisa de `"use client"` (padrao: `false`) |
| `--props` | string[] | Nao | Props tipadas (ex: `title:string,image:string,rating:number`) |

**Agent:** 03-builder
**Skills:** `components/*` (conforme tipo), `motion/micro-interactions`
**Rules:** `core/*`, `stack/tailwind.mdc`, `stack/framer-motion.mdc`

**O que faz:**
1. Cria arquivo `.tsx` em `src/components/` ou `src/components/ui/`
2. Define interface TypeScript completa para props
3. Implementa variantes com classes condicionais
4. Aplica design tokens do `@theme`
5. Adiciona animacoes sutis quando relevante
6. Server Component por padrao, `"use client"` se `--interactive`
7. Inclui responsividade mobile-first

**Exemplo:**
```
/new-component PricingCard "Card de plano com nome, preco mensal/anual,
  lista de features com checkmarks, badge de popular, CTA"
  --variants default,popular,enterprise --interactive true
  --props "name:string,price:number,features:string[],popular:boolean"
```

---

#### `/new-section` — Criacao de Section

**Sintaxe:** `/new-section [tipo] [descricao]`

| Parametro | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `tipo` | enum | Sim | Tipo: `hero`, `features`, `testimonials`, `faq`, `cta`, `stats`, `team`, `pricing`, `logos`, `timeline`, `contact`, `gallery`, `comparison`, `custom` |
| `descricao` | string | Sim | Detalhes especificos do conteudo desta section |
| `--columns` | number | Nao | Grid de colunas (padrao: auto-fit) |
| `--background` | enum | Nao | Fundo: `default`, `muted`, `primary`, `gradient`, `image` |
| `--animation` | enum | Nao | Entrada: `fade-up`, `fade-in`, `stagger`, `slide`, `none` |

**Agent:** 03-builder
**Skills:** `layout/grid-system`, `components/*` (conforme tipo), `motion/scroll-animations`
**Rules:** `stack/tailwind.mdc`, `design/responsive.mdc`, `stack/framer-motion.mdc`

**O que faz:**
1. Cria section com container e padding responsivo
2. Implementa layout interno (grid, flex, ou custom)
3. Adiciona animacao de entrada com Framer Motion
4. Aplica background e espacamento baseado nos tokens
5. Garante semantica HTML correta (heading hierarchy, landmarks)
6. Responsividade completa de 320px a 1920px

**Exemplo:**
```
/new-section testimonials "Depoimentos de clientes com foto circular,
  nome, cargo, empresa e texto. Grid de 3 colunas no desktop,
  1 no mobile. Background muted com aspas decorativas."
  --columns 3 --background muted --animation stagger
```

---

### Categoria: Generate

#### `/gen-image` — Geracao de Prompt de Imagem

**Sintaxe:** `/gen-image [descricao]`

| Parametro | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `descricao` | string | Sim | O que a imagem deve mostrar |
| `--style` | enum | Nao | Estilo: `photo`, `illustration`, `3d`, `flat`, `gradient`, `abstract` |
| `--ratio` | enum | Nao | Proporcao: `16:9`, `4:3`, `1:1`, `9:16`, `21:9` |
| `--tool` | enum | Nao | Ferramenta alvo: `midjourney`, `dalle`, `flux`, `stable-diffusion` |
| `--quantity` | number | Nao | Numero de variacoes de prompt (padrao: 3) |

**Agent:** 05-asset-creator
**Skills:** `ai-assets/image-prompt-generator`, `ai-assets/style-consistency`
**Rules:** `design/tokens.mdc`

**O que faz:**
1. Analisa os tokens do projeto para manter consistencia visual
2. Gera prompt otimizado para a ferramenta escolhida
3. Inclui parametros tecnicos (aspect ratio, quality, style)
4. Produz variacoes com diferentes abordagens visuais
5. Documenta o prompt no banco de prompts do projeto

**Exemplo:**
```
/gen-image "Hero image para landing page de fintech,
  pessoa usando app no celular, ambiente urbano moderno"
  --style photo --ratio 16:9 --tool midjourney --quantity 3
```

---

#### `/gen-video` — Geracao de Prompt de Video

**Sintaxe:** `/gen-video [descricao]`

| Parametro | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `descricao` | string | Sim | O que o video deve mostrar |
| `--duration` | enum | Nao | Duracao: `4s`, `8s`, `16s` |
| `--style` | enum | Nao | Estilo: `cinematic`, `motion-graphics`, `product`, `ambient` |
| `--tool` | enum | Nao | Ferramenta alvo: `runway`, `pika`, `sora`, `kling` |
| `--camera` | string | Nao | Movimento de camera (ex: `slow zoom in`, `orbit`, `tracking`) |

**Agent:** 05-asset-creator
**Skills:** `ai-assets/video-prompt-generator`, `ai-assets/style-consistency`
**Rules:** `design/tokens.mdc`

**O que faz:**
1. Gera prompt otimizado para video IA
2. Define movimento de camera e transicoes
3. Especifica duracao e estilo visual
4. Mantem consistencia com a identidade visual do projeto
5. Documenta no banco de prompts

**Exemplo:**
```
/gen-video "Background animado para hero section,
  particulas flutuando em gradiente azul-roxo, lento e hipnotico"
  --duration 8s --style ambient --tool runway --camera "slow zoom in"
```

---

#### `/gen-copy` — Geracao de Copy/Texto

**Sintaxe:** `/gen-copy [tipo] [contexto]`

| Parametro | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `tipo` | enum | Sim | Tipo: `headline`, `subheadline`, `cta`, `description`, `tagline`, `meta`, `body` |
| `contexto` | string | Sim | Contexto do texto (pagina, section, proposito) |
| `--tone` | enum | Nao | Tom: `professional`, `casual`, `bold`, `elegant`, `tech`, `friendly` |
| `--length` | enum | Nao | Tamanho: `short`, `medium`, `long` |
| `--variations` | number | Nao | Numero de opcoes (padrao: 3) |
| `--language` | string | Nao | Idioma (padrao: `pt-BR`) |

**Agent:** 03-builder
**Skills:** Nenhuma especifica — o builder usa rules de code-style e SEO para gerar copy
**Rules:** `core/02-code-style.mdc`, `quality/seo.mdc`

**O que faz:**
1. Gera variantes de texto otimizadas para conversao
2. Considera hierarquia visual e escaneabilidade
3. Otimiza para SEO quando relevante (meta descriptions, headings)
4. Mantém tom consistente com o briefing do projeto
5. Respeita limites de caracteres conforme o tipo

**Exemplo:**
```
/gen-copy headline "Hero section da landing page de um SaaS de
  gestao de projetos para startups" --tone bold --variations 5
```

---

#### `/gen-schema` — Geracao de JSON-LD

**Sintaxe:** `/gen-schema [tipo] [pagina]`

| Parametro | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `tipo` | enum | Sim | Schema: `Organization`, `WebSite`, `BreadcrumbList`, `Product`, `FAQPage`, `Article`, `LocalBusiness`, `Service`, `Person`, `Event`, `HowTo` |
| `pagina` | string | Sim | Caminho da pagina alvo (ex: `src/app/sobre/page.tsx`) |
| `--nested` | boolean | Nao | Incluir schemas aninhados (padrao: `true`) |

**Agent:** 04-seo-specialist
**Skills:** `seo/jsonld-builder`, `seo/structured-data`
**Rules:** `quality/seo.mdc`

**O que faz:**
1. Gera JSON-LD valido conforme schema.org
2. Integra com dados reais da pagina
3. Aninha schemas relacionados (ex: Organization dentro de WebSite)
4. Valida contra especificacao schema.org
5. Implementa como componente React reutilizavel

**Exemplo:**
```
/gen-schema FAQPage src/app/faq/page.tsx
```

---

### Categoria: Audit

#### `/audit-seo` — Auditoria de SEO

**Sintaxe:** `/audit-seo [escopo]`

| Parametro | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `escopo` | string | Nao | Pagina ou diretorio especifico (padrao: todo o projeto) |
| `--fix` | boolean | Nao | Corrigir automaticamente issues encontrados |

**Agent:** 06-qa-auditor
**Skills:** `seo/metadata-generator`, `seo/jsonld-builder`, `seo/sitemap-robots`
**Rules:** `quality/seo.mdc`

**Verifica:**
- [ ] `generateMetadata()` em cada `page.tsx`
- [ ] Title unico com keyword principal (50-60 chars)
- [ ] Description unica e persuasiva (120-160 chars)
- [ ] Open Graph completo (title, description, image, type, url)
- [ ] JSON-LD valido em todas as paginas
- [ ] Heading hierarchy correta (h1 unico, sem pulos)
- [ ] Canonical URLs configurados
- [ ] `sitemap.ts` com todas as rotas
- [ ] `robots.ts` com politicas corretas
- [ ] Alt text em todas as imagens
- [ ] Links internos com texto ancora descritivo
- [ ] Sem conteudo duplicado entre paginas

**Exemplo:**
```
/audit-seo src/app/servicos/ --fix
```

---

#### `/audit-a11y` — Auditoria de Acessibilidade

**Sintaxe:** `/audit-a11y [escopo]`

| Parametro | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `escopo` | string | Nao | Componente ou pagina especifica (padrao: todo o projeto) |
| `--level` | enum | Nao | Nivel WCAG: `A`, `AA`, `AAA` (padrao: `AA`) |
| `--fix` | boolean | Nao | Corrigir automaticamente issues encontrados |

**Agent:** 06-qa-auditor
**Skills:** `accessibility/wcag-audit`, `accessibility/keyboard-navigation`, `accessibility/screen-reader-testing`, `accessibility/color-contrast`
**Rules:** `quality/accessibility.mdc`

**Verifica:**
- [ ] Contraste de cores >= 4.5:1 (texto) e >= 3:1 (UI grande)
- [ ] Navegacao completa por teclado (Tab, Enter, Escape, Arrows)
- [ ] Focus indicators visiveis e com contraste suficiente
- [ ] ARIA labels e roles corretos em componentes interativos
- [ ] Alt text descritivo em todas as imagens informativas
- [ ] `aria-hidden` em imagens decorativas
- [ ] Landmarks semanticos (header, main, nav, footer)
- [ ] Skip navigation link funcional
- [ ] Touch targets >= 44x44px em mobile
- [ ] `prefers-reduced-motion` respeitado em animacoes
- [ ] Formularios com labels explicitos e mensagens de erro acessiveis
- [ ] Sem armadilhas de foco (focus traps nao intencionais)

**Exemplo:**
```
/audit-a11y src/components/ --level AA --fix
```

---

#### `/audit-perf` — Auditoria de Performance

**Sintaxe:** `/audit-perf [escopo]`

| Parametro | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `escopo` | string | Nao | Pagina especifica (padrao: todas as paginas) |
| `--budget` | boolean | Nao | Verificar contra performance budget definido |

**Agent:** 06-qa-auditor
**Skills:** `performance/lighthouse-audit`, `performance/bundle-analysis`, `performance/image-optimization`, `performance/caching-strategy`
**Rules:** `quality/performance.mdc`

**Verifica:**
- [ ] LCP < 2.5 segundos
- [ ] CLS < 0.1
- [ ] INP < 200ms
- [ ] First Load JS < 200KB por rota
- [ ] Imagens em formato moderno (WebP/AVIF) com `next/image`
- [ ] Fontes com `font-display: swap` e preload
- [ ] Sem layout shifts causados por imagens sem dimensoes
- [ ] Lazy loading correto em imagens abaixo do fold
- [ ] Server Components usados por padrao (sem `"use client"` desnecessario)
- [ ] Sem dependencias JavaScript desnecessarias no bundle
- [ ] Cache headers configurados corretamente
- [ ] Sem re-renders desnecessarios em Client Components
- [ ] Dynamic imports para componentes pesados

**Exemplo:**
```
/audit-perf src/app/page.tsx --budget
```

---

#### `/audit-full` — Auditoria Completa

**Sintaxe:** `/audit-full`

| Parametro | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `--fix` | boolean | Nao | Corrigir automaticamente tudo que for possivel |
| `--report` | enum | Nao | Formato do relatorio: `markdown`, `json`, `console` (padrao: `markdown`) |

**Agent:** 06-qa-auditor
**Skills:** TODAS as skills de performance/*, accessibility/*, quality/*, seo/*
**Rules:** `quality/seo.mdc`, `quality/performance.mdc`, `quality/accessibility.mdc`, `quality/security.mdc`

**Executa em sequencia:**
1. `/audit-seo` — Auditoria completa de SEO
2. `/audit-a11y --level AA` — Acessibilidade WCAG 2.2 AA
3. `/audit-perf --budget` — Performance contra budget
4. **Security audit** — Headers, CSRF, XSS, input validation
5. **Responsive check** — Todos os breakpoints (320px, 375px, 768px, 1024px, 1280px, 1536px)
6. **Cross-browser** — Compatibilidade com Chrome, Firefox, Safari, Edge

**Gera relatorio consolidado com:**
- Score geral (0-100) por categoria
- Lista de issues ordenada por severidade (critical, major, minor)
- Correcoes sugeridas com codigo
- Comparacao com performance budget

**Exemplo:**
```
/audit-full --fix --report markdown
```

---

## Fluxo Recomendado de Comandos

O pipeline completo de construcao de um projeto segue esta ordem:

```
/init-project → /init-tokens → /init-seo
      ↓
/new-page (para cada pagina)
      ↓
/new-section (para sections adicionais)
      ↓
/new-component (para componentes reutilizaveis)
      ↓
/gen-image + /gen-video (assets IA)
      ↓
/gen-copy (textos e copy)
      ↓
/gen-schema (JSON-LD por pagina)
      ↓
/audit-seo → /audit-a11y → /audit-perf
      ↓
/audit-full (validacao final)
```

## Convencoes de Uso

1. **Parametros obrigatorios** devem ser passados logo apos o comando
2. **Flags opcionais** usam `--` como prefixo e podem vir em qualquer ordem
3. **Strings com espacos** devem usar aspas duplas
4. **Listas** usam virgula sem espacos (ex: `hero,features,cta`)
5. **Caminhos** sao relativos a raiz do projeto (ex: `src/app/sobre/page.tsx`)
