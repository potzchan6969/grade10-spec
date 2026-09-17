**Author:** @constancetang - 2026-09-16

## Why

A winner pays a 20% buyer's premium, but the bid panel only hinted that a fee
exists and hid the rate behind a tooltip. Collectors who bid on a phone never
see that control, and the invoice is the first place the rate appears. The
auction decision now requires the panel to state the 20% fee before they
commit.

**Metric:** share of live bid-panel sessions where the always-on buyer-fee line
names the 20% rate; expected: 100% once this change ships.

## What Changes

- **Inline buyer-fee disclosure** — under the bid action, always-on secondary
  copy states that a 20% buyer fee is added on top of the winning bid
- **No fee tooltip** — `ListingAuctionBidCardCopy` drops `buyerFeeTooltip`; the
  rate is not gated behind an info control
- **Shared catalogs and Storybook** — `auctionListing.buyerFeeHint` and bid-panel
  fixtures carry the 20% line

## Non-Goals

- Changing how the premium is computed or invoiced — owned by
  `fix-buyer-premium` / Winner Order
- Naming the per-currency minimum on the bid panel
- Redesigning the bid panel layout beyond the fee line and its CTA spacing

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/ui/auction-listing` — bid card shows the 20% buyer-fee line inline;
  copy no longer carries a buyer-fee tooltip

## Impact

- Manual pages: Auction · Premium before bidding;
  Listing Page Blocks; Auto-Bidding · Bid Panel
- `@grade10/ui` `ListingAuctionBidCard` / `BuyerFeeHint`
- `@grade10/i18n` shared `auctionListing` catalogs
- Preview bid-panel fixtures and stories
- Follows `fix-buyer-premium`, which set the rate and deferred pre-bid
  disclosure

## Follow-on changes

None.

## References

- [Listing Page Blocks · Bid Panel Fee](../../../docs/prds/products/shared/ui/auction-listing.md#bid-panel-fee)
- Active rate change: `fix-buyer-premium`
