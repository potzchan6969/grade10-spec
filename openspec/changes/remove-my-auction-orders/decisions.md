## Goals

- There is one place a winner follows their orders: My Auctions, whose Won
  rows open each order's Winner Order page.
- `@grade10/ui` exports only the auction-order blocks a page composes.
- No spec, suite, PRD or menu names a page that does not exist.

## Non-Goals

- Restating or rebuilding the list inside My Auctions — `account-record`
  already carries the Won rows and their order entry point.
- Removing `AuctionWinnerOrder` or `AuctionAddressForm` — Winner Order and
  its setup stay.
- Building the My Auctions → list link the earlier decision deferred — there
  is no list to link.
- Touching `omit-profile-account-menu` — its `auction-orders` delta is moot
  once the capability is removed; what it does about that delta is its own.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Keep the My Auction Orders list page and its `AuctionOrderList`/`Row`/`Empty` blocks, or remove them? | Remove them — the Winner Order page is the detail of My Auctions, and a second orders list conflicts with both - decided in the interview | Keep them as-is for a planned page — the list duplicates the Won rows My Auctions already renders, nothing on the site reaches it, and its blocks present a page the product no longer wants |
| Q2 | Does a Won row keep opening the order? | Yes, unchanged - decided by the round | Repointing it anywhere else — the Winner Order page is the detail; only the spec's cross-reference moves from `auction-orders` to `winner-order` |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
