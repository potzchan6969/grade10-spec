---
name: workflow-tasks
description: Route implementation planning to the integrated planning-dev invocation, which writes tasks after scenarios and before acceptance. Invoke as /workflow-tasks <change>.
---

# Task Planning Route

`/workflow-tasks <change>` routes to
[`planning-dev`](../planning-dev/SKILL.md). Dev writes `tasks.md` after the
technical design and scenarios, then QA2 checks it with the cases and scenario
coverage before the human accepts the complete plan.

Do not start a separate task-planning round. Human QA review and execution
follow implementation through [`tcs-review`](../tcs-review/SKILL.md).
