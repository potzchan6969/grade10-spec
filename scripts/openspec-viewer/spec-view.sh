#!/usr/bin/env bash

set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root_dir"

viewer="tools/openspec-viewer"

# --remote checks out the tip of the branch .gitmodules names rather than the
# commit this repository records, so every run serves the current viewer. The
# pointer it leaves behind is a normal submodule bump: commit it to record the
# version, or `git checkout -- tools/openspec-viewer` to drop it.
echo "Fetching the viewer:"
git submodule update --init --remote --merge -- "$viewer"
git submodule status -- "$viewer" | sed 's/^/  /'

# The submodule is its own pnpm root — its own pnpm-workspace.yaml, lockfile and
# build allowlist — so this installs and builds the viewer without touching this
# repository's workspace. It also carries its own `packageManager` pin, which
# corepack refuses to switch to from the version this repository pins; the viewer
# is not this repository's dependency, so its pin is downgraded to a warning
# rather than tracked here.
echo
echo "Building the viewer:"
pnpm --dir "$viewer" --pm-on-fail=ignore install
pnpm --dir "$viewer" --pm-on-fail=ignore run build

# The viewer resolves the store by running the openspec CLI in its own cwd, so it
# starts from the repository root. This repository is the store itself and has no
# wrapper around the CLI, so the claim commands it prints are bare `openspec`.
echo
exec node "$viewer/bin/openspec-viewer.mjs" "$@"
