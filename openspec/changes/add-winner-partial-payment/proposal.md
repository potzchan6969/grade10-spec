**Author:** @jeffffej0909 - 2026-09-17

**Extended by:** @tangconst - 2026-09-17 — Winner Order Partially Paid surface
from Storybook: warning Contact Us alert (no balance figure), wrapping
Receipt · P1 / P2 row, My Auctions Partially Paid Status badge; `ui-design.md`.

## Why

An auction winner today can only settle an invoice at its full amount — by
card, by bank transfer with proof, or by an operator's manual settlement.
When a winner can only send part of what they owe, an operator has no way to
record it: the money sits outside Grade10 until the operator can chase the
rest, and nothing about what was received or what remains is written down
anywhere a receipt or an audit trail can show.

**Metric:** share of partially-paid invoices whose payments are fully
recorded in Grade10 before the order reaches Processing, replacing today's
zero — no invoice can record a partial payment at all.

## What Changes

- **An operator can record a payment smaller than the balance owed.** The
  existing manual-settlement form gains this, any number of times per
  invoice; self-service card and bank-transfer-with-proof are untouched and
  stay full-amount only.
- **A new order and invoice status, Partially Paid**, entered on the first
  such payment while money is still owed. The 7-day payment deadline stops
  for good — not paused, as Payment Verifying does — because self-service Pay
  is never offered again on that invoice.
- **Once payments total 90% or more of the original invoice, every further
  payment asks the operator to close or keep going.** Measured against the
  invoice's original total, cumulative across every payment, not the balance
  left at that moment. They choose to close the invoice as Paid — no
  separate write-off entry is recorded — or leave it Partially Paid at the
  real remaining balance; the prompt returns on the next payment too. An
  exact match to the full amount closes on its own, no prompt needed. A
  payment that exceeds the original invoice total is accepted only after a
  confirmation dialog before the invoice is marked Paid; the full payment
  remains recorded and the excess is identifiable for a later refund.
- **Reissue and Cancel are refused once any payment is recorded.** The
  invoice's address, method and total stay fixed once real money has moved
  against them; an operator resolves anything that will not be paid off by
  hand, outside the system.
- **Every payment gets its own receipt.** `-P1`, `-P2` and on, each showing
  the invoice total, payments before it, this payment and the balance still
  due, per the identifier scheme in [Grade10 Invoicing
  Identifiers](../../../docs/references/grade10-invoicing-identifiers.md).
  Every receipt for the invoice lists on the same Receipt PDF row on Winner
  Order, oldest first — no new delivery channel.
- **Winner Order never shows a running balance.** A Partially Paid winner
  sees a locked page and Contact Us, on the order and in any suspension
  copy; the balance owed is operator-portal-only.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order`: Partially Paid order and invoice
  status; the 10% closing tolerance; Reissue and Cancel refused once a
  payment is recorded; per-payment receipts on the existing Receipt PDF row;
  no running balance shown, on the order or in suspension copy.
- `grade10-site/auction/order-status`: Partially Paid added to both status
  vocabularies; its moves in and out.
- `grade10-admin/auction/post-sale`: Partially Paid outcome, not
  needs-action; recording a partial payment on the manual-settlement form;
  Reissue and Cancel refused once a payment is recorded.
- `grade10-site/auction/account-record`: the winner's row shows Partially
  Paid.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/frontend/grade10` | Winner Order reads Partially Paid as a locked state with Contact Us and no balance figure; the Receipt PDF row lists one entry per payment; My Auctions shows Partially Paid. |
| `apps/admin/grade10` | The manual-settlement form accepts an amount smaller than the balance owed, repeatable; the queue's Partially Paid outcome and filter; Reissue and Cancel disabled once a payment exists. |
| Auction service | A payment ledger per invoice (amount, method, reference, proof, operator, timestamp); the 10% closing-tolerance check; the Partially Paid state and its refusal of Reissue and Cancel; a receipt generated per payment, numbered `-P1`, `-P2`, … |
| Notification service | No new letter kind. Payment reminders already stop once the invoice leaves `pending`, so Partially Paid needs no reminder change. |
| `@grade10/ui`, `@grade10/design-system`, `@grade10/i18n` | No export or token change proposed. New copy is catalog work for the engineer. |

## Ordering and dependencies

This change builds on the invoice and receipt machinery
`add-winner-bank-transfer` introduces — the `payment_verifying` status, the
one-Reissue-action shape, and the `INV-`/`REC-`/bank-reference identifier
scheme the partial-payment receipt suffix (`-P1`, `-P2`) already reserves.
It is held until that change archives, so its deltas apply against the
landed shape rather than a moving target; see `.openspec.yaml`.

## References

- [Post-Bidding · Winner Order](../../../docs/prds/products/grade10-site/auction/post-bidding.md#winner-order)
- [Post-Bidding · Edge Cases](../../../docs/prds/products/grade10-site/auction/post-bidding.md#edge-cases)
- [Auction Management · Post-Sale Queue](../../../docs/prds/products/grade10-admin/auction/management.md#post-sale-queue)
- [Auction Management · Payment](../../../docs/prds/products/grade10-admin/auction/management.md#payment)
- [Bidding · My Auctions, Watchlist and Notifications](../../../docs/prds/products/grade10-site/auction/bidding.md#my-auctions-watchlist-and-notifications)
- [Grade10 Invoicing Identifiers](../../../docs/references/grade10-invoicing-identifiers.md)
