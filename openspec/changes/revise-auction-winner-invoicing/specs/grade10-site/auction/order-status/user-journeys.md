## User journeys

### auction-status-US-01: Expired invoice keeps Pending Payment without winner card pay

**As a** winner or operator,
**I want** an expired invoice to stay Pending Payment without winner card pay,
**so that** the deadline ends self-service settlement while operators can still resolve the order.

**Accepted by:**

- `auction-status-SC-06` — The same order past its deadline is Expired
- `auction-status-SC-25` — An expired invoice refuses winner card payment

**Also walked by:** winner-order and post-sale journeys for the shared derivation, including the two states before an invoice is sent.
