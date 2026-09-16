## Context user journeys

### post-sale-US-01: Operator works the listing queue by outcome

**As an** auction operator,
**I want** each listing labelled with one outcome I can filter, with rows that need me highlighted,
**so that** I work awaiting wire without mixing it with a Stripe capture.

### post-sale-US-07: Operator resolves an unpaid order

**As an** operator,
**I want** to reissue, settle, or cancel an unpaid order from the order itself,
**so that** a lot whose winner did not pay stops being an open-ended obligation.

### post-sale-US-08: Operator reconstructs an order's history

**As an** operator deciding whether to reinstate a buyer,
**I want** every invoice and fulfilment log entry on the order, including the
payments that failed,
**so that** I can tell a buyer who tried and could not from one who never engaged.

## ADDED User journeys

### post-sale-US-10: Operator checks a winner's payment proof

**As a** payment operator,
**I want** to see the proof a winner uploaded against the invoice, then confirm the payment or return the invoice with a reason,
**so that** money I can match settles the order, and a winner whose proof I cannot match knows why and keeps the time they had.
