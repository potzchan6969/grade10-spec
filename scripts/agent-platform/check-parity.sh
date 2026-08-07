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

# .cursor/skills is the source of truth; the legs below are byte-for-byte copies of it,
# one per agent platform that reads project skills from its own directory.
source_dir=".cursor/skills"
legs=(.codex/skills .claude/skills)

# Relative paths under a skill directory, so a manifest is comparable across legs.
manifest_of() {
  (cd "$1" && find . -type f | sed 's#^\./##' | sort)
}

if [ ! -d "$source_dir" ]; then
  fail "$source_dir is required as the skill source of truth"
else
  missing_leg=0
  for leg in "${legs[@]}"; do
    if [ ! -d "$leg" ]; then
      fail "$leg is required — run pnpm run agent:sync-parity"
      missing_leg=1
    fi
  done

  if [ "$missing_leg" -eq 0 ]; then
    source_manifest="$(mktemp)"
    leg_manifest="$(mktemp)"
    trap 'rm -f "$source_manifest" "$leg_manifest"' EXIT

    manifest_of "$source_dir" > "$source_manifest"

    for leg in "${legs[@]}"; do
      manifest_of "$leg" > "$leg_manifest"

      if diff -u "$source_manifest" "$leg_manifest" >/dev/null; then
        pass "Skill manifest matches: $leg"
      else
        fail "Skill manifest differs: $leg"
        diff -u "$source_manifest" "$leg_manifest" || true
      fi

      while IFS= read -r relative_path; do
        if cmp -s "$source_dir/$relative_path" "$leg/$relative_path"; then
          pass "Skill matches: $leg/$relative_path"
        else
          fail "Skill differs: $leg/$relative_path"
        fi
      done < "$source_manifest"
    done
  fi
fi

if [ "$failures" -gt 0 ]; then
  exit 1
fi

echo "Agent parity check passed."
