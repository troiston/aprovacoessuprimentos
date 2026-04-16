# 04_DESIGN.md — Design System

> **Skills:** `/using-superpowers` `/design` `/frontend-design` `/design-system-patterns` `/interaction-design` `/visual-design-foundations` `/tailwind-design-system` `/accessibility-compliance` `/responsive-design`  
> **Prompt pack:** `12_PROMPT_PACKS.md` → Fase 1D  
> **Responsável:** Designer  
> **Depende de:** `02_PRD.md` + `01_MARKET_AND_REFERENCES.md`  
> **Gate de saída:** Preview de design aprovado — componentes + páginas no styleguide

Status: DRAFT  
Data: [preencher]  
Autor: [preencher]

---

## 1. Tokens

### Cores
| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | | |
| `--color-secondary` | | |
| `--color-surface` | | |
| `--color-error` | | |
| `--color-success` | | |

### Tipografia
| Token | Fonte | Tamanho | Peso | Uso |
|---|---|---|---|---|
| `--font-heading` | | | | |
| `--font-body` | | | | |
| `--font-mono` | | | | |

> ⚠️ Evitar: Inter/Space Grotesk para tudo, gradientes roxo-azul genéricos, emojis como ícones.  
> ✅ Usar: Lucide como única biblioteca de ícones; paleta coesa; fontes distintas por papel.

### Espaçamentos e Grid
| Token | Valor | Uso |
|---|---|---|
| `--spacing-xs` | | |
| `--spacing-sm` | | |
| `--spacing-md` | | |
| `--spacing-lg` | | |

---

## 2. Componentes Base

| Componente | Variantes | Estados | A11y | Preview |
|---|---|---|---|---|
| Button | primary/secondary/ghost/destructive | default/hover/focus/disabled/loading | role, aria-label | /app/styleguide |
| Input | text/password/search | default/focus/error/disabled | label, aria-describedby | /app/styleguide |
| Modal | | open/close | role=dialog, focus trap | /app/styleguide |

---

## 3. Estados de UI — Guidelines

| Estado | Obrigatório em | Comportamento esperado | Microcopy |
|---|---|---|---|
| Loading | Todo fetch/submit | Skeleton ou spinner; desabilitar ações | "Carregando..." |
| Empty | Listas e dashboards | Ilustração + CTA claro | "Nenhum item ainda. [Ação]" |
| Error | Formulários e fetches | Mensagem orientada à recuperação; não culpar o usuário | "Não foi possível salvar. Tente novamente." |
| Success | Submit e ações críticas | Feedback positivo breve; redirecionar ou atualizar | "Salvo com sucesso!" |
| Destructive | Delete, cancel, logout | Modal de confirmação obrigatório | "Tem certeza? Esta ação não pode ser desfeita." |

---

## 4. Acessibilidade (WCAG AA)

- [ ] Contraste mínimo 4.5:1 para texto normal
- [ ] Contraste mínimo 3:1 para texto grande e componentes
- [ ] Navegação por teclado funcional em todos os fluxos críticos
- [ ] Focus visível em todos os elementos interativos
- [ ] Labels em todos os inputs (`<label>` ou `aria-label`)
- [ ] Role semântico em componentes customizados
- [ ] Focus trap em modais
- [ ] Skip link para conteúdo principal

### Checklist UX/A11y por Página

| Página | Contraste | Teclado | Labels | Focus | Screen reader | Status |
|---|---|---|---|---|---|---|
| | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

---

## 5. Dark Mode

- Estratégia: [CSS variables / Tailwind dark: / next-themes]
- Tokens de cor para dark mode:
- Componentes com comportamento diferente no dark mode:

---

## 6. Motion e Animações

- [ ] Sem animações decorativas sem propósito funcional
- [ ] `prefers-reduced-motion` respeitado
- [ ] Duração padrão: transitions 150–200ms; animações 300ms
- Padrões definidos:

---

## 7. Microcopy — Padrões

| Situação | ❌ Evitar | ✅ Usar |
|---|---|---|
| Erro de formulário | "Campo inválido" | "O e-mail deve ter o formato nome@dominio.com" |
| Erro de rede | "Erro 500" | "Não conseguimos conectar. Verifique sua internet e tente novamente." |
| Ação destrutiva | "Deletar" | "Excluir permanentemente" |
| Estado vazio | "Sem dados" | "Nenhum [item] encontrado. [Ação para criar]" |

---

## 8. Responsividade

| Breakpoint | Largura | Comportamento |
|---|---|---|
| mobile | < 768px | |
| tablet | 768–1024px | |
| desktop | > 1024px | |

---

## 9. Padrões de Páginas

| Página | Layout | Componentes principais | Preview no styleguide |
|---|---|---|---|
| | | | ☐ |

---

## 10. Referência ao Styleguide

- Localização: `/app/styleguide`
- Preview de componentes: ☐ implementado
- Preview de páginas: ☐ implementado
- Aprovação do Tech Lead: ☐

---

## 11. Assets Gerados

| Asset | Tipo | Localização | Gerado com |
|---|---|---|---|
| | | `assets/` | `/asset-generator` |

---

## 12. Impacto em Segurança e UX
> Preencher mesmo quando "sem impacto" — obrigatório pelo processo.

- Segurança:
- UX:
