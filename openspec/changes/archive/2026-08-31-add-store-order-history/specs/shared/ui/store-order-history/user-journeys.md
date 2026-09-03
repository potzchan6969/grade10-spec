## User journeys

### store-order-history-US-01: Collector reviews active and past orders

**As a** signed-in collector,
**I want** my active and past orders on one page, with status, lines, and track
when a shipment is underway,
**so that** I can follow a live order or reopen an older one without the
surface inventing which orders belong where.

**Accepted by:**

- `store-order-history-SC-01` — Active and Past both render when non-empty
- `store-order-history-SC-02` — An empty section is omitted
- `store-order-history-SC-03` — Track Order appears only when enabled
- `store-order-history-SC-04` — Card lists supplied line items
- `store-order-history-SC-06` — An application imports the surface
- `store-order-history-SC-07` — A part is reused alone
- `store-order-history-SC-08` — Each status renders its label
- `store-order-history-SC-09` — Line item displays supplied fields
- `store-order-history-SC-10` — Track Order is hidden when disabled

### store-order-history-US-02: Collector starts shopping when there are no orders

**As a** signed-in collector with no orders,
**I want** an empty state that sends me to the store,
**so that** I know where my first order will appear and can browse.

**Accepted by:**

- `store-order-history-SC-05` — Zero orders shows empty state
