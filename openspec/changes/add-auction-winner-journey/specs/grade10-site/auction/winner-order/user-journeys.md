## User journeys

### winner-order-US-01: Winner settles a won lot

**As a** winner,
**I want** to be told what I owe and to pay it without waiting for someone to call me,
**so that** the lot I won becomes mine on my own schedule inside a deadline I can see.

**Accepted by:**

- `winner-order-SC-01` — An invoice is issued at lot close
- `winner-order-SC-02` — A winner with no default address cannot yet pay
- `winner-order-SC-22` — An account keeps multiple shipping addresses
- `winner-order-SC-23` — The account has one optional default
- `winner-order-SC-24` — Editing a saved address does not rewrite an order
- `winner-order-SC-25` — A selected address cannot be archived silently
- `winner-order-SC-07` — A pre-filled default still needs confirming
- `winner-order-SC-09` — An amendment shows the total delta before payment
- `winner-order-SC-12` — The winning hold is released and the invoice is a fresh charge
- `winner-order-SC-15` — A declined payment leaves the invoice payable
- `winner-order-SC-16` — The deadline is seven days from lot close

### winner-order-US-02: Winner follows a settled lot to delivery

**As a** winner who has paid,
**I want** a receipt, a tracker, and proof of what was handed over,
**so that** I can account for a high-value purchase without asking Grade10 for records.

**Accepted by:**

- `winner-order-SC-18` — A receipt is itemised and stays retrievable
- `winner-order-SC-20` — The tracker appears once the lot is dispatched
- `winner-order-SC-21` — Delivery proof records what the carrier provided
