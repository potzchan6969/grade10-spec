---
name: planning-qa
description: Write QA's artifact on an OpenSpec change - the suite at every level, from the feature-tcs.md beside each capability's spec and journeys up to the domain, product and platform passes above it. Use when deriving, reviewing, or repairing a change's test suites.
---

# QA's artifact

One of the seven artifacts in `grade10-planning` is yours:

| Artifact | What it holds |
| --- | --- |
| `specs/platform-tcs.md` | The paths a person walks across products |
| `specs/<product>/product-tcs.md` | The paths a person walks across that product's domains |
| `specs/<product>/<domain>/domain-tcs.md` | The paths a person walks across that domain's capabilities |
| `specs/<capability>/feature-tcs.md` | The classified suite the journeys and scenarios imply |

The upper three are written only where a path exists to hold them, and carry
no coverage obligation: `product` and `platform` are smoke passes.

Derived, never a second source of truth. The PM drafts `feature-tcs.md`
alongside the journeys with `/spec-to-tcs`; your work starts at review, and at
the wider levels above it. A capability whose journeys file says
`**Walked by:** nobody` has nothing to derive. Where a suite and its
spec disagree, **the spec is correct** — regenerate the case, never the other
way round.

`docs/governance/specs-to-test-cases.md` governs the whole shape — the journey
sections, the case ids, the classification block, the `**Trace:**` line, and
the file header. Follow that document; this skill routes to it and adds
nothing that contradicts it.

## Do not write a suite by hand

Two skills do the work, and they are the whole workflow:

```text
/spec-to-tcs [platform|product|domain|feature] <target>   derive or rewrite drafts
/tcs-review  [<capability-or-change>]    walk them with a human, record verdicts
```

**Top down, both times.** Platform, then product, then domain, then feature.
Deriving, the higher file names the paths and the level below covers what they
do not reach — the refusals, the empty states — rather than re-testing a path
from underneath; a trim made before the file above exists is a guess.
Reviewing, the same order, so a suite is trimmed against something approved and
the higher level's approved cases are the house-style evidence the reviews
below inherit.

A run above feature level reads more than the change: every sibling
`user-journeys.md` in its scope — a domain's under
`openspec/specs/<product>/<domain>/`, a product's across its domains, a
platform's across products — and the product record under `docs/prds/` for the
decisions, the product's own names for surfaces and controls, and the seeded
values a pass is written against. A case there **composes**: it traces two or
more journeys, from two or more capabilities, domains or products, and a single
trace means it is a feature case written at the wrong level.

`/spec-to-tcs` learns this store's conventions from every `actual` case in the
corpus before it writes, so a hand-written suite is both more work and less
consistent than a generated one. It refuses to regenerate over `actual` cases
or an `approved` file, and shows an existing suite before touching it.

## When each runs

**Derivation rides in the spec's own pull request.** As soon as
`openspec validate <change> --strict` passes, `/spec-to-tcs <change>` writes a
`feature-tcs.md` beside every capability that carries journeys, every case
`draft`, committed to that same branch as its own
`test(<domain>): derive test cases for <capability>` commit.

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

- **Every section is a journey.** One `## <capability>-US<n>: <title>` per
  `### <capability>-US-<n>` in `user-journeys.md`, in that file's order, with
  the same three-line story carried over unchanged.
- **Every case traces the journey it walks**, and reaches the scenarios that
  journey's `**Accepted by:**` lists. A case built from no scenario is a new
  requirement in disguise and belongs back in `spec.md` first.
- **A scenario no case covers is a hole**, reported — never quietly closed by
  inventing a case. Cover it, or list it under `**Out of suite:**` with the
  reason.
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
stories — for a cross-cutting policy,
a package contract, a backend convention, or a surface only the product's
makers reach: an internal reference, a dev-build-only page, a fixture panel.
It gets no suite either. Never invent an actor to justify one — not an
application importing a package, and not the engineer, developer or reviewer
who built the thing. A capability with no journeys file at all is not exempt:
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
