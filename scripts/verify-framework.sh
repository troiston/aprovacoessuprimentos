#!/usr/bin/env bash
# =============================================================================
# verify-framework.sh — Integridade do framework Web Excellence (skills + commands)
# SKILLS_DIR: default .cursor/skills-web-excellence
# =============================================================================
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILLS_DIR="${FRAMEWORK_SKILLS_DIR:-$PROJECT_ROOT/.cursor/skills-web-excellence}"
RULES_DIR="$PROJECT_ROOT/.cursor/rules"
CMD_DIR="$PROJECT_ROOT/.cursor/commands"
MANIFEST="$PROJECT_ROOT/docs/web-excellence/framework-manifest.json"

ERRORS=0

print_header() {
  echo -e "\n${BOLD}${CYAN}═══ $1 ═══${RESET}\n"
}

fail() {
  echo -e "  ${RED}✗${RESET} $1"
  ERRORS=$((ERRORS + 1))
}

pass() {
  echo -e "  ${GREEN}✓${RESET} $1"
}

warn() {
  echo -e "  ${YELLOW}⚠${RESET} $1"
}

if [[ ! -d "$SKILLS_DIR" ]]; then
  fail "SKILLS_DIR inexistente: $SKILLS_DIR"
  echo -e "${RED}${BOLD}verify-framework: $ERRORS erro(s)${RESET}\n"
  exit 1
fi

declare -A SKILL_IDS
while IFS= read -r -d '' f; do
  base="$(basename "$f")"
  [[ "$base" == "SKILLS_INDEX.md" ]] && continue
  id_line="$(grep -m1 '^id:[[:space:]]*skill-' "$f" 2>/dev/null || true)"
  if [[ -z "$id_line" ]]; then
    fail "Skill sem id skill-*: ${f#"$PROJECT_ROOT"/}"
    continue
  fi
  id="$(echo "$id_line" | sed -E 's/^id:[[:space:]]*(skill-[a-z0-9-]+).*/\1/')"
  SKILL_IDS["$id"]=1
done < <(find "$SKILLS_DIR" -type f -name '*.md' -print0 2>/dev/null)

print_header "Skills: IDs registados (${#SKILL_IDS[@]}) em ${SKILLS_DIR#"$PROJECT_ROOT"/}"

while IFS= read -r -d '' f; do
  [[ "$(basename "$f")" == "SKILLS_INDEX.md" ]] && continue
  rel="${f#"$PROJECT_ROOT"/}"
  while IFS= read -r req; do
    [[ -z "$req" ]] && continue
    if [[ "$req" =~ ^skill: ]]; then
      sid="${req#skill: }"
      sid="$(echo "$sid" | tr -d '[:space:]')"
      if [[ -z "${SKILL_IDS[$sid]+x}" ]]; then
        fail "$rel — requires skill inexistente: $sid"
      fi
    elif [[ "$req" =~ ^rule: ]]; then
      rpath="${req#rule: }"
      rpath="$(echo "$rpath" | tr -d '[:space:]')"
      rule_file=""
      if [[ -f "$RULES_DIR/${rpath}.mdc" ]]; then
        rule_file="$RULES_DIR/${rpath}.mdc"
      elif [[ "$rpath" != */* ]] && [[ -f "$RULES_DIR/core/${rpath}.mdc" ]]; then
        rule_file="$RULES_DIR/core/${rpath}.mdc"
      else
        base="${rpath##*/}"
        found="$(find "$RULES_DIR" -name "${base}.mdc" -print 2>/dev/null | head -1)"
        [[ -n "$found" ]] && rule_file="$found"
      fi
      if [[ -z "$rule_file" || ! -f "$rule_file" ]]; then
        fail "$rel — rule inexistente: $rpath"
      fi
    fi
  done < <(grep -E '^\s*-\s+(skill:|rule:)' "$f" 2>/dev/null | sed -E 's/^\s*-\s*//')
done < <(find "$SKILLS_DIR" -type f -name '*.md' -print0)

pass "Grafo requires (skills + rules) verificado"

print_header "Commands esperados"
EXPECTED_CMDS=(
  "project/init-project.md"
  "project/init-tokens.md"
  "project/init-seo.md"
  "build/new-page.md"
  "build/new-component.md"
  "build/new-section.md"
  "generate/gen-image.md"
  "generate/gen-video.md"
  "generate/gen-copy.md"
  "generate/gen-schema.md"
  "audit/audit-seo.md"
  "audit/audit-a11y.md"
  "audit/audit-perf.md"
  "audit/audit-full.md"
  "audit/audit-conversion.md"
)
for c in "${EXPECTED_CMDS[@]}"; do
  if [[ -f "$CMD_DIR/$c" ]]; then
    pass "commands/$c"
  else
    fail "Falta: .cursor/commands/$c"
  fi
done

if [[ -f "$MANIFEST" ]]; then
  pass "docs/web-excellence/framework-manifest.json presente (regenerar: npm run manifest)"
else
  warn "docs/web-excellence/framework-manifest.json ausente — execute: npm run manifest"
fi

echo ""
if [[ "$ERRORS" -eq 0 ]]; then
  echo -e "${GREEN}${BOLD}verify-framework: PASSOU${RESET}\n"
  exit 0
fi

echo -e "${RED}${BOLD}verify-framework: $ERRORS erro(s)${RESET}\n"
exit 1
