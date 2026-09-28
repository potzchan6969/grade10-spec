#!/usr/bin/env bash
# `run.mjs --agent` for the Cursor CLI: cursor-agent.sh <read|write> <prompt-file>
#
# One call is one sandboxed `agent -p` with no network. `read` may run
# commands but writes no file through the agent's own tools; run.mjs fails a
# read step that changed the tree anyway, whatever wrote it. A prompt past
# what one argument can carry is read from its file instead.
set -euo pipefail

mode=${1:?mode is read or write}
prompt_file=${2:?prompt file}
: "${CURSOR_MODEL:?set CURSOR_MODEL}"

config=$(mktemp -d)
trap 'rm -rf "$config"' EXIT
case "$mode" in
  read) permissions='{"allow":["Read(**)","Shell(*)"],"deny":["Write(**)","Read(.env*)"]}' ;;
  write) permissions='{"allow":["Read(**)","Write(**)","Shell(*)"],"deny":["Read(.env*)","Write(.env*)","Shell(git commit*)","Shell(git push*)"]}' ;;
  *) echo "mode is read or write, not $mode" >&2; exit 2 ;;
esac
printf '{"permissions":%s}' "$permissions" > "$config/cli-config.json"
printf '%s' '{"networkPolicy":{"default":"deny","allow":[]}}' > "$config/sandbox.json"

prompt=$(<"$prompt_file")
if [ "${#prompt}" -gt 100000 ]; then
  prompt="Read $prompt_file and do exactly what it asks. Your answer is what it asks you to return, and nothing else."
fi

CURSOR_CONFIG_DIR="$config" agent -p --force --model "$CURSOR_MODEL" --output-format text "$prompt"
