## Feature set

- Writable primitives
  - Invoice status gains `payment_verifying`: the winner uploaded payment proof and an operator has not checked it
  - Stopped deadline: while proof is checked the deadline does not run, and the time left is kept
- Derived order status
  - Payment Verifying: its own name, read by the winner and the operator alike
  - Replaced invoices hold no status: the order's invoice status is always its current invoice's
