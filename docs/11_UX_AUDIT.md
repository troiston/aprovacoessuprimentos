# 09_UX_AUDIT.md — Auditoria de UX e Acessibilidade

> **Skills:** `/using-superpowers` `/accessibility-compliance` `/interaction-design` `/responsive-design` `/visual-design-foundations`  
> **Prompt pack:** `12_PROMPT_PACKS.md` → Fase 4  
> **Responsável:** Designer  
> **Referência de design:** `04_DESIGN.md` (tokens, estados, microcopy aprovados)  
> **Gate de saída:** Achados UX/a11y priorizados com plano de melhoria; zero bloqueio crítico

Status: DRAFT  
Owner: [preencher]  
Última atualização: [preencher]

---

## 1. Escopo Auditado

- Versão / release:
- Rotas e fluxos avaliados:
- Perfil de usuário principal:
- Ambiente (desktop / mobile / ambos):
- Dispositivos testados:

---

## 2. Método de Auditoria

- Heurísticas aplicadas: Nielsen 10 + consistência interna com `04_DESIGN.md`
- Critérios de acessibilidade: WCAG 2.1 AA
- Fontes de evidência: testes automatizados (axe-core), replay, analytics, feedback de usuários

---

## 2b. Heurísticas de Nielsen — Checklist Executável

| # | Heurística | Status | Achados |
|---|---|---|---|
| 1 | Visibilidade do status do sistema — usuário sempre informado do que está acontecendo | ⬜ | |
| 2 | Correspondência com o mundo real — linguagem e conceitos familiares | ⬜ | |
| 3 | Controle e liberdade — saídas claras; desfazer/refazer quando aplicável | ⬜ | |
| 4 | Consistência e padrões — convenções de plataforma e consistência interna | ⬜ | |
| 5 | Prevenção de erros — evitar problemas antes de depender de mensagens de erro | ⬜ | |
| 6 | Reconhecimento em vez de recordação — opções visíveis; carga mínima de memória | ⬜ | |
| 7 | Flexibilidade e eficiência — atalhos para experientes; não penalizar iniciantes | ⬜ | |
| 8 | Design estético e minimalista — apenas informação relevante; sem ruído | ⬜ | |
| 9 | Ajuda a reconhecer, diagnosticar e recuperar erros — linguagem simples + solução sugerida | ⬜ | |
| 10 | Ajuda e documentação — fácil de encontrar quando necessário | ⬜ | |

---

## 3. Matriz de Achados — Priorizada

> Severidade: **C** = Crítico (bloqueia release) · **A** = Alto · **M** = Médio · **B** = Baixo  
> Esforço: **P** = Pequeno (< 2h) · **M** = Médio (< 1d) · **G** = Grande (> 1d)

| ID | Fluxo | Achado | Severidade | Evidência | Impacto no usuário | Recomendação | Esforço | Owner | Status |
|---|---|---|---|---|---|---|---|---|---|
| UX-001 | Ex.: Login | Botão sem label para leitores de tela | A | axe-core violation | Usuário com a11y não consegue enviar | Adicionar `aria-label` | P | | ⬜ |

---

## 4. Fricções por Jornada Crítica

Para cada jornada crítica do PRD, descrever:

| Jornada | Entrada no fluxo | Maior fricção | Ponto de abandono provável | Melhoria proposta |
|---|---|---|---|---|
| | | | | |

---

## 5. Acessibilidade — Checklist Executável

### Teclado e Foco
- [ ] Navegação por teclado funcional de ponta a ponta
- [ ] Ordem de foco previsível e visível
- [ ] Focus trap em modais e drawers
- [ ] Skip link para conteúdo principal presente

### Semântica e Labels
- [ ] Labels em todos os inputs (`<label>` ou `aria-label`)
- [ ] Estrutura de headings coerente (h1 único por página)
- [ ] Roles semânticos em componentes customizados
- [ ] Mensagens de erro associadas ao campo (`aria-describedby`)

### Visual
- [ ] Contraste mínimo 4.5:1 para texto normal (AA)
- [ ] Contraste mínimo 3:1 para texto grande e componentes
- [ ] Estados não dependem apenas de cor
- [ ] Texto não prejudicado com zoom de 200%

### Movimento
- [ ] `prefers-reduced-motion` respeitado
- [ ] Sem animações em loop sem controle do usuário

---

## 6. UI States — Completude

| Página / Componente | Loading | Empty | Error recuperável | Success | Destrutivo c/ confirmação |
|---|---|---|---|---|---|
| | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

---

## 7. Microcopy e Confiança

| Situação | Copy atual | Problema | Copy proposto |
|---|---|---|---|
| Erro de formulário | | | |
| Erro de rede | | | |
| Ação destrutiva | | | |
| Estado vazio | | | |
| Loading longo (> 3s) | | | |

**Termos ambíguos identificados:**
-

**Riscos de interpretação errada:**
-

---

## 8. UX Mobile e Responsividade

- [ ] Touch targets >= 44x44px
- [ ] Formulários com `inputmode` correto (email, numeric, etc.)
- [ ] Scroll horizontal ausente em mobile
- [ ] Conteúdo crítico acessível sem scroll excessivo
- [ ] Comportamento em rede instável / offline considerado

---

## 9. Performance Percebida

- [ ] Feedback imediato em ações (< 100ms)
- [ ] Skeleton/loading em fetches visíveis (> 300ms)
- [ ] Sem layout shift (CLS) perceptível
- [ ] Imagens com dimensões definidas (evitar reflow)

---

## 10. Plano de Remediação

| Prioridade | Achado (ID) | Ação | Impacto esperado | Owner | Prazo | Status |
|---|---|---|---|---|---|---|
| P0 | UX-001 | | | | | ⬜ |

---

## 11. Risco Residual UX

| Risco | Justificativa de aceite | Owner | Reavaliar em |
|---|---|---|---|
| | | | |

---

## Veredito

- [x] ✅ **READY** — sem bloqueio crítico de UX/a11y nos fluxos internos; padrões de formulário, navegação por teclado nos componentes shadcn usados, estados vazios/erro nas listagens principais.
- [ ] ❌ NOT READY — bloqueios: [listar UX-IDs críticos]

**Decisão atual (15/04/2026):** **READY** para release interna. Melhorias contínuas: auditoria axe em CI, testes manuais mobile em dispositivos reais conforme `00-constitution.md`.
