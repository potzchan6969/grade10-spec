---
name: planning-design
description: Draw what a feature's 🚧 lines change on screen - a story under each line the board lists with none, from existing blocks and tokens. Routes a change still open under openspec/changes/ to its legacy procedure.
---

# Design a Feature From Its Page

**An open OpenSpec change** - when the argument names a directory under
`openspec/changes/` (not `archive/`), follow [LEGACY.md](LEGACY.md) and stop
reading here.

Anything else is new work, designed from its page -
[Page First](../../../docs/governance/page-first.md):

1. **Find the lines** - `pnpm pages:board <page> --design` lists each 🚧
   line with its story or `none`.
2. **Draw** - each `none` line that changes a screen, with
   `storybook-workbench`, cited under its line with `::story`. Missing
   primitives, variants and tokens are the designer's call - Design Override
   in `AGENTS.md`; use `design-system-primitives` or `design-tokens`.
3. **Page first** - a state that changes what the reader can do, sees
   counted or is refused is a 🚧 line with an id on the page before its
   story; a look question is a ❓ line and never holds the build.
4. **Hand on** - `/planning-dev <page>`. No `ui-design.md`.
