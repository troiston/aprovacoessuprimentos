---
id: cmd-init-seo
title: Configurar Infraestrutura SEO
version: 2.0
last_updated: 2026-04-07
category: project
agent: 04-seo-specialist
skills:
  - write-meta-tags
  - generate-schema
  - write-sitemap
---

# `/init-seo [dominio] [nome-empresa]`

Configura toda a infraestrutura SEO base do projeto: metadata padrão, JSON-LD Organization/WebSite, sitemap dinâmico, robots.txt, template de OG image, e canonical URLs. Executa após `/init-tokens` para ter os tokens visuais disponíveis para o OG image.

---

## Parâmetros

| Parâmetro | Obrigatório | Valores Aceitos | Descrição |
|-----------|-------------|-----------------|-----------|
| `dominio` | ✅ Sim | URL completa com `https://` (ex: `https://meusite.com.br`) | Domínio do site, usado como `metadataBase` e em canonical URLs |
| `nome-empresa` | ✅ Sim | String (ex: `Café Artesanal`, `FinPay`) | Nome da empresa/marca para JSON-LD e metadata |

---

## Passo a Passo de Execução

### Passo 1 — Configurar `metadataBase` no root layout

Atualizar `src/app/layout.tsx` com o domínio fornecido:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://[dominio]"),
  title: {
    default: "[nome-empresa]",
    template: `%s | [nome-empresa]`,
  },
  description: "Descrição principal do site — máximo 160 caracteres, otimizada para SEO.",
  keywords: ["palavra-chave-1", "palavra-chave-2", "palavra-chave-3"],
  authors: [{ name: "[nome-empresa]", url: "https://[dominio]" }],
  creator: "[nome-empresa]",
  publisher: "[nome-empresa]",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://[dominio]",
    siteName: "[nome-empresa]",
    title: "[nome-empresa]",
    description: "Descrição para redes sociais — pode ser mais longa.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "[nome-empresa] — descrição breve",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "[nome-empresa]",
    description: "Descrição para Twitter — até 200 caracteres.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://[dominio]",
  },
  verification: {
    google: "GOOGLE_VERIFICATION_CODE",
  },
};
```

### Passo 2 — Criar JSON-LD Organization

Criar `src/components/seo/json-ld.tsx`:

```tsx
import type { Organization, WebSite, WithContext } from "schema-dts";

export function OrganizationJsonLd() {
  const schema: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "[nome-empresa]",
    url: "https://[dominio]",
    logo: "https://[dominio]/logo.png",
    description: "Descrição da empresa para schema.org",
    sameAs: [
      "https://www.instagram.com/[handle]",
      "https://www.linkedin.com/company/[handle]",
      "https://twitter.com/[handle]",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-XX-XXXX-XXXX",
      contactType: "customer service",
      availableLanguage: ["Portuguese"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "[nome-empresa]",
    url: "https://[dominio]",
    description: "Descrição do website",
    publisher: {
      "@type": "Organization",
      name: "[nome-empresa]",
      url: "https://[dominio]",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://[dominio]/busca?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

Adicionar ao `layout.tsx`:
```tsx
<body>
  <OrganizationJsonLd />
  <WebSiteJsonLd />
  {children}
</body>
```

### Passo 3 — Criar `src/app/sitemap.ts`

```typescript
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://[dominio]";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/servicos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
  ];

  // Para rotas dinâmicas (blog, produtos):
  // const posts = await getAllPosts();
  // const dynamicRoutes = posts.map((post) => ({
  //   url: `${baseUrl}/blog/${post.slug}`,
  //   lastModified: post.updatedAt,
  //   changeFrequency: "weekly" as const,
  //   priority: 0.6,
  // }));

  return [...staticRoutes];
}
```

### Passo 4 — Criar `src/app/robots.ts`

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://[dominio]";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/private/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

### Passo 5 — Criar template de OG Image

Criar `src/app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "[nome-empresa]";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
          padding: 60,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <h1
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "white",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            [nome-empresa]
          </h1>
          <p
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.7)",
              textAlign: "center",
            }}
          >
            Tagline ou descrição breve da empresa
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
```

### Passo 6 — Configurar canonical URLs

Em cada `page.tsx`, adicionar canonical via `generateMetadata`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/sobre",
  },
};
```

Para rotas dinâmicas:
```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    alternates: {
      canonical: `/blog/${params.slug}`,
    },
  };
}
```

---

## Checklist de Verificação

- [ ] `metadataBase` configurado com domínio correto
- [ ] Title template com `%s | [nome-empresa]`
- [ ] Description padrão entre 120–160 caracteres
- [ ] Open Graph completo (title, description, image, type, url, locale)
- [ ] Twitter Card configurado como `summary_large_image`
- [ ] JSON-LD Organization com name, url, logo, sameAs
- [ ] JSON-LD WebSite com SearchAction (se aplicável)
- [ ] `sitemap.ts` com todas as rotas estáticas + template para dinâmicas
- [ ] `robots.ts` com allow/disallow corretos
- [ ] OG Image template funcional em `opengraph-image.tsx`
- [ ] Canonical URLs configurados no root e em cada página
- [ ] Google verification code preparado (placeholder)
- [ ] `formatDetection` desabilitando auto-detection de telefone/email

---

## Saída Esperada

```
✅ Infraestrutura SEO configurada para [dominio]
├── metadataBase: https://[dominio]
├── Title template: %s | [nome-empresa]
├── Open Graph completo com imagem 1200×630
├── Twitter Card summary_large_image
├── JSON-LD Organization + WebSite
├── sitemap.ts dinâmico
├── robots.ts com políticas corretas
├── OG Image template com edge runtime
├── Canonical URLs configurados
└── Pronto para /new-page [tipo] [nicho]
```

---

## Exemplo de Uso

```
/init-seo https://cafeartesanal.com.br "Café Artesanal"
/init-seo https://finpay.io "FinPay"
/init-seo https://drastudio.com "Dra. Studio"
```
