---
name: page-build
description: Build what a product page marks 🚧 - straight from the page and its cases, tests first, citing case ids - then take the marks off. Use when asked to implement a feature, a page, or a 🚧 line.
---

# Build From a Page

The page says what; this repository or the application decides how. There is
no proposal, spec or task list to write.

1. **Find the work** - `pnpm pages:board <prefix> --build` lists the 🚧
   lines. Read the whole page, its cases (`pnpm pages:cases <page>`), the
   pages it links, and any `::story` it embeds.
2. **Stop on what is open** - a ❓ that the 🚧 line depends on goes back to
   the person in the Clarification Request format of `AGENTS.md`. A 🎨 line
   with no story is built from existing blocks and primitives only; never
   invent a variant or a look (Design Override in `AGENTS.md`).
3. **Pick the cases** - every example, flow and cases row in the sections
   the 🚧 lines sit in. A rule with no case gets a row in the cases file
   first, in its own commit, with tag `building`.
4. **Tests first** - one test per case, citing `<page>#<id>` in its name or a
   comment beside it, committed before the code. Shared blocks test through
   their stories; the application tests its own layers.
5. **Build** - the smallest change that passes. Where the code and an
   unmarked line disagree, fix whichever is wrong and say which in the
   commit; never leave them apart.
6. **Land** - take the 🚧 off each line the build delivers, and the
   `building` tag off its cases rows, in the same push as the code or the
   submodule bump that ships it. Write a design note in the application's
   `docs/architecture/` only for a mechanism a later reader needs, and link
   it from the page's `Code map`.
7. **Check** - `pnpm run lint`, `pnpm run typecheck`, the tests the change
   touches, `pnpm check:manual`, `pnpm pages:check`.
