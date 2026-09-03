---
name: openspec-propose
description: Start a new OpenSpec change - what to read first, and the lane that drafts it. Use when implementation planning is requested.
---

# Propose an OpenSpec change

`openspec/specs/` is the single source of truth for requirements; a change is
the delta against it. Every change in this store is drafted in one lane,
`grade10-planning`, which carries the whole lifecycle from the proposal to the
task list. This skill covers what to settle before drafting — the
`grade10-planning` skill does the drafting.

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
- **Where your work ends.** Nobody writes the whole change. A PM finishes at
  the requirements and their journeys; QA derives the suites; a designer writes
  `ui-design.md`; the engineer who picks the work up writes `tech-design.md`
  and `tasks.md`. Write your part and stop — an implementation plan invented
  ahead of the person who will execute it is worse than none.

A change that changes no behavior at all — a pure refactor, tooling, docs —
sets `skip_specs: true` in its `.openspec.yaml` rather than inventing a
requirement to satisfy validation.

## Then hand over

Invoke the `grade10-planning` skill and follow it. It covers creating the
change, every artifact and who writes it, the delta format, and what may never
appear in a spec.

Two things are worth knowing before you start:

- **Create the change with the CLI**, never by hand:
  `openspec new change <name>`. A hand-made directory records nothing in
  `.openspec.yaml`.
- **`openspec instructions <artifact> --change <name>`** prints this store's own
  rules for the artifact you are about to write, on top of the schema's. Read
  it rather than working from memory.

Do not start implementation until the proposal makes scope, requirement deltas,
and open decisions clear.
