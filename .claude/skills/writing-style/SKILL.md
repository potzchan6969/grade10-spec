---
name: writing-style
description: The house writing style for every piece of prose in this repository — manual pages, PRDs, references, proposals, governance docs, commit messages, PR bodies, replies. Use before drafting or revising any document, or when asked to review text for tone and style.
---

# Writing style

Read `docs/governance/writing.md` first. It is the standard, short enough to hold whole. Its shape is `docs/references/grade10-finance.md` — a heading, then an outline — and its voice is `docs/references/grade10-loyalty-program.md`.

Before handoff, hold the draft to it:

1. The opening is two sentences at most: what the document is and what the reader leaves with, and nothing the outline then repeats. Everything after it takes the format that beats words — list, table, fenced tree, flow — and a paragraph appears only where no format carries the meaning better.
2. Items run in hierarchy first, then in time: the whole before its parts, the first thing that happens first. Every line uses the fewest words that carry its exact meaning, in the reader's words — a page says label, not eyebrow, whatever the component or the spec calls it.
3. Every item leads with its key term in bold, as a fragment with no full stop; siblings put the same thing in the same place; a step names its actor first in italics, then the action in bold, then how; a role is named by what it does and where, never an umbrella such as Staff.
4. The page holds only what it owns: nothing a child page, a sibling, or a platform page states, and nothing true of every product — a product index says what no capability page carries.
5. Order and count use numbers, everything else bullets, nested at most three deep; a flow's phases are sub-headings and its steps number straight through.
6. Numbers are bold with unit and range; hierarchy is a fenced tree with one annotation per line; an inventory reads `Name: verb, verb, verb`.
7. Every decided fact reads flat and present-tense; every open item wears ❓ at the start of its line or `TBC` after the missing value.
8. Nothing recaps the change that produced the text — no today's gap, intended fix, or success metric outside a change proposal.
9. Nothing restates a testable statement from `openspec/specs/`; the prose distills and links.
10. Superseded content is replaced, never annotated, and nothing points at "above" or "below" — it names or links the thing.

A draft that fails one of these gets rewritten, not footnoted.
