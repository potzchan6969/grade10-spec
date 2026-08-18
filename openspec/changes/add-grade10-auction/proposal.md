# Add Grade10 Auction

**Author:** @htonyl - 2026-08-17

Product context: [Grade10 Auction](../../../docs/prds/auction/auction.md).

## Why

Grade10 collectors cannot yet complete an Auction journey from a card listing
to a card-backed bid, won order, and initial fulfilment status. The Auction
MVP needs one authoritative listing and bid outcome, rather than browser-side
price decisions or payment-provider events that can race a closing auction.

## Expected outcome

- Collectors browse Grade10-authenticated auction listings and see their grade,
  condition, bid state, buyer fee, and fixed bidding schedule.
- A valid card-backed bid is accepted once, advances the highest valid bid
  atomically, and cannot be displaced by a delayed lower bid.
- A valid bid within the last 30 minutes repeatedly extends closing by 30
  minutes from that bid until a full 30-minute interval has no valid bid,
  subject to an optional listing extension cap.
- A winner pays a complete card checkout, receives a Stripe invoice after
  payment, and reads Won, Paid, Shipping Started, and Shipped states.

## Scope

- Grade10-owned auction listing catalogue across collectible-card categories,
  including a listing detail view with grading/condition and the statement
  that the card is Grade10 authenticated.
- Scheduled auction windows, starting price, bid increments, buyer-fee
  disclosure, live bid count/current bid/customer highest bid, and continuous
  30-minute late-bid extension.
- Stripe card authorization holds, verified webhook processing, release after
  outbid or an unsuccessful close, capture for a winner's payable total, and
  concurrency-safe bid acceptance.
- After winning and before payment, home-delivery information collection,
  server-calculated taxes, fixed home-delivery shipping, any required
  international customs declaration, and a complete breakdown paid through a
  saved or recent card.
- Stripe invoicing after payment, customer order reads, and authorized manual
  updates through Won, Paid, Shipping Started, and Shipped.

## Affected consumer applications and contracts

| Consumer | Change |
| --- | --- |
| `apps/frontend/grade10` | Renders the Grade10 Auction catalogue and listing detail through the existing `@grade10/auction-frontend` feature; authenticated actions use the Grade10 Store backend. |
| `apps/backend/grade10/store` | Resolves the Grade10 customer session and calls the pinned Grade10 Auction service entrypoint for authenticated bid and payment actions. |
| `apps/backend/grade10/auction` | Owns auction routes, listing/bid/order persistence, serialized bid decisions, Stripe webhooks, and reconciliation. |
| `apps/backend/grade10/api` | Routes anonymous Auction catalogue and listing reads to the Auction service. |
| `apps/admin/grade10` | Lets authorized operators manage Auction records and record manual shipping-started and shipped states without changing closed bid or payment facts. |
| `apps/backend/zzz/store` | Keeps its separately pinned shared-Auction-service entrypoint compatible with Auction contract changes. |
| `@grade10/auction-contracts` / `@grade10/auction-frontend` / `@grade10/auction-demo` | Extends existing Auction contracts, anonymous browse feature, and contract-proving demo. |
| `@grade10/stripe-contracts` / `@grade10/stripe-backend` | Extends existing server-side card authorization, release, capture, invoice, and verified-webhook outcomes needed by Auction. |

No shared UI or design-system export change is proposed. Product-specific
Auction components remain application-owned.

## Non-goals

- Auction Buy Now, cart, fixed-price inventory, stock counts, or a Buy Now
  catalogue entry.
- Keyword/search history, filters, favourites, recent sales, related listings,
  upcoming-auction previews, and listing notifications.
- Auto-bidding, outbid notifications, age declarations, one-time extensions,
  or extended-bidding emails.
- Vault selection, global-shipping coverage, tracking, order notifications,
  wire transfer, ACH, customer auto-pay-window edits, and manual invoices
  before payment.
- Buyer-premium research or a fixed buyer-premium percentage; the applicable
  fee is drawn from the existing operational policy snapshot.

## Compatibility and migration

This is additive. It introduces Grade10-owned Auction listings, bids,
authorizations, payment attempts, immutable policy snapshots, and orders; it
does not reinterpret Store or historical records. Every money value is an
integer number of minor units with an ISO 4217 currency code. A deployment
needs separate environment-scoped Stripe credentials, webhook secret, card
payment configuration, and a proven authorization/capture capability. Missing
configuration fails the affected operation explicitly and never falls back to
fixture payment data.

## Measurement

| Signal | Definition | Owner |
| --- | --- | --- |
| Completed-auction payment rate | Closed listings whose winner reaches paid state, divided by closed listings with a winner. | Product and finance |
| Bid integrity incidents | Accepted bid outcomes later found to conflict with the recorded close or highest valid bid. | Engineering and operations |

## Validation

- Feature tests cover listing visibility, bid increments, window boundaries,
  repeated extension, duplicate/reordered Stripe events, authorisation release,
  concurrent bids, checkout totals, payment, and permitted order transitions.
- Customer and administrator feature tests cover authorization, saved/recent
  card selection, price breakdown, and manual shipping-state updates.
- Run `openspec validate add-grade10-auction` and
  `openspec validate --specs` before implementation begins.

## Follow-on changes

- Auction Buy Now, cart, and inventory.
- Auto-bidding, notifications, saved listings, and search.
- Vault storage, delivery tracking, international shipping coverage, and
  post-sale customer-service workflows.
