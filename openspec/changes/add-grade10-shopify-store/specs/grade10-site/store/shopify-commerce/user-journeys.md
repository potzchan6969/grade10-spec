## User journeys

### grade10-site-store-shopify-commerce-US-01: Shopper browses the live Shopify catalogue

**As a** shopper,
**I want** the store catalogue to show current Shopify products and availability,
**so that** a product change is not served from a stale cache, and an outage does not invent a price.

**Accepted by:**

- `grade10-site-store-shopify-commerce-SC-01` — A shopper browses a current Shopify catalogue
- `grade10-site-store-shopify-commerce-SC-02` — A Shopify product change invalidates browsing data
- `grade10-site-store-shopify-commerce-SC-03` — Shopify catalogue data is unavailable

### grade10-site-store-shopify-commerce-US-02: Shopper checks out on live price and stock

**As a** shopper,
**I want** checkout to use live price and inventory, with nothing held for me,
**so that** an unavailable variant cannot enter, a retry is one handoff, and an item that sold out before I paid is named.

**Accepted by:**

- `grade10-site-store-shopify-commerce-SC-06` — An unavailable variant cannot enter checkout
- `grade10-site-store-shopify-commerce-SC-07` — Checkout uses live Shopify price and inventory
- `grade10-site-store-shopify-commerce-SC-08` — A retry returns one checkout handoff
- `grade10-site-store-shopify-commerce-SC-10` — An item that sold out before payment is named
- `grade10-site-store-shopify-commerce-SC-11` — Backorders are refused
- `grade10-site-store-shopify-commerce-SC-12` — A checkout URL is safe to follow

### grade10-site-store-shopify-commerce-US-03: Shopper checks out as a member and finds the order after

**As a** shopper,
**I want** to check out on the account I am signed in to and come back to the store once I have paid,
**so that** I am not duplicated and the order is in my account when I look.

**Accepted by:**

- `grade10-site-store-shopify-commerce-SC-04` — A shopper checks out signed in
- `grade10-site-store-shopify-commerce-SC-05` — A guest receives a linked Grade10 account after payment
- `grade10-site-store-shopify-commerce-SC-19` — A paid buyer returns to the store
- `grade10-site-store-shopify-commerce-SC-23` — Integration configuration is incomplete

### grade10-site-store-shopify-commerce-US-04: Customer reads their own orders

**As a** signed-in customer,
**I want** to list my orders and open one by its permanent URL,
**so that** I cannot read another customer's order, and payment is shown apart from shipping.

**Accepted by:**

- `grade10-site-store-shopify-commerce-SC-13` — A paid order reports payment separately from shipping
- `grade10-site-store-shopify-commerce-SC-14` — A partially fulfilled order shows every shipment
- `grade10-site-store-shopify-commerce-SC-15` — Only carrier confirmation reports delivery
- `grade10-site-store-shopify-commerce-SC-20` — A customer cannot read another customer's order
- `grade10-site-store-shopify-commerce-SC-21` — A permanent order URL requires its account
- `grade10-site-store-shopify-commerce-SC-22` — An account lists its orders
- `grade10-site-store-shopify-commerce-SC-25` — A customer cannot start a dispute or refund request

### grade10-site-store-shopify-commerce-US-05: Staff refund is reflected without a customer-started dispute

**As a** staff operator,
**I want** a refund I take in Shopify to show on the Grade10 order,
**so that** a duplicate or invalid webhook cannot rewrite it, and a miss is repaired.

**Accepted by:**

- `grade10-site-store-shopify-commerce-SC-16` — An invalid webhook changes nothing
- `grade10-site-store-shopify-commerce-SC-17` — A duplicate webhook is harmless
- `grade10-site-store-shopify-commerce-SC-18` — A missed webhook is repaired
- `grade10-site-store-shopify-commerce-SC-24` — A staff refund is reflected in payment status
