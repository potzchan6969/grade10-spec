## User journeys

### post-sale-US-01: Operator resolves an unpaid order

**As an** operator,
**I want** to reissue, settle, or cancel an unpaid order from the order itself,
**so that** a lot whose winner did not pay stops being an open-ended obligation.

**Accepted by:**

- `post-sale-SC-30` — Reissue returns an expired order to Pending Payment
- `post-sale-SC-33` — Manual settlement requires an address confirmation
- `post-sale-SC-36` — Manual settlement is available before expiry
- `post-sale-SC-38` — Cancelling returns the lot to available
- `post-sale-SC-39` — No runner-up is offered the cancelled lot

### post-sale-US-02: Operator reconstructs an order's history

**As an** operator deciding whether to reinstate a buyer,
**I want** every invoice and fulfilment event on the order, including the
payments that failed,
**so that** I can tell a buyer who tried and could not from one who never engaged.

**Accepted by:**

- `post-sale-SC-41` — Failed payment attempts appear in the invoice history
- `post-sale-SC-43` — The address at dispatch survives a later edit
- `post-sale-SC-19` — The detail explains the status it derived
- `post-sale-SC-20` — A buyer's reissue history spans all their orders
