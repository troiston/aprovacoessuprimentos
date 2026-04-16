---
id: skill-audit-security
title: "Audit Security"
agent: 06-qa-auditor
version: 1.0
category: quality
priority: important
requires:
  - rule: 00-constitution
provides:
  - headers de segurança verificados
  - CSP configurado e testado
  - dependências vulneráveis identificadas
  - checklist OWASP Top 10 para web apps
used_by:
  - agent: 06-qa-auditor
  - command: /audit-full
---

# Auditoria de Segurança

## 1. Headers de Segurança

### Configuração no Next.js

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Content-Security-Policy',
    value: generateCSP(),
  },
]

function generateCSP(): string {
  const policy = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-eval'",  // Remover em produção se possível
      "'unsafe-inline'", // Necessário para Next.js, usar nonce em produção
      'https://www.googletagmanager.com',
    ],
    'style-src': ["'self'", "'unsafe-inline'"], // Tailwind precisa de inline
    'img-src': ["'self'", 'data:', 'blob:', 'https://cdn.exemplo.com'],
    'font-src': ["'self'"],
    'connect-src': [
      "'self'",
      'https://api.exemplo.com',
      'https://vitals.vercel-insights.com',
    ],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  }

  return Object.entries(policy)
    .map(([key, values]) =>
      values.length > 0 ? `${key} ${values.join(' ')}` : key
    )
    .join('; ')
}

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

### Verificação dos Headers

```bash
# Verificar com curl
curl -I https://seusite.com.br

# Ou usar securityheaders.com para scan completo
# Target: nota A ou A+
```

### Checklist de Headers

| Header | Valor Esperado | Risco se Ausente |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | Downgrade HTTPS→HTTP |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing attacks |
| `X-Frame-Options` | `SAMEORIGIN` | Clickjacking |
| `Content-Security-Policy` | Policy restritiva | XSS, data injection |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Leak de URLs |
| `Permissions-Policy` | Restritivo | Acesso indevido a APIs |

## 2. Content Security Policy (CSP)

### Teste de Violações no Browser

```
1. Abrir DevTools → Console
2. Filtrar por "Content Security Policy"
3. Se houver violações, será exibido:
   "Refused to load the script 'https://...' because it violates
    the following Content Security Policy directive: ..."
4. Para cada violação: adicionar domínio ao CSP ou remover o recurso
```

### CSP com Nonce para Scripts Inline

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https://cdn.exemplo.com;
    font-src 'self';
    connect-src 'self' https://api.exemplo.com;
    frame-src 'none';
    object-src 'none';
  `.replace(/\n/g, ' ').trim()

  const response = NextResponse.next()
  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('x-nonce', nonce)

  return response
}
```

## 3. Variáveis de Ambiente

### Regra Crítica

**NUNCA** expor secrets via `NEXT_PUBLIC_`:

```bash
# ✅ Variáveis públicas (expostas ao client)
NEXT_PUBLIC_APP_URL=https://seusite.com.br
NEXT_PUBLIC_GTM_ID=GTM-XXXXX
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# ❌ NUNCA como NEXT_PUBLIC_ — são secrets
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_live_xxx
AUTH_SECRET=super-secret-key
SMTP_PASSWORD=xxx
API_SECRET=xxx
```

### Script de Verificação

```typescript
// scripts/check-env-secrets.ts
import { readFileSync, existsSync } from 'fs'

const dangerousPatterns = [
  /NEXT_PUBLIC_.*SECRET/i,
  /NEXT_PUBLIC_.*PASSWORD/i,
  /NEXT_PUBLIC_.*KEY(?!.*PUBLISHABLE)/i,
  /NEXT_PUBLIC_.*TOKEN(?!.*CSRF)/i,
  /NEXT_PUBLIC_.*DATABASE/i,
  /NEXT_PUBLIC_.*PRIVATE/i,
  /NEXT_PUBLIC_.*AUTH(?!.*URL|.*REDIRECT)/i,
]

const envFiles = ['.env', '.env.local', '.env.production', '.env.development']
let hasViolations = false

for (const file of envFiles) {
  if (!existsSync(file)) continue

  const content = readFileSync(file, 'utf-8')
  const lines = content.split('\n')

  for (const [index, line] of lines.entries()) {
    if (line.startsWith('#') || !line.includes('=')) continue

    for (const pattern of dangerousPatterns) {
      if (pattern.test(line)) {
        console.error(`❌ ${file}:${index + 1} — Possível secret exposto: ${line.split('=')[0]}`)
        hasViolations = true
      }
    }
  }
}

if (hasViolations) {
  console.error('\n⚠️  Secrets potencialmente expostos ao client!')
  process.exit(1)
} else {
  console.log('✅ Nenhum secret exposto via NEXT_PUBLIC_')
}
```

### Validação de Env com Zod

```typescript
// lib/env.ts
import { z } from 'zod'

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  SMTP_HOST: z.string(),
  SMTP_PASSWORD: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
})

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
})

export const serverEnv = serverEnvSchema.parse(process.env)
export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
})
```

## 4. Dependências Vulneráveis

```bash
# Verificar vulnerabilidades conhecidas
npm audit

# Apenas produção (sem devDependencies)
npm audit --omit=dev

# Corrigir automaticamente o que for possível
npm audit fix

# Relatório detalhado
npm audit --json > audit-report.json
```

### CI: Falhar Build em Vulnerabilidades Críticas

```yaml
# .github/workflows/security.yml
name: Security Audit

on:
  push:
    branches: [main]
  pull_request:
  schedule:
    - cron: '0 8 * * 1'  # Segunda-feira às 8h

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - name: Security audit
        run: npm audit --audit-level=high
```

## 5. OWASP Top 10 — Checklist para Web Apps

### A01: Broken Access Control
- [ ] Rotas protegidas verificam autenticação no servidor (middleware)
- [ ] Autorização verificada em cada Server Action/API route
- [ ] CORS configurado restritivamente
- [ ] Rate limiting em APIs públicas
- [ ] IDs sequenciais não expostos (usar UUID)

### A02: Cryptographic Failures
- [ ] HTTPS forçado (HSTS)
- [ ] Passwords com hash (bcrypt/argon2), nunca texto plano
- [ ] Tokens JWT com expiração curta
- [ ] Secrets em variáveis de ambiente, não no código

### A03: Injection
- [ ] Prisma ORM usado (queries parametrizadas)
- [ ] Input sanitizado com Zod antes de uso
- [ ] Nenhum `dangerouslySetInnerHTML` sem sanitização
- [ ] Headers CSP bloqueiam inline scripts maliciosos

```typescript
// ✅ Prisma — seguro contra SQL injection
const user = await prisma.user.findUnique({
  where: { email: input.email }, // parametrizado automaticamente
})

// ❌ NUNCA — raw query com interpolação
const user = await prisma.$queryRawUnsafe(
  `SELECT * FROM users WHERE email = '${email}'` // SQL INJECTION!
)

// ✅ Raw query segura
const user = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${email}
`
```

### A04: Insecure Design
- [ ] Rate limiting em login (ex: 5 tentativas/15min)
- [ ] CAPTCHA em formulários públicos
- [ ] Confirmação para ações destrutivas

### A05: Security Misconfiguration
- [ ] Headers de segurança configurados (ver seção 1)
- [ ] Debug mode desabilitado em produção
- [ ] Stack traces não expostos ao client
- [ ] Diretório `.env` no `.gitignore`

### A06: Vulnerable and Outdated Components
- [ ] `npm audit` sem vulnerabilidades high/critical
- [ ] Dependências atualizadas (Dependabot/Renovate)
- [ ] Nenhuma dependência abandonada (>2 anos sem update)

### A07: Identification and Authentication Failures
- [ ] Sessões invalidadas no logout
- [ ] Tokens com expiração
- [ ] Password policy enforçada (mín 8 chars, complexidade)
- [ ] Proteção contra brute force (rate limiting)

### A08: Software and Data Integrity Failures
- [ ] Integridade de subresources (SRI) para CDN scripts
- [ ] CI/CD pipeline segura (secrets não expostos em logs)
- [ ] Dependências verificadas (lockfile commitado)

### A09: Security Logging and Monitoring
- [ ] Login failures logados
- [ ] Acesso negado logado
- [ ] Rate limit triggers logados
- [ ] Alertas para padrões suspeitos

### A10: Server-Side Request Forgery (SSRF)
- [ ] URLs de input validadas (whitelist de domínios)
- [ ] Requests internos não expostos ao client
- [ ] Metadata endpoints bloqueados (169.254.169.254)

## 6. Validação de Input

```typescript
// lib/validations.ts
import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter ao menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[\p{L}\s'-]+$/u, 'Nome contém caracteres inválidos'),
  email: z
    .string()
    .email('Email inválido')
    .max(255),
  message: z
    .string()
    .min(10, 'Mensagem deve ter ao menos 10 caracteres')
    .max(5000, 'Mensagem muito longa'),
})

// Usar em Server Actions
export async function submitContact(formData: FormData) {
  'use server'

  const raw = Object.fromEntries(formData)
  const result = contactFormSchema.safeParse(raw)

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  // Dados validados e tipados
  const { name, email, message } = result.data
  // ... processar
}
```

## 7. Teste de Segurança Automatizado

```typescript
// e2e/security.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Security Headers', () => {
  test('headers de segurança presentes', async ({ page }) => {
    const response = await page.goto('/')
    const headers = response!.headers()

    expect(headers['strict-transport-security']).toBeTruthy()
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['x-frame-options']).toBeTruthy()
    expect(headers['content-security-policy']).toBeTruthy()
    expect(headers['referrer-policy']).toBeTruthy()
  })
})

test.describe('XSS Prevention', () => {
  test('input malicioso não executa script', async ({ page }) => {
    await page.goto('/contact')

    const xssPayload = '<script>alert("xss")</script>'
    await page.getByLabel('Nome').fill(xssPayload)
    await page.getByLabel('Email').fill('test@test.com')
    await page.getByLabel('Mensagem').fill(xssPayload)

    const dialogPromise = page.waitForEvent('dialog', { timeout: 2000 }).catch(() => null)
    await page.getByRole('button', { name: 'Enviar' }).click()

    const dialog = await dialogPromise
    expect(dialog).toBeNull()
  })
})

test.describe('Auth Protection', () => {
  test('rotas protegidas redirecionam sem auth', async ({ page }) => {
    const protectedRoutes = ['/dashboard', '/settings', '/admin']

    for (const route of protectedRoutes) {
      const response = await page.goto(route)
      expect(page.url()).toContain('/login')
    }
  })
})
```

## Checklist Final de Auditoria

- [ ] Headers de segurança: nota A no securityheaders.com
- [ ] CSP configurado e testado (sem violações no console)
- [ ] Nenhum secret em `NEXT_PUBLIC_`
- [ ] Env vars validados com Zod no startup
- [ ] `npm audit` sem high/critical
- [ ] OWASP Top 10 checklist completo
- [ ] Input validation com Zod em toda Server Action/API
- [ ] Testes de segurança E2E passando
- [ ] Rate limiting em endpoints críticos
- [ ] HTTPS forçado com HSTS
