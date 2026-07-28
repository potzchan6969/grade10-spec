#!/usr/bin/env bash

set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root_dir"

ln -sfn AGENTS.md AGENT.md
ln -sfn AGENTS.md CLAUDE.md
ln -sfn AGENTS.md GEMINI.md

mkdir -p .codex/skills
cp -R .cursor/skills/. .codex/skills/

echo "Synced root agent aliases and Cursor skills to Codex."
