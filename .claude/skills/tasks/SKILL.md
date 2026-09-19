---
name: tasks
description: Run a round on a change's tasks.md - the delivery plan, grouped by layer, test task first and claimed group by group. Use when a change's requirements and cases are on main and delivery needs planning. Invoke as /tasks <change>.
---

# The Plan's Round

**The artifact:** `tasks.md`, drawn from everything before it, then `spec.md`
and `feature-tcs.md`. Until it exists both boards read the change as still
being planned.

**The rules:** `planning-dev` and
[`docs/governance/task-ownership.md`](../../../docs/governance/task-ownership.md) -
the group and owner format two repositories parse - plus:

```bash
openspec instructions tasks --change <change>
```

Then follow `round`: it holds the six steps, the readers, the questions, the
landing and the re-read.

## What the Round Adds Here

- **Test first, in the group** — each group's test task is written first and
  ticked last: its tests land in their own commit, naming the scenario ids the
  group's tasks name
- **The last group is the walk** — it walks every journey of every capability
  the change specifies, end to end through the interface each actor uses, and
  leaves the walks as the change's end-to-end suite
- **Every task names its tree** — a group carries its repository tag, so
  `pnpm plan done` reads a tick against the tree that tag names
- **`pnpm run plan:preflight <change>`** — run it before editing a plan
  engineering is already implementing
