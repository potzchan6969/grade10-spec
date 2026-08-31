#!/usr/bin/env bash

set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root_dir"

failures=0

fail() {
  echo "[FAIL] $1"
  failures=$((failures + 1))
}

pass() {
  echo "[PASS] $1"
}

for alias in AGENT.md CLAUDE.md GEMINI.md; do
  if [ -L "$alias" ] && [ "$(readlink "$alias")" = "AGENTS.md" ]; then
    pass "$alias points to AGENTS.md"
  else
    fail "$alias must be a symlink to AGENTS.md"
  fi
done

# .claude/skills is canonical; the other platform paths are symlinks to it.
source_dir=".claude/skills"
for leg in .codex/skills .cursor/skills; do
  if [ -L "$leg" ] && [ "$(readlink "$leg")" = "../.claude/skills" ]; then
    pass "$leg points to $source_dir"
  else
    fail "$leg must be a symlink to ../.claude/skills"
  fi
done

if [ ! -d "$source_dir" ]; then
  fail "$source_dir is required as the skill source of truth"
fi


if [ "$failures" -gt 0 ]; then
  exit 1
fi

echo "Agent parity check passed."
