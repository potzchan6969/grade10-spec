**Author:** @jeffffej0909 - 2026-09-22

## Why

A receipt tells a winner what one payment settled, and today it can only tell
the truth about an invoice paid in one go. Its breakdown is written with two
constants — `Previous Payments | 0` and `Remaining Balance Due | 0`.
`add-winner-partial-payment` collects an invoice in parts and never touched
them, so the moment it archives the feature set promises a breakdown no
requirement writes.

The receipt is the only place a partially paying winner learns what is left,
because Winner Order deliberately shows no running balance. A receipt that
reads 0 remaining on an invoice with money still owed is the wrong number in
the one document the winner keeps.

**Metric:** share of receipts whose Remaining Balance Due matches the invoice's
real outstanding amount at the moment of payment, replacing today's rule, which
can only be right when the invoice took a single full payment.

## What Changes

- **Every receipt carries the same four lines** — Original Invoice Total,
  Previous Payments, Current Payment Received, Remaining Balance Due — whether
  the invoice took one payment or several. A single full payment reads 0
  previous and 0 remaining, as it does today.
- **Remaining Balance Due is the real balance, floored at 0 once the invoice is
  Paid.** It is not Original minus Previous minus Current: where an operator
  closes inside the 10% tolerance, money is still unreceived and the line reads
  0 with no shortfall or write-off. An overpayment reads 0 too, never a credit.
- **Original Invoice Total is the total of the invoice the payment was made
  against**, and cannot move. No invoice is reissued once a payment exists
  against it, so there is only ever one total to name.
- **A receipt is never reissued.** A refund or reversal leaves every receipt
  already issued exactly as it was and moves no later receipt's Previous
  Payments.

## Non-Goals

See [Non-Goals](decisions.md#non-goals). The receipt and invoice id formats are
the first of them: this change writes what a receipt says, not what it is
called.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order`: the payment breakdown on every receipt;
  Remaining Balance Due floored at 0 once Paid; Original Invoice Total fixed to
  the invoice paid against; receipts never reissued.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/frontend/grade10` | Receipt content only; no id, layout or route change. |
| `apps/admin/grade10` | None. |
| Auction service | The breakdown is computed from the invoice's payment ledger rather than written as constants; receipt id generation is untouched. |
| Notification service | None — the payment-received letter carries the receipt it already carries. |
| `@grade10/ui`, `@grade10/design-system`, `@grade10/i18n` | No export or token change proposed. New receipt-line copy is catalog work for the engineer. |

## Ordering and dependencies

Held behind `add-winner-partial-payment`. That change decides the breakdown
(Q10) and the one-receipt-per-payment delivery (Q14) without writing either
into a requirement; this one writes them. Opening against `main` before it
archives would have the two changes folding the same requirement, and whichever
archived second would revert the other.

## Open questions

- **Which receipt id is real.** The page reads `RC-LK42301P1`; Grade10 issues
  `REC-202609-LK7P2Q-01-P1`, landed by `add-winner-bank-transfer` and proved by
  `winner-order-SC-131`. The two do not agree, and taking the page's form is
  breaking. Deliberately out of this change, and no change carries it: it is a
  ❓ row on
  [Post-Bidding · Paying](../../../docs/prds/products/grade10-site/auction/post-bidding.md#paying)
  for Product to open.
- **Whether a receipt must carry Grade10's company details and tax ID.** Finance
  owns it; also a ❓ row on that page. Neither holds this change.

## References

- [Post-Bidding · Paying](../../../docs/prds/products/grade10-site/auction/post-bidding.md#paying)
- [Post-Bidding · Edge Cases](../../../docs/prds/products/grade10-site/auction/post-bidding.md#edge-cases)
- [Grade10 Invoicing Identifiers](../../../docs/references/grade10-invoicing-identifiers.md) — the owner's
  source for the four breakdown lines. Two of its statements the store does not
  follow: there is no `R[m]` revision leg, because a receipt is never reissued;
  and payments do not survive a reissue, because a reissue is refused once money
  is recorded. Its receipt id shape is the open question above.
