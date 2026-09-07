---
title: Annotation Monitoring
spec: shared/design-sync/annotation-monitoring
order: 2
---

Designers keep annotating after implementation starts — text changes,
categories change — so the annotations on the file and the baseline
engineering reviewed drift apart. Monitoring is the workflow that notices:
the `reconcile-figma-annotations` skill, driven end to end by a developer,
never by an unattended job.

## Observation

A run reads annotations only from registered engineering surfaces, with each
file's category catalog fetched once so findings speak in the designer's own
labels — Content, Interaction — rather than ids. The observation is
temporary and carries a digest that pins its evidence; no current-state file
is written to either repository.

## Reconciliation

The live observation is compared against the reviewed baseline, and every
finding names the registered engineering work it touches. Missing or
orphaned evidence never reads as clean, and only the changes a developer
explicitly selects and accepts are applied — atomically, with verification
and the commit as their own explicit steps. The property this protects:
every accepted change is traceable from Figma evidence to a reviewed
baseline or an OpenSpec decision, and nothing unselected, ambiguous or
blocked is accepted silently.
