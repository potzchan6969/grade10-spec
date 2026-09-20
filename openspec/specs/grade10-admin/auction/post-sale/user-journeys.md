## User journeys

### post-sale-US-01: Operator works the listing queue by outcome

**As an** auction operator,
**I want** each listing labelled with one outcome I can filter, with rows that need me highlighted,
**so that** I work awaiting wire without mixing it with a Stripe capture.

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
**I want** to price Shipping & Handling, and Insurance when the card needs it, for the address the winner confirmed, then send the invoice,
**so that** the winner pays an amount fixed for where the card is actually going.

### post-sale-US-02: Operator closes out a won listing

**As an** auction operator,
**I want** the listing's winner, payment, shipment, and trail on one detail,
**so that** I can contact the winner without Stripe identifiers and leave a comment next to a capture.

### post-sale-US-03: Operator collects payment

**As a** payment operator,
**I want** a wire to release the card hold, a capture to mark Paid via Stripe, and a manual record to mark Paid via Manual,
**so that** a second paid attempt is refused and staff without the grant cannot collect.

### post-sale-US-04: Operator records in-house shipment

**As a** shipment operator,
**I want** shipment to follow paid, then started, then completed,
**so that** finance cannot ship, publishing does not need the shipment grant, and recording an address does not ship.

### post-sale-US-06: Operator sees which lots are still in extended bidding

**As an** auction operator,
**I want** the queue to label a lot still taking bids past its scheduled close,
**so that** I can tell a lot running long from one that closed on time.

### post-sale-US-11: Operator adds a missing billing address before sending

**As an** operator,
**I want** to add the billing address to an order that has none before I send its invoice,
**so that** no invoice goes out without a billing address the winner gave.

### post-sale-US-10: Operator checks a winner's payment proof

**As a** payment operator,
**I want** to see the proof a winner uploaded against the invoice, then confirm the payment or return the invoice with a reason,
**so that** money I can match settles the order, and a winner whose proof I cannot match knows why and keeps the time they had.
