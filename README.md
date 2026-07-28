# AceTrader product specifications

Versioned product requirements and portable React UI components for AceTrader applications.

## What belongs here

- Product managers and designers write durable PRDs in [`docs/prds/`](docs/prds/README.md).
- Product and engineering teams describe implementation deltas in [`openspec/`](openspec/README.md).
- Stateless, app-neutral React components live in [`packages/ui-components/`](packages/ui-components/README.md).
- [`apps/ui/`](apps/ui/) is the Storybook workbench for reviewing those components; it is not a production application.

Read [`AGENTS.md`](AGENTS.md) before using an AI agent in this repository. It defines the source-of-truth boundaries and the requirements for portable components.

[`docs/governance/prd-and-openspec.md`](docs/governance/prd-and-openspec.md) explains why PRDs and OpenSpec are both used and how agents must keep their records aligned.

## Quick start

```bash
pnpm setup:worktree
pnpm storybook
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
pnpm run check:components
pnpm run build:components
pnpm run lint
```

## Consume the UI package via Git submodule

In a consuming app repository, add this repository at a stable vendor path, then add the package as a file dependency:

```bash
git submodule add git@github.com:9gag/acetrader-predictions-spec.git vendor/pred-spec
pnpm add file:vendor/pred-spec/packages/ui-components
```

The app can then import components from `@acetrader/pred-spec-ui`. Pin the submodule SHA in the app repository; updates are normal pull requests that move that SHA. See the [package consumer guide](packages/ui-components/README.md) for update and local-development details.
