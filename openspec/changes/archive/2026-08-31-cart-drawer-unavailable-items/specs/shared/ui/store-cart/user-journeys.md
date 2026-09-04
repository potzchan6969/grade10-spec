## User journeys

### shared-ui-store-cart-US-06: Shopper opens a cart that held a delisted product

**As a** shopper,
**I want** a product that left the catalogue to disappear after the drawer finishes loading, with one toast,
**so that** I am not shown a sold-out row for something the store no longer sells.

**Accepted by:**

- `shared-ui-store-cart-SC-01` — An application imports the cart drawer
- `shared-ui-store-cart-SC-10` — Delisted items clear after loading with one toast
- `shared-ui-store-cart-SC-11` — No unavailable items means no removal toast
- `shared-ui-store-cart-SC-12` — Status values are the four named states
- `shared-ui-store-cart-SC-13` — Drawer copy carries the unavailable-removal toast message
