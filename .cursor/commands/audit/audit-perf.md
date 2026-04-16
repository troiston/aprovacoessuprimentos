---
id: cmd-audit-perf
title: Auditoria de Performance
version: 2.0
last_updated: 2026-04-07
category: audit
agent: 06-qa-auditor
skills:
  - optimize-images
  - optimize-fonts
  - optimize-lcp
  - optimize-bundle
---

# `/audit-perf`

Executa auditoria completa de performance contra os Core Web Vitals e o performance budget do framework. Analisa LCP, CLS, INP, bundle size, imagens, fontes, e third-party scripts. Gera relatório com scores e recomendações de otimização priorizadas.

---

## Parâmetros

Nenhum parâmetro necessário — audita todo o projeto automaticamente.

---

## Performance Budget (Referência)

| Métrica | Budget | Fonte |
|---------|--------|-------|
| LCP | < 2.5 segundos | Core Web Vitals |
| CLS | < 0.1 | Core Web Vitals |
| INP | < 200ms | Core Web Vitals |
| First Load JS por rota | < 200KB | Framework Rule |
| Total bundle (shared) | < 100KB | Framework Rule |
| Largest image | < 200KB (comprimida) | Best Practice |
| Web fonts total | < 100KB | Best Practice |
| Third-party scripts | < 50KB | Best Practice |
| Time to First Byte | < 800ms | Best Practice |

---

## Passo a Passo de Execução

### Passo 1 — Medir Core Web Vitals

#### LCP (Largest Contentful Paint) — Budget: < 2.5s

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| LCP element identificado | Saber qual é o LCP de cada página (hero image, h1, vídeo) | 🔴 Crítico |
| `priority` na LCP image | `<Image priority>` no elemento LCP | 🔴 Crítico |
| `sizes` correto | `sizes` com breakpoints evitando download de imagem maior | 🔴 Crítico |
| Preload de fontes | Fonte do heading com `preload` via `next/font` | 🟡 Major |
| Sem blocking resources | Nenhum CSS/JS bloqueando render | 🔴 Crítico |
| Server Components | Página do LCP é Server Component | 🟡 Major |

#### CLS (Cumulative Layout Shift) — Budget: < 0.1

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| Imagens com dimensões | `width`/`height` em toda `<Image>` | 🔴 Crítico |
| Fontes com `font-display: swap` | Via `next/font` com `display: "swap"` | 🔴 Crítico |
| Sem conteúdo injetado acima do fold | Nenhum banner/toast que empurra conteúdo | 🟡 Major |
| Skeleton/placeholder | Loading states com dimensões fixas | 🟡 Major |
| Embeds com aspect-ratio | iframes com `aspect-ratio` CSS | 🟡 Major |
| Anúncios com slot reservado | Espaço pré-definido para ads (se houver) | 🔴 Crítico |

#### INP (Interaction to Next Paint) — Budget: < 200ms

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| Sem long tasks | Nenhuma tarefa JS > 50ms no main thread | 🔴 Crítico |
| Event handlers leves | onClick/onChange sem lógica pesada | 🟡 Major |
| Debounce em inputs | Search e filtros com debounce ≥ 300ms | 🟡 Major |
| `useTransition` para updates | Atualizações de estado não-urgentes com transition | 🟡 Major |
| Sem re-renders cascata | Client Components sem re-renders desnecessários | 🟡 Major |

### Passo 2 — Analisar Bundle

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| First Load JS < 200KB | Por rota individual | 🔴 Crítico |
| Shared bundle < 100KB | Código compartilhado entre rotas | 🔴 Crítico |
| Sem duplicatas | Nenhuma lib incluída 2x no bundle | 🟡 Major |
| Tree-shaking funcional | Imports nomeados, sem barrel re-exports grandes | 🟡 Major |
| Dynamic imports | Componentes pesados com `dynamic(() => import())` | 🟡 Major |
| `"use client"` mínimo | Boundary no nível mais baixo possível | 🟡 Major |
| Sem libs client desnecessárias | Lodash, moment.js, etc. não incluídas | 🔴 Crítico |

**Como analisar:**
```bash
npx next build
# Verificar output de .next/analyze (se @next/bundle-analyzer instalado)
# Ou verificar os sizes reportados no build
```

### Passo 3 — Auditar Imagens

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| `next/image` em toda imagem | Nenhum `<img>` nativo | 🔴 Crítico |
| Formatos modernos | `images.formats: ["image/avif", "image/webp"]` em `next.config.ts` | 🔴 Crítico |
| `sizes` declarado | Responsive sizes em toda imagem | 🟡 Major |
| `priority` apenas no LCP | Sem `priority` em imagens below the fold | 🟡 Major |
| Lazy loading default | Imagens below fold são lazy por padrão | ✅ (Next.js default) |
| Imagem < 200KB | Após compressão, nenhuma imagem > 200KB | 🟡 Major |
| `placeholder="blur"` | Em imagens hero/above-the-fold | 🟢 Minor |
| Aspect ratio preservado | `width`/`height` corretos em toda imagem | 🔴 Crítico |

### Passo 4 — Auditar Fontes

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| `next/font` usado | Fontes via `next/font/google` ou `next/font/local` | 🔴 Crítico |
| `display: "swap"` | Em toda declaração de fonte | 🔴 Crítico |
| `subsets: ["latin"]` | Subset mínimo selecionado | 🟡 Major |
| Variable fonts | Preferir variable sobre múltiplos weights | 🟡 Major |
| Total < 100KB | Soma de todas as fontes | 🟡 Major |
| Máximo 3 famílias | Sans + heading + mono (se necessário) | 🟡 Major |
| Font variable no CSS | `--font-sans`, `--font-heading` declarados | 🟢 Minor |

### Passo 5 — Auditar Third-Party Scripts

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| `next/script` usado | Scripts externos via `<Script>` | 🔴 Crítico |
| Strategy definida | `afterInteractive` ou `lazyOnload` | 🔴 Crítico |
| Analytics lightweight | Plausible/Umami preferido sobre GA4 | 🟡 Major |
| Sem scripts bloqueantes | Nenhum script `beforeInteractive` sem necessidade | 🔴 Crítico |
| Total < 50KB | Third-party JS total | 🟡 Major |

### Passo 6 — Verificar Server Components

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| Páginas são Server Components | Nenhum `page.tsx` com `"use client"` | 🔴 Crítico |
| Layouts são Server Components | Nenhum `layout.tsx` com `"use client"` | 🔴 Crítico |
| Client boundary mínimo | `"use client"` no componente mais baixo | 🟡 Major |
| Props serializáveis | Props passadas de Server → Client são serializáveis | 🔴 Crítico |
| Sem `useState` desnecessário | Verificar se estado pode ser evitado | 🟡 Major |

### Passo 7 — Verificar Caching

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| Static pages são SSG | Páginas sem dados dinâmicos são estáticas | 🟡 Major |
| ISR configurado | Páginas de conteúdo com `revalidate` | 🟡 Major |
| Cache headers | `next.config.ts` com cache headers para assets | 🟡 Major |
| `unstable_cache` para queries | Database queries cacheadas quando possível | 🟢 Minor |

---

## Formato do Relatório

```markdown
# Relatório de Performance
**Data:** 2026-04-07
**Projeto:** [nome]

## Core Web Vitals
| Métrica | Valor Estimado | Budget | Status |
|---------|---------------|--------|--------|
| LCP | ~[N]s | < 2.5s | ✅/❌ |
| CLS | ~[N] | < 0.1 | ✅/❌ |
| INP | ~[N]ms | < 200ms | ✅/❌ |

## Bundle Analysis
| Rota | First Load JS | Budget | Status |
|------|--------------|--------|--------|
| `/` | [N]KB | < 200KB | ✅/❌ |
| `/about` | [N]KB | < 200KB | ✅/❌ |
| `/pricing` | [N]KB | < 200KB | ✅/❌ |
| Shared | [N]KB | < 100KB | ✅/❌ |

## Resumo por Categoria
| Categoria | ✅ Pass | ❌ Fail | ⚠️ Warning |
|-----------|--------|--------|------------|
| Core Web Vitals | X | X | X |
| Bundle | X | X | X |
| Imagens | X | X | X |
| Fontes | X | X | X |
| Third-Party | X | X | X |
| Server Components | X | X | X |
| Caching | X | X | X |
| **TOTAL** | **X** | **X** | **X** |

## Score: [N]/100

## Otimizações Recomendadas (por prioridade)
1. 🔴 **[otimização]** — Impacto: [LCP/CLS/INP/Bundle], Esforço: [baixo/médio/alto]
   ```tsx
   // código da otimização
   ```
```

---

## Saída Esperada

```
✅ Auditoria de Performance concluída
├── Core Web Vitals estimados (LCP, CLS, INP)
├── Bundle analysis por rota
├── [N] imagens auditadas
├── [N] fontes verificadas
├── [N] third-party scripts analisados
├── Score: [N]/100
├── [N] otimizações recomendadas (priorizadas)
└── Conformidade com performance budget: [SIM/NÃO]
```

---

## Exemplo de Uso

```
/audit-perf
```
