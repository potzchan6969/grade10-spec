# Grade10 product specifications

Versioned product requirements and the design system for Grade10 applications.

## What belongs here

- Durable requirements and component export contracts live in [`openspec/specs/`](openspec/README.md); implementation deltas live alongside them in `openspec/changes/`.
- Product managers and designers record the decision behind a requirement — problem, users, non-goals, measurement, rollout — in [`docs/prds/`](docs/prds/README.md).
- Theme tokens and shadcn primitives live in [`packages/design-system/`](packages/design-system/DESIGN.md), including the two-way Figma token pipeline.
- Shared compound components live in [`packages/ui/`](packages/ui/), one directory per capability, consumed from source.
- [`apps/preview/`](apps/preview/) is the cross-package preview app, where whole pages are assembled from both packages; it is not a production application.

A compound component named by a capability spec is implemented once here, in `packages/ui`, and every application imports it rather than keeping its own copy. Applications still own their data, routing, stores, and adapters.

Read [`AGENTS.md`](AGENTS.md) before using an AI agent in this repository. It defines the source-of-truth boundaries and the requirements for component contracts.

[`docs/governance/prd-and-openspec.md`](docs/governance/prd-and-openspec.md) explains why `openspec/specs/` is the single source of truth, what a PRD is still for, and how agents must keep the two aligned.

[`docs/governance/design-system-workflows.md`](docs/governance/design-system-workflows.md) is the router for everything else: which command, skill, and governing document apply to tokens, primitives, blocks, a page conversion, an audit finding, and who owns each call.

## Quick start

```bash
pnpm setup:worktree
pnpm storybook                     # cross-package page assemblies
pnpm storybook:workbench           # those assemblies plus both packages' stories
pnpm storybook:design-system       # design-system primitives alone
pnpm storybook:ui                  # shared compound components alone
```

The workbench Storybook on `main` (preview pages + UI + design-system) is
published at
[https://storybook.grade10-stg.com](https://storybook.grade10-stg.com).
Locally that is `pnpm storybook:workbench`.

For concurrent worktrees, install Playwright once before running browser tests:

```bash
pnpm setup:browsers
pnpm test:stories
```

See the [worktree development guide](docs/governance/worktree-development.md) for shared-store setup, concurrent Storybook instances, and durable project knowledge.

Useful checks:

```bash
pnpm run agent:check-parity
pnpm run design-sync:check
pnpm run tokens:build
pnpm run typecheck
pnpm run lint
```

## Consume this repository via Git submodule

In a consuming app repository, add this repository at a stable vendor path:

```bash
git submodule add git@github.com:9gag/grade10-spec.git vendor/grade10-spec
```

The app reads the PRDs, the OpenSpec changes, and the design tokens from that path, and implements the components itself. Pin the submodule SHA in the app repository; updates are normal pull requests that move that SHA.
