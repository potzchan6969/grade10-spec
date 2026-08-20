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
  `add-auction-payment-fulfillment` (operator payment and shipment).

## Goals

- Let collectors browse auction listings across collectible-card categories
  and understand a listing's grade, condition, and Grade10 authentication.
- Make the winner of a fair, time-bounded auction determinable even when bids
  and payment-provider events arrive concurrently.
- Keep public Auction contracts free of reserve behavior and use consistent
  listing and extension terminology.
- Let operators close out a won listing: see its outcome, reach the winner,
  record payment (Stripe or manual), and record shipment by hand, with
  payment and shipment as separate jobs.

## Non-goals

- Auction Buy Now, carts, stock counts, fixed-price checkout, search, saved
  searches, filters, favourites, related lots, and recent-sales data.
- Auto-bidding, vault storage, global shipping rate shopping, carrier
  accounts, tracking numbers, and a customer shipment-notification programme.
- Customer-facing checkout, invoices, refunds, disputes, or a second payment
  provider.
- Collecting a phone number Grade10 does not already hold.

## Users and jobs to be done

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Considering or following a card auction | See reliable listing facts, bid safely, and know whether they won. |
| Finance operator | A listing has a winner whose card capture stalled or who paid outside Stripe | Record the listing paid without being able to mark it shipped, and without rewriting who won. |
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
3. Status changes and comments share one listing trail, with Stripe-originated
   paid distinct from an operator-recorded paid.

## Requirements

Checkable requirements live in the capability specs, not here.

- Browse and bid: `openspec/changes/add-grade10-auction/specs/grade10-auction/auction/spec.md`
- Operator payment and shipment: `openspec/changes/add-auction-payment-fulfillment/specs/grade10-auction/post-sale/spec.md`

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
| Operator outcome labels | Decided | Queue labels are Draft, Scheduled, Live, Ending soon, Unsold, Canceled, Awaiting payment, Payment failed, Paid, Shipped, Delivered. "Ending soon" is the last 60 minutes of the recorded close. "Awaiting payment" / "Paid" / "Shipped" / "Delivered" are the industry terms for payment pending, payment settled, shipping started, and shipping completed. | Product |
| Payment source | Decided | Paid is either Stripe-originated capture or an operator-recorded collection. Manual paid releases an open authorization rather than capturing it, so an offline collection cannot also take the card. The first successful paid wins; neither path changes who won. | Product and finance |
| Shipment | Decided | In-house and offline: operators record started then completed. No carrier, no tracking. | Operations |
| Operator grants | Decided | Payment-processing and shipment-processing are different grants and different scoped roles (`finance` vs `staff`). `admin` holds both. Catalogue publishing is not shipment-processing. | Product |
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
- Manual paid while a card authorization is still open is a double-charge
  risk if capture is not suppressed; release-not-capture is the decision
  that closes it.
- Winner email and delivery address on the operator detail are operational
  contact, not a reason to put those values on the platform-wide audit
  hashes.
