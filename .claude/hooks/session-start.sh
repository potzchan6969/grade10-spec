#!/usr/bin/env bash
# Cloud sessions only: pin Node, check out the submodule the workspace reads,
# then install. Synchronous on purpose, so tests and lint are ready when the
# session starts. Safe to re-run.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

log() {
  printf '[session-start] %s\n' "$*" >&2
}

# Node: package.json engines pins 24.14.1; the image ships 22.
node_version="$(node -p "require('./package.json').engines.node")"
if [ "$(node -v 2>/dev/null || true)" != "v$node_version" ]; then
  node_dir="$HOME/.cache/grade10-spec/node-v$node_version"
  if [ ! -x "$node_dir/bin/node" ]; then
    case "$(uname -m)" in
      x86_64) arch=x64 ;;
      aarch64 | arm64) arch=arm64 ;;
      *) log "unsupported architecture $(uname -m)"; exit 1 ;;
    esac
    archive="node-v$node_version-linux-$arch.tar.xz"
    base="https://nodejs.org/dist/v$node_version"
    tmp="$(mktemp -d)"
    trap 'rm -rf "$tmp"' EXIT
    log "installing Node v$node_version"
    curl -fsSL "$base/$archive" -o "$tmp/$archive"
    curl -fsSL "$base/SHASUMS256.txt" -o "$tmp/SHASUMS256.txt"
    (cd "$tmp" && grep -F "  $archive" SHASUMS256.txt | sha256sum -c -)
    mkdir -p "$node_dir"
    tar -xJf "$tmp/$archive" -C "$node_dir" --strip-components=1
  fi
  export PATH="$node_dir/bin:$PATH"
  if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
    echo "export PATH=\"$node_dir/bin:\$PATH\"" >> "$CLAUDE_ENV_FILE"
  fi
fi

git submodule update --init tools/openspec-viewer

export CI=true
pnpm install --frozen-lockfile
