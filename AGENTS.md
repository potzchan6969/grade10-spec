# Product specification and design-system repository

This repository is the versioned source of truth for product requirements and the design system beneath Grade10 applications. It is intentionally not an application: do not add product data fetching, authentication, routing, stores, or feature orchestration here.

## Operating principles

- Treat product managers, designers, and engineers as collaborators. Check existing PRDs, specs, primitives, and conventions before proposing a new structure.
- Write everything — specs' prose, PRDs, manual pages, commits, replies — in the house style, [`docs/governance/writing.md`](docs/governance/writing.md): headings as plain Title Case labels, values first, items leading with the key term in bold, the reader's words, short sentences with no flourish, decided facts flat and present-tense, ❓ or `TBC` on anything unconfirmed, 🚧 only on what is confirmed and being built. Copy the page its Copy table names for the kind of page you are writing. Never cite a scenario id (`…-SC-32`) on a manual page — state the rule and link the capability. A case that proves a rule, a state that dresses an outcome and a mechanism belong to the suite, the design record and the architecture doc.
- Prefer the smallest reusable artifact. Call out a preference or design-system choice as a choice, not as an objective improvement.
- Keep changes reviewable: one product decision or component capability per pull request where practical.
- Do not modify generated `packages/design-system/src/theme.css` or `src/themes/grade10.css` by hand. Edit `tokens.json` or `tokens.config.json` and regenerate with `pnpm run tokens:build`.

## Sources of truth

| Need | Canonical location | Notes |
| --- | --- | --- |
| Durable requirements and component export contracts | `openspec/specs/<product>/<domain>/<capability>/spec.md` | The production shape: what runs, rewritten only by a change's fold at archive. An implementing engineer builds from this alone. The four applications - `grade10-site`, `grade10-admin`, `zzz-site`, `zzz-admin` - and the `shared` layer are listed in `openspec/specs/README.md`. |
| The PRD: what a capability is and should be, and the decision behind its requirements | `docs/prds/products/<product>/<capability>.md` | Written first, and moved first by whoever learns a product detail — PM, designer, QA or engineer; the product manager keeps it whole. The manual (`pnpm manual`) renders these pages; each names its spec and carries the shape in prose — what runs unmarked, 🚧 on what an active change delivers, ❓ on what nobody has confirmed — with problem, users, non-goals, measurement and decisions in its `Product decisions` block. Never restates a requirement. Page grammar: `docs/prds/guides/writing-the-manual.md`. |
| Source material behind a decision | `docs/references/<doc>.md` | Owner's drafts, competitor research, vendor-integration working notes — what a page or change cites as evidence; the manual renders them under References. Explanatory, never authoritative. See `docs/references/README.md`. |
| Proposed implementation change | `openspec/changes/<change-name>/` | Delta proposal, design, specs, and tasks; archive after delivery. |
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
| 1 | `proposal.md` | Product manager | `/plan`, `planning-pm` | Always |
| 2 | `decisions.md` | Product manager | `/plan`, `planning-pm` | Always — goals, non-goals, what the interview settled |
| 3 | `specs/<capability>/user-journeys.md` | Product manager | `/plan`, `planning-pm` | Always — a capability nobody walks says so in it |
| 4 | `ui-design.md` | Designer, or the PM with the design | `/design`, `planning-design` | Optional — from the journeys |
| 5 | `tech-design.md` | Engineer | `/tech`, `planning-dev` | When a task group lands outside this store — or `design_waived: <why>` |
| 6 | `specs/<capability>/spec.md` | Generated, the PM reviews | `/specify`, `planning-qa` or `planning-dev` | Always — two passes, with 7 between them |
| 7 | `specs/<capability>/feature-tcs.md` | Generated, QA reviews | `/specify`, `planning-qa` | Always — a blind pass, before the scenarios |
| 8 | `tasks.md` | Engineer | `/tasks`, `planning-dev` | Before the change can be applied |

Each command names its artifact and follows the `round` skill, which reads its readers from the schema and dispatches them from `.claude/agents/`; `/build` takes a task group, `/land` one artifact.

The PM writes 1 to 3 and stops, and so does a designer specifying a change. 2 records what the interview settled, and everything after is drawn from that scope: an artifact outside its goals, or inside a non-goal, disagrees with the change. A designer hangs 4 off the journeys unless the PM has the design. **Neither hand opens 6** — whoever takes the readings writes it: the outline first, from the journeys and the marks, then both readings on one branch — 7 blind to the scenarios, then 6's requirements reconciled against it. The engineer adds `tech-design.md` and `tasks.md` to that change, never a second one, and never opens a change in the application repository: its `openspec/` is config-only and resolves to this store. Until a change has a `tasks.md` it shows on the engineer's board as still being planned. Every key the change's `.openspec.yaml` can carry is tabled in [`docs/governance/prd-and-openspec.md`](docs/governance/prd-and-openspec.md#the-changes-record).

The PRD is the exception to teammates. It is the source of truth for what the product should be, so a product detail learned anywhere — a designer's state, an engineer's constraint, a QA case that exposes an unwritten rule, a delta that says more than the PRD — lands on the PRD first, marked 🚧 or ❓, by whoever learned it, before the artifact that depends on it. A product detail is a line the reader would act differently without — a value, a set they meet, an outcome they see, a decision — and one 🚧 line carries an outcome however many scenarios prove it; what each teammate learns beyond that stays in its own artifact, tabled in [`docs/governance/prd-and-openspec.md`](docs/governance/prd-and-openspec.md#what-does-not-go-on-the-prd). The product manager keeps the PRD whole.

The journeys are their own file beside each `spec.md`, never a `## User journeys` section inside it — `pnpm check:manual` refuses a delta that holds one, and the archive copies the file across beside the feature set. Every capability has the file: the journeys, or the one line `**Walked by:** nobody on their own - <why>` for a policy, a package contract, a convention, or a surface only the product's makers reach. That line routes the capability's anchors to its feature set; it does not excuse it a suite.

For a new product feature:

1. Read the capability's PRD in `docs/prds/`, the active OpenSpec changes on its spec, and the capability in `openspec/specs/`.
2. Mark the pages the feature touches: one 🚧 line per outcome, ❓ on what is still open, and the decisions the feature turns on. An active change already folding the same requirement is extended or superseded, never doubled.
3. Write the requirements as an OpenSpec change carrying deltas derived from those lines against `openspec/specs/<product>/<domain>/<capability>/spec.md`, linking every page it marked. Its proposal must identify affected component exports and consumer apps.
4. Use the `prd-authoring` skill when the feature turns on a product judgment the requirement text will not preserve — why this problem, for whom, what was ruled out, what will be measured. It lands in the PRD's `Product decisions` block; skip it when there is no such judgment.
5. Keep task checkboxes accurate as work lands; fold accepted deltas into `openspec/specs/`, take the 🚧 marks off the lines the change delivered, then archive under `openspec/changes/archive/YYYY-MM-DD-<change-name>/`.

Read [`docs/governance/agent-workflow-example.md`](docs/governance/agent-workflow-example.md) for one feature walked through both repositories, from `openspec new change` to archive.

Ask only questions that materially affect scope or an irreversible product choice. Otherwise state the assumption in the change proposal, or as a ❓ row in the PRD's decisions table when one exists.

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
- `pnpm check:manual` after a page, a change, or a suite changes; CI runs it on every push and refuses a change with an unmarked page, application work with no tech design, a capability with no journeys file, a 🚧 line no change delivers, and an id cited in backticks that the store issues nowhere. It warns (`dense`) on a page past the style's budget, tabled under Enforcement in `docs/governance/writing.md`.
- `pnpm run plan:preflight <change-id>` before editing a `tasks.md` engineering is implementing.
- `pnpm run archive:preflight <change-id>` before archiving a change; it prints what still refuses.
- `pnpm run test:openspec` after anything under `scripts/openspec/` changes.
- `pnpm --dir tools/relay test` after anything under `tools/relay/` changes.
- `pnpm run validate:changes <change-id>` after a change's artifacts change; CI runs it over every change.
- `pnpm run tcs:validate` after a suite — `feature-tcs.md`, `domain-tcs.md`, `product-tcs.md`, `platform-tcs.md` — changes; CI runs it on every push.
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

`.claude/skills/` is canonical, with `.codex/skills/` and `.cursor/skills/` symlinked to it, so every platform reads the same files; adding a platform means adding its symlink to the parity check and sync scripts. `.claude/agents/` is canonical for the round's readers, mirrored nowhere; the parity check asserts every reader the schema names resolves.

When agent-related files change, run:

```bash
pnpm run agent:sync-parity
pnpm run agent:check-parity
```
