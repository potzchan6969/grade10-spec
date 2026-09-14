## Screens

### Grade10 lot details — bid card recent-bids header

No Figma frame was supplied. Path B: the capability spec and preview page
stories are the review source.

## Components

`ListingUserBidHistory` composes existing `@grade10/design-system` exports:

- `Link` — opens the dialog (button semantics).
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`,
  `DialogBody` — modal shell; body holds the priority note and a scrolling table.
- `Table`, `TableHeader`, `TableHead`, `TableBody`, `TableRow`, `TableCell` —
  bid history table (amount and time only).

`ListingAuctionBidCard` gains optional `recentBidsAccessory` for composition.

## States

- **Rows present** — link visible; dialog shows priority note and table.
- **Empty rows** — block renders nothing.
- **Long history** — dialog body scrolls; header and priority note pinned.
- **Dialog open** — focus trapped; Escape and close dismiss.
