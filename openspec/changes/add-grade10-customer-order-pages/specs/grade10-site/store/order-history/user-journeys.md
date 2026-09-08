## User journeys

### grade10-site-store-order-history-US-01: Collector reviews active and past orders

**As a** signed-in collector,
**I want** my newest active and past Store orders in one place,
**so that** I can understand an order and decide whether to open it.

**Accepted by:**

- `grade10-site-store-order-history-SC-01` — A signed-in collector opens Your Orders
- `grade10-site-store-order-history-SC-03` — Active and past orders are grouped newest first
- `grade10-site-store-order-history-SC-04` — The paid total takes precedence
- `grade10-site-store-order-history-SC-05` — A pending total is not invented
- `grade10-site-store-order-history-SC-06` — View Details opens one order
- `grade10-site-store-order-history-SC-07` — A safe carrier URL enables tracking
- `grade10-site-store-order-history-SC-08` — A tracking number alone stays text-only
- `grade10-site-store-order-history-SC-09` — The first read is still loading
- `grade10-site-store-order-history-SC-10` — A failed read can be retried
- `grade10-site-store-order-history-SC-12` — A shop order number identifies a summary
- `grade10-site-store-order-history-SC-13` — An older order falls back to its Store id

### grade10-site-store-order-history-US-02: Collector signs in to the intended order page

**As a** signed-out collector,
**I want** sign-in to keep the Your Orders address,
**so that** I arrive at the orders I asked to see after proving my account.

**Accepted by:**

- `grade10-site-store-order-history-SC-02` — A signed-out collector keeps the intended address

### grade10-site-store-order-history-US-03: Collector starts shopping from an empty account

**As a** signed-in collector with no Store orders,
**I want** an empty state that returns me to the Store,
**so that** I can begin a purchase instead of reaching a dead end.

**Accepted by:**

- `grade10-site-store-order-history-SC-11` — A collector with no orders returns to the Store
