---
name: full-planning
description: Plan delivery of an OpenSpec change - design, ui, and tasks on top of a proposal and specs. Use when an engineer is promoting a pm-planning change or writing a change they will implement.
---

# Plan a full-planning change

`full-planning` is the lane for a change that carries its **implementation
plan**: proposal → specs → design → ui → tasks. It is an engineer's lane. A
change only reaches `apply` — and only appears on an engineer's board as
workable — once it has a `tasks.md`.

## Confirm the lane first

Take this lane when you are planning delivery you or another engineer will
implement. If your work ends when the requirements are right, take
`pm-planning` instead and let the engineer who picks it up promote it.

## The common path is promotion, not creation

Most changes arrive here already carrying a proposal and specs somebody else
wrote. **Promote that change; never open a second one.** The implementing
repository has no planning shape of its own — its `openspec/` resolves to this
store — so delivery is planned here, by you.

1. Set `schema: full-planning` in the change's `.openspec.yaml`.
2. Add `design.md` and `tasks.md`, plus `ui.md` when the change alters
   something a user sees.
3. `openspec status --change <change-name>` then lists what is still missing.

The proposal and the spec deltas carry over untouched. Do not send the proposal
back to its author for a task list — their part is finished.

## Starting fresh

When no proposal exists yet:

```bash
openspec new change <change-name> --schema full-planning
```

Kebab-case. Creating the directory by hand records no schema and silently takes
the default in `openspec/config.yaml`. Then write `proposal.md` and the delta
specs — the `pm-planning` skill covers both, including the delta format and
what may never appear in a spec — and continue below.

## Read the enriched instructions as you reach each artifact

```bash
openspec instructions design --change <change-name>
openspec instructions ui --change <change-name>
openspec instructions tasks --change <change-name>
```

They carry this store's own rules, from `openspec/config.yaml`, on top of the
schema's. Read them rather than working from memory.

## design.md

Write one when the change is cross-cutting, introduces an architectural pattern
or an external dependency, changes the data model, carries security,
performance or migration complexity, or holds an ambiguity better settled
before coding.

- **Context**: only the current state and constraints needed to explain the
  approach. Point at the proposal for motivation; never restate it.
- **Decisions**: each with its rationale and the alternatives considered and
  rejected. Engineering inherits those trade-offs — an alternative you leave
  out gets re-litigated during implementation.
- **Risks / Trade-offs**, and a **Migration Plan** where one applies.
- **Open Questions** only for unknowns that can be answered later *without*
  changing the specs, the approach, or the task breakdown. Anything that would
  change one of those is not an open question — resolve it now, asking rather
  than guessing.

Link the capability spec instead of restating requirements. Screens and Figma
sources belong in `ui.md`.

## ui.md

Only when the change adds or alters something a user sees. A change with no
user-facing surface skips the file entirely — nothing depends on it.

- **Screens**: link the Figma frame. The frame is the layout's source of truth,
  so never describe a screen in prose.
- **Components**: name design-system and `packages/ui` exports exactly — the
  export name is the cross-repo contract. A component, variant, or token that
  does not exist yet is work in **grade10-spec**; flag it so `tasks.md`
  carries it.
- **States**: loading, empty, error and edge states, each tied to the spec
  scenario that defines it. A state with no scenario behind it means the spec
  is missing one — fix the spec, not this file.

## tasks.md

This is the artifact the implementing repository reads, checks off, and claims
groups in. Follow `docs/governance/task-ownership.md` for the format exactly —
tooling on both sides parses it.

- **Group by layer**, in order: shared types and interfaces, data migration,
  backend and API, frontend. Omit a layer the change does not touch rather than
  writing an empty group. When a change spans grade10-spec and an application
  repo, the grade10-spec groups land first — the submodule bump is the
  boundary. A group title names its repository by clone name —
  `(grade10-spec)`, `(grade10)` — never "this repo" or "here": tasks.md is
  written in this store and read from the application repo, so a deictic
  reference flips meaning between the two.
- **Once the shared-interface group lands, the rest are parallel.** Write each
  so it can be claimed on its own and verified on its own — frontend against
  the contracts and fixtures, never a running backend. When a group genuinely
  needs another's landed code, say so in a prose line under its heading.
- **Phrase an implementation task as the spec scenario it makes pass**, naming
  the scenario, so the scenario's test is the evidence behind the checkmark.
- **Never split "write the tests" into its own task or group.** The engineer
  works test-first inside each task; a separate testing task invites the
  opposite.
- **End every group with its verification step** — the checks that group runs.
- Keep each task to something one engineer finishes in a session.
- **Write groups without owner tags.** Engineers claim them at pickup with
  `pnpm plan claim`. Never renumber a group or task that is claimed or already
  has checkmarks.

Before writing tasks, read `design.md`'s Open Questions. If any of them would
change what gets built, resolve it with the author first rather than baking an
unstated assumption into the list.

## Finish

```bash
openspec validate <change-name> --strict
openspec status --change <change-name>
```

Then hand off: an engineer implements from the application repository with its
`implement` skill, claiming one group at a time. Archive belongs to whoever
owns the change, **after it is deployed** — not when the code merges.

## Related

- `pm-planning` — the requirements-only lane, and where most of these changes
  come from.
- `openspec-propose` — routes between the two when the lane is not obvious.
- `openspec-apply-change`, `openspec-archive-change` — the far end of the
  lifecycle.
