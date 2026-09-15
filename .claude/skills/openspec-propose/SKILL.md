---
name: openspec-propose
description: Start a new OpenSpec change - what to read first, and which role skill writes each artifact. Use when implementation planning is requested and the artifact's owner is not already obvious.
---

# Propose an OpenSpec change

`openspec/specs/` is the single source of truth for requirements; a change is
the delta against it. Every change in this store is drafted on one schema,
`grade10-planning`, whose seven artifacts are split across four role skills.
This skill covers what to settle before drafting and routes to the right one.

## Who writes what

| # | Artifact | Skill | Required |
| --- | --- | --- | --- |
| 1 | `proposal.md` | `planning-pm` | Always |
| 2 | `specs/<capability>/spec.md` | `planning-pm` | Always — two passes, with 4 between them |
| 3 | `specs/<capability>/user-journeys.md` | `planning-pm` | Always — a capability nobody walks says so in it |
| 4 | `specs/<capability>/feature-tcs.md` | `planning-pm` | Always — a blind pass, written before the scenarios |
| 5 | `ui-design.md` | `planning-design` | Optional |
| 6 | `tech-design.md` | `planning-dev` | When a task group lands outside this store — or `design_waived: <why>` |
| 7 | `tasks.md` | `planning-dev` | Before the change can be applied |

Artifacts 2 to 4 are one `/planning-pm` run. `spec.md` is written twice: its
purpose and feature set before the journeys, its requirements after the blind
suite. A capability nobody walks still carries 4, anchored on its feature set
rather than its stories.

**Write your part and stop.** Each role adds its artifacts to the one change;
nobody opens a second one, and an implementation plan invented ahead of the
person who will execute it is worse than none. A change with no `tasks.md`
reads as still being planned on both boards — that is the handoff signal, and
it is the only one.

Take `planning-pm` when the change does not exist yet: the first three
artifacts are where every change starts.

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
sets `skip_specs: <why>` in its `.openspec.yaml` rather than inventing a
requirement to satisfy validation.

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
