## User journeys

### store-cart-US-06: Shopper opens a cart that held a delisted product

**As a** shopper,
**I want** a product that left the catalogue to disappear after the drawer finishes loading, with one toast,
**so that** I am not shown a sold-out row for something the store no longer sells.

**Accepted by:**

- `store-cart-SC-01` — An application imports the cart drawer
- `store-cart-SC-10` — Delisted items clear after loading with one toast
- `store-cart-SC-11` — No unavailable items means no removal toast
- `store-cart-SC-12` — Status values are the four named states
- `store-cart-SC-13` — Drawer copy carries the unavailable-removal toast message
