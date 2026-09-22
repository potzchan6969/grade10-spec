## Context

The round is `run-a-round-on-every-artifact`'s: the schema's perspectives
tables (`openspec/schemas/grade10-planning/schema.yaml`), `perspectives.mjs`
reading a draft's diff for its triggers, `plan-land.mjs` writing the row and
holding the `--tests` cell to the store's tree, the readers under
`.claude/agents/`, and the skills `workflow-round`, `workflow-build`,
`workflow-plan`. The messages are `stage-changes-and-notify-hands`'s: one
keyed message per move, addressed to the hand of the stage through the relay.
The manual's checks are `tools/manual/check/`: `pages.mjs` resolves a page's
`spec:` against the durable specs and the in-flight deltas; `record.mjs`
refuses a wait on an artifact the change has written; `deltas.mjs` refuses two
MODIFIED blocks on one requirement. The suite's checks are
`validate-test-cases.mjs`, which reads the file header and each case and
parses no `### Manual` table. In the application repository, `pnpm plan`
(`scripts/openspec/plan.mjs`) claims, syncs, ticks and flips against the store
pinned as its submodule.

Every rule this change adds was met once, in the cross-sell walkthrough; the
proposal's Why carries where.

## Goals / Non-Goals

- **Goals** — each rule lands in the script or the schema that owns the
  behaviour, with a test; the skills and the pages point at the governance
  page rather than restating; nothing here modifies the in-flight delta.
- **Non-Goals** — a new message channel; a change to the eight artifacts or
  the stages; the relay's wire.

## Decisions

### A message per hand is a keyed message, not a summary section

The spec governs what each hand is told. The summary a round posts is one
message for the hand of the stage; a held row addressed to another hand is a
second keyed message (`stage-changes-and-notify-hands`'s `Every message is
keyed and sent once per move`), keyed on the row's id, carrying the row's
question, the sentence it would put on the page, and the decision rows it
touches quoted from `decisions.md`. `relay-post.mjs` gains `--to <handle>` and
`--held <Q>`; the summary's footer lists the moves of the hand it addresses
alone, from the same table the round derives the stage's hand from. Rejected:
one summary listing every hand's moves (the walkthrough's shape) — the PM read
thirty lines to find two.

### A page line a round lands is a ❓ line, and the summary quotes it

The page grammar already says a product detail from any hand but the PM
reaches the page as ❓; `workflow-round`'s "A remark on a page's marked lines"
extends to the round itself: a line a fix pass or a decided row puts on a page
is written as ❓ naming the PM, and the PM's message quotes the line before and
after. No script change: the rule lives in the skill's moves table and the
governance page; `check:manual` already refuses a 🚧 line no change delivers.

### QA is asked on the landing of the requirements

`plan:land` on `specs` (the requirements' landing) posts the keyed message
`review` to the `qa` hand: the suite's path, its case count, and that the walk
group waits on the review. The `tasks` instruction's walk group names "the
suite reviewed (`/tcs-review`)" as an input beside the groups it needs, held by
`tasks-template.test.mjs`. Rejected: a new stage — the eight stages stand; the
review is a message on an existing landing.

### The interview's shape is the skill's

`workflow-plan` § The interview: at most three questions, each one that
changes what is built, one of them whether to do it now; every default the
round applies is listed under "decided by the round" in the same message.
`planning-pm` carries the same rule and the `grilling` skill's "the whole
frontier in one round" is scoped to a plan's stress test, not a first
sentence. No script change.

### The `apply` block carries `when:` triggers, and a page and a suite are triggers

`perspectives.mjs` gains two triggers: `page` (a line in a file under
`docs/prds/`) and `suite` (a line in a `*-tcs.md`); `ofFile` raises them. The
`apply` block's four build readings and `qa` become `when: [code]` where `code`
is a line in any file outside `docs/`, `openspec/` and `*.md`; `reader` joins
the block `when: [page]`, `qa` stays `[always]` (a suite is its subject),
`simpler` stays `[always]`. A group that lands prose alone summons `reader`,
`qa`, `simpler`. Rejected: a per-group `readers:` key in `tasks.md` — the
spec says no key changes a round's size.

### One verifier over the round's readings

`workflow-round` § Steps 3 and 4: the round dispatches one verifier with every
reader's findings, grouped by reader, and the verifier's "one fix per kind"
rule now spans readers: a finding several readers filed is one row that names
them. `perspectives.mjs`'s `verifierNeeded` is unchanged (true where two or
more readers ran). Rejected: a dedupe step before verify — a second mechanism
where widening the verifier's input does it.

### A fallback is a suffix in the perspectives cell

The row's `Perspectives` cell takes `<name> (fallback)`; `plan-land.mjs`'s
`perspectivesCell` strips the suffix before holding the names to the schema's
list. The reader definitions name `fallback: sonnet` in their frontmatter, and
the round dispatches it when the definition's model refuses twice. Rejected: a
new column — the record's columns are read by tooling in two repositories.

### The record names the repository with each path

A `--tests` cell path takes the form `<repository>:<path>` where `<repository>`
is a task group tag the plan issues (`grade10-spec`, `grade10`); a bare path is
this store's. `plan-land.mjs` resolves a path tagged for this store against the
store's root, and a path tagged for another repository against `--app-root
<dir>` when given, the directory the landing is run from in the application
repository (`workflow-build` § In the Application Repository); with no
`--app-root`, a tagged path is accepted and the row says `(unresolved)` after
it. The same form is accepted on a case's `**Decided by:**` line by
`tcs-automated.mjs` and `validate-test-cases.mjs`, and `pnpm plan automated`
in the application repository writes it after checking the file exists there.
Rejected: the store reaching the application repository through a submodule —
the store has none; the application repository holds the store.

### A cited test carries the id

`plan-land.mjs` reads every resolved `--tests` path and refuses one that does
not contain the scenario id it is credited for (`<capability>-SC-<n>` as a
substring). `validate-test-cases.mjs` reads each Manual row's named test where
it resolves in this store and warns when the row's case id and the row's
scenario ids appear nowhere in it. Rejected: parsing the test's assertions —
the id is the contract the tree already uses.

### Written, not run

`plan:land` takes `--unrun "<why>"`, which writes `written, not run — <why>`
as the first clause of the `Stood` cell and refuses `pnpm plan done` on the
group's tasks until a later row on the same group carries no such clause.
The suite's Manual rows that name the walk read "to be walked in" until then;
the rule is `specs-to-test-cases.md`'s.

### Four gates corrected

- **References** — `pages.mjs` adds to `ctx.changing` every capability a
  proposal's `## Capabilities` names under `### New Capabilities`, so a page
  written first resolves.
- **Awaiting** — `record.mjs` keeps the refusal for a wait on an artifact the
  change has written *only when the wait names no `what is wanted`*; a wait
  with its dated clause stands inside a written artifact, and `check:manual`
  lists it under the change's waits.
- **Cross-delta scenarios** — `deltas.mjs` collects, per requirement name,
  every scenario across the in-flight deltas that touch it (ADDED or MODIFIED)
  and refuses two whose GIVEN lines are equal and whose THEN lines state
  opposite outcomes (`SHALL` against `SHALL NOT`, `opens` against `stays
  inert` read as a negation pair from a small table); a match names both
  changes.
- **Manual shapes** — `validate-test-cases.mjs` refuses a `### Manual` outside
  `## Reconciliation`, a scenario id in a Manual row's reason, and a
  `**Out of suite:**` declared in prose with no header line, on a suite in a
  change carrying `decisions.md` (the same gate `decidedByOwed` uses).

### The application repository checks a walk's ids

`pnpm plan check-walk <spec file>` in `grade10` reads every `[<case-id>]` in a
Playwright spec's test titles and refuses one whose case is not `actual` in the
store's suite, reading the suite from the submodule at its pin; `pnpm plan
done` runs it over the group's e2e files before ticking. Rejected: a Playwright
reporter — the check belongs where the tick is.

## Service Interfaces

| Function | Input | Output |
| --- | --- | --- |
| `readersFor(schema, target, triggers)` | triggers now include `page`, `suite`, `code` | unchanged shape |
| `classify(diff)` (`perspectives.mjs`) | a diff | the trigger set, with `page` for `docs/prds/`, `suite` for `*-tcs.md`, `code` for the rest |
| `plan:land … --tests "<sc>: <repo>:<path>" [--app-root <dir>] [--unrun "<why>"]` | the cell, the root the tagged paths resolve against | the row; refuses a path that resolves and carries no id, a store path that does not exist |
| `relay-post.mjs --to <handle> --held <Q>` | a held row's id and the hand | one keyed message to that hand, or printed in a terminal |
| `pnpm plan check-walk <file>` (grade10) | a spec file | ok, or the ids whose case is not actual |

## Risks / Trade-offs

- [The `code` trigger misreads a group that lands both prose and code] → both
  trigger sets are raised and both reader sets run; a mixed group is read by
  all.
- [Two verdict styles in one verifier's table hide a reader's dissent] → the
  verifier's row names every reader that filed the finding and quotes each
  reader's fix where they differ.
- [A negation pair the table does not know passes the cross-delta check] → the
  table is data in `deltas.mjs` beside its test, and a miss is one row added;
  the check warns, never fails, on a pair it cannot read.
- [An `--unrun` row blocks a tick forever where no lane ever runs] → the tick
  is released by a later row on the group without the clause, which the run
  that ran the lane writes.
- [`--app-root` given wrong resolves nothing and the row says `(unresolved)`
  on every path] → the row is refused when every tagged path is unresolved
  and `--app-root` was given.

## Migration Plan

1. The skills, the agents and the governance page land first (no behaviour a
   check refuses changes).
2. The scripts and their tests land with the schema's `when:` triggers; the
   in-flight changes' rounds keep their rows (a row written before this change
   is never re-read).
3. The Manual-shape refusals apply to suites in changes carrying
   `decisions.md`; the three in-flight suites that hold a `### Manual` are
   moved under `## Reconciliation` in this change's own task.
4. `grade10`'s `pnpm plan check-walk` lands with its submodule bump.

## Open Questions

- Whether the fallback model is one for every reader or per definition —
  answerable when a second outage is seen; `sonnet` for all until then.
