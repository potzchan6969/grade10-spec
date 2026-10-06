## Goals

- Close winner address writes after the address window and make an unconfirmed
  missed deadline read Setup Overdue.
- Give operators a controlled, auditable way to reopen or record an address.
- Keep payment expiry and late payment outcomes explicit and operator-led.

## Non-Goals

- Changing the 48-hour address window or the seven-day payment window
- Sending a letter when an operator reopens the address form
- Reopening an address after the invoice has been sent
- Automatic cancellation or suspension after a missed deadline

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which write closes after the address deadline? | Confirming a delivery address on the order; the account address book remains writable. A confirmed address already locks on confirm, so this change adds no winner change control | Giving the winner a way to change a confirmed address after the deadline |
| Q2 | Who can restore the order address flow? | An operator with payment-processing can reopen an unconfirmed Setup Overdue order with a mandatory reason; a reopen gives a fresh 48 hours and may be repeated | Letting the winner extend the window |
| Q3 | Can an operator record an address without reopening? | Yes, only on an unconfirmed Setup Overdue order with invoice status `not_issued`; the recorded address is confirmed while the winner's window stays closed. It is refused after confirmation, invoice send, cancellation requested or cancellation | Requiring a reopen for every phone-provided address |
| Q4 | How does a missed address deadline read? | No operator action directly writes a status. `address_window_open` is derived from the persisted address deadline and current invoice/order facts and gates writes only; the order-status derivation reads `address_deadline_passed`. An unconfirmed elapsed window derives Setup Overdue; a confirmed address derives Preparing Invoice. A reopen returns the unconfirmed order to Awaiting Setup through its new facts. The payment Overdue timer starts only when the invoice is sent and visible to the winner. | Keeping every missed deadline as Awaiting Setup |
| Q5 | What happens after invoice send? | The address is locked; reopen is refused and the operator uses the existing re-quote and reissue flow | Unlocking the sent invoice |
| Q6 | Which clock decides a late address write? | The time Grade10 receives the write, measured from the actual lot close after extended bidding | The browser submission time |
| Q7 | Does reopening notify the winner? | No; the operator tells the winner directly | A new notification letter |
| Q8 | How is a card payment near the deadline treated? | A payment received before the deadline remains valid even if confirmation follows later, and the invoice stays `pending` until it lands, never written `expired` while an in-time payment is in flight; one received at or after the deadline is refused and not charged | Judging only by when the winner opened or submitted the payment page |
| Q10 | Which change owns the operator's reopen-setup and record-setup actions? | `complete-auction-post-sale`, which already holds the Reopen setup primary action, the grant and the log entries on the order page. This change depends on it and keeps the persisted address deadline and `address_window_open` | Keeping a second "An operator reopens the address form" requirement here, which two in-flight changes may not both add |
| Q9 | Does Preparing Invoice derive Setup Overdue? | No. Setup Overdue applies only to an unconfirmed elapsed address window. Preparing Invoice has a confirmed address; its payment Overdue timer starts only when the invoice is sent and visible to the winner. | Applying Setup Overdue to an order waiting for invoice preparation |
| Q11 | In what order is this change accepted? | After `complete-auction-post-sale`, which is already in `depends_on` and itself waits for its dependencies to archive | Accepting before the reopen and record-setup owner |
| Q12 | How does the in-flight card payment reach the durable contract? | Winner Order's "The payment deadline is fixed when the invoice is sent" is MODIFIED here. Order Status's "An auction order carries two writable status fields" and "Permitted transitions" (`pending` to `expired`) are modified by `complete-auction-post-sale`, so tasks.md carries a follow-up to MODIFY them after it archives | Modifying them here, which the overlap rule refuses |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-admin/auction/post-sale` | Whether Setup Overdue also applies to Preparing Invoice | Q9 |
| `grade10-admin/auction/post-sale` | Who owns the operator reopen-setup and record-setup actions | Q10 |
