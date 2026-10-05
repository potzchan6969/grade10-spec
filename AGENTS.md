# Product specification and design-system repository

This repository is the versioned source of truth for product requirements and the design system beneath Grade10 applications. It is intentionally not an application: do not add product data fetching, authentication, routing, stores, or feature orchestration here.

## Operating principles

- Treat product managers, designers, and engineers as collaborators. Check existing PRDs, specs, primitives, and conventions before proposing a new structure.
- Write everything — specs' prose, PRDs, manual pages, commits, replies — in the house style, [`docs/governance/writing.md`](docs/governance/writing.md): headings as plain Title Case labels, values first, items leading with the key term in bold, the reader's words, short sentences with no flourish, decided facts flat and present-tense, ❓ or `TBC` on anything unconfirmed, 🚧 only on what is confirmed and being built. Copy the page its Copy table names for the kind of page you are writing. Never cite a scenario id (`…-SC-32`) on a manual page — state the rule and link the capability. A case that proves a rule, a state that dresses an outcome and a mechanism belong to the suite, the design record and the architecture doc.
- Prefer the smallest reusable artifact. Call out a preference or design-system choice as a choice, not as an objective improvement.
- Keep changes reviewable: one product decision or component capability per push where practical.
- Do not modify generated `packages/design-system/src/theme.css` or `src/themes/grade10.css` by hand. Edit `tokens.json` or `tokens.config.json` and regenerate with `pnpm run tokens:build`.

## Sources of truth

| Need | Canonical location | Notes |
| --- | --- | --- |
| Durable requirements and component export contracts | `openspec/specs/<product>/<domain>/<capability>/spec.md` | The rolling latest accepted contract. Acceptance preserves planning history; the first task claim records its baseline and target scope. Archive reconciles it. See [`PRDs and OpenSpec`](docs/governance/prd-and-openspec.md#the-changes-record). Applications and the shared layer are in `openspec/specs/README.md`. |
| The PRD: what a capability is and should be, and the decision behind its requirements | `docs/prds/products/<product>/<capability>.md` | Written first, and moved first by whoever learns a product detail — PM, designer, QA or engineer; the product manager keeps it whole. The manual (`pnpm manual`) renders these pages; each names its spec and carries the shape in prose — what runs unmarked, 🚧 on what an active change delivers, ❓ on what nobody has confirmed — with problem, users, non-goals, measurement and decisions in its `Product decisions` block. Never restates a requirement. Page grammar: `docs/prds/guides/writing-the-manual.md`. |
| Source material behind a decision | `docs/references/<doc>.md` | Owner's drafts, competitor research, vendor-integration working notes — what a page or change cites as evidence; the manual renders them under References. Explanatory, never authoritative. See `docs/references/README.md`. |
| Proposed change | `openspec/changes/<change-name>/` | Delta design, specs, and tasks; archive after delivery. Not for bugs: `docs/governance/bug-fixes.md`. |
| Who walks a capability | `user-journeys.md` beside its `spec.md` | The INVEST journeys. It names no scenario: a scenario names the journey it serves. A capability nobody reaches on its own — a policy, a package contract, a makers-only surface — writes `**Walked by:** nobody` instead, routing its anchors to the feature set without excusing it a suite. |
| Test cases for a capability | `feature-tcs.md` beside its `spec.md` | An independent blind reading of that capability's anchors, written without sight of the scenarios and reconciled against them after. Its name carries its level — one domain's is `domain-tcs.md` beside them, the wider smoke passes `product-tcs.md` and `platform-tcs.md`. See `docs/governance/specs-to-test-cases.md`. |
| Design token values | `packages/design-system/tokens.json` | Designer-owned data; the CSS themes are generated projections of it. |
| User-facing copy and translations | `packages/i18n/messages/{shared,<brand>}/<locale>/<namespace>.json` | `shared/` answers every key no brand claims, once per language; a brand answers only what says something about itself, in every language it speaks. Assembled in `src/catalogs.ts`. Types refuse a key the vocabulary does not name; `pnpm run test` refuses layers that leave one unanswered, or answer one twice. |
| Design-system primitive | `packages/design-system/src/components/` | shadcn primitives and their colocated stories. |
| Product component implementation | `packages/ui/src/blocks/` | Shared compound components, one directory per capability; the capability spec remains the export contract. |
| A change's rounds | `rounds.md` beside `tasks.md` | One row per round, written by the landing. |
| Task group and owner format in `tasks.md` | `docs/governance/task-ownership.md` | Parsed independently by tooling in this repository and in the application repository. |

If a statement is testable, it belongs in `openspec/specs/` and nowhere else, reached through a change's delta. A PRD is the capability's manual page, written before the change: it states the outcome in the reader's words, marked 🚧 or ❓ where it is not yet running, holds what a requirement cannot carry, and names its capability spec rather than restating it. Where an unmarked line and the spec disagree, the spec is correct.

Read [`docs/governance/prd-and-openspec.md`](docs/governance/prd-and-openspec.md) for the required maintenance lifecycle and a format-selection guide.

Read [`docs/governance/system-design.md`](docs/governance/system-design.md) before designing or building.

Read [`docs/governance/design-system-workflows.md`](docs/governance/design-system-workflows.md) when you know the task but not the rail: it routes tokens, primitives, blocks, a page conversion, an audit finding, and the specification handoff to the command, skill, and governing document that own them, and records what each check does not cover.

## Product specification workflow

One workflow schema exists under `openspec/schemas/`: `grade10-planning`, the whole lifecycle in eight artifacts. `openspec new change <name>` records it in the change's `.openspec.yaml`. The CLI is `@fission-ai/openspec@1.8.0`; `pnpm openspec …` runs it with no global install.

| # | Artifact | Written by | Skill | Required |
| --- | --- | --- | --- | --- |
| 1 | `proposal.md` | Product manager | `/workflow-plan`, `planning-pm` | Always |
| 2 | `decisions.md` | Product manager | `/workflow-plan`, `planning-pm` | Always — goals, non-goals, what the interview settled |
| 3 | `specs/<capability>/user-journeys.md` | Product manager | `/workflow-plan`, `planning-pm` | Always — a capability nobody walks says so in it |
| 4 | `ui-design.md` | Designer, or the PM with the design | `/workflow-design`, `planning-design` | Optional — from the journeys |
| 5 | `tech-design.md` | Dev in the integrated planning run | `/planning-dev`, `planning-dev` | Every implementation change outside this store — or `design_waived: <why>` |
| 6 | `specs/<capability>/spec.md` | QA1 outline, Dev scenarios | `/planning-dev`, `planning-dev` | Always — anchors first, scenarios after QA1 and tech design |
| 7 | `specs/<capability>/feature-tcs.md` | QA1 cases, QA2 reconciliation | `/planning-dev`, `planning-dev` | Always — blind draft cases before scenarios |
| 8 | `tasks.md` | Dev in the integrated planning run | `/planning-dev`, `planning-dev` | Before acceptance and implementation |

Each command names its artifact and follows the `workflow-round` skill, which reads its readers from the schema and dispatches them from `.claude/agents/`; `/workflow-build` takes a task group, `/workflow-land` one artifact.

The PM writes 1 to 3, and a designer adds 4 where needed. One `/planning-dev` invocation takes frozen anchors through fresh QA1 blind cases, independent Dev technical design, scenarios and tasks, then fresh QA2 reconciliation. The same human resolves requirement, design and plan questions. After `pnpm accept:preflight <change>` passes, accept once with `pnpm spec:accept <change> --baseline <digest> --reviewed-by <human>`. Acceptance publishes requirements before implementation without marking cases approved or executed. An amendment names `--supersedes <old-fingerprint>` and preserves earlier snapshots. The first claim records its durable baseline; archive reconciles its target scope with the current contract, and semantic differences name evidence. Archive precedes deployment without another fold. After deployment, human QA classifies cases with `/tcs-review` and uses `/tcs-run-sheet` for manual execution. Every key the change's `.openspec.yaml` can carry is tabled in [`docs/governance/prd-and-openspec.md`](docs/governance/prd-and-openspec.md#the-changes-record).

The PRD is the exception to teammates. It is the source of truth for what the product should be, so a product detail learned anywhere — a designer's state, an engineer's constraint, a QA case that exposes an unwritten rule, a delta that says more than the PRD — lands on the PRD first, marked 🚧 or ❓, by whoever learned it, before the artifact that depends on it. A product detail is a line the reader would act differently without — a value, a set they meet, an outcome they see, a decision — and one 🚧 line carries an outcome however many scenarios prove it; what each teammate learns beyond that stays in its own artifact, tabled in [`docs/governance/prd-and-openspec.md`](docs/governance/prd-and-openspec.md#what-does-not-go-on-the-prd). The product manager keeps the PRD whole.

The journeys are their own file beside each `spec.md`, never a `## User journeys` section inside it — `pnpm check:manual` refuses a delta that holds one, and the archive copies the file across beside the feature set. Every capability has the file: the journeys, or the one line `**Walked by:** nobody on their own - <why>` for a policy, a package contract, a convention, or a surface only the product's makers reach. That line routes the capability's anchors to its feature set; it does not excuse it a suite.

For a new product feature:

1. Read the capability's PRD in `docs/prds/`, the active OpenSpec changes on its spec, and the capability in `openspec/specs/`.
2. Mark the pages the feature touches: one 🚧 line per outcome, ❓ on what is still open, and the decisions the feature turns on. An active change already folding the same requirement is extended or superseded, never doubled.
3. Write the requirements as an OpenSpec change carrying deltas derived from those lines against `openspec/specs/<product>/<domain>/<capability>/spec.md`, linking every page it marked. Its proposal must identify affected component exports and consumer apps.
4. Use the `prd-authoring` skill when the feature turns on a product judgment the requirement text will not preserve — why this problem, for whom, what was ruled out, what will be measured. It lands in the PRD's `Product decisions` block; skip it when there is no such judgment.
5. Accept and publish the finished contract before implementation. Keep task checkboxes accurate as work lands; after implementation is verified, take the 🚧 marks off delivered outcomes and archive under `openspec/changes/archive/YYYY-MM-DD-<change-name>/`, before deployment. The archive preserves history and does not fold requirements a second time.

Read [`docs/governance/agent-workflow-example.md`](docs/governance/agent-workflow-example.md) for one feature walked through both repositories, from `openspec new change` to archive.

Ask only questions that materially affect scope or an irreversible product choice. Otherwise state the assumption in the change proposal, or as a ❓ row in the PRD's decisions table when one exists.

## Design Override

The agreed look is what `main` holds in `packages/ui/src/blocks`, `packages/design-system/src/components`, its `tokens.json` and `apps/preview/src/pages`. The hooks `pnpm install` sets stop a commit that changes it, or a merge that drops its lines.

- **Never restyle it on the way** — a missing state or variant is the designer's; never pass `--no-verify`.
- **A stop is your person's** — show them its lines; only on their yes, end the message with `Design-Override: <what changes and why>` — [Design Override](docs/prds/products/shared/design-sync/design-override.md).

## Product UI component contracts

This repository specifies product UI components and, since the `reinstate-shared-ui-package` change, hosts their shared implementations: a compound component named by a capability spec lives once in `packages/ui` (`@grade10/ui`) and every consuming application imports it rather than maintaining its own copy. The capability spec under `openspec/specs/` remains the export contract the implementation must satisfy.

Read [`docs/governance/ui-component-contracts.md`](docs/governance/ui-component-contracts.md) before designing a new public UI contract or making a material component-contract change.

- Components receive all consumer-owned content, product state, and behavior through props. Callback props use `on<Event>` names.
- No data fetching, mutations, routing, app stores, analytics, feature flags, browser storage, or application imports inside the component itself.
- Components may use React state, context, effects, refs, timers, and browser APIs for internal presentation and DOM behavior. They must not use those mechanisms to acquire, persist, subscribe to, or orchestrate consumer-owned product state.
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

Consumers add this repository as a Git submodule and build from `openspec/specs/`, reading the manual's pages for rationale and the design tokens for values. Shared compound components are consumed from `@grade10/ui` from source, so a shared component change lands once here and reaches every application through a submodule bump. Application-owned state, adapters, and wiring remain implementation work in each application.

Pin the submodule SHA in the application repository; updates are normal pull requests that move that SHA. Do not use git submodules inside this repository; this repository itself is the reusable submodule.

## Validation

Run the appropriate checks before handoff:

- `pnpm run agent:check-parity` after agent instructions, rules, or skills change.
- `pnpm push:main` runs `pnpm check:manual`, `pnpm run validate:changes` and `pnpm run tcs:validate` on what it sends, as CI does; run one alone while drafting. `check:manual` refuses an unmarked page, application work with no tech design, a capability with no journeys file, a 🚧 line no change delivers, and a backticked id the store issues nowhere; it warns (`dense`) past the budget in `docs/governance/writing.md`.
- `pnpm run plan:preflight <change-id>` before editing a `tasks.md` engineering is implementing.
- `pnpm run archive:preflight <change-id>` before archiving a change; it prints what still refuses.
- `pnpm run test:openspec` after anything under `scripts/openspec/` changes.
- `pnpm --dir tools/relay test` after anything under `tools/relay/` changes.
- `pnpm run design-sync:check` after a design-system primitive changes.
- `pnpm run diagrams` after a chart source under `docs/prds/diagrams/` changes; commit the rendered SVG, which `pnpm run diagrams:check` holds to its source in CI.
- `pnpm run tokens:build` after `tokens.json` or `tokens.config.json` changes; commit the regenerated theme CSS.
- `pnpm run lint` for repository formatting and static checks.
- `pnpm run typecheck` after any TypeScript change.

## Pushes, Pull Requests and Commits

- Push with `pnpm push:main`, not a pull request: it rebases, runs the checks the paths owe and lands planning text on `main`. A shared surface (packages, apps, scripts, tools, schema, agent files, config) goes through a pull request set to merge once green. Settle a conflict as `/spec-push` says.
- PR labels: use one of `feature`, `bug`, `ci`, `agent`, `enhancement`, `maintenance`, or `documentation`, when labels are available.
- Commit subjects use the Conventional Commits format. Do not add issue or PR prefixes; repository tooling adds them.
- Keep commits atomic. Split unrelated implementation, documentation, refactoring, and generated build output into separate commits when practical.

## Agent-platform parity

`AGENTS.md` is canonical. `AGENT.md`, `CLAUDE.md`, and `GEMINI.md` are compatibility aliases.

`.claude/skills/` is canonical, with `.codex/skills/` and `.cursor/skills/` symlinked to it, so every platform reads the same files; adding a platform means adding its symlink to the parity check and sync scripts. `.claude/agents/` is canonical for the round's readers, mirrored nowhere; the parity check asserts every reader the schema names resolves.

When agent-related files change, run:

```bash
pnpm run agent:sync-parity
pnpm run agent:check-parity
```
