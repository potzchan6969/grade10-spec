---
name: openspec-propose
description: Pick the workflow schema for a new OpenSpec change and route to the lane that drafts it. Use when implementation planning is requested and the lane is not already obvious.
---

# Propose an OpenSpec change

`openspec/specs/` is the single source of truth for requirements; a change is
the delta against it. Every change is drafted in one of two lanes. This skill
picks the lane — the lane's own skill does the drafting.

## Pick the lane

Read the relevant capability in `openspec/specs/` and any active change for
overlap before choosing; the answer often turns on what already exists.

| Who is asking, and what finishes their work | Lane | Skill |
| --- | --- | --- |
| A PM or designer, or anyone whose work ends when the requirements are right | `pm-planning` | `pm-planning` |
| An engineer planning delivery now — writing `design.md` and `tasks.md` themselves | `full-planning` | `full-planning` |

In practice a delta needing a component, variant, or token under `packages/`
is delivery planned here, and takes `full-planning`.

**When unsure, take `pm-planning`.** The choice is not final: a `pm-planning`
change is promoted by the engineer who picks it up, and its proposal and deltas
carry over untouched. What promotion avoids is an implementation plan invented
ahead of the person who will execute it.

## Then hand over

Invoke the lane's skill and follow it. Each one covers creating the change with
the right schema, the artifacts it expects, the delta format, and what may
never appear in a spec.

Two things are true in both lanes and worth knowing before you start:

- **Create the change with the CLI**, never by hand:
  `openspec new change <name> --schema <lane>`. Only the CLI records the schema
  in `.openspec.yaml`; a hand-made directory silently takes the default in
  `openspec/config.yaml`.
- **`openspec instructions <artifact> --change <name>`** prints this store's own
  rules for the artifact you are about to write, on top of the schema's. Read
  it rather than working from memory.

Do not start implementation until the proposal makes scope, requirement deltas,
and open decisions clear.
