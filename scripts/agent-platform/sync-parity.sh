#!/usr/bin/env bash

set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root_dir"

ln -sfn AGENTS.md AGENT.md
ln -sfn AGENTS.md CLAUDE.md
ln -sfn AGENTS.md GEMINI.md

# .claude/skills is canonical; every other platform path points to the same directory.
mkdir -p .claude/skills
for leg in .codex/skills .cursor/skills; do
  rm -rf "$leg"
  ln -s ../.claude/skills "$leg"
done

echo "Synced root agent aliases and platform skill symlinks."
