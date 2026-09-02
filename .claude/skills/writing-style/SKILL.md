---
name: writing-style
description: The house writing style for every piece of prose in this repository — manual pages, PRDs, references, proposals, governance docs, commit messages, PR bodies, replies. Use before drafting or revising any document, or when asked to review text for tone and style.
---

# Writing style

Read `docs/governance/writing.md` first. It is the standard, short enough to hold whole. Its shape is `docs/references/grade10-finance.md` — a heading, then an outline — and its voice is `docs/references/grade10-loyalty-program.md`.

Before handoff, hold the draft to it:

1. The opening is two sentences at most: what the document is and what the reader leaves with. Everything after it is an outline, a table, or a fenced tree — a paragraph appears only for reasoning an outline cannot carry.
2. Every item leads with its key term in bold, as a fragment with no full stop; a step names its actor first in italics, then the action in bold, then how.
3. Order and count use numbers, everything else bullets, nested at most three deep; a flow's phases are sub-headings and its steps number straight through.
4. Numbers are bold with unit and range; hierarchy is a fenced tree with one annotation per line; an inventory reads `Name: verb, verb, verb`.
5. Every decided fact reads flat and present-tense; every open item wears ❓ at the start of its line or `TBC` after the missing value.
6. Nothing recaps the change that produced the text — no today's gap, intended fix, or success metric outside a change proposal.
7. Nothing restates a testable statement from `openspec/specs/`; the prose distills and links.
8. Superseded content is replaced, never annotated, and nothing points at "above" or "below" — it names or links the thing.

A draft that fails one of these gets rewritten, not footnoted.
