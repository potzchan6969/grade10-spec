---
title: Design Sync
---

Design sync is not a product surface. It is the set of rails that hold code and
the Figma file to each other, and a contract the tooling owes every product.

A component is drawn in Figma, converted to code once, and then lives for years
while both sides keep moving. Design sync is what notices when they stop
agreeing — long after whoever converted the component has moved on, and without
anyone remembering to look.

## Mechanism

Each component directory carries a small table saying which Figma node each
element was converted from. An unattended run reads the node's real values —
fills, strokes, and the rest — and compares them against what the code actually
renders. A disagreement fails the run. A gap in coverage is reported as a gap
rather than passing quietly, which is the part that makes the whole thing worth
trusting: a run that checked nothing must not look like a clean run.

Two rails share the work. A component whose Figma counterpart defines variant
axes is compared by the variant-set comparison; one that defines none is
compared by an audit table. Never both, so no component ever has two
disagreeing sources of truth.

## Users

Designers, because a drifted value is reported against the frame they own.
Engineers, because the audit is the thing that lets them change a component
without re-reading the design. And whoever inherits both, because the rail keeps
answering after everyone who set it up has gone.

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026" title="Grade10-DS-2026 — the one design file every mapping points into"}
