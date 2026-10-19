---
name: prd-authoring
description: Write or change a product page under docs/prds/products - its rules and their ids, flows, Always and Later sections, examples, 🚧/❓ marks and Product decisions block. The page is the only spec; use whenever anyone wants a feature, a rule or a decision recorded.
---

# Product Page

The page is the product's only spec: engineers and agents build from it,
tests cite its ids, QA reads it for what it leaves out. Read
[Page First](../../../docs/governance/page-first.md) once.

1. **Read** - the page, the neighbours it links, its cases file under
   `docs/cases/`, and `docs/governance/writing.md` with the page it names to
   copy. Never open `openspec/` to write a page; it is frozen.
2. **Ask only what is held** - a question that changes scope or an
   irreversible product choice goes to the person, in the Clarification
   Request format of `AGENTS.md`. Anything else is written as a ❓ line, or
   `❓ Assumed: <x>` where the build can go on, and the work goes on.
3. **Put it where it belongs** - a value in the Rules table; a step in its
   flow's `## ` section, in the order a person meets it; a rule that holds
   whatever the flow in `## Always`; an enhancement in `## Later` with why
   it waits; arithmetic or dates in an `:::example`. A number carries its
   worked value: **$139** at **1.2×** = **15**.
4. **One home** - a fact another page already states is linked as
   `page#id`, never written again. Search the pages for it first.
5. **Id every rule a test should prove** - `{#earn-once}` at the end of its
   line, kebab-case, unique on the page. Change what a live rule promises
   and it takes a new id; a copy fix keeps it.
6. **Mark** - 🚧 on each decided outcome not yet live, one line per
   outcome; ❓ on what nobody has decided. An unmarked line runs in
   production.
7. **Record the decision** - a row in the `Product decisions` block for
   every choice a reader would otherwise reopen, with its date.
8. **Cut** - would the reader act differently without the line? A mechanism
   goes to the application's architecture doc, linked from `Code map`.
9. **Check** - `pnpm check:manual` and `pnpm pages:check`, then
   `pnpm pages:board <page>` to see the page as the team will.

One product decision per push. The commit names the page and the decision.
