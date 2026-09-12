## User journeys

### shared-ui-store-cart-US-02: Shopper reviews what the cart holds

**As a** shopper,
**I want** the drawer to show my items on a five-row baseline, with a count
that ignores sold-out items and an edge fade when there are more,
**so that** I can see what I am buying without the drawer changing shape as
the cart fills.

**Accepted by:**

- `shared-ui-store-cart-SC-02` — Fewer than 5 items
- `shared-ui-store-cart-SC-03` — 5 or more items
- `shared-ui-store-cart-SC-04` — Empty cart
- `shared-ui-store-cart-SC-05` — Sold out item present
- `shared-ui-store-cart-SC-07` — Overflowing items hint scrollability

### shared-ui-store-cart-US-03: Shopper opens the cart on current prices

**As a** shopper,
**I want** the drawer to read fresh product status and pricing when it opens,
showing skeletons while that read is in flight,
**so that** I decide against the current prices rather than stale ones.

**Accepted by:**

- `shared-ui-store-cart-SC-08` — Cart opened in loading state

### shared-ui-store-cart-US-04: Shopper dismisses the cart drawer

**As a** shopper,
**I want** to close the drawer from its close button, the backdrop, or the
Escape key, with the page behind it held still,
**so that** I can leave the cart without losing my place on the page beneath
it.

**Accepted by:**

- `shared-ui-store-cart-SC-06` — Backdrop tap or Escape key

### shared-ui-store-cart-US-05: Shopper proceeds from the cart to checkout

**As a** shopper,
**I want** the checkout button to show it is redirecting while the
application creates the session,
**so that** I know the checkout is under way, and see the button return to
its label if it fails.

**Accepted by:**

- `shared-ui-store-cart-SC-09` — Shopper proceeds to checkout

### shared-ui-store-cart-US-06: Shopper opens a cart that held a delisted product

**As a** shopper,
**I want** a product that left the catalogue to disappear after the drawer
finishes loading, with one toast,
**so that** I am not shown a sold-out row for something the store no longer
sells.

**Accepted by:**

- `shared-ui-store-cart-SC-10` — Delisted items clear after loading with one toast
- `shared-ui-store-cart-SC-11` — No unavailable items means no removal toast
- `shared-ui-store-cart-SC-12` — Status values are the four named states
- `shared-ui-store-cart-SC-13` — Drawer copy carries the unavailable-removal toast message

### shared-ui-store-cart-US-07: Shopper edits a low-stock line and the warning quiets

**As a** shopper,
**I want** the low-stock warning to hide after I change that line's quantity,
**so that** it does not keep shouting after I have acted, and it returns if the line is adjusted again.

**Accepted by:**

- `shared-ui-store-cart-SC-14` — Adjusted line shows the low-stock warning
- `shared-ui-store-cart-SC-15` — Quantity change hides the warning
- `shared-ui-store-cart-SC-16` — New adjusted status shows the warning again

### shared-ui-store-cart-US-08: Shopper raises a line to the last unit the shop has

**As a** shopper,
**I want** a line's stepper to stop where the shop runs out, and the line to
say how many are left,
**so that** I am not still raising a number the checkout will quietly put back
down.

**Accepted by:**

- `shared-ui-store-cart-SC-17` — The stepper stops at the maximum
- `shared-ui-store-cart-SC-18` — No maximum supplied
- `shared-ui-store-cart-SC-19` — Decrement still works at the maximum
- `shared-ui-store-cart-SC-20` — A remaining count is displayed as supplied
- `shared-ui-store-cart-SC-21` — No remaining count supplied
