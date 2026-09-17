## Goals

- An operator can record a partial payment against an auction invoice and
  keep collecting until it is settled, without the winner ever touching a
  self-service partial-pay flow
- Every partial payment produces its own correct receipt, so the payment
  record and what the winner can retrieve never disagree

## Non-Goals

- Self-service partial payment by the winner — card and bank-transfer proof
  stay full-amount only
- Refunds of any kind, on a Partially Paid invoice or otherwise
- A shortfall write-off or overpayment line item recorded separately from the
  payment ledger itself
- Automatic matching of a bank statement to an invoice
- A new letter kind for a partial payment or its receipt
- Reissuing or cancelling an invoice once any payment has been recorded
  against it
- A live running balance shown to the winner, on Winner Order or in
  suspension copy

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Who can record a partial payment? | Operator-only, through the existing manual-settlement form extended to accept less than the full balance | A winner-facing self-service partial-pay flow |
| Q2/Q3 | Overpayment and shortfall tolerance? | A closing payment within ±10% of the remaining balance settles the invoice as Paid; further off is refused | Exact-zero-only settlement, or a running-total tolerance across all payments |
| Q4 | Does partial payment get its own status? | Yes — `partially_paid`, entered on the first partial payment while balance > 0 | Keeping it under Pending Payment with a note |
| Q5 | Does self-service Pay stay open for the remaining balance? | No — locked to operator-only once any payment is recorded | Self-service Pay for the remainder |
| Q6 | What happens to the 7-day payment deadline once Partially Paid? | Stops for good — nothing left for it to gate, since self-service Pay is already off the table | Pausing it, as Payment Verifying does |
| Q7 | Sequencing against `add-winner-bank-transfer`? | Held — this change opens after that one archives, so its deltas apply against the landed shape | Opening now against `main` and rebasing later |
| Q8 | Does the ±10% tolerance apply to a single closing payment or the running total? | (a) A single payment judged only against what's left owed at that moment; non-closing partial payments carry no threshold check at all | (b) A whole-invoice cap on cumulative payments |
| Q9 | Is the absorbed gap from a closing payment recorded as its own line? | No — Paid simply means Remaining Balance Due reads $0, no separate adjustment note | Recording it as a line item on the closing receipt |
| Q10 | Does Winner Order show a live remaining balance? | No — locked state with Contact Us; each payment's receipt PDF still carries the full Previous Payments / Current Payment / Remaining Balance Due breakdown | Showing the running balance on the order |
| Q11 | Does Partially Paid get its own post-sale queue outcome, and is it needs-action? | Its own outcome, not needs-action — the operator opens it when a new payment arrives | Needs-action, nudging the operator by default |
| Q12 | Are Reissue and Cancel still offered once partially paid? | Both refused once any payment exists; the invoice's numbers stay fixed and finance resolves any wind-down by hand, off-system | Allowing Reissue to recompute the balance against a new total |
| Q13 | Does the suspension "amount still owed" copy keep showing the remaining balance? | No — dropped to stay consistent with Q10; Contact Us covers it | Keeping the one number as an exception |
| Q14 | How does the winner get each partial receipt? | Extended existing Receipt PDF row on Winner Order — one entry per payment | A new delivery channel (e.g. emailed manually) |
| Q15 | Which invoice states can take the first partial payment? | Same as manual settlement today — `pending` or `expired`, not `payment_verifying` | A stricter rule requiring reissue back to `pending` first |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
