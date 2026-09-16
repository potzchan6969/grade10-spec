# UI: disclose buyer premium on bid panel

Behavior:
[shared/ui/auction-listing delta](specs/shared/ui/auction-listing/spec.md).

## Screens

### Listing bid panel — buyer fee line

- **Surface** — Storybook `Auction Listing/ListingAuctionBidCard`; Preview
  `Auction Listing/Bid Panel`
- **Capability** — `shared/ui/auction-listing`
- **Figma** — none; listing bid panel stories are the reference until frames
  exist

Always-on secondary line under the primary bid action (Confirm / Raise /
Place Bid / Link a card). Copy:

> 20% buyer fee is added on top of the winning bid

Tone: secondary foreground. CTA-to-hint stack gap: `sm`. No info tooltip beside
the line. Hidden when `bidEnrollment` is `signed-out`.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `ListingAuctionBidCard` | `@grade10/ui` | Renders `BuyerFeeHint` under bid actions |
| `BuyerFeeHint` | `@grade10/ui` | Inline `buyerFeeHint` only |

**BREAKING copy contract:** `ListingAuctionBidCardCopy` drops `buyerFeeTooltip`.

No new export, variant, or token. No new Figma component set.

**Missing / flagged for `tasks.md`**

| Missing | Kind | Where |
| --- | --- | --- |
| · | · | None — copy, spacing, and Storybook only |

## States

| State | Spec scenario | Treatment |
| --- | --- | --- |
| Signed-in open listing | `shared-ui-auction-listing-SC-44` | Fee line visible under CTA |
| Signed-out | `shared-ui-auction-listing-SC-45` | Fee line omitted |
