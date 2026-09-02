# Add Grade10 Auction

**Author:** @htonyl - 2026-08-17

Product context: [Grade10 Auction](../../../docs/prds/products/grade10-auction/index.md).

## Why

Grade10 needs a consistent, absolute Auction contract for its existing browse
surface and card-backed bids, rather than browser-side price decisions or
payment-provider events that can race a closing auction.

## Expected outcome

- The current Auction UI continues to browse listings while consuming listing
  and extension terminology.
- A valid card-backed bid is accepted once, advances the highest valid bid
  atomically, and cannot be displaced by a delayed lower bid.
- A valid bid within the last 30 minutes repeatedly extends closing by 30
  minutes from that bid until a full 30-minute interval has no valid bid,
  subject to an optional listing extension cap.

## Scope

- Grade10-owned absolute Auction listings; remove reserve configuration,
  reserve state, and reserve-based no-sale behavior.
- A public Auction-contract migration from `auction item`/`lot` to `listing`
  and from `anti-snipe` to `extension`, without changing the current UI.
- Scheduled auction windows, starting price, bid increments, buyer-fee
  disclosure, live bid count/current bid/customer highest bid, and continuous
  30-minute late-bid extension.
- Stripe bid authorizations, verified webhook processing, asynchronous release
  after outbid or an unsuccessful close, and concurrency-safe bid acceptance.

## Affected consumer applications and contracts

| Consumer | Change |
| --- | --- |
| `apps/frontend/grade10` | Preserves its current Auction UI while adopting renamed Auction contracts. |
| `apps/backend/grade10/store` | Resolves the Grade10 customer session and calls the pinned Grade10 Auction service entrypoint for bids. |
| `apps/backend/grade10/auction` | Owns listing/bid persistence, reserve removal, serialized bid decisions, Stripe webhooks, and reconciliation. |
| `apps/backend/grade10/api` | Routes anonymous Auction catalogue and listing reads to the Auction service. |
| `apps/backend/zzz/store` | Keeps its separately pinned shared-Auction-service entrypoint compatible with Auction contract changes. |
| `@grade10/auction-contracts` / `@grade10/auction-frontend` / `@grade10/auction-demo` | Extends existing Auction contracts, anonymous browse feature, and contract-proving demo. |
| `@grade10/stripe-contracts` / `@grade10/stripe-backend` | Extends existing server-side bid authorization, asynchronous release, and verified-webhook outcomes. |

No shared UI or design-system export change is proposed. Product-specific
Auction components remain application-owned.

## Non-goals

- Auction Buy Now, cart, fixed-price inventory, stock counts, or a Buy Now
  catalogue entry.
- Keyword/search history, filters, favourites, recent sales, related listings,
  upcoming-auction previews, and listing notifications.
- Auto-bidding, outbid notifications, age declarations, one-time extensions,
  or extended-bidding emails.
- Checkout, delivery, payment capture, invoices, orders, fulfilment, tracking,
  and notifications.
- Buyer-premium research or a fixed buyer-premium percentage; the applicable
  fee is drawn from the existing operational policy snapshot.

## Compatibility and migration

This changes existing Auction contract vocabulary and removes reserve behavior.
It introduces no checkout, order, fulfilment, or payment-capture workflow.
Every money value is an
integer number of minor units with an ISO 4217 currency code. A deployment
needs separate environment-scoped Stripe credentials, webhook secret, card
payment configuration, and a proven authorization/capture capability. Missing
configuration fails the affected operation explicitly and never falls back to
fixture payment data.

## Measurement

| Signal | Definition | Owner |
| --- | --- | --- |
| Bid integrity incidents | Accepted bid outcomes later found to conflict with the recorded close or highest valid bid. | Engineering and operations |

## Validation

- Feature tests cover listing visibility, bid increments, window boundaries,
  repeated capped extension, duplicate/reordered Stripe events, asynchronous
  release, concurrent bids, reserve removal, and contract terminology.
- Customer feature tests preserve the current Auction UI while adapting it to
  renamed contracts.
- Run `openspec validate add-grade10-auction` and
  `openspec validate --specs` before implementation begins.

## Follow-on changes

- Auction Buy Now, cart, and inventory.
- Auto-bidding, notifications, saved listings, and search.
- Checkout, delivery, payment capture, fulfilment, and post-sale support.
