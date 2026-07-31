# AceTrader product specifications

Versioned product requirements and the design system for AceTrader applications.

## What belongs here

- Product managers and designers write durable PRDs in [`docs/prds/`](docs/prds/README.md).
- Product and engineering teams describe implementation deltas in [`openspec/`](openspec/README.md).
- Theme tokens and shadcn primitives live in [`packages/design-system/`](packages/design-system/DESIGN.md), including the two-way Figma token pipeline.
- Versioned Pencil design files live in [`designs/`](designs/README.md).
- [`apps/ui/`](apps/ui/) is a Storybook workbench; it is not a production application.

Product UI components are implemented in the applications that render them. This repository records their contracts, not their source: the former `packages/ui-components` package was removed, and `FeaturedMarkets` now lives in the prediction application under `apps/web/src/features/featured-markets/`.

Read [`AGENTS.md`](AGENTS.md) before using an AI agent in this repository. It defines the source-of-truth boundaries and the requirements for component contracts.

[`docs/governance/prd-and-openspec.md`](docs/governance/prd-and-openspec.md) explains why PRDs and OpenSpec are both used and how agents must keep their records aligned.

## Quick start

```bash
pnpm setup:worktree
pnpm storybook                     # apps/ui workbench
pnpm storybook:design-system       # design-system primitives
```

For concurrent worktrees, install Playwright once before running browser tests:

```bash
pnpm setup:browsers
pnpm test:stories
```

See the [worktree development guide](docs/governance/worktree-development.md) for shared-store setup, concurrent Storybook instances, and durable project knowledge.

Useful checks:

```bash
pnpm run agent:check-parity
pnpm run check:design-system
pnpm run tokens:build
pnpm run typecheck
pnpm run lint
```

## Consume this repository via Git submodule

In a consuming app repository, add this repository at a stable vendor path:

```bash
git submodule add git@github.com:9gag/acetrader-predictions-spec.git vendor/pred-spec
```

The app reads the PRDs, the OpenSpec changes, and the design tokens from that path, and implements the components itself. Pin the submodule SHA in the app repository; updates are normal pull requests that move that SHA.
