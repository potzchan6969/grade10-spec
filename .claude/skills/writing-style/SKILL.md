---
name: writing-style
description: The house writing style for every piece of prose in this repository — manual pages, PRDs, references, proposals, governance docs, commit messages, PR bodies, replies. Use before drafting or revising any document, or when asked to review text for tone and style.
---

# Writing style

Read `docs/governance/writing.md` first. It is the standard, short enough to hold whole. Then read the exemplar nearest your task and keep it open while you draft: `docs/references/grade10-finance.md` for the shape of any document, `docs/prds/products/grade10-site/store/product-listing.md` for a capability page, `docs/references/grade10-loyalty-program.md` for the voice of a long one. A draft that would look out of place beside its exemplar is not done.

Before handoff, hold the draft to it:

1. The opening is two sentences at most: what the document is and what the reader leaves with, and nothing the outline then repeats. Everything after it takes the format that beats words — list, table, fenced tree, flow — and a paragraph appears only where no format carries the meaning better.
2. Items run in hierarchy first, then in time: the whole before its parts, the first thing that happens first. Every line uses the fewest words that carry its exact meaning, in the reader's words — a page says label, not eyebrow, whatever the component or the spec calls it.
3. Every heading and every detail block's title is a label naming what it holds — `Refunds`, `Designs`, `Data model` — never a question stub, a sentence, a leading article, or the audience the badge already names; a flow's title, phases and steps keep their own form.
4. Every item leads with its key term in bold, as a fragment with no full stop; siblings put the same thing in the same place; a step names its actor first in italics, then the action in bold, then how; a role is named by what it does and where, never an umbrella such as Staff.
5. The page answers the reader — what the surface is for, what it shows, where each thing leads, what its URL looks like — and never walks the spec's feature set or its edge cases. It holds only what it owns: nothing a child page, a sibling, or a platform page states, and nothing true of every product — a product index says what no capability page carries.
6. Order and count use numbers, everything else bullets, nested at most three deep; a flow's phases are sub-headings and its steps number straight through.
7. Numbers are bold with unit and range; hierarchy is a fenced tree with one annotation per line; an inventory reads `Name: verb, verb, verb`.
8. Every decided fact reads flat and present-tense, a planned one included — the manual describes the roadmap, so no note that a spec is still being written, and an in-flight delta that promises what the code does not do is a question for the owner, not a fact; every open item wears ❓ at the start of its line or `TBC` after the missing value.
9. Nothing recaps the change that produced the text — no today's gap, intended fix, or success metric outside a change proposal.
10. Nothing restates a testable statement from `openspec/specs/`; the prose distills and links.
11. Superseded content is replaced, never annotated, and nothing points at "above" or "below" — it names or links the thing.

12. A manual page's blocks are a contract, not a decoration: read the block
    palette in `docs/prds/guides/writing-the-manual.md` before authoring one,
    and reach for the block before the plain markdown it imitates. A worked
    case is an `example`, steps are a `flow`, depth for one audience is a
    `detail` — each is checked, so the page cannot rot when a rule changes.
    Where a block refuses the content, that is an answer about the content:
    say why it is not that block rather than falling back by hand.

A draft that fails one of these gets rewritten, not footnoted.
