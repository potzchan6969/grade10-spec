## User journeys

### grade10-site-store-discounts-US-01: Collector redeems a product coupon or a gift at checkout

**As a** collector,
**I want** a product coupon or a gift I hold to cut my order the moment I check out,
**so that** I get the reward I redeemed without needing a second code.

**Accepted by:**

- `grade10-site-store-discounts-SC-01` — A product coupon settles by its own Shopify Discount code
- `grade10-site-store-discounts-SC-02` — A gift settles by its own Shopify Discount code
- `grade10-site-store-discounts-SC-06` — Submitting the checkout mints the coupon's code
- `grade10-site-store-discounts-SC-08` — A reward coupon settles by its own Shopify Discount code

### grade10-site-store-discounts-US-02: Collector holding more than one eligible coupon picks which one to spend

**As a** collector,
**I want** to be asked which coupon to apply when my basket qualifies for more than one,
**so that** I choose the one I want rather than losing one to a silent rule.

**Accepted by:**

- `grade10-site-store-discounts-SC-03` — A checkout eligible for two coupons asks the collector to choose
- `grade10-site-store-discounts-SC-04` — A second discount code is refused, not stacked

### grade10-site-store-discounts-US-03: Shop staff spends a member's product coupon at the till

**As a** member of shop staff,
**I want** a member's product coupon to settle the same way at the till as it does online,
**so that** I can ring it up with the same confidence either channel gives me.

**Accepted by:**

- `grade10-site-store-discounts-SC-07` — A product coupon at the till settles by its own code
