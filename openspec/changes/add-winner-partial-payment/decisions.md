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
- Reissuing or cancelling an invoice once any payment has been recorded
  against it
- A live running balance shown to the winner, on Winner Order or in
  suspension copy

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Who can record a partial payment? | Operator-only, through the existing manual-settlement form extended to accept less than the full balance | A winner-facing self-service partial-pay flow |
| Q2/Q3 | When does partial collection close? | Measured against the original invoice total, cumulative, not the remaining balance at the moment of payment: every amount below that total keeps the invoice Partially Paid at the real remaining balance. An exact match closes on its own with no prompt. A payment above the original total is handled by Q17. | Closing below the original total; judging a payment only against what is currently owed; a symmetric overpayment band |
| Q4 | Does partial payment get its own status? | Yes — `partially_paid`, entered on the first partial payment while balance > 0 | Keeping it under Pending Payment with a note |
| Q5 | Does self-service Pay stay open for the remaining balance? | No — locked to operator-only once any payment is recorded | Self-service Pay for the remainder |
| Q6 | What happens to the 7-day payment deadline once Partially Paid? | Stops for good — nothing left for it to gate, since self-service Pay is already off the table | Pausing it, as Payment Verifying does |
| Q7 | Sequencing against `add-winner-bank-transfer`? | Held — this change opens after that one archives, so its deltas apply against the landed shape | Opening now against `main` and rebasing later |
| Q8 | Is closure measured on a single payment or the running total? | Cumulative payments against the original invoice total: the collection remains Partially Paid until the total is exactly met or exceeded | A single payment judged only against what's left owed at the moment of that payment |
| Q9 | Is a shortfall absorbed or recorded as its own line? | Neither: each payment is recorded at its real amount and the invoice remains Partially Paid until its full original total is met | Recording a shortfall or write-off line on the receipt |
| Q10 | Does Winner Order show a live remaining balance? | No — locked state with Contact Us; each payment's receipt PDF still carries the full Previous Payments / Current Payment / Remaining Balance Due breakdown | Showing the running balance on the order |
| Q11 | Does Partially Paid get its own post-sale queue outcome, and is it needs-action? | Its own outcome, not needs-action — the operator opens it when a new payment arrives | Needs-action, nudging the operator by default |
| Q12 | Are Reissue and Cancel still offered once partially paid? | Both refused once any payment exists; the invoice's numbers stay fixed and finance resolves any wind-down by hand, off-system | Allowing Reissue to recompute the balance against a new total |
| Q13 | Does the suspension "amount still owed" copy keep showing the remaining balance? | No — dropped to stay consistent with Q10; Contact Us covers it | Keeping the one number as an exception |
| Q14 | How does the winner get each partial receipt? | Extended existing Receipt PDF row on Winner Order — one entry per payment | A new delivery channel (e.g. emailed manually) |
| Q15 | Which invoice states can take the first partial payment? | Same as manual settlement today — `pending` or `expired`, not `payment_verifying` | A stricter rule requiring reissue back to `pending` first |
| Q16 | Does a payment below the total prompt a close decision? | No. It records as Partially Paid at the real remaining balance; only an amount above the total needs the overpayment confirmation | Prompting below the total, then recording silently until the operator closes it themselves |
| Q17 | How does overpayment work? | A payment may exceed the original invoice total. Before it is recorded and the invoice is marked Paid, the operator confirms the overpayment in a dialog. The full payment remains in the payment ledger; the excess is not a separate adjustment line and can be returned through the refund flow | Refusing the payment and requiring the operator to re-enter a smaller amount; or treating the excess as a symmetric tolerance band without an explicit confirmation |
| Q18 | Does a partial payment produce a winner notification letter? | Yes — `add-winner-contact-email` extends this change with an append-only `payment_received_partial` letter, carrying the current invoice and receipt ids and using the same ready Contact Us mailto rules | The earlier non-goal that left partial-payment receipts without a new letter kind |
| Q19 | Who retires the tolerance-close receipt wording in the durable winner-order receipt rule? | `define-public-auction-identifiers`, which owns that requirement and its receipt scenarios. This change does not edit it; the durable rule, `winner-order-SC-206` and case `US2-TC6-1` still say tolerance-close until that owner archives | Editing the durable receipt rule here, which two in-flight changes may not both modify |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-admin/auction/post-sale` | Whether an operator may record a payment that exceeds the remaining balance | Q17 |
