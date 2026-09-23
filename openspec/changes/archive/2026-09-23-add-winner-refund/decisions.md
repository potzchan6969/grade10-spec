## Goals

- A winner whose sale was closed by a refund sees it as Refunded on Winner Order, with the amount returned
- A winner who overpaid sees only the difference returned, and the order keeps its status
- A winner whose refund went by bank transfer sees the operator's reference beside Amount and Transfer to, so they can match the credit on their statement
- An operator records a refund, sent by hand, on the auction order it belongs to. A closing refund reads Refunded. An overpayment does not
- Finance can reconcile every auction refund from Grade10: amount, reason, method, reference, proof, audit number, who recorded it and when
- The lot's stock follows the refund: back to stock, or kept by the winner

## Non-Goals

- Refunding money from Grade10 itself, through the Stripe refund API or a bank connection
- A refund request, approval step or pending state in Grade10; the winner's request stays with Customer Service
- More than one refund on an order, or undoing a refund once recorded
- A refund letter. The page shows the amount and, for a bank transfer, its reference; proof, the Stripe reference and the audit number stay with the operator
- Any effect on the winner's bidder standing or suspension
- A refund export or report beyond the queue filter and the order detail
- A separate return step recorded after the refund
- Refunds on store (Shopify) orders, which stay in [Refunds](/p/grade10-site/store/refunds)

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does a refund cover? | One refund per order that ends it as Refunded (revised by Q9) | Separate full and partial refunds, with the order keeping its status after a partial one |
| Q2 | Who does what? | Operations records the refund on its own, with no finance step (see Q5 for the grant) | Operations requests and finance approves: two people, but a new request state |
| Q3 | How does the money go back? | Sent by hand in the Stripe dashboard or by bank transfer, then recorded in Grade10 (recommended) | Card refunds through the Stripe API, which would reverse the v1 rule that refunds after capture are manual |
| Q4 | What happens to the lot? | Depends on whether the card comes back (recommended); settled at refund by Q14 | Always back to stock, which is wrong when the winner keeps the card; never touched |
| Q5 | Challenge: operations recording refunds reverses the rule that money moves need `auction:settle`. Keep it? | A new permission, `auction:refund`, apart from `auction:settle` (held) | Recording under `auction:settle`, so finance is involved in every money move. Dropped: operations must refund without the finance grant |
| Q6 | Which orders, and for how much? | Processing, Shipped, Delivered and Partially Paid. The amount is set by the operator | Always the full Order Total, or the total less the processing fee |
| Q7 | What does the winner receive? | No letter. A closing refund reads Refunded; an inline alert shows the amount, and a dialog stacks Amount, Transfer to, Reference (bank only), Reason and Note when one was recorded, as settled in Q19–Q21 and Q28 | A refund letter with the amount and method (recommended, declined) |
| Q9 | A free amount conflicts with "full refund only". How do they fit? | One refund, amount above zero and at most what was paid. An overpayment returns only the difference and the order keeps its status. Any other refund ends the order as Refunded, and a second refund is refused | Every refund, including an overpayment, ends the order as Refunded. Several refunds per order, reading Refunded only once everything is back |
| Q10 | Does a refund carry a reference number? | Yes, the next number in the gapless internal audit series, seen by operators only (recommended) | Matching by order and provider reference alone |
| Q11 | What must the operator enter? | Reason category (Damaged, Not as described, Not received, Duplicate or overpayment, Other) and a note, the method, the Stripe or bank reference, and 1 to 5 proof files | Proof files optional |
| Q12 | How does finance find refunds? | A Refunded filter for a closing refund. Every refund, including an overpayment, is on the order detail and invoice log | A refund CSV export for a date range |
| Q13 | Is the winner's request recorded in Grade10? | No; Customer Service handles it in its own channel, and the refund note says what was asked (recommended) | A "Refund requested" mark before the refund, which adds a state to the status chain |
| Q14 | How does the lot go back to stock? | The operator chooses when recording: back to stock, or the winner keeps it; the choice is fixed with the refund (recommended) | A separate "Mark returned" step later |
| Q15 | Can a Shipped order be refunded? | Yes; the shipment record stays as it is (recommended) | Refused until Delivered |
| Q16 | Does a refund affect bidder standing? | No (recommended) | Some reasons count as a strike |
| Q17 | Which roles hold `auction:refund`? | `staff` and `admin`; `finance` reads refunds but cannot record one (recommended) | `finance` as well; nobody by default |
| Q18 | What does Winner Order show for a refunded order? | A Refunded badge beside the title, however much was paid and wherever the card is; no stepper, Pay or address form; the invoice and receipts already issued stay downloadable; Order Summary stays the invoice total alone (revised by Q19) | Hiding the invoice and receipt as Cancelled does, which leaves the winner no record of what they paid |
| Q19 | Where does the refund amount sit on Winner Order? | An inline alert below Order Total with a positive amount, ArrowCounterClockwise icon and View. Order Summary stays the invoice lines alone. View opens a dialog that stacks Amount, Transfer to, Reference (bank only), Reason, and Note when the operator recorded one — each a label above its value. Proof, Stripe reference and audit number stay with the operator. An overpayment shows only the difference the same way. Transfer to follows Q20; Reference follows Q21; Note follows Q28 | A minus amount in Order Summary or under Payment method, with no detail dialog |
| Q20 | What refund transaction clues does the winner see? | Transfer to uses `PaymentMethodCard`. A card refund shows the brand logo and the last four digits. A bank refund shows the masked destination on the primary line and the free-text bank name as secondary text under it. The same layout is what a paid order shows on its payment method. Proof and the audit number stay with the operator; the provider reference is shown for a bank transfer alone, as revised in Q21. Details stay a label above each value, in the order settled in Q19 | A channel word alone; a one-line `Bank name, ···· ####` that wraps poorly when the operator types a long bank name; a longer account or card number |
| Q21 | How does a winner find the refund on their own statement? (revises Q20, 2026-09-22) | A bank transfer refund shows its reference in the refund details, the same one the operator already enters under Q11, so the winner can match the credit. A card refund shows no reference: a statement lists a card refund against the charge it reverses, and the Stripe refund id appears nowhere on it. Transfer to is unchanged, and the operator enters nothing new | Showing the reference for every method, including the Stripe refund id, which matches nothing on a card statement and invites a Customer Service contact; a second winner-facing reference the operator types beside the internal one; leaving every reference with the operator, which leaves a bank winner nothing to match |
| Q22 | What does a bank refund record about where the money went? | A channel — FPS, HK local bank transfer or SWIFT international wire — the bank name, and the destination: an account, an IBAN, or an FPS ID that may be a phone number, an email or an FPS id. The same three fields whichever channel sent it. All free text the operator types, and a card refund carries none of it | A 3-digit HK bank code picked from a maintained list, dropped because a list nobody maintains goes stale and a merger needs a deploy; a BIC directory filling the bank name and country, dropped as a new integration nobody owns |
| Q27 | Does a SWIFT wire record the BIC and the bank's country? | No (revises Q22, 2026-09-22). Grade10 records a wire the operator already sent from the banking portal, so it never needs enough to route one. Finance matches a statement on the reference, amount and date; a trace runs on the reference and the proof files; the winner sees neither field | Keeping both, dropped because no reader needs them and an unchecked field nobody reads is one a typo survives in; keeping the country alone for reporting on money sent abroad, dropped as a report nobody has asked for |
| Q23 | How much of the destination is stored? | The operator types it in full and Grade10 stores it in full, so finance can check which account was paid; the winner sees a mask | Storing only the mask the winner sees, which leaves nothing to verify and hides a typo |
| Q24 | Is any of it checked? | No. No BIC shape, no IBAN checksum, no digit count — what is typed is stored | Refusing a BIC that is not 8 or 11 characters and an IBAN whose check digits fail, dropped to keep the form quick for a small operations team |
| Q25 | How is the destination masked for the winner? | By what it looks like: digits show the last four, an email shows its first letter and domain (`j···@gmail.com`), a phone shows its last four digits | One last-four rule for every value, which reads as `···· .com` for an email |
| Q26 | Where do the amount and date come from? | The amount is offered at what the winner has paid and stays editable, as Q6 and Q9 have it. The date is the date the money left, typed by the operator, and never in the future | Both filled in by Grade10, which dates a refund recorded days later to the day of the form |
| Q28 | Is the note required? | No, optional on every reason, Other included. When the operator leaves none, Winner Order omits the Note row from refund details | Requiring it on Other, dropped because a refund is recorded after Customer Service has already spoken to the winner and the operator may have nothing to add; showing an empty Note row on the winner dialog |
| Q29 | What proof does a refund take? | 1 to 5 files, each a PDF, JPEG or PNG of at most 10 MB — the same as manual settlement | A refund-specific list, dropped because two proof rules on one order is two things to keep in step |
| Q30 | Does recording a refund confirm first? | Yes. A dialog restates the amount, the method and where it went, and the lot's outcome, and says this is the order's only refund and cannot be undone | A bare yes/no with nothing restated; retyping the amount to proceed, dropped as a cost on every refund for one kind of error |
| Q31 | Can the winner reveal the masked destination? | No. The destination is the only masked value on the page and nothing reveals it in full | A reveal control, dropped because the winner already knows the account and the mask exists for whoever else reads the page |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-admin/auction/post-sale` | Whether a refund on a partially paid order returns the whole paid amount or an operator-entered amount | Q9 |
