---
name: page-build
description: Build what a product page marks 🚧 - straight from the page, tests titled with its ids first, then code. Use when asked to implement a feature, a page, or a 🚧 line.
---

# Build From a Page

The page says what; the application decides how. There is no proposal, spec
or task list to write.

1. **Find the work** - `pnpm pages:board <prefix> --build` lists the 🚧
   lines, `--work` the open work they wait on. Read the whole page, its
   cases file, the pages it links, its `Code map`, and any `::story` it
   embeds.
2. **Read it fresh** - give a fresh sub-agent the touched sections alone and
   ask the `page-cases` skill's questions. It reports back; it edits
   nothing. Each answer the page gives becomes a test; each gap becomes a ❓
   line on the page, landed before the code.
3. **Settle what is open** - a ❓ the line depends on goes to the person in
   the Clarification Request format of `AGENTS.md`. A ❓ written as
   `❓ Assumed: <x>` may be built on, unless it touches money, security or an
   `## Always` rule. A 🚧 line with no story is built from existing blocks
   and primitives only; never invent a variant or a look (Design Override in
   `AGENTS.md`).
4. **Give every rule an id** - a 🚧 line or rule with no `{#id}` gets one,
   in its own commit here, before a test cites it.
5. **Tests first** - one or more tests per id, the id in the title:
   `it("grade10-site/loyalty/points#earn-once - a second completion earns nothing")`.
   Abuse, boundary and another-tab variants are more tests citing the same
   id. Committed before the code.
6. **Build** - the smallest change that passes. Where the code and an
   unmarked line disagree, fix whichever is wrong and say which in the
   commit. Never rewrite an unmarked money, security or legal rule to fit
   the code; raise a ❓ instead. A copy fix is fine.
7. **Hand over what code cannot close** - an enrolment, a credential, a
   production gate, a walk by hand: an item in the page's `Open work`
   detail, naming its blocker and who acts. A mechanism a later reader needs
   goes in the application's `docs/architecture/`, linked from `Code map`.
8. **Unmark only what is live** - the 🚧 stays until a release carries the
   line and every id on it passes; then it comes off here in its own push.
9. **Check** - `pnpm run lint`, `pnpm run typecheck`, the tests the change
   touches, `pnpm check:manual`, `pnpm pages:check`, and in the application
   `node <submodule>/scripts/pages/pages.mjs gate .`.
