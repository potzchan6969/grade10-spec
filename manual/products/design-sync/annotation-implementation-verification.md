---
title: Annotation Implementation Verification
spec: design-sync/annotation-implementation-verification
order: 3
---

An accepted annotation can still disagree with what collectors receive,
because acceptance proves the finding was seen and traced — not that the
implementation matches it. A recent store-page review needed a separate manual
pass to map accepted findings to behavior, code, tests and runtime evidence.

Verification closes that gap inside the reconciliation workflow: every
selected finding leaves it in exactly one of four states — verified with
complete implementation evidence, tied to settled existing work, given an
explicit no-impact reason, or routed into a reviewed plan. There is no fifth
door.
