# Product specification and design-system repository

This repository is the versioned source of truth for product requirements and the design system beneath Grade10 applications. It is not an application: do not add data fetching, authentication, routing, stores, or feature orchestration.

## Operating principles

- Treat product managers, designers, and engineers as collaborators. Check existing pages, primitives, and conventions before proposing a new structure.
- Write everything — product pages, cases, commits, replies — in the house style, [`docs/governance/writing.md`](docs/governance/writing.md): headings as plain Title Case labels, values first, items leading with the key term in bold, the reader's words, short sentences with no flourish, decided facts flat and present-tense, ❓ or `TBC` on anything unconfirmed, 🚧 only on what is confirmed and being built. Copy the page its Copy table names for the kind of page you are writing. Never cite a scenario id (`…-SC-32`) on a manual page. A case that only proves a rule, a state that dresses an outcome and a mechanism belong to the cases file, the story and the architecture doc.
- Prefer the smallest reusable artifact. Call out a preference or design-system choice as a choice, not as an objective improvement.
- Keep changes reviewable: one product decision or component capability per push where practical.
- Do not modify generated `packages/design-system/src/theme.css` or `src/themes/grade10.css` by hand. Edit `tokens.json` or `tokens.config.json` and regenerate with `pnpm run tokens:build`.

## Questions and blockers

Use this Clarification Request format whenever human input is needed.

- **Labels** - Put requests for an answer or decision under **Questions**, and required human actions under **Blockers**. Mark optional feedback as optional.
- **Items** - Use a numbered list, one question or blocker per item, ordered by impact. Open with `**Short title** -` and the exact answer, decision, or action needed, in the reader's words.
- **Options** - Where alternatives exist, give lettered options with the recommended option first and marked `Recommended`. State the outcome and cost of each; do not invent alternatives for a required action.
- **Context** - Explain why the answer or action matters and what waits on it. Name the affected journeys, requirements, contracts, or tests; optional feedback must not appear to block work.
- **Reasons** - Give the supporting evidence, errors, past decisions, or requirements. Quote and link relevant sources, naming decision rows or requirement anchors; use published manual or change pages when available.
- **Decisions made by Agents** - After the list, state any decisions made without asking and the option taken. Omit this when there are none.

```markdown
### Questions

1. **<Short title>** - <Exact question or decision needed.>
   - **A - <Option> - Recommended** - <Outcome and cost.>
   - **B - <Option>** - <Outcome and cost.>
   - **Why it matters** - <User or operator consequence.>
   - **Blocks** - <Work waiting on the answer, or None - optional feedback.>
   - **Reasons** - <Supporting evidence or quoted decision or requirement, with a source link>.

### Blockers

1. **<Short title>** - <Exact human action needed.>
   - **Why it matters** - <Why the action is required.>
   - **Blocks** - <Work that cannot proceed.>
   - **Reasons** - <Relevant error, evidence, or quoted decision or requirement, with a source link.>

### Decisions made by Agents

- **<Decision>** - <Option taken without asking.>
```

## Sources of truth

| Need | Canonical location | Notes |
| --- | --- | --- |
| What the product is and should be | `docs/prds/products/<product>/<domain>/<page>.md` | The only spec: values, flows in order, `## Always`, `## Later`, worked examples, rule ids `{#id}`, 🚧/❓ marks and the `Product decisions` block. Built from directly. See [`Page First`](docs/governance/page-first.md). Page grammar: `docs/prds/guides/writing-the-manual.md`. |
| Proof | Application tests, each titled with `<page>#<id>` | The application's CI runs `scripts/pages/pages.mjs gate`. |
| Cases no example walks | `docs/cases/<product>/<domain>/<page>.md` | QA's rows: abuse, boundaries, another tab, failures, records in flight, walks by hand. Never a page value restated. |
| Source material behind a decision | `docs/references/<doc>.md` | Explanatory, never authoritative. See `docs/references/README.md`. |
| Design token values | `packages/design-system/tokens.json` | Designer-owned data; the CSS themes are generated projections of it. |
| User-facing copy and translations | `packages/i18n/messages/{shared,<brand>}/<locale>/<namespace>.json` | `shared/` answers every key no brand claims, once per language; a brand answers only what says something about itself, in every language it speaks. Assembled in `src/catalogs.ts`. Types refuse a key the vocabulary does not name; `pnpm run test` refuses layers that leave one unanswered, or answer one twice. |
| Design-system primitive | `packages/design-system/src/components/` | shadcn primitives and their colocated stories. |
| Product component implementation | `packages/ui/src/blocks/` | Shared compound components, one directory per capability. Its TypeScript props and its stories are its export contract. |
| Legacy OpenSpec | `openspec/` | Frozen: no new change opens. An open change finishes or folds into its page; durable specs are removed capability by capability once page and cases carry them - [`Page First`](docs/governance/page-first.md#openspec). |

Bugs follow `docs/governance/bug-fixes.md`.

Read [`docs/governance/system-design.md`](docs/governance/system-design.md) before designing or building, and [`docs/governance/design-system-workflows.md`](docs/governance/design-system-workflows.md) when you know the task but not the rail.

## Product workflow

A feature is a change to its page, built straight from it. Read [`docs/governance/page-first.md`](docs/governance/page-first.md).

| Step | Who | Skill | Output |
| --- | --- | --- | --- |
| 1. Mark the page | Product manager, or whoever learns the detail | `prd-authoring` | 🚧 and an id per outcome, ❓ on what is open, a decisions row |
| 2. Read it fresh | A fresh agent, or QA | `page-cases` | Gaps as ❓ lines; cases no example walks |
| 3. Design | Designer | `storybook-workbench` | A story under each 🚧 line the board lists with `none` |
| 4. Build | Engineer or agent | `page-build` | Tests titled `<page>#<id>`, then code |
| 5. Release | Whoever ships | `page-build` | 🚧 off once a release carries the line and its ids pass |
| 6. Run | QA | `page-cases` | A run sheet from `pnpm pages:cases <prefix> --cited <app-dir>` |

`pnpm pages:board [prefix] [--build|--open|--design|--work]` is everyone's work list.

Ask only what changes scope or an irreversible product choice. Otherwise write a ❓ line on the page and go on.
`planning-pm`, `planning-design` and `planning-dev` route new work to the steps above and an open OpenSpec change to their `LEGACY.md`; the `workflow-*`, `accept-*`, `spec-to-tcs` and `tcs-*` skills serve only open OpenSpec changes.

## Design Override

The agreed look is what `main` holds in `packages/ui/src/blocks`, `packages/design-system/src/components`, its `tokens.json` and `apps/preview/src/pages`. The hooks `pnpm install` sets stop a commit that changes it, or a merge that drops its lines.

- **Never restyle it on the way** — a missing state or variant is the designer's; never pass `--no-verify`.
- **A stop is your person's** — show them its lines; only on their yes, end the message with `Design-Override: <what changes and why>` — [Design Override](docs/prds/products/shared/design-sync/design-override.md).

## Product UI component contracts

This repository hosts the shared product UI components: a compound component lives once in `packages/ui` (`@grade10/ui`) and every consuming application imports it rather than maintaining its own copy.

Read [`docs/governance/ui-component-contracts.md`](docs/governance/ui-component-contracts.md) before designing a new public UI contract or making a material component-contract change.

- Components receive all consumer-owned content, product state, and behavior through props. Callback props use `on<Event>` names.
- No data fetching, mutations, routing, app stores, analytics, feature flags, browser storage, or application imports inside the component itself.
- Components may use React state, context, effects, refs, timers, and browser APIs for internal presentation and DOM behavior. They must not use those mechanisms to acquire, persist, subscribe to, or orchestrate consumer-owned product state.
- The export contract is the block's TypeScript props and its stories. A commit that changes it names the exports affected and the consuming applications that must adapt.

## Design system package

`packages/design-system` (`@grade10/design-system`) holds the theme tokens and shadcn primitives. `packages/i18n` (`@grade10/i18n`) holds the message catalogs. `packages/ui` (`@grade10/ui`) holds the shared compound components, composing the design-system primitives one way and never importing the message catalogs — all content reaches its components through props. `packages/date` (`@grade10/date`) holds the date formatters, the typed-day bridge and the date arithmetic, React-free. Add no other package without a recorded product decision.

Use the `design-system-primitives` skill whenever creating or changing a primitive under `packages/design-system/src/components/`.

- The package is consumed from source: `exports` point at `src/`, there is no build step, and no `dist/` is committed.
- Stories sit beside each primitive: [`docs/governance/storybook.md`](docs/governance/storybook.md).
- Token flow: `tokens.json` is the source of truth, `tokens.config.json` holds the engineer-owned projection rules, and Figma plus the theme CSS files are both projections. Read `packages/design-system/DESIGN.md` before touching any leg of that pipeline.
- Read [`docs/governance/design-code-sync.md`](docs/governance/design-code-sync.md) before adding a primitive or changing one that has a Figma counterpart. A component may not offer a variant or size the Figma component set does not define; where code and design genuinely disagree, write it as a ❓ line on the product page rather than absorbing it into the Code Connect template.
- The Figma legs (`tokens:import`, `tokens:push`, `tokens:plugin`) require a human to run a plugin inside Figma; they have no unattended path.

## Sharing with consuming apps

Consumers add this repository as a Git submodule, build from the product pages and the design tokens, and run `node <submodule>/scripts/pages/pages.mjs gate . [--allow <file>]` in CI. Shared compound components are consumed from `@grade10/ui` from source, so a shared component change lands once here and reaches every application through a submodule bump. Application-owned state, adapters, and wiring remain implementation work in each application.

Pin the submodule SHA in the application repository; updates are normal pull requests that move that SHA. Do not use git submodules inside this repository; this repository itself is the reusable submodule.

## Validation

Run the appropriate checks before handoff:

- `pnpm run agent:check-parity` after agent instructions, rules, or skills change.
- `pnpm push:main` runs `pnpm check:manual` and `pnpm pages:check` on what it sends, plus the legacy OpenSpec checks while `openspec/` exists; run one alone while drafting. `check:manual` refuses a page that does not parse or links nothing; `pages:check` refuses a bad or reused id, warns on an id that vanished or a live rule changed under its id, and refuses this file past 150 lines.
- Legacy OpenSpec: `pnpm run archive:preflight <change-id>` before closing a change; `pnpm run test:openspec` after `scripts/openspec/` changes.
- `pnpm --dir tools/relay test` after anything under `tools/relay/` changes.
- `pnpm run design-sync:check` after a design-system primitive changes.
- `pnpm run diagrams` after a chart source under `docs/prds/diagrams/` changes; commit the rendered SVG, which `pnpm run diagrams:check` holds to its source in CI.
- `pnpm run tokens:build` after `tokens.json` or `tokens.config.json` changes; commit the regenerated theme CSS.
- `pnpm run lint` for repository formatting and static checks.
- `pnpm run typecheck` after any TypeScript change.

## Pushes, Pull Requests and Commits

- Push with `pnpm push:main`, not a pull request: it rebases, runs the checks the paths owe and pushes, whatever paths touch. A pull request is for a change its author wants someone to read first (`pnpm push:main --pr`). Settle a conflict as `/spec-push` says.
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
