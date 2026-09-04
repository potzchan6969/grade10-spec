---
name: planning-dev
description: Write the engineer's artifacts on an OpenSpec change - tech-design.md and tasks.md - on a change somebody else specified or one you author yourself. Use when planning delivery.
---

# The engineer's artifacts

Two of the seven artifacts in `grade10-planning` are yours, and they are the
last two:

| Artifact | What it holds |
| --- | --- |
| `tech-design.md` | How the requirements land — decisions, data model, contracts, risks |
| `tasks.md` | The delivery plan, grouped by layer and claimed group by group |

`tasks.md` is the one that moves the change off the planning board: until it
exists, both boards read the change as still being planned.

## Pick up the change in hand; never open a second one

Most changes arrive already carrying a proposal, spec deltas and journeys
somebody else wrote. **Add your artifacts to that change.** The implementing
repository has no planning shape of its own — its `openspec/` is config-only
and resolves to this store — so delivery is planned here, by you.

1. Work on the branch that carries the change, not on `main`. If it is already
   merged, start from an up-to-date `main`; if it is still on a branch, work
   there.
2. Add `promoted_by: @your-handle` to the change's `.openspec.yaml` beside
   `schema:`. The board names the promoter from that key — without it the card
   still reads "proposed by" alone, and the author never learns their change
   was picked up.
3. `pnpm run plan:preflight <change-id>`, then write the artifacts below.
4. `openspec status --change <change-name>` lists what is still missing.

The proposal, the deltas and the journeys carry over untouched. **Do not send
the proposal back to its author for a task list** — their part is finished.

Authoring a change from scratch is the same lane: run `openspec new change
<name>`, write the first three artifacts with `/planning-pm`, then continue
here.

## Read the enriched instructions as you reach each artifact

```bash
openspec instructions tech-design --change <change-name>
openspec instructions tasks --change <change-name>
```

They carry this store's own rules, from `openspec/config.yaml`, on top of the
schema's. Read them rather than working from memory.

## tech-design.md

Optional. Write one when the change is cross-cutting, introduces an
architectural pattern or an external dependency, changes the data model,
carries security, performance or migration complexity, or holds an ambiguity
better settled before coding.

- **Context**: only the current state and constraints needed to explain the
  approach. Point at the proposal for motivation; never restate it.
- **Decisions**: how the spec lands, not a restatement of it. Open by naming
  what the spec already governs, then record the implementation choice (which
  row, which service, persist vs recompute, reuse vs add) and the alternatives
  rejected. A decision that could be a spec scenario belongs in the spec. Keep
  the implementation alternative an engineer might still try even when the spec
  forbids the resulting behavior.
- **Database Schema**, top-level for a data-model change: owning and affected
  tables, each added or changed column with Postgres type, nullability and
  default matching the existing schema, keys, constraints, indexes, an ER
  diagram, and which data is authoritative rather than derived. Reuse a table
  or stamp that already holds the fact. Spec fields read from another row at
  query time are not stored.
- **Service Interfaces**, top-level for a service change: each service function
  as a processor with one fixed input shape and one fixed success/refusal
  output. State transaction ownership, locks, reads, writes, idempotency,
  faults, and the boundary between entrypoint, service, repository and
  persistence. For every flow mutating multiple tables, name the mutation order
  and atomic boundary, with concrete before/after rows.
- **Contracts**: only when the wire changes in a meaningful way (breaking
  rename, additive authenticated field, new admin read). Do not list unchanged
  endpoints.
- **Risks / Trade-offs** as `[Risk] → Mitigation`, and a **Migration Plan**
  where one applies. Do not mitigate a risk with "the spec says so" —
  mitigation is an implementation control: a lock, a stamp, a state column.
- **Open Questions** only for unknowns answerable later *without* changing the
  specs, the approach, or the task breakdown. Anything that would change one of
  those is not an open question — resolve it now, asking rather than guessing.

Screens and Figma sources belong in `ui-design.md`; link it rather than
restating it.

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
- **Carry the archive hand-copy.** When a delta has a `## Feature set`, or a
  capability has a `user-journeys.md`, the store group carries a task to copy
  them across at archive time. The fold keeps `## Requirements` and nothing
  else, so the feature set and every `-US-` id die with the change unless
  someone carries them — and the someone is decided here, at planning time,
  not discovered by whoever archives. `pnpm run archive:preflight` refuses the
  archive while they are uncarried.
- **Carry the manual page.** A change whose deltas touch a capability carries a
  task to update that capability's page under `docs/prds/`; `pnpm check:manual`
  verifies it.
- **Carry the component work** `ui-design.md` flagged — a variant, a token, or
  a compound component that does not exist yet is a grade10-spec group.
- Keep each task to something one engineer finishes in a session.
- **Write groups without owner tags.** Engineers claim them at pickup with
  `pnpm plan claim`. Never renumber a group or task that is claimed or already
  has checkmarks.

Before writing tasks, read `tech-design.md`'s Open Questions. If any would
change what gets built, resolve it with the author first rather than baking an
unstated assumption into the list.

## Finish

```bash
openspec validate <change-name> --strict
openspec status --change <change-name>
```

If the change has journeys but no suites beside them, run
`/spec-to-tcs <change-name>` before pushing — `/spec-push` refuses without
them.

Then hand off: an engineer implements from the application repository with its
`implement` skill, claiming one group at a time. Archive belongs to whoever
owns the change, **after it is deployed** — not when the code merges.

## Related

- `planning-pm` — the requirements and journeys your tasks name.
- `planning-design` — the screens and the component work your plan carries.
- `planning-qa` — the suites that must exist before the change pushes.
- `openspec-apply-change`, `openspec-archive-change` — the far end of the
  lifecycle.
