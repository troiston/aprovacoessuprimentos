#!/usr/bin/env bash
# =============================================================================
# audit-lighthouse.sh — Auditoria de qualidade com Lighthouse CI
# Executa auditorias de Performance, Acessibilidade, Boas Práticas e SEO
# em URLs configuráveis com limites mínimos de pontuação.
# =============================================================================
set -euo pipefail

# --- Cores para saída formatada ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

# --- Configuração padrão ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# URLs padrão para auditoria (usadas quando nenhum argumento é fornecido)
DEFAULT_URLS=(
  "http://localhost:3000"
  "http://localhost:3000/login"
  "http://localhost:3000/register"
  "http://localhost:3000/dashboard"
  "http://localhost:3000/styleguide"
)

# Limites mínimos de pontuação (0-100)
THRESHOLD_PERFORMANCE=90
THRESHOLD_ACCESSIBILITY=95
THRESHOLD_BEST_PRACTICES=90
THRESHOLD_SEO=95

# Diretório para relatórios
REPORTS_DIR="${PROJECT_ROOT}/lighthouse-reports"
OUTPUT_JSON=false
CHROME_FLAGS="--headless --no-sandbox --disable-gpu"

# --- Contadores de resultado ---
TOTAL_AUDITS=0
PASSED_AUDITS=0
FAILED_AUDITS=0

# --- Funções auxiliares ---

print_header() {
  echo -e "\n${BOLD}${CYAN}══════════════════════════════════════════════════${RESET}"
  echo -e "${BOLD}${CYAN}  $1${RESET}"
  echo -e "${BOLD}${CYAN}══════════════════════════════════════════════════${RESET}\n"
}

print_pass() {
  echo -e "  ${GREEN}✓${RESET} $1"
}

print_fail() {
  echo -e "  ${RED}✗${RESET} $1"
}

print_info() {
  echo -e "  ${CYAN}ℹ${RESET} $1"
}

usage() {
  cat <<EOF
${BOLD}Uso:${RESET} $(basename "$0") [opções] [url1 url2 ...]

${BOLD}Opções:${RESET}
  -j, --json          Gerar relatório JSON para cada URL
  -o, --output DIR    Diretório de saída para relatórios (padrão: lighthouse-reports/)
  -p, --perf N        Limite mínimo de Performance (padrão: ${THRESHOLD_PERFORMANCE})
  -a, --a11y N        Limite mínimo de Acessibilidade (padrão: ${THRESHOLD_ACCESSIBILITY})
  -b, --bp N          Limite mínimo de Boas Práticas (padrão: ${THRESHOLD_BEST_PRACTICES})
  -s, --seo N         Limite mínimo de SEO (padrão: ${THRESHOLD_SEO})
  -h, --help          Exibir esta ajuda

${BOLD}Exemplos:${RESET}
  $(basename "$0")                                    # Auditar URLs padrão
  $(basename "$0") http://localhost:3000               # Auditar URL específica
  $(basename "$0") -j -p 85 http://localhost:3000      # JSON + performance >= 85
  $(basename "$0") --json --output ./reports           # Salvar JSON em diretório customizado

${BOLD}URLs padrão:${RESET}
$(printf '  • %s\n' "${DEFAULT_URLS[@]}")
EOF
  exit 0
}

# Verifica se Lighthouse está disponível
check_lighthouse() {
  if command -v lighthouse &>/dev/null; then
    local version
    version="$(lighthouse --version 2>/dev/null || echo 'desconhecida')"
    print_info "Lighthouse instalado: v${version}"
    return 0
  fi

  # Tenta via npx
  if command -v npx &>/dev/null; then
    print_info "Lighthouse não instalado globalmente — usando npx"
    LIGHTHOUSE_CMD="npx lighthouse"
    return 0
  fi

  echo -e "\n${RED}${BOLD}Erro: Lighthouse CLI não encontrado!${RESET}\n"
  echo -e "Instale com um dos comandos abaixo:\n"
  echo -e "  ${CYAN}npm install -g lighthouse${RESET}"
  echo -e "  ${CYAN}yarn global add lighthouse${RESET}"
  echo -e "  ${CYAN}pnpm add -g lighthouse${RESET}\n"
  echo -e "Ou use diretamente via npx (requer Node.js):\n"
  echo -e "  ${CYAN}npx lighthouse <url>${RESET}\n"
  exit 1
}

# Comando do Lighthouse (global ou npx)
LIGHTHOUSE_CMD="lighthouse"

# Verifica se a URL responde antes de auditar
check_url_reachable() {
  local url="$1"
  if command -v curl &>/dev/null; then
    if curl -sf --max-time 5 -o /dev/null "$url" 2>/dev/null; then
      return 0
    fi
  elif command -v wget &>/dev/null; then
    if wget -q --spider --timeout=5 "$url" 2>/dev/null; then
      return 0
    fi
  fi
  return 1
}

# Executa a auditoria Lighthouse para uma URL
# Extrai pontuações do JSON e compara com os limites
run_audit() {
  local url="$1"
  local url_slug
  url_slug="$(echo "$url" | sed 's|https\?://||;s|[/:?&=]|_|g')"
  local timestamp
  timestamp="$(date +%Y%m%d_%H%M%S)"
  local json_path="${REPORTS_DIR}/${url_slug}_${timestamp}.json"
  local url_passed=true

  echo -e "\n${BOLD}${CYAN}─── Auditando: ${url} ───${RESET}\n"

  # Verifica alcançabilidade
  if ! check_url_reachable "$url"; then
    print_fail "URL não acessível: ${url}"
    FAILED_AUDITS=$((FAILED_AUDITS + 1))
    TOTAL_AUDITS=$((TOTAL_AUDITS + 1))
    return 1
  fi

  print_info "URL acessível — iniciando auditoria..."

  # Cria diretório de relatórios se necessário
  mkdir -p "$REPORTS_DIR"

  # Executa Lighthouse e captura o JSON
  local tmp_json
  tmp_json="$(mktemp)"

  if ! $LIGHTHOUSE_CMD "$url" \
    --output=json \
    --output-path="$tmp_json" \
    --chrome-flags="$CHROME_FLAGS" \
    --quiet \
    2>/dev/null; then
    print_fail "Erro ao executar Lighthouse para ${url}"
    rm -f "$tmp_json"
    FAILED_AUDITS=$((FAILED_AUDITS + 1))
    TOTAL_AUDITS=$((TOTAL_AUDITS + 1))
    return 1
  fi

  # Extrai pontuações (Lighthouse retorna valores de 0 a 1)
  local perf acc bp seo
  perf="$(node -e "const r=require('$tmp_json');console.log(Math.round((r.categories.performance?.score||0)*100))" 2>/dev/null || echo "0")"
  acc="$(node -e "const r=require('$tmp_json');console.log(Math.round((r.categories.accessibility?.score||0)*100))" 2>/dev/null || echo "0")"
  bp="$(node -e "const r=require('$tmp_json');console.log(Math.round((r.categories['best-practices']?.score||0)*100))" 2>/dev/null || echo "0")"
  seo="$(node -e "const r=require('$tmp_json');console.log(Math.round((r.categories.seo?.score||0)*100))" 2>/dev/null || echo "0")"

  # Avalia cada categoria contra o limite
  evaluate_score "Performance" "$perf" "$THRESHOLD_PERFORMANCE" || url_passed=false
  evaluate_score "Acessibilidade" "$acc" "$THRESHOLD_ACCESSIBILITY" || url_passed=false
  evaluate_score "Boas Práticas" "$bp" "$THRESHOLD_BEST_PRACTICES" || url_passed=false
  evaluate_score "SEO" "$seo" "$THRESHOLD_SEO" || url_passed=false

  # Salva ou descarta o JSON
  if $OUTPUT_JSON; then
    mv "$tmp_json" "$json_path"
    print_info "Relatório JSON salvo: ${json_path#"$PROJECT_ROOT"/}"
  else
    rm -f "$tmp_json"
  fi

  TOTAL_AUDITS=$((TOTAL_AUDITS + 1))
  if $url_passed; then
    PASSED_AUDITS=$((PASSED_AUDITS + 1))
    echo -e "\n  ${GREEN}${BOLD}→ PASSOU${RESET} ${DIM}(${url})${RESET}"
  else
    FAILED_AUDITS=$((FAILED_AUDITS + 1))
    echo -e "\n  ${RED}${BOLD}→ FALHOU${RESET} ${DIM}(${url})${RESET}"
  fi
}

# Avalia uma pontuação contra o limite configurado
evaluate_score() {
  local category="$1"
  local score="$2"
  local threshold="$3"

  # Formata a barra visual de pontuação
  local bar_len=20
  local filled=$((score * bar_len / 100))
  local empty=$((bar_len - filled))
  local bar=""

  local color="$GREEN"
  if [[ $score -lt $threshold ]]; then
    color="$RED"
  elif [[ $score -lt $((threshold + 5)) ]]; then
    color="$YELLOW"
  fi

  bar="${color}"
  for ((i = 0; i < filled; i++)); do bar+="█"; done
  bar+="${DIM}"
  for ((i = 0; i < empty; i++)); do bar+="░"; done
  bar+="${RESET}"

  local status
  if [[ $score -ge $threshold ]]; then
    status="${GREEN}PASS${RESET}"
    printf "  %-18s %s %s %3d/100 (mín: %d)\n" "$category:" "$bar" "$status" "$score" "$threshold"
    return 0
  else
    status="${RED}FAIL${RESET}"
    printf "  %-18s %s %s %3d/100 (mín: %d)\n" "$category:" "$bar" "$status" "$score" "$threshold"
    return 1
  fi
}

# --- Processamento de argumentos ---
URLS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    -j|--json)
      OUTPUT_JSON=true
      shift
      ;;
    -o|--output)
      REPORTS_DIR="$2"
      shift 2
      ;;
    -p|--perf)
      THRESHOLD_PERFORMANCE="$2"
      shift 2
      ;;
    -a|--a11y)
      THRESHOLD_ACCESSIBILITY="$2"
      shift 2
      ;;
    -b|--bp)
      THRESHOLD_BEST_PRACTICES="$2"
      shift 2
      ;;
    -s|--seo)
      THRESHOLD_SEO="$2"
      shift 2
      ;;
    -h|--help)
      usage
      ;;
    http*|localhost*)
      URLS+=("$1")
      shift
      ;;
    *)
      echo -e "${RED}Argumento desconhecido: $1${RESET}"
      echo "Use --help para ver as opções disponíveis."
      exit 1
      ;;
  esac
done

# Usa URLs padrão se nenhuma foi fornecida
if [[ ${#URLS[@]} -eq 0 ]]; then
  URLS=("${DEFAULT_URLS[@]}")
fi

# --- Execução principal ---

print_header "Auditoria Lighthouse CI"

check_lighthouse

echo -e "${BOLD}Configuração:${RESET}"
echo -e "  Performance    ≥ ${THRESHOLD_PERFORMANCE}"
echo -e "  Acessibilidade ≥ ${THRESHOLD_ACCESSIBILITY}"
echo -e "  Boas Práticas  ≥ ${THRESHOLD_BEST_PRACTICES}"
echo -e "  SEO            ≥ ${THRESHOLD_SEO}"
echo -e "  Saída JSON:      $(if $OUTPUT_JSON; then echo 'Sim'; else echo 'Não'; fi)"
echo -e "  URLs a auditar:  ${#URLS[@]}"

# Executa auditoria para cada URL
for url in "${URLS[@]}"; do
  run_audit "$url" || true
done

# --- Relatório final ---
print_header "Resumo da Auditoria"

echo -e "  ${BOLD}Total de URLs auditadas:${RESET}  ${TOTAL_AUDITS}"
echo -e "  ${GREEN}${BOLD}Aprovadas:${RESET}               ${PASSED_AUDITS}"
echo -e "  ${RED}${BOLD}Reprovadas:${RESET}              ${FAILED_AUDITS}"

echo ""
if [[ $FAILED_AUDITS -eq 0 && $TOTAL_AUDITS -gt 0 ]]; then
  echo -e "  ${GREEN}${BOLD}✓ TODAS AS AUDITORIAS PASSARAM!${RESET}"
  echo ""
  exit 0
elif [[ $TOTAL_AUDITS -eq 0 ]]; then
  echo -e "  ${YELLOW}${BOLD}⚠ Nenhuma URL foi auditada com sucesso${RESET}"
  echo ""
  exit 1
else
  echo -e "  ${RED}${BOLD}✗ ${FAILED_AUDITS} URL(s) REPROVADA(S)${RESET}"
  echo ""
  exit 1
fi
