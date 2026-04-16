---
id: doc-onboarding-patterns
title: Padrões de Onboarding para Ativação e Retenção
version: 2.0
last_updated: 2026-04-07
category: saas
priority: critical
related:
  - docs/web-excellence/saas/01_AUTH_PATTERNS.md
  - docs/web-excellence/saas/05_EMPTY_STATES.md
  - docs/web-excellence/saas/03_DASHBOARD_PATTERNS.md
  - docs/web-excellence/components/06_CONVERSION_ELEMENTS.md
---

# Padrões de Onboarding para Ativação e Retenção

## Visão Geral

Onboarding é o momento mais crítico do ciclo de vida do usuário. **40-60%** dos usuários de SaaS nunca retornam após o primeiro uso (Mixpanel, 2025). A diferença entre um onboarding medíocre e um excelente pode significar **+50% de ativação** (Appcues). O objetivo é levar o usuário ao "Aha moment" o mais rápido possível.

---

## 1. Intent-Based Routing

### 1.1 Princípio

> A primeira pergunta do onboarding não deve ser "quem é você", mas "o que você quer alcançar". A resposta remodela toda a experiência subsequente.

### 1.2 Implementação

```tsx
const intents = [
  {
    id: 'grow-revenue',
    label: 'Aumentar receita',
    icon: TrendingUpIcon,
    description: 'Otimizar conversão e expandir vendas',
    route: '/onboarding/revenue',
  },
  {
    id: 'save-time',
    label: 'Economizar tempo',
    icon: ClockIcon,
    description: 'Automatizar tarefas repetitivas',
    route: '/onboarding/automation',
  },
  {
    id: 'collaborate',
    label: 'Colaborar melhor',
    icon: UsersIcon,
    description: 'Organizar trabalho em equipe',
    route: '/onboarding/collaboration',
  },
]

function IntentSelection() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">O que você quer alcançar?</h1>
        <p className="mt-2 text-muted-foreground">
          Isso nos ajuda a personalizar sua experiência
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {intents.map((intent) => (
          <button
            key={intent.id}
            onClick={() => selectIntent(intent)}
            className="flex flex-col items-center gap-3 rounded-2xl border p-6 text-center transition-all hover:border-primary hover:shadow-md"
          >
            <intent.icon className="h-8 w-8 text-primary" />
            <span className="font-semibold">{intent.label}</span>
            <span className="text-sm text-muted-foreground">{intent.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
```

### 1.3 Dados de Impacto

| Abordagem | Ativação (Day 7) | Fonte |
|-----------|-------------------|-------|
| Onboarding genérico (mesmo para todos) | 18-25% | Mixpanel 2025 |
| **Onboarding por intent** | **35-45%** | Appcues 2025 |
| Onboarding por role/cargo | 28-35% | Pendo 2025 |

---

## 2. Quantidade de Steps (3-5 Máximo)

### 2.1 Dados de Abandono por Step

| Steps | Taxa de Conclusão | Recomendação |
|-------|-------------------|--------------|
| 1-2 | 85-95% | Mínimo viável, pode ser pouco |
| **3-5** | **70-85%** | **Sweet spot** |
| 6-8 | 40-60% | Apenas se cada step entrega valor |
| 9+ | <30% | Muito longo, dividir em fases |

### 2.2 Cada Step Deve Entregar Valor

| Step | Ruim (Coleta dados) | Bom (Entrega valor) |
|------|---------------------|---------------------|
| 1 | "Qual seu cargo?" | "O que você quer alcançar? → Experiência personalizada" |
| 2 | "Tamanho da empresa?" | "Conecte sua ferramenta → Dados importados" |
| 3 | "Como nos encontrou?" | "Crie seu primeiro [item] → Valor tangível" |

---

## 3. Progress Indicator

### 3.1 Tipos de Indicador

| Tipo | Quando | Efeito |
|------|--------|--------|
| Step counter ("Passo 2 de 4") | Linear, poucos steps | +12% conclusão vs sem indicador |
| Progress bar | Linear, 3-7 steps | +15% conclusão |
| Checklist | Não-linear, múltiplas tarefas | +20% conclusão |
| Percentage ("60% completo") | Muitos steps | Efeito endowed progress |

### 3.2 Efeito Endowed Progress

> Começar a barra de progresso em **20-30%** ao invés de 0%. O cérebro quer "completar" algo já iniciado. Aumento de **+15%** na conclusão (Nunes & Dreze, 2006 — validado em 2025).

```tsx
function OnboardingProgress({ currentStep, totalSteps }) {
  const baseProgress = 20
  const stepProgress = ((currentStep) / totalSteps) * (100 - baseProgress)
  const totalProgress = baseProgress + stepProgress

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Passo {currentStep + 1} de {totalSteps}</span>
        <span className="font-medium">{Math.round(totalProgress)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: `${baseProgress}%` }}
          animate={{ width: `${totalProgress}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  )
}
```

---

## 4. Skip Option

### 4.1 Regra

> Todo step do onboarding **DEVE** ter opção de pular, exceto ações legalmente obrigatórias (aceitar termos, verificar email).

### 4.2 Design do Skip

```tsx
<div className="flex items-center justify-between">
  <Button variant="ghost" onClick={handleSkip}>
    Pular por agora
  </Button>
  <Button onClick={handleNext}>
    Continuar
  </Button>
</div>
```

### 4.3 Dados

| Com Skip | Sem Skip |
|----------|----------|
| 75% completam onboarding | 55% completam |
| 40% dos que pularam voltam depois | 25% abandonam completamente |

> Paradoxo: dar a opção de pular **aumenta** a taxa de conclusão total porque remove a sensação de obrigação.

---

## 5. Checklist Pattern

### 5.1 Quando Usar

O checklist é ideal para onboarding **não-linear** onde o usuário pode completar tarefas em qualquer ordem:

```tsx
function OnboardingChecklist({ tasks }) {
  const completedCount = tasks.filter((t) => t.completed).length
  const progress = (completedCount / tasks.length) * 100

  return (
    <div className="rounded-2xl border p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Primeiros passos</h2>
        <span className="text-sm text-muted-foreground">
          {completedCount}/{tasks.length}
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <ul className="mt-4 space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center gap-3">
            {task.completed ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <CircleIcon className="h-5 w-5 text-muted-foreground" />
            )}
            <button
              className={cn(
                'text-sm',
                task.completed
                  ? 'text-muted-foreground line-through'
                  : 'font-medium hover:text-primary'
              )}
              onClick={() => navigateToTask(task)}
            >
              {task.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### 5.2 Tarefas Comuns do Checklist SaaS

| # | Tarefa | Tipo | Prioridade |
|---|--------|------|------------|
| 1 | Completar perfil | Setup | Médio |
| 2 | Conectar integração | Setup | Alto |
| 3 | Convidar membro do time | Ativação social | Alto |
| 4 | Criar primeiro [item principal] | Aha moment | Crítico |
| 5 | Personalizar workspace | Setup | Baixo |
| 6 | Explorar recurso X | Educação | Médio |

---

## 6. Behavioral Triggers (+50% Ativação)

### 6.1 Princípio

> Mostrar a orientação certa no momento certo, baseada no **comportamento** do usuário, não no tempo transcorrido.

### 6.2 Triggers e Ações

| Trigger (Comportamento) | Ação | Impacto |
|--------------------------|------|---------|
| Primeiro login | Welcome screen + intent routing | Personalização |
| Criou primeiro item | Celebrar + sugerir próximo passo | +30% segundo uso |
| Usou feature pela 3ª vez | Mostrar feature avançada relacionada | +20% depth |
| 3 dias sem login | Email de re-engajamento | +15% retorno |
| Visitou pricing page | In-app: "Precisa de ajuda para escolher?" | +10% upgrade |
| Convidou colega | Celebrar + sugerir criar espaço compartilhado | +25% retenção |
| Atingiu limite do plano | Upgrade prompt com contexto | +35% upgrade |

### 6.3 Dados de Impacto

| Abordagem | Taxa de Ativação |
|-----------|-----------------|
| Tour estático no primeiro login | 20-30% |
| **Behavioral triggers contextuais** | **40-60%** |
| Nenhum onboarding | 10-15% |

---

## 7. Personalização

### 7.1 Níveis de Personalização

| Nível | Dado Usado | Exemplo |
|-------|-----------|---------|
| **Intent** | Objetivo selecionado | Dashboard configurado por objetivo |
| **Role** | Cargo/função | Interface adaptada (dev vs manager) |
| **Industry** | Setor da empresa | Templates e exemplos do setor |
| **Size** | Tamanho do time | Features destacadas por escala |
| **Behavior** | Ações no app | Sugestões baseadas em uso real |

### 7.2 Template Pre-Populado

> Ao invés de um workspace vazio, oferecer templates baseados no intent/industry selecionado:

```tsx
const templates = {
  'startup-saas': {
    name: 'Startup SaaS',
    boards: ['Roadmap', 'Sprint Board', 'Bug Tracker'],
    sampleData: true,
  },
  'agency': {
    name: 'Agência Digital',
    boards: ['Projetos', 'Pipeline Comercial', 'Entregas'],
    sampleData: true,
  },
}
```

---

## 8. Empty State → First Value

### 8.1 Os 3 Momentos do Empty State

| Momento | O que Mostrar | Objetivo |
|---------|---------------|----------|
| Primeiro uso (virgem) | Guia para criar primeiro item | Atingir Aha moment |
| Sem dados (busca vazia) | Sugestões e dicas | Manter engajamento |
| Retorno sem atividade | Re-engajamento | Lembrar do valor |

### 8.2 CTA do Empty State

O empty state deve ter **UMA ação clara** que leve ao primeiro valor:

```tsx
function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="rounded-full bg-primary/10 p-4">
        <PlusIcon className="h-8 w-8 text-primary" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">
        Crie seu primeiro projeto
      </h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Projetos organizam seu trabalho. Comece com um template ou crie do zero.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={createFromTemplate}>
          Usar template
        </Button>
        <Button variant="outline" onClick={createBlank}>
          Criar do zero
        </Button>
      </div>
    </div>
  )
}
```

---

## 9. Contextual Guidance > Static Tours

### 9.1 Comparação

| Product Tour Estático | Guidance Contextual |
|----------------------|---------------------|
| Tooltip sequencial no primeiro login | Tooltip quando o usuário se aproxima da feature |
| Forçado, sem escape fácil | Opcional, dismissível |
| Mostra tudo de uma vez | Mostra o relevante no momento |
| 20-30% conclusão | 60-80% engagement |
| Esquecido em 24h | Retido por uso repetido |

### 9.2 Padrões de Guidance Contextual

| Padrão | Quando | Implementação |
|--------|--------|---------------|
| **Tooltip na primeira vez** | Usuário vê uma feature pela primeira vez | Tooltip com dismiss + "Não mostrar novamente" |
| **Hotspot pulsante** | Feature nova ou subutilizada | Ponto de luz animado |
| **Banner educacional** | Feature complexa relevante | Banner dismissível no topo da seção |
| **Inline hint** | Campos de formulário | Texto de ajuda abaixo do campo |
| **Empty state CTA** | Seção vazia | Call-to-action para primeira ação |
| **Coach mark** | Workflow complexo | Spotlight + explicação step-by-step |

### 9.3 Implementação de First-Time Tooltip

```tsx
function FirstTimeTooltip({ featureId, children, content }) {
  const [dismissed, setDismissed] = useLocalStorage(`tooltip-${featureId}`, false)

  if (dismissed) return children

  return (
    <Tooltip open>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{content}</p>
        <button
          onClick={() => setDismissed(true)}
          className="mt-2 text-xs font-medium text-primary"
        >
          Entendi
        </button>
      </TooltipContent>
    </Tooltip>
  )
}
```

---

## 10. Métricas de Onboarding

### 10.1 Métricas Essenciais

| Métrica | Definição | Benchmark SaaS |
|---------|-----------|----------------|
| **Completion Rate** | % que completou onboarding | 60-80% |
| **Time to Aha** | Tempo até primeira ação de valor | < 5 minutos |
| **Activation Rate** | % que realizou ação-chave no Day 1 | 30-50% |
| **Day 7 Retention** | % que voltou na semana 1 | 40-60% |
| **Day 30 Retention** | % que voltou no mês 1 | 20-40% |
| **Step Drop-off** | Onde usuários abandonam | Identificar gargalos |

### 10.2 Funil de Onboarding

```
Signup (100%)
  → Email verified (85%)
    → Onboarding started (80%)
      → Step 1 complete (75%)
        → Step 2 complete (65%)
          → Step 3 complete (55%)
            → "Aha moment" reached (45%)
              → Day 7 return (35%)
                → Day 30 return (20%)
                  → Converted to paid (10-15%)
```

---

## Fontes e Referências

- Mixpanel — SaaS Retention Benchmarks 2025
- Appcues — Onboarding Benchmarks Report 2025
- Pendo — Product Adoption Trends 2025
- Nunes & Dreze — Endowed Progress Effect (validado 2025)
- Intercom — Onboarding Best Practices Guide 2025
- Chameleon — Tooltip vs Tour Engagement Study 2025
