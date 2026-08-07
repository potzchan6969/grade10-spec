#!/usr/bin/env bash

set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root_dir"

ln -sfn AGENTS.md AGENT.md
ln -sfn AGENTS.md CLAUDE.md
ln -sfn AGENTS.md GEMINI.md

# .cursor/skills is the source; every other leg is a generated copy of it, so each is
# removed before it is rewritten. Without that, a skill deleted from the source lingers
# in a leg and check-parity fails on a manifest diff nothing here can resolve.
for leg in .codex/skills .claude/skills; do
  rm -rf "$leg"
  mkdir -p "$leg"
  cp -R .cursor/skills/. "$leg/"
done

echo "Synced root agent aliases and Cursor skills to Codex and Claude."
