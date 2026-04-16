---
id: doc-dashboard-patterns
title: Padrões de Design de Dashboard para SaaS
version: 2.0
last_updated: 2026-04-07
category: saas
priority: important
related:
  - docs/web-excellence/saas/02_ONBOARDING_PATTERNS.md
  - docs/web-excellence/saas/05_EMPTY_STATES.md
  - docs/web-excellence/performance/01_CORE_WEB_VITALS.md
  - .cursor/rules/design/tokens.mdc
---

# Padrões de Design de Dashboard para SaaS

## Visão Geral

O dashboard é a interface mais usada de qualquer SaaS — é onde o usuário vive diariamente. Pesquisas de eye-tracking mostram que dashboards seguem o **F-pattern** de leitura, com usuários focando nos primeiros 3-5 KPIs por **65% do tempo** (Nielsen Norman Group, 2025). A sidebar se torna obrigatória com **6+ seções** de navegação.

---

## 1. Sidebar Navigation

### 1.1 Quando Usar Sidebar vs Top Nav

| Critério | Sidebar | Top Nav |
|----------|---------|---------|
| Seções de navegação | 6+ | 3-5 |
| Profundidade | 2-3 níveis | 1-2 níveis |
| Contexto | App complexo (SaaS, admin) | Site simples, marketing |
| Mobile | Colapsa em menu hamburger | Tab bar ou drawer |

### 1.2 Anatomia de Sidebar SaaS

```
┌──────────────┬─────────────────────────────────┐
│ [Logo]       │  [Breadcrumb / Page Title]       │
│              │                                   │
│ Dashboard    │  ┌─────────┐ ┌─────────┐         │
│ Projetos     │  │ KPI 1   │ │ KPI 2   │         │
│ Analytics    │  └─────────┘ └─────────┘         │
│ Clientes     │  ┌─────────┐ ┌─────────┐         │
│ Integrações  │  │ KPI 3   │ │ KPI 4   │         │
│ ───────────  │  └─────────┘ └─────────┘         │
│ Configurações│                                   │
│              │  ┌────────────────────────────┐   │
│              │  │ Chart / Table              │   │
│ [User Menu]  │  │                            │   │
│ [Plan Badge] │  └────────────────────────────┘   │
└──────────────┴─────────────────────────────────┘
```

### 1.3 Implementação de Sidebar

```tsx
function Sidebar({ items, collapsed, onToggle }) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-background transition-all duration-200',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && <Logo className="h-8" />}
        <Button variant="ghost" size="icon" onClick={onToggle}>
          <PanelLeftIcon className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {items.map((item) => (
          <SidebarItem key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>

      <div className="border-t p-4">
        <UserMenu collapsed={collapsed} />
      </div>
    </aside>
  )
}

function SidebarItem({ item, collapsed }) {
  const isActive = usePathname() === item.href

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
      title={collapsed ? item.label : undefined}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
      {!collapsed && item.badge && (
        <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
          {item.badge}
        </span>
      )}
    </Link>
  )
}
```

---

## 2. F-Pattern e Information Hierarchy

### 2.1 Eye-Tracking em Dashboards

O padrão F de leitura em dashboards segue esta ordem de atenção:

| Zona | Posição | Atenção | O que Colocar |
|------|---------|---------|---------------|
| F1 | Topo horizontal | 100% | Status atual + métricas chave |
| F2 | Segundo nível horizontal | 80% | KPIs secundários, filtros |
| F3 | Lado esquerdo vertical | 70% | Navegação, categorias |
| F4 | Centro | 50% | Charts, tabelas detalhadas |
| F5 | Inferior direito | 30% | Ações secundárias, links |

### 2.2 Hierarquia de Informação

```
1. STATUS (O que está acontecendo agora?)
   → Alertas, status do sistema, notificações

2. MÉTRICAS (Como estamos performando?)
   → KPI cards com números grandes

3. TENDÊNCIAS (Para onde estamos indo?)
   → Charts de linha/área com comparação temporal

4. DETALHES (O que preciso investigar?)
   → Tabelas com filtros e ordenação

5. AÇÕES (O que devo fazer?)
   → CTAs, quick actions, tarefas pendentes
```

---

## 3. KPI Cards (3-5 Headline Numbers)

### 3.1 Regras de KPI Cards

| Regra | Detalhe |
|-------|---------|
| Quantidade | 3-5 KPIs no topo (mais = overwhelm) |
| Tamanho do número | Grande, bold, destaque máximo |
| Contexto | Sempre incluir comparação (vs período anterior) |
| Cor | Verde ↑, Vermelho ↓, Neutro → |
| Trend | Sparkline ou % de mudança |
| Click | Cada KPI deve linkar para detalhes |

### 3.2 Implementação

```tsx
interface KPICardProps {
  label: string
  value: string | number
  change: number
  changeLabel: string
  icon: React.ComponentType
  href: string
}

function KPICard({ label, value, change, changeLabel, icon: Icon, href }: KPICardProps) {
  const isPositive = change > 0
  const isNeutral = change === 0

  return (
    <Link
      href={href}
      className="group rounded-2xl border bg-card p-6 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums">{formatNumber(value)}</p>
      <div className="mt-2 flex items-center gap-1.5">
        {!isNeutral && (
          <span className={cn(
            'flex items-center text-sm font-medium',
            isPositive ? 'text-green-600' : 'text-red-600'
          )}>
            {isPositive ? <TrendingUpIcon className="h-4 w-4" /> : <TrendingDownIcon className="h-4 w-4" />}
            {Math.abs(change)}%
          </span>
        )}
        <span className="text-xs text-muted-foreground">{changeLabel}</span>
      </div>
    </Link>
  )
}
```

### 3.3 Exemplos de KPIs por Tipo de SaaS

| SaaS Type | KPI 1 | KPI 2 | KPI 3 | KPI 4 |
|-----------|-------|-------|-------|-------|
| B2B SaaS | MRR | Active Users | Churn Rate | NPS |
| E-commerce | Revenue | Orders | AOV | Conversion |
| Marketing | Leads | CAC | Pipeline | ROI |
| Support | Tickets Open | Avg Resolution | CSAT | First Response |
| Dev Tools | API Calls | Error Rate | Latency (p99) | Active Projects |

---

## 4. Data Visualization

### 4.1 Escolha do Chart Certo

| Dados | Chart Tipo | Quando |
|-------|-----------|--------|
| Tendência temporal | Line chart | Mostrar evolução ao longo do tempo |
| Composição | Donut/Pie | Mostrar partes de um todo (max 5 fatias) |
| Comparação | Bar chart | Comparar categorias |
| Distribuição | Histogram | Mostrar frequência de valores |
| Correlação | Scatter plot | Relação entre 2 variáveis |
| Volume + tendência | Area chart | Tendência com ênfase em magnitude |
| Ranking | Horizontal bar | Top N itens |
| Geográfico | Map/Choropleth | Dados por localização |

### 4.2 Anti-Padrões de Visualização

| Anti-Padrão | Problema | Solução |
|-------------|----------|---------|
| Pie chart com 10+ fatias | Impossível de ler | Top 5 + "Outros" |
| 3D charts | Distorce perspectiva | Sempre 2D |
| Dual Y-axis | Confuso, manipulável | Dois charts separados |
| Truncar eixo Y | Exagera diferenças | Começar de 0 ou indicar claramente |
| Cores aleatórias | Sem significado | Paleta consistente com significado |
| Sem labels | Dados ilegíveis | Sempre incluir labels/tooltips |

---

## 5. Filtros e Date Pickers

### 5.1 Padrões de Filtro

| Padrão | Quando | UX |
|--------|--------|-----|
| **Date range picker** | Toda seção de analytics | Presets: Hoje, 7d, 30d, 90d, Custom |
| **Segmento/Grupo** | Quando dados são segmentáveis | Dropdown multi-select |
| **Search + Filter** | Tabelas com muitos dados | Search bar + filter chips |
| **Saved views** | Filtros complexos usados repetidamente | Salvar combinação de filtros |

### 5.2 Date Presets Obrigatórios

| Preset | Período | Comparação |
|--------|---------|-----------|
| Hoje | Dia atual | vs Ontem |
| 7 dias | Últimos 7 dias | vs 7 dias anteriores |
| 30 dias | Últimos 30 dias | vs 30 dias anteriores |
| Este mês | Mês atual | vs Mês passado |
| Este trimestre | Trimestre atual | vs Trimestre passado |
| Personalizado | Data inicial → Data final | vs Período equivalente |

---

## 6. Real-Time Updates

### 6.1 Quando Usar

| Dado | Real-time? | Método |
|------|-----------|--------|
| Alertas/Status | ✅ Sim | WebSocket |
| KPIs principais | ✅ Sim | Polling 30s ou WebSocket |
| Charts de tendência | 🟡 Depende | Polling 1-5 min |
| Tabelas detalhadas | ❌ Não (sob demanda) | Refresh button |
| Relatórios | ❌ Não | Gerado por demanda |

### 6.2 Indicador de Real-Time

```tsx
function RealTimeIndicator() {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      <span>Atualizado em tempo real</span>
    </div>
  )
}
```

---

## 7. Dashboard Responsivo

### 7.1 Breakpoints e Layout

| Viewport | Layout | Adaptações |
|----------|--------|------------|
| Desktop (>1280px) | Sidebar + Grid 4 colunas | Layout completo |
| Tablet (768-1280px) | Sidebar colapsada + Grid 2 colunas | KPIs em 2x2 |
| Mobile (<768px) | Sidebar → Bottom nav + Stack | KPIs em carrossel |

### 7.2 Grid Responsivo

```tsx
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <KPICard label="Receita" value={mrr} />
  <KPICard label="Usuários" value={users} />
  <KPICard label="Churn" value={churn} />
  <KPICard label="NPS" value={nps} />
</div>

<div className="mt-6 grid gap-6 lg:grid-cols-7">
  <div className="lg:col-span-4">
    <RevenueChart />
  </div>
  <div className="lg:col-span-3">
    <RecentActivity />
  </div>
</div>
```

---

## 8. Mobile Dashboard Patterns

### 8.1 Adaptações Chave

| Desktop | Mobile |
|---------|--------|
| 4 KPIs lado a lado | Carrossel swipeable ou 2x2 grid |
| Charts largos | Charts full-width com scroll horizontal |
| Tabelas detalhadas | Cards empilhados ou lista simplificada |
| Sidebar navegação | Bottom tab bar (5 itens max) |
| Filters inline | Filters em bottom sheet |
| Multiple actions | FAB (floating action button) para ação principal |

### 8.2 Bottom Tab Bar Mobile

```tsx
function MobileTabBar({ items }) {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/80 backdrop-blur-lg lg:hidden">
      <div className="flex items-center justify-around py-2">
        {items.slice(0, 5).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

---

## 9. Quick Actions e Command Palette

### 9.1 Command Palette (⌘K)

Essential para power users em dashboards complexos:

| Feature | Descrição |
|---------|-----------|
| Busca global | Buscar em todas as entidades |
| Navegação rápida | Ir para qualquer página |
| Ações | Criar projeto, convidar membro, etc. |
| Atalhos | Exibir atalhos de teclado |
| Recent | Itens acessados recentemente |

### 9.2 Implementação Básica

```tsx
function CommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Buscar ou executar comando..." />
      <CommandList>
        <CommandGroup heading="Navegação">
          <CommandItem onSelect={() => navigate('/dashboard')}>
            <LayoutDashboardIcon className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          {/* ... more items */}
        </CommandGroup>
        <CommandGroup heading="Ações">
          <CommandItem onSelect={createProject}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Criar novo projeto
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

---

## Fontes e Referências

- Nielsen Norman Group — Dashboard Design Guidelines 2025
- Stephen Few — Information Dashboard Design (3rd ed.)
- Luke Wroblewski — Mobile First (atualizado 2025)
- Mixpanel — Dashboard Engagement Benchmarks 2025
- Figma — Dashboard UI Kit Best Practices 2025
