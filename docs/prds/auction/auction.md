# Grade10 Auction

## Summary

Collectors need a trustworthy way to browse listings and bid during a scheduled
auction. Grade10 owns the catalogue and bid outcome; Stripe supplies card
authorization. Operators need a single listing queue to collect payment and
record in-house shipment after a listing is won.

## Context

- Problem: Grade10 has an Auction area but no bounded workflow for
  browsing a listing, placing a protected bid, or completing a won order.
- Evidence: the MVP scope prioritizes card auctions, their scheduled windows,
  and manual in-house fulfilment, while deferring Buy Now and customer-service
  workflows. Bidding and holds shipped first; capture and fulfilment were the
  named follow-on of `add-grade10-auction`.
- Related OpenSpec changes: `add-grade10-auction` (browse and bid),
  `add-auction-payment-fulfillment` (operator payment and shipment),
  `add-auction-auto-bidding` (auto bidding),
  `add-auction-watchlist` (watching a lot),
  `add-auction-notifications` (listing and bid-activity mail).
  Follow-on product decisions: [auto bidding](./auto-bidding.md),
  [watching a lot](./watchlist.md), [notifications](./notifications.md).

## Goals

- Let collectors browse auction listings across collectible-card categories
  and understand a listing's grade, condition, and Grade10 authentication.
- Make the winner of a fair, time-bounded auction determinable even when bids
  and payment-provider events arrive concurrently.
- Keep public Auction contracts free of reserve behavior and use consistent
  listing and extension terminology.
- Let operators close out a won listing: see its outcome, reach the winner,
  collect card capture or a wire, record payment, and record shipment by
  hand, with payment and shipment as separate jobs.

## Non-goals

- Auto-bidding is specified separately in [auto bidding](./auto-bidding.md).
- Store favourites. Auction watching is specified separately in
  [watching a lot](./watchlist.md).
- Watching is no longer a non-goal. It was previously excluded here under the
  name **favourites**; that term is retired. A collector watching listings from
  their own account is in scope and is decided in
  [`account-auction-record.md`](account-auction-record.md).
- Auction Buy Now, carts, stock counts, fixed-price checkout, search, saved
  searches, filters, related lots, and recent-sales data.
- Vault storage, global shipping rate shopping, carrier accounts, tracking
  numbers, and a customer shipment-notification programme.
- Customer-facing checkout, invoices, refunds, disputes, or a second payment
  provider.
- Collecting a phone number Grade10 does not already hold.

## Users and jobs to be done

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Considering or following a card auction | See reliable listing facts, bid safely, and know whether they won. |
| Finance operator | A listing has a winner whose card capture stalled, who will pay by wire, or who paid outside Stripe | Contact the winner when a wire is coming, record the listing paid without being able to mark it shipped, and without rewriting who won. |
| Shipment operator | A listing is paid and the card will leave in-house | Reach the winner, record shipment started then completed, without being able to record payment. |

## Experience

### Primary flow

1. A collector browses auction listings by collectible-card category and opens
   one listing.
2. The collector reviews its fixed facts, current bid, minimum next bid,
   buyer-fee disclosure, and scheduled bidding window.
3. During the window, the collector submits a card-backed bid; a valid late
   bid extends the close unless the listing's optional extension cap is reached.

### Operator flow

1. An operator opens the Auction queue and reads each listing's outcome.
2. They open a won listing, read the winner's contact, and work payment or
   shipment according to the grant they hold.
3. Status changes and comments share one listing trail. Paid via Stripe,
   Paid via Manual, and Awaiting wire are different outcomes on the queue,
   and rows waiting on an operator are highlighted.

## Requirements

Checkable requirements live in the capability specs, not here.

- Browse and bid: `openspec/changes/add-grade10-auction/specs/grade10-auction/auction/spec.md`
- Operator payment and shipment: `openspec/changes/add-auction-payment-fulfillment/specs/grade10-auction/post-sale/spec.md`
- The collector's own record of watched and bid-on listings is a separate
  decision: [`account-auction-record.md`](account-auction-record.md).

## Consuming applications and integration

| Application | How it consumes this work | Compatibility consideration |
| --- | --- | --- |
| `apps/frontend/grade10` | Renders the Grade10 Auction catalogue and listing detail using `@grade10/auction-frontend`; authenticated actions use its Store backend. | It never calls Stripe or determines bid acceptance in the browser. |
| `apps/backend/grade10/store` | Resolves the Grade10 customer session and calls the pinned Grade10 Auction service entrypoint for authenticated bid and payment actions. | It cannot act for another storefront. |
| `apps/backend/grade10/auction` | Owns listings, bid serialization, policy snapshots, payment records, shipment milestones, and verified Stripe event handling. | New records and additive public/RPC and admin routes are required. |
| `apps/backend/grade10/api` | Routes anonymous Auction catalogue and listing reads to the shared Auction service. | It remains a thin gateway and never resolves bidder identity. |
| `apps/admin/grade10` | The Auction section is the operator queue and listing detail for payment and in-house shipment. | It cannot change who won. It cannot rewrite a Stripe-originated paid as a Stripe fact; a manual paid is Grade10's own record. |
| `apps/backend/zzz/store` | Keeps its separately pinned Auction-service entrypoint compatible with shared-service contract changes. | It remains the identity and Stripe-account boundary for ZZZ customers. |
| `@grade10/auction-contracts`, `@grade10/auction-frontend`, `@grade10/auction-admin-frontend`, and `@grade10/auction-demo` | Extend the Auction contract, anonymous browse, operator queue, and contract-proving demo. | They remain provider-neutral and use integer minor-unit money plus ISO 4217 currency. |
| `@grade10/stripe-contracts` and `@grade10/stripe-backend` | Extend the existing server-side authorization, release, capture, invoice, and verified-event outcomes. | Stripe credentials and card details never enter an Auction browser contract. |

## Measurement

| Signal | Definition | Owner |
| --- | --- | --- |
| Completed-auction payment rate | Closed listings whose winner reaches paid state, divided by closed listings with a winner. | Product and finance |
| Time to ship | Elapsed time from paid to shipment started, for listings that reach shipped. | Operations |
| Bid integrity incidents | Accepted bid outcomes later found to conflict with the recorded close or highest valid bid. | Engineering and operations |

## Decisions and open questions

| Item | Status | Decision, assumption, or question | Owner |
| --- | --- | --- | --- |
| Auction unit | Decided | A **listing** is one unit of auction lot and is the sole term used by this capability, including the operator queue. | Product |
| Buy Now | Decided | Excluded from this auction MVP, including browse-only Buy Now listings. | Product |
| Hold model | Decided | One Stripe authorization hold exists per bidder per active listing; an outbid hold enters asynchronous release immediately and is later reconciled to completion. | Product |
| Extended close | Decided | A valid bid in the final 30 minutes moves the close to 30 minutes after that bid; this repeats until 30 minutes pass without a valid bid, subject to an optional listing extension cap. | Product |
| Buyer-premium rate | Deferred | Display the applicable policy-derived buyer fee; defining a fixed rate is outside this change. | Product and finance |
| Operator outcome labels | Decided | Queue labels are Draft, Scheduled, Live, Ending soon, Unsold, Canceled, Awaiting payment, Payment failed, Awaiting wire, Paid via Stripe, Paid via Manual, Shipped, Delivered. There is no single "Paid" label. "Ending soon" is the last 60 minutes of the recorded close. Payment failed, Awaiting wire, both paid outcomes, and Shipped are highlighted as waiting on an operator. | Product |
| Payment source | Decided | Card capture becomes Paid via Stripe. Operator-recorded collection (including a completed wire) becomes Paid via Manual. The first successful paid wins; neither path changes who won. Manual paid and Awaiting wire release an open authorization rather than capturing it. | Product and finance |
| Wire transfer | Decided | A winner paying by wire sits in Awaiting wire so the operator contacts them. An operator records that request in this change; a winner-initiated request on the storefront is follow-on. Collection of the wire is Paid via Manual. | Product and finance |
| Shipment | Decided | In-house and offline: operators record started then completed. No carrier, no tracking. | Operations |
| Operator grants | Decided | Payment-processing and shipment-processing are different grants and different scoped roles (`finance` vs `staff`). `admin` holds both. Catalogue publishing is not shipment-processing. | Product |
| Watching, formerly favourites | Decided | Watching a listing from the collector's own account is in scope, and the term **favourites** is retired across copy, specs, and analytics. The decision, its states, and its non-goals live in [`account-auction-record.md`](account-auction-record.md). | Product |
| Winner phone | Decided | Not collected. Email is the primary contact; a delivery address is shown when held and can be recorded offline by shipment operators. | Product |

## Rollout and risks

- Stripe authorization windows, increment behavior, and capture eligibility must
  be proved in the chosen Stripe configuration before card-backed bidding is
  enabled in production.
- Auction acceptance is a concurrency boundary: durable, serialized bid
  evaluation and idempotent provider-event handling are required before the
  customer surface launches.
- Shipping remains manual. Customer-facing copy must not claim carrier
  tracking or delivery confirmation that Grade10 does not hold.
- Manual paid or Awaiting wire while a card authorization is still open is
  a double-charge risk if capture is not suppressed; release-not-capture is
  the decision that closes it.
- Winner email and delivery address on the operator detail are operational
  contact, not a reason to put those values on the platform-wide audit
  hashes.
