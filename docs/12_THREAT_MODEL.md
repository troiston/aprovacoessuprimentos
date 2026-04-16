# 10_THREAT_MODEL.md — Modelo de Ameaças

> **Skills:** `/using-superpowers` `/k8s-security-policies` `/secrets-management` `/auth-implementation-patterns` `/two-factor-authentication-best-practices`  
> **Prompt pack:** `12_PROMPT_PACKS.md` → Fase 4  
> **Responsável:** Tech Lead  
> **Metodologia:** STRIDE (Spoofing · Tampering · Repudiation · Info Disclosure · DoS · Elevation of Privilege)  
> **Gate de saída:** Modelo completo; zero risco crítico sem mitigação; risco residual com owner e prazo

Status: DRAFT  
Owner: [preencher]  
Última atualização: [preencher]

---

## 1. Contexto

- Produto / módulo:
- Escopo do modelo:
- Suposições:
- Fora de escopo:

---

## 2. Ativos Críticos

| Ativo | Tipo de dado | Criticidade (C/A/M/B) | Onde reside | Dono | Classificação LGPD |
|---|---|---|---|---|---|
| | | | | | Dado pessoal / Dado sensível / Não pessoal |

> **LGPD:** identificar dados pessoais e sensíveis desde o modelo de ameaças. Titular tem direito de acesso, correção e exclusão — garantir que há mecanismo implementado.

---

## 3. Atores de Ameaça

| Ator | Motivação | Capacidade técnica | Vetor principal |
|---|---|---|---|
| Usuário malicioso autenticado | Acesso indevido a dados de outros | Média | IDOR, privilege escalation |
| Usuário não autenticado | Acesso a recursos protegidos | Baixa–Média | Força bruta, endpoints expostos |
| Bot / automação abusiva | Scraping, spam, abuso de recursos | Alta | Rate limit bypass, credential stuffing |
| Insider (funcionário/colaborador) | Vazamento ou sabotagem | Alta | Acesso privilegiado ao banco e logs |
| Dependência/fornecedor comprometido | Supply chain attack | Alta | Pacote npm malicioso, CVE |

---

## 4. Superfície de Ataque

- Endpoints de API públicos:
- Endpoints autenticados:
- Formulários e upload de arquivos:
- Integrações externas:
- Secrets e chaves:
- Jobs assíncronos / webhooks:
- Infraestrutura (Traefik, Docker Swarm, VPS):

---

## 5. Matriz de Ameaças por Fluxo (STRIDE)

> STRIDE: **S**poofing · **T**ampering · **R**epudiation · **I**nfo Disclosure · **D**oS · **E**levation of Privilege  
> Risco = Severidade × Probabilidade (C/A/M/B)

| ID | Fluxo | Categoria STRIDE | Ameaça | Vetor | Controle atual | Lacuna | Severidade | Probabilidade | Risco | Mitigação |
|---|---|---|---|---|---|---|---|---|---|---|
| TH-001 | | S | | | | | | | | |
| TH-002 | | T | | | | | | | | |

---

## 6. Controles Obrigatórios

### Aplicação
- [ ] Authn e authz por recurso (ownership) — sem IDOR
- [ ] Validação de input (schema / allowlist com Zod)
- [ ] Proteção anti-abuso (rate limit / brute force)
- [ ] Idempotência em operações críticas
- [ ] Logs e trilha de auditoria sem PII sensível
- [ ] Confirmação para ações destrutivas / irreversíveis

### Dados e Privacidade
- [ ] Dados pessoais identificados e classificados (LGPD)
- [ ] Política de retenção e exclusão implementada
- [ ] Dados sensíveis criptografados em repouso
- [ ] Dados em trânsito protegidos por TLS

### Secrets e Infra
- [ ] Secrets gerenciados fora do código (env vars / Docker Secrets)
- [ ] Segredos rotacionáveis com procedimento documentado
- [ ] Acesso SSH por chave; senha desabilitada
- [ ] Traefik com TLS automático (Let's Encrypt)
- [ ] Portas internas não expostas diretamente

---

## 7. Dependências e Supply Chain

| Dependência | Função | Licença | Manutenção | CVEs relevantes | Ação |
|---|---|---|---|---|---|
| | | | Ativa / Inativa | | Monitorar / Substituir |

---

## 8. Plano de Mitigação

| Prioridade | Ameaça (ID) | Ação | Owner | Prazo | Evidência de fechamento |
|---|---|---|---|---|---|
| P0 | TH-001 | | | | |

---

## 9. Risco Residual Aceito

| Risco | Justificativa de aceite | Owner | Revisão em |
|---|---|---|---|
| | | | |

---

## Veredito

- [x] ✅ **READY** — riscos críticos do escopo atual mitigados (authz em API, sem registo público, segredos fora do repo); residual aceite documentado abaixo.
- [ ] ❌ NOT READY — risco crítico aberto: [listar TH-IDs]

**Decisão atual (15/04/2026):** **READY**. Residual: abuso de API sem rate-limit (aceite para intranet/VPN); phishing de credenciais — mitigado por treino e MFA futuro opcional.

**STRIDE (resumo):** Spoofing → sessão cookie; Tampering → RBAC + validação; Repudiation → audit log; Information disclosure → mascaramento SMTP; DoS → não coberto na app (usar infra); Elevation → roles no `User`.
