---
name: workflow-build
description: Build a page's 🚧 lines - routes to page-build, tests titled with the page's ids first, then code. Routes a change still open under openspec/changes/ to its legacy task-group round. Invoke as /workflow-build <page>, or /workflow-build <change> <group>.
---

# Build From the Page

**An open OpenSpec change** - when the argument names a directory under
`openspec/changes/` (not `archive/`), follow [LEGACY.md](LEGACY.md) and stop
reading here.

**A retired change** - when the argument names a change in
[`openspec/retired-changes.tsv`](../../../openspec/retired-changes.tsv), tell
the person it folded into the pages its row names, and carry on there: its
open tasks are those pages' 🚧 lines and Open work items.

Anything else is new work under [Page First](../../../docs/governance/page-first.md):
follow [page-build](../page-build/SKILL.md) for the page's 🚧 lines.
