## User journeys

### post-sale-US-01: Operator works the orders worklist by segment

**As an** auction operator,
**I want** every won lot's order in one worklist, split into segments with counts and searchable by any of its codes or the winner's email,
**so that** I open what needs me first without scanning orders that are waiting on the winner.

### post-sale-US-08: Operator reconstructs an order's history

**As an** operator deciding whether to reinstate a buyer,
**I want** every invoice and fulfilment log entry on the order, including the
payments that failed,
**so that** I can tell a buyer who tried and could not from one who never engaged.

### post-sale-US-07: Operator resolves an unpaid order

**As an** operator,
**I want** to see how long an unpaid order has waited, and settle, reissue, or cancel it from the order itself,
**so that** a lot whose winner has not paid stops being an open-ended obligation.

### post-sale-US-05: Operator quotes and sends a winner's invoice

**As an** operator,
**I want** to price Shipping & Handling, and Insurance and Tax when the lot needs them, for the address the winner confirmed, then send the invoice,
**so that** the winner pays an amount fixed for where the card is actually going.

### post-sale-US-02: Operator works one order from its own page

**As an** auction operator,
**I want** each order on its own page, leading with its status, the rule behind it and the one thing to do next, with its whole history on one timeline,
**so that** I act on an order, or hand it to a colleague by its link, without piecing it together from several screens.

### post-sale-US-03: Operator collects payment

**As a** payment operator,
**I want** every payment that reaches an order recorded, and one the invoice did not expect flagged for me,
**so that** no money a winner sends is dropped, and I know what to check or have finance return.

### post-sale-US-04: Operator records in-house shipment

**As a** shipment operator,
**I want** to record dispatch with the carrier and the tracking number, then delivery with the carrier's proof, on the order,
**so that** the winner can follow the lot, and only someone allowed to ship records a shipment.

### post-sale-US-06: Operator sees which lots are still in extended bidding

**As an** auction operator,
**I want** the Listings table to mark a lot still taking bids past its scheduled close,
**so that** I can tell a lot running long from one that closed on time.

### post-sale-US-11: Operator adds a missing billing address before sending

**As an** operator,
**I want** to add the billing address to an order that has none before I send its invoice,
**so that** no invoice goes out without a billing address the winner gave.

### post-sale-US-10: Operator checks a winner's payment proof

**As a** payment operator,
**I want** to see the proof a winner uploaded against the invoice, then confirm the payment or return the invoice with a reason,
**so that** money I can match settles the order, and a winner whose proof I cannot match knows why and keeps the time they had.

### post-sale-US-16: Operator records a refund a winner asked Customer Service for

**As an** operator with refund processing,
**I want** to record the refund I sent in Stripe or by bank transfer on the order, with its amount, reason, reference and proof, and say whether the lot goes back to stock,
**so that** a closing refund reads Refunded, an overpayment keeps the order's status, and the lot's stock matches where the card is.

### post-sale-US-17: Finance reconciles auction refunds

**As a** finance operator,
**I want** to read each refund's amount, method, reference, reason, audit number, and who recorded it and when, filtering a closing refund as Refunded,
**so that** every refund in Stripe or the bank matches one record in Grade10.

### post-sale-US-15: Operator filters Setup Overdue and Payment Overdue

**As an** operator,
**I want** Setup Overdue and Payment Overdue as queue outcomes,
**so that** I find deadline-missed orders the same way the winner's Status names them.

### post-sale-US-13: Operator cancels an order knowing what follows

**As an** operator with payment processing,
**I want** to pick why I am cancelling and see what the cancel sets off before I confirm, then reach the lot to relist it,
**so that** I never cancel by surprise and every cancellation can be counted by reason.

### post-sale-US-14: Operator returns money paid after a cancel

**As an** operator,
**I want** a cancelled order that received a card payment afterwards to be flagged until I clear it with a reason,
**so that** no winner is left paying for a lot they no longer have.

### post-sale-US-12: Operator collects a lot's price across more than one payment

**As a** payment operator working an invoice a winner cannot pay in one go,
**I want** to record each payment as it arrives, smaller than the balance owed, and see the order until it is settled,
**so that** every partial payment ends up correctly recorded without me tracking the balance outside Grade10.

### post-sale-US-19: Operator settles an expired invoice

**As an** operator,
**I want** an expired invoice settled only in the admin portal, and a card payment started in time to count,
**so that** a winner who paid just before the deadline is never expired, and one who paid after it is never charged.

### post-sale-US-18: Operator reopens the address form

**As an** operator,
**I want** to give a winner who missed the 48-hour address deadline a fresh 48 hours, with my reason on the record,
**so that** a winner who got in touch can finish the order without me cancelling the lot.
