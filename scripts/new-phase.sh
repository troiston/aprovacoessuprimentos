#!/usr/bin/env bash
# new-phase.sh — Inicia uma nova fase do VibeCoding
# Uso: bash scripts/new-phase.sh <numero_fase>
# Ex:  bash scripts/new-phase.sh 00  (cria docs/00_VALIDATION.md a partir do template)
set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Uso: bash scripts/new-phase.sh <prefixo_doc>"
  echo "Exemplos:"
  echo "  bash scripts/new-phase.sh 00    → cria docs/00_VALIDATION.md"
  echo "  bash scripts/new-phase.sh 01    → cria docs/01_PRD.md"
  echo "  bash scripts/new-phase.sh 02    → cria docs/02_MONETIZATION.md"
  exit 1
fi

PREFIX="$1"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATES_DIR="$ROOT/docs/templates"
DOCS_DIR="$ROOT/docs"

# Encontrar template correspondente
TEMPLATE=$(find "$TEMPLATES_DIR" -name "${PREFIX}_*.md" -type f | head -1)

if [ -z "$TEMPLATE" ]; then
  echo "ERRO: Template não encontrado para prefixo '${PREFIX}' em $TEMPLATES_DIR"
  echo "Templates disponíveis:"
  ls "$TEMPLATES_DIR"/*.md 2>/dev/null || echo "  Nenhum"
  exit 1
fi

BASENAME=$(basename "$TEMPLATE")
TARGET="$DOCS_DIR/$BASENAME"

if [ -f "$TARGET" ]; then
  echo "Documento $TARGET já existe — não sobrescrevendo"
  exit 0
fi

cp "$TEMPLATE" "$TARGET"
echo "Criado: $TARGET (a partir de $TEMPLATE)"
echo ""
echo "Próximos passos:"
echo "  1. Abra $TARGET e preencha"
echo "  2. Atualize docs/DOCS_INDEX.md com o status"
echo "  3. Ative as skills da fase no Cursor"
