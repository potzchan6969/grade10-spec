## Context user journeys

### post-sale-US-08: Operator reconstructs an order's history

**As an** operator deciding whether to reinstate a buyer,
**I want** every invoice and fulfilment log entry on the order, including the
payments that failed,
**so that** I can tell a buyer who tried and could not from one who never engaged.

### post-sale-US-01: Operator works the listing queue by outcome

**As an** auction operator,
**I want** each listing labelled with one outcome I can filter, with rows that need me highlighted,
**so that** I work awaiting wire without mixing it with a Stripe capture.

## ADDED User journeys

### post-sale-US-09: Operator records a refund a winner asked Customer Service for

**As an** operator with refund processing,
**I want** to record the refund I sent in Stripe or by bank transfer on the order, with its amount, reason, reference and proof, and say whether the lot goes back to stock,
**so that** a closing refund reads Refunded, an overpayment keeps the order's status, and the lot's stock matches where the card is.

### post-sale-US-10: Finance reconciles auction refunds

**As a** finance operator,
**I want** to read each refund's amount, method, reference, reason, audit number, and who recorded it and when, filtering a closing refund as Refunded,
**so that** every refund in Stripe or the bank matches one record in Grade10.

## MODIFIED User journeys

## REMOVED User journeys
