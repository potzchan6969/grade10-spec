# Product specification and design-system repository

This repository is the versioned source of truth for product requirements and the design system for the grade10 repository, where this repository is imported as a submodule. When a change needs product data fetching, authentication, routing, stores, or feature orchestration, do that work in the grade10 repository where the application code lives.

## Operating principles

- Respect [`docs/governance/writing.md`](docs/governance/writing.md) when writing any documents in the repository.

## Questions and blockers

When human input is needed, ask in the Clarification Request format in the [`clarification-request`](.claude/skills/clarification-request/SKILL.md) skill.

## Sources of truth

| Need | Canonical location |
| --- | --- |
| Testable requirements and component export contracts | `openspec/specs/<product>/<domain>/<capability>/spec.md` |
| Product intent: why, for whom, and what is still open | `docs/prds/products/<product>/<capability>.md` |
| Evidence behind a decision | `docs/references/<doc>.md` |
| Proposed change | `openspec/changes/<change-name>/` |
| Who walks a capability | `user-journeys.md` beside its `spec.md` |
| Test cases | `feature-tcs.md` beside its `spec.md` |
| Design token values | `packages/design-system/tokens.json` |
| User-facing copy | `packages/i18n/messages/` |
| Design-system primitive | `packages/design-system/src/components/` |
| Shared compound component | `packages/ui/src/blocks/` |

Testable statements belong in `openspec/specs/` only, reached through a change's delta. A PRD names its spec and never restates it. Where a PRD line and the spec disagree, the spec is correct. Details: [`docs/governance/prd-and-openspec.md`](docs/governance/prd-and-openspec.md).

Read [`docs/governance/prd-and-openspec.md`](docs/governance/prd-and-openspec.md) for the required maintenance lifecycle and a format-selection guide.

Read [`docs/governance/system-design.md`](docs/governance/system-design.md) before designing or building.

Read [`docs/governance/design-system-workflows.md`](docs/governance/design-system-workflows.md) when you know the task but not the rail: it routes tokens, primitives, blocks, a page conversion, an audit finding, and the specification handoff to the command, skill, and governing document that own them, and records what each check does not cover.

## Product specification workflow

One workflow schema exists under `openspec/schemas/`: `grade10-planning`, the whole lifecycle in eight artifacts. `openspec new change <name>` records it in the change's `.openspec.yaml`. The CLI is `@fission-ai/openspec@1.8.0`; `pnpm openspec …` runs it with no global install.

| # | Artifact | Written by | Skill | Required |
| --- | --- | --- | --- | --- |
| 1 | `proposal.md` | Product manager | `planning-pm` | Always |
| 2 | `decisions.md` | Product manager | `planning-pm` | Always — goals, non-goals, what the interview settled |
| 3 | `specs/<capability>/user-journeys.md` | Product manager | `planning-pm` | Always — a capability nobody walks says so in it |
| 4 | `ui-design.md` | Designer, or the PM with the design | `planning-design` | Optional — from the journeys |
| 5 | `tech-design.md` | Dev in the integrated planning run | `planning-dev` | Every implementation change outside this store — or `design_waived: <why>` |
| 6 | `specs/<capability>/spec.md` | QA1 outline, Dev scenarios | `planning-dev` | Always — anchors first, scenarios after QA1 and tech design |
| 7 | `specs/<capability>/feature-tcs.md` | QA1 cases, QA2 reconciliation | `planning-dev` | Always — blind draft cases before scenarios |
| 8 | `tasks.md` | Dev in the integrated planning run | `planning-dev` | Before acceptance and implementation |

`planning-pm`, `planning-design` and `planning-dev` are current and independently usable. `workflow-*` are next-version wrappers: they may invoke planning skills and add instructions, but planning skills must not depend on them. Keep planning procedures in `planning-*` until adoption.

The PM writes 1 to 3, and a designer adds 4 where needed. One `/planning-dev` invocation takes frozen anchors through fresh QA1 blind cases, independent Dev technical design, scenarios and tasks, then fresh QA2 reconciliation. The same human resolves requirement, design and plan questions. After a ready `accept-review` and a passing `pnpm accept:preflight <change>`, accept once with `pnpm spec:accept <change> --baseline <digest> --reviewed-by <human>`. Acceptance publishes requirements before implementation without marking cases approved or executed. An amendment names `--supersedes <old-fingerprint>` and preserves earlier snapshots. The first claim records its durable baseline; archive reconciles its target scope with the current contract, and semantic differences name evidence. Archive makes no second fold; deployment never waits for it. After deployment, human QA classifies cases with `/tcs-review` and uses `/tcs-run-sheet` for manual execution. Every key the change's `.openspec.yaml` can carry is tabled in [`docs/governance/prd-and-openspec.md`](docs/governance/prd-and-openspec.md#the-changes-record).

The PRD is the exception to teammates. It is the source of truth for what the product should be, so a product detail learned anywhere — a designer's state, an engineer's constraint, a QA case that exposes an unwritten rule, a delta that says more than the PRD — lands on the PRD first, marked 🚧 or ❓, by whoever learned it, before the artifact that depends on it. A product detail is a line the reader would act differently without — a value, a set they meet, an outcome they see, a decision — and one 🚧 line carries an outcome however many scenarios prove it; what each teammate learns beyond that stays in its own artifact, tabled in [`docs/governance/prd-and-openspec.md`](docs/governance/prd-and-openspec.md#what-does-not-go-on-the-prd). The product manager keeps the PRD whole.

The journeys are their own file beside each `spec.md`, never a `## User journeys` section inside it — `pnpm check:manual` refuses a delta that holds one, and the archive copies the file across beside the feature set. Every capability has the file: the journeys, or the one line `**Walked by:** nobody on their own - <why>` for a policy, a package contract, a convention, or a surface only the product's makers reach. That line routes the capability's anchors to its feature set; it does not excuse it a suite.

For a new product feature:

1. Read the capability's PRD in `docs/prds/`, the active OpenSpec changes on its spec, and the capability in `openspec/specs/`.
2. Mark the pages the feature touches: one 🚧 line per outcome, ❓ on what is still open, and the decisions the feature turns on. An active change already folding the same requirement is extended or superseded, never doubled.
3. Write the requirements as an OpenSpec change carrying deltas derived from those lines against `openspec/specs/<product>/<domain>/<capability>/spec.md`, linking every page it marked. Its proposal must identify affected component exports and consumer apps.
4. Use the `prd-authoring` skill when the feature turns on a product judgment the requirement text will not preserve — why this problem, for whom, what was ruled out, what will be measured. It lands in the PRD's `Product decisions` block; skip it when there is no such judgment.
5. Accept and publish the finished contract before implementation. Keep task checkboxes accurate as work lands; after implementation is verified, take the 🚧 marks off delivered outcomes and archive under `openspec/changes/archive/YYYY-MM-DD-<change-name>/`. The archive preserves history and does not fold requirements a second time.

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

`packages/design-system` (`@grade10/design-system`) holds the theme tokens and shadcn primitives. `packages/i18n` (`@grade10/i18n`) holds the message catalogs. `packages/ui` (`@grade10/ui`) holds the shared compound components, composing the design-system primitives one way and never importing the message catalogs — all content reaches its components through props. `packages/date` (`@grade10/date`) holds the date formatters and the typed-day bridge, React-free. Add no other package without a recorded product decision.

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

- Push with `pnpm push:main`, not a pull request: it rebases, runs the checks the paths owe and lands planning text (`openspec/changes`, `openspec/specs`, `docs/`) on `main`. Anything else goes through a pull request set to merge once green. Settle a conflict as `/spec-push` says.
- PR labels: use one of `feature`, `bug`, `ci`, `agent`, `enhancement`, `maintenance`, or `documentation`, when labels are available.
- Commit subjects use the Conventional Commits format. Do not add issue or PR prefixes; repository tooling adds them.
- Keep commits atomic. Split unrelated implementation, documentation, refactoring, and generated build output into separate commits when practical.

## Agent-platform parity

`AGENTS.md` is canonical. `AGENT.md`, `CLAUDE.md`, and `GEMINI.md` are compatibility aliases.

`.claude/skills/` is canonical, with `.codex/skills/` and `.cursor/skills/` symlinked to it, so every platform reads the same files. `.claude/agents/` is canonical for the round's readers, mirrored nowhere. The symlinks are tracked in git; a planning round that cannot find a reader fails there.
