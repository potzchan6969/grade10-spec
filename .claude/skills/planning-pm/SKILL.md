---
name: planning-pm
description: Write the product manager's half of an OpenSpec change - the proposal, the user journeys, and the spec outline that fixes the anchor set - then hand that set to planning-qa and answer what its two readings escalate. Use when a PM or designer is specifying a change, and stop where the anchor set stops.
---

# The product manager's artifacts

**Two of the seven artifacts in `grade10-planning` are yours to write**, and
they are the first two:

| Artifact | File | What it holds |
| --- | --- | --- |
| `proposal` | `proposal.md` | Why this problem, for whom, what it will not do |
| `user-journeys` | `specs/<capability>/user-journeys.md` | The journeys added, changed or retired, and the ones this change leans on |

A third is yours **when you already have the design**: `ui-design.md` is the
designer's file, and a PM who has the screens in hand writes it in the same
change rather than waiting for one to be drawn. A change with no user-facing
surface skips it entirely - `planning-design` holds its shape.

`spec.md` is **generated in two passes over one file**, and only the first of
them is yours. Neither it nor `feature-tcs.md` names a teammate in the schema:
they sit on nobody's worklist, and you review them rather than author them.

| Generated | File | Whose run |
| --- | --- | --- |
| `specs` — pass one | `specs/<capability>/spec.md` | **Yours**: `## Purpose` and `## Feature set`, then stop |
| `test-cases` | `specs/<capability>/feature-tcs.md` | `/planning-qa`: a blind suite, drafted without sight of the scenarios |
| `specs` — pass two | `specs/<capability>/spec.md` | `/planning-qa`: the requirement deltas and their scenarios, reconciled against that suite |

Generated is not unreviewed. **You are the reader of record** for the outline
before you hand it on, and for the scenarios when they come back: `/planning-qa`
stops at every contradiction it cannot settle, and those stops are yours to
answer.

**Stop at the outline.** `/planning-qa` takes the anchor set and runs the two
readings on the same branch. A designer writes `ui-design.md` unless you already
had the design, and the engineer who picks the change up writes `tech-design.md`
and `tasks.md` - on this same change, never a second one. A change with no
`tasks.md` reads as still being planned on both boards; that is the handoff
signal, and it is the only one, so say the change needs picking up rather than
assuming someone will find it.

The PRD under `docs/prds/` is yours to keep whole. Everyone writes on it - a
designer's state, an engineer's constraint, a QA case that exposes a rule nobody
wrote land there first, marked 🚧 or ❓ - and you are the teammate who keeps it one
record.

## The run

The author triggers `/planning-pm` and nothing else. Everything above the line
happens inside that one invocation.

```
grilling                        author answers rounds until the frontier is empty
    ↓
PRD marks 🚧 / ❓                the source of the feature set's groups
    ↓
user-journeys                   yours, written
    ↓
specs, pass one                 generated: Purpose + Feature set
    ─────────────────────────────────────────────────────────────
    ↓
/planning-qa                    the two readings, and the reconciliation
                                that escalates back to you
```

Everything this run produces is `draft`. Nothing in it claims review.
`/tcs-review` is QA's, in its own pull request, at its own pace.

## Steps

1. **Read from an up-to-date main.** `git fetch origin` first; when
   `git log --oneline HEAD..origin/main` is not empty, update before reading. A
   MODIFIED block copied from a stale spec silently reverts whatever landed in
   between, and an overlap scan against a stale `openspec/changes/` finds
   nothing. Then read the capability's PRD under `docs/prds/` when one exists,
   then every active change in `openspec/changes/` on its spec, then the
   capability under `openspec/specs/<product>/<domain>/<capability>/`. An active
   change already folding a requirement this one touches is extended or
   superseded, never doubled: whichever archives second reverts the first. Find
   facts yourself - bring only decisions to the author.

2. **Interview the author.** Run the `grilling` skill's round-based frontier
   interview before drafting. Do not write until the frontier is empty and the
   author confirms shared understanding. The interview scales with the open
   questions, not the change's size.

   A question settles three ways: answered, accepted as recommended, or
   **deferred** - the author saying they are not the right person for it. A
   deferred question goes under the proposal's open questions with a note on who
   should settle it, and does not hold the draft. Sizing, export names, and what
   code a change touches are never the author's to answer.

3. **Mark the PRDs first.** One 🚧 line per outcome the reader can see, in the
   reader's words and in the section it belongs to; a ❓ line or decisions row
   for what the author deferred; the decisions the change turns on
   (`prd-authoring`). House style is `docs/governance/writing.md`.

   **These marks are the source of the feature set's root groups.** Every group
   traces back to a line here, which is also why a change that marks a 🚧 line
   can never claim `skip_specs`.

   A capability with no PRD gets one first, or the change records
   `page_waived: <why>`. `pnpm check:manual` refuses a change carrying deltas
   with neither a 🚧 line under a linked section nor the waiver.

4. **Create the change through the CLI.**

   ```bash
   pnpm openspec new change <change-name> --schema grade10-planning
   ```

   Kebab-case. A directory made by hand records nothing in `.openspec.yaml`.

5. **Read the enriched instructions as you reach each artifact.**

   ```bash
   openspec instructions proposal --change <change-name>
   openspec instructions user-journeys --change <change-name>
   openspec instructions specs --change <change-name>
   ```

   These carry this store's own rules on top of the schema's. Read them rather
   than working from memory; `specs` carries both of its passes, and the second
   is the one `/planning-qa` works from.

   `openspec status` calls `specs` done as soon as the outline exists, because a
   file is there. **`pnpm check:manual` is the gate that means anything** - it
   fails a capability whose suite sits beside a `spec.md` that carries no
   requirements section, which is the only machine evidence that pass two
   happened at all. It is never downgraded to a warning. (`pnpm plan:preflight`
   is unrelated: it guards `tasks.md` against being overwritten while
   engineering is implementing.)

6. **Write the proposal and the journeys**, in that order - the two files
   that are yours. Under the proposal's `## References`, link every section you
   marked, so the manual shows the change under that heading.

7. **Generate the outline**, then read it. `## Purpose` and `## Feature set`
   come from the proposal, the marks and the journeys, and together with the
   journeys they are the **anchor set** - the capability's full journey set once
   this change folds, union the root groups of its `## Feature set`. Every
   anchor downstream hangs off those root groups; a group that is wrong is
   cheapest to fix here, and dearest after both readings have been taken from
   it.

8. **Validate what you wrote, then hand it on.**

   ```bash
   pnpm run validate:changes <change-name>
   pnpm check:manual
   ```

   **The outline owes a wait line.** What you commit is a `spec.md` that names
   no requirement, and both gates refuse one without a line saying why: write
   `awaiting:` with `specs: <what is still to come>` in the change's
   `.openspec.yaml` before you validate. `validate:changes` then reports the
   change as waiting rather than failing it, and the wait is not read as over
   until the requirements land. `/planning-qa` deletes the line with the
   scenarios.

   Commit the journeys and the outline, and say the change is ready for
   `/planning-qa`. It runs on this same branch: the blind suite and the
   scenarios land in this pull request, so `main` never carries a journey with
   no suite beside it.

   A requirement nobody can decide yet is the same line for a different
   reason - a wait, not a guess - and it stays after `/planning-qa` has run.

9. **Answer what the readings escalate.** `/planning-qa` pauses on a case
   nobody ever decided, and on two readings that state opposite things. Those
   pauses are grilling rounds, and they are yours: the run does not settle a
   product question, and a ❓ on the PRD is how one that nobody present can
   settle gets recorded. Read the scenarios against your journeys when they come
   back - generated is not unreviewed, and you are the reader of record.

## Escape hatches

| Hatch | Who decides | Test |
| --- | --- | --- |
| `skip_specs: true` + `skip_specs_why: <why>` | Author | No spec delta exists at all |
| `blind_pass_skipped` | **The checker** | A delta exists but carries no new behaviour |
| `**Walked by:** nobody` | Author | Not a hatch - anchors route to the feature set |

`skip_specs` is the one switch that disables the whole cross-check, and the
cheapest line in the file to write. The switch stays `true` — the OpenSpec CLI
owns that key and reads it as a boolean — and **`skip_specs_why` beside it
carries the reason**. A change that lays down a 🚧 mark cannot claim it: 🚧 means an outcome a reader can
see, so claiming both is the author contradicting themselves. The realistic
failure is not dishonesty - it is an author who sincerely believes a refactor
changes no behaviour and is wrong.

`blind_pass_skipped` is granted by `pnpm check:manual`'s `blind` rule - by it
staying quiet - when the spec diff **adds no scenario id** and **modifies no
`**GIVEN**` / `**WHEN**` / `**THEN**` line** -
splitting a requirement for readability, a typo in a table's prose, a rename, a
scenario moved under the requirement it always belonged to. The author cannot
declare it. Where the checker refuses and the author disagrees, that is a
grilling round, not a self-service waiver.

## Commits

| # | Commit | Proves |
| --- | --- | --- |
| 1 | `docs(prd): …` | The product judgement is in the reader's words |
| 2 | `spec(<domain>): journeys and outline` | The anchor set is fixed |

Commits 3 and 4 are `/planning-qa`'s, on this same branch: the blind suites, then
the scenarios and the reconciliation. The diff between them is what the second
reading bought.

## Where a statement belongs

| Statement | Home |
| --- | --- |
| What the product should be, in the reader's words | The PRD, marked 🚧 or ❓ |
| Anything testable | The delta spec, and nowhere else - generated, and yours to check |
| Who walks it | `user-journeys.md` beside that spec |
| Why this problem, for whom, what was ruled out, what will be measured | The PRD's `Product decisions` block |
| How it will be built | `tech-design.md` - not yours |

## Related

- `grilling` - the interview that precedes the proposal, and the escalation.
- `planning-qa` - the two readings taken from your anchor set, and the wider suites.
- `spec-to-tcs` - the blind pass and the isolated input it builds.
- `openspec-propose` - who writes what across the whole change.
- `prd-authoring` - for the product judgment a requirement will not preserve.
- `planning-design`, `planning-dev` - the artifacts that come after yours.
