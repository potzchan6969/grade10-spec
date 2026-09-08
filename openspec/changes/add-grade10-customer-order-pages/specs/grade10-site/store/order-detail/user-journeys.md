## User journeys

### grade10-site-store-order-detail-US-01: Collector inspects one owned order

**As a** signed-in collector,
**I want** one trustworthy account of my Store order,
**so that** I can understand its items, money, fulfilment, refund, and tracking.

**Accepted by:**

- `grade10-site-store-order-detail-SC-01` — An owner opens one order
- `grade10-site-store-order-detail-SC-02` — Missing and unowned orders look the same
- `grade10-site-store-order-detail-SC-04` — A web order keeps quoted and paid totals distinct
- `grade10-site-store-order-detail-SC-05` — A partial refund stays distinct from the charge
- `grade10-site-store-order-detail-SC-06` — A point-of-sale order does not invent web fields
- `grade10-site-store-order-detail-SC-07` — Unavailable optional facts are omitted
- `grade10-site-store-order-detail-SC-08` — An estimate is not a completed milestone
- `grade10-site-store-order-detail-SC-09` — A safe carrier URL enables the detail action
- `grade10-site-store-order-detail-SC-10` — Unsafe tracking data creates no action
- `grade10-site-store-order-detail-SC-11` — The first read is still loading
- `grade10-site-store-order-detail-SC-12` — A failed read can be retried
- `grade10-site-store-order-detail-SC-13` — Customer-facing identity does not replace the route id
- `grade10-site-store-order-detail-SC-14` — Supplied settlement rows preserve zero and absence
- `grade10-site-store-order-detail-SC-15` — A partial shipping address remains truthful
- `grade10-site-store-order-detail-SC-16` — Payment identity remains truthful

### grade10-site-store-order-detail-US-02: Collector signs in to the requested order

**As a** signed-out collector,
**I want** sign-in to keep the order address I opened,
**so that** I can continue to that order after proving my account.

**Accepted by:**

- `grade10-site-store-order-detail-SC-03` — A signed-out collector keeps the requested order address
