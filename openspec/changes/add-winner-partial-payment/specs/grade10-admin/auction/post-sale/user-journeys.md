## Context user journeys

### post-sale-US-03: Operator collects payment

**As a** payment operator,
**I want** a wire to release the card hold, a capture to mark Paid via Stripe, and a manual record to mark Paid via Manual,
**so that** a second paid attempt is refused and staff without the grant cannot collect.

### post-sale-US-07: Operator resolves an unpaid order

**As an** operator,
**I want** to see how long an unpaid order has waited, and settle, reissue, or cancel it from the order itself,
**so that** a lot whose winner has not paid stops being an open-ended obligation.

## ADDED User journeys

### post-sale-US-12: Operator collects a lot's price across more than one payment

**As a** payment operator working an invoice a winner cannot pay in one go,
**I want** to record each payment as it arrives, smaller than the balance owed, and see the order until it is settled,
**so that** every partial payment ends up correctly recorded without me tracking the balance outside Grade10.

## MODIFIED User journeys

## REMOVED User journeys
