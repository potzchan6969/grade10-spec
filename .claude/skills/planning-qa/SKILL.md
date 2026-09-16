---
name: planning-qa
description: Run the two independent readings of a change's anchor set - the scenario draft and the blind feature-tcs.md - reconcile them, and write the domain, product and platform test-case passes above it. Use when a change's journeys and outline are written, when reviewing or repairing its suites, or when deriving the suites above feature level.
---

# QA's part

`/planning-pm` stops at the anchor set: the proposal, the journeys, and the spec
outline's `## Purpose` and `## Feature set`. **The two readings taken from that
set are yours**, and so is the reconciliation between them.

| Artifact | Where it lives | What it holds |
| --- | --- | --- |
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

```
/planning-pm                    proposal, journeys, spec-outline
    ─────────────────────────────────────────────────────────────
    ↓
    ├── sub-agent A → scenario draft      identical inputs,
    └── sub-agent B → feature-tcs.md      neither sees the other
    ↓
reconciliation                  join on anchors
    ↓
spec-behaviour + ## Reconciliation
```

Everything this run produces is `draft`. Nothing in it claims review;
`/tcs-review` comes later, in its own pull request, at its own pace.

## Steps

1. **Read from an up-to-date main**, then read the change: its `proposal.md`,
   every capability's `user-journeys.md`, and the outline's `## Purpose` and
   `## Feature set`. A change whose outline carries no feature set has no anchor
   set, and there is nothing here to run: it goes back to `/planning-pm`.

2. **Read the enriched instructions.**

   ```bash
   openspec instructions specs --change <change-name>
   openspec instructions test-cases --change <change-name>
   ```

   These carry this store's own rules on top of the schema's. Read them rather
   than working from memory; `specs` carries both of its passes, and the second
   is yours.

3. **Run the two readings.** Dispatch both sub-agents. They get identical
   inputs and never see each other's output. `spec-to-tcs` builds the isolated
   input for the suite pass; the scenario pass does not read `feature-tcs.md`.

4. **Reconcile, then take the second pass.** Join on anchors, apply the
   dispositions below, and the scenarios that survive are written with the
   `## Reconciliation` block.

5. **Validate.**

   ```bash
   pnpm run validate:changes <change-name>
   pnpm check:manual
   pnpm run tcs:validate
   ```

   `openspec status` calls `specs` done as soon as the outline exists, because a
   file is there. **`pnpm check:manual` is the gate that means anything** - it
   fails a capability whose suite sits beside a `spec.md` that carries no
   requirements section, which is the only machine evidence that pass two
   happened at all. It is never downgraded to a warning.

## Anchors

Neither file points at the other. Both point up.

> **Anchor set** = the capability's full journey set once this change folds,
> **union** the root groups of its `## Feature set`. `/planning-pm` fixes it.

- A scenario carries `**Serves:** <anchor> - <prose>`, under its heading and
  above `**GIVEN**` / `**WHEN**`.
- A case carries `**Trace:** <anchor>`, as it always has - a journey id, or a
  feature set root group for a capability nobody walks.
- **There is no `**Accepted by:**`.** It was the hand-maintained link through
  which the two files inherited each other's blind spots. Where a journey-to-
  scenario listing is wanted, tooling joins on `**Serves:**`.

Before the dash is machine-read and must resolve; after it is prose for a human.
An anchor that resolves to nothing fails loudly rather than dangling.

Coverage is checked at group level: every anchor served by at least one scenario
and walked by at least one case. That is coarse on purpose - the real coverage
mechanism is the blind pass, and the rule only catches a whole group being
forgotten.

## The blind pass

Independence that relies on an agent's restraint is not independence. The
orchestrator builds an isolated input in scratch space, and the suite sub-agent
sees nothing else.

**Included:** `## Purpose`, `## Feature set`, this capability's
`user-journeys.md`, the linked PRD sections, and the existing `feature-tcs.md`
for id continuity, with `## Reconciliation` stripped.

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
case where one is warranted. Re-running the blind pass once the answer is known
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
in git. Scenario ids belong there only while the change is open, written in
backticks and in full: a bare `Folded as SC-49` is read by no check, so the
next renumber leaves it naming a scenario nobody issues any more.

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

## Commits

| # | Commit | Proves |
| --- | --- | --- |
| 3 | `test(<domain>): blind pass suites` | The blind reading, uncontaminated |
| 4 | `spec(<domain>): scenarios and reconciliation` | What the second reading caught |

Commits 1 and 2 are `/planning-pm`'s - the PRD marks, then the journeys and the
outline - and yours land on the same branch, in the same pull request. Commit 3
precedes commit 4 not because the suite produced the scenarios, but because the
committed scenarios are the reconciled ones. **The scenario draft is never
committed** - its only trace is the `## Reconciliation` block, which is why that
block is not optional.

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
- **An empty reconciliation, run after run** — the signal that the blind pass
  has stopped being blind, or stopped being a different reading. Check the input
  hash on the Run line and say so rather than passing the suite

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

**The blind pass rides in the spec's own pull request**, and lands *before* the
scenarios: you run it as soon as the journeys and the outline are written,
committed to that branch as its own `test(<domain>): blind pass suites` commit,
ahead of the `spec(<domain>): scenarios and reconciliation` commit. The diff
between those two commits is what the second reading bought.

That asks nothing of whoever reviews the specs: a `draft` case carries no
authority, and nobody is being asked to stand behind one there. What it buys is
that `main` never carries a journey with no suite, and that the traces were
checked against the spec in the commit that introduced it.

**Review is its own pull request, later.** `/tcs-review` walks the drafts with
a human one journey at a time, quoting the spec's scenarios on request, and
records each verdict as `actual`, `deprecated`, or still `draft`. Every case
marked `actual` becomes evidence the next `/spec-to-tcs` run learns from.

`/spec-push` refuses to push a change whose capabilities have a
`user-journeys.md` but no `feature-tcs.md` beside it.

## What a suite owes its capability

Check these before you call a suite finished; `pnpm run tcs:validate` checks
them too, and CI runs it on every push.

- **Every section is an anchor.** One `## <capability>-US<n>: <title>` per
  `### <capability>-US-<n>` in `user-journeys.md`, in that file's order, with
  the same three-line statement carried over unchanged — or, where nobody walks the
  capability, one section per `## Feature set` root group.
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

`tcs_rules_rev` is `<major>.<minor>`. A **minor** moves wording only, and
`tcs:stale` reports the suites whose drafts sit below it — bring those up one
at a time. A **major** changes what a file must carry, so it is swept across
every suite in the bump's own commit, and the sweep rewrites the drafts: moving
a `**Drafts styled:**` stamp without rewriting the cases beneath it is a lie
the next reader cannot catch.

## Related

- `spec-to-tcs`, `tcs-review` — the two skills that do this work.
- `planning-pm` — the anchor set you read from, and the author your escalations go to.
- `grilling` — the round a paused reconciliation opens.
- `openspec-propose` — who writes what across the whole change.
- `docs/governance/specs-to-test-cases.md` — the governing document.
