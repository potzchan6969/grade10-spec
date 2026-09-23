## Goals

- Close winner address writes after the address window while preserving the
  order's existing status.
- Give operators a controlled, auditable way to reopen or record an address.
- Keep payment expiry and late payment outcomes explicit and operator-led.

## Non-Goals

- Changing the 48-hour address window or the seven-day payment window
- Adding a new order status for a missed address deadline
- Sending a letter when an operator reopens the address form
- Reopening an address after the invoice has been sent
- Automatic cancellation or suspension after a missed deadline

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which write closes after the address deadline? | Both confirming a new address and changing an address already confirmed on the order; the account address book remains writable | Closing only the first confirmation |
| Q2 | Who can restore the order address flow? | An operator with payment-processing, using a mandatory reason; a reopen gives a fresh 48 hours and may be repeated | Letting the winner extend the window |
| Q3 | Can an operator record an address without reopening? | Yes; the recorded address is confirmed while the winner's window stays closed | Requiring a reopen for every phone-provided address |
| Q4 | Does a reopen change the order status? | No operator action directly writes a status. `address_window_open` is derived from the persisted address deadline and current invoice/order facts; the derived status follows those facts and remains Awaiting Setup or Preparing Invoice. The queue Overdue mark follows the settled 48-hour address deadline for Awaiting Setup only. Preparing Invoice has no queue Overdue mark; its payment Overdue timer starts only when the invoice is sent and visible to the winner. | Adding an Address Overdue status |
| Q5 | What happens after invoice send? | The address is locked; reopen is refused and the operator uses the existing re-quote and reissue flow | Unlocking the sent invoice |
| Q6 | Which clock decides a late address write? | The time Grade10 receives the write, measured from the actual lot close after extended bidding | The browser submission time |
| Q7 | Does reopening notify the winner? | No; the operator tells the winner directly | A new notification letter |
| Q8 | How is a card payment near the deadline treated? | A payment received before the deadline remains valid even if confirmation follows later; one received at or after the deadline is refused and not charged | Judging only by when the winner opened or submitted the payment page |
| Q9 | Does the queue Overdue mark apply while Preparing Invoice? | No. The 48-hour queue mark applies only to Awaiting Setup. Preparing Invoice has no queue Overdue mark; its payment Overdue timer starts only when the invoice is sent and visible to the winner. | Applying the address mark to an order waiting for invoice preparation |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-admin/auction/post-sale` | Whether the 48-hour queue Overdue mark also applies to Preparing Invoice, or applies only to Awaiting Setup | Q9 |
