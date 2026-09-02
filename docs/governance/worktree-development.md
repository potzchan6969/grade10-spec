# Worktree development

This repository supports parallel Git worktrees without duplicating its package contents or browser binaries. pnpm 11 uses a global virtual store, so each worktree retains only the resolver links that Node.js needs while downloaded package contents and dependency graphs are shared by the current trusted user on the same filesystem.

## Start a worktree

Use the pinned pnpm version and install from the workspace root. The root `pnpm-lock.yaml` is the only lockfile used by this repository.

```bash
pnpm cache:prime
pnpm setup:worktree
```

`cache:prime` is optional after a machine has a warm pnpm store. It uses the same safe frozen install as `setup:worktree`, so it primes the shared store without pnpm's experimental fetch mode purging the current worktree's resolver links. Setup is intentionally explicit: Storybook and tests never mutate dependencies or reach the network as an implicit side effect.

The first machine setup for browser tests also needs Chromium:

```bash
pnpm setup:browsers
```

Playwright keeps that browser in its normal user-level cache, not in an individual worktree.

## Run worktrees concurrently

Start Storybook from each worktree with the same command:

```bash
pnpm storybook
```

The root launcher asks the operating system for an available port before it starts Storybook and prints that port and the local URL. To choose a stable port, pass it through to Storybook:

```bash
pnpm storybook -- --port 6010
```

Run browser interaction tests with `pnpm test:stories`. Concurrent test processes are supported after the shared Chromium installation is available.

## Knowledge and cleanup

Keep durable, cross-worktree knowledge in this order:

1. `AGENTS.md` for repository-wide operating rules.
2. `docs/governance/` for durable development and component policies.
3. `openspec/specs/` for durable requirements and component export contracts.
4. Active `openspec/changes/` for approved, in-flight delivery decisions.
5. `docs/prds/` — the manual's pages — for the shape of a capability and the product decision behind its requirements.

Keep temporary task notes in the task or chat that owns them. Do not add a shared scratch file to Git: concurrent worktrees would create unnecessary merge conflicts.

When a clean worktree is no longer needed, remove it with `git worktree remove <path>`. The pnpm store is shared state; prune it only after stopping worktrees that may still rely on its cached packages.

## Intentional limits

Each worktree still needs a small `node_modules` resolver structure, and tools may create disposable build artifacts while they run. Those paths are not package copies or a per-worktree package cache. Do not configure multiple worktrees to share a normal pnpm virtual-store directory; pnpm does not support that layout. The shared store must be writable only by mutually trusted users and processes.
