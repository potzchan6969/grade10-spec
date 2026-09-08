## User journeys

### grade10-site-store-cart-drawer-US-01: Collector opens the current cart over the Store

**As a** collector,
**I want** my current cart to open over the Store with current facts,
**so that** I can review what the shop can sell without losing my place.

**Accepted by:**

- `grade10-site-store-cart-drawer-SC-01` — Cart opens without leaving its surface
- `grade10-site-store-cart-drawer-SC-02` — Closing preserves the current address
- `grade10-site-store-cart-drawer-SC-03` — A signed-out collector sees the guest cart
- `grade10-site-store-cart-drawer-SC-04` — A signed-in collector sees the member cart
- `grade10-site-store-cart-drawer-SC-05` — Every open starts a current read
- `grade10-site-store-cart-drawer-SC-06` — A read in flight remains unresolved
- `grade10-site-store-cart-drawer-SC-07` — A failed read tells the collector once
- `grade10-site-store-cart-drawer-SC-08` — Reopening retries a failed read
- `grade10-site-store-cart-drawer-SC-09` — A successful read fills the reviewed summary
- `grade10-site-store-cart-drawer-SC-10` — Unsupported adjustments remain neutral

### grade10-site-store-cart-drawer-US-02: Collector edits the reviewed cart

**As a** collector,
**I want** to change or remove lines after the shop checks them,
**so that** the cart I continue with contains what I intend to buy.

**Accepted by:**

- `grade10-site-store-cart-drawer-SC-11` — A collector edits the opened cart
- `grade10-site-store-cart-drawer-SC-12` — Delisted lines leave once

### grade10-site-store-cart-drawer-US-03: Collector continues from the cart drawer

**As a** collector,
**I want** the cart to take me to a product, more browsing, or checkout,
**so that** I can continue the shopping path I chose.

**Accepted by:**

- `grade10-site-store-cart-drawer-SC-13` — A line opens its product
- `grade10-site-store-cart-drawer-SC-14` — Browse More opens the catalogue
- `grade10-site-store-cart-drawer-SC-15` — Checkout uses the existing surface
