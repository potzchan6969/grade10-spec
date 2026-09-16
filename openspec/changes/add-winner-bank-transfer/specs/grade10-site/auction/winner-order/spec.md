## Purpose
What a winner is sent after a lot closes and what they do with it: one order
per lot, a delivery address and a payment method they choose, an operator's
invoice priced for both, payment by card or by a bank transfer they prove,
and the receipt, tracker and delivery proof the order keeps afterwards.

## Feature set

- Payment method
  - Chosen with the address: card or bank transfer, recorded when the winner confirms where to ship
  - Fee range at the choice: fixed text Grade10 sets, with no amount for bank transfer
  - Offered by currency: bank transfer only where bank details are set up
- Invoice
  - Fee priced by method: Payment Processing Fee is the card gross-up or the operator's bank transfer fee, never dropped
  - Invoice reference: every invoice carries one, and it still finds the order after a reissue
  - Replaced invoice: an invoice a reissue replaced says so and names its replacement
- Bank transfer
  - Three ways to pay: SWIFT, FPS and Hong Kong local bank transfer details, with the invoice reference to quote
  - Payment proof: one upload of 1 to 5 files, behind a confirm step
  - Payment Verifying: the deadline stops, card Pay and further uploads are hidden
  - Proof not accepted: the reason the winner reads, and the deadline running again with the time that was left
- Records the winner keeps
  - Receipt number: every receipt has one
