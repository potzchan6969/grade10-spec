**Author:** @jeffffej0909 - 2026-09-17

## Why

A winner who needs money back asks Customer Service, and today nothing in
Grade10 can record the answer. Operations refunds by hand in the Stripe
dashboard or by bank transfer, but the order never reaches Refunded: it still
reads Processing, Shipped or Delivered, the lot's stock is not settled, and
finance has no record in Grade10 of how much went back, why, or who sent it.
The order status already has a Refunded end state, but no action leads to it.

**Metric:** share of auction refunds sent in Stripe or by bank transfer that
are recorded on their order in Grade10, with reference and proof, within one
working day. Today the share is zero, because nothing can record one.

## What Changes

- **An operator records a refund on the order.** One refund per order, on
  Processing, Shipped, Delivered or Partially Paid. The operator sends the
  money by hand, as today, and then records it. A refund that closes the
  sale reads Refunded for good. An overpayment returns only the difference
  and the order keeps its status.
- **The operator sets the amount.** It must be above zero and no more than
  the winner has paid, partial payments included. It is never fixed to the
  Order Total.
- **Each refund carries what finance needs to reconcile it:** a reason
  category and a note, the method, the Stripe or bank reference, 1 to 5
  private proof files, and the next gapless internal audit number.
- **The operator decides what happens to the lot.** It goes back to stock,
  or the winner keeps it and it stays sold.
- **Finance finds refunds from the queue and the order.** A closing refund
  filters as Refunded. An overpayment stays on the order's current status.
  The order detail and invoice log show the refund in full.
- **A new permission, `auction:refund`, held by `staff` and `admin`.**
  **BREAKING** for the rule that every money move sits behind
  `auction:settle`: operations records refunds without the finance grant.
  This was held against that challenge (`decisions.md` Q5).
- **A closing refund reads Refunded, with the amount returned, and gets no
  letter.** An overpayment keeps the order's status and shows only the
  difference. Bidder standing does not change.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-admin/auction/post-sale`: a refund action on paid and Partially
  Paid orders, with its record, the lot choice, the audit number, the queue
  filter and the order detail.
- `grade10-site/auction/order-status`: `refunded` is reached from
  `partially_paid` as well as `paid`, and is recorded rather than left
  unspecified.
- `grade10-site/auction/winner-order`: Winner Order reads Refunded for a
  refund that closes the sale, paid in full or in part, shows the amount
  returned, and keeps its invoice and receipts downloadable. An overpayment
  keeps the order's status and shows only the difference.
- `shared/auth/roles`: a new `auction:refund` permission, granted to `staff`
  and `admin`.

## Impact

- **Admin app** — a Refund action and form on the order detail, a Refunded
  filter on the queue, and the refund in the order detail and invoice log.
- **Auction service** — a refund record, the move to `refunded`, the lot's
  return to stock, a number from the audit series, private proof storage, and
  the hash-chained audit entry. No Stripe refund call: refunds after capture
  stay manual in the Stripe dashboard, as `docs/prds/platform/auction-service.md`
  already says.
- **Auth** — the new permission in the closed vocabulary and the `staff` and
  `admin` grants.
- **Site** — a closing refund shows Refunded and an inline alert below Order Total with the amount returned; a details control opens the reason, note and Refund Method with its channel plus a masked card or bank clue so the winner can recognise the refund; no stepper, Pay or address form; Order Summary stays the invoice; keeps the invoice and receipts. An overpayment keeps the order's status and shows only the difference the same way. My Auctions shows Refunded only for a closing refund. No new letter.
- **Depends on** `add-winner-partial-payment`, which brings Partially Paid.
  This change's deltas on `post-sale` and `order-status` apply after that
  change archives.

## References

- [Auction Management · Payment](../../../docs/prds/products/grade10-admin/auction/management.md#payment)
- [Auction Management · Post-Sale Queue](../../../docs/prds/products/grade10-admin/auction/management.md#post-sale-queue)
- [Auction Management · Grants](../../../docs/prds/products/grade10-admin/auction/management.md#grants)
- [Post-Bidding · Winner Order](../../../docs/prds/products/grade10-site/auction/post-bidding.md#winner-order)
- [Roles and Permissions](../../../docs/prds/products/shared/auth/roles.md)

## Follow-on changes

- Refunding a card from Grade10 through Stripe, instead of in the Stripe
  dashboard.
- More than one refund on an order, such as a goodwill amount followed by a
  return.
