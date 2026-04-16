# 02_MONETIZATION.md — Gate de Modelo de Negocio

> **Skills:** `/using-superpowers` `/brainstorming` `/writing-plans`
> **Fase:** 1b (entre PRD e Market)
> **Gate de saida:** Modelo escolhido com justificativa + integracao tecnica definida
> **Responsavel:** Tech Lead
> **Referencia cruzada:** `docs/01_PRD.md` (requisitos), `docs/06_SPECIFICATION.md` (implementacao tecnica)

---

## 1. Contexto do Produto

> Preencher com base no `01_PRD.md`

- **Produto:** [nome]
- **Publico-alvo:** [quem]
- **Proposta de valor:** [o que resolve]
- **Tipo de uso:** [ ] Recorrente [ ] Esporadico [ ] Baseado em volume

---

## 2. Modelos de Monetizacao Avaliados

> Dados de mercado 2026 para referencia de decisao.

### 2.1 Assinatura Recorrente (mensal/anual)
- **Como funciona:** Cobranca fixa por periodo
- **Dados 2026:** Modelo classico; per-seat perde eficiencia com AI reduzindo headcount
- **Pros:** Receita previsivel, LTV alto, simplicidade
- **Contras:** Dificuldade em capturar valor variavel, churn se uso for baixo
- **Melhor para:** SaaS com uso constante e funcionalidades estaveis
- **Avaliacao para este produto:** [preencher]

### 2.2 Creditos / Tokens (pay-per-use)
- **Como funciona:** Usuario compra creditos e consome por acao
- **Dados 2026:** Crescimento de 126% YoY; 62% dos produtos AI projetados para usar ate 2027
- **Pros:** Alinhamento direto entre valor e custo, baixa barreira de entrada
- **Contras:** Receita imprevisivel, dificuldade em projetar revenue
- **Melhor para:** SaaS com custos variaveis (API calls, compute, AI inference)
- **Avaliacao para este produto:** [preencher]

### 2.3 Freemium (gratis + plano pago)
- **Como funciona:** Tier gratuito limitado, tiers pagos com mais features/uso
- **Dados 2026:** Excelente para aquisicao; taxa de conversao tipica 2-5%
- **Pros:** Aquisicao organica, product-led growth, efeito de rede
- **Contras:** Custos de infra para free users, conversao baixa, free riders
- **Melhor para:** Produtos com efeito de rede ou viral
- **Avaliacao para este produto:** [preencher]

### 2.4 Hibrido (assinatura + uso)
- **Como funciona:** Base fixa (assinatura) + consumo variavel
- **Dados 2026:** 21% median growth rate (MAIOR de todos os modelos); 60%+ dos SaaS usam alguma forma de hibrido (era 30% em 2021)
- **Pros:** Previsibilidade + captura de valor excedente, crescimento superior
- **Contras:** Complexidade de billing, comunicacao mais dificil ao usuario
- **Melhor para:** SaaS que combinam features fixas com consumo variavel
- **Avaliacao para este produto:** [preencher]

### 2.5 Pagamento Unico
- **Como funciona:** Compra unica, acesso permanente
- **Dados 2026:** Viavel para ferramentas/templates, nao para SaaS com custos operacionais
- **Pros:** Simplicidade, sem churn, facil de entender
- **Contras:** Sem receita recorrente, dificil sustentar operacao ongoing
- **Melhor para:** Templates, ferramentas offline, licencas perpetuas
- **Avaliacao para este produto:** [preencher]

---

## 3. Matriz de Decisao

| Criterio | Peso | Assinatura | Creditos | Freemium | Hibrido | Unico |
|----------|------|-----------|----------|----------|---------|-------|
| Alinhamento com valor entregue | 25% | [1-5] | [1-5] | [1-5] | [1-5] | [1-5] |
| Previsibilidade de receita | 20% | [1-5] | [1-5] | [1-5] | [1-5] | [1-5] |
| Barreira de entrada para usuario | 15% | [1-5] | [1-5] | [1-5] | [1-5] | [1-5] |
| Complexidade tecnica | 15% | [1-5] | [1-5] | [1-5] | [1-5] | [1-5] |
| Potencial de growth | 15% | [1-5] | [1-5] | [1-5] | [1-5] | [1-5] |
| Custo de implementacao | 10% | [1-5] | [1-5] | [1-5] | [1-5] | [1-5] |
| **Score ponderado** | | [calc] | [calc] | [calc] | [calc] | [calc] |

---

## 4. Integracao Tecnica

### Provedor de Pagamento
- [ ] **Stripe** — padrao da industria; Checkout, Customer Portal, Webhooks, Billing Portal
- [ ] **Paddle** — cuida de impostos globais automaticamente
- [ ] **LemonSqueezy** — mais simples, bom para creators/indie

### Escolha: [preencher]
### Justificativa: [preencher]

### Events Criticos (se Stripe)
- `checkout.session.completed` — conceder acesso
- `customer.subscription.updated` — mudancas de plano
- `customer.subscription.deleted` — revogar acesso
- `invoice.payment_succeeded` — estender periodo
- `invoice.payment_failed` — alertar e marcar conta

---

## 5. Estrutura de Pricing (Tiers)

> Maximo 3 tiers para evitar choice paralysis. Usar decoy effect no tier medio.

| | Free / Starter | Pro (Recomendado) | Enterprise |
|---|---|---|---|
| Preco mensal | [preencher] | [preencher] | [preencher] |
| Preco anual | [preencher] | [preencher] | [preencher] |
| Features | [preencher] | [preencher] | [preencher] |
| Limites | [preencher] | [preencher] | [preencher] |
| Suporte | [preencher] | [preencher] | [preencher] |

---

## 6. Veredito

> OBRIGATORIO — nao avancar para Fase 1c (Market) ou Fase 1D (Design) sem preencher.

- **Modelo escolhido:** [preencher]
- **Justificativa:** [preencher]
- **Provedor:** [preencher]
- **Riscos identificados:** [preencher]
- **Impacto em seguranca:** [preencher]
- **Impacto em UX:** [preencher]

### Status: [ ] APROVADO [ ] REPROVADO — Requer revisao

---

## 7. Dados de Referencia (Mercado 2026)

- 61% dos SaaS usam pricing baseado em uso (era 49% no ano anterior)
- Creditos/tokens cresceram 126% YoY
- Modelo hibrido (assinatura + uso) tem 21% median growth rate — maior de todos
- 67% dos SaaS B2B combinam multiplos modelos
- Empresas que otimizam monetizacao crescem 2-4x mais rapido
- Modelo certo = 30-70% mais net revenue retention
- 60% dos visitantes SaaS checam pricing antes de qualquer demo

*Fontes: Pricingio 2026, Getmonetizely 2026, SubscriptionIndex 2026*
