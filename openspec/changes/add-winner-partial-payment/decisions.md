## Goals

- An operator can record a partial payment against an auction invoice and
  keep collecting until it is settled, without the winner ever touching a
  self-service partial-pay flow
- Every partial payment produces its own correct receipt, so the payment
  record and what the winner can retrieve never disagree

## Non-Goals

- Self-service partial payment by the winner — card and bank-transfer proof
  stay full-amount only
- A refund flow built here: none is added, and `complete-auction-post-sale` owns refunds, including on a Partially Paid order
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
| Q2/Q3 | Overpayment and shortfall tolerance? | Measured against the original invoice total, cumulative, not the remaining balance at the moment of payment: the payment that takes total payments from below 90% to 90% or more of the invoice (that payment included, e.g. $900 of $1,000) prompts the operator to close the invoice as Paid or leave it Partially Paid at the real remaining balance, and every later payment under 100% prompts again. Below 90% updating the invoice to Paid is refused: a $1,000 invoice must collect at least $900 before it can be closed as Paid. An exact match to the full amount closes on its own with no prompt. A payment above the original total is handled by Q17. | Exact-zero-only settlement; a per-payment tolerance judged against what's currently owed (superseded by Q8's revision); auto-closing every in-tolerance payment as Paid with no choice (revised 2026-09-17 — the operator may have more coming and should not be forced to close early); a symmetric overpayment band (revised 2026-09-17 — scoped down to the underpayment side only, see Q16) |
| Q4 | Does partial payment get its own status? | Yes — `partially_paid`, entered on the first partial payment while balance > 0 | Keeping it under Pending Payment with a note |
| Q5 | Does self-service Pay stay open for the remaining balance? | No — locked to operator-only once any payment is recorded | Self-service Pay for the remainder |
| Q6 | What happens to the 7-day payment deadline once Partially Paid? | Stops for good — nothing left for it to gate, since self-service Pay is already off the table | Pausing it, as Payment Verifying does |
| Q7 | Sequencing against `add-winner-bank-transfer`? | Held — this change opens after that one archives, so its deltas apply against the landed shape | Opening now against `main` and rebasing later |
| Q8 | Does the 10% threshold apply to a single closing payment or the running total? | (b, superseding the first answer) Cumulative payments against the original invoice total: below 90% of the total, no prompt; the payment that takes the total to 90% or more (itself included) and every later payment under 100% prompts the operator (revised 2026-09-17) | (a) A single payment judged only against what's left owed at the moment of that payment |
| Q9 | Is the absorbed gap from a closing payment recorded as its own line? | No — where the operator chooses to close (Q2/Q3), Paid simply means Remaining Balance Due reads $0, no separate adjustment note. Where the operator instead keeps it Partially Paid, there is no gap to absorb: the payment is recorded at its real amount and the balance carries the true remainder | Recording it as a line item on the closing receipt |
| Q10 | Does Winner Order show a live remaining balance? | No — locked state with Contact Us; each payment's receipt PDF still carries the full Previous Payments / Current Payment / Remaining Balance Due breakdown | Showing the running balance on the order |
| Q11 | Does Partially Paid get its own post-sale queue outcome, and is it needs-action? | Its own outcome, not needs-action — the operator opens it when a new payment arrives. `complete-auction-post-sale` modifies "The queue shows one outcome per lot" and carries it as Waiting on winner, so this change adds no queue requirement | Needs-action, nudging the operator by default |
| Q12 | Are Reissue and Cancel still offered once partially paid? | Both refused once any payment exists; the invoice's numbers stay fixed and finance resolves any wind-down by hand, off-system | Allowing Reissue to recompute the balance against a new total |
| Q13 | Does the suspension "amount still owed" copy keep showing the remaining balance? | No — dropped to stay consistent with Q10; Contact Us covers it | Keeping the one number as an exception |
| Q14 | How does the winner get each partial receipt? | Extended existing Receipt PDF row on Winner Order — one entry per payment | A new delivery channel (e.g. emailed manually) |
| Q15 | Which invoice states can take the first partial payment? | Same as manual settlement today — `pending` or `expired`, not `payment_verifying` | A stricter rule requiring reissue back to `pending` first |
| Q16 | Does every payment recorded once cumulative is at or above 90% re-trigger the prompt, or only the first one to cross the threshold? | Every one — each payment the operator records after the one that took the total to 90% or more, while the invoice is not yet closed and under 100%, asks again, so a `keep open` answer never quietly waives later checks | Prompting only once, then recording silently until the operator closes it themselves |
| Q17 | Does the 90% cumulative rule get a matching upper bound (overpayment)? | A payment may exceed the original invoice total. Before it is recorded and the invoice is marked Paid, the operator confirms the overpayment in a dialog. The full payment remains in the payment ledger; the excess is not a separate adjustment line and can be returned through the refund flow | Refusing the payment and requiring the operator to re-enter a smaller amount; or treating the excess as a symmetric ±10% tolerance band without an explicit confirmation |
| Q18 | Does a partial payment produce a winner notification letter? | Yes — `add-winner-contact-email` extends this change with an append-only `payment_received_partial` letter, carrying the current invoice and receipt ids and using the same ready Contact Us mailto rules | The earlier non-goal that left partial-payment receipts without a new letter kind |
| Q19 | Does the durable winner-order receipt rule keep its tolerance-close wording? | Yes. The planning owner keeps the agreed closing tolerance, so the durable receipt rule, `winner-order-SC-206` and case `US2-TC6-1` stay as they are and this change does not edit them. The receipt wording in `Records the winner keeps` is carried by `add-winner-order-tax-line` | Retiring the tolerance-close wording here, which would reverse the planning owner's decision |
| Q20 | What is the closing-payment tolerance, and who decided it? | The planning owner's logged decision: an operator may record any number of payments to an invoice; the first payment makes it `Partially Paid`; Winner Order always shows the full invoice amount, never a remaining due balance; every payment recorded generates a receipt; updating the invoice to `Paid` is refused while cumulative payments are below 90% of the original invoice total (a $1000 invoice must collect at least $900 before it can be closed as Paid); the payment that takes cumulative payments from below 90% to 90% or more (that payment included) offers a close, Paid with no separate write-off entry, or keep Partially Paid at the real balance, and every later payment under 100% offers it again; an exact match closes on its own and an overpayment needs confirmation; Reissue and Cancel are refused once any payment is recorded. Restores Q2/Q3, Q8, Q9, Q16 and Q17, which a reconciliation had reworded to drop the tolerance | Closing as Paid at any amount below the total, or removing the 90% rule |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-admin/auction/post-sale` | Whether an operator may record a payment that exceeds the remaining balance | Q17 |
