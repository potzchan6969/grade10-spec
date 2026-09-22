## Goals

- Every receipt states what was billed, what was paid before it, what this
  payment settled and what is still owed, on an invoice settled in one payment
  or in several
- A receipt id that reads from the invoice it pays, without spelling out an
  identifier operators keep to themselves

## Non-Goals

- Showing a running balance on Winner Order or in suspension copy — settled by
  `add-winner-partial-payment` and unchanged here
- Renumbering receipts already issued
- A refund, reversal or credit receipt of any kind
- The company details and tax ID a formal tax receipt may need — Finance owns
  that question
- Changing the invoice id or the bank reference, or how either is made
- Self-service partial payment, the closing tolerance, or the overpayment
  dialog — all decided by `add-winner-partial-payment`; this change only states
  what their receipts read

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | A new change, or the missing half of `add-winner-partial-payment`? | A new change, held behind it, modifying `Records the winner keeps` and retiring `winner-order-SC-112` and `SC-131` | Extending `add-winner-partial-payment`, which the round recommended: its own Q10 and Q14 already decide this breakdown, so the requirement would land with the decision that made it, and two changes could not fold the same requirement |
| Q2 | Which receipt id is real, given three forms disagree? | The PRD's form, `RC-LK7P2Q-01-P1`. **BREAKING** — it replaces `REC-202609-LK7P2Q-01-P1`, landed by `add-winner-bank-transfer` and proved by `winner-order-SC-131` | Keeping the landed `REC-` form and correcting the PRD line, which the round recommended as the no-cost option; the reference's order-anchored `REC-[YYYYMM]-[ORDER_ID]-P[n]-R[m]`, which also pulls in the revision leg Q7 rejects |
| Q3 | Does the four-line breakdown go on every receipt, or only a partial one? | Every receipt. A single full payment reads 0 previous and 0 remaining | Two rules, one for a receipt that settles an invoice outright and one for a part payment |
| Q4 | A balance on a receipt, against `add-winner-partial-payment`'s Q10 and Q13 saying the winner never sees one? | Both hold, and the reason is written down rather than implied: a receipt freezes what was owed at one payment and is the winner's proof, while a page shows a live figure and invites a self-service payment that is no longer offered | Leaving the distinction to be re-derived from two rows on another change |
| Q5 | What does Remaining Balance Due read when an operator closes inside the 10% tolerance? | 0. The line is the real outstanding balance, floored at 0 the moment the invoice is Paid — it is not Original minus Previous minus Current | Showing the unreceived shortfall, which contradicts Paid; recording the gap as a write-off line, already refused by that change's Q9 |
| Q6 | What does it read on an overpayment? | 0, the same rule. The excess is returned through the refund flow and never appears as a credit on a receipt | A negative balance, or a credit line the winner could read as money held |
| Q7 | Does a refund or reversal touch receipts already issued? | No. Receipts are append-only: none is reissued, no id takes a revision leg, and no later receipt's Previous Payments moves | The reference's `R[m]` leg, where refunding the second of three payments reissues that receipt and every receipt after it to keep the chain honest — and reopens `add-winner-refund`, which already retains receipts untouched |
| Q8 | Which total does Original Invoice Total name when an invoice is reissued? | The question does not arise: a reissue is refused once any payment is recorded, so one invoice and one total stand for the life of the collection | The reference's claim that payments survive a reissue, which leaves Original ambiguous between the invoice paid against and the one now live |
| Q9 | The exact grammar of the new id? | `RC-[LISTING_CODE]-[SEQ]-P[INDEX]`, keeping the invoice's revision | The PRD's written example `RC-LK42301P1`, stale twice: it runs the parts together and uses a 5-character listing code from before `define-public-auction-identifiers` landed `L` plus 5 |
| Q10 | Run together, the id contains the bank reference `[LISTING_CODE][SEQ]`, which a card order keeps operator-only. Accept? | No — the parts stay separated, so the id carries the same facts without printing the reference | Accepting it and dropping the operator-only rule for card; or keeping the rule in name only, as "not shown as a payment reference" |
| Q11 | The payment month leaves the id. Deliberate? | Yes. The receipt states its own payment date, and the internal gapless audit number carries the IRD trail | Keeping `YYYYMM` for a trail two other records already hold |
| Q12 | Receipts already issued under `REC-`? | They stand, unchanged. The new form starts at landing | Renumbering them, which rewrites a frozen record for consistency's sake — the same reason Q7 refuses a reissue |

## Raised

None.
