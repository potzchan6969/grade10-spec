## Context

The round is `run-a-round-on-every-artifact`'s: the schema's perspectives
tables (`openspec/schemas/grade10-planning/schema.yaml`), `lib/perspectives.mjs`
reading a draft's diff for its triggers through `classifyDiff(diffText,
schema, target)` and `readersFor(schema, target, triggers)`, `plan-land.mjs`
writing the row and holding the `--tests` cell to the tree the group's tag
names (`landsHere`, `pathsIn`, `perspectivesCell`), the readers under
`.claude/agents/`, and the skills `workflow-round`, `workflow-build`,
`workflow-plan`. The messages are `stage-changes-and-notify-hands`'s: six
keyed kinds, `Your turn` among them, sent once per key from the sent-keys
file; the round's own replies go through `relay-post.mjs` on the wake's token,
which reaches the change's thread alone. The manual's checks are
`tools/manual/check/`: `context.mjs` builds `ctx.changing` from the written
deltas; `record.mjs`'s `checkAwaiting` refuses a wait on an artifact the
change has written; `deltas.mjs`'s `checkOverlap` keys claims by spec and
requirement across changes and skips ADDED blocks. The suite's checks are
`validate-test-cases.mjs`, whose `decidedByOwed` is "sits in a change" and
which parses no `### Manual` table. In the application repository, `pnpm
plan` (`scripts/openspec/plan.mjs`) resolves the store through the machine
registry — a separate clone at a rev, never the submodule — and `done` reads
`tasks.md` and greps the group's tree for each task's scenario ids.

Every rule this change adds was met once, in the cross-sell walkthrough; the
proposal's Why carries where.

## Goals / Non-Goals

- **Goals** — each rule lands once, in the script or the schema that owns the
  behaviour, with a test; a skill or a page points at the requirement rather
  than restating it; a statement an in-flight delta already makes is moved
  there, never contradicted beside it.
- **Non-Goals** — a new message kind; a change to the eight artifacts or the
  stages; the relay's wire; flipping a case on a test outside this store.

## Decisions

### A held row is the round's own reply, keyed like every reply

`Q1`. The round posts its summary to the hand of the stage and, for each held
row addressed to another hand, one more reply in the same thread through
`relay-post.mjs --row <Q>`: the row's question, the sentence it would put on
the page and the decision rows it touches, quoted from `decisions.md`, with
the hand mentioned. The key is `<change>/<round>/<row>` in the run's
`.round/rows.txt` ledger, read through the sent-keys helpers every message
uses, so a re-run posts nothing again. `--held` stays
the boolean it is (the confirm-with-recommendations button). The summary's
footer lists the moves of the hand it addresses alone, from the same table
the round derives the stage's hand from. Rejected: `--to <handle>` — the wake's
token reaches its thread alone, and a seventh kind reopens `change-stages`'
closed set on a question (Q31) that names the round's replies as this
capability's already.

### A page line is a ❓ line, and the reply quotes it

`Q2`. `workflow-round`'s "A remark on a page's marked lines" extends to the
round itself: a line a fix pass or a decided row puts on a page is written as
❓ naming the change's product manager, and the reply quotes the line before
and after (`(none)` on one side for a line added or removed). The routing is
`run-a-round-on-every-artifact`'s SC-16 and SC-24; the quoting is held by
`round-skill.test.mjs`, which reads the skill's moves table. Nothing holds a
landing on the line; an answered line carries 🚧 until the change that
delivers it archives.

### QA is a hand of Specified

`Q3`. `stage-changes-and-notify-hands`' Hands table and Whose-turn table gain
`qa` at Specified, so `hands.ts`'s derivation reaches QA on the landing of the
requirements and the existing `Your turn` sender tells them once, keyed on
the change, the stage and the role. The body for the `qa` role names the
suite's path, its case count and `/tcs-review <change>` in place of the
command to paste. The `tasks` instruction's walk group names "the suite
reviewed (`/tcs-review`)" as an input, held by `tasks-template.test.mjs`.
Rejected: a `review` kind, a second sender, a new stage.

### The interview's shape is one rule in the governance page

`Q4`. `docs/governance/round-summary.md` § Interview states it: about three
questions that change what is built, none trivial, one of them whether to do
it now, alone when nothing else is open; a further choice that meets the held
test held as a row (`Q27`); every default listed under "decided by the round";
`not now` writes `awaiting: proposal` on the product manager and drafts
nothing ahead. `workflow-plan` and `planning-pm` link the section and restate
nothing; `round-skill.test.mjs` asserts the link and the absence of a second
copy.

### The `apply` block carries `when:`, and `code` is a trigger

`Q5`. `TRIGGERS` in `tools/manual/src/api/types.ts` gains `code`, landed with
`schema.yaml` in one commit since `read-schema.mts` throws on a `when:` value
the list does not name. `lib/perspectives.mjs`'s `ofFile` raises `code` for a
changed line in any file whose name does not end `.md`, a message catalog
under `packages/i18n/messages/` aside; `copy` is raised as today, by
`docs/prds/` and by `prose()` on any markdown line, and by a catalog's line.
The `apply` block reads: the four `build.md` perspectives `when: [code]`, `reader`
`when: [copy]`, `qa` and `simpler` `[always]`, `operations` as it is. A group
whose diff raises neither trigger is read by the always readers, and the
summary says so. Rejected: `page` (a narrower `copy`), `suite` (nothing
reads it), a `readers:` key on the group (no key changes a round's size).

### One verifier over the round's readings

`Q6`. `workflow-round` § Steps 3 and 4: one verifier is dispatched with every
reader's findings, and its table carries one row per kind of finding naming
each reader that filed it, quoting each reader's fix where they differ.
`verifierNeeded` is unchanged. The three statements that said one per group —
the six-step table, SC-09 and "One per perspective" — are moved in
`run-a-round-on-every-artifact`'s delta by this change's round, as its row 43
records, since `checkFolded` refuses a MODIFIED block on a requirement the
durable spec does not hold. `verifier.md` and the agents README say the same.

### A fallback is derived, and a killed dispatch stops the round

`Q15`, `Q16`. The fallback is `sonnet` for every definition on `opus`; a
definition already on `sonnet` has none. The round writes `<name> (fallback)`
into the perspectives cell and the summary's perspectives line from the model
the run reports. `perspectivesCell` strips ` (fallback)` alone — today it
strips any parenthetical — and holds the name to the schema's list. A
dispatch the vendor kills is retried once on the fallback; a reader still
missing stops the round before the summary, `relay-post.mjs` tells the
thread which reader it lacks, and no row is written. Rejected: a `fallback:`
frontmatter key (nothing reads agent frontmatter but `model:`), a retry
budget.

### A row's paths are bare, and the group's tag decides the clone

`Q7`. `plan-land.mjs` keeps `landsHere` and `pathsIn` as they are. For a group
whose tag names the application repository it resolves each path against
`--app-root <dir>` when given, otherwise against
`git rev-parse --show-superproject-working-tree` of the store clone, and
refuses a path that root holds no file at, or a landing that finds no root,
naming the group's tag. The store-side rule stays: a store group's path the
store holds no file at is refused. Rejected: `<repository>:<path>` (a second
source for one fact, and `pathsIn` splits on `:`), `(unresolved)` (a row that
names a file nobody checked).

### One id grep, one verdict

`Q8`. `scripts/openspec/lib/cites.mjs` exports `citesId(text, id)`: a match of
`<id>` followed by no digit. `plan-land.mjs` calls it over every resolved
`--tests` path for the scenario id the entry credits and refuses a miss
naming the path and the id. `validate-test-cases.mjs` calls it over every
Manual row's named test where the path is this store's, for the row's case
id, and refuses a miss; a path the store does not hold is skipped, since the
walk lives in the application repository and its ids are checked at the tick.
Rejected: a substring (`SC-1` in `SC-12`), a warning beside a refusal,
crediting a Manual row for scenario ids it does not carry.

### Written, not run

`Q9`. `plan:land` takes `--unrun "<why>"` and writes `written, not run — <why>`
as the first clause of the stood cell; nothing else reads the clause. The
tasks stay unticked because the engineer does not tick them, and the suite's
Manual rows naming the walk read `to be walked in <test>` until the run that
ran the lane lands a row without the clause, ticks and rewrites them.
Rejected: a tick refused from a record clause — `plan done` reads `tasks.md`
alone, and a tick is never held (SC-38).

### Four gates corrected

- **References** (`Q10`) — `context.mjs` builds `ctx.changing` from each
  change's `specs/*/` directories as well as its deltas; a directory that
  reaches the archive with no delta is refused by the fold's preflight as
  today.
- **Awaiting** (`Q11`) — the `written.has(artifact)` branch of `checkAwaiting`
  is deleted; `readAwaiting` already refuses a wait that names nothing.
- **Two deltas on one requirement** (`Q12`) — `checkOverlap` stops skipping
  `added`, so the existing message names the other change with its heading,
  ADDED included; the fixture beside its test gains an ADDED against a
  MODIFIED. Rejected: scenario-level GIVEN matching and a negation table.
- **Manual where written** (`Q13`) — `validate-test-cases.mjs` refuses a
  `### Manual` heading outside `## Reconciliation` on a suite carrying a
  reconciliation, the same fence `specs-to-test-cases.md` gates the shape on;
  the archive's strip of scenario ids in Reconciliation covers the Manual
  rows. Rejected: `decidedByOwed` (a different fence), the header line (owed
  by coverage already), the scenario id as a reason (allowed while open).

### The tick reads the walk's ids

`Q14`. `grade10`'s `plan.mjs` `done` extends its scenario-id pass: for each
end-to-end file the group's tree holds, every `[<capability>-US<n>-TC<m>-<v>]`
in a test title is looked up in the store clone's suite, and one whose case
is not `actual` refuses the tick naming the id and its status. `tcs-to-e2e`
and `docs/architecture/e2e.md` point at the rule. Rejected: a `check-walk`
command, a Playwright reporter, reading the submodule.

## Service Interfaces

| Function | Input | Output |
| --- | --- | --- |
| `classifyDiff(diffText, schema, target)` (`lib/perspectives.mjs`) | a diff | the trigger set, `code` for a changed line in a non-markdown file |
| `readersFor(schema, "apply", triggers)` | the apply block's `when:` | the readers summoned plus the always set |
| `citesId(text, id)` (`lib/cites.mjs`) | a file's text, an id | whether the id appears with no digit after it |
| `plan:land … --tests "<sc>: <path>" [--app-root <dir>] [--unrun "<why>"]` | the cell, the application root | the row; refuses a path its clone does not hold or that carries no such id |
| `relay-post.mjs --row <Q>` | a held row's id | one reply in the thread mentioning the row's hand, once per change, round and row |
| `pnpm plan done <change> <group>` (grade10) | the group | the tick, or the scenario id no test cites, or the case id not yet actual |

## Risks / Trade-offs

- [A mixed group raises `code` and `copy` and is read by all six] → that is
  the decision; a group that wants fewer readers lands prose and code apart.
- [A reader's dissent hidden in one verdict] → the verifier's row quotes each
  reader's fix where they differ (`Q30`).
- [`checkOverlap` naming ADDED now fails an in-flight pair that was quiet] →
  the pair is real; the message names both and a person reads them.
- [A landing run from a store clone with no superproject and no `--app-root`]
  → refused naming the tag; the engineer lands from the application
  repository, as `workflow-build` § In the Application Repository says.
- [`TRIGGERS` landed apart from `schema.yaml`] → one commit carries both, and
  `read-schema.test.ts` asserts `code`.

## Migration Plan

1. The two in-flight deltas are extended in this change's round (their rows
   43 and 27), before this change's own delta is read.
2. `schema.yaml`, `types.ts`, `lib/perspectives.mjs` and their tests land in
   one commit; rows written before this change are never re-read.
3. `checkOverlap` naming ADDED lands with a run of `check:manual` over the
   store; any pair it names is read in that group's round.
4. The three in-flight suites holding a `### Manual` outside their
   reconciliation are moved in this change's own task.
5. `grade10`'s `plan done` lands with its submodule bump, after the store's
   groups.
