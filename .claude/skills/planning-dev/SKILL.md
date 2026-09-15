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

Owed by every change carrying a task group outside this store — the
instructions you rendered above hold the sections, what each carries, and the
waiver that stands in for the file. Beyond them: under **Decisions**, keep the
implementation alternative an engineer might still try even when the spec
forbids the resulting behavior, so the next engineer finds it rejected rather
than untried.

## tasks.md

This is the artifact the implementing repository reads, checks off, and claims
groups in. The instructions you rendered above hold the shape — layers, clone
names, parallel groups, tasks phrased as scenarios, a verification step per
group, no owner tags — and `docs/governance/task-ownership.md` the format
tooling on both sides parses. Beyond them:

- **Leave the routine archive hand-copy out of the tasks.** The fold keeps
  `## Requirements` and nothing else, so a delta's `## Feature set` and every
  `-US-` id in a `user-journeys.md` need carrying across — but
  `pnpm run archive:preflight` already refuses the archive while they are
  uncarried, and a task for it cannot be ticked when the work is: it waits on a
  deploy, so a delivered change reads as incomplete on the board. Name who
  archives in the proposal instead. Carry a task only for what the preflight
  cannot check — a hand-off sequenced behind another change archiving first, a
  capability with no durable spec for the copy to land in, a README row or an
  acceptance shelf — and write it inside the grade10-spec group that updates
  the PRD, never as a group of its own with a verification step it
  cannot pass.
- **The PRD moves first.** A constraint you learn that changes an outcome goes
  on the PRD, marked 🚧 or ❓, before the delta or the task that depends on
  it. A constraint that changes no outcome — a mechanism, a key, a lock, a
  metric, a sweep, what was tried and dropped — is `tech-design.md`'s and the
  application repository's architecture doc's. Your depth on the page is one
  `detail{for="engineer"}` block, and it is a code map: the module, the
  config name, the architecture doc, as items of a name and a link. The
  check warns (`dense`) on an engineer block holding a paragraph.
- **Engineers claim groups at pickup** with `pnpm plan claim`, which is why
  the groups are written without owner tags.

## Finish

```bash
pnpm run validate:changes
openspec status --change <change-name>
```

A change that needs an artifact nobody has written yet says so: `awaiting:`
with `<artifact>: <what is missing>` in its `.openspec.yaml`. That line is
what puts it on [Pending](/pending) under the hand that owes it.

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
