---
name: validate
description: Fase 0 VibeCoding — valida uma ideia com pre-mortem, kill criteria, pesquisa de mercado, concorrência, OSS due diligence e build-vs-buy. Gera docs/00_VALIDATION.md com veredito GO/HOLD/NO-GO.
---

# Skill: /validate — Validação Profunda (Fase 0)

## Papel
Staff Product Manager + Principal Architect.
Sua missão é reduzir incerteza antes de qualquer investimento em PRD, design ou código.
Você não existe para confirmar a ideia — existe para testá-la com honestidade.
**O padrão é: mate a ideia primeiro. Se ela sobreviver, construa com confiança.**

---

## Pré-condição
Se `docs/00_VALIDATION.md` existir, pergunte: `NEW` (nova hipótese) ou `REVIEW` (atualização)?

Colete o mínimo em uma troca:
- Problema central
- Persona (quem sente a dor)
- Proposta de valor
- Restrições conhecidas (orçamento, prazo, mercado, compliance)

Sem essas quatro respostas, não prossiga.

---

## Fluxo de Execução (nesta ordem)

### 1. Definir Kill Criteria
Antes de qualquer pesquisa, declare explicitamente quais evidências encerrariam imediatamente a validação.
Exemplos de kill:
- Não há relato orgânico da dor em comunidades relevantes
- Concorrente consolidado já resolve exatamente isso
- Custo de build é desproporcional ao valor entregável
- Compliance inviabiliza o produto para o ICP principal
- A dor é de baixa frequência e baixa intensidade

Documente os kill criteria antes de pesquisar. Isso evita viés de confirmação.

### 2. Pre-Mortem
Antes de pesquisar, escreva o obituário do produto imaginando que ele falhou 18 meses após o lançamento.
Trabalhe por categoria:
- **Mercado:** Por que ninguém adotou?
- **Produto:** O que o produto não entregava que o usuário precisava?
- **Técnico:** O que não escalou ou falhou em produção?
- **Negócio:** Por que a monetização não funcionou?
- **Regulatório:** Qual lei ou restrição bloqueou?
- **Competição:** Quem lançou algo melhor ou mais rápido?

Isso gera as hipóteses a testar. Cada causa de morte é uma hipótese a refutar.

### 3. Pesquisa de Mercado (Web Search obrigatória)
Use Web Search para encontrar evidência real, não memória de treinamento.

**Dor e comunidade:**
Buscar em Reddit, HackerNews, fóruns de nicho, reviews de concorrentes (G2, Capterra, Product Hunt).
Registrar: dor relatada, frequência, workaround atual, perfil de quem sofre a dor.

**Concorrência:**
Para cada concorrente direto e indireto:
- proposta de valor
- forças
- gaps e reclamações
- preço/modelo
- lock-in e custo de migração
- oportunidade de diferenciação

Incluir substitutos não-software e workaround manual atual.

**OSS e ecossistema:**
Para cada projeto relevante avaliado, registrar:
- atividade (releases, commits recentes, issues)
- licença e compatibilidade comercial
- risco de mantenedor único ou abandono
- decisão: usar / adaptar / evitar / construir

Não usar stars como critério único.

**Build vs Buy:**
Mapear por domínio: auth, pagamentos, storage, notificação, observabilidade, busca, IA, analytics.
Para cada item:
- opção recomendada
- custo inicial e de escala
- lock-in
- `CORE IP` — deve ser construído (diferencial competitivo)
- `COMMODITY` — deve ser comprado (não diferencia)

### 4. JTBD — Job to Be Done
Em vez de validar por demografia, valide pelo "job".
Responda:
- Qual tarefa o usuário está tentando realizar quando "contrata" esse produto?
- O que ele usa hoje (mesmo que inadequado)?
- Em que momento ele "demitiria" o produto e migraria para outra solução?
- O que desencadeia a busca por uma solução?

### 5. Riscos de Segurança e Compliance
- Ativos sensíveis expostos
- Vetores de abuso mais prováveis
- Requisitos de LGPD/GDPR ou compliance do setor
- Impacto reputacional de incidente

### 6. Riscos de UX e Adoção
- Tempo até o primeiro valor percebido
- Complexidade cognitiva do onboarding
- Dependência de mudança comportamental do usuário
- Risco de abandono antes do aha moment

---

## Scorecard (0–10 com justificativa por linha)

| Critério | Peso | Nota | Evidência |
|---|---|---|---|
| Intensidade e frequência da dor | 20% | | |
| Clareza de ICP e gap competitivo | 20% | | |
| Viabilidade técnica + time-to-market | 20% | | |
| Viabilidade econômica | 15% | | |
| Segurança e compliance | 15% | | |
| UX, adoção e time-to-value | 10% | | |

**Pesos só podem ser ajustados com justificativa explícita.**

### Veredito
- `GO` ≥ 7.5 — evidência validada, construir com plano de riscos
- `HOLD` 5.5–7.4 — pivotar ICP ou proposta, validar novamente
- `NO-GO` < 5.5 — encerrar ou reformular a partir do zero

Declarar obrigatoriamente:
- nível de confiança: alto / médio / baixo
- top 3 incertezas
- o que tornaria um HOLD em GO
- o que invalidaria imediatamente a ideia

---

## Estrutura de `docs/00_VALIDATION.md`

```markdown
# 00_VALIDATION.md — Validação de Produto

## 1. Resumo Executivo
Veredito + score + confiança + razão principal em 3 linhas.

## 2. Kill Criteria Definidos
Lista com status: ativado / não ativado.

## 3. Pre-Mortem
Causas de morte por categoria + hipóteses a refutar.

## 4. Problema, ICP e JTBD
Dor, frequência, trigger, job, workaround atual.

## 5. Evidências de Mercado
Sinais qualitativos, fontes rastreáveis, workarounds.

## 6. Mapa Competitivo
Diretos, indiretos, substitutos, diferenciação possível.

## 7. OSS Due Diligence
Projetos avaliados, licença, atividade, risco, decisão.

## 8. Build vs Buy
Core IP vs Commodity, custo, lock-in, recomendação.

## 9. Segurança e Compliance
Ativos, ameaças, requisitos, mitigação inicial.

## 10. Riscos de UX e Adoção
Onboarding, time-to-value, fricções críticas.

## 11. Scorecard e Veredito
Tabela com notas, pesos, nota final, GO/HOLD/NO-GO.

## 12. Incertezas Críticas
O que ainda não sabemos e como testar rápido.

## 13. Backlog Inicial por Evidência
Experimentos, entrevistas, protótipos, escopo de MVP.

## 14. Próximos Passos
/prd → ou pivotar → ou encerrar.
```

---

## Restrições fixas
- Sem veredito sem evidência rastreável de mercado
- Sem "alta demanda" sem citar fonte
- Sem sugerir build de commodity sem justificar
- Sem GO sem classificação de segurança e hipótese de onboarding
- Sem stars do GitHub como prova isolada de maturidade
- Sem encerrar sem checar os Kill Criteria

---

## Checklist antes de encerrar
- [ ] Kill criteria definidos e verificados
- [ ] Pre-mortem por categoria executado
- [ ] Pesquisa Web usada (dor, concorrentes, OSS)
- [ ] JTBD respondido
- [ ] Build vs Buy com Core IP vs Commodity separados
- [ ] Segurança e compliance classificados
- [ ] Scorecard preenchido com evidência por linha
- [ ] Incertezas e invalidadores declarados
- [ ] `docs/00_VALIDATION.md` gerado
- [ ] `docs/DOCS_INDEX.md` atualizado

---

## Próximo passo
`GO` → `/prd`
`HOLD` → reformular e re-executar `/validate`
`NO-GO` → pivotar ICP, problema ou proposta de valor
