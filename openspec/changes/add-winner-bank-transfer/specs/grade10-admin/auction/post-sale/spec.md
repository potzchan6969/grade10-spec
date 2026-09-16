## Feature set

- Queue
  - Payment Verifying: a row waiting on proof shows the outcome and needs action
- Quote and send
  - Payment method on the quote: the winner's choice decides how the fee is priced
  - Bank transfer fee: entered on every bank transfer invoice, zero or more, with no cap
- Checking proof
  - Confirm: settles the invoice with the winner's files, and the operator's own if added
  - Return to pending: an external and an internal reason, the time left shown, and not offered once expired
- Resolving an unpaid order
  - One Reissue action: address, payment method, bank transfer fee, shipping, insurance and deadline, always with a reason
  - Card invoice paid by transfer: reissued as bank transfer, then settled
  - Operator settlement: proof required, and straight to paid
- Audit trail
  - What a reissue changed: the log names each changed part
