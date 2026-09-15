## User journeys

### winner-order-US-03: Winner confirms where a won lot ships

**As a** winner
**I want** to fill in and confirm a delivery address on the order
**so that** Grade10 can quote shipping to the right place.

**Accepted by:**
- `winner-order-SC-41` — The page shows its four sections
- `winner-order-SC-43` — Each status step carries its time
- `winner-order-SC-45` — An order preparing its invoice offers no payment
- `winner-order-SC-46` — An empty required field is refused
- `winner-order-SC-47` — Optional fields may stay empty
- `winner-order-SC-48` — Any phone number is accepted

### winner-order-US-04: Winner pays an invoice by card

**As a** winner
**I want** to see the full invoice and pay it by card, even if a first attempt does not finish
**so that** the lot moves to Processing without contacting Grade10.

**Accepted by:**
- `winner-order-SC-42` — Invoice Status replaces Paid Status
- `winner-order-SC-44` — An unpaid order shows the invoice and Pay Now
- `winner-order-SC-49` — A timed-out payment session stays payable
- `winner-order-SC-50` — Pay Now after an unfinished session starts fresh
- `winner-order-SC-51` — A completed session confirms before reading Processing
- `winner-order-SC-52` — A recorded payment reads Processing
