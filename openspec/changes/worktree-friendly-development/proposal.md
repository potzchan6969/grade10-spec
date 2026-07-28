# Worktree-friendly development

PRD: Not applicable. This is a technical-refactor change with no product-visible behavior.

## Why

Parallel component work currently repeats package installation per Git worktree, hard-codes Storybook to one port, and has no documented boundary between durable repository knowledge and transient task notes.

## Scope

- Use pnpm's global virtual store for local development and make the root lockfile authoritative.
- Add explicit bootstrap, cache-priming, browser-installation, and Storybook-test commands.
- Allow concurrent Storybook instances through OS-assigned ports.
- Document worktree setup, shared knowledge, cleanup, and supported limitations.

## Consumer impact

No public component exports, package runtime behavior, or consuming applications change. Contributors gain a documented local-development workflow.

## Non-goals

No product requirements, UI components, dependency upgrades, CI cache design, external knowledge system, or automatic install-on-start behavior is added.
