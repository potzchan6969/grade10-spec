**Author:** @constancetang - 2026-09-01

## Why

A signed-in collector who has bid on a lot can see public recent bids inline,
but has no way to review their own accepted maxima on that lot with amount and
time in one place. A link on the lot bid card that opens a personal bid-history
dialog closes that gap without exposing rival identity or private maximums.

## What Changes

- Add `ListingUserBidHistory`, a shared auction-listing block that renders a
  link when the consumer supplies accepted-bid rows and opens a scrollable
  dialog table (amount, time) with a note that equal maxima are ranked by
  earlier submission.
- Add an optional `recentBidsAccessory` slot on `ListingAuctionBidCard` so the
  block composes beside the public recent-bids label without coupling bid-card
  internals to user history.
- Add shared `auctionListing` copy for the dialog, priority note, and table
  headers in every supported language.
- Wire the block in the preview lot-details page and Storybook stories.

## Non-Goals

- Failed bid attempts, automatic-maximum configuration events, or rival bids.
- A manual-vs-automatic type column (every bid is a private maximum).
- Data fetching, authentication, or Auction API contracts (consumer-owned).
- Account-level `/bids` index (see `add-account-bidding-history`).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/ui/auction-listing`: export `ListingUserBidHistory` and optional
  `recentBidsAccessory` on the auction bid card.

## Impact

- `@grade10/ui`: new block and bid-card slot.
- `@grade10/i18n`: new keys in shared `auctionListing` namespace.
- `apps/preview`: lot-details page composition and stories.
- `@grade10/auction-frontend` (consumer): compose the block with lot-scoped
  accepted-bid rows when the session is signed in.
