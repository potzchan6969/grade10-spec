---
name: planning-pm
description: Plan a feature as a product manager or designer - mark its product page with 🚧 lines and ids, ❓ on what is open and a decisions row, then hand it to a fresh reading. Routes a change still open under openspec/changes/ to its legacy procedure.
---

# Plan a Feature on Its Page

**An open OpenSpec change** - when the argument names a directory under
`openspec/changes/` (not `archive/`), follow [LEGACY.md](LEGACY.md) and stop
reading here.

**A retired change** - when the argument names a change in
[`openspec/retired-changes.tsv`](../../../openspec/retired-changes.tsv), tell
the person it folded into the pages its row names, and carry on there: its
open tasks are those pages' 🚧 lines and Open work items.

Anything else is new work, planned on its page -
[Page First](../../../docs/governance/page-first.md):

1. **Interview** - use [`grilling`](../grilling/SKILL.md) only for choices
   that change scope or an irreversible product choice; write the rest as ❓
   lines, or `❓ Assumed: <x>` where the build can go on.
2. **Mark the page** - with `prd-authoring`: one 🚧 line and `{#id}` per
   outcome, in its flow's section, `## Always` or `## Later`; a decisions row
   for each choice a reader would reopen.
3. **Hand on** - `/planning-design <page>` when a 🚧 line changes a screen,
   then `/planning-dev <page>`. No proposal, decisions file or journeys.
