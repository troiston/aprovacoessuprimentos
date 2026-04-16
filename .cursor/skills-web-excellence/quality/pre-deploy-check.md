---
id: skill-pre-deploy-check
title: "Pre Deploy Check"
agent: 06-qa-auditor
version: 1.0
category: quality
priority: critical
requires:
  - skill: skill-audit-a11y
  - skill: skill-audit-security
  - skill: skill-optimize-lcp
  - skill: skill-optimize-bundle
  - rule: 00-constitution
provides:
  - checklist completo pré-deploy
  - scores Lighthouse dentro dos targets
  - decisão go/no-go fundamentada
used_by:
  - agent: 06-qa-auditor
  - command: /audit-full
---

# Pre-Deploy Check

## Checklist Completo

Este checklist DEVE ser executado antes de cada deploy para produção. Cada item é bloqueante — se falhar, o deploy NÃO prossegue.

## 1. Build

```bash
# Build limpo sem erros
rm -rf .next
npm run build
```

### Critérios de Aprovação

- [ ] Build completa sem erros
- [ ] Zero warnings de TypeScript (strict mode)
- [ ] Zero erros de ESLint
- [ ] First Load JS < 200KB em todas as rotas
- [ ] Nenhum `// @ts-ignore` ou `// @ts-expect-error` sem justificativa
- [ ] Nenhum `any` explícito no código

### Verificação do Output

```
Route (app)                    Size     First Load JS
┌ ○ /                          5.2 kB   180 kB  ✅
├ ○ /about                     3.1 kB   175 kB  ✅
├ ● /blog/[slug]               4.4 kB   178 kB  ✅
├ ○ /contact                   4.3 kB   176 kB  ✅
└ ○ /pricing                   6.1 kB   185 kB  ✅

Todos < 200KB? → ✅ PASS
```

## 2. Testes

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type check
npx tsc --noEmit
```

### Critérios de Aprovação

- [ ] Todos os unit tests passando (0 failures)
- [ ] Todos os E2E tests passando (0 failures)
- [ ] Coverage > 80% (statements, branches, functions, lines)
- [ ] TypeScript compila sem erros
- [ ] Nenhum test pulado (`skip`, `only`) commitado

## 3. Lighthouse

Rodar Lighthouse em cada página principal com throttling de produção:

```bash
# Instalar Lighthouse CI
npm install -g @lhci/cli

# Rodar em modo headless
lhci autorun --config=lighthouserc.json
```

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/about",
        "http://localhost:3000/blog",
        "http://localhost:3000/contact",
        "http://localhost:3000/pricing"
      ],
      "numberOfRuns": 3,
      "startServerCommand": "npm run start",
      "startServerReadyPattern": "Ready"
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.90 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.90 }],
        "categories:seo": ["error", { "minScore": 0.95 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### Targets Mínimos

| Categoria | Score Mínimo | Target Ideal |
|---|---|---|
| Performance | **≥ 90** | 95+ |
| Accessibility | **≥ 95** | 100 |
| Best Practices | **≥ 90** | 95+ |
| SEO | **≥ 95** | 100 |

- [ ] Performance ≥ 90 em todas as páginas
- [ ] Accessibility ≥ 95 em todas as páginas
- [ ] Best Practices ≥ 90 em todas as páginas
- [ ] SEO ≥ 95 em todas as páginas

## 4. SEO

```bash
# Verificar meta tags e JSON-LD com ferramenta ou script
npx next-sitemap
```

### Checklist SEO

- [ ] Cada página tem `<title>` único e descritivo (50-60 chars)
- [ ] Cada página tem `<meta name="description">` (120-160 chars)
- [ ] Open Graph tags em todas as páginas (`og:title`, `og:description`, `og:image`)
- [ ] Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:image`)
- [ ] `<link rel="canonical">` em todas as páginas
- [ ] JSON-LD (Organization, WebSite, BreadcrumbList) implementado
- [ ] `sitemap.xml` gerado e acessível em `/sitemap.xml`
- [ ] `robots.txt` configurado e acessível em `/robots.txt`
- [ ] Headings hierárquicos (apenas 1 `h1` por página, h2-h6 em ordem)
- [ ] Imagens com `alt` descritivo
- [ ] URLs amigáveis (sem IDs numéricos, sem parâmetros desnecessários)
- [ ] `hreflang` se site multilíngue
- [ ] Nenhuma página com `noindex` acidental

### Verificação Rápida de Meta Tags

```typescript
// scripts/check-meta.ts
import { chromium } from 'playwright'

const pages = ['/', '/about', '/blog', '/contact', '/pricing']

async function checkMeta() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  for (const route of pages) {
    await page.goto(`http://localhost:3000${route}`)

    const title = await page.title()
    const description = await page.$eval(
      'meta[name="description"]',
      (el) => el.getAttribute('content')
    ).catch(() => null)
    const ogTitle = await page.$eval(
      'meta[property="og:title"]',
      (el) => el.getAttribute('content')
    ).catch(() => null)
    const canonical = await page.$eval(
      'link[rel="canonical"]',
      (el) => el.getAttribute('href')
    ).catch(() => null)
    const jsonLd = await page.$$eval(
      'script[type="application/ld+json"]',
      (els) => els.map((el) => el.textContent)
    )

    console.log(`\n${route}:`)
    console.log(`  title: ${title ? `✅ "${title}" (${title.length} chars)` : '❌ MISSING'}`)
    console.log(`  description: ${description ? `✅ (${description.length} chars)` : '❌ MISSING'}`)
    console.log(`  og:title: ${ogTitle ? '✅' : '❌ MISSING'}`)
    console.log(`  canonical: ${canonical ? '✅' : '❌ MISSING'}`)
    console.log(`  JSON-LD: ${jsonLd.length > 0 ? `✅ (${jsonLd.length} schemas)` : '❌ MISSING'}`)

    if (title && title.length > 60) console.log(`  ⚠️ Title muito longo: ${title.length} chars`)
    if (description && description.length > 160) console.log(`  ⚠️ Description muito longa: ${description.length} chars`)
  }

  await browser.close()
}

checkMeta()
```

## 5. Acessibilidade

- [ ] axe-core E2E passando em todas as páginas (0 violações)
- [ ] Skip navigation funcional
- [ ] Teste de teclado manual: navegação completa sem mouse
- [ ] Contraste verificado em light e dark mode
- [ ] `lang="pt-BR"` no `<html>`
- [ ] Landmarks presentes: `<header>`, `<nav>`, `<main>`, `<footer>`

## 6. Variáveis de Ambiente

- [ ] Todas as env vars necessárias configuradas no hosting
- [ ] Nenhum secret em `NEXT_PUBLIC_`
- [ ] `DATABASE_URL` aponta para banco de produção
- [ ] `AUTH_SECRET` é um valor forte e único
- [ ] URLs de API apontam para produção (não localhost)
- [ ] Chaves de terceiros são de produção (não test/sandbox)

### Verificação

```bash
# Listar env vars configuradas (sem mostrar valores)
vercel env ls  # se Vercel
# ou
printenv | grep -E '^(NEXT_PUBLIC_|DATABASE_|AUTH_|STRIPE_)' | cut -d= -f1
```

## 7. Headers de Segurança

- [ ] Nota A ou A+ no securityheaders.com
- [ ] CSP configurado e sem violações
- [ ] HSTS habilitado
- [ ] X-Frame-Options configurado

## 8. Imagens

- [ ] Todas as imagens usando `next/image`
- [ ] AVIF/WebP habilitados no config
- [ ] `sizes` definido corretamente
- [ ] `priority` apenas em LCP images (1-2 por página)
- [ ] Placeholder blur em imagens visíveis
- [ ] Nenhuma imagem > 200KB após otimização

## 9. Fontes

- [ ] Máximo 2 famílias carregadas
- [ ] `next/font` usado (self-hosting)
- [ ] Subsetting configurado (latin)
- [ ] CLS = 0 no carregamento de fontes

## 10. Bundle Size

- [ ] First Load JS < 200KB em todas as rotas
- [ ] Shared chunks < 100KB
- [ ] Nenhum polyfill desnecessário
- [ ] Dynamic imports para componentes below-the-fold

## Script de Verificação Automatizado

```typescript
// scripts/pre-deploy-check.ts
import { execSync } from 'child_process'

interface CheckResult {
  name: string
  status: 'pass' | 'fail' | 'warn'
  details: string
}

const results: CheckResult[] = []

function run(name: string, command: string, expectSuccess = true): void {
  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' })
    results.push({ name, status: 'pass', details: output.slice(0, 200) })
  } catch (error) {
    const err = error as { stderr?: string; stdout?: string }
    results.push({
      name,
      status: expectSuccess ? 'fail' : 'warn',
      details: (err.stderr || err.stdout || 'Unknown error').slice(0, 200),
    })
  }
}

console.log('🔍 Executando pre-deploy checks...\n')

run('TypeScript', 'npx tsc --noEmit')
run('ESLint', 'npx eslint . --max-warnings=0')
run('Unit Tests', 'npx vitest run')
run('Build', 'npx next build')
run('npm audit', 'npm audit --audit-level=high --omit=dev')

console.log('\n📋 Resultados:\n')
console.log('─'.repeat(60))

let hasFailures = false

for (const r of results) {
  const icon = r.status === 'pass' ? '✅' : r.status === 'fail' ? '❌' : '⚠️'
  console.log(`${icon} ${r.name}`)
  if (r.status !== 'pass') {
    console.log(`   ${r.details}`)
    if (r.status === 'fail') hasFailures = true
  }
}

console.log('─'.repeat(60))

if (hasFailures) {
  console.log('\n🚫 DEPLOY BLOQUEADO — corrija os itens acima')
  process.exit(1)
} else {
  console.log('\n✅ TODOS OS CHECKS PASSARAM — deploy autorizado')
}
```

```json
// package.json
{
  "scripts": {
    "pre-deploy": "npx tsx scripts/pre-deploy-check.ts",
    "deploy": "npm run pre-deploy && vercel --prod"
  }
}
```

## Matriz Go/No-Go

| Critério | Go | No-Go |
|---|---|---|
| Build | Zero erros | Qualquer erro |
| TypeScript | Zero erros | Qualquer erro |
| Unit Tests | 100% passando | Qualquer falha |
| E2E Tests | 100% passando | Qualquer falha |
| Lighthouse Performance | ≥ 90 | < 90 |
| Lighthouse Accessibility | ≥ 95 | < 95 |
| Lighthouse Best Practices | ≥ 90 | < 90 |
| Lighthouse SEO | ≥ 95 | < 95 |
| First Load JS | < 200KB todas rotas | > 200KB qualquer rota |
| npm audit | 0 high/critical | Qualquer high/critical |
| Security Headers | Nota A+ ou A | Nota B ou inferior |
| Meta Tags SEO | Completas em todas páginas | Faltando em qualquer página |
| axe-core | 0 violações | Qualquer violação |
| Env Vars | Todas configuradas | Qualquer faltando |

### Decisão

```
✅ TODOS os critérios Go atingidos → DEPLOY AUTORIZADO
❌ QUALQUER critério No-Go → DEPLOY BLOQUEADO

Se bloqueado:
1. Identificar item(s) falhando
2. Corrigir
3. Re-executar checklist completo
4. Só deployar quando TUDO passar
```

## CI/CD Pipeline Completo

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - name: TypeScript Check
        run: npx tsc --noEmit

      - name: ESLint
        run: npx eslint . --max-warnings=0

      - name: Unit Tests
        run: npx vitest run --coverage

      - name: Build
        run: npm run build

      - name: Security Audit
        run: npm audit --audit-level=high --omit=dev

  e2e:
    needs: checks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build

      - name: E2E Tests
        run: npx playwright test --project=chromium

      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/

  lighthouse:
    needs: checks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run build

      - name: Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

  deploy:
    needs: [checks, e2e, lighthouse]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```
