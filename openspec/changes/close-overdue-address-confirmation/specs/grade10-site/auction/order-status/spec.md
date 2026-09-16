## Feature set

- Writable primitives
  - Invoice status gains `not_issued`: an order exists from lot close, before any invoice has been sent
  - Invoice status gains `expired`: Grade10 writes it when the deadline passes unpaid, so expiry is a recorded fact rather than a time read
- Supplementary conditions
  - Address confirmed replaces deadline elapsed: the derivation reads whether the winner has confirmed an address; the deadline is carried by the invoice status
  - Address window open: a third condition, read from the order's own facts, which gates what the winner may write rather than what the order reads as
- Derived order status
  - Awaiting Address and Preparing Invoice: the two states before an invoice, shared by winner and operator alike
  - A closed window keeps its status: an order whose address window has closed still reads Awaiting Address or Preparing Invoice
  - No Expired order status: an order whose invoice has expired still reads Pending Payment; winner card pay stops; operator reissue, manual settlement, or cancel remain
- Guards
  - No dispatch and no send out of order: an order with no invoice cannot ship, and no invoice is sent without a confirmed address
  - No address on a closed window: the winner's write is refused until an operator reopens the entrance
