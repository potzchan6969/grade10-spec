**Author:** @htonyl - 2026-09-15

## Why

Collectors can place bids in the standard auction configuration without a
bid-time authorization hold, but the auction specs still make that hold a
condition of accepting a bid. Track the default-off feature consistently so
future features and tests do not depend on a hold that may not exist.

**Measurement:** Share of accepted bids in the standard configuration that
complete without a bid-time authorization hold; expected: 100%.

## What Changes

- **Default bid path** — accept and resolve valid bids without a bid-time
  authorization hold in the standard configuration. The optional hold path
  applies only when enabled.
- **Auto-bidding** — keep maximum commitments and automatic responses working
  without a hold; hold authorization and its refusal states apply only when
  enabled.
- **Bid panel enrollment** — keep the existing states and authorization
  handling; after card link the collector is ready to bid, and an accepted
  first bid moves directly to `enrolled`. The backend decides whether a
  bid-time authorization is needed. Default setup and payment-method copy
  authorize the card only; they do not promise a bid-time hold. When holds
  are enabled, setup still discloses that setting a maximum authorizes a
  hold.
- **Mechanism and standing copy** — default mechanism subtext and bid-panel
  tooltips omit hold language; lost standing shows Did not win without
  card-release banner copy. Hold-matching mechanism copy applies only when
  holds are enabled.
- **Related in-flight specs** — condition the increment, winner-close,
  My Auctions, and called-off-lot hold outcomes on an authorization actually
  existing in their owning changes.
- **Auction domain suite** — cover the default accepted-bid path without a
  hold and retain the optional authorization path as a separate case.

## Non-Goals

- **Linked-card enrollment** — this change does not remove the linked-card
  requirement or change the setup flow.
- **Winner payment** — the winner still pays the invoice through its separate
  payment flow; it does not capture a bid-time authorization.
- **Optional authorization behavior** — this change does not remove the
  feature-enabled hold path or redesign its provider outcomes.
- **Implementation** — the standard deployment configuration already disables
  bid-time holds; this change aligns the product record, requirements, and
  suites with that behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/auction`: a valid bid does not depend on a hold when
  the optional authorization feature is disabled.
- `grade10-site/auction/auto-bidding`: commitments and automatic responses
  work without holds by default; hold outcomes are conditional.
- `grade10-site/auction/bid-panel-enrollment`: existing panel states remain
  unchanged; the backend-selected path moves a linked collector directly to
  ready-to-bid and moves an accepted first bid directly to `enrolled`;
  default setup and payment-method copy do not promise a bid-time hold.
- `shared/ui/auction-listing`: lost standing does not render card-release
  banner copy.

## Impact

- **Product records** — Auction, Payment Method, Auto-Bidding, and Bid Panel
  Enrollment describe the standard default; My Auctions, Lot Status, and
  Winner Order describe hold outcomes only when a hold exists.
- **In-flight changes** — update the existing deltas in
  `fix-auction-payment-hold-increment`, `revise-auction-winner-invoicing`,
  `redesign-my-auctions-table`, and `add-collector-lot-status` to avoid
  competing requirements.
- **Domain coverage** — update the auction domain suite's first-bid and
  maximum-commitment paths for the default and feature-enabled cases.
- **Implementation** — no code behavior or API changes.

## References

- [Auction · Holds](../../../docs/prds/products/grade10-site/auction/index.md#holds)
- [Listing Page Blocks · Lost Standing](../../../docs/prds/products/shared/ui/auction-listing.md#lost-standing)
- [Auto-Bidding · Bid Panel](../../../docs/prds/products/grade10-site/auction/auto-bidding.md#bid-panel)
- [Bid Panel Enrollment](../../../docs/prds/products/grade10-site/auction/bid-panel-enrollment.md)
