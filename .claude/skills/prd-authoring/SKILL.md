---
name: prd-authoring
description: Write or change a product page under docs/prds/products - its rules, flows, examples, 🚧/❓/🎨 marks and Product decisions block. The page is the one source of truth; use whenever anyone wants a feature, a rule or a decision recorded.
---

# Product Page

The page is the product's one source of truth: engineers and agents build
from it, QA derives cases from it, designers take what it marks 🎨. Read
[Page First](../../../docs/governance/page-first.md) once.

1. **Read** - the page, its neighbours it links, its cases file under
   `docs/cases/`, and `docs/governance/writing.md` with the page it names to
   copy. Never open `openspec/` to write a page; it is frozen.
2. **Ask only what is held** - a question that changes scope or an
   irreversible product choice goes to the person, in the Clarification
   Request format of `AGENTS.md`. Anything else is written as a ❓ line and
   the work goes on.
3. **Write the rule where the reader looks** - a value in a Rules table, an
   order of events in a `:::flow`, a rule with arithmetic or dates in an
   `:::example`. A number carries its worked value: **$139** at **1.2×** =
   **15**.
4. **Mark** - 🚧 on each decided outcome not yet running, one line per
   outcome; ❓ on what nobody has decided; 🎨 on a screen or state with no
   story or Figma frame. An unmarked line runs today.
5. **Give each new example an id** - `id="refund-shipping"`, kebab-case,
   unique on the page. Tests and the cases file cite it.
6. **Record the decision** - a row in the `Product decisions` block for
   every choice a reader would otherwise reopen, with its date.
7. **Cut** - would the reader act differently without the line? A mechanism
   goes to the application's architecture doc, linked from `Code map`. A case
   that only proves a rule goes to the cases file.
8. **Check** - `pnpm check:manual` and `pnpm pages:check`, then
   `pnpm pages:board <page>` to see the marks as the team will.

One product decision per push. The commit names the page and the decision.
