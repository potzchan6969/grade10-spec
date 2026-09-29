#!/usr/bin/env bash
# `run.mjs --agent` for Claude Code: claude-agent.sh <read|write> <prompt-file>
#
# One call is one headless `claude -p`. `read` gets no editing tool; run.mjs
# fails a read step that changed the tree anyway, whatever wrote it. `write`
# may edit and run commands but never commit or push.
set -euo pipefail

mode=${1:?mode is read or write}
prompt_file=${2:?prompt file}

case "$mode" in
  read) tools=(--allowedTools "Read" "Grep" "Glob" "Bash" --disallowedTools "Edit" "Write" "NotebookEdit") ;;
  write) tools=(--allowedTools "Read" "Grep" "Glob" "Bash" "Edit" "Write" --disallowedTools "Bash(git commit:*)" "Bash(git push:*)" "Bash(git reset:*)") ;;
  *) echo "mode is read or write, not $mode" >&2; exit 2 ;;
esac

claude -p --permission-mode acceptEdits "${tools[@]}" --output-format text \
  "Read $prompt_file and do exactly what it asks. Your final answer is what it asks you to return, and nothing else."
