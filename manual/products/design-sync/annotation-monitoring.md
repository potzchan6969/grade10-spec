---
title: Annotation Monitoring
spec: design-sync/annotation-monitoring
order: 2
---

Designers change annotation text and categories after implementation starts,
and the old REST-backed CI monitor could not even read the category labels —
acceptance was a separate manual editing exercise. The replacement is one
interactive workflow, the `reconcile-figma-annotations` skill, that a
developer drives end to end.

It fetches annotations only from registered engineering surfaces, with each
file's category catalog fetched once so findings speak in labels — Content,
Interaction — rather than ids. The live observation is compared against the
reviewed baseline, findings name the registered engineering work they touch,
and only the changes a developer explicitly accepts are applied.

The property the workflow protects: every selected change is traceable from
Figma evidence to a reviewed baseline or an OpenSpec decision, and nothing
unselected, ambiguous or blocked is accepted silently.
