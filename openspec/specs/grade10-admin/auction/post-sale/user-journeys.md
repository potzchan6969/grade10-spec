## User journeys

### post-sale-US-01: Operator works the listing queue by outcome

**As an** auction operator,
**I want** each listing labelled with one outcome I can filter, with rows that need me highlighted,
**so that** I work awaiting wire without mixing it with a Stripe capture.

**Accepted by:**

- `post-sale-SC-01` — A listing inside the last hour is Ending soon
- `post-sale-SC-02` — Stripe capture and manual collection are different outcomes
- `post-sale-SC-03` — An operator works only listings awaiting wire
- `post-sale-SC-04` — Awaiting wire is highlighted as needing action

### post-sale-US-02: Operator closes out a won listing

**As an** auction operator,
**I want** the listing's winner, payment, shipment, and trail on one detail,
**so that** I can contact the winner without Stripe identifiers and leave a comment next to a capture.

**Accepted by:**

- `post-sale-SC-05` — Operator closes out a won listing
- `post-sale-SC-06` — Operator opens a won listing
- `post-sale-SC-07` — Stripe paid and an operator comment share the trail
- `post-sale-SC-08` — Winner email is the contact without Stripe identifiers

### post-sale-US-03: Operator collects payment

**As a** payment operator,
**I want** a wire to release the card hold, a capture to mark Paid via Stripe, and a manual record to mark Paid via Manual,
**so that** a second paid attempt is refused and staff without the grant cannot collect.

**Accepted by:**

- `post-sale-SC-09` — Wire request releases the card hold
- `post-sale-SC-10` — Stripe capture marks the listing Paid via Stripe
- `post-sale-SC-11` — Manual collection marks Paid via Manual and releases the hold
- `post-sale-SC-12` — A second paid attempt is refused
- `post-sale-SC-13` — Staff cannot record payment

### post-sale-US-04: Operator records in-house shipment

**As a** shipment operator,
**I want** shipment to follow paid, then started, then completed,
**so that** finance cannot ship, publishing does not need the shipment grant, and recording an address does not ship.

**Accepted by:**

- `post-sale-SC-14` — Shipment follows paid, then started, then completed
- `post-sale-SC-15` — Shipment cannot skip ahead
- `post-sale-SC-16` — Finance cannot record shipment
- `post-sale-SC-17` — Publishing a listing does not need the shipment grant
- `post-sale-SC-18` — Recording an address does not ship the listing
