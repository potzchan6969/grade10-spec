## Goals

- A winner's invoice and receipt show a billing address beside the delivery
  address
- The winner gives the billing address once, at order setup, before the
  invoice is priced
- A winner who bills to the delivery address does nothing extra

## Non-Goals

- Passing the billing address to the card provider, pre-filling the card form
  or checking a card against it
- A tax ID or VAT number on the Bill To block — the tax change
- A separate billing address book, or a second cap
- The winner changing the billing address after confirming
- Changing a receipt already issued
- Store checkout's billing address
- ZZZ

## Decisions

Rounds held on 2026-09-17 with @jeffffej0909.

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | When does the winner give the billing address? | At order setup, with the delivery address and payment method, inside the same 48 hours (recommended) | At payment — the invoice PDF is already sent then, so it would need a reissue or print no billing address |
| Q2 | How does the form ask for it? | Same as delivery address, ticked by default; unticking opens a second address with the same required fields (recommended) | Unticked by default; or a separate billing step with no shortcut |
| Q3 | Where can a separate billing address come from? | The same address book — a saved address or a one-time one (recommended) | One-time only; or a separate billing book with its own cap |
| Q4 | What do the invoice and receipt show? | Bill To and Ship To, from the order's snapshot; a receipt shows the invoice's addresses (recommended) | Bill To only |
| Q5 | Can the winner change the billing address after confirming? | No. It follows the delivery address: an operator edits it with a reason before send, and reissues after; a receipt already issued never changes (recommended) | The winner editing it until send, which reverses the lock from `add-winner-bank-transfer` for one field |
| Q6 | What does an order with no billing address do at send — one confirmed before this change, or recorded by phone? | Send is refused and names the missing billing address; the operator adds it with the edit before send, and the phone record asks for it with same as delivery ticked | Printing the delivery address as Bill To, which the interview recommended so no order is held; the author chose the block so no invoice carries a billing address nobody gave |
| Q7 | Does the billing address touch card payment? | No — it exists for the invoice and receipt only (recommended) | Passing it to the card provider to pre-fill and check the card |
| Q8 | How does this sit beside `add-my-auction-orders`, which says the form offers no billing address? | A new change that reverses that line, BREAKING against it, and archives after it and `add-winner-bank-transfer` (recommended) | Folding it into `add-my-auction-orders`, which is already being built |
| Q9 | What does the Bill To block carry? | The address form's fields: name, company name, phone and address (recommended) | Adding a tax ID or VAT number |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
