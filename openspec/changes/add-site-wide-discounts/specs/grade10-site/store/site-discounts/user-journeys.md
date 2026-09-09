## User journeys

### grade10-site-store-site-discounts-US-01: Collector buys a special-sale product at its advertised price

**As a** collector,
**I want** a product marked on sale to charge me its discounted price without needing a code, and to stay at that price rather than being cut further or padded back up by another promotion,
**so that** the advertised deal is the price I actually pay, plain and predictable.

**Accepted by:**

- `grade10-site-store-site-discounts-SC-01` — A special-sale product refuses a coupon on the same line
- `grade10-site-store-site-discounts-SC-02` — Points still redeem on a special-sale line
- `grade10-site-store-site-discounts-SC-05` — A special-sale product neither counts toward nor receives the order threshold cut

### grade10-site-store-site-discounts-US-02: Collector triggers a buy-more deal on top of other discounts

**As a** collector,
**I want** buying the trigger quantity of a promoted product to automatically discount or gift the reward item, without losing a coupon I already hold on it,
**so that** I get the full benefit of both without hunting for a second code.

**Accepted by:**

- `grade10-site-store-site-discounts-SC-03` — A coupon still applies to a buy-X-get-Y reward line

### grade10-site-store-site-discounts-US-03: Collector's order crosses a spend threshold for a storewide cut

**As a** collector,
**I want** my order total to drop automatically once my eligible spend clears a threshold, at the best tier I qualify for, alongside any points or coupons I already applied,
**so that** a bigger basket is rewarded without me applying a code myself.

**Accepted by:**

- `grade10-site-store-site-discounts-SC-04` — A basket gets the highest tier its spend clears
- `grade10-site-store-site-discounts-SC-06` — An order threshold discount combines with points and coupons on eligible lines

### grade10-site-store-site-discounts-US-04: Shop staff rings up the same discounts at the till

**As a** member of shop staff,
**I want** an active site discount to apply automatically when I ring up a sale,
**so that** a counter customer gets the same price as an online order, with no manual discount for me to remember or type in.

**Accepted by:**

- `grade10-site-store-site-discounts-SC-07` — A POS sale gets the same discounts as the same basket online
