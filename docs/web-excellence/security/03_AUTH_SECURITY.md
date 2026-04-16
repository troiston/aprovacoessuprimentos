---
id: doc-auth-security
title: Segurança de Autenticação — Implementação Técnica
version: 2.0
last_updated: 2026-04-07
category: security
priority: critical
related:
  - docs/web-excellence/security/01_SECURITY_CHECKLIST.md
  - docs/web-excellence/security/02_THREAT_MODEL.md
  - docs/web-excellence/saas/01_AUTH_PATTERNS.md
---

# Segurança de Autenticação — Implementação Técnica

## Visão Geral

Autenticação é o vetor de ataque #1 em aplicações web (OWASP, 2025). Este documento cobre implementação segura de: hashing de senhas, gerenciamento de sessão, JWT, OAuth, MFA, rate limiting, e padrões de segurança para password reset e invalidação de sessão.

---

## 1. Password Hashing

### 1.1 Comparação de Algoritmos

| Algoritmo | Segurança (2026) | Performance | Memória | Recomendação |
|-----------|-----------------|-------------|---------|--------------|
| **Argon2id** | Excelente | Configurável | Alta (64MB+) | ✅ **Preferido** — resiste a GPU/ASIC |
| **bcrypt** | Boa | Médio | Baixa | ✅ Alternativa sólida |
| scrypt | Boa | Lento | Configurável | 🟡 Aceitável |
| PBKDF2 | Aceitável | Lento | Baixa | 🟡 Apenas se bcrypt/argon2 indisponível |
| SHA-256/MD5 | ❌ **Inseguro** | Rápido | Baixa | ❌ NUNCA para senhas |

### 1.2 Configuração Recomendada

```tsx
// Argon2id (preferido)
import argon2 from 'argon2'

async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,    // 64 MB
    timeCost: 3,          // 3 iterations
    parallelism: 4,       // 4 threads
  })
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return argon2.verify(hash, password)
}

// bcrypt (alternativa)
import bcrypt from 'bcrypt'
const SALT_ROUNDS = 12 // 2^12 = 4096 iterations (~250ms em 2026)

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}
```

### 1.3 Regras de Senha (NIST 800-63B)

| Regra | Recomendação NIST 2024 |
|-------|----------------------|
| Comprimento mínimo | 8 caracteres (preferido: 12+) |
| Comprimento máximo | 64+ caracteres (não limitar artificialmente) |
| Complexidade obrigatória | ❌ NÃO exigir maiúsculas/números/especiais |
| Dicionário de senhas comuns | ✅ Bloquear as 100K+ senhas mais comuns |
| Expiração forçada | ❌ NÃO exigir troca periódica (só em breach) |
| Medidor de força | ✅ Mostrar feedback visual de força |

---

## 2. Session Management

### 2.1 Configuração de Cookie

```tsx
const SESSION_CONFIG = {
  name: '__session',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 dias
}
```

### 2.2 Flags de Cookie

| Flag | Valor | O que Previne |
|------|-------|---------------|
| `HttpOnly` | `true` (sempre) | XSS roubando cookie via JS |
| `Secure` | `true` (production) | Envio via HTTP não-criptografado |
| `SameSite` | `Strict` ou `Lax` | CSRF |
| `Path` | `/` | Limitar escopo do cookie |
| `Domain` | `.meuapp.com` | Subdomínios compartilhados |
| `Max-Age` | `604800` (7d) | Expiração automática |

### 2.3 SameSite: Strict vs Lax

| Valor | Comportamento | Quando Usar |
|-------|--------------|-------------|
| `Strict` | Nunca enviado em cross-site requests | Apps sem links externos apontando para ações |
| `Lax` | Enviado em GET cross-site (links), não em POST | **Recomendado para maioria** — permite deep links |
| `None` | Sempre enviado (requer Secure) | Apenas para embeds cross-origin |

---

## 3. JWT Best Practices

### 3.1 Quando Usar JWT

| Cenário | JWT? | Alternativa |
|---------|------|-------------|
| API stateless (microservices) | ✅ | - |
| SPA + API separada | 🟡 | Session cookies (preferido) |
| Server-rendered app | ❌ | Session cookies |
| Mobile app | ✅ | Secure storage |
| Third-party integrations | ✅ | OAuth tokens |

### 3.2 Configuração Segura

| Aspecto | Regra |
|---------|-------|
| Algoritmo | RS256 ou ES256 (assimétrico) — evitar HS256 em produção |
| Access token TTL | 15-60 minutos (curto!) |
| Refresh token TTL | 7-30 dias |
| Storage (browser) | httpOnly cookie (NUNCA localStorage) |
| Payload | Mínimo necessário (user ID, role). NUNCA dados sensíveis |
| Validação | Verificar `iss`, `aud`, `exp`, `iat` em todo request |
| Revogação | Manter blocklist ou usar opaque tokens para revogação |

### 3.3 Implementação

```tsx
import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

async function createAccessToken(userId: string, role: string) {
  return new SignJWT({ sub: userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('meuapp.com')
    .setAudience('meuapp.com')
    .setExpirationTime('15m')
    .sign(JWT_SECRET)
}

async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, JWT_SECRET, {
    issuer: 'meuapp.com',
    audience: 'meuapp.com',
  })
  return payload
}
```

---

## 4. OAuth Security

### 4.1 Checklist OAuth

| # | Item | Importância |
|---|------|------------|
| 1 | Usar `state` parameter (CSRF protection) | 🔴 Crítico |
| 2 | PKCE (Proof Key for Code Exchange) para SPAs/mobile | 🔴 Crítico |
| 3 | Validar `redirect_uri` contra allowlist | 🔴 Crítico |
| 4 | Trocar code por token no server (não no client) | 🔴 Crítico |
| 5 | Validar `id_token` (signature, iss, aud, exp) | 🔴 Crítico |
| 6 | Não armazenar access tokens de providers longos | 🟡 Alto |
| 7 | Scopes mínimos necessários | 🟡 Alto |

### 4.2 PKCE Flow

```
1. Client gera code_verifier (random string 43-128 chars)
2. Client calcula code_challenge = SHA256(code_verifier)
3. Authorization request inclui code_challenge
4. Authorization server retorna code
5. Token request inclui code_verifier
6. Server verifica SHA256(code_verifier) === code_challenge
7. Token emitido
```

---

## 5. MFA Implementation

### 5.1 TOTP (RFC 6238)

```tsx
import { authenticator } from 'otplib'

function generateTOTPSecret() {
  return authenticator.generateSecret()
}

function generateQRCodeURL(secret: string, email: string) {
  return authenticator.keyuri(email, 'MeuApp', secret)
}

function verifyTOTP(token: string, secret: string): boolean {
  return authenticator.verify({ token, secret })
}
```

### 5.2 Recovery Codes

```tsx
function generateRecoveryCodes(count = 10): string[] {
  return Array.from({ length: count }, () =>
    Array.from({ length: 8 }, () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
    ).join('')
  )
}

// Armazenar como hash (bcrypt), não plaintext
// Cada código é uso único — deletar após uso
```

### 5.3 Regras de MFA

| Regra | Detalhe |
|-------|---------|
| Recovery codes obrigatórios | Sempre gerar ao ativar MFA |
| Limite de tentativas | 5 tentativas por 15 minutos |
| Expiração TOTP | 30s (padrão RFC), aceitar ±1 window |
| Re-autenticação para desativar | Exigir senha + código para desativar MFA |
| Bypass para admin | Nunca — admin sempre com MFA |

---

## 6. Rate Limiting

### 6.1 Limites Recomendados

| Endpoint | Limite | Window | Key |
|---------|--------|--------|-----|
| POST /login | 5 requests | 5 min | IP + email |
| POST /signup | 3 requests | 10 min | IP |
| POST /forgot-password | 3 requests | 15 min | IP + email |
| POST /verify-2fa | 5 requests | 15 min | Session |
| POST /api/* (geral) | 100 requests | 1 min | API key |
| GET /* (geral) | 1000 requests | 1 min | IP |

### 6.2 Implementação com Upstash Redis

```tsx
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '5 m'),
  analytics: true,
})

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
  const { success, limit, remaining, reset } = await ratelimit.limit(ip)

  if (!success) {
    return Response.json(
      { error: 'Too many requests. Try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(reset),
          'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
        },
      }
    )
  }

  // Process request...
}
```

---

## 7. Account Lockout

### 7.1 Estratégia

| Falhas | Ação |
|--------|------|
| 1-4 | Nenhuma — normal |
| 5 | Aviso visual + CAPTCHA |
| 10 | Lockout 15 minutos + email ao usuário |
| 20 | Lockout 1 hora + email de segurança |
| 50+ | Lockout permanente + requer verificação de identidade |

### 7.2 Informar o Usuário

```tsx
// SEGURO — Não revela se conta existe
function getLoginErrorMessage(failedAttempts: number) {
  if (failedAttempts >= 10) {
    return 'Conta temporariamente bloqueada por segurança. Tente novamente em 15 minutos ou recupere sua senha.'
  }
  return 'Email ou senha incorretos.'
}
```

---

## 8. Password Reset Security

### 8.1 Regras do Token de Reset

| Aspecto | Regra |
|---------|-------|
| Geração | `crypto.randomBytes(32)` — cryptographically secure |
| Expiração | 1 hora máximo |
| Uso | Único (invalidar após uso) |
| Storage | Hash do token no DB (não plaintext) |
| Entrega | Via email registrado (nunca via API response) |
| Invalidação | Todos os tokens anteriores invalidados ao gerar novo |
| Pós-reset | Invalidar TODAS as sessões existentes |

### 8.2 Fluxo Seguro

```tsx
async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } })

  // SEMPRE retornar sucesso (não revelar se email existe)
  if (!user) return { success: true }

  // Invalidar tokens anteriores
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })

  // Gerar novo token
  const token = crypto.randomBytes(32).toString('hex')
  const hashedToken = await hashToken(token)

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1h
    },
  })

  await sendPasswordResetEmail(email, token)
  return { success: true }
}

async function resetPassword(token: string, newPassword: string) {
  const hashedToken = await hashToken(token)
  const resetRecord = await prisma.passwordResetToken.findFirst({
    where: {
      token: hashedToken,
      expiresAt: { gt: new Date() },
    },
  })

  if (!resetRecord) throw new Error('Invalid or expired token')

  const hashedPassword = await hashPassword(newPassword)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.delete({ where: { id: resetRecord.id } }),
    prisma.session.deleteMany({ where: { userId: resetRecord.userId } }),
  ])
}
```

---

## 9. Session Invalidation

### 9.1 Quando Invalidar

| Evento | Sessão a Invalidar |
|--------|--------------------|
| Logout explícito | Sessão atual |
| "Logout de todos os dispositivos" | Todas as sessões do usuário |
| Mudança de senha | Todas as sessões (exceto atual, opcional) |
| Password reset | Todas as sessões |
| Desativação de conta | Todas as sessões |
| Detectar atividade suspeita | Todas as sessões |
| Mudança de role/permissões | Todas as sessões (forçar re-auth) |

### 9.2 Implementação

```tsx
async function invalidateAllSessions(userId: string, exceptCurrent?: string) {
  await prisma.session.deleteMany({
    where: {
      userId,
      ...(exceptCurrent ? { id: { not: exceptCurrent } } : {}),
    },
  })
}

async function logout(sessionId: string) {
  await prisma.session.delete({ where: { id: sessionId } })
}
```

---

## 10. Monitoramento e Alertas

### 10.1 Eventos a Monitorar

| Evento | Severidade | Ação |
|--------|-----------|------|
| Login de novo IP/device | Info | Log + notificar usuário |
| 5+ falhas de login | Warning | CAPTCHA |
| 10+ falhas de login | High | Lockout + email |
| Login após password reset | Info | Email de confirmação |
| MFA desativada | Warning | Email de confirmação |
| Admin privilege escalation | Critical | Log + alerta para security team |
| Bulk password reset requests | Critical | Investigar + rate limit |

---

## Fontes e Referências

- OWASP Authentication Cheat Sheet (2025)
- NIST SP 800-63B — Digital Identity Guidelines (2024)
- FIDO Alliance — Passkeys Specification
- RFC 6238 — TOTP Algorithm
- RFC 7636 — PKCE for OAuth
- Auth0 — Security Best Practices 2025
- Troy Hunt — Have I Been Pwned Research
