---
name: writing-style
description: The house writing style for every piece of prose in this repository — manual pages, PRDs, references, proposals, governance docs, commit messages, PR bodies, replies. Use before drafting or revising any document, or when asked to review text for tone and style.
---

# Writing style

1. **Read `docs/governance/writing.md`** — the standard, short enough to
   hold whole
2. **Read the page it tells you to copy, whole** — its Copy table names
   one for a page about rules, one about an instrument and its refusals,
   one about a surface, and one reference. Your page has to look like it:
   the same shape of section, the same kinds of block, the same things
   left out. Points carries one ledger `example` per rule that moves
   points, on the case that decides it; so does yours
3. **Read the page's siblings and its index** — every page in the same
   folder. What they say about your page's topic moves onto your page;
   what your page says about theirs moves off it, leaving the outcome and
   a link. A thin page is built from what its siblings hold of it
4. **A manual page takes its blocks** from
   `docs/prds/guides/writing-the-manual.md` — reach for the block before
   the markdown it imitates, and never embed the spec
5. **A rewrite cuts as well as reshapes** — a drift warning, an engineer
   block's internals, proposal voice, and history are deleted, as the
   Placement section of `writing.md` says; a fact that belongs elsewhere is
   moved there or dropped, never kept for safety
6. **Cut before you check** — read every line against the first Placement
   rule: would the reader act differently without it? Say where each line
   that fails went — the spec, the suite, the design record, the
   architecture doc — or that it was dropped. `pnpm check:manual` warns
   (`dense`) on a page past the budget, and a page you hand over carries
   none
7. **Hand over only after the checklist** at the end of `writing.md`
   passes, every line; a draft that fails one is rewritten
8. **Reviewing text** — hold it to the same checklist, and quote the
   corrected line rather than naming the rule
