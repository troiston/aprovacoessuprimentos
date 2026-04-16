---
name: market
description: Fase 1c VibeCoding — pesquisa de mercado orientada a decisão. Mapeia concorrentes, OSS/licenças e build-vs-buy para calibrar o escopo do PRD e definir o gate de entrada para /design.
---

# Skill: /market — Pesquisa de Mercado e Referências (Fase 1c)

## Papel
Technical Product Strategist.
Você olha para fora antes do time construir qualquer coisa.
Seu trabalho não é gerar um relatório — é produzir decisões: o que comprar, o que construir, o que descartar e onde o design precisa ganhar do mercado.

**Nota de posicionamento:** no VibeCoding, `/market` ocorre após o `/prd` para calibrar o escopo já definido com evidência de mercado real. Isso é uma exceção consciente ao fluxo padrão MRD → PRD. A validação inicial de mercado já foi feita em `/validate`.

---

## Quando usar
- Após `/prd` aprovado, antes de `/design`
- Quando o time precisar confirmar OSS disponíveis, concorrência real e build-vs-buy
- Quando houver risco de construir commodity já resolvida pelo mercado

---

## Pré-condições
1. Ler `docs/00_VALIDATION.md`
2. Ler `docs/01_PRD.md`
3. Ler `docs/DOCS_INDEX.md`, se existir

Extrair:
- proposta de valor e ICP
- features Must/Should do PRD
- restrições técnicas
- riscos herdados

Se `docs/01_PRD.md` não existir → pare e informe bloqueio.

Se `docs/04_MARKET_AND_REFERENCES.md` já existir, declarar o modo:
`NEW` / `REVIEW` / `REFINE`

---

## Diagnóstico obrigatório antes da pesquisa
Exibir no chat:
- produto e problema central
- ICP e JTBD
- features centrais do PRD
- hipóteses de diferenciação
- perguntas que esta pesquisa precisa responder:
  - o mercado já resolve isso bem?
  - o que os usuários odeiam nas alternativas?
  - o que podemos comprar/reutilizar?
  - há risco legal nas opções OSS?
  - o escopo do PRD está bem calibrado?
  - onde o design precisa se diferenciar?

---

## Frentes obrigatórias de pesquisa
Use Web Search para cada frente. Não baseie a pesquisa em memória de treinamento.

### Frente 1 — OSS e ferramentas
Pesquisar bibliotecas, frameworks, APIs e SaaS relevantes.

Para cada opção, registrar:
- problema que resolve
- maturidade e atividade recente
- licença
- compatibilidade comercial
- lock-in
- custo
- decisão: `APROVAR` / `CONDICIONAL` / `EVITAR`

**Regras de licença:**
- `MIT / Apache 2.0` → permissivas, seguras para produto comercial
- `GPL / AGPL` → copyleft, infectam código derivado; exigem alerta explícito
- `Apache 2.0 + GPL v2` → incompatíveis; não misturar
- `Apache 2.0 + GPL v3` → compatíveis

### Frente 2 — Concorrentes e alternativas
Mapear diretos, indiretos e substitutos.

Para cada alternativa relevante, registrar:
- proposta de valor
- pricing
- forças
- gaps/reclamações
- lock-in
- diferencial possível para nosso produto

### Frente 3 — Voz do mercado
Pesquisar em Reddit, HackerNews, fóruns, G2/Capterra, Product Hunt, issues GitHub.

Registrar:
- reclamações recorrentes
- recursos mais elogiados
- linguagem dos usuários
- workarounds atuais

### Frente 4 — Build vs Buy
Para cada componente relevante do PRD, classificar:

- `CORE IP` → construir (é o diferencial competitivo)
- `COMMODITY` → comprar/reutilizar (não diferencia)
- `HYBRID` → comprar a plataforma, construir a camada de inteligência/customização

Regra prática:
- Build quando a capacidade define vantagem competitiva real
- Buy quando resolve problema padrão com SaaS maduro
- Hybrid quando o core é commodity mas o workflow e integrações são únicos

Para cada decisão, registrar custo inicial, risco de lock-in e impacto em time-to-market.

---

## Estrutura obrigatória de `docs/04_MARKET_AND_REFERENCES.md`

```markdown
# 04_MARKET_AND_REFERENCES.md — Pesquisa de Mercado e Referências

## 1. Resumo Executivo
Principais conclusões e recomendação para a próxima fase em até 5 linhas.

## 2. Contexto do PRD
- proposta de valor, ICP, JTBD, features centrais, escopo inicial

## 3. OSS e Ferramentas
| Opção | Categoria | Licença | Maturidade | Lock-in | Custo | Decisão |
|---|---|---|---|---|---|---|

## 4. Concorrência e Alternativas
| Alternativa | Tipo | Proposta de Valor | Preço | Forças | Gaps |
|---|---|---|---|---|---|

## 5. Matriz de Capacidades
Comparar as principais features do PRD com concorrentes relevantes e workaround manual.

## 6. Voz do Mercado
- reclamações recorrentes
- recursos mais elogiados
- workarounds atuais
- sinais de saturação
- fontes

## 7. Build vs Buy
| Componente | Decisão | Opção recomendada | Lock-in | Impacto no prazo |
|---|---|---|---|---|

## 8. Decisões Consolidadas
- stack aprovada
- stack vetada
- escopo confirmado
- escopo descartado
- oportunidades de diferenciação de UX/produto
- riscos de licença/compliance

## 9. Próximos Passos
Diretrizes concretas para `/design`.
```

---

## Restrições fixas
- Não inventar concorrentes ou ferramentas
- Não usar stars como critério único de maturidade
- Não aprovar OSS sem verificar licença
- Não recomendar build custom de commodity sem justificativa
- Não avançar sem decisão explícita de build-vs-buy

---

## Checklist antes de encerrar
- [ ] Pesquisa Web usada para cada frente
- [ ] OSS avaliados com licença, lock-in e decisão
- [ ] Concorrentes diretos, indiretos e substitutos mapeados
- [ ] Comunidade pesquisada
- [ ] Build vs Buy decidido por componente
- [ ] Escopo do PRD reavaliado
- [ ] Oportunidade de diferenciação de UX registrada
- [ ] `docs/04_MARKET_AND_REFERENCES.md` gerado
- [ ] `docs/DOCS_INDEX.md` atualizado

---

## Próximo passo
`/design` com escopo, stack e diretrizes de diferenciação claramente definidos.
