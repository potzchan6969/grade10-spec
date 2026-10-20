---
name: workflow-land
description: Land a page change or a build - pnpm push:main for the page, the application's own pull request for code. Routes a change still open under openspec/changes/ to its legacy landing. Invoke as /workflow-land <page>, or /workflow-land <change> <artifact|group>.
---

# Land a Page

**An open OpenSpec change** - when the argument names a directory under
`openspec/changes/` (not `archive/`), follow [LEGACY.md](LEGACY.md) and stop
reading here.

Anything else is new work under [Page First](../../../docs/governance/page-first.md):
- **A page** - `pnpm pages:check` and `pnpm check:manual`, then
  `pnpm push:main`: one product decision per push
- **Code** - the application's pull request, its tests titled with the
  page's ids, and its CI's `pages.mjs gate`
- **🚧 off** - only once a release carries the line and its ids pass, in
  its own push here
