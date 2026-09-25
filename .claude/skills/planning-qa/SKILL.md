---
name: planning-qa
description: Retired alias for the integrated planning workflow. Use planning-dev for QA1 blind cases, Dev scenarios, QA2 reconciliation, and acceptance; use tcs-review for human QA after implementation.
---

# Planning QA Route

`planning-qa` no longer owns a separate planning pass. Use
[`planning-dev`](../planning-dev/SKILL.md) for the single change-planning run:
QA1 writes blind draft cases, Dev writes technical design and scenarios, and
QA2 reconciles them before one human acceptance and publication.

Use [`spec-to-tcs`](../spec-to-tcs/SKILL.md) only as the internal case generator
called by planning-dev or when refreshing a suite. Use
[`tcs-review`](../tcs-review/SKILL.md) for human QA review and execution after
implementation.
