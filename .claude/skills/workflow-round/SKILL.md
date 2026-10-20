---
name: workflow-round
description: Work one page or one open OpenSpec change - routes new work to planning-pm, planning-design, planning-dev or page-build, and a change still open under openspec/changes/ to its legacy round. Invoke as /workflow-round <page>, or /workflow-round <change> <artifact|group>, /workflow-round <change>, /workflow-round reread <change>.
allowed-tools: Read, Grep, Glob, Write, Edit, Bash, Task
---

# One Page, One Step

**An open OpenSpec change** - when the argument names a directory under
`openspec/changes/` (not `archive/`), or is `reread <change>`, follow
[LEGACY.md](LEGACY.md) and stop reading here.

Anything else is new work under [Page First](../../../docs/governance/page-first.md).
There are no rounds or artifacts to land; take the next step the page needs:

| The page needs | Skill |
| --- | --- |
| A rule, a decision, a 🚧 or ❓ line | [planning-pm](../planning-pm/SKILL.md) |
| A story for a 🚧 line the board lists with `none` | [planning-design](../planning-design/SKILL.md) |
| A fresh reading and ids before a build | [planning-dev](../planning-dev/SKILL.md) |
| Its 🚧 lines built | [page-build](../page-build/SKILL.md) |
