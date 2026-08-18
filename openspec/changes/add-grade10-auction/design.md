# Design: Grade10 Auction

Capability delta: [`grade10-auction/auction`](specs/grade10-auction/auction/spec.md).
Product context: [Grade10 Auction](../../../docs/prds/auction/auction.md).

## Authority and data flow

```text
Grade10 browser -> Grade10 API -> Auction public reads
Grade10 browser -> Grade10 Store backend -> Grade10 Auction RPC
ZZZ Store backend -> ZZZ Auction RPC
Auction service -> Auction persistence: listings, bids, orders, policy snapshots
Auction service -> storefront Stripe account: authorization, release, capture, invoice
Stripe verified webhooks -> Auction service -> idempotent payment projection
Grade10 admin portal -> Auction service -> manual shipping milestones
```

The Auction service is authoritative for listing facts, bidding-window
calculation, valid bid ordering, the winning bidder, and Auction orders. Each
storefront's Stripe account is authoritative only for its card authorization,
release, capture, and invoice facts. The browser submits identifiers and a bid
amount through its storefront backend; it never decides whether a bid wins,
calculates an authoritative amount, or receives a Stripe secret.

## Listing and bidding lifecycle

A **listing** is exactly one auction lot. It holds its category, fixed card
facts, starting price, allowed increment, schedule, and an immutable snapshot
of the applicable currency, fee, region, and deadline policy. Listings are
visible in the catalogue only as Auction listings; Buy Now is not represented
by this capability.

Bid acceptance runs in a serialized listing decision. The decision reads the
current accepted bid and the recorded close; it accepts only an amount meeting
the listing's minimum next amount while bidding is open. It stores one accepted
bid record, updates current price/count/highest bidder, and applies an
extension in that same decision. A bid arriving when 30 minutes or less remain
sets close to exactly 30 minutes after its accepted timestamp. When the listing
has an extension cap, that close cannot exceed its scheduled close plus the
cap; without a cap, every eligible bid extends the close. The listing closes
only after its recorded close, so one later lower bid can neither replace an
accepted higher bid nor reopen a closed listing.

## Card authorization and settlement

Before a bid is accepted, Auction creates or raises exactly one Stripe
authorization for that bidder/listing pair. It uses the bidder's selected
saved or recent card and binds its provider reference to the bid attempt. A
bid becomes accepted only after the corresponding authorized outcome is
recorded. Replays of a request or webhook return the existing outcome.

When a higher valid bid displaces a bidder, Auction marks that bidder's listing
authorization for asynchronous release and records the provider's eventual
release outcome. If Stripe confirms a delayed authorization after the bidder is
already outbid, Auction marks it for release and does not accept the lower bid.
At close, every non-winner authorization is marked for release. After winning,
the customer provides home-delivery information before Auction calculates the
final payable amount from the winning bid, recorded fee, delivery region,
taxes, fixed shipping, and any customs-declaration facts. Auction captures only
an amount Stripe has authorized; if the original authorization cannot cover
that payable amount, checkout obtains the needed additional authorization before
capture. A successful capture marks payment paid and causes Stripe invoice
creation.

Stripe webhooks are verified over their raw body before parsing, normalized by
provider event identity, and processed idempotently. A status read and
scheduled reconciliation query Stripe by stored provider references to repair
delayed or missed events. Logs carry safe auction and provider identifiers,
never card, address, secret, or raw webhook data.

## Order and fulfilment lifecycle

Auction creates the winner's order at close. It reports `won` until payment is
confirmed, `paid` after capture, `shipping_started` when an authorized operator
begins in-house fulfilment, and `shipped` when that operator records dispatch.
Transitions are one-way and auditable. The customer can read only their own
order; authorized operators can update only manual shipping milestones. The
capability does not invent a carrier, tracking number, delivery estimate, or
delivery confirmation.

## Alternatives considered

### One authorization per submitted bid

Rejected: it creates duplicate holds, makes an outbid release ambiguous, and
increases customer-visible card holds. One current authorization per active
bidder/listing pair is easier to explain and release deterministically.

### Let Stripe webhook arrival decide bid order

Rejected: webhook delivery can be delayed or reordered. Grade10 serializes the
listing decision; Stripe confirmation proves funds, not auction precedence.

### Close at the original end time after a late bid

Rejected: it permits last-second sniping. Moving the close from each valid
late bid gives every bidder the agreed 30-minute response window.

### Treat payment as shipping

Rejected: manual fulfilment is independent from card capture. Separate states
give winners and operators an accurate, supportable status.

## Validation approach

Use Stripe fixtures behind real Auction and Stripe adapters. Exercise bid
acceptance under concurrent requests, duplicate requests, duplicate and
reordered webhook delivery, and a confirmed authorization that becomes stale
before it can land. Exercise the 30-minute boundary and repeated extension
against a controllable clock. Run Auction backend, customer frontend, and
admin feature lanes against contracts and fixtures, then the OpenSpec checks
named in the proposal.
