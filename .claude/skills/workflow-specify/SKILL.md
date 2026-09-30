---
name: workflow-specify
description: Route a specification-planning request to the single planning-dev invocation, which writes QA1 cases, Dev scenarios, QA2 reconciliation, and acceptance. Invoke as /workflow-specify <change>.
---

# Specification Planning Route

`/workflow-specify <change>` is a compatibility route to
[`planning-dev`](../planning-dev/SKILL.md). Run that skill once to freeze the
anchor set, generate QA1's blind draft cases, write the technical design and
scenarios in an independent Dev context, reconcile in QA2, resolve questions
with the same human, then accept and publish the contract.

Do not run a separate QA round or request initial human QA approval. Human QA
reviews the draft suite through `tcs-review` after deployment, and `tcs-run-sheet`
supports manual execution once the implementation is available.
[`tcs-review`](../tcs-review/SKILL.md).
