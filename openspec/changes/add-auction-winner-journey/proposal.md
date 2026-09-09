**Author:** @jeffffej0909 - 2026-09-03

Product context: [Grade10 Auction](../../../docs/prds/products/grade10-site/auction/index.md).

## Why

A collector who wins a Grade10 lot cannot pay for it. Bidding is specified
end to end — a maximum, a card authorization, an extension rule, a winner at
close — and then the product stops. There is no invoice, no way to tell
Grade10 where to ship, no deadline, and no consequence for walking away.

The evidence is in the specs themselves:

- `grade10-site/auction/auction` holds **"Card-backed bids have one
  releasable authorization per bidder and listing"** — releasable, never
  capturable. The bid-time hold verifies a bidder; it was never a settlement
  instrument, and nothing else in the store settles.
- The active `add-auction-bid-card-authorization` change gives a listing one
  authorization for the committed maximum, cancels it when the bidder is
  outbid, and explicitly excludes capturing a winner's payment, checkout,
  delivery, invoicing, orders, and fulfilment. This change starts after that
  authorization lifecycle.
- The durable `grade10-site/auction/account-record` capability currently
  projects `Awaiting payment`, `Payment problem`, `Paid`, `Shipped`, and
  `Delivered` for a winner. Those labels do not cover the new auction-order
  derivation, which also distinguishes `Pending Payment`, `Expired`,
  `Processing`, `Cancelled`, and `Refunded`.
- The active `add-auction-notifications` change owns the six before-and-during
  auction messages and currently excludes mail about winning, paying,
  invoicing, or shipping. The ten post-close letters remain isolated in the
  sibling `grade10-site/auction/notifications-order` capability.

So the aftermath of every Grade10 auction is a phone call. An operator learns
the winner's address by asking, takes the money by whatever means, and records
it by hand — and a winner who simply stops answering costs the lot, the
consignor's price, and the operator's week, with no rule that ends it.

**Metric:** completed-auction payment rate — closed lots whose winner reaches
paid, over closed lots with a winner. **Second signal:** the share of those
that reach paid inside the 7-day deadline with no operator action, which is
what separates a working self-service journey from a faster phone call.

## What Changes

- **A won lot becomes an invoice at close.** One invoice and one auction
  order per lot, issued immediately, priced from the account's default
  shipping address when one exists, with shipping, insurance and tax
  **labelled as estimates** until the delivery address is confirmed.
- **The bid-time hold is released, never captured.** The final amount is a
  single fresh charge. Releasing an already-expired hold is a no-op, not an
  error.
- **The platform keeps an account-wide address book.** A winner can manage
  multiple named shipping addresses, choose a default, and select any saved
  address for an order. The selected order snapshot locks at payment.
- **The winner confirms or amends a delivery address** before payment
  completes. Amending recalculates and reissues at a revised total, shown as a
  delta. The address locks at payment.
- **A 7-day deadline runs from lot close** and does not move with a winner's
  address amendment, payment attempt, or inaction. An operator reissue creates
  a new deadline for the reissued invoice. Reminders run at day 3, day 6 and
  day 7 of the current invoice deadline.
- **Order status becomes derived, never stored.** Two writable primitives —
  invoice status and fulfilment status — plus two time-and-event conditions
  resolve one buyer-facing label through an ordered rule chain. Dispatch
  before payment is refused at write time, not by warehouse procedure.
- **Missing the deadline suspends the account from auction activity** —
  bidding stops, paying does not, and the store and loyalty are untouched.
  Every standing maximum on a lot that has not closed is retracted and the lot
  re-resolves to the next bidder at their own price.
- **Reinstatement is a manual ops act.** Neither paying nor a reissued invoice
  lifts a suspension.
- **An operator resolves an expired order** by reissuing the invoice, settling
  it manually, or cancelling it — and a cancelled lot returns to available
  with no runner-up offer. Reissue is uncapped and fully logged.
- **Manual settlement is available before expiry too**, so a winner paying by
  wire does not have to default first. The admin confirms the address and
  recalculates before committing, and the payment record carries the revised
  amount with a pointer to the invoice it supersedes.
- **Every status change is an append-only log entry.** The admin panel shows
  the invoice log and the fulfilment log — including failed payment attempts
  and a full address snapshot per entry — not just current state.
- **Ten post-close letters**, per order, identifying their lot.

This change **supersedes the archived `add-auction-payment-fulfillment`**
implementation. That change shipped and its 32 tasks are checked off in the
archive, but it records the opposite money model: automatic capture of the
bid-time hold, a stored per-listing outcome, and `Awaiting wire`. The shipped
operator surface is therefore a predecessor to migrate, not evidence that this
winner journey is complete. The split payment and shipment grants, operator
queue, and operational history remain the useful boundary; the winner journey
and its derived order status own the replacement behaviour.

## Non-Goals

- **Vault or deferred fulfilment**, payment plans, instalments, lending.
- **Partial payment, split settlement, or a post-payment shipping
  adjustment.** The address locks at payment and the amount is fixed there; a
  later discrepancy is absorbed operationally. `refunded` exists in the model
  so refunds need no restructuring, and refund mechanics are not specified.
- **Consolidated multi-lot invoicing and combined shipping.** A winner of
  three lots gets three invoices, three deadlines, three shipments.
- **A runner-up offer on non-payment.** Explicitly rejected: the second
  bidder acquires no right to a cancelled lot.
- **Buyer-initiated returns and disputes.**
- **Loyalty.** Auction workflows neither accrue nor consume loyalty points.
  Points grants, redemptions, holds, and reversals are not part of a win,
  payment, expiry, cancellation, or suspension.
- **A shipping-rate, insurance or tax quoting capability.** Requirements name
  the components of the final amount and require recalculation on an address
  change; the rate source is an external dependency, and no rate or tax regime
  is asserted.
- **A buyer's premium rate.** Deferred on the auction index; the invoice
  carries the applicable fee without this change fixing it.
- **A `shared/ui/*` export contract for the winner's surface.** No component
  export is proposed here. The surface composes from primitives and blocks
  that already exist; a block contract, if one is wanted, is its own change.
- **ZZZ.** `zzz-site` ships no auction and gains none here.
- **Changing how a lot is won** — no bidding, increment, extension or
  auto-bidding rule changes, except the one carve-out for retraction on
  suspension.

## Capabilities

### New Capabilities

- `grade10-site/auction/winner-order`: what a winner is issued at lot close
  and what they do with it — the one-invoice-per-lot rule, estimate-first
  pricing from the account-wide address book, multiple saved shipping
  addresses, delivery-address confirmation and amendment, recalculation and
  reissue, hold release and single-charge settlement, the 7-day deadline and
  its reminders, and the receipt, tracker and delivery proof the order keeps.
- `grade10-site/auction/order-status`: the auction order's two writable
  primitives, the supplementary conditions, the ordered derivation that
  resolves one buyer-facing status, the combinations refused at write time,
  and the permitted transitions. Deliberately not merged with, aliased to, or
  mapped onto `grade10-site/store/order-status`; a shared label name implies
  no shared meaning.
- `grade10-site/auction/bidder-suspension`: the auction-scoped suspension a
  missed deadline triggers — what it stops and what it must not stop, what
  happens to standing bids, why neither payment nor a reissue lifts it, and
  what an account record shows. Distinct from the platform ban in
  `shared/auth/users`, which stops sign-in and is stated there to be no
  concern of auction's.
- `grade10-site/auction/notifications-order`: the ten letters a winner
  receives after a close, what each fires on, what stops a reminder, and their
  idempotency. This remains separate from `grade10-site/auction/notifications`,
  which owns before-and-during auction mail.
- `grade10-admin/auction/post-sale`: the operator's queue and order detail —
  expired-order resolution, uncapped reissue logging, manual settlement with
  address confirmation and recalculation, cancellation and lot reopen, the
  append-only invoice and fulfilment logs, and the split payment and
  shipment grants.

### Modified Capabilities

- `grade10-site/auction/account-record`: the durable winner projection adopts
  the derived auction-order status set, while keeping the account record
  read-only. Auto-bidding is already durable through its own committed change;
  this change only consumes its standing-maximum behavior when suspension
  retracts open-lot commitments.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/frontend/grade10` | A winner's order surface: invoice, address confirm and amend with a total delta, pay, receipt, tracker, delivery proof. |
| `apps/admin/grade10` | The Auction section becomes the post-sale queue and order detail, with invoice and fulfilment logs, and the three expired-order actions. |
| Auction service | Issues invoices at close, releases holds, charges once, holds the deadline, derives status, refuses dispatch before payment, retracts bids on suspension. |
| Auction bidding engine | Retraction and re-resolution on suspension; a `bid_retracted_suspension` event alongside the normal resolution. |
| Stripe | Hold release for winner and losers alike, a fresh charge per invoice, webhooks for confirmation. Never a capture or increment of a bid-time hold. |
| Primary warehouse (3PL) and carrier | Dispatch feed with tracking, and a carrier delivery confirmation carrying proof. Neither exists today. |
| Shipping-rate service | Address-based recalculation, callable from the buyer flow and admin settlement alike. Does not exist today. |
| Notification service | Ten post-close transactional letters with idempotency and reminder cancellation, isolated in `notifications-order`. |
| Shared RBAC vocabulary | Payment-processing and shipment-processing stay distinct grants, carried over from the superseded change. |
| `@grade10/ui`, `@grade10/design-system`, `@grade10/i18n` | **No change.** No export, token, or catalog key is proposed. |

**Ordering and required amendments.**

- `add-auction-payment-fulfillment` — **retain as the shipped predecessor.**
  Its checked-off task record and archive remain historical evidence. Its
  automatic-capture, `Awaiting wire`, and stored-outcome rules do not satisfy
  this change and require migration before the winner journey can archive.
- `add-account-auction-record` — this capability is now durable. Its
  **"A winner reads their own payment and shipment state"** requirement is
  modified here so the account record projects the auction-order status set
  rather than retaining a second winner vocabulary.
- `add-auction-bid-card-authorization` — no conflict. It cancels an
  authorization when a bidder is outbid; this change releases the winner's at
  close. Both are releases, never captures.
- `add-auction-notifications` — no conflict. Its `notifications` capability
  remains the home for before-and-during auction mail; the post-close letters
  stay isolated in `notifications-order`.
- `add-auction-auto-bidding` — already committed and durable. No modified
  auto-bidding delta is carried here.

## Measurement

| Signal | Definition | Owner |
| --- | --- | --- |
| Completed-auction payment rate | Closed lots whose winner reaches paid, over closed lots with a winner. | Product and finance |
| Self-service settlement rate | Of those, the share paid inside the deadline with no operator action. | Product |
| Expiry rate | Lots reaching Expired, over closed lots with a winner. | Operations |
| Reissue concentration | Reissues per expired order, and per buyer across all orders. Observes the uncapped MVP policy. | Operations |

## Open questions

| # | Question | Who settles it |
| --- | --- | --- |
| ❓1 | Tax — which jurisdictions, rates, exemptions, and calculation rules apply to auction orders. This change only preserves an optional tax line or estimate and does not calculate tax. | A separate tax change owned by Finance |

## Notes for promotion

- **The capability split is fixed here.** Five new capabilities and one
  modified capability are carried in six spec files; auto-bidding and
  before-and-during auction notifications remain owned by their committed
  changes.
- **This change sits at the journey budget.** Five user journeys across six
  spec files is the maximum a single change carries. A planner who wants a
  sixth should split it — the natural seam is the operator side
  (`grade10-admin/auction/post-sale`) from the winner side.
- **Two dependencies do not exist yet** — the carrier and 3PL feeds, and the
  shipping-rate service. Both are named in requirements and neither is
  specified here; sequencing them is delivery planning.
