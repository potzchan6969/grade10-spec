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

if [ ! -d .cursor/skills ] || [ ! -d .codex/skills ]; then
  fail "Both .cursor/skills and .codex/skills are required"
else
  cursor_manifest="$(mktemp)"
  codex_manifest="$(mktemp)"
  trap 'rm -f "$cursor_manifest" "$codex_manifest"' EXIT

  find .cursor/skills -type f | sed 's#^\.cursor/skills/##' | sort > "$cursor_manifest"
  find .codex/skills -type f | sed 's#^\.codex/skills/##' | sort > "$codex_manifest"

  if diff -u "$cursor_manifest" "$codex_manifest" >/dev/null; then
    pass "Skill manifests match"
  else
    fail "Skill manifests differ"
    diff -u "$cursor_manifest" "$codex_manifest" || true
  fi

  while IFS= read -r relative_path; do
    if cmp -s ".cursor/skills/$relative_path" ".codex/skills/$relative_path"; then
      pass "Skill matches: $relative_path"
    else
      fail "Skill differs: $relative_path"
    fi
  done < "$cursor_manifest"
fi

if [ "$failures" -gt 0 ]; then
  exit 1
fi

echo "Agent parity check passed."
