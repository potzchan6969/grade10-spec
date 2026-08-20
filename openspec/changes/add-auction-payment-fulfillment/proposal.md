**Author:** @web3-app-cursor8 - 2026-08-20

Product context: [Grade10 Auction](../../../docs/prds/auction/auction.md).

## Why

A collector who wins a listing still cannot be paid and shipped as an
operator workflow. Bidding already produces a winner and a card
authorization; the grade10 admin panel today splits that aftermath across
catalogue, settlement-retry, and fulfillment panels, hides the winner's
contact from the people who must reach them, and treats Stripe capture as
the only way a listing becomes paid. Manual in-house fulfilment was the
MVP's shipping model, and `add-grade10-auction` deferred capture and
fulfilment as a follow-on. Until operators can work one listing from live
through delivered — with payment and shipping grants split — won cards
sit unpaid or unshipped. The signal that moves is completed-auction
payment rate: closed listings whose winner reaches paid, over closed
listings with a winner.

## What Changes

- Grade10 admin gains a listing queue whose each row shows an
  operator-facing **outcome** (Live, Ending soon, Awaiting payment, Paid,
  Shipped, Delivered, and the terminal labels around them) with a distinct
  visual indicator per outcome.
- Opening a listing shows its facts, the winner with contact emphasized,
  payment and shipment state, and a time-ordered trail of status changes
  and operator comments.
- Payment can reach Paid from a verified Stripe capture **or** from an
  operator with the payment-processing grant. The trail names which
  source produced the paid state.
- Shipment is recorded by hand: started, then completed. No carrier is
  involved.
- Payment-processing and shipment-processing are distinct grants, held by
  different scoped roles. Controls the caller cannot use stay visible and
  disabled; the server refuses the same actions.

## Non-Goals

- Changing how a listing is won, who won, or any live-bid rule from
  `add-grade10-auction`.
- Customer-facing checkout, invoices, refunds, disputes, or a second
  payment provider.
- Carrier accounts, tracking numbers, shipping labels, or a customer
  shipment-notification programme.
- Buy Now, vault storage, or global shipping rate shopping.
- Redesigning catalogue editing, publishing, bidder bans, or the
  platform-wide Audit section.
- Collecting a phone number Grade10 does not already hold.

## Capabilities

### New Capabilities

- `grade10-auction/post-sale`: the operator queue, listing outcome, winner
  contact, Stripe-or-manual payment, manual shipment milestones, the
  listing trail of status changes and comments, and the split
  payment/shipment grants.

### Modified Capabilities

- None. `grade10-auction/auction` is still the in-flight bidding contract
  and explicitly excluded capture and fulfilment; this change is that
  follow-on, as its own capability.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/admin/grade10` | The Auction section becomes the post-sale queue and listing detail; payment and shipment controls follow the caller's grants. |
| Auction admin surface | Listing reads gain outcome, winner contact, payment source, shipment milestones, and a listing-scoped trail; mutations record paid (manual), shipment started, shipment completed, and comments. |
| Shared RBAC vocabulary | Payment-processing and shipment-processing are distinct grants. `staff` keeps shipment and not payment; a `finance` role gets payment and not shipment; `admin` keeps both. Catalogue floor work does not share the shipment grant. |
| Auction service | Stripe-originated capture and operator-recorded payment both produce Paid, with different trail actors. An open authorization is released, not captured, when payment is recorded manually. |
| `@grade10/auction-admin-frontend` | The queue, detail, trail, and grant-gated actions compose here; the brand admin remains presentation. |

No shared UI or design-system export change is proposed. Outcome indicators
use the primitives the admin panel already has.

## Measurement

| Signal | Definition | Owner |
| --- | --- | --- |
| Completed-auction payment rate | Closed listings whose winner reaches paid, divided by closed listings with a winner. | Product and finance |
| Time to ship | Elapsed time from Paid to Shipped, for listings that reach Shipped. | Operations |

## Validation

- Feature tests cover outcome labels, grant-gated payment and shipment
  actions (allowed, disabled, and refused), Stripe-vs-manual paid on the
  trail, release-not-capture on manual paid, shipment order, comments
  woven into the trail, and winner contact without Stripe identifiers.
- Run `openspec validate add-auction-payment-fulfillment --strict` before
  promotion.

## Follow-on changes

- Customer-facing order status, shipment mail, and a winner address
  collection flow on the storefront.
- Auto-offer to a runner-up after payment failed.
- Refunds after capture.
