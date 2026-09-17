---
name: planning-pm
description: Write the product manager's half of an OpenSpec change - the proposal, the decisions the interview settled, and the user journeys - then hand the change to planning-qa, which writes spec.md, and answer what its two readings escalate. Use when a PM or designer is specifying a change, and stop before spec.md.
---

# The product manager's artifacts

**Three of the eight artifacts in `grade10-planning` are yours to write**, and
they are the first three:

| Artifact | File | What it holds |
| --- | --- | --- |
| `proposal` | `proposal.md` | Why this problem, for whom, what changes |
| `decisions` | `decisions.md` | The goals, the non-goals, what the interview settled, and what the blind pass raised |
| `user-journeys` | `specs/<capability>/user-journeys.md` | The journeys added, changed or retired, and the ones this change leans on |

`decisions.md` is the interview's record, and everything after it is drawn from
that scope: the journeys, the design, the feature set. Every change carries it,
and a change that had little to settle carries a short one — an empty
`## Decisions` table says nothing had to be chosen, which is a claim worth
being able to make. `check:manual`'s `decided` rule asks for the file on every
change opened since it shipped; `decisions_waived: <why>` stands in where there
was truly nothing, and a lint sweep is the shape of that.

**On a change older than the file, write the waiver rather than the file.** Its
goals and non-goals can be lifted from the proposal, but the rounds cannot: the
`Instead of` column is exactly what nobody wrote down, and a table of guessed
rejections reads as a record and is not one. Where the change is still being
specified the interview can be finished and the file written for real; where
the requirements and suites are already written, the file would inform nothing
and `decisions_waived` says so in one line.

A fourth is yours **when you already have the design**: `ui-design.md` is the
designer's file, and a PM who has the screens in hand writes it in the same
change rather than waiting for one to be drawn. A change with no user-facing
surface skips it entirely - `planning-design` holds its shape.

**This lane is a designer's too.** A designer specifying a new change writes
the same three files, through this skill, and hands the design reference -
Storybook, `packages/design-system`, `packages/ui`, `packages/i18n` - over with
them, so the outline is written against the inventory rather than an imagined
one. `planning-design` routes here for that, and holds what the reference is.

**You do not open `spec.md`.** Both of its passes belong to the run that takes
the two readings - `/planning-qa`, or `/planning-dev` on a change an engineer
authored. Neither `spec.md` nor `feature-tcs.md` names a teammate in the schema:
they sit on nobody's worklist, and you read them rather than write them.

| Generated | File | Whose run |
| --- | --- | --- |
| `specs` — pass one | `specs/<capability>/spec.md` | `/planning-qa`: `## Purpose` and `## Feature set`, from your journeys and your 🚧 lines |
| `test-cases` | `specs/<capability>/feature-tcs.md` | `/planning-qa`: a blind suite, drafted without sight of the scenarios |
| `specs` — pass two | `specs/<capability>/spec.md` | `/planning-qa`: the requirement deltas and their scenarios, reconciled against that suite |

Generated is not unreviewed. **You are the reader of record** for all three,
and all three come back together. The root groups trace to your own 🚧 lines
and every anchor downstream hangs off them, so you read them beside the
scenarios and the suite built on them rather than on their own - the run does
not stop to have the outline read. `/planning-qa` stops at every contradiction
it cannot settle, and those stops are yours to answer.

**Stop at the journeys.** `/planning-qa` writes the outline, then runs the two
readings from it, on the same branch. A designer writes `ui-design.md` unless you already
had the design, and the engineer who picks the change up writes `tech-design.md`
and `tasks.md` - on this same change, never a second one. A change with no
`tasks.md` reads as still being planned on both boards; that is the handoff
signal, and it is the only one, so say the change needs picking up rather than
assuming someone will find it.

The PRD under `docs/prds/` is yours to keep whole. Everyone writes on it - a
designer's state, an engineer's constraint, a QA case that exposes a rule nobody
wrote land there first, marked 🚧 or ❓ - and you are the teammate who keeps it one
record.

`decisions.md` is yours the same way, for its own kind of fact. A scope decision
learned after the interview - a non-goal that turns out to be load-bearing, a
goal no screen can deliver, an option dropped for a reason that did not survive
the screens - is a row revised there by whoever learned it, before the artifact
that depends on it changes. When one of those arrives, read it: a change whose
goals moved may owe a journey it does not have, and that journey is yours.

## The run

The author triggers `/planning-pm` and nothing else. Everything above the line
happens inside that one invocation.

```
grilling                        author answers rounds until the frontier is empty
    ↓
PRD marks 🚧 / ❓                the source of the feature set's groups
    ↓
openspec new change             the directory the rest lands in
    ↓
proposal                        yours: why, what changes, what it will not do
    ↓
decisions                       yours: the frontier as settled, and its edges
    ↓
user-journeys                   yours: who walks it, inside those edges
    ─────────────────────────────────────────────────────────────
    ↓
/planning-qa                    spec.md's outline, then the two readings
                                from it, and the reconciliation that
                                escalates back to you
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

   A question settles four ways: answered, accepted as recommended, **held**
   against your challenge, or **deferred** - the author saying they are not
   the right person for it. The first three are rows in `decisions.md`: the
   second marked `(recommended)` so a later reader knows how firm it is, the
   third marked `(held)` with your alternative and its reason in `Instead of`,
   so the next reader sees the row was contested rather than re-opening it. A
   deferred question is not a decision: it goes under the proposal's open
   questions with a note on who should settle it, and as a ❓ row on the PRD,
   and it does not hold the draft. Sizing, export names, and what code a
   change touches are never the author's to answer.

   **Challenge an answer before you record it.** What the author arrives with
   is a claim, not a row. An interview that only maps what the author already
   holds writes down what they would have written alone - a reminder cadence
   recorded one afternoon as `5 days before due`, on an invoice whose window
   is fixed from send, and rewritten the same day once somebody asked what
   that was on the clock the invoice already runs on. Every round, before the
   frontier moves:

   - **List every assumption you would otherwise make silently** - the clock
     a value is measured on, the state a rule starts from, a default the spec
     already sets, the meaning of a word the author uses loosely. Each is a
     question with your reading as the recommendation, never a fact the draft
     carries unasked. Translate the author's words onto what exists before
     accepting them: `5 days before due` on a seven-day window from send is
     `day 2 after send`, and the author may not have meant it.
   - **Flag a solution disguised as a requirement** - a schedule, a screen, a
     field, a mechanism, offered where an outcome belongs. Ask what it buys
     the reader. The outcome is the goal and the 🚧 line; the mechanism is a
     decision row, with the other mechanisms that buy the same outcome in
     `Instead of`.
   - **Point out what is missing** - the edge cases, the failure modes (a
     letter that lands after the action it asks for has closed, a clock that
     pauses, a reissue that restarts it), who else is affected (the other
     capabilities, the operator, the service that sends it), and what this
     change is not doing. Ask each as its own frontier question. A non-goal
     the author never named is the one an artifact downstream crosses.

   Disagree out loud. Where your reading and the author's differ, say so with
   the reason and put your alternative to them. The author decides, and the
   row records which way and why.

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
   openspec instructions decisions --change <change-name>
   openspec instructions user-journeys --change <change-name>
   ```

   These carry this store's own rules on top of the schema's. Read them rather
   than working from memory. `openspec instructions specs` is not yours to work
   from - read it only to know what you are reviewing when it comes back.

   What the gates make of the branch while it is half written: a change with no
   `spec.md` yet, or one whose delta names no requirement, is refused unless it
   declares the wait - which is why step 8 writes that line - and the wait is
   asked back the moment the requirements land. `openspec status` calls `specs`
   done as soon as a file is there, so it cannot tell an outline from the
   requirements; `check:manual`'s `outline` rule is what fails a folded
   capability whose suite sits beside a `spec.md` carrying none.
   (`pnpm plan:preflight` is unrelated: it guards `tasks.md` against being
   overwritten while engineering is implementing.)

6. **Write the proposal, the decisions and the journeys**, in that order -
   the three files that are yours. Under the proposal's `## References`, link
   every section you marked, so the manual shows the change under that heading;
   its `## Non-Goals` points at `decisions.md` rather than restating the edges.

   `decisions.md` carries the frontier you just closed: the goals, the
   non-goals, and one row per question the rounds settled with the option it
   dropped. Write the rejected option every time - a decision without it is
   re-opened next quarter and answered the other way, with nothing to say which
   reading is newer. What a requirement can carry belongs in the delta instead,
   what the manual's reader needs in the PRD, and an implementation choice in
   `tech-design.md`.

7. **Leave `spec.md` alone.** Its outline is written by the run that takes the
   readings, out of the journeys you just wrote and the 🚧 lines you marked,
   and those two are the whole of what it has to go on - which is the reason
   step 3 comes before step 6 rather than after it. Half the **anchor set** is
   already fixed by the time you stop: the capability's full journey set once
   this change folds, which `/planning-qa` unions with the root groups it
   derives. Those groups come back with the scenarios, not ahead of them: the
   run goes straight from the outline to the readings. Read them there, against
   your own 🚧 lines.

8. **Validate what you wrote, then hand it on.**

   ```bash
   pnpm run validate:changes <change-name>
   pnpm check:manual
   ```

   **Your handoff owes a wait line.** What you commit has journeys and no
   `spec.md` at all, and a change with no delta is one both gates refuse
   without a line saying why: write `awaiting:` with
   `specs: <what is still to come>` in the change's `.openspec.yaml` before you
   validate. `validate:changes` then reports the change as waiting rather than
   failing it, and the wait is not read as over until the requirements land.
   `/planning-qa` deletes the line with the scenarios.

   Commit the marks, the proposal, the decisions and the journeys, and say the
   change is ready for `/planning-qa`. It runs on this same branch: the outline,
   the blind suite and the scenarios land in this pull request, so `main` never
   carries a journey with no suite beside it.

   A requirement nobody can decide yet is the same line for a different
   reason - a wait, not a guess - and it stays after `/planning-qa` has run.

9. **Answer what the readings escalate.** `/planning-qa` pauses on a case
   nobody ever decided, and on two readings that state opposite things. Those
   pauses are grilling rounds, and they are yours: the run does not settle a
   product question, and a ❓ on the PRD is how one that nobody present can
   settle gets recorded. Read the scenarios against your journeys when they come
   back - generated is not unreviewed, and you are the reader of record.

10. **Land every raised row.** The blind pass writes what the input did not
    settle into your `decisions.md`, under `## Raised` - `Capability | Raised |
    Landed` - with `Landed` empty. Each one closes as a `Decisions` row in that
    same file, or as a ❓ on the capability's PRD naming who owes the answer.
    There is no third resting place, and `pnpm check:manual` refuses a row that
    names neither, so the change does not merge with the pass's findings
    unread. A row you escalate or defer is also written into the suite's
    `## Reconciliation`, with its answer in `## Settled`: `decisions.md`
    archives with the change and is folded nowhere.

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
| 2 | `spec(<domain>): decisions and journeys` | The scope is settled and the journeys are fixed |

Commits 3 and 4 are `/planning-qa`'s, on this same branch: the blind suites, then
the scenarios and the reconciliation. The diff between them is what the second
reading bought.

## Where a statement belongs

| Statement | Home |
| --- | --- |
| What the product should be, in the reader's words | The PRD, marked 🚧 or ❓ |
| This change's goals and edges | `decisions.md`, and the proposal points there |
| A question the interview settled, and what it dropped | `decisions.md`'s `Decisions` table |
| A question the blind pass could not settle | `decisions.md`'s `## Raised` table, landed before merge |
| A question nobody present could settle | The proposal's open questions, and a ❓ on the PRD |
| Anything testable | The delta spec, and nowhere else - `/planning-qa` writes it, you check it |
| Who walks it | `user-journeys.md` beside that spec |
| Why this problem, for whom, what was ruled out, what will be measured | The PRD's `Product decisions` block |
| How it will be built | `tech-design.md` - not yours |

## Related

- `grilling` - the interview that precedes the proposal, and the escalation.
- `planning-qa` - `spec.md`, both passes, and the two readings taken from your
  journeys and marks.
- `spec-to-tcs` - the blind pass and the isolated input it builds.
- `openspec-propose` - who writes what across the whole change.
- `prd-authoring` - for the product judgment a requirement will not preserve.
- `planning-design`, `planning-dev` - the artifacts that come after yours.
