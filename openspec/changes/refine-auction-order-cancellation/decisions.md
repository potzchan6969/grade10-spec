## Goals

- A winner whose order was cancelled understands it from Winner Order and knows how to reach Grade10
- An operator knows what a cancel sets off before confirming it
- Every cancellation carries a reason category that can be counted and filtered
- A card payment that lands after a cancel is caught and returned, never lost

## Non-Goals

- Grade10 cancelling an order on its own when a deadline passes
- Offering a cancelled lot to the second-highest bidder
- Telling other bidders or watchers that an order was cancelled
- Cancelling an order once a payment that counts toward the balance is recorded; that order is refunded
- A winner cancelling their own order
- Showing the winner why the order was cancelled
- Undoing a cancel, or a late payment reviving the order
- Relisting a cancelled lot automatically
- Lifting a suspension as part of a cancel
- Refunding a Paid after cancel payment from Grade10
- Store (Shopify) order cancellation

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which cancelled-order workflow? | Auction orders | Store orders, or one rule shared by both |
| Q2 | What does a winner see on a cancelled Winner Order? | `Cancelled on {date}`, the lot and winning bid, Contact Us only, no reason (recommended) | A winner-facing reason, which reverses the letter's no-reason rule; the badge alone |
| Q3 | How does the operator give the reason? | A required category (Non-payment, Missed setup, Winner asked, Lot issue, Other) and a note (recommended) | Free text only, which cannot be counted |
| Q4 | Can a winner cancel? | No, operator only; the winner uses Contact Us (recommended) | Self-cancel before the invoice is sent, which lets a binding bid be walked away from |
| Q5 | Can a cancel lift a suspension? | Never; reinstatement stays a separate review (recommended) | Lifting it when the reason is Lot issue, which reverses operator-review-only |
| Q6 | How does a card payment interact with cancellation? | After cancel, the order stays Cancelled, the payment is recorded and the order flagged Paid after cancel. Before cancel, only money that counts toward the balance blocks it; money that counts toward nothing does not (recommended) | The payment reviving the order, which clashes with a relisted lot; any recorded payment blocking cancel, even when it counts toward nothing |
| Q7 | What does the confirmation show? | The consequences — back to stock, no runner-up, winner emailed, suspension stays, cannot be undone — and the required reason (recommended) | The reason field alone |
| Q8 | Can a cancel be undone? | No, it is terminal (recommended) | A short undo window before the letter, which delays the letter and reverses terminal |
| Q9 | What happens to the lot? | Back to stock; the order links to it and the operator relists by hand (recommended) | A Relist now step in the dialog, which reaches into the listing flow |
| Q10 | How is a Paid after cancel payment returned? | Finance returns it outside Grade10; any operator with `auction:payment` clears the flag with a reason and records Finance's return reference when available (recommended) | Requiring a reference for every return, which could keep a returned payment flagged when Finance has none; widening the Refund action in `add-winner-refund` to cancelled orders |
| Q11 | How is success measured? | Cancellations each month by category, and winner contacts per 100 cancellations, with a category filter on the queue (recommended) | Category counts only; no measurement |
| Q12 | What is left out? | Auto-cancel, runner-up offers, telling other bidders, cancelling a paid order | Any of them in scope |
| Q13 | Can an operator cancel an order that has been paid? | No. Money that counts toward the balance refuses the cancel; that order is refunded instead, so the cancelled letter names no payment. The page line is `Cancelling a paid order` in `docs/prds/products/grade10-site/auction/post-bidding.md` (recommended) | Cancelling a paid order and naming a refund in the letter, which leaves money with no order to return it against |
| Q14 | How is the Paid after cancel flag cleared? | Each late payment after cancellation carries its own flag. Anyone with `auction:payment` clears it with a written reason and an optional return reference; Grade10 records the actor and time. This change owns the rule, and `complete-auction-post-sale` points at it (planning owner) | One flag per order cleared once for every payment; requiring a return reference; leaving the rule to `complete-auction-post-sale` |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-admin/auction/post-sale` | Who clears a Paid-after-cancel flag, and whether that action can revive the order | Q14 |
