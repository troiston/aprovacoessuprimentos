---
id: doc-billing-patterns
title: Padrões de UX para Billing e Gestão de Assinaturas
version: 2.0
last_updated: 2026-04-07
category: saas
priority: important
related:
  - docs/web-excellence/components/04_PRICING_PATTERNS.md
  - docs/web-excellence/saas/01_AUTH_PATTERNS.md
  - docs/web-excellence/security/01_SECURITY_CHECKLIST.md
  - .cursor/rules/stack/nextjs.mdc
---

# Padrões de UX para Billing e Gestão de Assinaturas

## Visão Geral

A experiência de billing impacta diretamente churn e receita. **23% do churn involuntário** vem de falhas de pagamento (Profitwell, 2025). Uma boa UX de billing reduz tickets de suporte em **-30%**, aumenta upgrades self-service em **+25%**, e um fluxo de cancelamento bem desenhado pode reter até **15-30%** dos usuários que tentam cancelar.

---

## 1. Pricing Page Dentro do App

### 1.1 Diferença vs Landing Page

| Aspecto | Landing Page | In-App |
|---------|-------------|--------|
| Audiência | Visitantes frios | Usuários ativos |
| Contexto | Não conhecem o produto | Já usam, sabem o valor |
| Foco | Convencer do valor | Mostrar ROI do upgrade |
| Prova social | Essencial (muita) | Menos necessária |
| Uso atual | N/A | Destacar limites atuais vs próximo tier |
| CTA | "Começar grátis" | "Fazer upgrade" / "Mudar plano" |

### 1.2 Destacar Uso Atual vs Limites

```tsx
function PlanComparison({ currentPlan, usage }) {
  return (
    <div className="rounded-2xl border p-6">
      <h3 className="font-semibold">Seu uso atual ({currentPlan.name})</h3>
      <div className="mt-4 space-y-4">
        {usage.map((item) => {
          const percentage = (item.current / item.limit) * 100
          const isNearLimit = percentage > 80
          return (
            <div key={item.label}>
              <div className="flex justify-between text-sm">
                <span>{item.label}</span>
                <span className={isNearLimit ? 'font-semibold text-amber-600' : ''}>
                  {item.current} / {item.limit}
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    isNearLimit ? 'bg-amber-500' : 'bg-primary'
                  )}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
      {usage.some((u) => u.current / u.limit > 0.8) && (
        <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
          Você está próximo do limite. Considere fazer upgrade para continuar crescendo.
        </div>
      )}
    </div>
  )
}
```

---

## 2. Display do Plano Atual

### 2.1 Informações Essenciais

| Informação | Onde Mostrar |
|-----------|-------------|
| Nome do plano | Settings → Billing (destaque) |
| Preço atual | Billing page |
| Próxima cobrança | Billing page |
| Método de pagamento | Billing page (últimos 4 dígitos) |
| Status | Badge (Ativo, Trial, Vencido, Cancelado) |
| Limites de uso | Dashboard sidebar ou Settings |

### 2.2 Card de Plano Atual

```tsx
function CurrentPlanCard({ plan, nextBillingDate, paymentMethod }) {
  return (
    <div className="rounded-2xl border p-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-muted-foreground">Plano atual</span>
          <h3 className="text-xl font-bold">{plan.name}</h3>
        </div>
        <Badge variant={plan.status === 'active' ? 'default' : 'destructive'}>
          {plan.status === 'active' ? 'Ativo' : plan.status === 'trial' ? 'Trial' : 'Vencido'}
        </Badge>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-muted-foreground">Valor</p>
          <p className="font-semibold">R${plan.price}/mês</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Próxima cobrança</p>
          <p className="font-semibold">{formatDate(nextBillingDate)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Pagamento</p>
          <p className="font-semibold">•••• {paymentMethod.last4}</p>
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <Button variant="outline" size="sm">Mudar plano</Button>
        <Button variant="ghost" size="sm">Ver faturas</Button>
      </div>
    </div>
  )
}
```

---

## 3. Fluxo de Upgrade/Downgrade

### 3.1 Upgrade (Fácil e Imediato)

| Step | Ação | UX |
|------|------|-----|
| 1 | Escolher novo plano | Comparison com uso atual |
| 2 | Confirmar mudança | Preview do valor (prorated) |
| 3 | Pagamento (se necessário) | Reusar método cadastrado |
| 4 | Ativação instantânea | Feedback imediato "Plano ativado!" |

### 3.2 Downgrade (Com Aviso Claro)

| Step | Ação | UX |
|------|------|-----|
| 1 | Escolher plano menor | Aviso do que será perdido |
| 2 | Mostrar impacto | "Você perderá acesso a: [lista]" |
| 3 | Confirmar | "Entendi e quero continuar" |
| 4 | Efetivação | No fim do período atual (não imediato) |

### 3.3 Proration Preview

```tsx
function ProrationPreview({ currentPlan, newPlan, daysRemaining }) {
  const credit = (currentPlan.price / 30) * daysRemaining
  const charge = (newPlan.price / 30) * daysRemaining
  const difference = charge - credit

  return (
    <div className="rounded-lg bg-muted p-4 text-sm">
      <h4 className="font-semibold">Resumo da mudança</h4>
      <div className="mt-3 space-y-2">
        <div className="flex justify-between">
          <span>Crédito restante ({currentPlan.name})</span>
          <span className="text-green-600">-R${credit.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Novo plano ({newPlan.name}, {daysRemaining} dias)</span>
          <span>R${charge.toFixed(2)}</span>
        </div>
        <hr />
        <div className="flex justify-between font-semibold">
          <span>Cobrança agora</span>
          <span>R${Math.max(0, difference).toFixed(2)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          A partir da próxima renovação: R${newPlan.price}/mês
        </p>
      </div>
    </div>
  )
}
```

---

## 4. Trial Management

### 4.1 UX do Trial

| Elemento | Implementação |
|----------|---------------|
| Dias restantes | Badge na sidebar: "Trial: 7 dias restantes" |
| Banner de urgência | Quando < 3 dias: banner topo |
| Email de lembrete | Dia 7, Dia 3, Dia 1 antes de expirar |
| Expiração | Downgrade graceful (não bloqueia, limita) |
| Reativação | Fácil via billing page |

### 4.2 Banner de Trial

```tsx
function TrialBanner({ daysLeft }) {
  if (daysLeft > 7) return null

  return (
    <div className={cn(
      'flex items-center justify-between px-4 py-2 text-sm',
      daysLeft <= 3
        ? 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200'
        : 'bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
    )}>
      <span>
        {daysLeft === 0
          ? 'Seu trial expira hoje!'
          : `Seu trial expira em ${daysLeft} dia${daysLeft > 1 ? 's' : ''}`}
      </span>
      <Button size="sm" variant={daysLeft <= 3 ? 'destructive' : 'default'}>
        Escolher plano
      </Button>
    </div>
  )
}
```

---

## 5. Invoice History

### 5.1 Informações por Fatura

| Campo | Formato |
|-------|---------|
| Data | DD/MM/YYYY |
| Número | INV-2026-0042 |
| Valor | R$79,00 |
| Status | Pago ✓ / Pendente ⏳ / Falhou ✗ |
| Plano | Nome do plano |
| Download | Link para PDF |

### 5.2 Tabela de Faturas

```tsx
function InvoiceHistory({ invoices }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-muted-foreground">
          <th className="pb-3 font-medium">Data</th>
          <th className="pb-3 font-medium">Descrição</th>
          <th className="pb-3 font-medium">Valor</th>
          <th className="pb-3 font-medium">Status</th>
          <th className="pb-3 font-medium" />
        </tr>
      </thead>
      <tbody className="divide-y">
        {invoices.map((inv) => (
          <tr key={inv.id}>
            <td className="py-3">{formatDate(inv.date)}</td>
            <td className="py-3">{inv.description}</td>
            <td className="py-3 tabular-nums">{formatCurrency(inv.amount)}</td>
            <td className="py-3">
              <InvoiceStatusBadge status={inv.status} />
            </td>
            <td className="py-3 text-right">
              <Button variant="ghost" size="sm" asChild>
                <a href={inv.pdfUrl} download>PDF</a>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

---

## 6. Payment Method Management

### 6.1 Features Obrigatórias

| Feature | Motivo |
|---------|--------|
| Exibir método atual (últimos 4 dígitos + bandeira) | Contexto |
| Atualizar cartão | Cartões expiram |
| Adicionar backup | Reduz falhas |
| Remover método | Controle do usuário |
| Notificação de expiração | Prevenir churn involuntário |

---

## 7. Usage-Based Billing Display

### 7.1 Quando Usado

Modelos de preço por uso (API calls, armazenamento, seats, mensagens):

```tsx
function UsageMeter({ label, current, included, overage, overagePrice }) {
  const percentage = (current / included) * 100
  const isOver = current > included

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className={isOver ? 'font-semibold text-red-600' : ''}>
          {formatNumber(current)} / {formatNumber(included)}
          {isOver && ` (+${formatNumber(overage)} excedente)`}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full',
            isOver ? 'bg-red-500' : percentage > 80 ? 'bg-amber-500' : 'bg-primary'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {isOver && (
        <p className="text-xs text-red-600">
          Custo adicional estimado: R${(overage * overagePrice).toFixed(2)}
        </p>
      )}
    </div>
  )
}
```

---

## 8. Cancellation Flow (Retention Strategy)

### 8.1 Sequência de Retenção

```
1. "Cancelar assinatura" → Tela: "O que podemos melhorar?"
2. Motivo do cancelamento (radio buttons) → Coleta feedback
3. Oferta de retenção baseada no motivo:
   - "Muito caro" → Oferecer desconto 20% por 3 meses
   - "Funcionalidades insuficientes" → Mostrar roadmap
   - "Não uso suficiente" → Oferecer downgrade
   - "Mudando para concorrente" → Oferecer comparação
   - "Outro" → Oferecer call com CS
4. Se recusar oferta → "Tem certeza?" (último chance, sem ser invasivo)
5. Confirmar cancelamento → Efetivo no fim do período pago
6. Email de confirmação com: data fim, como reativar, exportar dados
```

### 8.2 Tela de Retenção

```tsx
function CancellationReasonStep({ onNext }) {
  const [reason, setReason] = useState('')

  const reasons = [
    { id: 'price', label: 'O preço é muito alto' },
    { id: 'features', label: 'Faltam funcionalidades que preciso' },
    { id: 'usage', label: 'Não estou usando o suficiente' },
    { id: 'competitor', label: 'Mudando para outra ferramenta' },
    { id: 'temporary', label: 'Pausa temporária' },
    { id: 'other', label: 'Outro motivo' },
  ]

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h2 className="text-xl font-bold">Sentiremos sua falta</h2>
      <p className="text-muted-foreground">
        Antes de ir, nos ajude a melhorar — qual o principal motivo?
      </p>
      <RadioGroup value={reason} onValueChange={setReason}>
        {reasons.map((r) => (
          <label key={r.id} className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
            <RadioGroupItem value={r.id} />
            <span>{r.label}</span>
          </label>
        ))}
      </RadioGroup>
      <div className="flex gap-3">
        <Button variant="outline" onClick={goBack}>Voltar</Button>
        <Button onClick={() => onNext(reason)} disabled={!reason}>
          Continuar
        </Button>
      </div>
    </div>
  )
}
```

### 8.3 Dados de Retenção

| Oferta | Taxa de Retenção |
|--------|-----------------|
| Desconto temporário | 15-25% retidos |
| Downgrade sugerido | 10-15% retidos |
| Pausa da assinatura | 20-30% reativam depois |
| Call com CS | 25-35% retidos (alto touch) |
| Nenhuma ação | 0-5% voltam espontaneamente |

---

## 9. Dunning Management (Recuperação de Pagamento)

### 9.1 Sequência de Dunning

| Dia | Ação | Canal |
|-----|------|-------|
| D+0 | Tentativa automática de cobrança | Sistema |
| D+1 | Email: "Pagamento falhou" + link atualizar | Email |
| D+3 | Retry automático | Sistema |
| D+3 | Email: "Atualize seu pagamento" | Email |
| D+7 | Retry automático | Sistema |
| D+7 | Email: "Sua conta será limitada em 3 dias" | Email |
| D+10 | Limitar account (read-only) | Sistema |
| D+10 | Email: "Conta limitada, atualize para restaurar" | Email |
| D+14 | Retry final | Sistema |
| D+14 | Email: "Último aviso antes de cancelamento" | Email |
| D+21 | Cancelamento automático | Sistema |
| D+21 | Email: "Conta cancelada — como reativar" | Email |

### 9.2 In-App Dunning Banner

```tsx
function DunningBanner({ failedAt, daysUntilSuspension }) {
  return (
    <div className="bg-red-50 px-4 py-3 dark:bg-red-900/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangleIcon className="h-5 w-5 text-red-600" />
          <div className="text-sm">
            <p className="font-semibold text-red-800 dark:text-red-200">
              Pagamento falhou
            </p>
            <p className="text-red-700 dark:text-red-300">
              Atualize seu método de pagamento em {daysUntilSuspension} dias
              para evitar interrupção do serviço.
            </p>
          </div>
        </div>
        <Button size="sm" variant="destructive">
          Atualizar pagamento
        </Button>
      </div>
    </div>
  )
}
```

---

## Fontes e Referências

- Profitwell — State of SaaS Billing 2025
- Chargebee — Dunning Management Best Practices 2025
- Paddle — SaaS Metrics Report 2025
- Baremetrics — Churn Analysis 2025
- Stripe — Billing Best Practices Guide 2025
- ProfitWell — Cancellation Flow Optimization 2025
