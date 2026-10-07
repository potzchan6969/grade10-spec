---
name: planning-qa
description: Retired alias for the integrated planning workflow. Use planning-dev for QA1 blind cases, Dev scenarios, QA2 reconciliation, and acceptance; use tcs-review for human QA after implementation.
---

# Planning QA Route

- **Planning** - `planning-qa` is a retired alias. Pass the change and any QA input to [planning-dev](../planning-dev/SKILL.md) for its integrated planning run; return its accepted and published contract with reconciled draft cases, or its unresolved questions and blockers.
- **Suite Refresh** - Use [spec-to-tcs](../spec-to-tcs/SKILL.md) for a suite refresh or as planning-dev's internal case generator. Pass the affected capability or suite and return its draft cases.
- **Human QA** - After deployment, use [tcs-review](../tcs-review/SKILL.md) to classify the suite and [tcs-run-sheet](../tcs-run-sheet/SKILL.md) to prepare manual execution.
