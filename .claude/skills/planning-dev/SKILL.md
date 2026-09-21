---
name: planning-dev
description: Write the engineer's artifacts on an OpenSpec change - tech-design.md and tasks.md - on a change somebody else specified or one you author yourself. Use when planning delivery.
---

# The engineer's artifacts

Two of the eight artifacts in `grade10-planning` are yours - `tech-design.md`
is the fifth, `tasks.md` the eighth:

| Artifact | What it holds |
| --- | --- |
| `tech-design.md` | How the requirements land — decisions, data model, contracts, risks |
| `tasks.md` | The delivery plan, grouped by layer and claimed group by group |

`tasks.md` is the one that moves the change off the planning board: until it
exists, both boards read the change as still being planned.

## Pick up the change in hand; never open a second one

Most changes arrive already carrying a proposal, the decisions and the journeys
somebody else wrote. **Add your artifacts to that change.** The implementing
repository has no planning shape of its own — its `openspec/` is config-only
and resolves to this store — so delivery is planned here, by you.

1. Add `promoted_by: @your-handle` to the change's `.openspec.yaml` beside
   `schema:`. The board names the promoter from that key — without it the card
   still reads "proposed by" alone, and the author never learns their change
   was picked up.
2. **Read what the deltas carry, not whether the file is there.** Look for the
   `## ADDED` and `## MODIFIED Requirements` headings before you plan.

   **No requirements means `tasks.md` is not yours to plan yet.** A task names
   the scenarios it makes pass, and an outline issues none, so the plan waits
   on the requirements; `tech-design.md` is drawn before them, from the page,
   the decisions and the journeys. Where you own the change, take it through
   `/workflow-specify` — the suite and the scenarios — and continue here. Where
   somebody else authored it, say it needs QA's two readings and stop: that run
   stops on *its* author for a case nobody ever decided, and answering one of
   those yourself is the agent deciding the product.

The proposal, the deltas and the journeys carry over untouched. **Do not send
the proposal back to its author for a task list** — their part is finished. A
change whose scenarios never landed is the exception above, and what goes back
is the anchor set, not the proposal.

Authoring a change from scratch is the same lane: take artifacts 1 to 3
through `/workflow-plan` - the proposal, the decisions, the journeys - then the spec
passes. **`spec.md` is yours on a change you authored**: its outline, the blind
suite, then the requirements, exactly as `/workflow-specify` runs them. Read
`planning-qa` and follow it rather than writing the file directly; the PM and
the designer never open it, and neither do you on somebody else's change.

## tech-design.md

Owed by every change carrying a task group outside this store — the
instruction `/workflow-tech` renders holds the sections, what each carries, and the
waiver that stands in for the file, and it carries this store's own rules, from
`openspec/config.yaml`, on top of the schema's. Beyond them: under
**Decisions**, keep the
implementation alternative an engineer might still try even when the spec
forbids the resulting behavior, so the next engineer finds it rejected rather
than untried.

## tasks.md

This is the artifact the implementing repository reads, checks off, and claims
groups in. The instruction `/workflow-tasks` renders holds the shape — layers, clone
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

A change that needs an artifact nobody has written yet says so: `awaiting:`
with `<artifact>: <what is missing>` in its `.openspec.yaml`. That line is
what puts it on [Pending](/pending) under the teammate who owes it.

Then hand off: an engineer claims one group at a time from the application
repository with `/workflow-build`. Archive belongs to whoever owns the change, **after
it is deployed** — not when the code lands.

## Related

- `planning-pm` — the requirements and journeys your tasks name.
- `planning-design` — the screens and the component work your plan carries.
- `planning-qa` — the scenarios your tasks name and the suites that land
  beside them; where a change arrives without them, the run that fills them.
- `openspec-apply-change`, `openspec-archive-change` — the far end of the
  lifecycle.
