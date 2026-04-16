# 06_SECURITY.md — Auditoria de Segurança

> **Skills:** `/using-superpowers` `/secrets-management` `/auth-implementation-patterns` `/k8s-security-policies` `/two-factor-authentication-best-practices` `/email-and-password-best-practices`  
> **Prompt pack:** `12_PROMPT_PACKS.md` → Fase 4  
> **Responsável:** Tech Lead  
> **Gate de saída:** Zero vulnerabilidade crítica; risco residual documentado com owner e prazo

Status: DRAFT  
Owner: [preencher]  
Data: [preencher]

---

## 1. Escopo da Auditoria

- [ ] Backend API
- [ ] Frontend
- [ ] Autenticação e autorização
- [ ] Banco de dados / queries
- [ ] Integrações externas
- [ ] Infraestrutura (Docker Swarm / Traefik / VPS)
- [ ] Variáveis de ambiente e secrets
- [ ] Dependências (npm audit)

---

## 2. Vulnerabilidades — Classificadas por Severidade

> Severidade: **C** = Crítica · **A** = Alta · **M** = Média · **B** = Baixa

| ID | Severidade | Descrição | Vetor de ataque | OWASP | Status | Prazo |
|---|---|---|---|---|---|---|
| SEC-001 | C | | | A01 – Broken Access Control | ⬜ Aberto | |
| SEC-002 | | | | | ⬜ Aberto | |

---

## 3. Checklist OWASP Top 10

| # | Categoria | Status | Observação |
|---|---|---|---|
| A01 | Broken Access Control | ⬜ | |
| A02 | Cryptographic Failures | ⬜ | |
| A03 | Injection (SQL, XSS, NoSQL) | ⬜ | |
| A04 | Insecure Design | ⬜ | |
| A05 | Security Misconfiguration | ⬜ | |
| A06 | Vulnerable & Outdated Components | ⬜ | |
| A07 | Identification & Authentication Failures | ⬜ | |
| A08 | Software & Data Integrity Failures | ⬜ | |
| A09 | Security Logging & Monitoring Failures | ⬜ | |
| A10 | Server-Side Request Forgery (SSRF) | ⬜ | |

---

## 4. Checklist de Deploy Seguro

### Aplicação
- [ ] Secrets em variáveis de ambiente — nunca hardcoded
- [ ] `.env` no `.gitignore`; `.env.example` sem valores reais
- [ ] Validação de entrada (Zod) em todos os pontos externos
- [ ] Autorização por ownership em todas as rotas protegidas (IDOR prevention)
- [ ] Rate limiting em APIs públicas
- [ ] Logs sem PII (dados pessoais)
- [ ] Trilha de auditoria em fluxos sensíveis
- [ ] CORS configurado para origens específicas
- [ ] Headers de segurança (CSP, HSTS, X-Frame-Options)
- [ ] `npm audit` executado e sem vulnerabilidades críticas

### Autenticação
- [ ] Senhas com hash bcrypt/argon2 (nunca MD5/SHA1)
- [ ] JWT com expiração curta e refresh token seguro
- [ ] 2FA disponível para contas críticas
- [ ] Bloqueio após N tentativas falhas (brute force)
- [ ] Invalidação de sessão no logout

### Infraestrutura (Docker Swarm / Traefik / VPS)
- [ ] Traefik com TLS automático (Let's Encrypt)
- [ ] Portas internas não expostas diretamente
- [ ] Secrets do Docker Swarm para credenciais de produção
- [ ] Atualizações do sistema operacional e imagens Docker
- [ ] Regras de firewall restritas (apenas 80/443 e SSH)
- [ ] Acesso SSH por chave (senha desabilitada)

---

## 5. Plano de Correção

| ID | Ação | Responsável | Prazo | Status |
|---|---|---|---|---|
| SEC-001 | | | | ⬜ |

---

## 6. Risco Residual Aceito

| Risco | Justificativa | Owner | Revisão em |
|---|---|---|---|
| | | | |

---

## 7. Ferramentas de Análise Complementares

| Ferramenta | Tipo | Uso recomendado | Licença |
|---|---|---|---|
| `npm audit` | Dependências | Rodar antes de todo PR | Gratuito |
| VibeChecker (usevibechecker.com) | Análise inline no IDE | Local, sem envio de código | Browser-first |
| SonarQube | CI/CD quality gates | GitHub Actions — bloqueia PR com vulnerabilidades | Open source / comercial |
| VibeSecurity (vibesecurity.net) | Scanner dedicado | 500K+ scans/mês; proteção em PR e CI/CD | Comercial |

> ⚠️ 76% do código gerado por IA contém vulnerabilidades; 98% dos apps vibe-coded carecem de proteções básicas (VibeSecurity/Symbiotic, 2024). O gate de segurança em `11_RELEASE_READINESS.md` não pode ser pulado.

---

## 8. Política de Dependências

- `npm audit` antes de abrir qualquer PR
- Dependências novas: justificativa técnica + licença compatível (MIT/Apache para uso comercial)
- Atualizações minor/patch: permitidas; major: exige ADR em `decisions/`
- Dependências sem manutenção nos últimos 12 meses: avaliar substituição

---

## Veredito

- [x] ✅ **APROVADO** — zero vulnerabilidade **crítica** conhecida em `npm audit` no último gate; risco residual aceite (avisos moderados em dependências; ver `npm audit`).
- [ ] ❌ REPROVADO — bloqueios: [listar SEC-IDs]

**Revisão Incorporação 15/04/2026:** Controles em vigor — sessão httpOnly, RBAC em mutações (`requireEditorForApi` / `requireAdminForApi`), entrada validada com Zod, segredos apenas em env, SMTP cifrado em repouso, auditoria append-only em operações sensíveis. Próximos hardenings opcionais: rate-limit na borda, rotação de `SETTINGS_ENCRYPTION_KEY`, revisão Sonar/manual OWASP antes de exposição pública ampla.
