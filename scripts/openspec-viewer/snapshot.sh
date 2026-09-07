#!/usr/bin/env bash

# Writes the OpenSpec viewer into the manual's build as files, so the hosted
# manual serves the same page `pnpm spec:view` does under /viewer/, with every
# answer it would give filed as JSON beside it and nothing running behind them.
#
#   bash scripts/openspec-viewer/snapshot.sh [<out-dir>] [--no-validate]
#
# The out directory defaults to tools/manual/dist/viewer, which is where the
# manual's deploy picks it up; `pnpm run manual:build` runs this after the
# manual's own build. The openspec CLI has to be on PATH — the viewer resolves
# the store through it, and validates each change in development with it.

set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root_dir"

viewer="tools/openspec-viewer"
out="${1:-tools/manual/dist/viewer}"
shift $(( $# > 0 ? 1 : 0 ))

# The pinned pointer, not the newest release. `spec:view` moves the submodule
# to the latest tag because a person at a terminal wants the newest page; a
# build wants the viewer this commit records, so that the deployed snapshot
# can be reproduced from the commit that made it.
case "$(git submodule status -- "$viewer")" in
  -*) git submodule update --init -- "$viewer" ;;
esac

if ! command -v openspec >/dev/null 2>&1; then
  echo "openspec CLI is not on PATH; the viewer resolves the store through it." >&2
  echo "  npm install -g @fission-ai/openspec" >&2
  exit 1
fi

# The submodule is its own pnpm root — see spec-view.sh for why its
# packageManager pin is a warning here rather than an error.
echo "Building the viewer at $(git -C "$viewer" describe --tags --always):"
pnpm --dir "$viewer" --pm-on-fail=ignore install --frozen-lockfile
pnpm --dir "$viewer" --pm-on-fail=ignore run build

echo
node "$viewer/bin/openspec-viewer.mjs" snapshot "$out" "$@"
