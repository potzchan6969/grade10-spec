## User journeys

### post-sale-US-01: Operator resolves an unpaid order

**As an** operator,
**I want** to see how long an unpaid order has waited, and settle, reissue, or cancel it from the order itself,
**so that** a lot whose winner has not paid stops being an open-ended obligation.

**Accepted by:**

- `grade10-admin-auction-post-sale-SC-45` — An order waiting on an address shows time since close
- `grade10-admin-auction-post-sale-SC-46` — An order idle 72 hours is marked Overdue
- `grade10-admin-auction-post-sale-SC-54` — An overdue order waiting on an address can be cancelled
- `grade10-admin-auction-post-sale-SC-55` — A bank transfer with a slip settles the order
- `grade10-admin-auction-post-sale-SC-56` — Settlement without proof is refused
- `grade10-admin-auction-post-sale-SC-60` — Manual settlement is available before expiry
- `grade10-admin-auction-post-sale-SC-23` — Reissue returns an expired order to Pending Payment

### post-sale-US-05: Operator quotes and sends a winner's invoice

**As an** operator,
**I want** to price Shipping & Handling, and Insurance when the card needs it, for the address the winner confirmed, then send the invoice,
**so that** the winner pays an amount fixed for where the card is actually going.

**Accepted by:**

- `grade10-admin-auction-post-sale-SC-44` — An order ready for a quote needs action
- `grade10-admin-auction-post-sale-SC-48` — Sending the invoice opens the payment window
- `grade10-admin-auction-post-sale-SC-63` — An invoice sends without insurance
- `grade10-admin-auction-post-sale-SC-64` — Insurance added at zero is refused
- `grade10-admin-auction-post-sale-SC-49` — No invoice is sent without a confirmed address
- `grade10-admin-auction-post-sale-SC-51` — A re-quote keeps the deadline when the operator says so
- `grade10-admin-auction-post-sale-SC-52` — A re-quote resets the deadline when the operator says so
