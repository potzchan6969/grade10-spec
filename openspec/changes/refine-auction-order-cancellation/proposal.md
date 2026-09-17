**Author:** @jeffffej0909 - 2026-09-17

## Why

An operator can cancel an unpaid auction order today, but the flow ends
there. The winner opens Winner Order and sees a bare Cancelled badge with
nothing to say what happened or what to do. The operator types a free-text
reason nobody can count, confirms without being told what the cancel sets
off, and has no answer when a card payment lands after the cancel.

**Metric:** winner contacts about a cancelled order per 100 cancellations,
which should fall; and cancellations each month by reason category, which
starts at no data because free-text reasons cannot be counted.

## What Changes

- **The winner sees what happened.** Winner Order reads `Cancelled on {date}`,
  keeps the lot and the winning bid, and offers Contact Us as the only action.
  It gives no reason, as the cancellation letter already does not.
- **The operator picks a reason category.** Non-payment, Missed setup, Winner
  asked, Lot issue or Other, plus the mandatory note. The queue filters
  cancelled orders by category, which is what makes the metric countable.
- **The operator sees the consequences before confirming.** One dialog says
  the lot goes back to stock, no runner-up is offered it, the winner is
  emailed, any suspension stays, and the cancel cannot be undone.
- **The cancelled order links to its lot**, which the operator relists by
  hand.
- **A card payment that lands after the cancel is flagged.** The payment is
  recorded, the order stays Cancelled and carries a Paid after cancel flag;
  finance returns the money outside Grade10 and the operator clears the flag.

No running rule is reversed: cancel stays operator-only, terminal, and
unable to lift a suspension.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-admin/auction/post-sale`: the reason category and its queue
  filter, the confirmation dialog, the link to the lot, and the Paid after
  cancel flag with its clearing.
- `grade10-site/auction/winner-order`: the cancelled notice, with the lot,
  the winning bid and Contact Us.

## Impact

- **Admin app** — the cancel dialog, a category filter on the queue, the lot
  link and the Paid after cancel flag on the order detail.
- **Auction service** — the reason category on the cancellation record; a
  payment on a `cancelled` invoice recorded in the invoice log without moving
  the status, raising the flag; the flag's clearing with operator and reason.
- **Site** — the cancelled notice on Winner Order. No new letter.
- **Overlaps.** `add-winner-bank-transfer`, `add-winner-partial-payment` and
  `add-winner-refund` also modify the unpaid-order actions in `post-sale`.
  This change's delta applies after them, copying their text rather than
  today's durable spec. `close-overdue-address-confirmation` already cancels
  before an invoice exists and is unchanged by this.

## Open Questions

None. Every question the interview raised was settled.

## References

- [Auction Management · Payment](../../../docs/prds/products/grade10-admin/auction/management.md#payment)
- [Auction Management · Post-Sale Queue](../../../docs/prds/products/grade10-admin/auction/management.md#post-sale-queue)
- [Post-Bidding · Winner Order](../../../docs/prds/products/grade10-site/auction/post-bidding.md#winner-order)

## Follow-on changes

- Offering a cancelled lot straight into a new draft listing.
