---
id: doc-template-adr
title: Template de Architecture Decision Record (ADR)
version: 2.0
last_updated: 2026-04-07
category: decisions
priority: important
related:
  - docs/web-excellence/references/COMPETITOR_ANALYSIS.md
  - docs/web-excellence/templates/PAGE_TEMPLATE.md
---

# Template de Architecture Decision Record (ADR)

## Resumo Executivo

ADRs documentam decisões técnicas significativas com contexto, alternativas e consequências. Sem documentação, decisões são reaprendidas dolorosamente. Este template segue o formato MADR (Markdown Architectural Decision Records) simplificado, com 3 exemplos preenchidos.

---

## Template Base

```markdown
# ADR-[NNN]: [Título da Decisão]

## Metadata
- **Data:** YYYY-MM-DD
- **Status:** proposed | accepted | deprecated | superseded
- **Superseded by:** ADR-[NNN] (se aplicável)
- **Decisores:** [nomes/roles]

## Contexto

[Descreva a situação que motivou esta decisão. Que problema estamos
resolvendo? Que restrições existem? Qual o cenário atual?]

## Decisão

[Descreva a decisão tomada de forma clara e direta.
"Decidimos usar [X] porque [Y]."]

## Consequências

### Positivas
- [Benefício 1]
- [Benefício 2]

### Negativas
- [Tradeoff 1]
- [Tradeoff 2]

### Neutras
- [Impacto neutro ou observação]

## Alternativas Consideradas

### Alternativa 1: [Nome]
- **Prós:** [...]
- **Contras:** [...]
- **Motivo da rejeição:** [...]

### Alternativa 2: [Nome]
- **Prós:** [...]
- **Contras:** [...]
- **Motivo da rejeição:** [...]

## Referências
- [Links para docs, benchmarks, artigos que suportam a decisão]
```

---

## Exemplo 1: Estratégia de Rendering

```markdown
# ADR-001: Server Components como Padrão de Renderização

## Metadata
- **Data:** 2026-03-15
- **Status:** accepted
- **Decisores:** Equipe de engenharia frontend

## Contexto

O projeto utiliza Next.js 15 com App Router. Precisamos definir a
estratégia padrão de renderização para componentes. O App Router usa
Server Components por padrão, mas a equipe tem experiência predominante
com Client Components (modelo anterior do Pages Router).

Requisitos:
- LCP < 2.5s em todas as páginas
- First Load JS < 200KB
- SEO otimizado (conteúdo renderizado no servidor)
- Interatividade rica em componentes específicos (formulários, animações)

## Decisão

Decidimos usar Server Components como padrão para TODOS os componentes,
adicionando "use client" apenas quando o componente necessita de:
- useState, useEffect, useRef ou outros hooks React
- Event handlers (onClick, onChange, etc.)
- Browser APIs (window, document, localStorage)
- Framer Motion ou outras libs client-only

Criamos a convenção de que todo arquivo é Server Component a menos que
o desenvolvedor explicitamente adicione "use client" no topo.

## Consequências

### Positivas
- First Load JS reduzido em ~40% comparado com Client Components padrão
- Dados podem ser fetched diretamente no componente (async Server Components)
- Melhor SEO — HTML completo no first paint
- Redução de waterfalls — fetch parallel no servidor
- Segredos (API keys, DB URLs) nunca vazam para o client

### Negativas
- Curva de aprendizado para a equipe (mental model novo)
- Interop entre Server e Client Components requer atenção
- Não é possível usar hooks em Server Components
- Debugging mais complexo (server vs client errors)

### Neutras
- Framer Motion e libs de animação permanecem Client Components
- Formulários podem usar Server Actions (eliminando API routes)

## Alternativas Consideradas

### Alternativa 1: Client Components como padrão
- **Prós:** Familiar para a equipe, modelo mental simples
- **Contras:** Bundle JS maior, pior SEO, pior performance
- **Motivo da rejeição:** Não atende o budget de JS < 200KB

### Alternativa 2: SSG puro (Astro/11ty)
- **Prós:** Performance máxima, zero JS por padrão
- **Contras:** Limitado para interatividade, ecossistema menor
- **Motivo da rejeição:** Projeto precisa de interatividade rica (dashboard, forms)

## Referências
- Next.js Server Components docs: https://nextjs.org/docs/app/building-your-application/rendering/server-components
- Vercel blog "Understanding React Server Components": https://vercel.com/blog/understanding-react-server-components
- Benchmark interno: -42% JS bundle com RSC vs full CSR
```

---

## Exemplo 2: Auth Provider

```markdown
# ADR-002: Better Auth como Solução de Autenticação

## Metadata
- **Data:** 2026-03-18
- **Status:** accepted
- **Decisores:** Equipe de engenharia + segurança

## Contexto

O projeto precisa de autenticação com:
- Email/senha + OAuth (Google, GitHub)
- MFA/2FA
- Session management
- Role-based access control (RBAC)
- Self-hosted (dados no nosso banco)

Restrições:
- LGPD compliance (dados no Brasil ou sob nosso controle)
- Budget limitado (sem custos por MAU)
- TypeScript first (type safety)
- Integração nativa com Prisma (nosso ORM)

## Decisão

Decidimos usar Better Auth como solução de autenticação porque:
1. Self-hosted — dados ficam no nosso PostgreSQL via Prisma
2. TypeScript nativo com type safety completo
3. Plugins para MFA, organizations, RBAC
4. Zero custo por usuário (open source)
5. Integração nativa com Next.js App Router
6. Compliance LGPD facilitado (dados sob nosso controle)

## Consequências

### Positivas
- Sem vendor lock-in (self-hosted, open source)
- Custo zero por MAU (escala sem surpresas financeiras)
- Type safety excelente (Prisma + Better Auth)
- LGPD compliance simplificado
- Controle total sobre UX de auth (custom UI)

### Negativas
- Responsabilidade total pela segurança da implementação
- Sem dashboard de administração pronto (precisa construir)
- Comunidade menor que Auth0/Clerk
- Manutenção da atualização é responsabilidade nossa

### Neutras
- Migração futura é possível (sessions e users em schema Prisma standard)
- Precisa de infraestrutura própria para email (verificação, reset)

## Alternativas Consideradas

### Alternativa 1: Clerk
- **Prós:** UX pronta, dashboard admin, rápido de implementar
- **Contras:** Vendor lock-in, custo por MAU ($0.02+), dados nos EUA
- **Motivo da rejeição:** LGPD concerns + custo em escala

### Alternativa 2: Auth0
- **Prós:** Enterprise-grade, SSO/SAML, ampla documentação
- **Contras:** Caro em escala, complexo para setup, vendor lock-in
- **Motivo da rejeição:** Custo proibitivo + complexidade desnecessária

### Alternativa 3: NextAuth.js (Auth.js)
- **Prós:** Integração nativa Next.js, gratuito, popular
- **Contras:** API instável entre versões, TS support incompleto
- **Motivo da rejeição:** Breaking changes frequentes, type safety inferior

## Referências
- Better Auth docs: https://www.better-auth.com
- Comparativo de auth solutions (2026): [link interno]
- LGPD requirements doc: [link interno]
```

---

## Exemplo 3: Escolha de Banco de Dados

```markdown
# ADR-003: PostgreSQL (Supabase) como Banco de Dados Principal

## Metadata
- **Data:** 2026-03-20
- **Status:** accepted
- **Decisores:** Equipe de engenharia + DevOps

## Contexto

Precisamos de um banco de dados que suporte:
- Dados relacionais (users, organizations, projects, tasks)
- Full-text search (busca em conteúdo)
- JSON storage para dados flexíveis
- Real-time subscriptions (atualizações em tempo real)
- Escalabilidade para 100K+ usuários
- Backups automáticos + point-in-time recovery

Restrições:
- Time-to-market rápido (managed service preferível)
- Orçamento limitado no início (free tier desejável)
- Equipe tem experiência com SQL (não NoSQL)
- Prisma como ORM (compatibilidade obrigatória)

## Decisão

Decidimos usar PostgreSQL hospedado no Supabase porque:
1. PostgreSQL é o banco relacional mais completo (JSON, full-text, arrays)
2. Supabase oferece managed PostgreSQL com free tier generoso
3. Real-time subscriptions nativo (via Supabase Realtime)
4. Row Level Security (RLS) para autorização no nível do banco
5. Prisma tem suporte first-class para PostgreSQL
6. Backups automáticos com PITR
7. Dashboard de administração incluído

## Consequências

### Positivas
- PostgreSQL é battle-tested (35+ anos de desenvolvimento)
- Full-text search nativo (sem ElasticSearch adicional para casos simples)
- JSONB para dados semi-estruturados (sem precisar de MongoDB)
- Supabase Realtime elimina necessidade de WebSocket server custom
- RLS como camada extra de segurança
- Free tier suporta MVP/beta (500MB, 50K auth users)

### Negativas
- Supabase tem vendor-specific features (Realtime, RLS helpers)
- Migração de Supabase requer re-implementar Realtime e Auth
- PostgreSQL tem ceiling de escala (precisa de sharding em escala extrema)
- Supabase free tier tem limites de conexões simultâneas

### Neutras
- Prisma abstrai diferenças SQL, facilitando migração futura se necessário
- Supabase é open source — pode self-host se necessário

## Alternativas Consideradas

### Alternativa 1: PlanetScale (MySQL)
- **Prós:** Branching de schema, escala horizontal, serverless
- **Contras:** MySQL (sem JSONB, full-text inferior), Prisma adapter necessário
- **Motivo da rejeição:** PostgreSQL é superior em features, equipe prefere

### Alternativa 2: MongoDB Atlas
- **Prós:** Schema flexível, boa para prototipagem rápida
- **Contras:** Sem relações nativas, Prisma support incompleto
- **Motivo da rejeição:** Dados são fundamentalmente relacionais

### Alternativa 3: Neon (PostgreSQL serverless)
- **Prós:** Serverless, branching, scale-to-zero
- **Contras:** Sem real-time nativo, sem auth integrado
- **Motivo da rejeição:** Supabase oferece mais features managed

## Referências
- Supabase pricing: https://supabase.com/pricing
- PostgreSQL vs MySQL 2026: [benchmark link]
- Prisma + Supabase setup: https://www.prisma.io/docs/guides/database/supabase
```

---

## Convenções de Uso

### Quando Criar um ADR

- Escolha de framework, linguagem, ou ferramenta principal
- Mudança de arquitetura (monolito → microserviços)
- Estratégia de deployment ou hosting
- Escolha de provider de serviço (auth, database, CDN)
- Padrão de código ou convenção significativa
- Qualquer decisão que alguém no futuro perguntaria "por que fizemos isso?"

### Numeração

```
decisions/
  _TEMPLATE_ADR.md
  ADR-001-server-components-default.md
  ADR-002-better-auth.md
  ADR-003-postgresql-supabase.md
```

### Ciclo de Vida

```
proposed → accepted → [deprecated | superseded by ADR-NNN]
```

Nunca deletar ADRs antigos. Deprecie ou supersede com referência ao novo.
