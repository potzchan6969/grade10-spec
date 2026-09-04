## Screens

### Grade10 lot details — bid card recent-bids header

No Figma frame was supplied. Path B: the capability spec and preview page
stories are the review source.

## Components

`ListingUserBidHistory` composes existing `@grade10/design-system` exports:

- `Link` — opens the dialog (button semantics).
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogBody` —
  modal shell; body scrolls for long histories.
- `Table`, `TableHeader`, `TableHead`, `TableBody`, `TableRow`, `TableCell` —
  bid history table.
- `Badge` — bid type column (`outline` manual, `info` automatic, `size="sm"`).
- `Text` — not required if table cells carry plain strings; use where helpful.

`ListingAuctionBidCard` gains optional `recentBidsAccessory` for composition.

## States

- **Rows present** — link visible; dialog shows table.
- **Empty rows** — block renders nothing.
- **Long history** — dialog body scrolls; header pinned.
- **Dialog open** — focus trapped; Escape and close dismiss.
