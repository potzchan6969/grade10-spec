## User journeys

### order-status-US-01: Collector reads where an order stands

**As a** collector with an order in progress,
**I want** one badge that tells me whether my order is being prepared, on its
way, finished, cancelled, or refunded,
**so that** I am never shown a blank status and never shown a status the surface
invented for a combination nobody defined.

**Accepted by:**

- `order-status-SC-01` — An unrecognised Shopify value is indeterminate
- `order-status-SC-02` — A cancelled order reports Canceled
- `order-status-SC-03` — A voided payment reports Canceled
- `order-status-SC-06` — A fulfilled and archived order reports Completed
- `order-status-SC-07` — A partially fulfilled order reports Shipped
- `order-status-SC-08` — Every remaining combination reports Processing

### order-status-US-02: Collector understands a refund or a hold

**As a** collector whose order was partly refunded or put on hold,
**I want** a note explaining what happened to the part of my order that changed,
**so that** I do not have to contact support to learn whether my items shipped.

**Accepted by:**

- `order-status-SC-04` — A refund outranks fulfilment progress
- `order-status-SC-05` — A held order carrying a partial refund stays Processing
- `order-status-SC-09` — A confirmed combination carries its note
- `order-status-SC-10` — An unconfirmed combination carries no note
- `order-status-SC-11` — The mapping emits no display copy

### order-status-US-03: Collector sees one answer everywhere

**As a** collector who checks an order in more than one place,
**I want** order history and order detail to agree,
**so that** I do not have to decide which surface is telling the truth.

**Accepted by:**

- `order-status-SC-12` — Completed does not assert delivery
- `order-status-SC-13` — Pickup is never emitted in this phase
- `order-status-SC-14` — Two surfaces report one order identically
