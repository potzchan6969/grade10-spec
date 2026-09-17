## ADDED Requirements

### Requirement: A site sale on a cart line shows as sale price with compare-at, never as a Store sale footer row

A site sale shows on the line it cuts, not as a row of its own in the footer.

**Line prices** - When the applied cart quote carries an automatic site sale
on a line, that line SHALL present the discounted unit price as `price` and
the pre-sale unit price as `originalPrice`.

**No footer row** - The drawer footer SHALL NOT render a separate summary row
whose only job is to name that site-sale cut (for example “Store sale”).

**Subtotal** - The Subtotal SHALL be the sum of the unit prices shown on the
lines (times quantity).

#### Scenario: shared-ui-store-cart-SC-26 - Site sale lines use compare-at and no Store sale footer row
**Serves:** shared-ui-store-cart-US-13 - Shopper reads a storewide sale on the cart lines

- **GIVEN** a cart whose quote applies a site sale on every line
- **WHEN** the drawer renders those lines and the summary
- **THEN** each eligible line shows the sale unit price and a struck
  compare-at, the Subtotal matches the sum of those line prices, and no
  footer row names the site sale alone

### Requirement: A stacked promo keeps site-sale lines and adds only the code in the footer

When the quote stacks an order-level promo code on a site sale, every
site-sale line SHALL keep its sale `price` and `originalPrice`, the Subtotal
SHALL remain the sum of those line prices, and `PromoState` SHALL be
`applied` with that code and its discount amount. The footer SHALL NOT also
name the site sale as its own summary row.

#### Scenario: shared-ui-store-cart-SC-27 - Stacked code appears only as footer Discount on post-sale lines
**Serves:** shared-ui-store-cart-US-14 - Shopper stacks a promo on the store sale

- **GIVEN** a cart with a site sale on its lines and a promo code that stacks
- **WHEN** the drawer shows the applied code
- **THEN** the lines still show sale price and compare-at, the footer shows
  `Discount (<code>)` with the code's cut, and no Store sale footer row
  appears

### Requirement: A refused promo leaves the site sale in place and names the refusal

A refused code changes nothing on the lines, and the shopper reads why it was
refused.

**Lines and totals** - When the quote refuses a promo code against a site
sale, every site-sale line SHALL keep its sale presentation, totals SHALL stay
on the site sale, and `PromoState` SHALL NOT be `applied` for that code.

**Refusal message** - The promo sheet SHALL show the refusal message.

**Held promo** - A held promo marked not applicable SHALL render muted without
an Apply control.

#### Scenario: shared-ui-store-cart-SC-28 - Refused code leaves sale lines and shows an error
**Serves:** shared-ui-store-cart-US-15 - Shopper is refused a promo against the store sale

- **GIVEN** a cart with a site sale on its lines
- **WHEN** the shopper applies a promo code the quote refuses
- **THEN** the lines and Subtotal stay on the site sale, no `Discount
  (<code>)` row appears, and the promo sheet shows the refusal

#### Scenario: shared-ui-store-cart-SC-29 - An inapplicable held promo has no Apply control
**Serves:** shared-ui-store-cart-US-15 - Shopper is refused a promo against the store sale

- **GIVEN** a held promo the quote marks not applicable for this cart
- **WHEN** the promo sheet lists that code
- **THEN** the ticket is muted, shows why it cannot apply, and offers no
  Apply control

### Requirement: A replacing promo lifts the line sale and shows only the code in the footer

When the quote replaces a site sale with an order-level promo code, every
formerly site-sale line SHALL show the list unit price as `price` with no
`originalPrice`, the Subtotal SHALL be the sum of those list line prices,
and `PromoState` SHALL be `applied` with that code and its discount amount.

#### Scenario: shared-ui-store-cart-SC-30 - Replacing code uses list line prices and footer Discount only
**Serves:** shared-ui-store-cart-US-16 - Shopper's promo replaces the store sale

- **GIVEN** a cart whose quote replaced a site sale with a promo code
- **WHEN** the drawer renders
- **THEN** the lines show list unit prices without compare-at, the footer
  shows `Discount (<code>)`, and no Store sale footer row appears

### Requirement: Removing a promo restores the site sale on the lines when it still applies

When the shopper removes an applied promo code and the quote still carries
the site sale, every eligible line SHALL return to sale `price` with
`originalPrice`, the Subtotal SHALL return to the post-sale line sum, and
`PromoState` SHALL leave `applied`.

#### Scenario: shared-ui-store-cart-SC-31 - Removing a replacing or stacked code restores site-sale lines
**Serves:** shared-ui-store-cart-US-17 - Shopper removes a promo and the store sale returns

- **GIVEN** a cart showing an applied promo that stacked on or replaced a
  site sale, and the site sale is still active
- **WHEN** the shopper removes that promo
- **THEN** the lines show sale price and compare-at again, the Subtotal
  matches those line prices, and the footer no longer shows that code's
  Discount row
