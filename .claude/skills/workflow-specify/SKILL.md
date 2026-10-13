---
name: workflow-specify
description: Route a specification-planning request to the single planning-dev invocation, which writes QA1 cases, Dev scenarios, QA2 reconciliation, and acceptance. Invoke as /workflow-specify <change>.
---

# Specification Planning Route

- **Route** - `/workflow-specify <change>` is a compatibility route to [planning-dev](../planning-dev/SKILL.md). Pass the change and any specification input to its integrated planning run.
- **Completion** - Return that run's accepted and published contract with reconciled draft cases, or its unresolved questions and blockers. Do not run a separate QA round.
