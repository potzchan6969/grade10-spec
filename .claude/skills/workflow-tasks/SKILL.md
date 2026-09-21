---
name: workflow-tasks
description: Run a round on a change's tasks.md - the delivery plan, grouped by layer, test task first and claimed group by group. Use when a change's requirements and cases are on main and delivery needs planning. Invoke as /workflow-tasks <change>.
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

Then follow `workflow-round`: it holds the six steps, the readers, the questions, the
landing and the re-read.

## What the Round Adds Here

- **The plan's rules have one home** — the group's test task, the walk that
  closes the plan and the repository tag on every group are the instruction's
  rules, printed by the command above and held by
  `scripts/openspec/tasks-template.test.mjs`; the template is the example
- **`pnpm run plan:preflight <change>`** — run it before editing a plan
  engineering is already implementing
