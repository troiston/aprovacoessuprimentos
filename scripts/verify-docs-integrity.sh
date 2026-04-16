#!/usr/bin/env bash
# =============================================================================
# verify-docs-integrity.sh — Frontmatter + links para kit Web Excellence (scoped)
# Nao percorre docs VibeCoding nem .cursor/skills (87) sem YAML completo.
# Pastas: docs/web-excellence, .cursor/skills-web-excellence
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

TOTAL_FILES=0
VALID_HEADERS=0
MISSING_FIELDS=0
BROKEN_LINKS=0
FILES_WITHOUT_FRONTMATTER=0
declare -a ERRORS=()

print_header() {
  echo -e "\n${BOLD}${CYAN}══════════════════════════════════════════════════${RESET}"
  echo -e "${BOLD}${CYAN}  $1${RESET}"
  echo -e "${BOLD}${CYAN}══════════════════════════════════════════════════${RESET}\n"
}

print_pass() { echo -e "  ${GREEN}✓${RESET} $1"; }
print_fail() { echo -e "  ${RED}✗${RESET} $1"; }
print_warn() { echo -e "  ${YELLOW}⚠${RESET} $1"; }

extract_frontmatter() {
  local file="$1"
  local in_frontmatter=false
  local line_num=0
  local frontmatter=""

  while IFS= read -r line || [[ -n "$line" ]]; do
    line_num=$((line_num + 1))
    if [[ $line_num -eq 1 ]]; then
      if [[ "$line" =~ ^---[[:space:]]*$ ]]; then
        in_frontmatter=true
        continue
      else
        return 1
      fi
    fi
    if $in_frontmatter && [[ "$line" =~ ^---[[:space:]]*$ ]]; then
      echo "$frontmatter"
      return 0
    fi
    if $in_frontmatter; then
      frontmatter+="$line"$'\n'
    fi
  done < "$file"
  return 1
}

check_required_fields() {
  local file="$1"
  local frontmatter="$2"
  local missing=()

  if ! echo "$frontmatter" | grep -qE '^id[[:space:]]*:'; then
    missing+=("id")
  fi
  local has_title=false
  local has_description=false
  if echo "$frontmatter" | grep -qE '^title[[:space:]]*:'; then has_title=true; fi
  if echo "$frontmatter" | grep -qE '^description[[:space:]]*:'; then has_description=true; fi
  if ! $has_title && ! $has_description; then
    missing+=("title/description")
  fi
  if ! echo "$frontmatter" | grep -qE '^version[[:space:]]*:'; then
    missing+=("version")
  fi

  if [[ ${#missing[@]} -gt 0 ]]; then
    local relative_path="${file#"$PROJECT_ROOT"/}"
    local joined
    joined=$(IFS=', '; echo "${missing[*]}")
    ERRORS+=("Campos faltando em ${relative_path}: ${joined}")
    MISSING_FIELDS=$((MISSING_FIELDS + 1))
    print_fail "${relative_path} — campos faltando: ${joined}"
    return 1
  fi
  return 0
}

check_internal_links() {
  local file="$1"
  local file_dir
  file_dir="$(dirname "$file")"
  local relative_file="${file#"$PROJECT_ROOT"/}"
  local has_broken=false

  while IFS= read -r link; do
    [[ -z "$link" ]] && continue
    local clean_link="${link%%#*}"
    [[ -z "$clean_link" ]] && continue
    [[ "$clean_link" =~ ^https?:// ]] && continue
    [[ "$clean_link" =~ ^mailto: ]] && continue
    [[ "$clean_link" =~ ^tel: ]] && continue

    local target_path
    if [[ "$clean_link" == /* ]]; then
      target_path="${PROJECT_ROOT}${clean_link}"
    else
      target_path="${file_dir}/${clean_link}"
    fi

    target_path="$(cd "$(dirname "$target_path")" 2>/dev/null && echo "$(pwd)/$(basename "$target_path")")" 2>/dev/null || target_path=""

    if [[ -z "$target_path" ]] || [[ ! -e "$target_path" ]]; then
      BROKEN_LINKS=$((BROKEN_LINKS + 1))
      ERRORS+=("Link quebrado em ${relative_file}: ${link}")
      print_fail "${relative_file} → link quebrado: ${link}"
      has_broken=true
    fi
  done < <(grep -oP '\[(?:[^\]]*)\]\(\K[^)]+' "$file" 2>/dev/null || true)

  if ! $has_broken; then return 0; fi
  return 1
}

declare -A CATEGORY_COUNTS
count_category() {
  local file="$1"
  local relative="${file#"$PROJECT_ROOT"/}"
  local category
  category="$(echo "$relative" | cut -d'/' -f1)"
  if [[ "$category" == "docs" ]]; then
    local sub
    sub="$(echo "$relative" | cut -d'/' -f2)"
    if [[ -n "$sub" && "$sub" != "$(basename "$relative")" ]]; then
      category="docs/${sub}"
    fi
  fi
  if [[ "$category" == ".cursor" ]]; then
    local sub
    sub="$(echo "$relative" | cut -d'/' -f2)"
    if [[ -n "$sub" && "$sub" != "$(basename "$relative")" ]]; then
      category=".cursor/${sub}"
    fi
  fi
  CATEGORY_COUNTS["$category"]=$(( ${CATEGORY_COUNTS["$category"]:-0} + 1 ))
}

print_header "Integridade docs Web Excellence (scoped)"

DOCS_WX="$PROJECT_ROOT/docs/web-excellence"
SKILL_WX="$PROJECT_ROOT/.cursor/skills-web-excellence"

mapfile -t MD_FILES < <(
  {
    [[ -d "$DOCS_WX" ]] && find "$DOCS_WX" -type f \( -name "*.md" -o -name "*.mdc" \) 2>/dev/null
    [[ -d "$SKILL_WX" ]] && find "$SKILL_WX" -type f \( -name "*.md" -o -name "*.mdc" \) 2>/dev/null
  } | sort -u
)

if [[ ${#MD_FILES[@]} -eq 0 ]]; then
  print_warn "Nenhum ficheiro em docs/web-excellence ou .cursor/skills-web-excellence"
  exit 0
fi

TOTAL_FILES=${#MD_FILES[@]}
echo -e "${BOLD}Analisando ${TOTAL_FILES} ficheiros (scoped)...${RESET}\n"

echo -e "${BOLD}${CYAN}─── Fase 1: Frontmatter ───${RESET}\n"

for file in "${MD_FILES[@]}"; do
  relative="${file#"$PROJECT_ROOT"/}"
  count_category "$file"

  if [[ "$file" == *.mdc ]]; then
    if extract_frontmatter "$file" >/dev/null; then
      VALID_HEADERS=$((VALID_HEADERS + 1))
      print_pass "${relative} — frontmatter (.mdc)"
    else
      FILES_WITHOUT_FRONTMATTER=$((FILES_WITHOUT_FRONTMATTER + 1))
      ERRORS+=("Sem frontmatter YAML válido: ${relative}")
      print_fail "${relative} — sem frontmatter YAML válido"
    fi
    continue
  fi

  if fm="$(extract_frontmatter "$file")"; then
    if check_required_fields "$file" "$fm"; then
      VALID_HEADERS=$((VALID_HEADERS + 1))
    fi
  else
    FILES_WITHOUT_FRONTMATTER=$((FILES_WITHOUT_FRONTMATTER + 1))
    ERRORS+=("Sem frontmatter YAML válido: ${relative}")
    print_fail "${relative} — sem frontmatter YAML válido"
  fi
done

echo -e "\n${BOLD}${CYAN}─── Fase 2: Links internos ───${RESET}\n"

LINKS_CHECKED=0
for file in "${MD_FILES[@]}"; do
  if grep -qP '\[(?:[^\]]*)\]\([^)]+\)' "$file" 2>/dev/null; then
    check_internal_links "$file"
    LINKS_CHECKED=$((LINKS_CHECKED + 1))
  fi
done

[[ $LINKS_CHECKED -eq 0 ]] && print_warn "Nenhum link markdown para verificar"

echo -e "\n${BOLD}${CYAN}─── Por categoria ───${RESET}\n"
for category in $(echo "${!CATEGORY_COUNTS[@]}" | tr ' ' '\n' | sort); do
  echo -e "  ${CYAN}${category}${RESET}: ${CATEGORY_COUNTS[$category]} ficheiro(s)"
done

print_header "Relatório"

echo -e "  Total: ${TOTAL_FILES} | Válidos: ${VALID_HEADERS} | Sem FM: ${FILES_WITHOUT_FRONTMATTER} | Campos: ${MISSING_FIELDS} | Links: ${BROKEN_LINKS}"

TOTAL_ISSUES=$((FILES_WITHOUT_FRONTMATTER + MISSING_FIELDS + BROKEN_LINKS))

echo ""
if [[ $TOTAL_ISSUES -eq 0 ]]; then
  echo -e "  ${GREEN}${BOLD}✓ verify-docs-integrity PASSOU${RESET}\n"
  exit 0
fi

echo -e "  ${RED}${BOLD}✗ FALHOU — ${TOTAL_ISSUES} problema(s)${RESET}"
if [[ ${#ERRORS[@]} -gt 0 ]]; then
  echo -e "\n${BOLD}${RED}─── Detalhes ───${RESET}\n"
  for err in "${ERRORS[@]}"; do
    echo -e "  ${RED}•${RESET} $err"
  done
fi
echo ""
exit 1
