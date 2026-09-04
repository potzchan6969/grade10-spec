## User journeys

### post-sale-US-01: Operator resolves an unpaid order

**As an** operator,
**I want** to reissue, settle, or cancel an unpaid order from the order itself,
**so that** a lot whose winner did not pay stops being an open-ended obligation.

**Accepted by:**

- `grade10-admin-auction-post-sale-SC-23` — Reissue returns an expired order to Pending Payment
- `grade10-admin-auction-post-sale-SC-26` — Settlement cannot proceed without confirming the address
- `grade10-admin-auction-post-sale-SC-29` — Manual settlement is available before expiry
- `grade10-admin-auction-post-sale-SC-31` — Cancelling returns the lot to available
- `grade10-admin-auction-post-sale-SC-32` — No runner-up is offered the cancelled lot

### post-sale-US-02: Operator reconstructs an order's history

**As an** operator deciding whether to reinstate a buyer,
**I want** every invoice and fulfilment event on the order, including the
payments that failed,
**so that** I can tell a buyer who tried and could not from one who never engaged.

**Accepted by:**

- `grade10-admin-auction-post-sale-SC-34` — Failed payment attempts appear in the invoice history
- `grade10-admin-auction-post-sale-SC-36` — The address at dispatch survives a later edit
- `grade10-admin-auction-post-sale-SC-37` — The detail explains the status it derived
- `grade10-admin-auction-post-sale-SC-38` — A buyer's reissue history spans all their orders
