**Author:** @jeffffej0909 - 2026-09-22

## Why

A receipt tells a winner what one payment settled, and today it can only tell
the truth about an invoice paid in one go. Its breakdown is written with two
constants — `Previous Payments | 0` and `Remaining Balance Due | 0` — and its
id ends `-P1` because "an invoice takes one payment". `add-winner-partial-payment`
collects an invoice in parts and never touched either rule, so the moment it
archives the feature set says both that an invoice takes one payment and that
it takes several.

The receipt is the only place a partially paying winner learns what is left,
because Winner Order deliberately shows no running balance. A receipt that
reads 0 remaining on an invoice with money still owed is the wrong number in
the one document the winner keeps.

**BREAKING:** the receipt id changes form. `REC-202609-LK7P2Q-01-P1` becomes
`RC-LK7P2Q-01-P1`, reversing the format `add-winner-bank-transfer` landed and
`winner-order-SC-131` proves. Receipts already issued keep their ids.

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
- **The receipt id becomes `RC-[LISTING_CODE]-[SEQ]-P[INDEX]`** —
  `RC-LK7P2Q-01-P1`. `[LISTING_CODE]` and `[SEQ]` are the paid invoice's;
  `[INDEX]` counts the payments on that invoice. The payment month leaves the
  id. The parts stay separated, so the id does not spell out the bank reference
  `[LISTING_CODE][SEQ]`, which stays operator-only on a card order.
- **Receipts already issued keep the ids they were given.** The new form starts
  at landing; nothing is renumbered.
- **A receipt is never reissued.** A refund or reversal leaves every receipt
  already issued exactly as it was and moves no later receipt's Previous
  Payments. There is no revision leg on the id.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order`: the receipt breakdown on every receipt;
  Remaining Balance Due floored at 0 once Paid; Original Invoice Total fixed to
  the invoice paid against; the `RC-` receipt id, replacing `REC-`; receipts
  already issued keeping their ids; receipts never reissued.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/frontend/grade10` | The Receipt PDF row shows the new id form on receipts issued after landing and the old form on earlier ones; no layout change. |
| `apps/admin/grade10` | Operator screens that quote a receipt id read both forms. |
| Auction service | Receipt id generation moves to `RC-`; the breakdown is computed from the invoice's payment ledger rather than written as constants; no renumbering migration. |
| Notification service | The payment-received letter carries whichever id its receipt holds. |
| `@grade10/ui`, `@grade10/design-system`, `@grade10/i18n` | No export or token change proposed. New receipt-line copy is catalog work for the engineer. |

## Ordering and dependencies

Held behind `add-winner-partial-payment`. That change decides the breakdown
(Q10) and the one-receipt-per-payment delivery (Q14) without writing either
into a requirement; this one writes them. Opening against `main` before it
archives would have the two changes folding the same requirement, and whichever
archived second would revert the other.

## Open questions

- Whether a receipt must carry Grade10's company details and tax ID. Finance
  owns it; it is a ❓ row on
  [Post-Bidding · Paying](../../../docs/prds/products/grade10-site/auction/post-bidding.md#paying)
  and does not hold this change.

## References

- [Post-Bidding · Paying](../../../docs/prds/products/grade10-site/auction/post-bidding.md#paying)
- [Post-Bidding · Edge Cases](../../../docs/prds/products/grade10-site/auction/post-bidding.md#edge-cases)
- [Grade10 Invoicing Identifiers](../../../docs/references/grade10-invoicing-identifiers.md) — the owner's
  source for the four breakdown lines. Three of its statements the store does
  not follow: the receipt id is anchored to the listing, not an order ID; there
  is no `R[m]` revision leg; and payments do not survive a reissue, because a
  reissue is refused once money is recorded.
