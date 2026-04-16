#!/usr/bin/env bash
# Safe Commands Hook — blocks dangerous shell commands before execution.
# Returns JSON with permission: "deny" for blocked commands.

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.command // ""')

BLOCKED_PATTERNS=(
  "rm -rf /"
  "rm -rf /*"
  "git push --force.*main"
  "git push --force.*master"
  "git push -f.*main"
  "git push -f.*master"
  "git reset --hard"
  "> /dev/sda"
  "mkfs\."
  "dd if=/dev/zero"
)

for pattern in "${BLOCKED_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qEi "$pattern"; then
    echo "{\"permission\": \"deny\", \"userMessage\": \"Blocked dangerous command: ${COMMAND}\"}"
    exit 0
  fi
done

echo '{"permission": "allow"}'
