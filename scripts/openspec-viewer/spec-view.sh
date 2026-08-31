#!/usr/bin/env bash

set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root_dir"

viewer="tools/openspec-viewer"

# The viewer cuts releases as tags, so a run serves the newest one rather than
# whatever the branch tip happens to hold. The pointer it leaves behind is a
# normal submodule bump: commit it to record the version, or
# `git checkout -- tools/openspec-viewer` to drop it.
echo "Fetching the viewer:"
# Only a fresh clone needs the recorded pointer; past that the release tag
# decides the checkout, so cloning to the pointer first would just churn.
case "$(git submodule status -- "$viewer")" in
  -*) git submodule update --init -- "$viewer" ;;
esac
git -C "$viewer" fetch --tags --force --quiet origin

# versionsort.suffix ranks a prerelease under the release it precedes, so an
# -rc tag never outranks the real thing.
release="$(git -C "$viewer" -c versionsort.suffix=- for-each-ref \
  --count=1 --sort=-v:refname --format='%(refname:strip=2)' 'refs/tags/v[0-9]*')"
if [ -z "$release" ]; then
  echo "  no release tag at $(git -C "$viewer" remote get-url origin)" >&2
  exit 1
fi

git -C "$viewer" checkout --quiet "$release"
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
