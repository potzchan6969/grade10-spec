## Goals

- A winner whose order was cancelled understands it from Winner Order and knows how to reach Grade10
- An operator knows what a cancel sets off before confirming it
- Every cancellation carries a reason category that can be counted and filtered
- A card payment that lands after a cancel is caught and returned, never lost

## Non-Goals

- Grade10 cancelling an order on its own when a deadline passes
- Offering a cancelled lot to the second-highest bidder
- Telling other bidders or watchers that an order was cancelled
- Cancelling an order once any payment is recorded; that order is refunded
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
| Q6 | A card payment lands after the cancel. What happens? | The order stays Cancelled, the payment is recorded and the order flagged Paid after cancel (recommended) | The payment reviving the order, which clashes with a relisted lot; refusing a cancel during a payment attempt, which still leaves later money unanswered |
| Q7 | What does the confirmation show? | The consequences — back to stock, no runner-up, winner emailed, suspension stays, cannot be undone — and the required reason (recommended) | The reason field alone |
| Q8 | Can a cancel be undone? | No, it is terminal (recommended) | A short undo window before the letter, which delays the letter and reverses terminal |
| Q9 | What happens to the lot? | Back to stock; the order links to it and the operator relists by hand (recommended) | A Relist now step in the dialog, which reaches into the listing flow |
| Q10 | How is a Paid after cancel payment returned? | Finance returns it outside Grade10; the operator clears the flag (recommended) | Widening the Refund action in `add-winner-refund` to cancelled orders, for a rare case |
| Q11 | How is success measured? | Cancellations each month by category, and winner contacts per 100 cancellations, with a category filter on the queue (recommended) | Category counts only; no measurement |
| Q12 | What is left out? | Auto-cancel, runner-up offers, telling other bidders, cancelling a paid order | Any of them in scope |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
