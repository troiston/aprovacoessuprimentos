---
id: doc-seo-local
title: SEO Local
version: 2.0
last_updated: 2026-04-07
category: seo
priority: important
related:
  - docs/web-excellence/seo/01_SEO_TECHNICAL.md
  - docs/web-excellence/seo/02_SEO_CONTENT.md
  - docs/web-excellence/seo/05_SEO_CHECKLIST.md
---

# SEO Local

## 1. LocalBusiness Schema

### 1.1 Importância

Structured data de LocalBusiness habilita rich results do Google (painel de conhecimento, mapa, horários, avaliações). Dados de 2026:

- **46% de todas as buscas** no Google têm intenção local (Think with Google 2025)
- **76% dos que buscam** algo "perto de mim" visitam o negócio em 24h (Google/Ipsos 2025)
- **28% das buscas locais** resultam em compra (Google Internal Data 2025)
- Rich results aumentam CTR em **20-40%** comparado a resultados padrão

### 1.2 Implementação Completa

```tsx
import type { LocalBusiness } from 'schema-dts';

const localBusinessData: LocalBusiness = {
  '@type': 'LocalBusiness',
  '@context': 'https://schema.org',
  '@id': 'https://exemplo.com.br/#organization',
  name: 'Empresa Exemplo LTDA',
  description: 'Desenvolvimento de software e consultoria digital em São Paulo.',
  url: 'https://exemplo.com.br',
  telephone: '+55-11-99999-9999',
  email: 'contato@exemplo.com.br',
  image: 'https://exemplo.com.br/fachada.jpg',
  logo: 'https://exemplo.com.br/logo.png',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Av. Paulista, 1000 - Sala 801',
    addressLocality: 'São Paulo',
    addressRegion: 'SP',
    postalCode: '01310-100',
    addressCountry: 'BR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -23.5631,
    longitude: -46.6544,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  sameAs: [
    'https://www.facebook.com/empresa',
    'https://www.instagram.com/empresa',
    'https://www.linkedin.com/company/empresa',
    'https://twitter.com/empresa',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '247',
    bestRating: '5',
  },
  review: [
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Maria Silva' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: 'Excelente atendimento e resultado impecável.',
      datePublished: '2026-03-15',
    },
  ],
  areaServed: {
    '@type': 'City',
    name: 'São Paulo',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Serviços',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Desenvolvimento Web',
          description: 'Criação de sites e aplicações web.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Consultoria Digital',
          description: 'Estratégia digital e otimização.',
        },
      },
    ],
  },
};
```

### 1.3 Subtipos de LocalBusiness

Usar o subtipo mais específico disponível:

| Tipo de Negócio | Schema Type |
|---|---|
| Restaurante | `Restaurant` |
| Clínica médica | `MedicalClinic` |
| Escritório advocacia | `LegalService` |
| Loja de roupas | `ClothingStore` |
| Dentista | `Dentist` |
| Salão de beleza | `BeautySalon` |
| Academia | `HealthClub` |
| Imobiliária | `RealEstateAgent` |
| Auto elétrica / mecânica | `AutoRepair` |
| Genérico | `LocalBusiness` |

## 2. Google Business Profile (GBP)

### 2.1 Otimização do Perfil

| Elemento | Requisito | Impacto SEO |
|---|---|---|
| Nome do negócio | Exatamente como na fachada/CNPJ | Alto (NAP consistency) |
| Categoria primária | A mais específica possível | Muito alto |
| Categorias secundárias | 3-5 relevantes | Alto |
| Descrição | 750 caracteres, keywords naturais | Médio |
| Endereço | Exato, consistente com site | Muito alto |
| Telefone | Número local, consistente com site | Muito alto |
| Horários | Atualizados, incluindo feriados | Alto |
| Fotos | 10+ fotos de qualidade (interior, exterior, equipe, produtos) | Alto |
| Posts GBP | Semanais com novidades, ofertas, eventos | Médio |
| Q&A | Responder todas as perguntas | Médio |
| Atributos | Wi-Fi, acessibilidade, estacionamento, etc. | Baixo-Médio |

### 2.2 Integração Site ↔ GBP

```
Site deve ter:
1. Mesmo NAP (Name, Address, Phone) que o GBP
2. Link para Google Maps com embed
3. Horários de funcionamento consistentes
4. Botão "Deixar avaliação" vinculando ao GBP
5. Schema LocalBusiness com mesmos dados
```

### 2.3 Posts do Google Business Profile

| Tipo | Frequência | Conteúdo |
|---|---|---|
| What's New | Semanal | Novidades, atualizações |
| Offer | Quando houver promoção | Desconto, condição especial |
| Event | Antes de eventos | Data, hora, descrição |
| Product | Quando lançar produto | Foto, preço, descrição |

## 3. NAP Consistency

### 3.1 O que é NAP

**N**ame, **A**ddress, **P**hone — os três dados de identificação que devem ser idênticos em:
- Site próprio
- Google Business Profile
- Diretórios locais (Yelp, TripAdvisor, Foursquare)
- Redes sociais
- Associações e câmaras de comércio
- Citações em mídia/blogs

### 3.2 Impacto de Inconsistência

- Google usa consistência NAP como sinal de legitimidade
- Variações (ex: "Av." vs "Avenida", "(11)" vs "11") confundem algoritmos
- Dados inconsistentes podem impedir que o Knowledge Panel apareça
- Pesquisa Moz 2025: NAP consistency é o 4º fator de ranking local

### 3.3 Formato Padrão (definir e manter)

```
Nome:     Empresa Exemplo LTDA
Endereço: Av. Paulista, 1000 - Sala 801, São Paulo - SP, 01310-100
Telefone: (11) 99999-9999
Site:     https://exemplo.com.br
```

### 3.4 Checklist NAP

- [ ] NAP idêntico no footer do site?
- [ ] NAP idêntico no Google Business Profile?
- [ ] NAP na página de contato?
- [ ] Schema LocalBusiness com mesmo NAP?
- [ ] Diretórios principais atualizados (Google, Bing, Apple Maps)?
- [ ] Redes sociais com mesmo NAP?

## 4. Keywords Locais

### 4.1 Estrutura de Keywords Locais

```
[Serviço/Produto] + [Cidade/Bairro/Região]

Exemplos:
- "desenvolvimento de sites São Paulo"
- "dentista Vila Mariana"
- "restaurante italiano Jardins SP"
- "consultoria digital para empresas em Campinas"
```

### 4.2 Keywords de Intenção Local

| Tipo | Exemplo | Volume Típico |
|---|---|---|
| "[serviço] perto de mim" | "dentista perto de mim" | Muito alto |
| "[serviço] em [cidade]" | "advogado em Curitiba" | Alto |
| "[serviço] [bairro]" | "academia Moema" | Médio |
| "melhor [serviço] [cidade]" | "melhor pizzaria São Paulo" | Alto |
| "[serviço] aberto agora" | "farmácia aberta agora" | Alto |
| "[serviço] [cidade] preço" | "encanador São Paulo preço" | Médio |

### 4.3 Onde Inserir Keywords Locais

| Local | Exemplo |
|---|---|
| Title tag | "Desenvolvimento Web em São Paulo \| Empresa" |
| H1 | "Desenvolvimento Web em São Paulo" |
| Meta description | "Empresa de desenvolvimento web em São Paulo. Atendemos Vila Olímpia e região." |
| Corpo do texto | Menções naturais de bairros e regiões |
| Alt text | "Escritório da Empresa na Av. Paulista em São Paulo" |
| URL | `/servicos/desenvolvimento-web-sao-paulo` |
| Schema | addressLocality, areaServed |

## 5. Location Pages

### 5.1 Quando Criar Location Pages

- Negócio com múltiplas unidades
- Empresa que atende múltiplas cidades/regiões
- Franquias

### 5.2 Estrutura de uma Location Page

```tsx
// app/unidades/[city]/page.tsx

export default function LocationPage({ params }: { params: { city: string } }) {
  return (
    <>
      <h1>Empresa em {city} — Desenvolvimento Web</h1>

      {/* NAP local */}
      <address>
        <p>Av. Paulista, 1000 - Sala 801</p>
        <p>São Paulo - SP, 01310-100</p>
        <p>Telefone: <a href="tel:+5511999999999">(11) 99999-9999</a></p>
      </address>

      {/* Google Maps embed */}
      <iframe
        src="https://www.google.com/maps/embed?..."
        width="100%"
        height="300"
        loading="lazy"
        title="Localização da Empresa em São Paulo"
      />

      {/* Conteúdo local único (NÃO duplicar entre unidades) */}
      <section>
        <h2>Nossos Serviços em {city}</h2>
        <p>Conteúdo específico para esta localização.</p>
      </section>

      {/* Testimonials locais */}
      <section>
        <h2>O que Clientes em {city} Dizem</h2>
        {/* Reviews da localização específica */}
      </section>

      {/* CTA local */}
      <section>
        <h2>Agende uma Visita em {city}</h2>
        {/* Form de contato */}
      </section>
    </>
  );
}
```

### 5.3 Regras para Location Pages

1. **Conteúdo único por página:** Nunca duplicar texto entre localizações
2. **NAP local:** Endereço e telefone da unidade específica
3. **Testimonials locais:** Reviews de clientes da região
4. **Imagens locais:** Fotos da unidade, equipe local, bairro
5. **Schema por localização:** LocalBusiness com dados específicos
6. **Minimum content:** Pelo menos 300-500 palavras únicas por location page

## 6. Review Management

### 6.1 Importância de Reviews

- **93% dos consumidores** leem reviews online antes de comprar localmente (BrightLocal 2026)
- **Avaliação média mínima:** 4.0 estrelas para ser considerado (84% dos consumidores)
- **Quantidade:** Negócios no top 3 local do Google têm em média 47 reviews
- **Recência:** Reviews dos últimos 3 meses são mais valorizadas

### 6.2 Estratégia de Solicitação

| Momento | Canal | Template |
|---|---|---|
| Após entrega/serviço | Email | "Ficamos felizes em atender! Que tal compartilhar sua experiência?" |
| No local (tablet/QR) | Presencial | QR code linkando direto para review do Google |
| Follow-up 3 dias | WhatsApp/SMS | Link direto para avaliação |
| Em caso de elogio | Redirecionamento | "Que bom que gostou! Poderia compartilhar no Google?" |

### 6.3 Respostas a Reviews

| Tipo | Tempo de Resposta | Abordagem |
|---|---|---|
| Positiva (5★) | 24-48h | Agradecer, mencionar o serviço, convidar a voltar |
| Positiva (4★) | 24-48h | Agradecer, perguntar como melhorar para 5★ |
| Neutra (3★) | 12-24h | Agradecer, pedir feedback específico, oferecer contato |
| Negativa (1-2★) | < 12h | Pedir desculpas, levar para privado, oferecer solução |

### 6.4 Schema de Reviews

```tsx
const reviewData = {
  '@type': 'LocalBusiness',
  '@context': 'https://schema.org',
  name: 'Empresa',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '247',
    bestRating: '5',
    worstRating: '1',
  },
};
```

## 7. Google Maps Embed

### 7.1 Implementação Otimizada

```tsx
export function GoogleMap({ placeId }: { placeId: string }) {
  return (
    <div className="aspect-video w-full rounded-2xl overflow-hidden">
      <iframe
        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=place_id:${placeId}`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Localização no Google Maps"
      />
    </div>
  );
}
```

### 7.2 Performance Tips

- `loading="lazy"` — não carrega até ser visível
- Considerar static map image (Google Static Maps API) como placeholder
- Maps API Key restrita por domínio
- Embed vs. JavaScript API: Embed é mais leve e suficiente para localização

## 8. Estratégia de Conteúdo Local

### 8.1 Tipos de Conteúdo Local

| Tipo | Exemplo | Benefício SEO |
|---|---|---|
| Guia local | "Melhores co-workings em São Paulo" | Keywords locais + authority |
| Case study local | "Como ajudamos a [empresa] em [cidade]" | E-E-A-T + local relevance |
| Eventos locais | "Meetup de tecnologia em São Paulo — abril 2026" | Freshness + local |
| Parcerias locais | "Parceria com [empresa] em [bairro]" | Backlinks locais |
| FAQ local | "Quanto custa desenvolvimento web em SP?" | Keywords long-tail |
| Páginas de serviço + cidade | "/servicos/web-development-sao-paulo" | Targeting direto |

### 8.2 Blog Posts Locais

```
Regras:
- Mencionar a cidade/bairro naturalmente no conteúdo
- Incluir imagens com geotag (EXIF data com coordenadas)
- Referenciar landmarks, eventos e negócios locais
- Linkar para Google Maps e lugares mencionados
- Usar Schema com geo coordinates
```

## 9. Citações Locais (Diretórios)

### 9.1 Diretórios Prioritários no Brasil

| Diretório | Prioridade | Nota |
|---|---|---|
| Google Business Profile | P0 | Obrigatório |
| Bing Places | P1 | Crescente com Copilot |
| Apple Business Connect | P1 | Apple Maps + Siri |
| Facebook Business | P1 | Busca social |
| Instagram Business | P1 | Descoberta visual |
| LinkedIn Company Page | P1 | B2B |
| Yelp | P2 | Relevante para serviços |
| Foursquare | P2 | Dados alimentam outros apps |
| Reclame Aqui | P2 | Reputação no Brasil |
| TripAdvisor | P2 | Hospitalidade e food |
| iFood / Rappi | P2 | Específico para food service |
| Apontador | P3 | Diretório brasileiro |
| Guia Mais | P3 | Diretório brasileiro |

### 9.2 Manutenção

- Auditar citações trimestralmente
- Atualizar imediatamente quando mudar NAP
- Remover listagens duplicadas
- Responder reviews em todos os diretórios

## 10. Checklist SEO Local

- [ ] LocalBusiness schema completo (tipo específico, NAP, geo, horários)?
- [ ] Google Business Profile otimizado (categoria, fotos, posts)?
- [ ] NAP consistente em site, GBP, diretórios e redes sociais?
- [ ] Keywords locais em title, h1, meta description?
- [ ] Location pages para cada unidade (conteúdo único)?
- [ ] Google Maps embed na página de contato?
- [ ] Estratégia de solicitação de reviews ativa?
- [ ] Respostas a reviews em < 24h?
- [ ] Citações em diretórios prioritários?
- [ ] Conteúdo local no blog (guides, cases, eventos)?
