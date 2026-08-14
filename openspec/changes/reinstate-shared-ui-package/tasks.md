# Tasks: reinstate a shared compound-component package

## 1. Package scaffolding (owner: @seankcw)

- [x] 1.1 Create `packages/ui` as `@grade10/ui` with source `exports` (`.` and `./components/*`), `react`/`react-dom` peers, and a workspace dependency on `@grade10/design-system`
- [x] 1.2 Add the package `tsconfig.json` and wire it into the root `pnpm run typecheck` and `pnpm run lint`
- [x] 1.3 Add Storybook setup mirroring the design system (a11y and vitest addons) and a root `storybook:ui` script
- [x] 1.4 Verify an empty-package baseline: root typecheck, lint, and Storybook boot pass

## 2. Governance and records (owner: @seankcw)

- [x] 2.1 Update `AGENTS.md` (package list, component-source statements) and run `pnpm run agent:sync-parity` then `pnpm run agent:check-parity`
- [x] 2.2 Update `docs/governance/ui-component-contracts.md` so implementation obligations point at `packages/ui` instead of the consuming application
- [x] 2.3 Add the `shared-ui` grouping to `openspec/specs/README.md` and the `openspec/config.yaml` context
- [ ] 2.4 After delivery is confirmed, fold the accepted deltas into `openspec/specs/` and archive this change
