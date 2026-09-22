## Goals

- Every receipt states what was billed, what was paid before it, what this
  payment settled and what is still owed, on an invoice settled in one payment
  or in several

## Non-Goals

- The receipt and invoice id formats — raised in the interview, pulled back out,
  and left unresolved as a ❓ on the page
- Showing a running balance on Winner Order or in suspension copy — settled by
  `add-winner-partial-payment` and unchanged here
- A refund, reversal or credit receipt of any kind
- The company details and tax ID a formal tax receipt may need — Finance owns
  that question
- Self-service partial payment, the closing tolerance, or the overpayment
  dialog — all decided by `add-winner-partial-payment`; this change only states
  what their receipts read

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | A new change, or the missing half of `add-winner-partial-payment`? | A new change, held behind it, modifying `Records the winner keeps` | Extending `add-winner-partial-payment`, which the round recommended: its own Q10 and Q14 already decide this breakdown, so the requirement would land with the decision that made it, and two changes could not fold the same requirement |
| Q2 | Does the four-line breakdown go on every receipt, or only a partial one? | Every receipt. A single full payment reads 0 previous and 0 remaining | Two rules, one for a receipt that settles an invoice outright and one for a part payment |
| Q3 | A balance on a receipt, against `add-winner-partial-payment`'s Q10 and Q13 saying the winner never sees one? | Both hold, and the reason is written down rather than implied: a receipt freezes what was owed at one payment and is the winner's proof, while a page shows a live figure and invites a self-service payment that is no longer offered | Leaving the distinction to be re-derived from two rows on another change |
| Q4 | What does Remaining Balance Due read when an operator closes inside the 10% tolerance? | 0. The line is the real outstanding balance, floored at 0 the moment the invoice is Paid — it is not Original minus Previous minus Current | Showing the unreceived shortfall, which contradicts Paid; recording the gap as a write-off line, already refused by that change's Q9 |
| Q5 | What does it read on an overpayment? | 0, the same rule. The excess is returned through the refund flow and never appears as a credit on a receipt | A negative balance, or a credit line the winner could read as money held |
| Q6 | Does a refund or reversal touch receipts already issued? | No. Receipts are append-only: none is reissued, and no later receipt's Previous Payments moves | The reference's revision approach, where refunding the second of three payments reissues that receipt and every receipt after it to keep the chain honest — and reopens `add-winner-refund`, which already retains receipts untouched |
| Q7 | Which total does Original Invoice Total name when an invoice is reissued? | The question does not arise: a reissue is refused once any payment is recorded, so one invoice and one total stand for the life of the collection | The reference's claim that payments survive a reissue, which leaves Original ambiguous between the invoice paid against and the one now live |
| Q8 | The interview settled a new receipt id, `RC-LK7P2Q-01-P1`, replacing the `REC-` form already issuing. Does it ship here? | No — pulled out of scope on the author's word, and the whole id question with it. Nothing about a receipt's name changes; the breakdown is the change | Carrying a breaking id change alongside a content fix, which would have held a correct receipt behind a format nobody has to decide yet. The disagreement it would have settled does not go away: the page and the store still name receipts differently, now recorded as ❓ rather than silently |

## Raised

None.
