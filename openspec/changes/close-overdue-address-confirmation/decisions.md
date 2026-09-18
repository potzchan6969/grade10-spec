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
| Q4 | Does a reopen change the order status? | No; `address_window_open` gates the winner's write and the derived status remains Awaiting Setup or Preparing Invoice | Adding an Address Overdue status |
| Q5 | What happens after invoice send? | The address is locked; reopen is refused and the operator uses the existing re-quote and reissue flow | Unlocking the sent invoice |
| Q6 | Which clock decides a late address write? | The time Grade10 receives the write, measured from the actual lot close after extended bidding | The browser submission time |
| Q7 | Does reopening notify the winner? | No; the operator tells the winner directly | A new notification letter |
| Q8 | How is a card payment near the deadline treated? | A payment received before the deadline remains valid even if confirmation follows later; one received at or after the deadline is refused and not charged | Judging only by when the winner opened or submitted the payment page |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-admin/auction/post-sale` | Whether the queue's Overdue mark follows the 48-hour address deadline or remains the 72-hour idle mark; the derived mark belongs to the overdue-status change | `add-auction-overdue-order-status` owns the derived overdue label; the durable Post-Sale Queue page keeps the product ❓ until that change settles it |
