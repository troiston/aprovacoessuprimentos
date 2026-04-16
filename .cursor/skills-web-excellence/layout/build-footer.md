---
id: skill-build-footer
title: "Build Footer"
agent: 03-builder
version: 1.0
category: layout
priority: important
requires:
  - skill: skill-build-design-tokens
provides:
  - componente footer
used_by:
  - agent: 03-builder
---

# Build Footer

Footer SEO-friendly com links estratégicos, newsletter, social e compliance legal.

## Estrutura

| Bloco | Conteúdo | Propósito |
|-------|----------|-----------|
| Link columns | Product, Company, Resources, Legal | SEO internal linking |
| Newsletter | Email input + submit | Lead capture |
| Social | Ícones com links | Branding + social proof |
| Legal | Privacy, Terms, Cookies, © | Compliance |

## Componente Completo

```tsx
// src/components/layout/footer.tsx
import Link from 'next/link'

interface FooterLink {
  label: string
  href: string
}

interface FooterColumn {
  title: string
  links: FooterLink[]
}

interface SocialLink {
  label: string
  href: string
  icon: React.ReactNode
}

interface FooterProps {
  logo: React.ReactNode
  description: string
  columns: FooterColumn[]
  socialLinks: SocialLink[]
  newsletterAction?: string
}

export function Footer({
  logo,
  description,
  columns,
  socialLinks,
  newsletterAction,
}: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-surface-sunken" role="contentinfo">
      <div className="mx-auto max-w-screen-xl px-4 py-[var(--section-py-md)] sm:px-6 lg:px-8">
        {/* Top: Logo + Description + Newsletter | Columns */}
        <div className="grid grid-cols-4 gap-8 sm:grid-cols-8 lg:grid-cols-12 lg:gap-12">
          {/* Brand + Newsletter */}
          <div className="col-span-4 lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2">
              {logo}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-on-surface-muted">
              {description}
            </p>

            {/* Newsletter */}
            {newsletterAction && (
              <form action={newsletterAction} method="POST" className="mt-6">
                <label htmlFor="footer-email" className="text-sm font-medium text-on-surface">
                  Receba novidades
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="footer-email"
                    type="email"
                    name="email"
                    required
                    placeholder="seu@email.com"
                    autoComplete="email"
                    className="flex-1 rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-subtle transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-focus-ring"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-accent transition-all duration-fast hover:bg-accent-hover active:scale-[0.98]"
                  >
                    Assinar
                  </button>
                </div>
              </form>
            )}

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-muted transition-colors hover:bg-muted hover:text-on-surface"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.title} className="col-span-2">
              <h3 className="text-sm font-semibold text-on-surface">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-3" role="list">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-on-surface-muted transition-colors hover:text-on-surface"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom: Legal */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-on-surface-subtle">
            © {currentYear} Sua Empresa. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacidade" className="text-sm text-on-surface-subtle hover:text-on-surface transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/termos" className="text-sm text-on-surface-subtle hover:text-on-surface transition-colors">
              Termos de Uso
            </Link>
            <button
              type="button"
              className="text-sm text-on-surface-subtle hover:text-on-surface transition-colors"
              onClick={() => {
                // Integrar com CMP (Consent Management Platform)
              }}
            >
              Preferências de Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

## Uso

```tsx
import { Footer } from '@/components/layout/footer'

const footerColumns = [
  {
    title: 'Produto',
    links: [
      { label: 'Funcionalidades', href: '/funcionalidades' },
      { label: 'Preços', href: '/precos' },
      { label: 'Integrações', href: '/integracoes' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre', href: '/sobre' },
      { label: 'Blog', href: '/blog' },
      { label: 'Carreiras', href: '/carreiras' },
      { label: 'Contato', href: '/contato' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Documentação', href: '/docs' },
      { label: 'API', href: '/api' },
      { label: 'Comunidade', href: '/comunidade' },
      { label: 'Status', href: '/status' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidade', href: '/privacidade' },
      { label: 'Termos', href: '/termos' },
      { label: 'LGPD', href: '/lgpd' },
      { label: 'Segurança', href: '/seguranca' },
    ],
  },
]

<Footer
  logo={<span className="text-xl font-bold">Logo</span>}
  description="Plataforma completa para transformar sua ideia em produto digital."
  columns={footerColumns}
  socialLinks={[
    { label: 'Twitter', href: 'https://twitter.com/...', icon: <TwitterIcon /> },
    { label: 'GitHub', href: 'https://github.com/...', icon: <GitHubIcon /> },
    { label: 'LinkedIn', href: 'https://linkedin.com/...', icon: <LinkedInIcon /> },
  ]}
  newsletterAction="/api/newsletter"
/>
```

## Mobile: Colunas → Accordion

Para mobile, as colunas podem colapsar em accordion usando `<details>`:

```tsx
// Alternativa mobile-friendly para cada coluna
<details className="group sm:hidden">
  <summary className="flex cursor-pointer items-center justify-between py-3 text-sm font-semibold text-on-surface">
    {col.title}
    <svg
      className="h-4 w-4 transition-transform group-open:rotate-180"
      fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  </summary>
  <ul className="flex flex-col gap-2 pb-4 pl-2">
    {col.links.map((link) => (
      <li key={link.href}>
        <Link href={link.href} className="text-sm text-on-surface-muted hover:text-on-surface">
          {link.label}
        </Link>
      </li>
    ))}
  </ul>
</details>
```

## SEO

- Links internos estratégicos: páginas de produto, blog, docs
- `role="contentinfo"` no `<footer>`
- Copyright com ano dinâmico
- Social links com `rel="noopener noreferrer"`
- Newsletter form para captura de leads direto do footer

## Validação

- [ ] Landmark `role="contentinfo"` presente
- [ ] Social icons têm `aria-label`
- [ ] Newsletter input tem `label` associado
- [ ] Copyright com ano dinâmico `new Date().getFullYear()`
- [ ] Links legais presentes: Privacidade, Termos, Cookies
- [ ] Colunas colapsam em mobile (stack ou accordion)
- [ ] Links internos cobrem páginas-chave para SEO
