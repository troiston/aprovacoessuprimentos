---
id: cmd-gen-schema
title: Gerar JSON-LD Schema
version: 2.0
last_updated: 2026-04-07
category: generate
agent: 04-seo-specialist
skills:
  - generate-schema
---

# `/gen-schema [tipo]`

Gera JSON-LD structured data type-safe para a página, usando `schema-dts` para tipagem TypeScript. Determina as propriedades obrigatórias e recomendadas conforme schema.org, valida a estrutura, e implementa como componente React reutilizável.

---

## Parâmetros

| Parâmetro | Obrigatório | Valores Aceitos | Descrição |
|-----------|-------------|-----------------|-----------|
| `tipo` | ✅ Sim | `product` · `article` · `faq` · `local-business` · `howto` · `breadcrumb` · `organization` · `event` · `recipe` | Tipo de schema.org a gerar |

---

## Propriedades por Tipo de Schema

### `product`
```typescript
import type { Product, WithContext } from "schema-dts";

const schema: WithContext<Product> = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Nome do Produto",                    // obrigatório
  description: "Descrição detalhada",          // recomendado
  image: ["https://exemplo.com/foto1.webp"],   // recomendado
  brand: { "@type": "Brand", name: "Marca" },  // recomendado
  offers: {
    "@type": "Offer",
    price: 99.90,                              // obrigatório
    priceCurrency: "BRL",                      // obrigatório
    availability: "https://schema.org/InStock", // obrigatório
    url: "https://exemplo.com/produto",        // recomendado
    priceValidUntil: "2026-12-31",             // recomendado
    seller: { "@type": "Organization", name: "Loja" },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.8,
    reviewCount: 127,
  },
  review: [{
    "@type": "Review",
    author: { "@type": "Person", name: "João Silva" },
    datePublished: "2026-03-15",
    reviewBody: "Excelente produto, superou expectativas.",
    reviewRating: { "@type": "Rating", ratingValue: 5 },
  }],
  sku: "SKU-001",
  gtin13: "7890000000001",
};
```

### `article`
```typescript
import type { Article, WithContext } from "schema-dts";

const schema: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Título do Artigo",            // obrigatório (max 110 chars)
  description: "Resumo do artigo",          // recomendado
  image: "https://exemplo.com/thumb.webp",  // recomendado
  datePublished: "2026-04-07T10:00:00Z",    // obrigatório
  dateModified: "2026-04-07T14:30:00Z",     // recomendado
  author: {
    "@type": "Person",
    name: "Autor",
    url: "https://exemplo.com/autor",
  },
  publisher: {
    "@type": "Organization",
    name: "Nome da Empresa",
    logo: { "@type": "ImageObject", url: "https://exemplo.com/logo.png" },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://exemplo.com/blog/titulo-do-artigo",
  },
  wordCount: 1500,
  articleSection: "Tecnologia",
};
```

### `faq`
```typescript
import type { FAQPage, WithContext } from "schema-dts";

const schema: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Qual é o preço?",                    // obrigatório
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nossos planos começam em R$49/mês.", // obrigatório
      },
    },
    {
      "@type": "Question",
      name: "Tem período de teste grátis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim, oferecemos 14 dias de teste grátis sem cartão de crédito.",
      },
    },
  ],
};
```

### `local-business`
```typescript
import type { LocalBusiness, WithContext } from "schema-dts";

const schema: WithContext<LocalBusiness> = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Café Artesanal",
  image: "https://exemplo.com/fachada.webp",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua das Flores, 123",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    postalCode: "01310-100",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -23.5505,
    longitude: -46.6333,
  },
  telephone: "+55-11-99999-9999",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  priceRange: "$$",
  servesCuisine: "Café",
  url: "https://exemplo.com",
};
```

### `howto`
```typescript
import type { HowTo, WithContext } from "schema-dts";

const schema: WithContext<HowTo> = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Como Fazer Espresso Perfeito",
  description: "Guia passo a passo para preparar espresso.",
  totalTime: "PT10M",
  estimatedCost: { "@type": "MonetaryAmount", currency: "BRL", value: 5 },
  supply: [
    { "@type": "HowToSupply", name: "Café moído fino (18g)" },
    { "@type": "HowToSupply", name: "Água filtrada (200ml)" },
  ],
  tool: [
    { "@type": "HowToTool", name: "Máquina de espresso" },
    { "@type": "HowToTool", name: "Balança de precisão" },
  ],
  step: [
    {
      "@type": "HowToStep",
      name: "Moer o café",
      text: "Moa 18g de café em granulometria fina.",
      image: "https://exemplo.com/passo1.webp",
    },
    {
      "@type": "HowToStep",
      name: "Pré-aquecer a máquina",
      text: "Ligue a máquina e deixe aquecer por 5 minutos.",
    },
  ],
};
```

### `breadcrumb`
```typescript
import type { BreadcrumbList, WithContext } from "schema-dts";

const schema: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: "https://exemplo.com" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://exemplo.com/blog" },
    { "@type": "ListItem", position: 3, name: "Título do Post" },
  ],
};
```

### `organization`
```typescript
import type { Organization, WithContext } from "schema-dts";

const schema: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nome da Empresa",
  url: "https://exemplo.com",
  logo: "https://exemplo.com/logo.png",
  description: "Descrição da empresa.",
  foundingDate: "2020-01-01",
  founders: [{ "@type": "Person", name: "Fundador" }],
  sameAs: [
    "https://instagram.com/handle",
    "https://linkedin.com/company/handle",
    "https://twitter.com/handle",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+55-11-99999-9999",
    contactType: "customer service",
    availableLanguage: ["Portuguese"],
  },
};
```

### `event`
```typescript
import type { Event, WithContext } from "schema-dts";

const schema: WithContext<Event> = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Workshop de Café Especial",
  startDate: "2026-05-15T14:00:00-03:00",
  endDate: "2026-05-15T17:00:00-03:00",
  location: {
    "@type": "Place",
    name: "Café Artesanal",
    address: { "@type": "PostalAddress", streetAddress: "Rua das Flores, 123", addressLocality: "São Paulo" },
  },
  description: "Aprenda técnicas de barista profissional.",
  offers: {
    "@type": "Offer",
    price: 150,
    priceCurrency: "BRL",
    availability: "https://schema.org/InStock",
    url: "https://exemplo.com/eventos/workshop-cafe",
    validFrom: "2026-04-01",
  },
  organizer: { "@type": "Organization", name: "Café Artesanal", url: "https://exemplo.com" },
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  image: "https://exemplo.com/evento.webp",
};
```

### `recipe`
```typescript
import type { Recipe, WithContext } from "schema-dts";

const schema: WithContext<Recipe> = {
  "@context": "https://schema.org",
  "@type": "Recipe",
  name: "Bolo de Cenoura com Cobertura de Chocolate",
  image: "https://exemplo.com/bolo.webp",
  author: { "@type": "Person", name: "Chef Maria" },
  datePublished: "2026-03-20",
  description: "Receita tradicional de bolo de cenoura.",
  prepTime: "PT20M",
  cookTime: "PT40M",
  totalTime: "PT60M",
  recipeYield: "12 fatias",
  recipeCategory: "Sobremesa",
  recipeCuisine: "Brasileira",
  nutrition: { "@type": "NutritionInformation", calories: "280 kcal" },
  recipeIngredient: ["3 cenouras médias", "4 ovos", "1 xícara de óleo"],
  recipeInstructions: [
    { "@type": "HowToStep", text: "Bata no liquidificador cenouras, ovos e óleo." },
    { "@type": "HowToStep", text: "Adicione farinha, açúcar e fermento." },
    { "@type": "HowToStep", text: "Asse a 180°C por 40 minutos." },
  ],
  aggregateRating: { "@type": "AggregateRating", ratingValue: 4.9, ratingCount: 238 },
};
```

---

## Passo a Passo de Execução

### Passo 1 — Determinar propriedades obrigatórias
Consultar schema.org e Google Structured Data Guidelines para o tipo.

### Passo 2 — Gerar schema type-safe
Usar `schema-dts` para tipagem TypeScript, garantindo propriedades corretas.

### Passo 3 — Implementar como componente React

```tsx
export function JsonLd<T extends Record<string, unknown>>({ data }: { data: T }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### Passo 4 — Validar estrutura
Verificar contra Google Rich Results Test mentalmente: propriedades obrigatórias presentes, tipos corretos, URLs válidas.

---

## Saída Esperada

```
✅ JSON-LD [tipo] gerado
├── Schema type-safe com schema-dts
├── Propriedades obrigatórias preenchidas
├── Propriedades recomendadas incluídas
├── Componente React reutilizável
├── Validado contra Google Rich Results
└── Integrado na página via <JsonLd data={schema} />
```

---

## Exemplo de Uso

```
/gen-schema product
/gen-schema article
/gen-schema faq
/gen-schema local-business
/gen-schema howto
/gen-schema breadcrumb
/gen-schema organization
/gen-schema event
/gen-schema recipe
```
