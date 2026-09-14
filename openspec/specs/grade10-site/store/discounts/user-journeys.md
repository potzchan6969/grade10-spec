## User journeys

### grade10-site-store-discounts-US-01: Collector redeems a coupon at checkout

**As a** collector,
**I want** a coupon I hold to cut my order the moment I check out,
**so that** I get the reward I redeemed without needing a second code.

**Accepted by:**

- `grade10-site-store-discounts-SC-01` — A product coupon settles by its own Shopify Discount code
- `grade10-site-store-discounts-SC-02` — A gift settles by its own Shopify Discount code
- `grade10-site-store-discounts-SC-05` — Editing the cart does not mint a coupon's code
- `grade10-site-store-discounts-SC-06` — An order claiming the coupon mints its code
- `grade10-site-store-discounts-SC-08` — A reward coupon settles by its own Shopify Discount code
- `grade10-site-store-discounts-SC-09` — A facet-scoped coupon cuts only the lines its facet reaches

### grade10-site-store-discounts-US-02: Collector holding more than one eligible coupon picks which one to spend

**As a** collector,
**I want** to be asked which coupon to apply when my basket qualifies for more than one,
**so that** I choose the one I want rather than losing one to a silent rule.

**Accepted by:**

- `grade10-site-store-discounts-SC-03` — A checkout eligible for two coupons asks the collector to choose
- `grade10-site-store-discounts-SC-04` — A second discount code is refused, not stacked

### grade10-site-store-discounts-US-03: Collector keeps the coupon when a checkout cannot take it

**As a** collector,
**I want** a coupon back in my wallet whenever the checkout it was meant for does not complete,
**so that** a refusal or an abandoned order never costs me what I redeemed.

**Accepted by:**

- `grade10-site-store-discounts-SC-10` — An unavailable catalogue refuses the coupon rather than guessing
- `grade10-site-store-discounts-SC-11` — A refused mint refuses the checkout and keeps the coupon
- `grade10-site-store-discounts-SC-12` — A member with no paired Shopify customer is refused
- `grade10-site-store-discounts-SC-13` — A dead order's unspent code is deactivated
- `grade10-site-store-discounts-SC-15` — A site discount that beats the coupon keeps the sale

### grade10-site-store-discounts-US-04: Shop staff spends a member's product coupon at the till

**As a** member of shop staff,
**I want** a member's product coupon to settle the same way at the till as it does online,
**so that** I can ring it up with the same confidence either channel gives me.

**Accepted by:**

- `grade10-site-store-discounts-SC-07` — A product coupon at the till settles by its own code
- `grade10-site-store-discounts-SC-14` — A re-planned sale never carries two codes for one coupon
- `grade10-site-store-discounts-SC-17` — A coupon cleared off a sale cannot go back on it
- `grade10-site-store-discounts-SC-18` — A code the sale never honoured stops standing
