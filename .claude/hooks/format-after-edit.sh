#!/usr/bin/env bash
# PostToolUse (Edit|Write): run oxfmt on the changed file.
# oxfmt does not support .astro, so only the file types it covers are formatted (gap raised in SETUP.md).
file=$(jq -r '.tool_input.file_path // empty')
[ -z "$file" ] && exit 0

case "$file" in
  *.ts | *.mts | *.js | *.mjs | *.css) ;;
  *) exit 0 ;;
esac

cd "${CLAUDE_PROJECT_DIR:-$PWD}" || exit 0
pnpm exec oxfmt "$file" >/dev/null 2>&1
exit 0
