---
id: doc-auth-patterns
title: Padrões de UX para Autenticação em SaaS
version: 2.0
last_updated: 2026-04-07
category: saas
priority: critical
related:
  - docs/web-excellence/security/03_AUTH_SECURITY.md
  - docs/web-excellence/security/01_SECURITY_CHECKLIST.md
  - docs/web-excellence/saas/02_ONBOARDING_PATTERNS.md
  - .cursor/rules/stack/nextjs.mdc
---

# Padrões de UX para Autenticação em SaaS

## Visão Geral

Autenticação é a primeira barreira entre o visitante e o valor do produto. Dados de 2025-2026: cada campo adicional no signup reduz conversão em **-3%** (Formstack), login social (Google/GitHub) aumenta sign-ups em **+20-40%** (Auth0), e magic links estão crescendo como alternativa preferida em **35%** dos SaaS modernos.

---

## 1. Login/Signup — Formulários

### 1.1 Campos e Impacto na Conversão

| # de Campos | Conversão Relativa | Campos Recomendados |
|-------------|-------------------|---------------------|
| 1 (email) | Baseline (100%) | Email only + magic link |
| 2 (email + senha) | -3% | Login padrão |
| 3 (nome + email + senha) | -6% | Signup padrão |
| 4+ | -12% ou mais | Apenas quando obrigatório |

### 1.2 Signup Mínimo Viável

```tsx
export function SignupForm() {
  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Criar conta</h1>
        <p className="text-sm text-muted-foreground">
          Comece grátis, sem cartão de crédito
        </p>
      </div>

      {/* OAuth Providers — ACIMA dos form fields */}
      <div className="space-y-3">
        <OAuthButton provider="google" label="Continuar com Google" />
        <OAuthButton provider="github" label="Continuar com GitHub" />
      </div>

      <Divider label="ou" />

      {/* Email-only signup (magic link ou password) */}
      <form className="space-y-4">
        <Input
          type="email"
          label="Email"
          placeholder="seu@email.com"
          autoComplete="email"
          required
        />
        <Input
          type="password"
          label="Senha"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          required
        />
        <Button type="submit" className="w-full" size="lg">
          Criar conta grátis
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Ao criar conta, você concorda com os{' '}
        <a href="/termos" className="underline">Termos de Uso</a> e{' '}
        <a href="/privacidade" className="underline">Política de Privacidade</a>
      </p>

      <p className="text-center text-sm">
        Já tem conta?{' '}
        <a href="/login" className="font-medium text-primary hover:underline">Entrar</a>
      </p>
    </div>
  )
}
```

### 1.3 Regra de Posicionamento de OAuth

> Botões de OAuth **ACIMA** dos campos de email/senha. 65% dos usuários preferem OAuth quando disponível (Auth0, 2025). Posicionar primeiro = maior adoção.

---

## 2. Botões OAuth

### 2.1 Guidelines de Design

| Aspecto | Regra | Motivo |
|---------|-------|--------|
| Branding | Seguir guidelines oficiais (Google, GitHub, Apple) | Trust + compliance |
| Texto | "Continuar com [Provider]" | Ação clara, funciona para login E signup |
| Ícone | Logo oficial do provider à esquerda | Reconhecimento instantâneo |
| Largura | Full-width, mesmo tamanho entre providers | Hierarquia igual |
| Ordem | Google primeiro (mais usado), depois GitHub/Apple | Conveniência |

### 2.2 Implementação

```tsx
function OAuthButton({ provider, label }: { provider: string; label: string }) {
  const icons = {
    google: <GoogleIcon className="h-5 w-5" />,
    github: <GitHubIcon className="h-5 w-5" />,
    apple: <AppleIcon className="h-5 w-5" />,
  }

  return (
    <Button
      variant="outline"
      className="w-full gap-3"
      size="lg"
      onClick={() => signIn(provider)}
    >
      {icons[provider]}
      {label}
    </Button>
  )
}
```

---

## 3. Progressive Profiling

### 3.1 Princípio

> Nunca peça todas as informações no signup. Colete progressivamente conforme o usuário avança no produto.

### 3.2 Sequência Recomendada

| Momento | Dados Coletados | Método |
|---------|----------------|--------|
| Signup | Email + senha (ou OAuth) | Formulário |
| Primeiro login | Nome + Avatar (opcional) | Welcome screen |
| Onboarding step 1 | Cargo/Role | Quiz de personalização |
| Onboarding step 2 | Tamanho da empresa | Quiz |
| Onboarding step 3 | Objetivo principal | Quiz |
| Uso orgânico | Preferências de uso | Comportamento implícito |
| Upgrade | Dados de pagamento | Checkout |
| Após 30 dias | Telefone (se necessário) | In-app prompt |

---

## 4. UX de Requisitos de Senha

### 4.1 Padrão Moderno (2026)

| Abordagem Antiga | Abordagem Moderna |
|-------------------|-------------------|
| Lista de regras estáticas | Medidor de força dinâmico |
| "Deve ter 8 chars, maiúscula, número, especial" | "Crie uma senha forte" + feedback visual |
| Validação só no submit | Validação em tempo real |
| Mensagem de erro genérica | Indicação específica do que falta |

### 4.2 Medidor de Força de Senha

```tsx
function PasswordStrength({ password }: { password: string }) {
  const strength = calculateStrength(password)

  const levels = [
    { min: 0, label: 'Fraca', color: 'bg-red-500', width: '25%' },
    { min: 1, label: 'Razoável', color: 'bg-orange-500', width: '50%' },
    { min: 2, label: 'Boa', color: 'bg-yellow-500', width: '75%' },
    { min: 3, label: 'Forte', color: 'bg-green-500', width: '100%' },
  ]

  const level = levels[Math.min(strength, 3)]

  return (
    <div className="space-y-1.5">
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full rounded-full transition-all', level.color)}
          style={{ width: level.width }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Força da senha: <span className="font-medium">{level.label}</span>
      </p>
    </div>
  )
}
```

---

## 5. Mensagens de Erro

### 5.1 Princípios

| Princípio | Ruim | Bom |
|-----------|------|-----|
| Específico | "Erro de autenticação" | "Email ou senha incorretos" |
| Seguro | "Esta senha está errada" (revela que email existe) | "Email ou senha incorretos" (não revela qual) |
| Acionável | "Erro 401" | "Senha incorreta. [Esqueceu a senha?]" |
| Posicionado | Toast genérico | Inline, junto ao campo com erro |
| Timing | Só no submit | Validação em tempo real quando possível |

### 5.2 Mensagens Padrão

| Situação | Mensagem |
|----------|----------|
| Credenciais inválidas | "Email ou senha incorretos. [Esqueceu a senha?]" |
| Email já registrado | "Este email já possui conta. [Entrar] ou [Recuperar senha]" |
| Email inválido | "Por favor, insira um email válido" |
| Senha muito curta | "A senha deve ter pelo menos 8 caracteres" |
| Rate limited | "Muitas tentativas. Tente novamente em X minutos." |
| Conta bloqueada | "Conta temporariamente bloqueada por segurança. [Verificar identidade]" |
| OAuth falha | "Não foi possível conectar com [Provider]. Tente novamente." |
| Sessão expirada | "Sua sessão expirou. Faça login novamente." |

---

## 6. Fluxo de Verificação de Email

### 6.1 Sequência

```
1. Signup completo → Redirect para /verify-email
2. Mostrar tela "Verifique seu email"
   - Mostrar email enviado (mascarado: j***o@email.com)
   - Botão "Reenviar email"
   - Link "Usar outro email"
3. Email com link de verificação (expira em 24h)
4. Clique no link → verificação automática → redirect para onboarding
5. Se link expirado → tela "Link expirado" + botão "Enviar novo link"
```

### 6.2 UX da Tela de Verificação

```tsx
function VerifyEmailScreen({ email }: { email: string }) {
  const maskedEmail = maskEmail(email)

  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <MailIcon className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold">Verifique seu email</h1>
      <p className="text-muted-foreground">
        Enviamos um link de verificação para{' '}
        <span className="font-medium text-foreground">{maskedEmail}</span>
      </p>
      <div className="space-y-3">
        <Button variant="outline" onClick={resendEmail}>
          Reenviar email
        </Button>
        <p className="text-xs text-muted-foreground">
          Não recebeu? Verifique sua caixa de spam ou{' '}
          <button className="text-primary underline" onClick={changeEmail}>
            use outro email
          </button>
        </p>
      </div>
    </div>
  )
}
```

---

## 7. Fluxo de Forgot Password

### 7.1 Sequência Segura

```
1. Tela de login → Link "Esqueceu a senha?"
2. Formulário: apenas campo de email
3. Sempre mostrar "Se este email existe, enviamos instruções"
   (NUNCA revelar se email existe ou não)
4. Email com link de reset (expira em 1h, uso único)
5. Formulário de nova senha (com medidor de força)
6. Sucesso → redirect para login com mensagem "Senha alterada com sucesso"
7. Invalidar todas as sessões existentes (segurança)
```

### 7.2 Implementação

```tsx
function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="mx-auto max-w-sm space-y-4 text-center">
        <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="text-xl font-bold">Email enviado</h2>
        <p className="text-sm text-muted-foreground">
          Se existe uma conta com este email, você receberá instruções
          para redefinir sua senha em alguns minutos.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-4">
      <h1 className="text-2xl font-bold">Recuperar senha</h1>
      <p className="text-sm text-muted-foreground">
        Informe seu email e enviaremos um link para criar uma nova senha.
      </p>
      <Input type="email" label="Email" autoComplete="email" required />
      <Button type="submit" className="w-full">Enviar link de recuperação</Button>
      <a href="/login" className="block text-center text-sm text-primary hover:underline">
        Voltar para login
      </a>
    </form>
  )
}
```

---

## 8. Magic Link Auth

### 8.1 Vantagens

| Aspecto | Magic Link | Senha Tradicional |
|---------|-----------|-------------------|
| Fricção de signup | Muito baixa (só email) | Média (email + criar senha) |
| Segurança | Alta (link de uso único) | Depende da senha do usuário |
| Recuperação | Automática (sempre via email) | Requer fluxo de "esqueci senha" |
| UX mobile | Excelente (sem digitar senha) | Ruim (teclado, autocomplete) |

### 8.2 Quando Usar

- Apps onde frequência de login é **baixa** (1x/semana ou menos)
- Apps com forte dependência de **email** (newsletter tools, CRM)
- Como **alternativa** ao login tradicional (oferecer ambos)

### 8.3 Quando NÃO Usar

- Apps de uso **diário** (magic links são lentos vs sessões persistentes)
- Apps **offline-first** (dependem de acesso ao email)
- Ambientes **enterprise** (preferem SSO/SAML)

---

## 9. MFA / 2FA UX

### 9.1 Métodos e UX

| Método | Segurança | UX | Recomendação |
|--------|-----------|-----|--------------|
| TOTP (Google Authenticator) | Alta | Média | Padrão para power users |
| SMS OTP | Média (SIM swap risk) | Boa | Fallback, não primário |
| Email OTP | Média | Boa | Bom para onboarding |
| WebAuthn/Passkeys | Muito Alta | Excelente | Futuro — adoção crescendo |
| Recovery Codes | N/A | N/A | Obrigatório como backup |

### 9.2 Fluxo de Setup de 2FA

```
1. Settings → Segurança → Ativar 2FA
2. Escolher método (TOTP recomendado)
3. Exibir QR Code + código manual
4. Pedir código de confirmação (validar que funciona)
5. Gerar e exibir recovery codes (OBRIGATÓRIO mostrar + pedir para salvar)
6. Confirmar que salvou os recovery codes
7. 2FA ativado
```

### 9.3 Tela de Verificação 2FA no Login

```tsx
function TwoFactorVerification() {
  return (
    <div className="mx-auto max-w-sm space-y-6 text-center">
      <ShieldIcon className="mx-auto h-12 w-12 text-primary" />
      <h1 className="text-2xl font-bold">Verificação em 2 etapas</h1>
      <p className="text-sm text-muted-foreground">
        Insira o código do seu aplicativo autenticador
      </p>
      <OTPInput
        length={6}
        autoFocus
        className="justify-center"
        onComplete={handleVerify}
      />
      <button className="text-sm text-primary hover:underline">
        Usar código de recuperação
      </button>
    </div>
  )
}
```

---

## 10. Sessão e Protected Routes

### 10.1 Gerenciamento de Sessão

| Aspecto | Recomendação |
|---------|-------------|
| Duração | 7-30 dias (refresh token), 15-60 min (access token) |
| Persistência | `httpOnly` cookie (nunca localStorage) |
| Refresh | Silencioso, antes da expiração |
| Multi-device | Permitir, com listagem em settings |
| Invalidação | Logout de todos os dispositivos em settings |
| Expiração UX | Modal "Sessão expirando" antes de expirar |

### 10.2 Protected Routes em Next.js

```tsx
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/login', '/signup', '/forgot-password', '/verify-email']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = publicPaths.some((path) => pathname.startsWith(path))
  const hasSession = request.cookies.has('session-token')

  if (!isPublic && !hasSession) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isPublic && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

### 10.3 Redirect Após Login

> Sempre redirecionar o usuário para onde ele **queria ir** antes de ser interceptado pelo auth. Armazenar a URL original no query param `?redirect=`.

---

## Fontes e Referências

- Auth0 — State of Identity Report 2025
- Formstack — Form Conversion Report 2025
- NIST SP 800-63B — Digital Identity Guidelines (2024 update)
- FIDO Alliance — Passkeys Adoption Report 2025
- OWASP — Authentication Cheat Sheet (2025)
- Nielsen Norman Group — Login Form UX 2025
