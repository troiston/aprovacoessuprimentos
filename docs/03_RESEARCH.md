# 03_RESEARCH.md — Pesquisa técnica (Incorporação Diga Olá)

> **Fase:** 1c-sup (opcional) — fechado para o MVP interno  
> **Última atualização:** 15/04/2026  
> **Responsável:** Tech Lead

---

## 1. E-mail (Slice 5 da spec)

| Opção | Prós | Contras | Decisão |
|-------|------|---------|---------|
| **SMTP + TLS** (Nodemailer) | Simples, compatível com a maioria dos servidores corporativos | Gestão de credenciais | **Adotado** para MVP |
| Microsoft Graph + OAuth2 | Alinhado a tenants Microsoft-only | Permissões, fluxo OAuth, mais código | **Fora do MVP** — reavaliar se o cliente exigir exclusivamente Graph |

**Baseline:** credenciais em `SystemSetting` cifradas com `SETTINGS_ENCRYPTION_KEY` (AES-256-GCM); envio testável via `/api/mail/test` (ADMIN).

---

## 2. Outras integrações

- **Stripe:** webhooks opcionais — fora do núcleo Incorporação; manter envs apenas se billing ativo.
- **Rate limiting / Dragonfly:** não bloqueante para release interna; backlog pós-MVP se exposição pública aumentar.

---

## Veredito

Pesquisa suficiente para o escopo atual: **trade-offs documentados**; integrações críticas definidas (SMTP interno). Nenhum bloqueio de arquitetura em aberto para a release descrita em `docs/13_RELEASE_READINESS.md`.
