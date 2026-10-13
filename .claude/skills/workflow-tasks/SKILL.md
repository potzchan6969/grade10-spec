---
name: workflow-tasks
description: Route implementation planning to the integrated planning-dev invocation, which writes tasks after scenarios and before acceptance. Invoke as /workflow-tasks <change>.
---

# Task Planning Route

- **Route** - `/workflow-tasks <change>` routes to [planning-dev](../planning-dev/SKILL.md). Pass the change and any task-planning input to its integrated planning run.
- **Task Contract** - Read the repository's enriched task instructions below. The template is the example; `scripts/openspec/tasks-template.test.mjs` holds the contract.

```bash
openspec instructions tasks --change <change>
```

- **Completion** - Return that run's accepted and published plan, including `tasks.md`, or its unresolved questions and blockers. Do not start a separate task-planning round.
