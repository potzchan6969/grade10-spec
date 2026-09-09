## Purpose

Site discounts are admin-configured cuts — a product on sale, a buy-X-get-Y
offer, or a spend threshold off the whole order — that auto-apply to every
basket on the site and at the till, without depending on Shopify's own
Discounts feature, which never reaches a draft order.

## Feature set

- Three discount types
  - Product special sale: a cut off one or more chosen products, exclusive
    of every other site discount and coupon on that line
  - Buy X get Y: a reward product discounted or free after a trigger
    purchase, combines with everything
  - Order threshold: a spend-based percentage off the whole order, on a
    tier ladder
- Exclusivity
  - What a product special sale blocks, and what it never blocks — a
    member's points always redeem regardless
- Threshold tiers
  - One active order threshold promotion at a time; a basket gets
    whichever tier its spend clears
- Two channels
  - The same discounts auto-apply on the online checkout and at the POS
    till

## ADDED Requirements

### Requirement: A product special sale cuts one or more chosen products, and blocks every other site discount or coupon on that line

A product special sale SHALL hold the fields below.

| Field | Type | Notes |
| --- | --- | --- |
| Products | one or more product/variant references | the lines it applies to |
| Cut | percentage or fixed amount | fixed amount is an integer count of minor units plus an ISO 4217 currency code |
| Window | start instant, optional end instant | absent end never expires on its own |
| State | `scheduled` \| `active` \| `ended` | derived from the window, never set directly |

While active, no coupon and no other site discount SHALL also cut a line
carrying a product special sale. A member's points redemption is exempt
from this exclusion and SHALL always be available on the line regardless.

#### Scenario: grade10-site-store-site-discounts-SC-01 - A special-sale product refuses a coupon on the same line

- **GIVEN** a product carrying an active special sale
- **WHEN** a coupon that targets the same product is applied to the basket
- **THEN** the coupon is refused on that line

#### Scenario: grade10-site-store-site-discounts-SC-02 - Points still redeem on a special-sale line

- **GIVEN** a product carrying an active special sale
- **WHEN** a member redeems points on the basket
- **THEN** the points discount applies to that line the same as any other

### Requirement: A buy-X-get-Y discount combines with every other discount

A buy-X-get-Y discount SHALL hold the fields below.

| Field | Type | Notes |
| --- | --- | --- |
| Trigger | product/variant reference, quantity | what a basket must carry to qualify |
| Reward | product/variant reference, quantity | what the discount cuts |
| Reward cut | free, or a percentage | never a fixed amount |
| Window | start instant, optional end instant | absent end never expires on its own |
| State | `scheduled` \| `active` \| `ended` | derived from the window |

Unlike a product special sale, a buy-X-get-Y discount SHALL NOT block a
coupon, another site discount, or a points redemption from also applying
to its reward line.

#### Scenario: grade10-site-store-site-discounts-SC-03 - A coupon still applies to a buy-X-get-Y reward line

- **GIVEN** a basket qualifying for an active buy-X-get-Y discount
- **WHEN** a coupon that targets the reward product is applied
- **THEN** both the buy-X-get-Y cut and the coupon apply to that line

### Requirement: An order threshold discount is a tier ladder, and exactly one is active at a time

An order threshold discount SHALL hold one or more tiers, each pairing a
minimum spend (an integer count of minor units plus an ISO 4217 currency
code) with a percentage off the whole order. At most one order threshold
discount SHALL be active at a time.

| Field | Type | Notes |
| --- | --- | --- |
| Tiers | ordered list of (minimum spend, percentage) | at least one tier |
| Window | start instant, optional end instant | absent end never expires on its own |
| State | `scheduled` \| `active` \| `ended` | derived from the window |

#### Scenario: grade10-site-store-site-discounts-SC-04 - A basket gets the highest tier its spend clears

- **GIVEN** an active order threshold discount with tiers at two spend levels
- **WHEN** a basket's eligible spend clears the higher tier's minimum
- **THEN** the higher tier's percentage applies, not the lower one

### Requirement: An order threshold discount's base and cut both exclude a special-sale line

The spend an order threshold discount is measured against, and the cut it
takes, SHALL exclude any line carrying an active product special sale.
Every other line — including a buy-X-get-Y reward line, a coupon line, and
any line a points redemption also touches — SHALL count toward the
threshold and receive its cut normally.

#### Scenario: grade10-site-store-site-discounts-SC-05 - A special-sale product neither counts toward nor receives the order threshold cut

- **GIVEN** a basket holding a special-sale product and other eligible goods together clearing an order threshold tier
- **WHEN** the threshold spend and cut are computed
- **THEN** the special-sale product's price is excluded from both, and the cut applies only to the other goods

#### Scenario: grade10-site-store-site-discounts-SC-06 - An order threshold discount combines with points and coupons on eligible lines

- **GIVEN** a basket clearing an order threshold tier, with a coupon applied and points redeemed on its eligible lines
- **WHEN** the basket is priced
- **THEN** the order threshold cut, the coupon, and the points discount all apply together on those lines

### Requirement: All three discount types auto-apply on both the online checkout and the POS till

Every active product special sale, buy-X-get-Y discount, and order
threshold discount SHALL evaluate and apply automatically on every online
checkout basket and every POS sale, with no admin action needed on an
individual order.

#### Scenario: grade10-site-store-site-discounts-SC-07 - A POS sale gets the same discounts as the same basket online

- **GIVEN** an active product special sale on a product
- **WHEN** that product is sold at the POS till
- **THEN** the special sale applies exactly as it would on the online checkout
