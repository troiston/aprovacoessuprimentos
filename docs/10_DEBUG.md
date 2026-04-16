# 08_DEBUG.md — Diagnóstico e Debug

> **Skills:** `/using-superpowers` `/debugger` `/debugging-strategies` `/systematic-debugging` `/error-handling-patterns` `/parallel-debugging`  
> **Prompt pack:** `12_PROMPT_PACKS.md` → Fase 4  
> **Responsável:** QA Jr.  
> **Gate de saída:** Zero bug crítico em aberto; bugs de média/baixa com owner e prazo

Status: DRAFT  
Owner: [preencher]  
Última atualização: [preencher]

---

## 1. Ferramentas Recomendadas

| Ferramenta | Uso | Quando usar |
|---|---|---|
| React Developer Tools | Props, state, re-renders | Bugs de estado ou renderização |
| Next DevTools (Chrome) | Props de página, cargas | Performance e hidratação |
| VS Code Debugger | Server-side + client-side | Bugs de lógica, breakpoints |
| Chrome DevTools — Sources | Breakpoints no navegador | Bugs de frontend complexos |
| Chrome DevTools — Network | Requests, payloads, status | Bugs de API e integração |
| `next dev --inspect` | Node.js debugger (Next 15+) | Bugs de SSR e API routes |
| `ANALYZE=true npm run build` | Bundle Analyzer | Performance, chunks desnecessários |
| Logs estruturados (produção) | Rastreamento em prod | Bugs reproduzíveis só em produção |

---

## 2. Processo de Debug — Checklist "Antes de Reportar"

> Use a skill `/systematic-debugging` para guiar o processo passo a passo.

- [ ] Reproduzir em ambiente limpo (sem extensões conflitantes)
- [ ] Confirmar se ocorre em staging e/ou produção
- [ ] Registrar passos exatos de reprodução (mínimo reproduzível)
- [ ] Verificar Console e Network no Chrome DevTools
- [ ] Verificar React DevTools para props e state
- [ ] Checar logs do servidor (se backend)
- [ ] Incluir ambiente: browser, OS, Node, versões de dependências principais

---

## 3. Bugs Encontrados

> Severidade: **C** = Crítico (bloqueia release) · **A** = Alto · **M** = Médio · **B** = Baixo

| ID | Severidade | Descrição | Impacto | Passos de reprodução | Causa raiz | Solução | Owner | Status |
|---|---|---|---|---|---|---|---|---|
| BUG-001 | C | | | | | | | ⬜ Aberto |

---

## 4. Regressão Potencial por Área

| Área | Risco de regressão | Cenários de teste associados |
|---|---|---|
| Autenticação | | |
| Banco de dados | | |
| Integrações externas | | |
| Frontend crítico | | |

---

## 5. Checklist Pós-Deploy e Monitoração

- [ ] Smoke test nos fluxos críticos após deploy
- [ ] Logs de erro monitorados nas primeiras 24h
- [ ] Alertas de `prometheus-configuration` ativos
- [ ] Dashboard `grafana-dashboards` verificado
- [ ] Rollback testado e documentado em `20_DEPLOYMENT.md`

---

## 6. Verificação de Documentação

```bash
# Confirmar que todos os docs referenciados existem
bash scripts/verify-docs.sh
```

---

## Veredito

- [x] ✅ **PRONTO** — nenhum bug **crítico** conhecido em aberto na data da revisão; issues futuras via backlog com prioridade.
- [ ] ❌ NÃO PRONTO — bloqueios: [listar BUG-IDs críticos]

**Revisão 15/04/2026:** Comportamento alinhado à spec nos fluxos principais (login, dashboard, empreendimentos, tarefas, auditoria para EDITOR+, mail ADMIN). Regressões: reproduzir com passos mínimos e registar em `10_DEBUG` / issue tracker.
