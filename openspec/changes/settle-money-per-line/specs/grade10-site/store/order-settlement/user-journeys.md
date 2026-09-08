## User journeys

### grade10-site-store-order-settlement-US-01: Collector returns part of an order and keeps the rest

**As a** collector who paid partly with points,
**I want** a return to claw back only what the goods I sent back earned,
**so that** keeping something my points never bought costs me nothing.

**Accepted by:**

- `grade10-site-store-order-settlement-SC-03` — Returning goods that never earned reverses nothing
- `grade10-site-store-order-settlement-SC-04` — A split return claws back what one refund would

### grade10-site-store-order-settlement-US-03: Collector returns a sale their points paid part of

**As a** collector who paid partly with points,
**I want** my points back when I give the sale back,
**so that** returning what I bought leaves me where I started.

**Accepted by:**

- `grade10-site-store-order-settlement-SC-11` — A sale still holding a gift card returns no tender
- `grade10-site-store-order-settlement-SC-12` — Every good back returns the whole tender
- `grade10-site-store-order-settlement-SC-13` — A refund of the delivery alone claws back nothing
- `grade10-site-store-order-settlement-SC-14` — A sale paid back in full whose goods stop short is reported

### grade10-site-store-order-settlement-US-02: Shopkeeper takes a coupon's cut off before tender

**As a** shopkeeper selling at the till through the Shopify app,
**I want** a coupon I removed from the sale to stay the member's,
**so that** they do not lose it for a discount nobody gave them.

**Accepted by:**

- `grade10-site-store-order-settlement-SC-06` — A coupon whose cut is gone is not spent

