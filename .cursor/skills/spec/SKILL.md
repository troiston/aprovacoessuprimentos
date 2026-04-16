---
name: spec
description: Fase 2 VibeCoding — converte PRD e Design em especificação técnica executável com ADRs, contratos TypeScript, estrutura de arquivos, abuse cases e milestones em vertical slices. Gera docs/06_SPECIFICATION.md.
---

# Skill: /spec — Especificação Técnica (Fase 2)

## Papel
Staff Software Engineer + System Architect.
Você transforma o "O Quê" do PRD e o "Como parece" do Design no "Como construir" do código.
A SPEC deve ser executável por outro agente de IA: modular, sem ambiguidade e com prova de conclusão por etapa.

---

## Pré-condições
1. Ler `docs/01_PRD.md`
2. Ler `docs/05_DESIGN.md`
3. Ler `docs/04_MARKET_AND_REFERENCES.md`, se existir
4. Inspecionar o repositório: stack, estrutura, padrões de fetch, estado, auth, forms, validação e convenções

Se `docs/01_PRD.md` não existir → pare e informe bloqueio.
Se `docs/05_DESIGN.md` não existir → pare e informe bloqueio.
Se houver lacuna crítica no PRD → no máximo 3 perguntas, depois pare.

Se `docs/06_SPECIFICATION.md` já existir, declare o modo:
- `NEW`, `REVIEW` ou `REFINE`

---

## Diagnóstico obrigatório (Hard Stop antes da SPEC)
Exibir no chat antes de escrever qualquer documento:

**Contexto técnico:**
- feature alvo
- requisitos críticos do PRD
- stack detectada
- padrões do repo a respeitar
- integrações prováveis

**Direção arquitetural proposta:**
- padrão de dados e mutação
- padrão de validação
- estratégia de estado
- estratégia de erros, loading e empty states
- estratégia de segurança

**Draft de escopo:**
- entidades/tabelas afetadas
- arquivos novos e alterados
- dependências novas
- milestones (vertical slices sugeridos)

**Pare aqui. Aguarde aprovação explícita antes de gerar `docs/06_SPECIFICATION.md`.**

---

## Regra de ouro: Vertical Slices
Organize os milestones como fatias verticais, não camadas horizontais. [web:216][web:228]
Cada milestone cobre um fluxo completo de ponta a ponta: schema → lógica → UI → teste.
Isso permite que o agente de IA produza features funcionais e testáveis a cada etapa, em vez de infraestrutura sem saída visível.

Exemplo de milestone em vertical slice:
- **Slice 1 — Autenticação:** migration de users → Server Action de login → tela de login → teste do fluxo
- **Slice 2 — Dashboard:** query de métricas → Server Component → skeleton e empty state → teste de renderização

---

## Regras de qualidade
- Não repetir o PRD; converter requisito em decisão técnica
- Não deixar `TODO` aberto; toda lacuna vira bloqueio, pergunta ou premissa explícita
- Arquivos maiores que 300–500 linhas → planejar split
- Cada ADR: apenas três campos — decisão, alternativa e porquê
- Cada fluxo crítico: critério de aceite técnico + critério de aceite de UX + abuse cases
- Milestones em vertical slices, não em camadas horizontais
- Rastreabilidade: requisito PRD → decisão técnica → arquivo → prova de conclusão

---

## Estrutura obrigatória de `docs/06_SPECIFICATION.md`

```markdown
# 06_SPECIFICATION.md — Especificação Técnica

## 1. Resumo Técnico
Objetivo, escopo, dependências e principais decisões em até 5 linhas.

## 2. Escopo e Premissas
- o que esta SPEC cobre
- o que está fora
- premissas e bloqueios

## 3. Rastreabilidade com o PRD
| Requisito PRD | Decisão técnica | Arquivos | Prova de conclusão |
|---|---|---|---|

## 4. Arquitetura
- fluxo de dados (entrada → lógica → saída)
- responsabilidades por camada
- estratégia de estado
- estratégia de erro, loading e empty state

## 5. Decisões Arquiteturais (ADRs)
Para cada decisão relevante:
- **Decisão:** [o que foi decidido]
- **Alternativa rejeitada:** [o que foi descartado]
- **Por quê:** [razão e trade-off assumido]

## 6. Modelagem de Dados
- entidades, campos, tipos, relações
- enums, índices, constraints
- impacto em migration

## 7. Contratos TypeScript
Tipos, interfaces, schemas de validação, payloads e erros esperados.

## 8. Estrutura de Arquivos
| Arquivo | Ação | Responsabilidade | Split necessário? |
|---|---|---|---|

## 9. Fluxos Críticos
Para cada fluxo sensível:
- entrada → processamento → saída → estados intermediários
- falhas esperadas
- abuse cases e mitigação

## 10. Dependências
- pacotes novos com justificativa
- variáveis de ambiente (nome, tipo, obrigatória?)
- serviços externos

## 11. Milestones (Vertical Slices)
Para cada slice:
- **Objetivo:** o que estará funcionando ao final
- **Arquivos tocados:**
- **Pré-requisito:** (o que bloqueia este slice)
- **Paralelizável com:** (o que pode rodar em paralelo)
- **Acceptance Criteria:** (fez o que devia?)
- **Definition of Done:** (está pronto para avançar?)

## 12. Qualidade e Validação
- testes unitários necessários
- testes de integração necessários
- testes E2E necessários
- verificações de acessibilidade
- verificações de segurança
- comandos de validação local

## 13. Rollback e Operação
- critérios de rollback
- feature flags, se aplicável
- sinais de falha pós-release

## 14. Questões em Aberto
Perguntas e decisões que ficam pendentes para a implementação.
```

---

## Checklist antes de encerrar
- [ ] Repositório inspecionado com stack e padrões reais
- [ ] Diagnóstico apresentado e aprovado pelo usuário
- [ ] Rastreabilidade PRD → decisão → arquivo → prova de conclusão
- [ ] ADRs com decisão, alternativa e porquê
- [ ] Modelagem e contratos TypeScript explícitos
- [ ] Arquivos com split planejado quando > 300–500 linhas
- [ ] Abuse cases cobertos por fluxo crítico
- [ ] Milestones em vertical slices com Acceptance Criteria e DoD
- [ ] `docs/06_SPECIFICATION.md` gerado
- [ ] `docs/DOCS_INDEX.md` atualizado

---

## Critério de sucesso
A SPEC só termina quando:
- qualquer desenvolvedor consegue implementar sem ambiguidade relevante;
- a ordem é em vertical slices funcionais, não camadas soltas;
- cada milestone tem prova de conclusão verificável;
- ADRs justificam as decisões, não apenas descrevem.

---

## Próximo passo
`/implement-frontend` → `/backend` → `/test-writer`
