#!/usr/bin/env bash
# PreToolUse (Bash): on `git commit`, run test, lint, format:check and check. Block (exit 2) on any failure.
# pnpm build is left out of the gate because it is slow; the pre-commit-validation skill runs it.
cmd=$(jq -r '.tool_input.command // empty')

if ! printf '%s' "$cmd" | grep -Eq '(^|[;&|[:space:]])git([[:space:]]+-[^[:space:]]+)*[[:space:]]+commit([[:space:]]|$)'; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$PWD}" || exit 0

for script in test lint format:check check; do
  if ! out=$(pnpm run --silent "$script" 2>&1); then
    echo "Blocked: 'pnpm $script' failed. Fix it before committing." >&2
    printf '%s\n' "$out" | tail -40 >&2
    exit 2
  fi
done
exit 0
