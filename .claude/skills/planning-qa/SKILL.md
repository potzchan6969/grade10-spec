---
name: planning-qa
description: Review the blind feature-tcs.md and the reconciliation beside each capability's journeys, and write the domain, product and platform test-case passes above it. Use when reviewing or repairing a change's test suites, or deriving the suites above feature level.
---

# QA's part

Of the eight artifacts in `grade10-planning`, one is yours to review; the
suites above it are yours to write, and they live beside the durable specs:

| Suite | Where it lives | What it holds |
| --- | --- | --- |
| `specs/<capability>/feature-tcs.md` | In the change, beside the journeys | The blind suite and its `## Reconciliation`; you review both with `/tcs-review` |
| `openspec/specs/<product>/<domain>/domain-tcs.md` | Beside the durable specs | The paths a person walks across that domain's capabilities |
| `openspec/specs/<product>/product-tcs.md` | Beside the durable specs | The paths a person walks across that product's domains |
| `openspec/specs/platform-tcs.md` | Beside the durable specs | The paths a person walks across products |

The upper three are written only where a path exists to hold them, never under
a change's deltas, and carry no coverage obligation: `product` and `platform`
are smoke passes.

The feature suite is a **blind** reading, not a derived one: `/planning-pm`
generates it through `/spec-to-tcs` from the anchors, by a sub-agent that never
saw the scenarios, in parallel with the scenarios themselves. The run then
reconciles the two and records what it found. Your work starts after that.

A capability whose journeys file says `**Walked by:** nobody` is not exempt any
more — its anchors are its `## Feature set` root groups and it carries a suite
like any other. That line routes the anchors; it does not excuse the testing.

Where a suite and its spec disagree **after** reconciliation, **the spec is
correct** — regenerate the case, never the other way round. A case, an edge, a
boundary value or a precondition that only tests a stated rule is the suite's;
the page shows the suite with `::cases`, never as prose.

`docs/governance/specs-to-test-cases.md` governs the whole shape — the journey
sections, the case ids, the classification block, the `**Trace:**` line, and
the file header. Follow that document; this skill routes to it and adds
nothing that contradicts it.

## Read the reconciliation first

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
scenarios: `/planning-pm` runs it as soon as the journeys are written, committed
to that branch as its own `test(<domain>): blind pass suites` commit, ahead of
the `spec(<domain>): scenarios and reconciliation` commit. The diff between
those two commits is what the second reading bought.

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
- `planning-pm` — the journeys and scenarios you derive from.
- `openspec-propose` — who writes what across the whole change.
- `docs/governance/specs-to-test-cases.md` — the governing document.
