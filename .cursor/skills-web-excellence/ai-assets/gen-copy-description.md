---
id: skill-gen-copy-description
title: "Generate Copy Description"
agent: 05-asset-creator
version: 1.0
category: ai-assets
priority: standard
requires:
  - skill: skill-gen-copy-headline
  - rule: 00-constitution
provides:
  - meta-descriptions
  - subheadlines
  - feature-descriptions
  - cta-copy
used_by:
  - agent: 05-asset-creator
  - command: /new-page
---

# Copy para Descrições, CTAs e Microtextos

## 1. Meta Descriptions (SEO)

**Regras:**
- Máximo 160 caracteres (ideal: 120-155)
- Incluir keyword principal naturalmente
- Terminar com CTA ou benefício
- Não duplicar o title tag

### Templates

```
[Benefício principal] + [diferencial] + [CTA].
```

```
Descubra [produto/serviço] que [benefício]. [Prova social]. [CTA].
```

**Exemplos por tipo de página:**

| Tipo | Meta Description |
|------|-----------------|
| Home | "Crie sites profissionais que convertem visitantes em clientes. Plataforma usada por 5.000+ empresas no Brasil. Comece grátis." |
| Blog post | "Aprenda como otimizar Core Web Vitals e subir no ranking do Google. Guia passo a passo com exemplos reais. Leitura de 8 min." |
| Produto | "Plano Pro: dashboards ilimitados, API completa, suporte prioritário. A partir de R$97/mês. Teste grátis por 14 dias." |
| Categoria | "Explore nossa coleção de camisetas premium em algodão orgânico. 47 modelos, 12 cores. Frete grátis acima de R$199." |
| Contato | "Fale com nossa equipe em São Paulo. Resposta em até 2h comerciais. WhatsApp, email ou formulário. Orçamento sem compromisso." |

## 2. Subheadlines

**Regras:**
- 80-120 caracteres
- Complementa o headline (não repete)
- Adiciona contexto, prova ou detalhe

### Templates

```
[Como funciona em 1 frase] + [prova social ou diferencial].
```

```
[Para quem é] + [resultado específico] + [em quanto tempo].
```

**Exemplos:**

```json
{
  "headline": "Automatize seu atendimento.",
  "subheadline_variants": [
    "Chatbot com IA que resolve 80% das dúvidas sem intervenção humana. Setup em 15 minutos.",
    "Para equipes de suporte que querem escalar sem contratar. Usado por 200+ empresas.",
    "Integra com WhatsApp, Instagram e seu site. Respostas instantâneas 24/7."
  ]
}
```

## 3. Feature Descriptions

**Regras:**
- 30-50 caracteres para título da feature
- 80-120 caracteres para descrição
- Sempre começar com benefício, não funcionalidade

### Template

```json
{
  "feature": {
    "icon": "chart-bar",
    "title": "Relatórios em tempo real",
    "description": "Acompanhe métricas que importam sem esperar. Dados atualizados a cada 30 segundos."
  }
}
```

### Exemplos Completos

```json
{
  "features": [
    {
      "icon": "zap",
      "title": "Deploy em 1 clique",
      "description": "Push para o GitHub e seu site atualiza automaticamente. Zero configuração de servidor."
    },
    {
      "icon": "shield",
      "title": "Segurança enterprise",
      "description": "SSL, WAF e backups diários inclusos. Certificação SOC 2 Type II. LGPD compliant."
    },
    {
      "icon": "globe",
      "title": "CDN global",
      "description": "Conteúdo servido do edge mais próximo. Latência <50ms para 95% dos visitantes brasileiros."
    },
    {
      "icon": "users",
      "title": "Colaboração em equipe",
      "description": "Edite junto em tempo real. Comentários no design. Aprovação de mudanças antes de publicar."
    }
  ]
}
```

## 4. Textos de CTA (Call-to-Action)

**Regras:**
- 15-30 caracteres
- Verbo de ação no imperativo
- Indicar o que acontece ao clicar
- Evitar "Clique aqui" ou "Saiba mais" genéricos

### Hierarquia de CTAs

| Nível | Tipo | Exemplos |
|-------|------|----------|
| Primário | Ação principal | "Comece grátis agora", "Criar minha conta" |
| Secundário | Ação alternativa | "Ver demonstração", "Falar com vendas" |
| Terciário | Explorar | "Conhecer planos", "Ver exemplos" |

### Exemplos por Contexto

```json
{
  "cta_variants": {
    "signup": [
      "Criar conta grátis",
      "Começar agora — é grátis",
      "Experimente 14 dias grátis"
    ],
    "pricing": [
      "Escolher este plano",
      "Começar com Pro",
      "Assinar agora"
    ],
    "demo": [
      "Ver demonstração ao vivo",
      "Agendar demo personalizada",
      "Assistir em 2 minutos"
    ],
    "contact": [
      "Falar com especialista",
      "Solicitar orçamento",
      "Agendar conversa"
    ],
    "download": [
      "Baixar guia gratuito",
      "Receber no email",
      "Download imediato"
    ],
    "ecommerce": [
      "Adicionar ao carrinho",
      "Comprar agora",
      "Garantir o meu"
    ]
  }
}
```

## 5. Value Propositions

**Fórmula:** `[Resultado desejado] sem [objeção principal]`

```json
{
  "value_propositions": [
    "Sites profissionais sem precisar de programador.",
    "Analytics completo sem complexidade do Google Analytics.",
    "Atendimento 24/7 sem contratar equipe noturna.",
    "E-commerce completo sem taxa por transação.",
    "Design premium sem custo de agência."
  ]
}
```

## 6. Microcopy (UX Writing)

### Formulários

```json
{
  "form_microcopy": {
    "email_placeholder": "seu@email.com",
    "email_helper": "Nunca compartilharemos seu email.",
    "password_helper": "Mínimo 8 caracteres com letra e número.",
    "submit_loading": "Enviando...",
    "submit_success": "Pronto! Verifique seu email.",
    "submit_error": "Algo deu errado. Tente novamente.",
    "required_field": "Este campo é obrigatório."
  }
}
```

### Empty States

```json
{
  "empty_states": {
    "no_results": "Nenhum resultado para \"{query}\". Tente termos mais amplos.",
    "no_items": "Nada aqui ainda. Crie seu primeiro {item} para começar.",
    "no_notifications": "Tudo em dia! Notificações aparecerão aqui.",
    "offline": "Sem conexão. Suas mudanças serão salvas quando voltar online."
  }
}
```

### Confirmações Destrutivas

```json
{
  "destructive_confirmations": {
    "delete_account": "Esta ação é permanente. Todos os seus dados serão removidos em 30 dias.",
    "delete_project": "O projeto \"{name}\" e todos os seus arquivos serão excluídos permanentemente.",
    "cancel_subscription": "Seu plano continuará ativo até {date}. Após isso, perderá acesso às funcionalidades Pro."
  }
}
```

## Limites de Caracteres — Referência Rápida

| Elemento | Min | Max | Ideal |
|----------|:---:|:---:|:-----:|
| Meta title | 30 | 60 | 50-55 |
| Meta description | 70 | 160 | 120-155 |
| H1 headline | 20 | 70 | 40-60 |
| Subheadline | 50 | 120 | 80-100 |
| Feature title | 15 | 50 | 25-40 |
| Feature description | 50 | 120 | 80-100 |
| CTA button | 10 | 30 | 15-25 |
| Toast message | 20 | 80 | 40-60 |
| Tooltip | 10 | 60 | 20-40 |
