---
name: planning-qa
description: Write a change's spec.md - the outline that fixes its anchors, then the requirements - run the two independent readings between them, reconcile them, and write the domain, product and platform test-case passes above it. Use when a change's proposal, decisions and journeys are written, when reviewing or repairing its suites, or when deriving the suites above feature level.
---

# QA's part

`/plan` stops before `spec.md`: it hands over the proposal, the decisions the
interview settled, the journeys, and the 🚧 lines it marked on the PRD.
**`spec.md` is yours** - the outline that fixes the anchors, then the
requirements - and so are the two readings between them and the reconciliation
that joins them.

An engineer who authored the change runs the same passes in their own lane;
`planning-dev` routes them here. Nobody else opens the file.

| Artifact | Where it lives | What it holds |
| --- | --- | --- |
| `specs/<capability>/spec.md` — pass one | In the change, beside the journeys | `## Purpose` and `## Feature set`: the outline, written from the journeys and the marked PRD |
| `specs/<capability>/feature-tcs.md` | In the change, beside the journeys | The blind suite and its `## Reconciliation`; you generate both, and review them with `/tcs-review` |
| `specs/<capability>/spec.md` — pass two | In the change, beside the journeys | The requirement deltas and their scenarios, reconciled against that suite |
| `openspec/specs/<product>/<domain>/domain-tcs.md` | Beside the durable specs | The paths a person walks across that domain's capabilities |
| `openspec/specs/<product>/product-tcs.md` | Beside the durable specs | The paths a person walks across that product's domains |
| `openspec/specs/platform-tcs.md` | Beside the durable specs | The paths a person walks across products |

The upper three are written only where a path exists to hold them, never under
a change's deltas, and carry no coverage obligation: `product` and `platform`
are smoke passes.

Neither `specs` nor `test-cases` names a teammate in the schema: they sit on
nobody's worklist. **The PM is the reader of record for both** - you run the
passes, and what they escalate goes back to the author.

A capability whose journeys file says `**Walked by:** nobody` is not exempt any
more — its anchors are its `## Feature set` root groups and it carries a suite
like any other. That line routes the anchors; it does not excuse the testing.

`docs/governance/specs-to-test-cases.md` governs the whole shape — the journey
sections, the case ids, the classification block, the `**Trace:**` line, and
the file header. Follow that document; this skill routes to it and adds
nothing that contradicts it.

## Why this workflow has the shape it has

A suite derived from the scenarios can only find inconsistency inside them. It
can never find the behaviour they left out, because it was written from them.
Boundary values, empty states, nulls, SEO - the details a test-design reading
catches and a requirement-decomposition reading does not - had no mechanism in
this store that found them.

So the scenarios and the suite are **two independent readings of the same
anchors**, written by sub-agents that cannot see each other's work, and
reconciled after both land. The difference between them is the finding.

Ordering is not the mechanism; independence is. Writing the suite first and the
scenarios from it would be a relay, not a cross-check - whoever writes second
copies the first.

The schema cannot express that order — `requires` is advisory and has never
stopped anyone writing the scenarios first. The split that used to try was
undone because it bought nothing and cost three things: a status line that
called the second pass done as soon as the first wrote the file, two viewer tabs
over one document, and a change in another repository to fix the second.

## The run

`/specify` runs this as a round. `round` holds the steps, the readers and the
landing; what follows is what the two files must hold, and the order they are
written in.

Everything this run produces is `draft`. Nothing in it claims review;
`/tcs-review` comes later, at its own pace.

## Steps

1. **Read from an up-to-date main**, then read the change: its `proposal.md`,
   its `decisions.md`, every capability's `user-journeys.md`, and the PRD
   sections the proposal links. Those four are the whole of what the outline has
   to go on. A change with no journeys file has nothing to anchor on and there
   is nothing here to run: it goes back to `/plan`.

   A change whose scope reads as unsettled - a `decisions.md` with an empty
   frontier and open questions on the proposal - is one to raise before you
   write, not one to interpret. Writing groups over an unsettled scope is how a
   feature set comes to name something nobody chose.

2. **Write the outline, then run on it.** `## Purpose` and `## Feature set`,
   from the journeys and the marked PRD - the rules are the `specs`
   instruction's. Root group names are the anchors everything downstream
   resolves against, so they are fixed once and deliberately.

   **The run does not stop here.** The PM is the reader of record for the
   groups, and reads them at the reconciliation, beside the scenarios and the
   suite that were built on them - one read over the outline and what it
   bought, rather than a stop in the middle of a run with nothing yet to show
   against. Go straight to the readings.

   That puts the cost of a wrong group on you rather than on the author: a
   rename after both readings means every `**Serves:**` and `**Trace:**`
   naming it moves in the same change. So read the groups once more yourself
   before you dispatch, and fix one you can already see is wrong.

3. **Run the two readings.** Dispatch both sub-agents. Neither sees the
   other's output. They read the same anchors, not the same bundle: the suite
   pass gets the isolated input `spec-to-tcs` builds, and the scenario pass
   also reads the durable requirements, because a MODIFIED block is copied
   whole from them. That asymmetry is the mechanism — one reading can see what
   the store already states and the other cannot — so the suite pass never
   reads `## Requirements` and the scenario pass never reads `feature-tcs.md`.

   **Both get `ui-design.md`** where the change has one. It lands before the
   requirements and its states tie to anchors, not scenario ids, so reading it
   costs no independence - blindness is from the scenarios, never from the
   design. The suite pass gets it with the state dispositions stripped, the way
   it gets `feature-tcs.md` with `## Reconciliation` stripped: those lines carry
   scenario ids, and on a re-run they would be the leak.

   **The suite pass does not read `tech-design.md`:** a mechanism is not an
   anchor.

4. **Reconcile, then take the second pass.** Join on anchors, apply the
   dispositions below, and the scenarios that survive are written with the
   `## Reconciliation` block.

   **Account for every `ui-design.md` state as you write.** Walk its `## States`
   table and close each row on the row itself: replace the Anchor cell with the
   scenario id it became, in backticks, or `**Out of suite:**` naming where the
   state is stated instead. `check:manual` names a row you left open.

   That is pass two's work, not the reconciliation's. Both readings see the
   design, so the empty, error and edge states always reached the blind suite;
   walking the list here is what stops them reaching the requirements as a
   finding against scenarios nobody had asked about them. The readings stay
   independent in method - the suite pass works its test-design checklist, you
   work the journeys and the design - and the reconciliation keeps the findings
   that are about behaviour.

   **Put the blind pass's raised questions in `decisions.md`**, under its
   `## Raised` table, one row per question with the capability that asked. Leave
   `Landed` for the author. They go nowhere near the suite.

5. **Lay the requirements out for one pass.** After the reconciliation and
   before the PM reads the root groups, read each requirement as a new hire
   would and rewrite its block so it reads in one pass. The sentences are
   settled; only their layout moves.

   - Keep every `### Requirement:` name byte-for-byte. Scenarios, the delta
     diff and `check:manual`'s `stale` rule all key on it.
   - Keep every SHALL, SHALL NOT, MUST and MAY sentence exactly as written.
     A rewrapped sentence is not a change; a reworded one is a third pass
     nobody reconciled.
   - Open with one plain sentence, no SHALL, saying what the requirement is
     about.
   - One rule per line, led by its key term in bold - `**Drafts** -`,
     `**Display** -` - and a list where several rules share one subject.
   - Do not split a requirement. A block carrying three subjects wants
     splitting, but splitting moves scenarios: raise it with the PM rather
     than do it here.
   - Lay out ADDED blocks only. A MODIFIED block is diffed line by line
     against the durable requirement it replaces, and a relaid one shows
     every line as changed; it takes the shape when the durable spec does.
   - A block of one or two short sentences already reads in one pass.
     Leave it.

   Ten SHALL sentences in one paragraph is what this step exists for: an
   engineer reading for one rule should find it without reading the nine
   around it.

6. **Validate.** The landing's gate runs the checks;
   `pnpm run plan:land <change> <artifact> --dry-run` cuts and gates without
   landing, for whoever wants to see what the gate will say before the word.

   Both anchor rules read the delta: a scenario of yours standing under no
   `**Serves:**` line, or naming an anchor the capability offers nowhere, fails
   here rather than a release later.

## Anchors

Neither file points at the other. Both point up.

> **Anchor set** = the capability's full journey set once this change folds,
> **union** the root groups of its `## Feature set`. `/plan` fixes the
> journeys; you fix the groups, and the PM reads both at the reconciliation.

- A scenario carries `**Serves:** <anchor> - <prose>`, under its heading and
  above `**GIVEN**` / `**WHEN**`.
- A case carries `**Trace:** <anchor>`, as it always has - a journey id, or a
  feature set root group for a capability nobody walks.
- **There is no `**Accepted by:**`.** It was the hand-maintained link through
  which the two files inherited each other's blind spots. Where a journey-to-
  scenario listing is wanted, tooling joins on `**Serves:**`.

Before the dash is machine-read and must resolve; after it is prose for a human.
An anchor that resolves to nothing fails loudly rather than dangling.

Three anchors resolve on a `**Serves:**` line, and the first that fits is the
one to write:

| Anchor | Written as | For |
| --- | --- | --- |
| This capability's journey | `<capability>-US-<n>` | A rule somebody walks here |
| Another capability's journey | `<product>/<domain>/<capability>#<journey-id>` | A rule somebody walks elsewhere and this capability enforces |
| A feature set root group | the group name, verbatim | A rule with no actor: a derivation, an idempotency, a guard the system raises against its own callers |

**Reach past the capability before you reach for a group.** `order-status`
derives a status the operator walks in `grade10-admin/auction/post-sale`, and
the qualified anchor says so - `**Serves:**
grade10-admin/auction/post-sale#post-sale-US-01 - the operator works the queue
by outcome`. A group name says which part of the map the rule sits in and
nothing about who meets it, so a group anchor on a rule somebody walks throws
the walk away. It is also what a hand-written `Also walked by:` note in a
journeys file was reaching for: the note names no scenario, so nothing joins on
it and nothing fails when it goes stale.

A qualified anchor keeps resolving after that capability retires the journey:
the id is permanent, the `## Retired` tombstone answers it, and archived suites
still trace it. Whether the rule still stands is the retiring change's question
to settle in its own deltas, not a red line on a capability nobody touched.

A scenario whose only anchor is a foreign journey is reached by no case in this
capability's suite. List it under `**Out of suite:**` naming the suite that
walks it - the same treatment any other uncovered scenario gets.

**The prose after the dash names the walk**, never the group and never the
heading it already sits under. `check:manual` refuses a group anchor whose
prose repeats the group name, and refuses one written bare - a group name says
which part of the map the rule sits in and nobody who meets it, so the prose is
the only place the walk is ever written. Repeating the heading is the store's
habit today and nothing reads it yet — write the walk anyway: a line that
restates what is already on screen is a line the next reader skips.

Coverage is checked at group level: every anchor served by at least one scenario
and walked by at least one case. That is coarse on purpose - the real coverage
mechanism is the blind pass, and the rule only catches a whole group being
forgotten.

## The blind pass

Independence that relies on an agent's restraint is not independence. The
orchestrator builds an isolated input in scratch space, and the suite sub-agent
sees nothing else.

**Included:** `## Purpose`, `## Feature set`, this capability's
`user-journeys.md`, `decisions.md` - its `## Raised` table included, which says
what earlier runs asked and what came of it - `ui-design.md` where the change
has one, with its state dispositions stripped, the linked PRD sections, and the
existing `feature-tcs.md` for id continuity, with `## Reconciliation` stripped.

`decisions.md` and `ui-design.md` both go in for the same reason: neither holds
a requirement, so neither costs blindness, and a reader who cannot see the
non-goals writes cases for what the interview ruled out — which comes back as a
finding against scenarios that were right.

**Excluded:** `openspec/specs/` entirely, `openspec/changes/archive/` entirely,
and any `## Requirements` section anywhere.

The archive exclusion is not housekeeping. An archived change keeps an
un-stripped `## Reconciliation` naming scenario ids, so missing that path
reopens the leak on the next change to the same capability, invisibly.

The suite pass works a test-design checklist - boundary values, equivalence
partitions, state transitions, CRUD completeness, empty / one / many, null and
missing, permission matrix, error taxonomy, SEO and indexability - rather than
paraphrasing the journeys. Two readings using the same method produce synonyms,
and the reconciliation then finds nothing.

The pass is waived only by `pnpm check:manual`'s `blind` rule staying quiet over
a delta that carries no new behaviour, or by an author-declared `skip_specs` -
the escape hatches `planning-pm` tables. Neither is yours to grant.

## Reconciliation

| Diff | Disposition |
| --- | --- |
| Case has it, no scenario does, and it is real behaviour | Fold it in as a scenario |
| Case has it, no scenario does, and it is a misreading | Drop the case, record the reason |
| Case has it, and **nobody ever decided it** | **Pause. Open a grilling round.** |
| Case has it, and **nobody present can settle it** | Keep the case `draft` + `**Blocked:**`. See below. |
| A scenario no case reaches | Add a case, or `**Out of suite:**` naming where it is verified instead |
| The two readings state **opposite things** | **Pause. Open a grilling round.** |

A contradiction is never settled by the run. Where a case and a scenario
describe the same behaviour and disagree, one is wrong and nothing in the
material says which — and filing it as a misreading is how the blind reading
gets overruled by the very reading it exists to check.

A finding is recorded in the reconciliation of the capability whose pass raised
it, even when the rule it becomes belongs to another capability's spec. The
disposition line names where it went.

**The run stops for the third and sixth rows**, and it stops on the author, not
on you. A workflow that cannot pause there is worse than the one it replaces,
because the agent would be deciding the product. Automation removes the typing,
not the judgement.

**On resume, patch - never re-run a pass.** The answer becomes a scenario, and a
case where one is warranted - and a row in `decisions.md` where what the round
settled was the change's scope rather than a rule inside it. A grilling round
that moved the goals and left no trace there is a decision the next reader will
re-open. Re-running the blind pass once the answer is known
produces a fake independent reading and erases the record of the real one.

**When nobody can settle it**, the case stays in the suite as `draft` carrying
`**Blocked:** <who should settle this>`, a ❓ goes on the PRD, an open question
goes on the proposal, and no scenario is written. The run continues, consistent
with a deferral not holding the draft. This row exists because without it the
case gets filed as *rejected* - the nearest disposition that lets the run finish
- and the most valuable thing the mechanism produces would be deleted because
nobody was free that afternoon, with everything looking normal afterwards.

After reconciliation the ordinary adjudication resumes: **the spec is correct**,
and a suite that disagrees with it is regenerated.

`## Reconciliation` is the evidence the pass happened and what it bought.
Without it, a pass that found nothing and a pass that never ran look identical
in git. **The scenario draft is never committed** - that block is its only
trace, which is why the block is not optional. Scenario ids belong there only
while the change is open, written in backticks and in full: a bare `Folded as
SC-49` is read by no check, so the next renumber leaves it naming a scenario
nobody issues any more.

**The raised questions are not in the suite.** They are rows in the change's
`decisions.md`, under `## Raised` - `Capability | Raised | Landed` - and every
one owes a landing before the requirements land: a `Decisions` row in that same
file, or a ❓ on the capability's PRD. `check:manual` refuses a row that names
neither, which is the deadline the list never had while it sat at the bottom of
a suite nobody opened until review.

An escalated or deferred row is written down twice all the same. `decisions.md`
archives with the change and is folded nowhere, so the disposition goes in
`## Reconciliation` and the answer in `## Settled`, where the next blind pass
reads it.

**Write it when you pause, not when you finish.** A run stopped at an
escalation and a run nobody has started look the same on the board otherwise:
`openspec status` counts files, and the file is there either way. The section
goes in as soon as the escalation is raised, naming what is being asked and of
whom, so a change waiting on an answer says so.

A rejection is copied into the durable suite's `## Settled` at archive — one
line, no scenario ids. That section is read by the next blind pass on purpose:
it says what has already been asked and answered, which is not the same as
saying what the scenarios contain. Without it every future run raises the same
misreading, nobody remembers why it was refused, and the reconciliation fills
with noise until someone starts waving it through.

## Reading a reconciliation you did not run

`## Reconciliation` at the bottom of a feature suite is the run's account of
what the blind pass found and what was done with each finding. Read it before a
single case, because it is where this workflow is cheapest to cheat.

- **Raised, rejected** — the row to actually check. Dropping a finding as a
  misreading is the fastest way to finish a run, and a wrong rejection is
  invisible afterwards. Satisfy yourself that no rule anywhere states what the
  case claimed
- **Raised, deferred** — the case is still in the suite as `draft` carrying
  `**Blocked:**`. It is an open question, not a defect in the suite: never
  resolve it, re-word it, or let it be quietly dropped
- **Raised, escalated** — check the ❓ actually landed on the PRD
- **Uncovered anchors** — each `**Out of suite:**` line names where the scenario
  is verified instead. One that names no such place is a hole wearing an
  exemption's clothes
- **An empty `## Raised`, run after run** — in the change's `decisions.md`, the
  signal that the blind pass has
  stopped being blind, or stopped being a different reading, and the only one
  this store can read. The Run line says what the pass read and was denied;
  nothing verifies it, so read it as the run's word and say so rather than
  passing the suite
- **A raised row with an empty `Landed`** — the pass's finding about to be lost.
  Chase it to a `Decisions` row or a PRD ❓ before the suite is signed off

When you finish a review, strip the scenario ids from `## Reconciliation`,
leaving the dispositions and the reasons. Beyond the change's life those ids are
a leak: the next blind pass reads this file for id continuity.

A `skip_specs` change is yours to spot-check too. Read its `## Why` and its
`skip_specs_why` — nothing more. It is the one switch that turns the whole
cross-check off, and it is author-declared.

## Do not write a suite by hand

Two skills do the work, and they are the whole workflow:

```text
/spec-to-tcs [platform|product|domain|feature] <target>   derive or rewrite drafts
/tcs-review  [<capability-or-change>]    walk them with a human, record verdicts
```

**Top down, both times.** Platform, then product, then domain, then feature.
Writing, the higher file names the paths and the level below covers what they
do not reach — the refusals, the empty states — rather than re-testing a path
from underneath; a trim made before the file above exists is a guess.
Reviewing, the same order, so a suite is trimmed against something approved and
the higher level's approved cases are the house-style evidence the reviews
below inherit.

A run above feature level reads more than the change: every sibling
`user-journeys.md` in its scope — a domain's under
`openspec/specs/<product>/<domain>/`, a product's across its domains, a
platform's across products — and the PRDs under `docs/prds/` for the
decisions, the product's own names for surfaces and controls, and the seeded
values a pass is written against. A case there **composes**: it traces two or
more journeys, from two or more capabilities, domains or products, and a single
trace means it is a feature case written at the wrong level.

`/spec-to-tcs` learns this store's conventions from every `actual` case in the
corpus before it writes, so a hand-written suite is both more work and less
consistent than a generated one. It refuses to regenerate over `actual` cases
or an `approved` file, and shows an existing suite before touching it.

## When each runs

**The blind pass runs before the scenarios**: as soon as the journeys and the
outline are written, so the second reading is taken from a suite that never saw
them.

## What a suite owes its capability

Check these before you call a suite finished; `pnpm run tcs:validate` checks
them too, and CI runs it on every push.

- **Every section is an anchor.** One `## <capability>-US<n>: <title>` per
  `### <capability>-US-<n>` in `user-journeys.md`, in that file's order, with
  the same three-line statement carried over unchanged. Where nobody walks the
  capability the file carries **one** section, `## <capability>-US1`, and the
  feature set groups go on the cases' `**Trace:**` lines — a section per group
  would number a case by that group's position, and an issued case id is
  permanent. `tcs:validate` refuses the other shape.
- **Every case traces the anchor it walks**, and never a scenario id: the suite
  was written before the scenarios existed.
- **A scenario no case covers is a hole**, reported — never quietly closed by
  inventing a case. Cover it, or list it under `**Out of suite:**` naming where
  it is verified instead.
- **The file's `**Status:**` is derived, not chosen**: `pending-review` while
  every case is a draft, `in-review` from the first verdict, `approved` once no
  draft is left.
- **An issued case id is permanent.** Rewriting a draft keeps its id and its
  `<v>` — `<v>` tracks behaviour, not prose — and a retired case is
  `deprecated`, never renumbered.
- **The actor is `customer` or `admin`**, with the state or grant the case
  needs in brackets, written into the pre-conditions: `customer(gold member) is
  on the shopping cart page`.

## When the journeys are missing

Do not stop, and do not invent flows. `/spec-to-tcs` writes the missing
`user-journeys.md` from the behavior already in `spec.md` — keeping every
existing SHALL and scenario clause, adding no requirements — then derives the
suite, and reports the new journeys file in the same run.

A capability nobody reaches on its own says so in its `user-journeys.md` —
`**Walked by:** nobody on their own — <who inherits it>` in place of the
journeys — for a cross-cutting policy, a package contract, a backend convention,
or a surface only the product's makers reach. Never invent an actor to justify a
journey — not an application importing a package, and not the engineer, developer
or reviewer who built the thing.

**It still gets a suite**, anchored on its `## Feature set` root groups. Money
amounts, dates and times, localization are exactly where a boundary, precision
or timezone miss costs most, and exempting them from test design is how those
ship. A capability with no journeys file at all is not exempt either:
`pnpm check:manual` fails it, and the PM owes the file.

## Keeping drafts current

```bash
pnpm run tcs:validate        # errors fail CI; an older shape is one of them
pnpm run tcs:stale           # which suites' drafts sit below the current rules rev
```

What a **minor** and a **major** each reach, and how, is
`docs/governance/specs-to-test-cases.md`'s **Rules Revisions**.

## Related

- `spec-to-tcs`, `tcs-review` — the two skills that do this work.
- `planning-pm` — the journeys and the marks your outline is written from, and
  the author your escalations and your outline go back to.
- `planning-dev` — the same passes in an engineer's lane, on a change they
  authored.
- `grilling` — the round a paused reconciliation opens.
- `planning-dev` — the engineer downstream, who routes a change back here
  rather than planning delivery against an outline.
- `docs/governance/specs-to-test-cases.md` — the governing document.
