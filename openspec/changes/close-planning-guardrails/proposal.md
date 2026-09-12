**Author:** @ecchochan - 2026-09-12

## Why

The planning workflow is written down in one shape: a capability's page under `docs/prds/` is marked first, a change carries the deltas those marks derive from, and the fold at archive rewrites the durable spec once the change has shipped. Only the tail of that chain is checked. The head and the middle are prose, and the store shows what prose enforces:

| Signal on the store today | Count |
| --- | --- |
| In-flight changes | 43 |
| In-flight proposals linking no page | 23 |
| In-flight delta specs whose page carries no 🚧 line | 49 |
| Changes with every task checked and not archived | 8 |
| Changes with no `tasks.md` after a week or more | 11 |

The most recent archive commit carries no deploy evidence and says the pages were never marked. `pnpm run archive:preflight` is never run by CI, `openspec archive` runs without it, and `openspec validate` runs nowhere but on a developer's machine. The application repository's planning skills never mention the page. The board cannot tell a change waiting on a deploy from one nobody is finishing.

Success is a store where a change that skipped the page, a plan that skipped its design, or an archive that skipped its deploy proof fails the pull request that wrote it, and where the board names what is stale.

## What Changes

- **`pnpm check:manual` checks the head of the chain.** An in-flight change carrying deltas must link a page section from its proposal and put a 🚧 line under it, or carry `page_waived: <why>` in its `.openspec.yaml`. A change with an application task group must carry `tech-design.md`, or `design_waived: <why>`. The changes in flight that would fail today get the waiver written in one sweep, reading that they predate the rule.
- **The archive gate leaves a record the store can check.** `archive:preflight` writes the deploy evidence into the change's `.openspec.yaml` and refuses a change with unchecked tasks. `pnpm check:manual` fails an archived change dated from today whose record carries no evidence.
- **The store's CI runs `openspec validate`** on every push and pull request, changes strictly and durable specs.
- **`pnpm plan shipped <change-id>`** in the application repository answers the one question the store cannot: it reads the environment's last successful deploy run, checks that every merge commit of the change is contained in it, runs the store's preflight with that sha, and commits the record. The archive skill runs it instead of hand-typed commands.
- **The board names what is stale.** A change with no `tasks.md` shows how long it has waited; a change with every task checked says what to run next.
- **The application repository's skills carry the page.** `planning-pm` marks the pages before the deltas, `planning-dev` decides on `tech-design.md` out loud and checks tasks off as they land, `reality-sweep` reads pages at their real path and adds a lane for 🚧 lines whose change has finished, and every session's instructions say when to claim, check off, and record a ship.

## Non-Goals

- Marking the pages of the changes already in flight. They carry a waiver saying so and archive under the old shape.
- Archiving the eight changes whose tasks are all checked. The board now names them and what to run.
- Verifying a deploy from inside the store. The store records what the application repository verified.
- Changing the task-ownership format, the schema's artifact list, or which artifacts a hand writes.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. `skip_specs: true`: this change alters checks, scripts, skills and governance prose, never a product behaviour.

## Impact

- `grade10-spec`: `tools/manual/check/` gains rules and tests, `scripts/openspec/archive-preflight.mjs` writes and refuses more, a new workflow runs `openspec validate`, and the governance page, `AGENTS.md`, and three skills say so.
- `grade10`: `scripts/openspec/plan.mjs` gains `shipped` and the board's stale flags; `AGENTS.md`, two conventions pages, and six skills change.
- Every author of a new change: the page and the design decision become refusals rather than reminders.

## Follow-on changes

- The eight changes with every task checked are run through `pnpm plan shipped` and archived, or waived on record.

## References

- [PRDs and OpenSpec](../../../docs/governance/prd-and-openspec.md)
