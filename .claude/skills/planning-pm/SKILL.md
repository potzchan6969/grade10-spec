---
name: planning-pm
description: Write the product manager's half of an OpenSpec change - proposal, decisions and journeys - then hand it to the single /planning-dev run for blind cases, technical design, scenarios, tasks and acceptance. Use when a PM or designer is specifying a change.
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

**You do not open `spec.md` or generate the feature suite.** They belong to
the one `/planning-dev` run, which freezes your anchor groups, gets QA1 blind
cases, writes scenarios in a separate Dev context, then reconciles both in QA2.
You can be the same human who answers planning questions and accepts the final
plan; acceptance happens once after the artifacts are complete.

| Generated | File | Whose run |
| --- | --- | --- |
| `specs` — pass one | `specs/<capability>/spec.md` | `/planning-dev`: `## Purpose` and `## Feature set`, from your journeys and your 🚧 lines |
| `test-cases` | `specs/<capability>/feature-tcs.md` | `/planning-dev`: QA1's blind draft cases, written without sight of scenarios |
| `specs` — pass two | `specs/<capability>/spec.md` | `/planning-dev`: Dev's requirement scenarios, reconciled with QA1 cases in QA2 |

The planning agents review their generated artifacts internally. **You are
the human who clarifies unresolved questions and accepts the complete plan**;
acceptance is not inferred from your earlier planning input or a generated
review. The root groups trace to your own 🚧 lines and every anchor downstream
hangs off them. `/planning-dev` stops at every contradiction it cannot settle,
and those stops are yours to answer.

**Stop at the journeys.** Invoke `/planning-dev <change>` once the proposal,
decisions and journeys are settled, and the UI design is ready where needed.
That run writes the technical design, scenarios, tasks and case reconciliation,
resolves questions with the same human, then accepts and publishes the contract
before implementation. No separate QA or engineering planning handoff follows.

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

`/workflow-plan` runs this as a round. `workflow-round` holds the steps, the readers and the
landing; what follows is what the three artifacts must hold, and the order they
are written in.

Everything this run produces is `draft`. Nothing in it claims review.

## Steps

1. **Read before you draft.** A MODIFIED block copied from a stale spec
   silently reverts whatever landed in between. Read the capability's PRD under
   `docs/prds/` when one exists, then every active change in
   `openspec/changes/` on its spec, then the capability under
   `openspec/specs/<product>/<domain>/<capability>/`. An active
   change already folding a requirement this one touches is extended or
   superseded, never doubled: whichever archives second reverts the first.
   Then read the capabilities the touched ones link to or share a state, a
   clock or a letter with - a decision collides there as often as at home,
   and a neighbour nobody opened is one nobody checked. Find facts yourself -
   bring only decisions to the author, and put every decision that reverses a
   rule already running to them as a challenge naming the rule and where it
   is written; one the author holds is **BREAKING** in the proposal.

2. **Interview the author.** Ask what changes what is built, as [Round
   Summary and Landing · Interview](../../../docs/governance/round-summary.md#interview)
   shapes it, listing the defaults you applied as decided by the round.

   A question the author answers is a row in their own words, whichever way
   the answer arrived - given, taken as offered, or kept against your
   challenge, which carries your alternative and its reason in `Instead of`
   so the next reader sees the row was contested rather than re-opening it.
   Every question they have not answered is one of the store's two classes,
   under `workflow-round`'s **Questions: Held, or Decided by the Round**. The ❓
   opening the `Decided` cell is the one marker the tooling reads, and a cell
   that opens it and names no role that way reaches no list. A deferred
   question - the author saying they are not the right person for it - is no
   decision: it goes under the proposal's open questions with a note on who
   should settle it, and as a ❓ row on the PRD, and it does not hold the
   draft. Sizing, export names, and what code a change touches are never the
   author's to answer.

   **Challenge an answer before you record it.** A fact the author states is
   theirs; what it assumes is not. An interview that only maps what the
   author already holds writes down what they would have written alone - a
   reminder cadence recorded one afternoon as `5 days before due`, on an
   invoice whose window is fixed from send, and rewritten the same day once
   somebody asked what that was on the clock the invoice already runs on.
   Every round, before the interview is posted:

   - **List every assumption you would otherwise make silently** - the clock
     a value is measured on, the state a rule starts from, a default the spec
     already sets, the meaning of a word the author uses loosely. Each is one
     of the interview's questions, a held row, or a default listed as decided by the
     round, never a fact the draft carries unlisted. Translate the author's
     words onto what exists before accepting them: `5 days before due` on a
     seven-day window from send is `day 2 after send`, and the author may not
     have meant it.
   - **Flag a solution disguised as a requirement** - a schedule, a screen, a
     field, a mechanism, offered where an outcome belongs. Ask what it buys
     the reader. The outcome is the goal and the 🚧 line; the mechanism is a
     decision row, with the other mechanisms that buy the same outcome in
     `Instead of`.
   - **Point out what is missing** - the edge cases, the failure modes (a
     letter that lands after the action it asks for has closed, a clock that
     pauses, a reissue that restarts it), who else is affected (the other
     capabilities, the operator, the service that sends it), and what this
     change is not doing. Each is routed the same way. A non-goal the author
     never named is the one an artifact downstream crosses.

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

4. **A chain that stops before the requirements declares the wait.** A change
   with no `spec.md` yet, or one whose delta names no requirement, is refused
   unless its record says why - which is the line step 7 writes.

5. **Write the proposal, the decisions and the journeys**, in that order -
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

6. **Hand the settled scope to planning-dev.** Once the proposal, decisions,
   journeys and any required UI design are ready, run `/planning-dev <change>`.
   That single run writes the spec outline and freezes anchors, then takes QA1,
   independent Dev drafting and QA2 reconciliation through acceptance and
   publication. You do not write the outline, cases, scenarios or tasks here.

7. **Answer raised questions in the same planning run.** The invoking human may
   also be the PM, engineer or designer. Product questions go on the PRD or in
   `decisions.md` first; technical and case dispositions stay in their own
   artifacts. Resolve every question that can change the accepted contract or
   delivery plan before acceptance. If the anchor set changes, planning-dev
   restarts the independent readings with fresh isolated contexts.

8. **Accept once, then publish.** The complete planning output is accepted with
   `pnpm spec:accept` after `pnpm accept:preflight` passes. Acceptance records
   the reviewer's identity and publishes requirements to the durable specs;
   it does not approve or execute QA cases. Human QA runs after deployment makes
   the implementation available.

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

## Where a statement belongs

| Statement | Home |
| --- | --- |
| What the product should be, in the reader's words | The PRD, marked 🚧 or ❓ |
| This change's goals and edges | `decisions.md`, and the proposal points there |
| A question the interview settled, and what it dropped | `decisions.md`'s `Decisions` table |
| A question the blind pass could not settle | `decisions.md`'s `## Raised` table, landed before the requirements do |
| A question nobody present could settle | The proposal's open questions, and a ❓ on the PRD |
| Anything testable | The accepted spec - `/planning-dev` writes it and publishes it |
| Who walks it | `user-journeys.md` beside that spec |
| Why this problem, for whom, what was ruled out, what will be measured | The PRD's `Product decisions` block |
| How it will be built | `tech-design.md` - not yours |

## Related

- `grilling` - the escalation pauses in steps 8 and 9.
- `planning-dev` - QA1 blind cases, technical design, scenarios, tasks, QA2,
  acceptance and publication as one run.
- `spec-to-tcs` - the internal generator planning-dev uses for QA1.
- `prd-authoring` - for the product judgment a requirement will not preserve.
- `planning-design`, `planning-dev` - the artifacts that come after yours.
