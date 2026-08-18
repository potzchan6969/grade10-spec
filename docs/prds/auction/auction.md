# Grade10 Auction

## Summary

Collectors need a trustworthy way to browse listings and bid during a scheduled
auction. Grade10 owns the catalogue and bid outcome; Stripe supplies card
authorization.

## Context

- Problem: Grade10 has an Auction area but no bounded workflow for
  browsing a listing, placing a protected bid, or completing a won order.
- Evidence: the MVP scope prioritizes card auctions, their scheduled windows,
  and manual in-house fulfilment, while deferring Buy Now and customer-service
  workflows.
- Related OpenSpec change: `add-grade10-auction`.

## Goals

- Let collectors browse auction listings across collectible-card categories
  and understand a listing's grade, condition, and Grade10 authentication.
- Make the winner of a fair, time-bounded auction determinable even when bids
  and payment-provider events arrive concurrently.
- Keep public Auction contracts free of reserve behavior and use consistent
  listing and extension terminology.

## Non-goals

- Auction Buy Now, carts, stock counts, fixed-price checkout, search, saved
  searches, filters, favourites, related lots, and recent-sales data.
- Auto-bidding, checkout, payment capture, delivery, fulfilment, vault storage,
  global shipping, tracking, and notifications.

## Users and jobs to be done

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Considering or following a card auction | See reliable listing facts, bid safely, and know whether they won. |

## Experience

### Primary flow

1. A collector browses auction listings by collectible-card category and opens
   one listing.
2. The collector reviews its fixed facts, current bid, minimum next bid,
   buyer-fee disclosure, and scheduled bidding window.
3. During the window, the collector submits a card-backed bid; a valid late
   bid extends the close unless the listing's optional extension cap is reached.

## Requirements

The checkable requirements, state behavior, and integration boundary are in:

`openspec/changes/add-grade10-auction/specs/grade10-auction/auction/spec.md`

## Consuming applications and integration

| Application | How it consumes this work | Compatibility consideration |
| --- | --- | --- |
| `apps/frontend/grade10` | Renders the Grade10 Auction catalogue and listing detail using `@grade10/auction-frontend`; authenticated actions use its Store backend. | It never calls Stripe or determines bid acceptance in the browser. |
| `apps/backend/grade10/store` | Resolves the Grade10 customer session and calls the pinned Grade10 Auction service entrypoint for authenticated bid and payment actions. | It cannot act for another storefront. |
| `apps/backend/grade10/auction` | Owns listings, bid serialization, policy snapshots, orders, and verified Stripe event handling. | New records and additive public/RPC routes are required. |
| `apps/backend/grade10/api` | Routes anonymous Auction catalogue and listing reads to the shared Auction service. | It remains a thin gateway and never resolves bidder identity. |
| `apps/admin/grade10` | Lets authorized operators manage Auction records and manual shipping milestones. | It cannot alter a closed bid outcome or Stripe payment fact. |
| `apps/backend/zzz/store` | Keeps its separately pinned Auction-service entrypoint compatible with shared-service contract changes. | It remains the identity and Stripe-account boundary for ZZZ customers. |
| `@grade10/auction-contracts`, `@grade10/auction-frontend`, and `@grade10/auction-demo` | Extend the existing Auction contract, anonymous browse feature, and contract-proving demo. | They remain provider-neutral and use integer minor-unit money plus ISO 4217 currency. |
| `@grade10/stripe-contracts` and `@grade10/stripe-backend` | Extend the existing server-side authorization, release, capture, invoice, and verified-event outcomes. | Stripe credentials and card details never enter an Auction browser contract. |

## Measurement

| Signal | Definition | Owner |
| --- | --- | --- |
| Completed-auction payment rate | Closed listings whose winner reaches paid state, divided by closed listings with a winner. | Product and finance |
| Bid integrity incidents | Accepted bid outcomes later found to conflict with the recorded close or highest valid bid. | Engineering and operations |

## Decisions and open questions

| Item | Status | Decision, assumption, or question | Owner |
| --- | --- | --- | --- |
| Auction unit | Decided | A **listing** is one unit of auction lot and is the sole term used by this capability. | Product |
| Buy Now | Decided | Excluded from this auction MVP, including browse-only Buy Now listings. | Product |
| Hold model | Decided | One Stripe authorization hold exists per bidder per active listing; an outbid hold enters asynchronous release immediately and is later reconciled to completion. | Product |
| Extended close | Decided | A valid bid in the final 30 minutes moves the close to 30 minutes after that bid; this repeats until 30 minutes pass without a valid bid, subject to an optional listing extension cap. | Product |
| Buyer-premium rate | Deferred | Display the applicable policy-derived buyer fee; defining a fixed rate is outside this change. | Product and finance |

## Rollout and risks

- Stripe authorization windows, increment behavior, and capture eligibility must
  be proved in the chosen Stripe configuration before card-backed bidding is
  enabled in production.
- Auction acceptance is a concurrency boundary: durable, serialized bid
  evaluation and idempotent provider-event handling are required before the
  customer surface launches.
- Shipping remains manual. The customer order state must not claim carrier
  tracking or delivery confirmation that Grade10 does not hold.
