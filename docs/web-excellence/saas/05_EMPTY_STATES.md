---
id: doc-empty-states
title: Padrões de Empty States para Ativação e Orientação
version: 2.0
last_updated: 2026-04-07
category: saas
priority: important
related:
  - docs/web-excellence/saas/02_ONBOARDING_PATTERNS.md
  - docs/web-excellence/saas/03_DASHBOARD_PATTERNS.md
  - docs/web-excellence/components/06_CONVERSION_ELEMENTS.md
---

# Padrões de Empty States para Ativação e Orientação

## Visão Geral

Empty states são oportunidades disfarçadas. Um dashboard vazio pode ser o fim da jornada do usuário (abandono) ou o início do engajamento. Dados: empty states com os 3 elementos obrigatórios (contexto, direção, preview) aumentam a taxa de primeira ação em **+40%** vs tela vazia (Appcues, 2025).

---

## 1. Os 3 Elementos Obrigatórios

Todo empty state DEVE conter:

| # | Elemento | Função | Exemplo |
|---|----------|--------|---------|
| 1 | **Contexto** | Explicar onde o usuário está | "Aqui aparecem seus projetos" |
| 2 | **Direção** | Dizer o que fazer | "Crie seu primeiro projeto" |
| 3 | **Preview/Visual** | Mostrar como ficará quando preenchido | Ilustração ou mockup |

### 1.1 Implementação do Padrão Base

```tsx
interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

function EmptyState({ icon: Icon, title, description, action, secondaryAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={action.onClick}>{action.label}</Button>
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  )
}
```

---

## 2. Ilustrações

### 2.1 Guidelines

| Aspecto | Regra |
|---------|-------|
| Estilo | Consistente com brand (line art, flat, ou 3D sutil) |
| Cor | Usar cores do design system, tons suaves |
| Tamanho | 120-200px max height |
| Complexidade | Simples, rápido de entender |
| Animação | Sutil (float, pulse), não distrativa |
| Dark mode | Variante para dark mode OU cores adaptáveis |
| Alternativa | `aria-hidden="true"` + alt vazio (decorativa) |

### 2.2 Tipos de Ilustração por Contexto

| Contexto | Sugestão Visual |
|----------|----------------|
| Lista vazia | Clipboard ou pasta vazia |
| Dashboard vazio | Gráfico com linhas pontilhadas |
| Inbox vazio | Envelope com check |
| Busca sem resultados | Lupa com "?" |
| Erro/Offline | Nuvem desconectada |
| Sem permissão | Cadeado |
| Primeiro uso | Foguete / Seta para cima |

---

## 3. Padrões de Copy

### 3.1 Tom de Voz

| Tom | Quando | Exemplo |
|-----|--------|---------|
| **Encorajador** | Primeiro uso | "Hora de começar! Crie seu primeiro projeto." |
| **Informativo** | Busca vazia | "Nenhum resultado para 'xyz'. Tente outro termo." |
| **Empático** | Erro | "Algo deu errado. Estamos trabalhando nisso." |
| **Neutro** | Lista filtrada vazia | "Nenhum item corresponde aos filtros selecionados." |

### 3.2 Fórmula de Copy

> **Título:** O que está vazio (substantivo) + estado atual
> **Descrição:** O que fazer para preencher + benefício

**Bom:**
- Título: "Nenhum projeto ainda"
- Descrição: "Crie seu primeiro projeto para organizar tarefas e colaborar com seu time."

**Ruim:**
- Título: "Vazio"
- Descrição: "Não há nada aqui."

---

## 4. CTA Placement

### 4.1 Regras

| Regra | Detalhe |
|-------|---------|
| **1 CTA primário** | Ação principal que resolve o empty state |
| **1 CTA secundário** (opcional) | Alternativa (usar template, importar, ver docs) |
| **Posição** | Centralizado, abaixo da descrição |
| **Tamanho** | `default` ou `lg` — visível e convidativo |
| **Texto** | Específico: "Criar projeto" não "Criar" |

### 4.2 CTAs por Contexto

| Contexto | CTA Primário | CTA Secundário |
|----------|-------------|----------------|
| Primeiro projeto | "Criar projeto" | "Usar template" |
| Primeira integração | "Conectar ferramenta" | "Ver integrações" |
| Primeiro membro | "Convidar colega" | "Pular por agora" |
| Dashboard vazio | "Configurar dashboard" | "Ver tutorial" |

---

## 5. Progressive Empty States

### 5.1 Primeiro Uso vs Retorno

| Estado | Primeiro Uso (Nunca criou) | Retorno (Já usou, mas vazio agora) |
|--------|---------------------------|-----------------------------------|
| Visual | Mais elaborado, educativo | Mais simples, direto |
| Copy | Explicar o que é e por que usar | Assumir que sabe, focar em ação |
| CTA | "Criar seu primeiro [X]" | "Criar novo [X]" |
| Preview | Mostrar exemplo do que ficará | Não necessário |
| Ajuda | Link para tutorial/docs | Link para filtros ou busca |

### 5.2 Implementação Progressiva

```tsx
function SmartEmptyState({ entityType, hasEverCreated }) {
  if (!hasEverCreated) {
    return (
      <EmptyState
        icon={RocketIcon}
        title={`Crie seu primeiro ${entityType}`}
        description={`${entityType}s ajudam você a organizar e acompanhar seu trabalho. Comece criando um agora.`}
        action={{ label: `Criar ${entityType}`, onClick: openCreate }}
        secondaryAction={{ label: 'Usar template', onClick: openTemplates }}
      />
    )
  }

  return (
    <EmptyState
      icon={FolderIcon}
      title={`Nenhum ${entityType} encontrado`}
      description="Seus itens anteriores podem ter sido arquivados ou filtrados."
      action={{ label: `Criar novo ${entityType}`, onClick: openCreate }}
      secondaryAction={{ label: 'Ver arquivados', onClick: showArchived }}
    />
  )
}
```

---

## 6. Error Empty States

### 6.1 Tipos de Erro

| Tipo | Causa | UX |
|------|-------|-----|
| **Network error** | Sem internet / API down | Retry button + cache offline |
| **Permission error** | Sem acesso | Explicar + link para solicitar acesso |
| **404 / Not found** | Recurso deletado ou URL errada | Redirect sugerido + busca |
| **Server error (500)** | Bug no backend | "Estamos trabalhando nisso" + retry |
| **Rate limited** | Muitas requisições | Timer + retry automático |

### 6.2 Error Empty State

```tsx
function ErrorState({ error, onRetry }) {
  const errorMessages = {
    network: {
      icon: WifiOffIcon,
      title: 'Sem conexão',
      description: 'Verifique sua internet e tente novamente.',
      actionLabel: 'Tentar novamente',
    },
    permission: {
      icon: LockIcon,
      title: 'Acesso restrito',
      description: 'Você não tem permissão para ver este conteúdo. Solicite acesso ao administrador.',
      actionLabel: 'Solicitar acesso',
    },
    server: {
      icon: ServerCrashIcon,
      title: 'Algo deu errado',
      description: 'Estamos trabalhando para resolver. Tente novamente em alguns minutos.',
      actionLabel: 'Tentar novamente',
    },
  }

  const config = errorMessages[error.type] || errorMessages.server

  return (
    <EmptyState
      icon={config.icon}
      title={config.title}
      description={config.description}
      action={{ label: config.actionLabel, onClick: onRetry }}
    />
  )
}
```

---

## 7. Search No Results

### 7.1 UX de Busca Vazia

| Elemento | Detalhe |
|----------|---------|
| Repetir o termo | "Nenhum resultado para **'xyz'**" |
| Sugestões | "Tente buscar por..." |
| Filtros ativos | "Remova filtros para ver mais resultados" |
| Criar novo | "Criar [item] chamado 'xyz'" |
| Feedback | "Não encontrou o que procura? [Nos avise]" |

### 7.2 Implementação

```tsx
function SearchEmpty({ query, activeFilters, onClearFilters, onCreate }) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <SearchIcon className="h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-semibold">
        Nenhum resultado para "{query}"
      </h3>
      <div className="mt-3 space-y-2 text-sm text-muted-foreground">
        <p>Sugestões:</p>
        <ul className="space-y-1">
          <li>• Verifique a ortografia</li>
          <li>• Use termos mais genéricos</li>
          {activeFilters.length > 0 && (
            <li>
              •{' '}
              <button
                onClick={onClearFilters}
                className="text-primary hover:underline"
              >
                Remova os filtros ativos ({activeFilters.length})
              </button>
            </li>
          )}
        </ul>
      </div>
      {onCreate && (
        <Button className="mt-6" onClick={() => onCreate(query)}>
          Criar "{query}"
        </Button>
      )}
    </div>
  )
}
```

---

## 8. List Empty State

Para listas/tabelas sem dados:

```tsx
function ListEmpty({ entityName, onAdd }) {
  return (
    <tr>
      <td colSpan={999} className="py-12 text-center">
        <p className="text-muted-foreground">
          Nenhum {entityName} encontrado
        </p>
        <Button variant="outline" size="sm" className="mt-4" onClick={onAdd}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Adicionar {entityName}
        </Button>
      </td>
    </tr>
  )
}
```

---

## 9. Dashboard Empty State

O dashboard vazio é o caso mais crítico — é a primeira coisa que o novo usuário vê.

### 9.1 Padrão: Setup Wizard

```tsx
function DashboardEmpty() {
  return (
    <div className="mx-auto max-w-2xl py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Bem-vindo ao [Produto]!</h1>
        <p className="mt-2 text-muted-foreground">
          Complete estes passos para configurar seu workspace
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <SetupCard
          step={1}
          title="Crie seu primeiro projeto"
          description="Projetos organizam tarefas e colaboração"
          completed={false}
          action={{ label: 'Criar projeto', href: '/new-project' }}
        />
        <SetupCard
          step={2}
          title="Convide seu time"
          description="Colabore com colegas em tempo real"
          completed={false}
          action={{ label: 'Convidar', href: '/settings/team' }}
        />
        <SetupCard
          step={3}
          title="Conecte suas ferramentas"
          description="Integre com as ferramentas que já usa"
          completed={false}
          action={{ label: 'Ver integrações', href: '/integrations' }}
        />
      </div>
    </div>
  )
}
```

---

## 10. Onboarding Empty States

### 10.1 Padrão: Sample Data

Em vez de vazio total, popular com dados de exemplo:

| Abordagem | Vantagem | Desvantagem |
|-----------|----------|-------------|
| **Completamente vazio** | Limpo, sem confusão | Não mostra valor |
| **Dados de exemplo** | Mostra como ficará com dados reais | Pode confundir ("são meus dados?") |
| **Dados do template** | Relevante ao contexto do usuário | Requer personalização |
| **Dados importados** | Valor imediato | Requer integração |

### 10.2 Badge de Sample Data

Quando usar dados de exemplo, sempre sinalizar:

```tsx
function SampleDataBadge() {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
      <InfoIcon className="h-4 w-4" />
      <span>
        Estes são dados de exemplo.{' '}
        <button className="font-medium underline">Importar seus dados</button>
        {' '}ou{' '}
        <button className="font-medium underline">limpar exemplos</button>
      </span>
    </div>
  )
}
```

---

## Fontes e Referências

- Appcues — Empty States Impact Report 2025
- Nielsen Norman Group — Empty State Design Patterns 2025
- Mobbin — Empty States UI Gallery
- Intercom — First Use Experience Research 2025
- Luke Wroblewski — Empty States Best Practices
