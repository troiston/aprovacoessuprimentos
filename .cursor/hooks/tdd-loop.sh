#!/usr/bin/env bash
# TDD Loop Hook — continues agent iteration until scratchpad contains DONE
# Inspired by Cursor's "grind" pattern for iterative agent loops.
# Max iterations configurable via CURSOR_TDD_MAX_ITERATIONS (default: 5).

set -euo pipefail

MAX_ITERATIONS="${CURSOR_TDD_MAX_ITERATIONS:-5}"
SCRATCHPAD=".cursor/scratchpad.md"

INPUT=$(cat)
STATUS=$(echo "$INPUT" | jq -r '.status // "completed"')
LOOP_COUNT=$(echo "$INPUT" | jq -r '.loop_count // 0')

if [ "$STATUS" != "completed" ] || [ "$LOOP_COUNT" -ge "$MAX_ITERATIONS" ]; then
  echo '{}'
  exit 0
fi

if [ -f "$SCRATCHPAD" ] && grep -q "DONE" "$SCRATCHPAD"; then
  echo '{}'
  exit 0
fi

echo "{\"followup_message\": \"[Iteration $((LOOP_COUNT + 1))/${MAX_ITERATIONS}] Tests or task not yet complete. Continue working. Update ${SCRATCHPAD} with DONE when finished.\"}"
