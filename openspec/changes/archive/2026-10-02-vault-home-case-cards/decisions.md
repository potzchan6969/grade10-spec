## Goals

- The site's vault home with cases is the block its stories render.
- Every chip word and every part a card draws has a story Storybook
  publishes.

## Non-Goals

- **Tokens, theme and primitives** - the board's softer badge and tint
  colours are grade10#702's palette; this change uses the design system's
  badges and tints as they are
- **Dates** - a day and a deadline read as `shared/dates-and-times` formats
  them; the board's weekday form waits on `shared/dates-and-times`
- **The page's title and intro** - the vault's frame stays the site's
- **The case page** - it keeps its own cards; only the ownership chip's tones
  move, because the list and the case read one chip
- **Loading and error** - the list's skeleton and its failure line stay the
  site's, as today; the empty home is already `VaultCasesEmpty`, so
  `VaultCases` draws only a list that has cases
- **A photograph count on a draft** - the list's read carries none, as
  `complete-vault-collector-flow` decided

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What becomes a store block? | The home with cases, `VaultCases`, beside `VaultCasesEmpty`; it draws its card from a file of its own and exports no second component - decided by the round | The card alone, which leaves the start action, the heading, the count and the several-items note assembled in the site; or a second export no surface renders on its own |
| Q2 | What does a card take? | The parts already worded: the item's name, the status chip, the ownership chip with its icon, the facts, the reference, the next step with its tone, the calendar line and a note, and one open callback. It knows no case status - decided by the round | A case status, which would put fourteen statuses and the standing fold inside a presentational block |
| Q3 | How does a card open its case? | The item's name is the one control, covering the card, with the board's caret and described by the reference; Open goes - decided by the round | An Open button the board does not draw |
| Q4 | Does the reference stay? | Yes, in mono at the end of the facts line, because the site names it on every card - decided by the round | Dropping it to match the board, against a settled requirement |
| Q5 | Answer by, or Answer the offer by? | `Answer by {when}`, the design record's word - decided by the round | The board's longer wording, which no record agrees to |
| Q6 | Which tones and icons do the chips take? | The board's status vocabulary on the design system's badges. Status: Not sent yet, Back with you, Declined, Cancelled and Expired `default`; Request sent, Being valued and Loan running `info`; Offer waiting for you and Ready to sign `brand`; Terms agreed, In the vault and Repaid `success`; Forfeited `error`. Whose move: With you, Waiting on you and Visit `brand` with a person, a person and a calendar; With us `info` with a vault; Due `warning` with a clock; Past due `error` with a warning; Settled and Collected `success` with a check; Closed `default` with none. A draft keeps its With you chip, which the board leaves off, because the list reads whose the item is on every card - decided by the round | New badge variants, which are primitive work; or `outline` for Waiting on you, which loses the board's emphasis until grade10#702 softens `brand` |
| Q7 | What does the calendar line read? | A booked visit, else the day the item went in, else nothing; a day the chip already names is not drawn again, so With us since and Visit carry their own day. No visit booked goes - decided by the round | No visit booked on every such card, and a day read twice |
| Q8 | Is Your cases a new word? | Yes, `vault.list.yourCases` in every shared locale; the several-items note reuses `vault.request.sent.severalItems`, and an untitled card reads `vault.case.untitledItem` as the case page does - decided by the round | A heading without words of its own, or a second copy of the note |
| Q9 | At the board's 390 px column, does the reference stay whole and does the home never scroll sideways? | Yes to both: the reference wraps as one unbroken token, because it is how a collector finds their card; held by the design review at 390 px - decided by the round | Letting the reference break or the home scroll, which hides the one fact a collector reads out |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `shared/ui/vault-case` | At the board's 390 px column, does the reference stay whole when the facts line wraps, and does nothing on the home scroll sideways? The design names the wrap and neither of these | Q9 |
