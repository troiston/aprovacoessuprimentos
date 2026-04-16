---
id: cmd-audit-full
title: Auditoria Completa
version: 2.0
last_updated: 2026-04-07
category: audit
agent: 06-qa-auditor
skills:
  - write-meta-tags
  - generate-schema
  - write-sitemap
  - generate-og-image
  - build-breadcrumbs
  - audit-a11y
  - fix-aria-labels
  - fix-contrast
  - build-skip-navigation
  - optimize-images
  - optimize-fonts
  - optimize-lcp
  - optimize-bundle
  - audit-security
  - pre-deploy-check
---

# `/audit-full`

Executa TODAS as auditorias em sequência — SEO, Acessibilidade, Performance e Segurança — e consolida os resultados em um relatório unificado com score geral e lista priorizada de correções. É o comando final do pipeline de qualidade, executado antes do deploy.

---

## Parâmetros

Nenhum parâmetro necessário — executa auditoria completa automaticamente.

---

## Sequência de Execução

```
Passo 1: /audit-seo ────────────► Relatório SEO
Passo 2: /audit-a11y ───────────► Relatório Acessibilidade
Passo 3: /audit-perf ───────────► Relatório Performance
Passo 4: Audit Security ────────► Relatório Segurança
Passo 5: Audit Responsividade ──► Relatório Responsivo
Passo 6: Consolidação ──────────► Relatório Unificado
```

---

## Passo a Passo de Execução

### Passo 1 — Executar Auditoria SEO

Executar todas as verificações definidas em `/audit-seo`:
- Meta tags em todas as páginas
- JSON-LD válido e completo
- Heading hierarchy correta
- Canonical URLs configurados
- Sitemap e robots.txt
- Open Graph e Twitter Cards
- Alt text em imagens
- Links internos

**Saída:** Score SEO parcial (0–100)

### Passo 2 — Executar Auditoria de Acessibilidade

Executar todas as verificações definidas em `/audit-a11y`:
- Contraste de cores WCAG 2.2 AA
- Navegação por teclado completa
- Gestão de foco (modais, menus)
- ARIA labels e roles
- Touch targets ≥ 44px
- `prefers-reduced-motion`
- Semântica HTML e landmarks
- Formulários acessíveis

**Saída:** Score A11y parcial (0–100)

### Passo 3 — Executar Auditoria de Performance

Executar todas as verificações definidas em `/audit-perf`:
- Core Web Vitals (LCP, CLS, INP)
- Bundle analysis por rota
- Imagens otimizadas
- Fontes configuradas corretamente
- Third-party scripts
- Server Components vs Client Components
- Caching estratégico

**Saída:** Score Performance parcial (0–100)

### Passo 4 — Executar Auditoria de Segurança

Verificações de segurança web:

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| Security headers | Todos os 7 headers em `next.config.ts` | 🔴 Crítico |
| CSRF protection | Server Actions protegidos por default (Next.js) | 🔴 Crítico |
| Input validation | Zod schema em todo Server Action / Route Handler | 🔴 Crítico |
| XSS prevention | Sem `dangerouslySetInnerHTML` (exceto JSON-LD) | 🔴 Crítico |
| SQL injection | Prisma queries tipadas (sem raw queries não sanitizadas) | 🔴 Crítico |
| Env variables | Secrets no `.env` e não no código | 🔴 Crítico |
| `.env` no `.gitignore` | `.env*` listado no gitignore | 🔴 Crítico |
| Auth em rotas protegidas | Middleware verificando auth em rotas privadas | 🔴 Crítico |
| Rate limiting | API routes com rate limiting | 🟡 Major |
| CORS configurado | Route Handlers com CORS restritivo | 🟡 Major |
| Cookies seguros | `httpOnly`, `secure`, `sameSite` | 🟡 Major |
| Content Security Policy | CSP header configurado | 🟡 Major |

**Headers de segurança esperados:**
```typescript
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];
```

**Saída:** Score Security parcial (0–100)

### Passo 5 — Verificar Responsividade

Validar todas as páginas nos breakpoints críticos:

| Breakpoint | Device | Verificações |
|------------|--------|-------------|
| 320px | iPhone SE | Layout não quebra, sem overflow horizontal |
| 375px | iPhone 14 | Texto legível, touch targets adequados |
| 768px | iPad | Grid adapta para 2 colunas |
| 1024px | iPad Pro / Laptop | Layout desktop funcional |
| 1280px | Desktop | Layout completo, espaçamento generoso |
| 1536px | Desktop large | Sem stretching, max-width respeitado |

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| Sem overflow horizontal | Nenhuma barra de scroll horizontal | 🔴 Crítico |
| Texto legível | Font-size ≥ 14px em mobile | 🔴 Crítico |
| Imagens responsivas | `sizes` e `object-fit` corretos | 🟡 Major |
| Grids adaptáveis | Colunas reduzem em breakpoints menores | 🟡 Major |
| Menu mobile | Funcional com hamburger em < 768px | 🔴 Crítico |
| Container max-width | Conteúdo limitado a `max-w-7xl` | 🟡 Major |

**Saída:** Score Responsivo parcial (0–100)

### Passo 6 — Consolidar Relatório

Calcular score geral e gerar relatório unificado.

---

## Cálculo do Score Geral

```
Score Geral = (SEO × 0.25) + (A11y × 0.25) + (Perf × 0.25) + (Security × 0.15) + (Responsive × 0.10)
```

| Peso | Categoria | Justificativa |
|------|-----------|--------------|
| 25% | SEO | Descobribilidade e tráfego orgânico |
| 25% | Acessibilidade | Inclusão e conformidade legal |
| 25% | Performance | Experiência do usuário e conversão |
| 15% | Segurança | Proteção de dados e confiança |
| 10% | Responsividade | Experiência multi-dispositivo |

---

## Formato do Relatório Consolidado

```markdown
# Relatório de Qualidade — Auditoria Completa
**Data:** 2026-04-07
**Projeto:** [nome]
**URL:** [domínio]

═══════════════════════════════════════════
## Score Geral: [N]/100 [classificação]
═══════════════════════════════════════════

## Scores por Categoria

| Categoria | Score | Peso | Contribuição | Status |
|-----------|-------|------|-------------|--------|
| 🔍 SEO | [N]/100 | 25% | [N] | 🟢/🟡/🔴 |
| ♿ Acessibilidade | [N]/100 | 25% | [N] | 🟢/🟡/🔴 |
| ⚡ Performance | [N]/100 | 25% | [N] | 🟢/🟡/🔴 |
| 🔒 Segurança | [N]/100 | 15% | [N] | 🟢/🟡/🔴 |
| 📱 Responsividade | [N]/100 | 10% | [N] | 🟢/🟡/🔴 |

## Classificação
| Score | Status | Ação |
|-------|--------|------|
| 90–100 | 🟢 PRONTO PARA DEPLOY | Ship it! |
| 75–89 | 🟡 QUASE PRONTO | Corrigir issues críticos e major |
| 50–74 | 🟠 PRECISA TRABALHO | Correções significativas necessárias |
| 0–49 | 🔴 NÃO DEPLOYAR | Voltar para build |

═══════════════════════════════════════════
## Issues Prioritizados (Top 10)
═══════════════════════════════════════════

| # | Severidade | Categoria | Descrição | Impacto | Esforço |
|---|-----------|-----------|-----------|---------|---------|
| 1 | 🔴 Crítico | [cat] | [desc] | Alto | [baixo/médio/alto] |
| 2 | 🔴 Crítico | [cat] | [desc] | Alto | [baixo/médio/alto] |
| 3 | 🟡 Major | [cat] | [desc] | Médio | [baixo/médio/alto] |
| ... | ... | ... | ... | ... | ... |

## Correções Detalhadas

### Issue #1: [título]
**Categoria:** [SEO/A11y/Perf/Security]
**Severidade:** 🔴 Crítico
**Arquivo:** `src/[caminho]`
**Problema:** [descrição detalhada]
**Impacto:** [quem/o que é afetado]

**Antes:**
```tsx
// código com problema
```

**Depois:**
```tsx
// código corrigido
```

---

═══════════════════════════════════════════
## Detalhamento por Categoria
═══════════════════════════════════════════

### 🔍 SEO — Score: [N]/100
[Resumo das verificações SEO — ver /audit-seo]

### ♿ Acessibilidade — Score: [N]/100
[Resumo das verificações A11y — ver /audit-a11y]

### ⚡ Performance — Score: [N]/100
[Resumo das verificações Perf — ver /audit-perf]

### 🔒 Segurança — Score: [N]/100
[Resumo das verificações de segurança]

### 📱 Responsividade — Score: [N]/100
[Resumo das verificações responsivas]

═══════════════════════════════════════════
## Recomendação Final
═══════════════════════════════════════════

**Status:** [PRONTO / QUASE PRONTO / PRECISA TRABALHO / NÃO DEPLOYAR]

**Ações imediatas:**
1. [ação prioritária 1]
2. [ação prioritária 2]
3. [ação prioritária 3]

**Próximos passos:**
- [ ] Corrigir [N] issues críticos
- [ ] Corrigir [N] issues major
- [ ] Re-executar `/audit-full` após correções
- [ ] Deploy quando score ≥ 90
```

---

## Saída Esperada

```
✅ Auditoria Completa concluída
├── 🔍 SEO: [N]/100
├── ♿ A11y: [N]/100
├── ⚡ Perf: [N]/100
├── 🔒 Security: [N]/100
├── 📱 Responsive: [N]/100
├── ═══════════════════════
├── 📊 SCORE GERAL: [N]/100
├── ═══════════════════════
├── 🔴 [N] issues críticos
├── 🟡 [N] issues major
├── 🟢 [N] issues minor
├── Top 10 correções priorizadas
└── Status: [PRONTO/QUASE/TRABALHO/NÃO]
```

---

## Exemplo de Uso

```
/audit-full
```
