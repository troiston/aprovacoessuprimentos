---
name: prd
description: Fase 1 VibeCoding — lê a validação aprovada, pesquisa a base de código e gera um PRD lean, priorizado e com critérios de aceitação testáveis em docs/01_PRD.md.
---

# Skill: /prd — Product Requirements Document (Fase 1)

## Papel
Staff Product Manager + Tech Lead.
Você transforma uma hipótese validada em um escopo funcional lean, tecnicamente viável e testável.
Regra central: **só entra no PRD o que guia uma decisão de desenvolvimento.**

---

## Pré-condições
1. Ler `docs/00_VALIDATION.md` integralmente.
2. Ler `docs/DOCS_INDEX.md`, se existir.
3. Se `docs/01_PRD.md` já existir, declarar modo:
   - `NEW` — novo produto/feature
   - `REVIEW` — atualizar requisitos existentes
   - `REFINE` — ajustar escopo, prioridades ou critérios

Se `docs/00_VALIDATION.md` não existir → pare e informe bloqueio.
Se veredito for `NO-GO` → alerte o risco antes de prosseguir.

---

## Diagnóstico obrigatório (Hard Stop antes do PRD)

### 1. Extração da validação
Exibir no chat:
- problema central e dor principal
- ICP e JTBD
- score e veredito
- hipóteses ainda não verificadas
- riscos herdados

### 2. Pesquisa do repositório
Verificar e mapear:
- stack e framework detectados
- banco de dados e camada de dados
- padrões de autenticação, API, estado e formulários
- entidades/modelos já existentes
- componentes e design system
- convenções e estrutura de pastas

Checar quando existirem:
`package.json`, `tsconfig.json`, `next.config.*`,
`prisma/`, `drizzle/`, `src/db/`, `models/`,
`src/components/`, `app/`, `pages/`, `docs/`

### 3. Resumo de impacto técnico
Antes de gerar o PRD, apresentar:
- entidades/tabelas novas ou alteradas
- APIs ou integrações novas
- riscos de compatibilidade com a stack atual
- dependências externas necessárias
- draft de escopo: Must / Should / Could / Won't
- no máximo 3 perguntas em aberto

**Pare aqui. Aguarde aprovação explícita antes de gerar `docs/01_PRD.md`.**

---

## Regras técnicas fixas
- Não sugerir stack incompatível com o repo sem justificativa
- Não inventar entidades que conflitem com modelos existentes
- `Must Have` limitado ao que sustenta o fluxo principal do MVP
- Critérios de aceitação no formato `Given / When / Then`
- User stories válidas pelo critério INVEST: independente, negociável, valiosa, estimável, pequena, testável
- Rastreabilidade obrigatória: dor validada → requisito → critério de aceite → métrica

---

## Estrutura obrigatória de `docs/01_PRD.md`

```markdown
# 01_PRD.md — Product Requirements Document

## 1. Resumo Executivo
O que se constrói, por que agora, para quem e qual resultado esperado.
(5 linhas máximo)

## 2. Problema e Contexto
- Dor principal
- Frequência e intensidade
- Alternativa atual do usuário
- Gatilho para adotar nova solução

## 3. Objetivos e Não Objetivos
**Objetivos:** (o que o produto fará)
**Não Objetivos:** (o que está fora do escopo desta fase — extremamente importante)

## 4. Personas e JTBD
- Persona principal: quem é, contexto, objetivo
- Job-to-be-done: o que ele contrata esse produto para fazer
- Gatilho de uso: o que provoca a abertura do produto
- Critério de abandono: o que faria ele "demitir" o produto

## 5. Jornada Principal
Descrever o fluxo de maior valor do MVP em passos numerados.
Incluir: ponto de entrada → decisões → resultado esperado → edge cases críticos.

## 6. Requisitos Funcionais (MoSCoW)
### Must Have
- **RF-01:** [descrição] — valor para o usuário: [...]

### Should Have
- **RF-0x:** [descrição]

### Could Have
- **RF-0x:** [descrição]

### Won't Have (nesta fase)
- [descrição explícita do que está fora]

## 7. Critérios de Aceitação
Para cada Must e Should, usar Given/When/Then:

**RF-01 — [nome]**
- *Given* [contexto/pré-condição]
- *When* [ação do usuário ou sistema]
- *Then* [resultado esperado]
- *Error case:* [o que acontece quando falha]

## 8. Requisitos Não Funcionais
- Performance: (ex: carregamento < 2s em 3G)
- Segurança: (ex: rate limit, sanitização, autenticação)
- Acessibilidade: (ex: WCAG AA, teclado, SR)
- Responsividade: (ex: mobile-first, 320px mínimo)
- Observabilidade: (ex: logs de erro, alertas críticos)

## 9. Impacto Técnico
- Entidades/tabelas criadas ou alteradas
- Endpoints novos
- Integrações externas
- Dependências de outros módulos ou serviços

## 10. Métricas de Sucesso
- Leading (sinal de uso): (ex: 60% completam o fluxo principal na semana 1)
- Lagging (resultado): (ex: redução de 20% em suporte manual em 30 dias)
- Sinal de falha: (ex: taxa de abandono > 40% no passo X)

## 11. Riscos e Mitigações
| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|

## 12. Rollout
- Fase 1: [escopo mínimo para go-live]
- Fase 2: [expansão]
- Feature flags: sim/não e quais
- Plano de feedback pós-lançamento

## 13. Questões em Aberto
Dúvidas que seguem para `/spec` ou precisam de validação adicional.
```

---

## Entregas obrigatórias
1. Diagnóstico com resumo de impacto técnico
2. `docs/01_PRD.md` completo
3. `docs/DOCS_INDEX.md` atualizado
4. Mapa de rastreabilidade: dor → RF → critério → métrica

---

## Checklist antes de encerrar
- [ ] `docs/00_VALIDATION.md` lido e contexto extraído
- [ ] Repositório pesquisado e stack mapeada
- [ ] Diagnóstico de impacto apresentado e aprovado
- [ ] Escopo MoSCoW definido com `Won't Have` explícito
- [ ] `Must Have` limitado ao MVP essencial
- [ ] Critérios de aceite em `Given/When/Then`
- [ ] Requisitos não funcionais cobertos
- [ ] Impacto técnico compatível com a stack detectada
- [ ] Métricas leading e lagging definidas
- [ ] `docs/01_PRD.md` completo
- [ ] `docs/DOCS_INDEX.md` atualizado

---

## Próximo passo
`/design` — Design System
`/spec` — Especificação Técnica
