## Goals

- A winner who picks HKD reads what the lot cost in USD, line by line, and one HKD figure converted from their sum.
- The HKD Subtotal is the fixed rate applied to the USD lines' sum, to the cent, whatever the lines are.
- The winner pays a whole-HK$ Order Total.
- The invoice page, the invoice and receipt PDFs and the receipt letter show the same lines, Subtotal, fee and total as the Order Summary.
- An operator previews the figure the winner will be asked to pay.

## Non-Goals

- Changing the rate, the card fee rule, or how the card fee is grossed up; only the base it is computed on moves to the HKD Subtotal.
- Re-pricing or reissuing a sent invoice, or rewriting a stored amount.
- Changing a USD order, the rows shown before an invoice is sent, the lot card's USD winning bid, or the won-lot letter's US$ bid.
- Changing payments, partial payments, refunds or receipt balances; each reads the Order Total, which stays a whole HK$.
- A new operator layout. The quote preview reads the same breakdown and gains nothing else.
- Naming the rate anywhere beyond the Order Summary's note.
- Payment methods and rails by currency, and what Payment Settings holds.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Does this change include the pricing rule, or only the display? | The pricing too: the USD lines add up, convert once, the card fee is computed in HKD on that Subtotal, and the Order Total is Subtotal plus fee rounded up to the whole HK$ (recommended) - decided by @seankcw, 2026-10-22 | The display alone, which would read HK$1,972 for lines the rate converts to HK$1,970.35 and price the card fee on the wrong base |
| Q2 | Do the invoice page, the invoice and receipt PDFs and the order letters follow the Order Summary's layout? | Yes, in this change (recommended) - decided by @seankcw, 2026-10-22. It reverses `winner-order` "An HKD invoice, receipt and letter carry HKD only", so the proposal marks it **BREAKING**; @seankcw confirmed it with that rule named, 2026-10-22 | A later change, which would leave printed HKD lines that drift a cent from the Subtotal and two layouts for one order meanwhile |
| Q3 | How does a fraction of a cent round, in the Subtotal and a converted bank fee? | Up to the next cent (recommended) - decided by @seankcw, 2026-10-22 | Half up, which the card fee gross-up and the Order Total do not do; every other rounding here goes up |
| Q4 | Does Shipping & Handling quote in USD or the settlement currency, and where does it sit? | In USD, above the Subtotal with Insurance and Tax - decided by @seankcw from the pricing sheet, 2026-10-22 | The settlement currency below the Subtotal, which would convert one line on its own and leave the note's USD figure short of the lines above it |
| Q5 | Which USD figure does the conversion note name? | The USD sum of the lines above the Subtotal; no fee, card or bank, adds to it - decided by the round, from the PRD | Counting a bank fee typed in USD, as `order-summary-hkd-conversion-note` Q3 did, which would name a figure the Subtotal does not convert |
| Q6 | Where does a bank transfer fee sit? | Below the Subtotal beside the card fee row, converted at 7.85 and rounded up to the next cent - decided by the round, from the PRD | Inside the Subtotal as one more converted line, which would put an operator-typed fee in the figure the card fee grosses up |
| Q7 | Which amount reads without cents? | Only the HKD Order Total, on the Order Summary, the invoice and the receipt - decided by the round | `HK$1,991.00` on the documents beside `HK$1,991` on the page, two shapes of one figure |
| Q8 | Does the invoice or receipt name the rate? | No; the note under the Subtotal stays the one place - decided by the round, from the PRD's "Shown once" | A conversion note on the invoice, which breaks the once-only rule the PRD keeps |
| Q9 | Which letters change? | A letter that lists lines, the receipt letter, lists them as the invoice does; a letter that names only a total reads the HKD Order Total - decided by the round | Leaving every letter HKD-only, which gives the receipt letter other lines than the receipt PDF it attaches |
| Q10 | What does the operator's quote preview show under HKD? | The USD lines the operator typed, then the HKD Subtotal, fee and total, with no rate - decided by the round | Per-line HKD amounts, which are no longer priced amounts and may not add up to the Subtotal |
| Q11 | Does the printed invoice and receipt need a new drawing? | No: ui-design is waived (recommended) - decided by @seankcw, 2026-10-22. The Order Summary is drawn in the merged stories, and the PDF blocks take strings, so USD item and charge lines above HKD summary rows add no variant | Drawing the mixed-currency table first, which holds `/planning-dev` for a layout the blocks already render |
| Q12 | What does a sent invoice show if it carries whole-HK$ lines from before? | ❓ Product - recommended: it keeps its stored amounts and reads in the new layout from them | Re-pricing it, which the PRD forbids, or keeping the old HKD-only layout for it, which keeps two layouts for ever on what is likely test data |
| Q13 | How does this change sit beside `order-summary-hkd-conversion-note` and `usd-lot-currency-winner-settlement-choice`? | It lists both in `depends_on`, replaces their rules in its own deltas, and edits neither - decided by the round | Extending `order-summary-hkd-conversion-note`, whose goal of one currency on screen is what this reverses; retracting it, which erases built work and its walk; or editing `usd-lot-currency-winner-settlement-choice`'s accepted deltas |
| Q14 | What reads when a line is zero or absent? | Shipping & Handling at zero reads Free; Insurance and Tax are absent when none; the Subtotal and its note still show; a zero Payment Processing Fee reads Free below the Subtotal - decided by the round, from the PRD's invoice lines | Hiding the fee row at zero, which the Insurance tooltip row already ruled out for Payment Processing Fee |
| Q15 | Where exactly does the Order Total round? | A Subtotal plus fee that is already whole stays; any fraction rounds up, so HK$1,990.00 reads 1,990 and HK$1,990.01 reads 1,991 - decided by the round, from the PRD's Rounding row | Rounding half up at the total |
| Q16 | Which rule prices a reissue? | A reissue prices under this rule; the invoice it replaces keeps the amounts it was sent with - decided by the round, from the PRD's "Fixed once sent" | Re-pricing the replaced invoice |
| Q17 | Does a USD order change? | No. It keeps its lines, one Order Total and its USD card fee on its Subtotal, with no note; before an invoice is sent no HKD amount and no note shows - decided by the round | A Subtotal row on USD orders, which nothing asks for |
| Q18 | Does a payment, refund or tolerance check change? | No. Each reads the whole-HK$ Order Total, so a payment of the total matches to the cent - decided by the round | Reading the unrounded Subtotal plus fee, which the winner is never asked to pay |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
