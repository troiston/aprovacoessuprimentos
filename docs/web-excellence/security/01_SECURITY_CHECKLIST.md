---
id: doc-security-checklist
title: Checklist de Segurança Web (50+ Itens)
version: 2.0
last_updated: 2026-04-07
category: security
priority: critical
related:
  - docs/web-excellence/security/02_THREAT_MODEL.md
  - docs/web-excellence/security/03_AUTH_SECURITY.md
  - .cursor/rules/quality/security.mdc
---

# Checklist de Segurança Web (50+ Itens)

## Visão Geral

Segurança não é feature — é requisito. Este checklist cobre 50+ itens organizados por categoria com prioridade e referência de implementação. Em 2025, **43% dos ataques web** exploram vulnerabilidades conhecidas que poderiam ser prevenidas com configurações básicas (Verizon DBIR, 2025).

---

## 1. HTTP Security Headers

| # | Header | Valor Recomendado | Prioridade | O que Previne |
|---|--------|-------------------|-----------|---------------|
| 1 | `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | 🔴 Crítico | Downgrade HTTPS→HTTP |
| 2 | `X-Frame-Options` | `DENY` ou `SAMEORIGIN` | 🔴 Crítico | Clickjacking |
| 3 | `Content-Security-Policy` | Ver seção 1.1 | 🔴 Crítico | XSS, injection |
| 4 | `X-Content-Type-Options` | `nosniff` | 🔴 Crítico | MIME type sniffing |
| 5 | `Referrer-Policy` | `strict-origin-when-cross-origin` | 🟡 Alto | Vazamento de URL |
| 6 | `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | 🟡 Alto | Acesso indevido a APIs |
| 7 | `X-DNS-Prefetch-Control` | `off` | 🟢 Médio | DNS leak de links |
| 8 | `Cross-Origin-Opener-Policy` | `same-origin` | 🟡 Alto | Window reference attacks |
| 9 | `Cross-Origin-Resource-Policy` | `same-origin` | 🟡 Alto | Resource theft |
| 10 | `Cross-Origin-Embedder-Policy` | `require-corp` | 🟢 Médio | Spectre mitigations |

### 1.1 Content Security Policy (CSP)

```tsx
// next.config.js — headers()
const cspHeader = `
  default-src 'self';
  script-src 'self' 'nonce-{NONCE}' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https: blob:;
  font-src 'self';
  connect-src 'self' https://api.meuapp.com https://vitals.vercel-insights.com;
  frame-ancestors 'none';
  form-action 'self';
  base-uri 'self';
  upgrade-insecure-requests;
`.replace(/\n/g, '')

// middleware.ts — Gerar nonce por request
import { NextResponse } from 'next/server'
export function middleware(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const response = NextResponse.next()
  response.headers.set(
    'Content-Security-Policy',
    cspHeader.replace('{NONCE}', nonce)
  )
  return response
}
```

### 1.2 Implementação no Next.js

```js
// next.config.js
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ]
}
```

---

## 2. Input Validation

| # | Item | Prioridade | Implementação |
|---|------|-----------|---------------|
| 11 | Validar TODOS os inputs com Zod (server-side) | 🔴 Crítico | Zod schemas |
| 12 | Validar inputs no client (UX) E server (segurança) | 🔴 Crítico | Double validation |
| 13 | Sanitizar HTML em inputs de rich text | 🔴 Crítico | DOMPurify ou sanitize-html |
| 14 | Limitar tamanho de inputs (maxLength) | 🟡 Alto | `z.string().max(1000)` |
| 15 | Validar tipos (email, URL, UUID) | 🟡 Alto | `z.email()`, `z.url()` |
| 16 | Rejeitar caracteres especiais em usernames | 🟡 Alto | Regex allowlist |
| 17 | Validar file uploads (tipo, tamanho, conteúdo) | 🔴 Crítico | MIME check + magic bytes |
| 18 | Parametrizar TODAS queries de banco | 🔴 Crítico | Prisma (auto), ou prepared statements |
| 19 | Escapar output em templates | 🔴 Crítico | React faz por padrão, cuidado com `dangerouslySetInnerHTML` |
| 20 | Validar e limitar array/object inputs | 🟡 Alto | `z.array().max(100)` |

### 2.1 Padrão Zod para Server Actions

```tsx
import { z } from 'zod'

const createProjectSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  description: z.string().max(5000).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).max(50),
  isPublic: z.boolean().default(false),
})

export async function createProject(formData: FormData) {
  'use server'
  const parsed = createProjectSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    slug: formData.get('slug'),
    isPublic: formData.get('isPublic') === 'true',
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  // Dados seguros — usar parsed.data
}
```

---

## 3. Autenticação e Sessão

| # | Item | Prioridade | Referência |
|---|------|-----------|-----------|
| 21 | Sessões em httpOnly cookies (NUNCA localStorage) | 🔴 Crítico | docs/security/03_AUTH_SECURITY.md |
| 22 | Flag `Secure` em todos cookies | 🔴 Crítico | Previne envio via HTTP |
| 23 | `SameSite=Strict` ou `Lax` | 🔴 Crítico | Previne CSRF |
| 24 | Rate limiting em login (5 tentativas/5 min) | 🔴 Crítico | Previne brute force |
| 25 | Rate limiting em reset password | 🔴 Crítico | Previne spam |
| 26 | CSRF token em forms (ou SameSite=Strict) | 🔴 Crítico | Previne CSRF |
| 27 | Session fixation protection (regenerar ID após login) | 🟡 Alto | Session hijacking |
| 28 | Logout invalida sessão no servidor | 🟡 Alto | Não apenas limpar cookie |
| 29 | Timeout de sessão inativa (30-60 min) | 🟡 Alto | Compliance |
| 30 | MFA para contas admin/privilegiadas | 🟡 Alto | Defense in depth |
| 31 | Account lockout após N falhas (com unlock temporal) | 🟡 Alto | Brute force |
| 32 | Não revelar se email existe em "esqueci senha" | 🟡 Alto | User enumeration |

---

## 4. Ambiente e Segredos

| # | Item | Prioridade | Implementação |
|---|------|-----------|---------------|
| 33 | Separar env vars: `.env.local` (dev), env vars de produção | 🔴 Crítico | Vercel env vars |
| 34 | NUNCA commitar .env no git | 🔴 Crítico | `.gitignore` |
| 35 | Prefixo `NEXT_PUBLIC_` apenas para vars públicas | 🔴 Crítico | Não expor secrets |
| 36 | Rotação regular de secrets (API keys, tokens) | 🟡 Alto | Quarterly mínimo |
| 37 | Validar env vars obrigatórias no startup | 🟡 Alto | `z.env()` schema |
| 38 | Não logar secrets (mascarar em logs) | 🟡 Alto | Previne leaking |
| 39 | Diferentes secrets por ambiente (dev/staging/prod) | 🔴 Crítico | Isolamento |
| 40 | Usar secret manager (Vault, AWS SM) em produção | 🟢 Médio | Secret rotation |

### 4.1 Validação de Env no Startup

```tsx
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  RESEND_API_KEY: z.string().startsWith('re_'),
})

export const env = envSchema.parse(process.env)
```

---

## 5. Dependências

| # | Item | Prioridade | Implementação |
|---|------|-----------|---------------|
| 41 | `npm audit` / `pnpm audit` regular | 🔴 Crítico | CI/CD pipeline |
| 42 | Snyk ou Dependabot ativo | 🟡 Alto | Automação de patches |
| 43 | Lockfile commitado (`pnpm-lock.yaml`) | 🔴 Crítico | Reproducibilidade |
| 44 | Atualizar dependencies mensalmente | 🟡 Alto | Security patches |
| 45 | Avaliar dependencies novas (supply chain risk) | 🟡 Alto | Verificar maintainers, downloads |
| 46 | Não usar packages abandonados (>1 ano sem update) | 🟢 Médio | Risk assessment |

---

## 6. Deployment e Infraestrutura

| # | Item | Prioridade | Implementação |
|---|------|-----------|---------------|
| 47 | HTTPS obrigatório (redirect HTTP→HTTPS) | 🔴 Crítico | HSTS + redirect |
| 48 | CDN com WAF (Web Application Firewall) | 🟡 Alto | Cloudflare, Vercel |
| 49 | Rate limiting global (API) | 🔴 Crítico | Middleware ou CDN |
| 50 | Error handling que não vaza stack traces | 🔴 Crítico | Custom error pages |
| 51 | Logging de segurança (login attempts, permission errors) | 🟡 Alto | Audit trail |
| 52 | Backup automático do banco | 🔴 Crítico | Diário mínimo |
| 53 | Disaster recovery testado | 🟡 Alto | Restore test quarterly |
| 54 | CORS configurado corretamente | 🔴 Crítico | Origins específicas |
| 55 | Disable directory listing | 🟡 Alto | Prevenir information disclosure |

### 6.1 CORS no Next.js

```tsx
// app/api/[...]/route.ts
const allowedOrigins = ['https://meuapp.com', 'https://app.meuapp.com']

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin')
  if (origin && allowedOrigins.includes(origin)) {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    })
  }
  return new Response(null, { status: 403 })
}
```

---

## 7. Dados e Privacidade (LGPD)

| # | Item | Prioridade | Referência |
|---|------|-----------|-----------|
| 56 | Consent banner para cookies não essenciais | 🔴 Crítico | LGPD Art. 7 |
| 57 | Política de privacidade atualizada | 🔴 Crítico | LGPD Art. 9 |
| 58 | Termos de uso | 🔴 Crítico | Contratual |
| 59 | Endpoint de exportação de dados do usuário | 🟡 Alto | LGPD Art. 18 |
| 60 | Endpoint de exclusão de conta/dados | 🟡 Alto | LGPD Art. 18 |
| 61 | Registro de processamento de dados | 🟡 Alto | LGPD Art. 37 |
| 62 | Criptografia de dados sensíveis em repouso | 🟡 Alto | LGPD Art. 46 |
| 63 | Notificação de breach em 72h | 🟡 Alto | LGPD Art. 48 |

---

## 8. Verificação e Teste

| # | Item | Prioridade | Ferramenta |
|---|------|-----------|-----------|
| 64 | Security headers scan | 🟡 Alto | securityheaders.com |
| 65 | SSL Labs test (A+ rating) | 🟡 Alto | ssllabs.com |
| 66 | OWASP ZAP scan automatizado | 🟢 Médio | CI/CD pipeline |
| 67 | Penetration testing anual | 🟢 Médio | Especialista externo |
| 68 | Dependency audit no CI | 🔴 Crítico | `pnpm audit --audit-level high` |

---

## Fontes e Referências

- OWASP Top 10 (2025 update)
- Verizon Data Breach Investigations Report 2025
- LGPD — Lei 13.709/2018
- Mozilla Observatory — Security Headers
- NIST Cybersecurity Framework 2.0
- Next.js Security Documentation
