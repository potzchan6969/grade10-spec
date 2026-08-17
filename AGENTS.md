# Product specification and design-system repository

This repository is the versioned source of truth for product requirements and the design system beneath Grade10 applications. It is intentionally not an application: do not add product data fetching, authentication, routing, stores, or feature orchestration here.

## Operating principles

- Treat product managers, designers, and engineers as collaborators. Check existing PRDs, specs, primitives, and conventions before proposing a new structure.
- Prefer the smallest reusable artifact. Call out a preference or design-system choice as a choice, not as an objective improvement.
- Keep changes reviewable: one product decision or component capability per pull request where practical.
- Do not modify generated `packages/design-system/src/theme.css` or `src/themes/grade10.css` by hand. Edit `tokens.json` or `tokens.config.json` and regenerate with `pnpm run tokens:build`.

## Sources of truth

| Need | Canonical location | Notes |
| --- | --- | --- |
| Durable requirements and component export contracts | `openspec/specs/<product>/<capability>/spec.md` | The single source of truth. An implementing engineer builds from this alone. Products are listed in `openspec/specs/README.md`. |
| Product decision behind a requirement | `docs/prds/<product-area>/<feature>.md` | Problem, users, non-goals, measurement, rollout, rationale. Explanatory, never authoritative over a requirement. |
| Proposed implementation change | `openspec/changes/<change-name>/` | Delta proposal, design, specs, and tasks; archive after delivery. |
| Design token values | `packages/design-system/tokens.json` | Designer-owned data; the CSS themes are generated projections of it. |
| User-facing copy and translations | `packages/i18n/messages/` | `en.json` is the base catalog; other locales fall back key-by-key. |
| Design-system primitive | `packages/design-system/src/components/` | shadcn primitives and their colocated stories. |
| Product component implementation | `packages/ui/src/blocks/` | Shared compound components, one directory per capability; the capability spec remains the export contract. |
| Task group and owner format in `tasks.md` | `docs/governance/task-ownership.md` | Parsed independently by tooling in this repository and in the application repository. |

If a statement is testable, it belongs in `openspec/specs/` and nowhere else. A PRD holds only what a requirement cannot carry, and links its capability spec rather than restating it. Where the two disagree, the spec is correct.

Read [`docs/governance/prd-and-openspec.md`](docs/governance/prd-and-openspec.md) for the required maintenance lifecycle and a format-selection guide.

## Product specification workflow

Two workflow schemas exist under `openspec/schemas/`, both sharing the same proposal and spec templates. `grade10` (the default: proposal → specs → design → ui → tasks) is for changes that carry their implementation plan here. `pm-planning` (proposal → specs) is for product planning that is complete once the requirements are specified — create one with `openspec new change <name> --schema pm-planning`. A change records its schema in its `.openspec.yaml` at creation.

For a new product feature:

1. Inspect the relevant capability in `openspec/specs/`, active OpenSpec changes, and any related PRD.
2. Write the requirements as an OpenSpec change carrying deltas against `openspec/specs/<product>/<capability>/spec.md`. Its proposal must identify affected component exports and consumer apps.
3. Use the `prd-authoring` skill when the feature turns on a product judgment the requirement text will not preserve — why this problem, for whom, what was ruled out, what will be measured. Skip the PRD when there is no such judgment.
4. Keep task checkboxes accurate as work lands; fold accepted deltas into `openspec/specs/`, then archive under `openspec/changes/archive/YYYY-MM-DD-<change-name>/`.

Ask only questions that materially affect scope or an irreversible product choice. Otherwise state the assumption in the change proposal, or in the PRD's Decisions and open questions section when one exists.

## Product UI component contracts

This repository specifies product UI components and, since the `reinstate-shared-ui-package` change, hosts their shared implementations: a compound component named by a capability spec lives once in `packages/ui` (`@grade10/ui`) and every consuming application imports it rather than maintaining its own copy. The capability spec under `openspec/specs/` remains the export contract the implementation must satisfy.

Read [`docs/governance/ui-component-contracts.md`](docs/governance/ui-component-contracts.md) before designing a new public UI contract or making a material component-contract change.

- Components receive all consumer-owned content, product state, and behavior through props. Callback props use `on<Event>` names.
- No data fetching, mutations, routing, app stores, analytics, feature flags, browser storage, or application imports inside the component itself.
- Components may use React state, context, effects, refs, timers, and browser APIs for internal presentation and DOM behavior. They must not use those mechanisms to acquire, persist, subscribe to, or orchestrate consumer-owned product state.
- In this repository, “stateless” means app-neutral: it excludes external product-state integration, not ephemeral internal UI state.
- The export contract lives in the capability spec under `openspec/specs/`. Record a contract change as an OpenSpec change whose delta names the exact exports affected and the consuming applications that must adapt.

## Design system package

`packages/design-system` (`@grade10/design-system`) holds the theme tokens and the shadcn primitives this repository owns. `packages/i18n` (`@grade10/i18n`) holds the message catalogs. `packages/ui` (`@grade10/ui`) holds the shared compound components, composing the design-system primitives one way and never importing the message catalogs — all content reaches its components through props. These are the only packages here; do not add another without a recorded product decision.

Use the `design-system-components` skill whenever creating or changing a primitive under `packages/design-system/src/components/`.

- The package is consumed from source: `exports` point at `src/`, there is no build step, and no `dist/` is committed.
- Stories are colocated with each primitive. Run them with `pnpm run storybook:design-system`.
- Token flow: `tokens.json` is the source of truth, `tokens.config.json` holds the engineer-owned projection rules, and Figma plus the theme CSS files are both projections. Read `packages/design-system/DESIGN.md` before touching any leg of that pipeline.
- Read [`docs/governance/design-code-sync.md`](docs/governance/design-code-sync.md) before adding a primitive or changing one that has a Figma counterpart. A component may not offer a variant or size the Figma component set does not define; where code and design genuinely disagree, record it as an OpenSpec change rather than absorbing it into the Code Connect template.
- The Figma legs (`tokens:pull`, `tokens:push`, `tokens:plugin`) require a human to run a plugin inside Figma; they have no unattended path.

## Sharing with consuming apps

Consumers add this repository as a Git submodule and build from `openspec/specs/`, reading the PRDs for rationale and the design tokens for values. Shared compound components are consumed from `@grade10/ui` directly from source — no build step, no published artifact — so a shared component change lands once here and reaches every application through a submodule bump. Application-owned state, adapters, and wiring remain implementation work in each application.

Pin the submodule SHA in the application repository; updates are normal pull requests that move that SHA. Do not use git submodules inside this repository; this repository itself is the reusable submodule.

## Validation

Run the appropriate checks before handoff:

- `pnpm run agent:check-parity` after agent instructions, rules, or skills change.
- `pnpm run check:design-system` after a design-system primitive changes.
- `pnpm run tokens:build` after `tokens.json` or `tokens.config.json` changes; commit the regenerated theme CSS.
- `pnpm run lint` for repository formatting and static checks.
- `pnpm run typecheck` after any TypeScript change.

## Pull Requests and Commits

- PR labels: use one of `feature`, `bug`, `ci`, `agent`, `enhancement`, `maintenance`, or `documentation`, when labels are available.
- Commit subjects use the Conventional Commits format. Do not add issue or PR prefixes; repository tooling adds them.
- Keep commits atomic. Split unrelated implementation, documentation, refactoring, and generated build output into separate commits when practical.

## Agent-platform parity

`AGENTS.md` is canonical. `AGENT.md`, `CLAUDE.md`, and `GEMINI.md` are compatibility aliases.

`.cursor/skills/` is the source of truth for skills. `.codex/skills/` and `.claude/skills/` are generated copies, one per agent platform that reads project skills from its own directory, and all three must remain byte-for-byte identical. Edit a skill under `.cursor/skills/` and sync; an edit made directly in a generated leg is overwritten, and a leg-only file fails the check. Adding a platform is a new entry in the `legs` list in both parity scripts.

When agent-related files change, run:

```bash
pnpm run agent:sync-parity
pnpm run agent:check-parity
```
