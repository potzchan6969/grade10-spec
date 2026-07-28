# Design

pnpm 11's `enableGlobalVirtualStore` shares package dependency graphs through the trusted user's normal pnpm store while retaining separate, lightweight resolver links in each worktree. The workspace stays on pnpm's isolated linker and does not configure a shared conventional virtual-store directory.

The root lockfile remains the only lockfile. `setup:worktree` and `cache:prime` perform a frozen, prefer-offline root install that safely populates the shared package store; `setup:browsers` installs Playwright Chromium into its user-level cache; and `test:stories` is the canonical browser-test entry point.

The root Storybook launcher asks the OS for a free port, then starts the UI Storybook process on that port. Additional Storybook CLI arguments are forwarded from the root command, so a contributor can override the port when needed.

Durable decisions remain in versioned repository artifacts. Temporary task notes remain in their owning task/chat, preventing a shared mutable note from causing worktree merge conflicts.

Validation covers frozen root installation, concurrent Storybook startup, concurrent browser tests after Chromium setup, and the existing component build/check and lint commands.
