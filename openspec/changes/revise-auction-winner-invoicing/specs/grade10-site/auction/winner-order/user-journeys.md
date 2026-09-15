## User journeys

### winner-order-US-01: Winner settles a won lot

**As a** winner,
**I want** to tell Grade10 where to ship, then pay the invoice it sends me by card,
**so that** the lot I won becomes mine inside a deadline I can see, priced for where it is actually going.

**Accepted by:**

- `winner-order-SC-26` — A lot close asks for an address, not payment
- `winner-order-SC-07` — A pre-filled default still needs confirming
- `winner-order-SC-28` — Confirming an address readies the order for a quote
- `winner-order-SC-04` — An estimated total is marked as one
- `winner-order-SC-38` — Shipping & Handling of zero reads Free
- `winner-order-SC-39` — An invoice with no insurance shows no Insurance line
- `winner-order-SC-31` — The deadline is seven days from send
- `winner-order-SC-29` — A sent invoice refuses a self-service address change
- `winner-order-SC-35` — The winner is offered card payment only
- `winner-order-SC-12` — The winning hold is released and the invoice is a fresh charge
- `winner-order-SC-15` — A declined payment leaves the invoice payable
- `winner-order-SC-40` — Pending Payment highlights the Payment step
- `winner-order-SC-43` — A sent invoice offers its PDF

### winner-order-US-02: Winner follows a settled lot to delivery

**As a** winner who has paid,
**I want** a receipt that says how I paid, a tracker, and proof of what was handed over,
**so that** I can account for a high-value purchase without asking Grade10 for records.

**Accepted by:**

- `winner-order-SC-18` — A receipt is itemised and stays retrievable
- `winner-order-SC-36` — A card receipt names the card
- `winner-order-SC-19` — A manually settled receipt says so
- `winner-order-SC-20` — The tracker appears once the lot is dispatched
- `winner-order-SC-21` — Delivery proof records what the carrier provided
- `winner-order-SC-41` — Processing maps under Shipped

### winner-order-US-03: Winner misses the payment deadline

**As a** winner whose invoice deadline has passed unpaid,
**I want** clear Contact Us and no card Pay,
**so that** I know self-service payment has stopped and how to reach Grade10.

**Accepted by:**

- `winner-order-SC-37` — An expired invoice refuses card payment
- `winner-order-SC-42` — Cancelled hides the stepper
- `winner-order-SC-44` — No invoice PDF before send
- `winner-order-SC-45` — A cancelled order hides the invoice PDF
