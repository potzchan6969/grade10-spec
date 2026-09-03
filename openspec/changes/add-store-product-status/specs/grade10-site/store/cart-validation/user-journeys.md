## User journeys

### cart-validation-US-01: Collector opens the cart and learns what moved

**As a** collector,
**I want** the cart to tell me, as it opens, which lines sold out, shrank, left
the store, or changed price,
**so that** I fix my cart before I try to pay rather than being refused at
checkout for something the store already knew.

**Accepted by:**

- `cart-validation-SC-01` — The cart is opened
- `cart-validation-SC-03` — A read is still in flight
- `cart-validation-SC-04` — A browse cache is not the answer
- `cart-validation-SC-05` — More was in the cart than remains
- `cart-validation-SC-06` — The line sold out entirely
- `cart-validation-SC-07` — A line is never grown
- `cart-validation-SC-08` — A line that is still fillable
- `cart-validation-SC-09` — The product was withdrawn from sale
- `cart-validation-SC-10` — Sold out and withdrawn are told apart
- `cart-validation-SC-11` — A price rose while the line sat in the cart
- `cart-validation-SC-12` — A price fell while the line sat in the cart
- `cart-validation-SC-13` — A disclosed price is the line's price

### cart-validation-US-02: Collector offers the cart for checkout

**As a** collector,
**I want** the store to check every line once more as I check out and to name
every line that moved,
**so that** I reach the shop's payment page only with a cart it can fill, and
when I cannot, I know exactly what to fix.

**Accepted by:**

- `cart-validation-SC-02` — Checkout is requested
- `cart-validation-SC-14` — A supplied price decides nothing
- `cart-validation-SC-15` — One line blocks the handoff
- `cart-validation-SC-16` — Every contradicted line is named at once
- `cart-validation-SC-17` — The collector proceeds after resolving
- `cart-validation-SC-18` — An earlier read does not carry a checkout

### cart-validation-US-03: Collector meets the shop's own refusal

**As a** collector,
**I want** a refusal from the shop, or a check the store could not finish, told
to me with the line named,
**so that** a cart that passed the store's read and still failed is mine to
resolve, not a dead end.

**Accepted by:**

- `cart-validation-SC-19` — The shop refuses what the store had confirmed
- `cart-validation-SC-20` — The shop would fill a line short
- `cart-validation-SC-21` — The read cannot be completed
