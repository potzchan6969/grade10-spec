## Goals

- A winner whose order was refunded sees it as Refunded on Winner Order
- An operator records a refund, sent by hand, on the auction order it belongs to, and the order reads Refunded
- Finance can reconcile every auction refund from Grade10: amount, reason, method, reference, proof, audit number, who recorded it and when
- The lot's stock follows the refund: back to stock, or kept by the winner

## Non-Goals

- Refunding money from Grade10 itself, through the Stripe refund API or a bank connection
- A refund request, approval step or pending state in Grade10; the winner's request stays with Customer Service
- More than one refund on an order, or undoing a refund once recorded
- A refund letter or any winner-facing refund copy beyond the Refunded status
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
| Q7 | What does the winner receive? | No letter; the order page reads Refunded | A refund letter with the amount and method (recommended, declined) |
| Q9 | A free amount conflicts with "full refund only". How do they fit? | One refund, amount above zero and at most what was paid, partial payments included; the order ends Refunded and a second refund is refused (recommended) | Several refunds per order, reading Refunded only once everything is back |
| Q10 | Does a refund carry a reference number? | Yes, the next number in the gapless internal audit series, seen by operators only (recommended) | Matching by order and provider reference alone |
| Q11 | What must the operator enter? | Reason category (Damaged, Not as described, Not received, Duplicate or overpayment, Other) and a note, the method, the Stripe or bank reference, and 1 to 5 proof files | Proof files optional |
| Q12 | How does finance find refunds? | A Refunded filter on the queue, and the refund on the order detail and invoice log (recommended) | A refund CSV export for a date range |
| Q13 | Is the winner's request recorded in Grade10? | No; Customer Service handles it in its own channel, and the refund note says what was asked (recommended) | A "Refund requested" mark before the refund, which adds a state to the status chain |
| Q14 | How does the lot go back to stock? | The operator chooses when recording: back to stock, or the winner keeps it; the choice is fixed with the refund (recommended) | A separate "Mark returned" step later |
| Q15 | Can a Shipped order be refunded? | Yes; the shipment record stays as it is (recommended) | Refused until Delivered |
| Q16 | Does a refund affect bidder standing? | No (recommended) | Some reasons count as a strike |
| Q17 | Which roles hold `auction:refund`? | `staff` and `admin`; `finance` reads refunds but cannot record one (recommended) | `finance` as well; nobody by default |
| Q18 | What does Winner Order show for a refunded order? | Refunded as the order and invoice status, however much was paid and wherever the card is; no stepper, Pay or address form; the invoice and receipts already issued stay downloadable (recommended) | Hiding the invoice and receipt as Cancelled does, which leaves the winner no record of what they paid |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
