---
id: skill-audit-a11y
title: "Audit Accessibility"
agent: 06-qa-auditor
version: 1.0
category: accessibility
priority: critical
requires:
  - rule: 00-constitution
provides:
  - checklist WCAG 2.2 AA completo
  - setup de testes automatizados com axe-core
  - protocolo de teste manual (teclado, leitor de tela, zoom, contraste)
used_by:
  - agent: 06-qa-auditor
  - command: /audit-full
---

# Auditoria de Acessibilidade — WCAG 2.2 AA

## Setup de Testes Automatizados

### axe-core com Playwright

```bash
npm install -D @axe-core/playwright
```

```typescript
// e2e/a11y.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const pages = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
  { name: 'Pricing', path: '/pricing' },
]

for (const page of pages) {
  test(`${page.name} não deve ter violações de acessibilidade`, async ({ page: p }) => {
    await p.goto(page.path)
    await p.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page: p })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze()

    const violations = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.length,
      help: v.helpUrl,
    }))

    if (violations.length > 0) {
      console.table(violations)
    }

    expect(results.violations).toEqual([])
  })
}
```

### jest-axe para Testes Unitários

```bash
npm install -D jest-axe @types/jest-axe
```

```typescript
// __tests__/components/button.test.tsx
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Button } from '@/components/ui/button'

expect.extend(toHaveNoViolations)

describe('Button Acessibilidade', () => {
  it('não possui violações axe', async () => {
    const { container } = render(
      <Button onClick={() => {}}>Salvar</Button>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('botão de ícone com aria-label', async () => {
    const { container } = render(
      <Button variant="icon" aria-label="Fechar modal">
        <XIcon />
      </Button>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('botão desabilitado acessível', async () => {
    const { container } = render(
      <Button disabled aria-disabled="true">
        Aguarde...
      </Button>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

## Checklist WCAG 2.2 AA Completo

### 1. Perceptível

#### 1.1 Alternativas de Texto
- [ ] Todas imagens informativas têm `alt` descritivo
- [ ] Imagens decorativas têm `alt=""`
- [ ] Ícones SVG têm `aria-label` ou `aria-hidden="true"`
- [ ] Inputs de arquivo descrevem formatos aceitos
- [ ] CAPTCHAs têm alternativa acessível

#### 1.2 Mídia Temporal
- [ ] Vídeos têm legendas (captions)
- [ ] Vídeos têm audiodescrição (se aplicável)
- [ ] Players de áudio/vídeo têm controles acessíveis

#### 1.3 Adaptável
- [ ] HTML semântico (h1-h6 hierárquicos, landmarks)
- [ ] Ordem de leitura lógica (DOM order = visual order)
- [ ] Informações não transmitidas apenas por cor
- [ ] Layout funciona em orientação portrait e landscape
- [ ] `autocomplete` nos campos de dados pessoais

#### 1.4 Distinguível
- [ ] Contraste texto normal: ≥ 4.5:1
- [ ] Contraste texto grande (≥18pt/14pt bold): ≥ 3:1
- [ ] Contraste elementos UI: ≥ 3:1
- [ ] Texto pode ser redimensionado até 200% sem perda
- [ ] Sem imagens de texto (exceto logos)
- [ ] Reflow: conteúdo funciona em 320px sem scroll horizontal
- [ ] Espaçamento de texto ajustável sem perda de conteúdo
- [ ] Conteúdo hover/focus pode ser fechado (Esc), persistente, e navegável

### 2. Operável

#### 2.1 Teclado
- [ ] Tudo funciona com teclado (Tab, Enter, Space, Esc, Arrows)
- [ ] Sem armadilhas de teclado (focus trap apenas em modais)
- [ ] Atalhos de teclado (se houver) podem ser desativados

#### 2.2 Tempo Suficiente
- [ ] Timeouts podem ser estendidos ou desativados
- [ ] Animações podem ser pausadas (prefers-reduced-motion)
- [ ] Auto-refresh pode ser desativado

#### 2.3 Convulsões
- [ ] Nenhum conteúdo pisca mais de 3x por segundo
- [ ] Animações respeitam `prefers-reduced-motion`

#### 2.4 Navegável
- [ ] Skip navigation link funcional
- [ ] Páginas têm `<title>` descritivo e único
- [ ] Ordem de foco lógica e previsível
- [ ] Links têm texto descritivo (sem "clique aqui")
- [ ] Múltiplas formas de navegação (menu + busca + sitemap)
- [ ] Headings descritivos e hierárquicos
- [ ] Focus visível em todos elementos interativos

#### 2.5 Modalidades de Input
- [ ] Touch targets ≥ 24x24px (recomendado 44x44px)
- [ ] Gestos complexos têm alternativa simples
- [ ] Motion actuation (shake) tem alternativa
- [ ] Labels acessíveis correspondem ao texto visível

### 3. Compreensível

#### 3.1 Legível
- [ ] `lang` definido no `<html>` (ex: `lang="pt-BR"`)
- [ ] Mudanças de idioma marcadas com `lang` local
- [ ] Abreviações têm `<abbr title="...">`

#### 3.2 Previsível
- [ ] Foco não causa mudança de contexto
- [ ] Inputs não causam mudança de contexto inesperada
- [ ] Navegação consistente em todas as páginas
- [ ] Componentes similares identificados consistentemente

#### 3.3 Assistência de Input
- [ ] Erros identificados e descritos em texto
- [ ] Labels em todos os inputs
- [ ] Sugestões de correção para erros
- [ ] Prevenção de erros em ações críticas (confirmação)
- [ ] Ajuda contextual disponível

### 4. Robusto

#### 4.1 Compatível
- [ ] HTML válido (sem erros de parsing)
- [ ] IDs únicos no documento
- [ ] ARIA roles e properties corretos
- [ ] Status messages com `role="status"` ou `aria-live`

## Protocolo de Teste Manual

### Teste de Teclado

```
1. Desconectar o mouse
2. Tab por toda a página:
   ✓ Focus visível em CADA elemento interativo
   ✓ Ordem lógica (esquerda→direita, cima→baixo)
   ✓ Sem elementos focáveis escondidos
   ✓ Skip link funciona como primeiro Tab

3. Testar interações:
   ✓ Enter ativa links e botões
   ✓ Space ativa botões e checkboxes
   ✓ Esc fecha modais e dropdowns
   ✓ Arrows navegam em tabs, menus, sliders
   ✓ Home/End vão para primeiro/último item

4. Testar modais:
   ✓ Focus preso dentro do modal quando aberto
   ✓ Esc fecha o modal
   ✓ Focus retorna ao elemento que abriu o modal
```

### Teste com Leitor de Tela

```
VoiceOver (Mac):
  Cmd+F5 para ativar
  VO+Right/Left para navegar por elementos
  VO+U para rotor (headings, links, landmarks)

NVDA (Windows):
  Insert+Space para alternar modo
  H para próximo heading
  Tab para próximo elemento focável
  D para próximo landmark

Verificar:
  ✓ Headings anunciados com nível correto
  ✓ Landmarks identificados (nav, main, footer)
  ✓ Imagens com alt lidas corretamente
  ✓ Links descrevem destino
  ✓ Formulários com labels lidos
  ✓ Erros de formulário anunciados
  ✓ Conteúdo dinâmico (aria-live) anunciado
```

### Teste de Zoom 200%

```
1. Ctrl/Cmd + até 200%
2. Verificar:
   ✓ Sem scroll horizontal
   ✓ Texto não cortado
   ✓ Menus funcionam
   ✓ Formulários usáveis
   ✓ Imagens não quebram layout
```

### Teste de Touch Target

```
Mínimo WCAG 2.2: 24x24px
Recomendado: 44x44px

Verificar com DevTools:
  1. Inspecionar elemento
  2. Ver computed size
  3. Adicionar padding se < 44px:

  .touch-target {
    min-height: 44px;
    min-width: 44px;
    padding: 8px;
  }
```

## Priorização de Correções

```
🔴 Alto Impacto (corrigir primeiro):
  - Navegação principal inacessível por teclado
  - Formulários sem labels
  - Imagens sem alt em conteúdo principal
  - Contraste insuficiente em texto principal
  - Modal sem focus trap

🟡 Médio Impacto:
  - Skip navigation ausente
  - Headings fora de ordem hierárquica
  - Touch targets pequenos
  - aria-live ausente em conteúdo dinâmico

🟢 Baixo Impacto:
  - Lang attribute ausente em trechos multilíngue
  - Abreviações sem <abbr>
  - Autocomplete ausente em campos comuns
```

## Relatório de Auditoria — Modelo

```markdown
# Relatório de Acessibilidade — [Projeto]
Data: [data]
Auditor: [nome/AI]
Padrão: WCAG 2.2 AA

## Resumo
- Violações críticas: X
- Violações moderadas: Y
- Violações menores: Z
- Score estimado: XX/100

## Violações Encontradas

### [ID-001] Imagens sem texto alternativo
- **Impacto**: Crítico
- **WCAG**: 1.1.1 Non-text Content
- **Páginas afetadas**: /, /about
- **Elementos**: 3 imagens em cards de features
- **Correção**: Adicionar alt descritivo

### [ID-002] Contraste insuficiente
- **Impacto**: Moderado
- **WCAG**: 1.4.3 Contrast (Minimum)
- **Páginas afetadas**: todas
- **Elementos**: texto muted-foreground sobre bg branco
- **Ratio atual**: 3.2:1 (mínimo: 4.5:1)
- **Correção**: Escurecer muted-foreground de L:0.55 para L:0.45

## Próximos Passos
1. Corrigir todas violações críticas (prazo: [data])
2. Corrigir violações moderadas (prazo: [data])
3. Re-auditar com axe-core
4. Teste manual com leitor de tela
```
