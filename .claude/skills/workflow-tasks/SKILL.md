---
name: workflow-tasks
description: Take a marked page to build - routes to planning-dev; there is no task list. Routes a change still open under openspec/changes/ to its legacy task planning. Invoke as /workflow-tasks <page>, or /workflow-tasks <change>.
---

# Tasks From the Page

**An open OpenSpec change** - when the argument names a directory under
`openspec/changes/` (not `archive/`), follow [LEGACY.md](LEGACY.md) and stop
reading here.

Anything else is new work under [Page First](../../../docs/governance/page-first.md):
there is no `tasks.md`. The page's 🚧 lines are the work list
(`pnpm pages:board <page> --build`), and what code cannot close is its
`Open work` detail. Follow [planning-dev](../planning-dev/SKILL.md).
