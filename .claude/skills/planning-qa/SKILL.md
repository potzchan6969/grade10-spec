---
name: planning-qa
description: Write QA's artifact on an OpenSpec change - the feature-tcs.md beside each capability's spec and journeys. Use when deriving, reviewing, or repairing a change's test suites.
---

# QA's artifact

One of the seven artifacts in `grade10-planning` is yours:

| Artifact | What it holds |
| --- | --- |
| `specs/<product>/<domain>/domain-tcs.md` | The paths a person walks across that domain's capabilities |
| `specs/<capability>/feature-tcs.md` | The classified suite the journeys and scenarios imply |

Optional, and derived: a capability with no `user-journeys.md` has nothing to
derive, and a suite is never a second source of truth. Where a suite and its
spec disagree, **the spec is correct** — regenerate the case, never the other
way round.

`docs/governance/specs-to-test-cases.md` governs the whole shape — the journey
sections, the case ids, the classification block, the `**Trace:**` line, and
the file header. Follow that document; this skill routes to it and adds
nothing that contradicts it.

## Do not write a suite by hand

Two skills do the work, and they are the whole workflow:

```text
/spec-to-tcs [feature|domain] <target>   derive or restyle the drafts
/tcs-review  [<capability-or-change>]    walk them with a human, record verdicts
```

**Domain before feature, both times.** Deriving, the domain file names the
paths and the feature suites then cover what those paths do not reach — the
refusals, the empty states — rather than re-testing the path from each
capability's side; a trim made before the domain file exists is a guess.
Reviewing, the same order: `domain-tcs.md` first, so a feature suite is trimmed
against something approved, and so the domain's approved cases are the
house-style evidence the feature reviews inherit.

A domain run reads more than the change: every sibling capability's
`user-journeys.md` under `openspec/specs/<product>/<domain>/`, and the
domain's product record under `docs/prds/products/<product>/<domain>/` — the
decisions, the product's own names for surfaces and controls, and the seeded
values a pass is written against.

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
- **An issued case id is permanent.** Restyling a draft bumps its `<v>` and
  keeps its id; a retired case is `deprecated`, never renumbered.

## When the journeys are missing

Do not stop, and do not invent flows. `/spec-to-tcs` writes the missing
`user-journeys.md` from the behavior already in `spec.md` — keeping every
existing SHALL and scenario clause, adding no requirements — then derives the
suite, and reports the new journeys file in the same run.

A capability nobody reaches on its own says so in its `user-journeys.md` —
`**Walked by:** nobody` in place of the stories — for a cross-cutting policy,
a package contract, a backend convention, or a surface only the product's
makers reach: an internal reference, a dev-build-only page, a fixture panel.
It gets no suite either. Never invent an actor to justify one — not an
application importing a package, and not the engineer, developer or reviewer
who built the thing. A capability with no journeys file at all is not exempt:
`pnpm check:manual` fails it, and the PM owes the file.

## Keeping drafts current

```bash
pnpm run tcs:validate        # errors fail CI; older shapes warn
pnpm run tcs:stale           # which suites' drafts sit below the current rules rev
```

`tcs:stale` is a report, not a sweep. Bring one suite at a time to the current
revision with `/spec-to-tcs`, never in one pass.

## Related

- `spec-to-tcs`, `tcs-review` — the two skills that do this work.
- `planning-pm` — the journeys and scenarios you derive from.
- `openspec-propose` — who writes what across the whole change.
- `docs/governance/specs-to-test-cases.md` — the governing document.
