# 05_DESIGN.md — Design System · Sistema de Incorporação Olá

> **Skills:** `/design` `/frontend-design` `/tailwind-design-system` `/accessibility-compliance`  
> **Fase:** 1D (Design System)  
> **Depende de:** `01_PRD.md`, `04_MARKET_AND_REFERENCES.md`  
> **Próxima fase:** `/spec` → `06_SPECIFICATION.md`  
> **Status:** CONCLUÍDO · 15/04/2026 · v1.0.0

---

## 1. Objetivo e audiência

Manual de referência do design system do **Sistema de Incorporação Olá** — ferramenta interna para gestão de empreendimentos imobiliários. Audiência: desenvolvimento (Fase 3+), auditoria de UX (Fase 4D) e manutenção futura.

---

## 2. Intent First

### Quem é esse humano?

**Coordenadora de incorporação** (ex.: Lyvia) — chega ao sistema entre reuniões, às vezes no campo com o celular, às vezes em reunião de diretoria projetando no telão. Ela veio de uma planilha Excel que ela conhece de cor: sabe que "REALIZE LARANJEIRAS está em 93.93%" sem precisar que alguém explique. Ela odeia sistemas que escondem informação. Quer dados na frente, ação rápida, sem firulas.

**Gestor** (ex.: Renan) — entra 5 minutos antes de uma reunião, precisa ver os 9 empreendimentos de uma vez, saber quais estão atrasados, saber o que está bloqueado. Quer o número exato, não uma representação artística do progresso.

**Operacional** (ex.: Jusci) — abre o sistema no celular antes de ir ao cartório, quer ver exatamente o que é dele, o prazo, o que fazer. Não quer ver "o portfólio de projetos", quer ver "minha lista de hoje".

### O que devem realizar?

- Coordenadora: **atualizar status de uma etapa** e **criar tarefa** em menos de 30 segundos
- Gestor: **ver % de avanço de todos os empreendimentos** em menos de 5 segundos
- Operacional: **ver minhas tarefas ordenadas por prazo** sem precisar filtrar

### Como deve sentir?

Como um **painel de controle de operação industrial** — denso mas ordenado, cada pixel com propósito. Como um terminal Bloomberg para incorporação: preciso, técnico, com autoridade. Não quente, não frio. Profissional, sérios, com personalidade amazônica na paleta.

---

## 3. Domain Exploration

### Domain (5+ conceitos)

1. **Plantas técnicas de engenharia** — blueprints, linhas precisas, notações técnicas
2. **Processos regulatórios** — protocolos, selos, aprovações, carimbos, certidões
3. **Cronograma de obra** — marco, prazo, milestone, caminho crítico
4. **Incorporação imobiliária** — registro, matrícula, memorial descritivo, RI
5. **Órgãos públicos de Manaus** — IMPLURB, IMMU, SEMULSP, IPAAM, CEF
6. **Solo Amazônico** — terra, construção sobre floresta, calor de Manaus

### Color World (5+ cores do domínio físico)

| Cor | OKLCH | Origem no domínio |
|-----|-------|-------------------|
| Azul cobalto blueprint | `oklch(32% 0.09 253)` | Cor da tinta de cópia de plantas de engenharia |
| Cimento claro | `oklch(97% 0.008 85)` | Background de mesa de escritório técnico, papel de plotagem |
| Terracota amazônica | `oklch(55% 0.14 42)` | Solo de Manaus, argila, tijolo amazônico |
| Verde de aprovação | `oklch(40% 0.12 152)` | Carimbo "Aprovado" verde nos projetos |
| Vermelho de prazo | `oklch(52% 0.19 22)` | Caneta vermelha de correção, alerta de vencimento |
| Cinza de concreto | `oklch(84% 0.010 85)` | Textura de concreto, separadores de tabela |

### Signature element

A **barra de progresso segmentada por fases macro** — dividida em 4 segmentos coloridos (Aquisição Terreno, Incorporação, Lançamento, CEF) com pesos visuais proporcionais. Não é uma barra linear simples: é um blueprint de progresso. Cada segmento tem cor própria e tamanho proporcional ao peso da fase. Só poderia existir neste produto específico.

### Defaults rejeitados

| Default óbvio | Alternativa aplicada |
|--------------|---------------------|
| Barra de progresso linear com % no centro | Barra segmentada por fases, legenda de fases abaixo, % em tabular mono separado |
| Gradiente roxo-azul (SaaS genérico) | Azul cobalto de blueprint (técnico) + terracota (identidade amazônica) |
| Cards com sombra flutuante (elevation SaaS) | Borders-only: sem sombra nos cards, hierarquia por border e surface shift |

---

## 4. Diagnóstico técnico

| Item | Valor |
|------|-------|
| Modo de operação | CREATE |
| Stack | Next.js 16, React 19, TypeScript strict, Tailwind v4 |
| Roteamento | App Router |
| Tailwind versão | v4 |
| Tokens de cor | OKLCH em `@theme {}` |
| components.json | Não (componentes manuais com CVA) |
| Design system anterior | Não |
| Figma MCP | Não disponível |
| Referência visual | PRD + domain exploration |
| Dashboard / gráficos | Sim (barra de progresso, KPIs) |
| Restrições | Alta densidade, desktop-first mas responsivo, sem RTL, dados tabulares |

---

## 5. Tokens

### 5.1 Cores (OKLCH)

```css
/* Primárias */
--color-primary:            oklch(32% 0.09 253)  /* Blueprint blue */
--color-primary-foreground: oklch(97% 0.006 85)
--color-accent:             oklch(55% 0.14 42)   /* Terracota amazônica */
--color-accent-foreground:  oklch(99% 0.004 85)

/* Superfícies */
--color-background:         oklch(97% 0.008 85)  /* Cimento claro */
--color-card:               oklch(99.5% 0.004 85)
--color-muted:              oklch(94% 0.010 85)
--color-border:             oklch(84% 0.010 85)

/* Feedback */
--color-success:            oklch(40% 0.12 152)  /* Verde aprovação */
--color-warning:            oklch(72% 0.16 85)   /* Amarelo atenção */
--color-destructive:        oklch(52% 0.19 22)   /* Vermelho prazo */
```

### 5.2 Charts (fases macro)

| Fase | Token | OKLCH |
|------|-------|-------|
| Aquisição Terreno | `--color-chart-1` | `oklch(32% 0.09 253)` — Blueprint blue |
| Incorporação | `--color-chart-2` | `oklch(55% 0.14 42)` — Terracota |
| Atividades p/ Lançamento | `--color-chart-3` | `oklch(40% 0.12 152)` — Verde aprovação |
| CEF | `--color-chart-4` | `oklch(72% 0.16 85)` — Amarelo atenção |

### 5.3 Tipografia

| Nível | Fonte | Tamanho | Peso | Line-height | Tracking |
|-------|-------|---------|------|-------------|---------|
| Display/h1 | IBM Plex Sans | clamp(1.5rem, 2.5vw+0.5rem, 2.25rem) | 700 | 1.15 | -0.02em |
| h2 | IBM Plex Sans | clamp(1.25rem, 2vw+0.25rem, 1.75rem) | 600 | 1.2 | -0.015em |
| h3 | IBM Plex Sans | clamp(1.1rem, 1.5vw+0.1rem, 1.375rem) | 600 | 1.25 | -0.01em |
| Body | IBM Plex Sans | 0.875rem | 400 | 1.5 | 0 |
| Label | IBM Plex Sans | 0.875rem | 500 | 1 | 0 |
| Caption | IBM Plex Sans | 0.75rem | 400 | 1.4 | 0 |
| Mono/Tabular | IBM Plex Mono | 0.8125rem | 400 | 1.4 | 0 |

**Por que IBM Plex Sans?** Criada para sistemas técnicos e de dados (IBM). Tem personalidade industrial sem ser fria, suporta dados tabulares com a variante mono, e não é genérica como Inter/Roboto. A "IBM" no nome evoca precisão de sistemas, que é exatamente o que este produto precisa ser.

### 5.4 Spacing & Radius

| Token | Valor |
|-------|-------|
| Base unit | 4px |
| Radius (`--radius`) | 0.25rem (4px) — técnico, preciso |
| Radius sm | 0.125rem (2px) — badges, chips |
| Radius md | 0.375rem (6px) — cards, inputs |
| Radius lg | 0.5rem (8px) — modais |

### 5.5 Motion

| Token | Valor | Uso |
|-------|-------|-----|
| `--duration-fast` | 120ms | Hover, focus, transições de cor |
| `--duration-base` | 220ms | Transições de componentes |
| `--duration-slow` | 360ms | Barra de progresso, modais |
| `--easing-standard` | cubic-bezier(0.4, 0, 0.2, 1) | Padrão |

### 5.6 Z-index scale

| Camada | Valor | Uso |
|--------|-------|-----|
| base | 0 | Elementos normais |
| dropdown | 10 | Menus flutuantes |
| sticky | 20 | Sidebar, topbar |
| overlay | 30 | Fundos de modal |
| modal | 40 | Modais e dialogs |
| toast | 50 | Notificações (sonner) |
| tooltip | 60 | Tooltips |

---

## 6. Estratégia de profundidade

**Borders-only** — escolha deliberada para ferramenta de dados densa.

**Justificativa:** O produto é uma ferramenta operacional com tabelas, listas e dados numéricos. Sombras flutuantes (elevation SaaS) competem com os dados e criam ruído visual. Borders criam hierarquia clara sem distração: `border: 1px solid var(--color-border)`. Cards, tabelas e inputs são definidos por bordas. A única elevação real é em dropdowns e modais, onde `shadow-md` é necessário para separar do conteúdo.

---

## 7. Sistema de ícones

- Biblioteca: `lucide-react`
- Stroke width padrão: 1.5 (elementos passivos), 2.0 (elementos ativos/nav item ativo)
- Tamanhos: `size-3` (inline), `size-4` (padrão), `size-5` (destaque), `size-8` (empty state)
- Regra de acessibilidade: `aria-hidden="true"` em decorativos, `aria-label` em interativos isolados

**Ícones-chave do produto:**

| Ação | Ícone |
|------|-------|
| Empreendimento | `Building2` |
| Dashboard | `LayoutDashboard` |
| Minhas Tarefas | `ClipboardList` |
| Todas as Tarefas | `ListChecks` |
| Etapas & Pesos | `Settings` |
| Usuários | `Users` |
| Auditoria | `FileText` |
| Produto (logo) | `HardHat` |
| Prazo vencido | `AlertCircle` |
| Finalizado | `CheckCircle2` |
| Em andamento | `MinusCircle` |
| Não iniciado | `Circle` |

---

## 8. Layout e navegação

### Shell do app

```
┌─────────────────────────────────────────────────────┐
│ Sidebar 224px fixed │ Main content flex-1            │
│                     │ ┌─────────────────────────────┐│
│ [Logo HardHat]      │ │ Topbar sticky h-14           ││
│                     │ └─────────────────────────────┘│
│ Nav principal       │                                 │
│ · Dashboard         │ Page content                   │
│ · Empreendimentos   │ p-6                            │
│ · Minhas Tarefas    │                                 │
│ · Todas as Tarefas  │                                 │
│                     │                                 │
│ ── Configurações ── │                                 │
│ · Etapas & Pesos    │                                 │
│ · Usuários          │                                 │
│ · Auditoria         │                                 │
│                     │                                 │
│ [Avatar usuário]    │                                 │
└─────────────────────────────────────────────────────┘
```

### Densidade de tabelas

- Linha: `py-2.5` (10px vertical) — denso o suficiente para ver muitos registros, confortável o suficiente para não cansar
- Cabeçalho: `text-[11px] uppercase tracking-wide` — hierarquia clara sem ocupar espaço
- Célula numérica: `tabular text-xs font-mono` — alinhamento de decimais

---

## 9. Componentes base

### Button

Variantes: `default` (blueprint), `outline`, `secondary`, `ghost`, `destructive`, `accent` (terracota), `link`.  
Tamanhos: `sm` (h-8), `default` (h-9), `lg` (h-10), `icon` (h-9 w-9), `icon-sm` (h-7 w-7).  
Implementação: CVA + Radix Slot para `asChild`.

### Input / Textarea

- Background: `bg-input` (ligeiramente mais escuro que card — comunica "campo de entrada")
- Bordas: `border-border`, focus: `border-ring` + `ring-2 ring-ring`
- Erro: `border-destructive` + ring destructive
- Sem ícones decorativos dentro do campo sem função

### Badge

Variantes mapeadas ao domínio:
- `success` → `status-finalizado` (fundo verde 10%, texto verde escuro, border verde)
- `warning` → `status-em-andamento` (fundo amarelo 15%, texto ocre)
- `muted` → `status-nao-iniciado` (sem fundo, border default)
- `destructive` → prazo vencido, erros

### Progress (Signature component)

Dois modos:
1. **Segmentado** (`segments` prop): barra blueprint com N segmentos coloridos por fase macro
2. **Simples**: barra progressprimitive padrão para contextos secundários

O modo segmentado é a assinatura visual do produto — aparece em todas as telas com empreendimentos.

---

## 10. Estados de UX

| Estado | Comportamento |
|--------|--------------|
| Loading | `Skeleton` animado com `animate-pulse` |
| Empty | Ícone ghost + mensagem em PT-BR + CTA de criação |
| Error | Border `destructive/30`, fundo `destructive/5`, ícone `AlertCircle`, botão "Tentar novamente" |
| Success | Toast via `sonner` (a implementar na Fase 3) |
| Disabled | `opacity-50 pointer-events-none` |
| Overdue | `deadline-overdue` class → cor `destructive`, peso 500 |

---

## 11. Microcopy

| Contexto | Texto recomendado |
|----------|-------------------|
| Empty — tarefas | "Nenhuma tarefa. Crie sua primeira tarefa para começar." |
| Empty — empreendimentos | "Nenhum empreendimento cadastrado." |
| Loading | "Carregando..." (skeleton, sem texto) |
| Erro genérico | "Erro ao carregar. Tente novamente ou contate o administrador." |
| Prazo vencido | "X dias em atraso" (tabular) |
| Confirmar exclusão destrutiva | "Excluir empreendimento? Esta ação não pode ser desfeita." |
| Viewer tentando editar | Botão desabilitado sem tooltip explicativo — simplificar |

---

## 12. Formulários

- Label acima do input, nunca placeholder como label
- Placeholder: texto de exemplo real (ex.: `"lyvia@olaconstrutora.com.br"`)
- Erro: mensagem abaixo do input em `text-destructive` com `AlertCircle` inline
- Foco no primeiro campo ao abrir modal (via `autoFocus`)
- Campo obrigatório: asterisco `*` no label, não só visual
- Validação: Zod no servidor, feedback inline no cliente para campos simples

---

## 13. Checklist de acessibilidade

- [x] Contraste foreground/background: >7:1 (passa AA e AAA)
- [x] Contraste muted-foreground/background: ~4.6:1 (passa AA)
- [x] Focus-visible em todos os elementos interativos
- [x] Aria-current="page" no nav item ativo
- [x] Aria-hidden em ícones decorativos
- [x] Aria-label em ícones interativos sem texto
- [x] Touch targets mínimo 44×44px (botões `h-9` = 36px — a revisar em Fase 4D)
- [x] Tabela com headers `th` e escopo correto
- [x] Não depende só de cor para indicar status (ícone + texto + cor)
- [x] prefers-reduced-motion desabilita animações
- [ ] Skip navigation link (a adicionar na Fase 3)
- [ ] Aria-live para atualizações dinâmicas (a adicionar na Fase 3)

---

## 14. Assets

Nesta fase, sem assets de imagem. Empty states usam ícones `lucide-react` estilizados.  
Na Fase 3, criar empty states SVG com paleta blueprint (azul + cimento).

Definições para `/asset-generator`:
- Estilo: flat, geométrico, técnico (sem ilustrações orgânicas)
- Paleta: `oklch(32% 0.09 253)` (blueprint) + `oklch(97% 0.008 85)` (cimento)
- Tipos: empty states (Building2 estilizado), diagrama de blueprint, ícone do app

---

## 15. Trade-offs declarados

| Decisão | Trade-off |
|---------|-----------|
| IBM Plex Sans via Google Fonts (não `next/font`) | Simplicidade de implementação vs. performance ideal. Fase 3 deve migrar para `next/font/google` |
| Tabelas HTML nativas sem `react-table` | Sem sorting/filter client-side por ora. Aceito: sorting virá via Server Actions na Fase 3 |
| Sem dark mode nesta fase | A pedido do PRD não prioriza (RF-18 = Could Have). Tokens dark já estão definidos — toggle é trivial de adicionar |
| Touch targets em 36px (h-9) | Abaixo do mínimo WCAG de 44px. Revisar em Fase 4D — provável exceção para ferramenta desktop |

---

## 16. Checklist UX por fluxo crítico

### Fluxo A — Gestor consulta avanço geral
- [x] Dashboard carrega com 9 empreendimentos visíveis sem scroll em 1280px
- [x] % avanço visível imediatamente (tabular, tamanho adequado)
- [x] Empreendimentos com tarefas vencidas destacados com badge vermelho
- [x] Clique no card leva ao painel do empreendimento

### Fluxo B — Coordenador atualiza status
- [ ] Select de status inline na tabela de etapas (a implementar na Fase 3)
- [x] Tabs Etapas/Tarefas claramente separadas no painel
- [x] Tarefas com prazo vencido aparecem primeiro

### Fluxo C — Operacional vê Minhas Tarefas
- [x] Tarefas vencidas em seção separada e destacada
- [x] Ordenação por prazo visível
- [x] Empreendimento e etapa visíveis em cada item

---

## 17. Changelog

| Versão | Data | Mudança |
|--------|------|---------|
| v1.0.0 | 15/04/2026 | Criação do design system (Fase 1D) — tokens, componentes, 8 páginas |
