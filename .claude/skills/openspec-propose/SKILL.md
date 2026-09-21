---
name: openspec-propose
description: Start a new OpenSpec change - what to read first, and which role skill writes each artifact. Use when implementation planning is requested and the artifact's owner is not already obvious.
disable-model-invocation: true
---

# Propose an OpenSpec change

Kept until the team has adopted the line commands (`Q84` of
`run-a-round-on-every-artifact`). `/workflow-plan` opens a change and runs
the round on its three files; the artifact map is `AGENTS.md`'s table.

`openspec/specs/` is the single source of truth for requirements; a change is
the delta against it. Every change in this store is drafted on one schema,
`grade10-planning`, whose eight artifacts are split across four role skills.
This skill covers what to settle before drafting and routes to the right one.

## Who writes what

The artifact map is `AGENTS.md`'s table.

**The product manager writes 1 to 3 and stops**; a designer specifying a change
writes the same three, through the same skill. 2 is the interview's record, and
everything after it is drawn from the scope it settles: a journey outside its
goals, or inside a non-goal, is the artifact disagreeing with the change. A
designer maps 4 onto the journeys where the change has a surface, working from
them and the PRD rather than a `spec.md` nobody has written yet.

**5 belongs to whoever takes the readings** - `/planning-qa`, or
`/planning-dev` on a change an engineer authored - and neither the PM nor the
designer opens it. That run writes its outline first, has the PM read the
groups, then runs two independent readings from them: 6, blind to the
scenarios, then 5's requirements, reconciled against it. Neither 5 nor 6 names a teammate or sits on
a worklist - the PM reviews 5, QA reviews 6 later with `/tcs-review`. A
capability nobody walks still carries 6, anchored on its feature set rather than
its journeys.

**Write your part and stop.** Each role adds its artifacts to the one change;
nobody opens a second one, and an implementation plan invented ahead of the
person who will execute it is worse than none. A change with no `tasks.md`
reads as still being planned on both boards — that is the handoff signal, and
it is the only one.

Take `planning-pm` when the change does not exist yet: the proposal, the
decisions and the journeys are where every change starts.

## Before you draft

Read the relevant capability in `openspec/specs/` and any active change for
overlap. The answer often turns on what already exists: a requirement that is
already written, a change already in flight against the same capability, or a
platform default the capability inherits rather than restates.

Then settle two things:

- **Which capabilities the change touches**, as paths under
  `openspec/specs/<product>/<domain>/<capability>/`. This is the proposal's
  contract with the specs: every capability named there gets a delta file, and
  nothing else does. Where a capability belongs is decided by who is held to
  it — `shared/` only when two or more of the four applications are.
- **Where your work ends** — the table above.

A change that changes no behavior at all — a pure refactor, tooling, docs —
sets `skip_specs: true` with `skip_specs_why: <why>` in its `.openspec.yaml`
rather than inventing a requirement to satisfy validation.

## Then hand over

Invoke the role skill and follow it. Two things are worth knowing whichever one
you land on:

- **Create the change with the CLI**, never by hand:
  `openspec new change <name>`. A hand-made directory records nothing in
  `.openspec.yaml`.
- **`openspec instructions <artifact> --change <name>`** prints this store's own
  rules for the artifact you are about to write, on top of the schema's. Read
  it rather than working from memory.

Do not start implementation until the proposal makes scope, requirement deltas,
and open decisions clear.
