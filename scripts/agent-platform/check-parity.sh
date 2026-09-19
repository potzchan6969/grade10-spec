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

# .claude/agents is canonical for the round's challenger and verifier
# definitions, and is mirrored nowhere: every platform reads these files.
agents_dir=".claude/agents"
if [ -d "$agents_dir" ]; then
  pass "$agents_dir holds the round's readers"
else
  fail "$agents_dir is required: the round's challengers and verifier live there"
fi

# Every reader the planning schema dispatches resolves to one of them. The key
# is absent until the change that adds it lands, and an absent key is not a
# failure - an unresolved path is.
schema="openspec/schemas/grade10-planning/schema.yaml"
readers=0
while read -r declaration; do
  [ -n "$declaration" ] || continue
  reader="${declaration##*agent:}"
  reader="$(echo "$reader" | tr -d '[:space:]"'"'")"
  readers=$((readers + 1))
  if [ -f "$reader" ]; then
    pass "the schema's reader $reader resolves"
  else
    fail "the schema names the reader $reader, which resolves to nothing"
  fi
done < <(grep -oE '^[[:space:]]*agent:[[:space:]]*[^[:space:]]+' "$schema" || true)

if [ "$readers" -eq 0 ]; then
  echo "[SKIP] $schema declares no perspectives yet"
fi


if [ "$failures" -gt 0 ]; then
  exit 1
fi

echo "Agent parity check passed."
