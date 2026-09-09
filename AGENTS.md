# Product specification and design-system repository

This repository is the versioned source of truth for product requirements and the design system beneath Grade10 applications. It is intentionally not an application: do not add product data fetching, authentication, routing, stores, or feature orchestration here.

## Operating principles

- Treat product managers, designers, and engineers as collaborators. Check existing PRDs, specs, primitives, and conventions before proposing a new structure.
- Write everything — specs' prose, PRDs, manual pages, commits, replies — in the house style: [`docs/governance/writing.md`](docs/governance/writing.md). Outline first: a heading, then numbered or bulleted items that lead with the key term in bold, actor-first steps, fragments rather than paragraphs, as `docs/references/grade10-finance.md` shows and `docs/prds/products/grade10-site/store/product-listing.md` applies to a capability page. Decided facts stated flatly, definitions first, open items marked ❓ or `TBC`, superseded content replaced. Name what happens rather than a noun for it, and carry no word forward just because the draft already used it.
- Prefer the smallest reusable artifact. Call out a preference or design-system choice as a choice, not as an objective improvement.
- Keep changes reviewable: one product decision or component capability per pull request where practical.
- Do not modify generated `packages/design-system/src/theme.css` or `src/themes/grade10.css` by hand. Edit `tokens.json` or `tokens.config.json` and regenerate with `pnpm run tokens:build`.

## Sources of truth

| Need | Canonical location | Notes |
| --- | --- | --- |
| Durable requirements and component export contracts | `openspec/specs/<product>/<domain>/<capability>/spec.md` | The single source of truth. An implementing engineer builds from this alone. The four applications - `grade10-site`, `grade10-admin`, `zzz-site`, `zzz-admin` - and the `shared` layer are listed in `openspec/specs/README.md`. |
| The product record: a capability's page, and the decision behind its requirements | `docs/prds/products/<product>/<capability>.md` | The manual (`pnpm manual`) renders these pages; each names its spec and carries the shape in prose, with problem, users, non-goals, measurement and decisions in its `Product decisions` block. Explanatory, never authoritative over a requirement. Page grammar: `docs/prds/guides/writing-the-manual.md`. |
| Source material behind a decision | `docs/references/<doc>.md` | Owner's drafts, competitor research, vendor-integration working notes — what a page or change cites as evidence; the manual renders them under References. Explanatory, never authoritative. See `docs/references/README.md`. |
| Proposed implementation change | `openspec/changes/<change-name>/` | Delta proposal, design, specs, and tasks; archive after delivery. |
| Who walks a capability, and what accepts their story | `user-journeys.md` beside its `spec.md` | The INVEST stories and the scenario ids that accept each. A capability nobody reaches on its own — a cross-cutting policy, a package contract, a surface only its makers reach — writes `**Walked by:** nobody` there in place of the stories; `pnpm check:manual` fails a capability with neither. |
| Test cases for a capability | `test-cases.md` beside its `spec.md` | A derived reading of that capability's journeys and scenarios, never a second source of truth. See `docs/governance/specs-to-test-cases.md`. |
| Design token values | `packages/design-system/tokens.json` | Designer-owned data; the CSS themes are generated projections of it. |
| User-facing copy and translations | `packages/i18n/messages/{shared,<brand>}/<locale>/<namespace>.json` | `shared/` answers every key no brand claims, once per language; a brand answers only what says something about itself, in every language it speaks. Assembled in `src/catalogs.ts`. Types refuse a key the vocabulary does not name; `pnpm run test` refuses layers that leave one unanswered, or answer one twice. |
| Design-system primitive | `packages/design-system/src/components/` | shadcn primitives and their colocated stories. |
| Product component implementation | `packages/ui/src/blocks/` | Shared compound components, one directory per capability; the capability spec remains the export contract. |
| Task group and owner format in `tasks.md` | `docs/governance/task-ownership.md` | Parsed independently by tooling in this repository and in the application repository. |

If a statement is testable, it belongs in `openspec/specs/` and nowhere else. A PRD is the capability's manual page: it holds only what a requirement cannot carry, and names its capability spec rather than restating it. Where the two disagree, the spec is correct.

Read [`docs/governance/prd-and-openspec.md`](docs/governance/prd-and-openspec.md) for the required maintenance lifecycle and a format-selection guide.

Read [`docs/governance/design-system-workflows.md`](docs/governance/design-system-workflows.md) when you know the task but not the rail: it routes tokens, primitives, blocks, a page conversion, an audit finding, and the specification handoff to the command, skill, and governing document that own them, and records what each check does not cover.

## Product specification workflow

One workflow schema exists under `openspec/schemas/`: `grade10-planning`, the whole lifecycle in seven artifacts. `openspec new change <name>` records it in the change's `.openspec.yaml`.

| # | Artifact | Written by | Skill | Required |
| --- | --- | --- | --- | --- |
| 1 | `proposal.md` | Product manager | `planning-pm` | Always |
| 2 | `specs/<capability>/spec.md` | Product manager | `planning-pm` | Always |
| 3 | `specs/<capability>/user-journeys.md` | Product manager | `planning-pm` | Always — a capability nobody walks says so in it |
| 4 | `specs/<capability>/test-cases.md` | QA | `planning-qa` | Optional |
| 5 | `ui-design.md` | Designer | `planning-design` | Optional |
| 6 | `tech-design.md` | Engineer | `planning-dev` | Optional |
| 7 | `tasks.md` | Engineer | `planning-dev` | Before the change can be applied |

Each hand writes its own artifacts on the one change and stops: a PM finishes at the journeys, QA derives the suites, a designer writes `ui-design.md`, and the engineer who picks the work up adds `tech-design.md` and `tasks.md` to the same change rather than opening a second one. That is the only route, because engineering never opens a change in the application repository: that repository's `openspec/` is config-only and resolves to this store, and until a change has a `tasks.md` it shows on the engineer's board as still being planned.

The journeys are their own file beside each `spec.md`, never a `## User journeys` section inside it — `pnpm check:manual` refuses a spec that holds one, and the archive copies the file across by hand alongside the feature set. Every capability has the file: it holds the stories, or the one line `**Walked by:** nobody on their own - <why>` for a policy, a package contract, a convention, or a surface only the product's makers reach. A capability with neither fails `pnpm check:manual`, so an exemption is always a decision on record and never an omission.

For a new product feature:

1. Inspect the relevant capability in `openspec/specs/`, active OpenSpec changes, and any related PRD.
2. Write the requirements as an OpenSpec change carrying deltas against `openspec/specs/<product>/<domain>/<capability>/spec.md`. Its proposal must identify affected component exports and consumer apps.
3. Use the `prd-authoring` skill when the feature turns on a product judgment the requirement text will not preserve — why this problem, for whom, what was ruled out, what will be measured. It lands in the capability page's `Product decisions` block; skip it when there is no such judgment.
4. Keep task checkboxes accurate as work lands; fold accepted deltas into `openspec/specs/`, then archive under `openspec/changes/archive/YYYY-MM-DD-<change-name>/`.

Read [`docs/governance/agent-workflow-example.md`](docs/governance/agent-workflow-example.md) for one feature walked through both repositories, from `openspec new change` to archive.

Ask only questions that materially affect scope or an irreversible product choice. Otherwise state the assumption in the change proposal, or as a ❓ row in the capability page's decisions table when one exists.

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

Use the `design-system-primitives` skill whenever creating or changing a primitive under `packages/design-system/src/components/`.

- The package is consumed from source: `exports` point at `src/`, there is no build step, and no `dist/` is committed.
- Stories are colocated with each primitive. Run them with `pnpm run storybook:design-system`.
- Token flow: `tokens.json` is the source of truth, `tokens.config.json` holds the engineer-owned projection rules, and Figma plus the theme CSS files are both projections. Read `packages/design-system/DESIGN.md` before touching any leg of that pipeline.
- Read [`docs/governance/design-code-sync.md`](docs/governance/design-code-sync.md) before adding a primitive or changing one that has a Figma counterpart. A component may not offer a variant or size the Figma component set does not define; where code and design genuinely disagree, record it as an OpenSpec change rather than absorbing it into the Code Connect template.
- The Figma legs (`tokens:import`, `tokens:push`, `tokens:plugin`) require a human to run a plugin inside Figma; they have no unattended path.

## Sharing with consuming apps

Consumers add this repository as a Git submodule and build from `openspec/specs/`, reading the manual's pages for rationale and the design tokens for values. Shared compound components are consumed from `@grade10/ui` directly from source — no build step, no published artifact — so a shared component change lands once here and reaches every application through a submodule bump. Application-owned state, adapters, and wiring remain implementation work in each application.

Pin the submodule SHA in the application repository; updates are normal pull requests that move that SHA. Do not use git submodules inside this repository; this repository itself is the reusable submodule.

## Validation

Run the appropriate checks before handoff:

- `pnpm run agent:check-parity` after agent instructions, rules, or skills change.
- `pnpm run tcs:validate` after a `test-cases.md` changes; CI runs it on every push.
- `pnpm run design-sync:check` after a design-system primitive changes.
- `pnpm run diagrams` after a chart source under `docs/prds/diagrams/` changes; commit the rendered SVG, which `pnpm run diagrams:check` holds to its source in CI.
- `pnpm run tokens:build` after `tokens.json` or `tokens.config.json` changes; commit the regenerated theme CSS.
- `pnpm run lint` for repository formatting and static checks.
- `pnpm run typecheck` after any TypeScript change.

## Pull Requests and Commits

- PR labels: use one of `feature`, `bug`, `ci`, `agent`, `enhancement`, `maintenance`, or `documentation`, when labels are available.
- Commit subjects use the Conventional Commits format. Do not add issue or PR prefixes; repository tooling adds them.
- Keep commits atomic. Split unrelated implementation, documentation, refactoring, and generated build output into separate commits when practical.

## Agent-platform parity

`AGENTS.md` is canonical. `AGENT.md`, `CLAUDE.md`, and `GEMINI.md` are compatibility aliases.

`.claude/skills/` is canonical for skills. `.codex/skills/` and `.cursor/skills/` are symlinks to it, so every agent platform reads the same files. Edit skills under `.claude/skills/`; adding a platform means adding its symlink to the parity check and sync scripts.

When agent-related files change, run:

```bash
pnpm run agent:sync-parity
pnpm run agent:check-parity
```
