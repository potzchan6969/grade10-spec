## Context

See `proposal.md` for why. `ListingAuctionBidCard` already takes
`incrementMinor`, `currentBidMinor`, `minBidMinor`, and
`viewerMaximumMinor`. Quick-bid amounts and the typed raise floor are
computed in the shared bid-money helpers, not in each storefront.

## Decisions

1. **Chips and the typed floor are separate lookups**
   - Chips: committed max × {1, 2, 4} increment when leading; current bid ×
     {1, 2, 4} otherwise.
   - Typed floor when leading below cap: max(min next bid, max + 100 minor).
   - Alternatives rejected: using the typed floor as chip 1 (off-grid
     amounts such as $2,001 then $2,041); stepping chips from the floor
     (chip 2 becomes max + $1 + 1 increment).

2. **The increment on the view stays one snapshot**
   - The consumer already supplies one `incrementMinor`. Chips multiply that
     value; they do not re-read the currency schedule at each step.
   - Alternatives rejected: applying `nextBidAmount` per chip (crosses tiers
     and is a different product from 1× / 2× / 4×).

## Risks / Trade-offs

- [Risk] Chip 1 is above the typed minimum, so a collector may think $2,040
  is the least they can type → Mitigation: the custom field still shows min
  $2,001; chip 1 is a raise shortcut, not the floor.
