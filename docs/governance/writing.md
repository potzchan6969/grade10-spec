# House writing style

How everything here is written — a spec's prose, a PRD, a reference, a
proposal, a manual page, a governance doc, a commit message, a PR body, a
review reply. The standard is the one
`docs/references/grade10-loyalty-program.md` demonstrates: a reader learns
the product from definitions and infers the rules; nothing asks them to
reconstruct how the text came to be.

## Voice

- State decided facts flatly, in present tense. "A tier is valid 12 months
  from its activation date" — never "we will" or "the plan is to".
- Define first: say what a thing is before what it does or forbids. A rule
  the reader can infer from the definition needs no restating.
- Important things first. The opening paragraph says what the document is
  and what the reader leaves with.
- Simple words, short sentences. Write for the least-context reader who
  must act on the text, not for its author.

## Shape

- Group one concern per section; the heading names the concern in plain
  words.
- Put enumerable facts in a table — tiers, messages, statuses. Keep
  reasoning in prose; a cell that needs a paragraph belongs outside the
  table.
- Mark an open item explicitly — ❓ or TBD, on its own line. Never blur a
  decided fact to sit beside an undecided one.
- Stay self-contained: no bare section references ("see above"). Name or
  link the thing.

## One source of truth

- A testable statement lives in `openspec/specs/` and nowhere else. Every
  other document distills and links; none restates the contract or grows
  into a second source of truth.
- No proposal voice in durable text. Today's gap, the intended fix, and
  the success metric belong to a change proposal and rot the moment it
  archives.
- No changelog deltas: replace superseded content. A document reads as if
  written today; git carries the history.

## Before and after

Proposal voice, which rots:

> Today a bidder has no way to follow a lot without bidding. This change
> adds a watchlist so engagement can be measured before the first bid.

Definition voice, which stays true:

> A watch is a free, private way to follow a lot. It needs a signed-in
> account, works from any brand, and never notifies the seller.

The first paragraph describes the change and stops being true when the
change ships. The second describes the product and stays correct until the
product itself changes.

## What holds text to this page

No linter judges voice; the deterministic checks cover structure and
references only. Agents load the `writing-style` skill before drafting,
and review holds prose to this page the way it holds code to the specs.
