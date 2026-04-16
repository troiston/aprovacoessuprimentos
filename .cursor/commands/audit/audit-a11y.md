---
id: cmd-audit-a11y
title: Auditoria de Acessibilidade
version: 2.0
last_updated: 2026-04-07
category: audit
agent: 06-qa-auditor
skills:
  - audit-a11y
  - fix-aria-labels
  - fix-contrast
  - build-skip-navigation
---

# `/audit-a11y`

Executa auditoria completa de acessibilidade contra os critérios WCAG 2.2 AA em todas as páginas e componentes do projeto. Verifica contraste de cores, navegação por teclado, gestão de foco, ARIA, touch targets, e reduced motion. Gera relatório de conformidade com instruções de correção.

---

## Parâmetros

Nenhum parâmetro necessário — audita todo o projeto automaticamente.

---

## Passo a Passo de Execução

### Passo 1 — Verificar Contraste de Cores

Analisar `globals.css` e todos os componentes para combinações de cor:

| Verificação | Critério WCAG | Severidade |
|------------|--------------|-----------|
| Texto normal (< 18px) | Ratio ≥ 4.5:1 contra background | 🔴 Crítico (1.4.3 AA) |
| Texto grande (≥ 18px bold ou ≥ 24px) | Ratio ≥ 3:1 contra background | 🔴 Crítico (1.4.3 AA) |
| Elementos UI interativos | Ratio ≥ 3:1 contra adjacente | 🔴 Crítico (1.4.11 AA) |
| Focus indicator | Ratio ≥ 3:1 contra fundo | 🔴 Crítico (2.4.7 AA) |
| Placeholder text | Ratio ≥ 4.5:1 (recomendado, não obrigatório) | 🟡 Major |
| Texto sobre imagem | Overlay com contraste garantido | 🔴 Crítico (1.4.3 AA) |
| Dark mode | Mesmos critérios aplicados ao tema escuro | 🔴 Crítico |

**Como verificar com OKLCH:**
```
Ratio = (L_mais_claro + 0.05) / (L_mais_escuro + 0.05)
L (lightness em OKLCH): 0 = preto, 1 = branco
```

Combinações comuns a verificar:
- `foreground` sobre `background`
- `muted-foreground` sobre `background`
- `muted-foreground` sobre `muted`
- `primary-500` sobre `background` (links)
- Texto branco sobre `primary-500` (botões)
- `destructive` sobre `background` (erros)

### Passo 2 — Verificar Navegação por Teclado

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| Tab order lógico | Sequência de foco segue ordem visual | 🔴 Crítico (2.4.3 AA) |
| Todos interativos focáveis | Botões, links, inputs recebem foco | 🔴 Crítico (2.1.1 AA) |
| Sem armadilhas de foco | Tab nunca fica preso em componente | 🔴 Crítico (2.1.2 AA) |
| Enter/Space em botões | Botões ativam com ambos | 🔴 Crítico (2.1.1 AA) |
| Escape fecha modais/menus | Escape sempre fecha overlays | 🟡 Major (2.1.1 AA) |
| Arrow keys em menus | Setas navegam entre items de menu | 🟡 Major |
| Skip navigation | Link "Pular para conteúdo" funcional | 🔴 Crítico (2.4.1 AA) |

**Verificar o skip navigation:**
```tsx
// Deve existir como primeiro filho do <body>
<a
  href="#main"
  className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background"
>
  Pular para o conteúdo principal
</a>
```

### Passo 3 — Verificar Gestão de Foco

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| Focus visible | Indicador de foco visível em TODOS os interativos | 🔴 Crítico (2.4.7 AA) |
| Focus em modais | Foco move para modal ao abrir | 🔴 Crítico (2.4.3 AA) |
| Focus trap em modais | Tab circula dentro do modal aberto | 🔴 Crítico (2.1.2 AA) |
| Retorno de foco | Foco volta ao trigger ao fechar modal | 🟡 Major (2.4.3 AA) |
| Sem outline:none | Nenhum `outline: none` sem alternativa visível | 🔴 Crítico (2.4.7 AA) |

**Estilo de focus correto:**
```css
:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}
```

### Passo 4 — Verificar ARIA

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| ARIA labels em interativos | Botões de ícone têm `aria-label` | 🔴 Crítico (4.1.2 AA) |
| `aria-expanded` em toggles | Menus e accordions usam `aria-expanded` | 🔴 Crítico (4.1.2 AA) |
| `aria-controls` em toggles | Toggle referencia ID do conteúdo controlado | 🟡 Major |
| `role` quando necessário | Elementos custom têm role explícito | 🔴 Crítico (4.1.2 AA) |
| `aria-hidden` em decorativos | Ícones decorativos com `aria-hidden="true"` | 🟡 Major |
| `aria-labelledby` em sections | Sections referenciadas pelo heading | 🟡 Major |
| `aria-live` para atualizações | Conteúdo dinâmico usa `aria-live="polite"` | 🟡 Major |
| `aria-describedby` em erros | Erros de form referenciados pelo input | 🔴 Crítico |
| Sem ARIA redundante | Não usar `role="button"` em `<button>` | 🟢 Minor |

### Passo 5 — Verificar Formulários

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| Labels explícitos | Todo `<input>` tem `<label htmlFor>` associado | 🔴 Crítico (1.3.1 AA) |
| Mensagens de erro | Erros visíveis E acessíveis com `aria-describedby` | 🔴 Crítico (3.3.1 AA) |
| Autocomplete | Campos com `autoComplete` correto | 🟡 Major (1.3.5 AA) |
| Required indicado | Campos obrigatórios com indicação visual + `aria-required` | 🟡 Major (3.3.2 AA) |
| Error prevention | Formulários destrutivos pedem confirmação | 🟡 Major (3.3.4 AA) |
| Submit com estado | Botão mostra loading com `aria-busy` | 🟡 Major |

### Passo 6 — Verificar Touch Targets

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| Touch targets ≥ 44×44px | Todos os interativos em mobile | 🔴 Crítico (2.5.8 AA) |
| Espaçamento entre targets | ≥ 8px entre targets adjacentes | 🟡 Major |
| Links em texto | Área clicável inclui padding suficiente | 🟡 Major |

**Implementação padrão:**
```tsx
<button className="min-h-11 min-w-11 ...">
```

### Passo 7 — Verificar Reduced Motion

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| `prefers-reduced-motion` | Animações CSS desabilitadas quando ativado | 🔴 Crítico (2.3.3 AAA, best practice) |
| Framer Motion respeitando | Animações FM desabilitadas ou reduzidas | 🟡 Major |
| Vídeos autoplay | Pausáveis ou respeitando reduced motion | 🟡 Major |
| Parallax removido | Efeitos de parallax desabilitados | 🟡 Major |

**Verificar no globals.css:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Passo 8 — Verificar Semântica

| Verificação | Critério | Severidade |
|------------|---------|-----------|
| Landmarks presentes | `<header>`, `<main>`, `<nav>`, `<footer>` | 🔴 Crítico (1.3.1 AA) |
| `<main>` único | Exatamente 1 `<main>` por página | 🔴 Crítico |
| `lang` no `<html>` | `lang="pt-BR"` definido | 🔴 Crítico (3.1.1 AA) |
| Listas semânticas | Itens de navegação em `<ul>/<li>` | 🟡 Major |
| `<table>` para dados | Dados tabulares em `<table>` com `<th>` | 🟡 Major |
| Sem div clicável | Nenhum `<div onClick>` — usar `<button>` | 🔴 Crítico |

---

## Formato do Relatório

```markdown
# Relatório de Acessibilidade WCAG 2.2 AA
**Data:** 2026-04-07
**Projeto:** [nome]
**Nível alvo:** AA

## Resumo
| Categoria | ✅ Pass | ❌ Fail | ⚠️ Warning |
|-----------|--------|--------|------------|
| Contraste | X | X | X |
| Teclado | X | X | X |
| Foco | X | X | X |
| ARIA | X | X | X |
| Formulários | X | X | X |
| Touch Targets | X | X | X |
| Reduced Motion | X | X | X |
| Semântica | X | X | X |
| **TOTAL** | **X** | **X** | **X** |

## Score de Conformidade: [N]/100
## Nível atingido: [A / AA / Parcial AA]

## Violations
### Críticos (🔴) — Bloqueia conformidade AA
1. **WCAG [critério]** — [componente/página]
   - **Problema:** [descrição]
   - **Impacto:** [quem é afetado]
   - **Correção:**
   ```tsx
   // código corrigido
   ```

### Major (🟡)
...

### Minor (🟢)
...

## Componentes Auditados
| Componente | Contraste | Teclado | ARIA | Touch | Status |
|-----------|-----------|---------|------|-------|--------|
| Navbar | ✅ | ✅ | ⚠️ | ✅ | Parcial |
| Hero | ✅ | N/A | ✅ | N/A | ✅ |
| Footer | ✅ | ✅ | ✅ | ✅ | ✅ |
```

---

## Saída Esperada

```
✅ Auditoria de Acessibilidade concluída
├── WCAG 2.2 nível AA avaliado
├── [N] componentes auditados
├── [N] verificações executadas
├── Score: [N]/100
├── 🔴 [N] violations críticos
├── 🟡 [N] violations major
├── 🟢 [N] violations minor
├── Correções com código fornecidas
└── Nível de conformidade: [A/AA/Parcial]
```

---

## Exemplo de Uso

```
/audit-a11y
```
