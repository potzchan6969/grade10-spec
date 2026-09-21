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
| Q2/Q3 | Overpayment and shortfall tolerance? | Measured against the original invoice total, cumulative, not the remaining balance at the moment of payment: once total payments reach 90% of the invoice (e.g. $900 of $1,000), every further payment the operator records prompts them to close the invoice as Paid or leave it Partially Paid at the real remaining balance. An exact match to the full amount closes on its own with no prompt. A payment above the original total is handled by Q17. | Exact-zero-only settlement; a per-payment tolerance judged against what's currently owed (superseded by Q8's revision); auto-closing every in-tolerance payment as Paid with no choice (revised 2026-09-17 — the operator may have more coming and should not be forced to close early); a symmetric overpayment band (revised 2026-09-17 — scoped down to the underpayment side only, see Q16) |
| Q4 | Does partial payment get its own status? | Yes — `partially_paid`, entered on the first partial payment while balance > 0 | Keeping it under Pending Payment with a note |
| Q5 | Does self-service Pay stay open for the remaining balance? | No — locked to operator-only once any payment is recorded | Self-service Pay for the remainder |
| Q6 | What happens to the 7-day payment deadline once Partially Paid? | Stops for good — nothing left for it to gate, since self-service Pay is already off the table | Pausing it, as Payment Verifying does |
| Q7 | Sequencing against `add-winner-bank-transfer`? | Held — this change opens after that one archives, so its deltas apply against the landed shape | Opening now against `main` and rebasing later |
| Q8 | Does the 10% threshold apply to a single closing payment or the running total? | (b, superseding the first answer) Cumulative payments against the original invoice total: below 90% of the total, no prompt; at or above 90%, every new payment prompts the operator (revised 2026-09-17) | (a) A single payment judged only against what's left owed at the moment of that payment |
| Q9 | Is the absorbed gap from a closing payment recorded as its own line? | No — where the operator chooses to close (Q2/Q3), Paid simply means Remaining Balance Due reads $0, no separate adjustment note. Where the operator instead keeps it Partially Paid, there is no gap to absorb: the payment is recorded at its real amount and the balance carries the true remainder | Recording it as a line item on the closing receipt |
| Q10 | Does Winner Order show a live remaining balance? | No — locked state with Contact Us; each payment's receipt PDF still carries the full Previous Payments / Current Payment / Remaining Balance Due breakdown | Showing the running balance on the order |
| Q11 | Does Partially Paid get its own post-sale queue outcome, and is it needs-action? | Its own outcome, not needs-action — the operator opens it when a new payment arrives | Needs-action, nudging the operator by default |
| Q12 | Are Reissue and Cancel still offered once partially paid? | Both refused once any payment exists; the invoice's numbers stay fixed and finance resolves any wind-down by hand, off-system | Allowing Reissue to recompute the balance against a new total |
| Q13 | Does the suspension "amount still owed" copy keep showing the remaining balance? | No — dropped to stay consistent with Q10; Contact Us covers it | Keeping the one number as an exception |
| Q14 | How does the winner get each partial receipt? | Extended existing Receipt PDF row on Winner Order — one entry per payment | A new delivery channel (e.g. emailed manually) |
| Q15 | Which invoice states can take the first partial payment? | Same as manual settlement today — `pending` or `expired`, not `payment_verifying` | A stricter rule requiring reissue back to `pending` first |
| Q16 | Does every payment recorded once cumulative is at or above 90% re-trigger the prompt, or only the first one to cross the threshold? | Every one — each payment the operator records while cumulative is ≥ 90% and the invoice is not yet closed asks again, so a `keep open` answer never quietly waives later checks | Prompting only once, then recording silently until the operator closes it themselves |
| Q17 | Does the 90% cumulative rule get a matching upper bound (overpayment)? | A payment may exceed the original invoice total. Before it is recorded and the invoice is marked Paid, the operator confirms the overpayment in a dialog. The full payment remains in the payment ledger; the excess is not a separate adjustment line and can be returned through the refund flow | Refusing the payment and requiring the operator to re-enter a smaller amount; or treating the excess as a symmetric ±10% tolerance band without an explicit confirmation |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-admin/auction/post-sale` | Whether an operator may record a payment that exceeds the remaining balance | Q17 |
