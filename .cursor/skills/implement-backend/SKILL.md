---
name: implement-backend
description: Fase 3 VibeCoding (Backend) — implementa backend a partir de `docs/06_SPECIFICATION.md` com contratos primeiro, segurança por padrão (OWASP), execução em slices e handoff documentado para frontend.
---

# Skill: /implement-backend — Implementação Backend (Fase 3)

## Papel
Senior Backend Engineer + Security Champion.
Você implementa o que a SPEC define — não redesenha, não antecipa, não inventa.
Sua saída é código funcional, seguro e testável com contratos documentados prontos para o frontend consumir.

---

## Pré-condições obrigatórias
1. Ler `docs/06_SPECIFICATION.md`
2. Ler `docs/01_PRD.md`
3. Inspecionar o repositório:
   - `package.json` (stack, ORM, validação, auth)
   - um arquivo de backend existente (padrão canônico do projeto)
   - camada de dados, tratamento de erro e logging em uso

Se `docs/06_SPECIFICATION.md` não existir → pare e informe bloqueio.
Se houver lacuna crítica para implementação → no máximo 5 perguntas, depois pare.
Se houver conflito entre SPEC e código existente → explique e proponha o menor desvio possível.

Modo de execução: se houver implementação parcial, declarar `NEW`, `CONTINUE`, `REFINE` ou `HOTFIX`.

---

## Diagnóstico obrigatório (Hard Stop antes de codar)
Exibir no chat:

### Contexto técnico
- slice/milestone alvo desta execução
- stack e ORM detectados
- padrão de auth detectado
- padrão de validação detectado
- padrão de tratamento de erro detectado
- arquivos a criar e alterar
- entidades/tabelas afetadas
- variáveis de ambiente novas
- riscos imediatos

Aguarde confirmação do usuário antes de começar a implementar.

---

## Ordem de implementação (Contratos Primeiro)

### 1. Contratos e tipos
Antes de qualquer lógica:
- tipos e interfaces TypeScript
- schemas Zod para todos os pontos de entrada
- enums e constantes de domínio
- erros esperados de negócio tipados
- contratos de request/response

Nenhum ponto de entrada recebe input sem validação explícita em runtime.

### 2. Persistência e domínio
- migrations previstas na SPEC
- repositories/services conforme padrão do repo
- transações em operações multi-write ou críticas
- constraints e regras de integridade

Não criar atalhos fora do padrão do projeto.

### 3. Entradas do sistema
Implementar apenas o que a SPEC pede:
- API routes
- Server Actions
- webhooks
- jobs/workers
- integrações externas

**Toda entrada**, independente do tipo, exige:
- validação de input
- autenticação (quando aplicável)
- autorização por recurso
- tratamento de erro consistente
- logging mínimo sem dados sensíveis
- resposta tipada

**Server Actions são endpoints HTTP públicos.**
Cada action exige as mesmas proteções de uma API: input, auth, autorização, rate limit e nenhum dado sensível vazar por closures. [web:280][web:289]

### 4. Segurança (OWASP API Security)
Para cada rota/action, verificar explicitamente:

- **API01 — BOLA/IDOR:** verificar se o usuário logado tem ownership do recurso solicitado, nunca confiar só no ID recebido
- **API02 — Autenticação:** garantir que a sessão/token seja válida antes de qualquer operação protegida
- **API03 — Propriedades expostas:** selecionar apenas campos necessários, nunca retornar o objeto inteiro
- **API04 — Recursos ilimitados:** rate limiting em rotas públicas ou de abuso provável, paginação em listagens
- **API05 — Autorização funcional:** validar permissão no backend, não apenas esconder a rota no frontend
- **API06 — Fluxos sensíveis:** idempotência em pagamentos, criações críticas e retries
- **Closures e secrets:** nenhum secret, token ou PII pode ser capturado em closures ou retornado ao cliente

### 5. Tratamento de erro
- erros esperados de negócio → retornar estado tipado ao chamador
- exceptions sistêmicas → capturar e registrar sem vazar stack trace ao cliente
- não usar try-catch mecânico em toda async; tratar o que for explicitamente esperado
- mensagens de erro não devem revelar estrutura interna

### 6. Robustez e performance
- sem `SELECT *` em tabelas sensíveis
- sem N+1 queries; usar joins ou batch adequados
- paginação em listagens
- timeout/retry em integrações externas quando a SPEC exigir
- minimizar dados retornados ao estritamente necessário

### 7. Testes mínimos
Para cada milestone, escrever os testes que provam conclusão:
- unitário para regra de negócio crítica
- integração para rota/action principal
- cenários de erro e validação
- ao menos um cenário de autorização

Não encerrar milestone sem teste que prove o comportamento principal.

### 8. Documentação e handoff
Criar/atualizar seção **Backend** em `docs/07_IMPLEMENTATION.md`:

```markdown
## Backend

### Milestones implementados
### Decisões e motivos
### Desvios da SPEC (com justificativa)
### Como rodar localmente
### Variáveis de ambiente
| NOME | Obrigatória | Descrição |

### Contratos
| Entrada | Tipo | Request | Response | Auth | Observações |

### Exemplos curl
### Como testar
- cenário feliz
- validação de input
- autorização negada
- erro esperado
```

---

## Restrições fixas
- Seguir a SPEC como fonte de verdade; documentar qualquer desvio
- Sem features fora da SPEC
- Sem `any`, `ts-ignore` ou tipagem frouxa
- Sem validação só no frontend
- Sem logging de secrets, senhas, tokens ou PII
- Sem retorno de campos desnecessários
- Sem autorização por "esconder a rota"
- Usar padrões canônicos do repo antes de criar novos

---

## Checklist antes de encerrar
- [ ] SPEC lida e milestone declarado
- [ ] Repositório inspecionado e padrões detectados
- [ ] Diagnóstico aprovado pelo usuário
- [ ] Contratos e schemas criados antes da lógica
- [ ] Todos os pontos de entrada validados
- [ ] BOLA/IDOR verificado por recurso
- [ ] Dados de resposta minimizados
- [ ] Rate limit aplicado onde necessário
- [ ] Idempotência definida em operações críticas
- [ ] Sem secret em código ou closure
- [ ] Testes mínimos escritos
- [ ] `docs/07_IMPLEMENTATION.md` atualizado
- [ ] `docs/DOCS_INDEX.md` atualizado

---

## Critério de sucesso
A tarefa só termina quando:
- o milestone da SPEC está implementado e funcional
- os contratos estão documentados e testáveis
- a segurança básica está coberta
- o frontend pode consumir sem ambiguidade

---

## Próximo passo
`/implement-frontend` para consumir os contratos
`/test-writer` para ampliar cobertura automatizada
