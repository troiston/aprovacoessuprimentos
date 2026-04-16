#!/usr/bin/env bash
# verify-docs.sh — Verificação de saúde do framework VibeCoding v3
# Uso: bash scripts/verify-docs.sh
# Exit 0 = OK | Exit 0+warns = revisar antes do PR | Exit 1 = bloquear

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

RED='\033[0;31m'; YEL='\033[1;33m'; GRN='\033[0;32m'; NC='\033[0m'
ERRORS=0; WARNINGS=0

ok()   { echo -e "  ${GRN}OK${NC}    $1"; }
warn() { echo -e "  ${YEL}WARN${NC}  $1"; WARNINGS=$((WARNINGS+1)); }
fail() { echo -e "  ${RED}FAIL${NC}  $1"; ERRORS=$((ERRORS+1)); }

# ── 1. EXISTÊNCIA DOS DOCS BASE ──────────────────────────────────────────────
echo ""; echo "━━━ 1. Docs de fase ━━━"
PHASE_DOCS=(
  docs/04_MARKET_AND_REFERENCES.md
  docs/08_SECURITY.md docs/09_TESTS.md docs/10_DEBUG.md
  docs/11_UX_AUDIT.md docs/12_THREAT_MODEL.md docs/13_RELEASE_READINESS.md
)
for f in "${PHASE_DOCS[@]}"; do
  [ -f "$f" ] && ok "$f" || fail "$f — AUSENTE"
done

echo ""; echo "━━━ 1b. Docs de suporte ━━━"
SUPPORT_DOCS=(
  docs/DOCS_INDEX.md
  docs/03_RESEARCH.md
  docs/S01_QUICK_START.md docs/S02_PROMPT_PACKS.md docs/S03_SKILLS_INDEX.md
  docs/S04_IMAGE_GENERATION.md docs/S05_DESIGN_REFERENCES.md
)
for f in "${SUPPORT_DOCS[@]}"; do
  [ -f "$f" ] && ok "$f" || fail "$f — AUSENTE"
done

echo ""; echo "━━━ 1c. Docs de operações ━━━"
OPS_DOCS=(
  docs/OPS01_DEPLOYMENT.md docs/OPS02_RUNBOOK.md docs/OPS03_POST_MORTEM.md
)
for f in "${OPS_DOCS[@]}"; do
  [ -f "$f" ] && ok "$f" || fail "$f — AUSENTE"
done

echo ""; echo "━━━ 1d. Docs internos ━━━"
INT_DOCS=(
  docs/INT01_PLANO_ARQUITETURA.md docs/INT02_PLANO_CONCLUSAO.md
  docs/INT03_AI_DOCS_INDEXING.md
)
for f in "${INT_DOCS[@]}"; do
  [ -f "$f" ] && ok "$f" || fail "$f — AUSENTE"
done

echo ""; echo "━━━ 1e. Templates ━━━"
TEMPLATES=(
  docs/templates/README.md
  docs/templates/00_VALIDATION.md docs/templates/01_PRD.md
  docs/templates/02_MONETIZATION.md docs/templates/03_RESEARCH.md
  docs/templates/05_DESIGN.md docs/templates/06_SPECIFICATION.md
  docs/templates/07_IMPLEMENTATION.md
)
for f in "${TEMPLATES[@]}"; do
  [ -f "$f" ] && ok "$f" || fail "$f — AUSENTE"
done

echo ""; echo "━━━ 1f. Estrutura essencial ━━━"
ESSENTIAL=(
  ARCHITECTURE.md AGENT.md WORKFLOW.md README.md
  docs/decisions/README.md docs/decisions/template-madr.md
  .cursor/hooks.json package.json .env.example
)
for f in "${ESSENTIAL[@]}"; do
  [ -f "$f" ] && ok "$f" || warn "$f — AUSENTE"
done

# ── 2. VEREDITO NOS DOCS DE QUALIDADE ────────────────────────────────────────
echo ""; echo "━━━ 2. Veredito nos docs de qualidade ━━━"
cv() {
  local file="$1" pat="$2" lbl="$3"
  [ ! -f "$file" ] && { warn "$lbl — arquivo não encontrado"; return; }
  grep -qiE "$pat" "$file" && ok "$lbl — veredito encontrado" || fail "$lbl — sem veredito (esperado: $pat)"
}
cv "docs/08_SECURITY.md"          "APROVADO|REPROVADO|READY|NOT READY"      "08_SECURITY"
cv "docs/09_TESTS.md"             "APROVADO|REPROVADO|READY|NOT READY|VERDE" "09_TESTS"
cv "docs/10_DEBUG.md"             "PRONTO|NÃO PRONTO|READY|NOT READY"       "10_DEBUG"
cv "docs/11_UX_AUDIT.md"          "READY|NOT READY"                          "11_UX_AUDIT"
cv "docs/12_THREAT_MODEL.md"      "READY|NOT READY"                          "12_THREAT_MODEL"
cv "docs/13_RELEASE_READINESS.md" "GO|NO-GO|GO WITH RISK"                    "13_RELEASE_READINESS"

# ── 3. PLACEHOLDERS EM DOCS CRÍTICOS ─────────────────────────────────────────
echo ""; echo "━━━ 3. Placeholders [preencher] ━━━"
CRITICAL=(docs/08_SECURITY.md docs/09_TESTS.md docs/10_DEBUG.md
          docs/11_UX_AUDIT.md docs/12_THREAT_MODEL.md docs/13_RELEASE_READINESS.md)
for f in "${CRITICAL[@]}"; do
  [ ! -f "$f" ] && continue
  COUNT=$(grep -cF "[preencher]" "$f" 2>/dev/null || echo 0)
  if [ "$COUNT" -gt 5 ]; then
    warn "$f — $COUNT campos [preencher] (DRAFT?)"
  elif [ "$COUNT" -gt 0 ]; then
    ok "$f — $COUNT campo(s) [preencher] (aceitável)"
  else
    ok "$f — sem [preencher]"
  fi
done

# ── 4. GATE DE MONETIZAÇÃO ───────────────────────────────────────────────────
echo ""; echo "━━━ 4. Gate de monetização ━━━"
if [ -f "docs/templates/02_MONETIZATION.md" ]; then
  ok "Template de monetização existe"
else
  fail "Template docs/templates/02_MONETIZATION.md — AUSENTE"
fi

# ── 5. GATES TÉCNICOS ────────────────────────────────────────────────────────
echo ""; echo "━━━ 5. Gates técnicos ━━━"
if [ -f "package.json" ]; then
  npm run typecheck --silent 2>/dev/null && ok "typecheck" || warn "typecheck — falhou ou não configurado"
  npm run lint --silent 2>/dev/null && ok "lint" || warn "lint — falhou ou não configurado"
  AUDIT=$(npm audit --audit-level=critical 2>&1 || true)
  echo "$AUDIT" | grep -q "found 0 vulnerabilities" && ok "npm audit — sem críticos" \
    || (echo "$AUDIT" | grep -qiE "critical" && fail "npm audit — críticos encontrados" || ok "npm audit — sem críticos (pode haver moderados)")
else
  warn "package.json não encontrado — gates técnicos ignorados"
fi

# ── 6. CONSISTÊNCIA DO DOCS_INDEX ────────────────────────────────────────────
echo ""; echo "━━━ 6. Consistência do DOCS_INDEX ━━━"
if [ -f "docs/DOCS_INDEX.md" ]; then
  grep -q "S03_SKILLS_INDEX" docs/DOCS_INDEX.md && ok "DOCS_INDEX → S03_SKILLS_INDEX" || warn "DOCS_INDEX não referencia S03_SKILLS_INDEX.md"
  grep -q "13_RELEASE"       docs/DOCS_INDEX.md && ok "DOCS_INDEX → 13_RELEASE"       || warn "DOCS_INDEX não referencia 13_RELEASE_READINESS.md"
  grep -q "02_MONETIZATION"  docs/DOCS_INDEX.md && ok "DOCS_INDEX → 02_MONETIZATION"  || warn "DOCS_INDEX não referencia 02_MONETIZATION.md"
else
  fail "docs/DOCS_INDEX.md — AUSENTE"
fi

# ── 6b. REFERÊNCIAS CRUZADAS docs/XX_ em skills/agents ───────────────────────
echo ""; echo "━━━ 6b. Referências cruzadas docs/XX_ ━━━"
DOCS_REF_FILES=$(grep -RIlE "docs/[0-9]{2}_[A-Z_]+\.md" ".cursor/skills" ".cursor/agents" 2>/dev/null || true)
if [ -z "$DOCS_REF_FILES" ]; then
  warn "Nenhuma referência docs/XX_ encontrada em .cursor/skills ou .cursor/agents"
else
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    REFS=$(grep -oE "docs/[0-9]{2}_[A-Z_]+\.md" "$f" 2>/dev/null | sort -u || true)
    while IFS= read -r ref; do
      [ -z "$ref" ] && continue
      if [ -f "$ref" ]; then
        ok "$f → $ref"
      else
        warn "$f referencia documento inexistente: $ref"
      fi
    done <<< "$REFS"
  done <<< "$DOCS_REF_FILES"
fi

# ── 7. ESTRUTURA CURSOR ──────────────────────────────────────────────────────
echo ""; echo "━━━ 7. Estrutura .cursor/ ━━━"
CURSOR_DIRS=(
  .cursor/rules/core .cursor/rules/framework .cursor/rules/domain .cursor/rules/security
  .cursor/rules/stack .cursor/rules/quality .cursor/rules/design
  .cursor/hooks .cursor/commands .cursor/skills .cursor/skills-web-excellence
)
for d in "${CURSOR_DIRS[@]}"; do
  [ -d "$d" ] && ok "$d/" || warn "$d/ — AUSENTE"
done

# ── 7b. Kit Web Excellence (docs) ────────────────────────────────────────────
echo ""; echo "━━━ 7b. Docs Web Excellence ━━━"
[ -f "docs/web-excellence/DOCS_INDEX.md" ] && ok "docs/web-excellence/DOCS_INDEX.md" || warn "docs/web-excellence/DOCS_INDEX.md — AUSENTE"
[ -f "docs/web-excellence/framework-manifest.json" ] && ok "framework-manifest.json (web-excellence)" || warn "docs/web-excellence/framework-manifest.json — gere com npm run manifest"

# ── 8. SKILLS INSTALADAS (amostra) ───────────────────────────────────────────
echo ""; echo "━━━ 8. Skills instaladas (amostra) ━━━"
CORE_SKILLS=(using-superpowers brainstorming validate prd market design spec orchestrator implement-backend implement-frontend test-writer debugger release pr)
for s in "${CORE_SKILLS[@]}"; do
  [ -d ".cursor/skills/$s" ] && ok "$s" || warn "SKILL AUSENTE: $s"
done
[ -d ".cursor/skills-web-excellence/foundations" ] && ok "skills-web-excellence (kit páginas)" || warn "skills-web-excellence — AUSENTE"

# ── RESUMO ────────────────────────────────────────────────────────────────────
echo ""; echo "━━━ Resumo ━━━"
echo -e "  Erros:   ${RED}$ERRORS${NC}   Avisos: ${YEL}$WARNINGS${NC}"
if [ "$ERRORS" -gt 0 ]; then
  echo -e "\n  ${RED}✗ FALHOU — corrigir antes de avançar de fase${NC}"; exit 1
elif [ "$WARNINGS" -gt 0 ]; then
  echo -e "\n  ${YEL}⚠ OK com avisos — revisar antes do PR${NC}"; exit 0
else
  echo -e "\n  ${GRN}✓ OK — todos os checks passaram${NC}"; exit 0
fi
