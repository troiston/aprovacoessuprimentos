---
id: doc-accessibility-guide
title: Guia Completo de Acessibilidade
version: 2.0
last_updated: 2026-04-07
category: ux-ui
priority: critical
related:
  - docs/web-excellence/foundations/03_COLOR_SYSTEM.md
  - docs/web-excellence/foundations/05_ICONOGRAPHY.md
  - docs/web-excellence/ux-ui/03_MOTION_GUIDELINES.md
  - docs/web-excellence/ux-ui/05_RESPONSIVE_STRATEGY.md
  - .cursor/rules/quality/accessibility.mdc
---

# Guia Completo de Acessibilidade — WCAG 2.2 AA

## 1. Princípios POUR

WCAG (Web Content Accessibility Guidelines) 2.2 organiza-se em 4 princípios:

| Princípio | Significado | Pergunta-chave |
|---|---|---|
| **P**erceptível | Conteúdo pode ser percebido por todos os sentidos disponíveis | O usuário consegue **ver/ouvir/sentir** o conteúdo? |
| **O**perável | Interface pode ser operada por qualquer método de input | O usuário consegue **interagir** com todos os elementos? |
| **U**nderstandable (Compreensível) | Conteúdo e interface são compreensíveis | O usuário **entende** o que está acontecendo? |
| **R**obusto | Conteúdo funciona com tecnologias assistivas atuais e futuras | O conteúdo funciona com **screen readers e outros AT**? |

## 2. Requisitos AA Essenciais

### 2.1 Perceptível

| Critério | ID | Requisito | Nível |
|---|---|---|---|
| Texto alternativo | 1.1.1 | Toda imagem significativa tem alt text | A |
| Legendas de vídeo | 1.2.2 | Vídeos com áudio têm legendas | A |
| Áudio-descrição | 1.2.5 | Vídeos com informação visual-only têm descrição | AA |
| Contraste (texto) | 1.4.3 | 4.5:1 normal, 3:1 grande (≥24px/18.67px bold) | AA |
| Contraste (não-texto) | 1.4.11 | 3:1 para UI components e gráficos | AA |
| Resize texto | 1.4.4 | Funcional com zoom 200% | AA |
| Reflow | 1.4.10 | Sem scroll horizontal em 320px width | AA |
| Espaçamento de texto | 1.4.12 | Funcional com line-height 1.5, letter-spacing 0.12em, word-spacing 0.16em | AA |
| Content on hover/focus | 1.4.13 | Tooltips/popovers dismissíveis, hoverable, persistentes | AA |

### 2.2 Operável

| Critério | ID | Requisito | Nível |
|---|---|---|---|
| Teclado | 2.1.1 | Toda funcionalidade acessível via teclado | A |
| Sem armadilha de foco | 2.1.2 | Foco nunca fica preso em um elemento | A |
| Skip links | 2.4.1 | Link "Pular para conteúdo" como primeiro elemento focável | A |
| Títulos de página | 2.4.2 | Cada página tem `<title>` descritivo e único | A |
| Ordem de foco | 2.4.3 | Tab order faz sentido lógico | A |
| Propósito de link | 2.4.4 | Texto do link indica destino (nunca "clique aqui") | A |
| Múltiplas formas | 2.4.5 | Mais de uma forma de encontrar páginas (nav + busca + sitemap) | AA |
| Headings descritivos | 2.4.6 | Headings descrevem conteúdo da seção | AA |
| Foco visível | 2.4.7 | Indicador de foco claramente visível | AA |
| Focus not obscured | 2.4.11 | Elemento focado não é totalmente coberto por sticky/fixed elements | AA |
| Target size | 2.5.8 | Área de toque mínima 24×24px (44×44px recomendado) | AA |
| Dragging | 2.5.7 | Funcionalidade drag tem alternativa sem drag | AA |

### 2.3 Compreensível

| Critério | ID | Requisito | Nível |
|---|---|---|---|
| Idioma da página | 3.1.1 | `<html lang="pt-BR">` | A |
| Idioma de partes | 3.1.2 | `lang` em trechos de outro idioma | AA |
| On focus | 3.2.1 | Foco não causa mudança de contexto | A |
| On input | 3.2.2 | Mudar input não causa mudança inesperada de contexto | A |
| Navegação consistente | 3.2.3 | Navegação na mesma posição em todas as páginas | AA |
| Identificação consistente | 3.2.4 | Componentes com mesma função têm mesma aparência | AA |
| Identificação de erro | 3.3.1 | Erros de input são identificados e descritos | A |
| Labels | 3.3.2 | Inputs têm labels visíveis | A |
| Sugestão de correção | 3.3.3 | Erros incluem sugestão de correção quando possível | AA |
| Prevenção de erro | 3.3.4 | Ações legais/financeiras são reversíveis, verificáveis ou confirmáveis | AA |
| Autenticação acessível | 3.3.8 | Login não depende de teste cognitivo (copiar código, resolver puzzle) | AA |
| Redundant entry | 3.3.7 | Não pedir mesma informação duas vezes no mesmo fluxo | A |

### 2.4 Robusto

| Critério | ID | Requisito | Nível |
|---|---|---|---|
| Parsing (removido em 2.2) | 4.1.1 | — | Obsoleto |
| Name, Role, Value | 4.1.2 | Componentes customizados expõem nome, papel e estado para AT | A |
| Status messages | 4.1.3 | Mensagens de status anunciadas sem mudar foco | AA |

## 3. Contraste

### 3.1 Requisitos

| Elemento | Razão Mínima | Nível | Exceções |
|---|---|---|---|
| Texto normal (< 24px) | 4.5:1 | AA | — |
| Texto grande (≥ 24px ou ≥ 18.67px bold) | 3:1 | AA | — |
| UI não-texto (ícones, bordas de input, focus ring) | 3:1 | AA | — |
| Texto desabilitado | Sem requisito | — | Elemento inativo |
| Logos e texto decorativo | Sem requisito | — | Não informacional |
| Placeholder text | 4.5:1 (se for o único label) | — | Se houver label visível, requisito relaxado |

### 3.2 Verificação com OKLCH

Usando diferença de Lightness como proxy rápido:

```
ΔL ≥ 0.50 → ~4.5:1 (AA texto normal) ✅
ΔL ≥ 0.40 → ~3:1 (AA texto grande / UI) ✅
ΔL < 0.40 → Insuficiente ❌
```

### 3.3 Padrões de Contraste Seguros

```css
/* Light mode — sempre safe */
--text-primary: oklch(0.18 0.006 260);     /* ΔL = 0.805 contra white (>7:1) */
--text-secondary: oklch(0.45 0.012 260);   /* ΔL = 0.535 contra white (>4.5:1) */

/* Dark mode — sempre safe */
--text-primary: oklch(0.93 0.004 260);     /* ΔL = 0.81 contra bg 0.12 */
--text-secondary: oklch(0.68 0.008 260);   /* ΔL = 0.56 contra bg 0.12 */
```

## 4. Navegação por Teclado

### 4.1 Teclas Esperadas

| Tecla | Ação |
|---|---|
| `Tab` | Avança para próximo elemento focável |
| `Shift+Tab` | Volta para elemento focável anterior |
| `Enter` | Ativa botão/link |
| `Space` | Ativa botão, toggle checkbox, seleciona opção |
| `Escape` | Fecha modal/dropdown/popover |
| `Arrow Keys` | Navega dentro de componentes (tabs, menus, radio groups) |
| `Home/End` | Primeiro/último item em listas |

### 4.2 Focus Indicators

```css
/* Focus ring padrão — visível em todas as cores de fundo */
:focus-visible {
  outline: 2px solid var(--color-interactive);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Remove outline para mouse, mantém para teclado */
:focus:not(:focus-visible) {
  outline: none;
}

/* Focus ring com alto contraste para dark mode */
.dark :focus-visible {
  outline-color: oklch(0.75 0.16 250);
}
```

### 4.3 Focus Trapping em Modais

```tsx
'use client';

import { useEffect, useRef } from 'react';

export function useFocusTrap(isOpen: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !ref.current) return;

    const element = ref.current;
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // close modal
        return;
      }
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return ref;
}
```

## 5. ARIA Roles e Properties

### 5.1 Regras de ARIA

1. **Primeira regra:** Se um elemento HTML nativo faz o que você precisa, use-o em vez de ARIA
2. **Segunda regra:** Não mude a semântica nativa (não adicione `role="button"` a um `<a>`)
3. **Terceira regra:** Toda interação ARIA deve funcionar com teclado
4. **Quarta regra:** Não esconda elementos focáveis com `aria-hidden="true"`
5. **Quinta regra:** Elementos interativos devem ter nomes acessíveis

### 5.2 Roles Comuns

| Role | Uso | Elemento Nativo Equivalente |
|---|---|---|
| `button` | Ação sem navegação | `<button>` |
| `link` | Navegação | `<a href>` |
| `dialog` | Modal/diálogo | `<dialog>` |
| `alert` | Mensagem urgente | — |
| `alertdialog` | Diálogo que requer ação | — |
| `tab`, `tablist`, `tabpanel` | Interface de tabs | — |
| `menu`, `menuitem` | Menu de ações | — |
| `navigation` | Bloco de navegação | `<nav>` |
| `main` | Conteúdo principal | `<main>` |
| `complementary` | Sidebar | `<aside>` |
| `contentinfo` | Footer | `<footer>` |
| `banner` | Header | `<header>` |
| `search` | Busca | `<search>` (HTML 5.2+) |

### 5.3 Properties Essenciais

| Property | Uso | Exemplo |
|---|---|---|
| `aria-label` | Nome acessível quando não há texto visível | `<button aria-label="Fechar modal">` |
| `aria-labelledby` | Nome acessível referenciando outro elemento | `<div aria-labelledby="title-id">` |
| `aria-describedby` | Descrição adicional | `<input aria-describedby="help-text-id">` |
| `aria-expanded` | Estado expandido/colapsado | `<button aria-expanded="false">` |
| `aria-hidden` | Esconder de screen readers | `<svg aria-hidden="true">` |
| `aria-live` | Região que atualiza dinamicamente | `<div aria-live="polite">` |
| `aria-current` | Item atual em navegação | `<a aria-current="page">` |
| `aria-invalid` | Campo com erro | `<input aria-invalid="true">` |
| `aria-required` | Campo obrigatório | `<input aria-required="true">` |
| `aria-selected` | Item selecionado em lista | `<li aria-selected="true">` |
| `aria-disabled` | Elemento desabilitado (mantém focável) | `<button aria-disabled="true">` |

### 5.4 Live Regions

```tsx
{/* Polite: anuncia quando screen reader não está ocupado */}
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

{/* Assertive: interrompe e anuncia imediatamente */}
<div aria-live="assertive" role="alert">
  {errorMessage}
</div>
```

## 6. Screen Reader Testing

### 6.1 Combinações de Teste

| Plataforma | Screen Reader | Browser | Nota |
|---|---|---|---|
| macOS | VoiceOver | Safari | Primário para Mac |
| Windows | NVDA (gratuito) | Firefox ou Chrome | Primário para Windows |
| Windows | JAWS | Chrome | Mais usado em empresas |
| iOS | VoiceOver | Safari | Primário para mobile |
| Android | TalkBack | Chrome | Secundário para mobile |

### 6.2 O Que Testar

- [ ] Página tem heading structure lógica (h1→h2→h3, sem pular níveis)?
- [ ] Todos os landmarks presentes (main, nav, header, footer)?
- [ ] Imagens significativas têm alt text descritivo?
- [ ] Forms têm labels associados e erros anunciados?
- [ ] Modais trap focus e anunciam ao abrir?
- [ ] Botões e links têm nomes acessíveis?
- [ ] Estado de componentes interativos é anunciado (expanded, selected, checked)?
- [ ] Conteúdo dinâmico usa aria-live?
- [ ] Skip link funciona?
- [ ] Tabela de dados tem headers associados?

## 7. Falhas Comuns

### 7.1 WebAIM Million Report (2026)

O estudo anual do WebAIM que analisa as top 1 milhão de páginas web detectou (dados de fevereiro 2026):

| Falha | Porcentagem de Sites | Critério WCAG |
|---|---|---|
| Baixo contraste de texto | 81.0% | 1.4.3 |
| Imagens sem alt text | 55.7% | 1.1.1 |
| Links vazios (sem nome acessível) | 48.6% | 2.4.4 |
| Inputs sem label | 46.1% | 1.3.1, 3.3.2 |
| Botões vazios (sem nome acessível) | 28.2% | 4.1.2 |
| Idioma da página ausente | 17.1% | 3.1.1 |

**94.8% dos sites têm pelo menos 1 falha WCAG detectável automaticamente.** E ferramentas automatizadas detectam apenas ~30-40% dos problemas — o restante requer teste manual.

### 7.2 Anti-Patterns Comuns

| Anti-Pattern | Problema | Solução |
|---|---|---|
| `<div onclick>` | Não focável, não anunciado | Usar `<button>` |
| Placeholder como label | Desaparece ao digitar | Label visível + placeholder |
| Cor como único indicador | Invisível para daltônicos | Cor + ícone + texto |
| Carousel auto-play | Inacessível, distratório | Pause, controles, `aria-live="off"` |
| Infinite scroll sem alternativa | Impossível navegar ao footer | Paginação + "Carregar mais" |
| Custom select sem ARIA | Screen reader não entende | Usar Radix/HeadlessUI |
| Tab order por tabindex > 0 | Ordem imprevisível | Nunca usar tabindex > 0 |
| `outline: none` global | Mata navegação por teclado | Usar `:focus-visible` |

## 8. Requisitos Legais

### 8.1 Brasil

- **LBI (Lei 13.146/2015):** Sites de empresas brasileiras devem ser acessíveis. Fiscalização em crescimento.
- **eMAG 3.1:** Modelo de Acessibilidade em Governo Eletrônico — obrigatório para sites governamentais.

### 8.2 Internacional

| Legislação | Região | Requisito | Prazo |
|---|---|---|---|
| ADA (Americans with Disabilities Act) | EUA | Sites são "locais de acomodação pública" | Em vigor |
| EAA (European Accessibility Act) | UE | Todos os serviços digitais — WCAG 2.1 AA mínimo | **28 junho 2025** (em vigor) |
| AODA | Canadá (Ontario) | WCAG 2.0 AA | Em vigor |
| Equality Act 2010 | Reino Unido | Sites devem ser acessíveis | Em vigor |
| EN 301 549 | UE | Standard técnico vinculado ao EAA | Em vigor |

### 8.3 Risco

- Processos por ADA nos EUA: ~4.600 em 2025, crescimento de 12% ao ano
- EAA pode multar até €100.000 por violação contínua em alguns estados-membros
- Custo médio de remediation post-lawsuit: 5-10x mais caro que build correto

## 9. Metodologia de Teste

### 9.1 Pirâmide de Teste

```
              ┌─────────┐
              │ Manual   │  ← 30% do esforço, encontra 60-70% dos problemas
              │ + Screen │
              │  Reader  │
            ┌─┴─────────┴─┐
            │   Semi-auto  │  ← Keyboard testing, color contrast tools
            │              │
          ┌─┴──────────────┴─┐
          │   Automatizado    │  ← axe-core, lighthouse, pa11y
          │   (CI/CD)        │     Encontra ~30-40% dos problemas
          └──────────────────┘
```

### 9.2 Ferramentas Automatizadas

| Ferramenta | Tipo | Integração |
|---|---|---|
| axe-core / @axe-core/react | Runtime + CI | Jest, Playwright, Storybook |
| Lighthouse Accessibility | Audit | Chrome DevTools, CI |
| pa11y | CLI + CI | GitHub Actions |
| eslint-plugin-jsx-a11y | Linting | ESLint config |
| Storybook a11y addon | Component-level | Storybook |

### 9.3 Implementação axe-core em Testes

```tsx
// playwright test
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage accessibility', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

### 9.4 Priorização de Remediação

| Prioridade | Critério | Ação |
|---|---|---|
| P0 - Bloqueador | Usuário não consegue completar tarefa | Fix imediato |
| P1 - Crítico | Funcionalidade significativa inacessível | Fix na sprint atual |
| P2 - Importante | Experiência degradada mas funcional | Fix na próxima sprint |
| P3 - Menor | Inconveniência, não impede uso | Backlog |

## 10. Checklist Rápido

- [ ] `<html lang="pt-BR">` definido?
- [ ] Skip link como primeiro elemento focável?
- [ ] Landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`?
- [ ] Heading hierarchy (h1→h2→h3) sem pular níveis?
- [ ] Todas imagens com `alt` (vazio para decorativas)?
- [ ] Contraste 4.5:1 texto normal, 3:1 texto grande?
- [ ] Contraste 3:1 para UI não-texto?
- [ ] Focus visible em todos elementos interativos?
- [ ] Tab order lógico (sem tabindex > 0)?
- [ ] Inputs com `<label>` associado?
- [ ] Erros de form identificados e descritos?
- [ ] Botões icon-only com `aria-label`?
- [ ] Modais com focus trap e fechamento por Escape?
- [ ] `prefers-reduced-motion` respeitado?
- [ ] Funcional com zoom 200%?
- [ ] Sem scroll horizontal em 320px?
- [ ] Touch targets ≥ 44×44px?
- [ ] axe-core zero violations?
