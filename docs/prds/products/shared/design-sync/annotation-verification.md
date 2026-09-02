---
title: Annotation Implementation Verification
spec: shared/design-sync/annotation-verification
order: 3
---

Accepting an annotation finding proves it was seen and traced — not that the
implementation matches it. Verification is the step between selection and
acceptance that closes that gap: every selected finding is reviewed, read
only, against the repository that owns its surface, and leaves with recorded
behavior, code, test and runtime evidence and exactly one outcome — verified
as implemented, tied to settled existing work, given an explicit no-impact
reason, or routed into a reviewed plan. There is no fifth door.

A gap never merges quietly into acceptance. Gap findings go through the
ordinary planning workflows — requirements-only or delivery planning, after
confirmation — and planning and acceptance stay separate transactions, so a
plan's existence is never mistaken for delivery: accepting a gap finding
takes a fresh observation after the planning lands.
